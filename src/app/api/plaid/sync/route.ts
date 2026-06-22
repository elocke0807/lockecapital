import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { plaidClient } from "@/lib/plaid";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data: items, error: itemsError } = await supabase
    .from("plaid_items")
    .select("*")
    .eq("user_id", userId);

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });
  if (!items || items.length === 0) return NextResponse.json({ synced: 0 });

  let synced = 0;

  for (const item of items) {
    try {
      const accountsRes = await plaidClient.accountsGet({ access_token: item.access_token });

      for (const acct of accountsRes.data.accounts) {
        const type = acct.type === "investment" ? "investment" : acct.type === "depository" ? "cash" : "other";
        const balance = acct.balances.current ?? acct.balances.available ?? 0;

        const { data: existing } = await supabase
          .from("accounts")
          .select("id")
          .eq("user_id", userId)
          .eq("plaid_account_id", acct.account_id)
          .maybeSingle();

        if (existing) {
          await supabase.from("accounts").update({ balance }).eq("id", existing.id);
        } else {
          await supabase.from("accounts").insert({
            user_id: userId,
            name: acct.name,
            type,
            balance,
            plaid_account_id: acct.account_id,
            plaid_item_id: item.item_id,
          });
        }
        synced++;
      }

      try {
        const holdingsRes = await plaidClient.investmentsHoldingsGet({ access_token: item.access_token });
        const securitiesById = new Map(holdingsRes.data.securities.map((s) => [s.security_id, s]));

        for (const h of holdingsRes.data.holdings) {
          const security = securitiesById.get(h.security_id);
          const ticker = security?.ticker_symbol ?? security?.name ?? "UNKNOWN";
          const name = security?.name ?? ticker;

          const { data: existing } = await supabase
            .from("holdings")
            .select("id")
            .eq("user_id", userId)
            .eq("plaid_account_id", h.account_id)
            .eq("ticker", ticker)
            .maybeSingle();

          const price = h.institution_price ?? 0;
          const shares = h.quantity ?? 0;

          if (existing) {
            await supabase.from("holdings").update({ shares, price }).eq("id", existing.id);
          } else {
            await supabase.from("holdings").insert({
              user_id: userId,
              ticker,
              name,
              shares,
              price,
              plaid_account_id: h.account_id,
              plaid_item_id: item.item_id,
            });
          }
        }
      } catch {
        // institution has no investments product enabled; skip holdings sync
      }
    } catch (err) {
      console.error("Plaid sync error for item", item.item_id, err);
    }
  }

  return NextResponse.json({ synced });
}
