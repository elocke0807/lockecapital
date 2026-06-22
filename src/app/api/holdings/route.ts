import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ holdings: data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ticker, name, shares, price } = await req.json();
  if (!ticker || !shares || !price) {
    return NextResponse.json({ error: "ticker, shares, and price are required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("holdings")
    .insert({ user_id: userId, ticker: ticker.toUpperCase(), name: name || ticker.toUpperCase(), shares, price })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ holding: data });
}
