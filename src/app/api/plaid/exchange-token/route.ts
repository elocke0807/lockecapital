import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { plaidClient } from "@/lib/plaid";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { public_token } = await req.json();
  if (!public_token) {
    return NextResponse.json({ error: "public_token is required" }, { status: 400 });
  }

  try {
    const exchange = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = exchange.data.access_token;
    const itemId = exchange.data.item_id;

    const itemInfo = await plaidClient.itemGet({ access_token: accessToken });
    const institutionName = itemInfo.data.item.institution_name ?? null;

    const supabase = getSupabaseServerClient();
    const { error: itemError } = await supabase.from("plaid_items").insert({
      user_id: userId,
      item_id: itemId,
      access_token: accessToken,
      institution_name: institutionName,
    });
    if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 });

    return NextResponse.json({ ok: true, item_id: itemId });
  } catch (err) {
    console.error("Plaid exchange-token error", err);
    return NextResponse.json({ error: "Failed to link account" }, { status: 500 });
  }
}
