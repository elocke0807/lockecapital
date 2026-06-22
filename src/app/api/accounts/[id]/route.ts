import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { plaidClient } from "@/lib/plaid";
import { decryptToken } from "@/lib/token-crypto";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, type, balance } = await req.json();
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (type !== undefined) updates.type = type;
  if (balance !== undefined) updates.balance = balance;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("accounts")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ account: data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: account } = await supabase
    .from("accounts")
    .select("plaid_item_id")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  const { error } = await supabase.from("accounts").delete().eq("id", id).eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (account?.plaid_item_id) {
    const { count } = await supabase
      .from("accounts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("plaid_item_id", account.plaid_item_id);

    if (!count) {
      const { data: item } = await supabase
        .from("plaid_items")
        .select("*")
        .eq("user_id", userId)
        .eq("item_id", account.plaid_item_id)
        .maybeSingle();

      if (item) {
        try {
          await plaidClient.itemRemove({ access_token: decryptToken(item.access_token) });
        } catch (err) {
          console.error("Plaid itemRemove error", err);
        }
        await supabase.from("plaid_items").delete().eq("id", item.id);
        await supabase.from("holdings").delete().eq("user_id", userId).eq("plaid_item_id", account.plaid_item_id);
      }
    }
  }

  return NextResponse.json({ success: true });
}
