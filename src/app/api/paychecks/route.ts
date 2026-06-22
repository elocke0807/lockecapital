import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("paychecks")
    .select("*")
    .eq("user_id", userId)
    .order("pay_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ paychecks: data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { gross, taxes, retirement_401k, pay_date } = await req.json();
  if (!gross || !pay_date) {
    return NextResponse.json({ error: "gross and pay_date are required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("paychecks")
    .insert({
      user_id: userId,
      gross,
      taxes: taxes ?? 0,
      retirement_401k: retirement_401k ?? 0,
      pay_date,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ paycheck: data });
}
