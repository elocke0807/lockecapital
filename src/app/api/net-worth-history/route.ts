import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("net_worth_snapshots")
    .select("snapshot_date, total")
    .eq("user_id", userId)
    .order("snapshot_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ history: data });
}
