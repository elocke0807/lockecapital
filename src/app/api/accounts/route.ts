import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const total = (data ?? []).reduce((sum, a) => sum + Number(a.balance), 0);
  await supabase
    .from("net_worth_snapshots")
    .upsert(
      { user_id: userId, snapshot_date: new Date().toISOString().slice(0, 10), total },
      { onConflict: "user_id,snapshot_date" }
    );

  return NextResponse.json({ accounts: data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, type, balance } = await req.json();
  if (!name || !type || balance === undefined) {
    return NextResponse.json({ error: "name, type, and balance are required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("accounts")
    .insert({ user_id: userId, name, type, balance })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ account: data });
}
