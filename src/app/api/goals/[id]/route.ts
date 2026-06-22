import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = getSupabaseServerClient();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.target_amount !== undefined) updates.target_amount = body.target_amount;
  if (body.target_date !== undefined) updates.target_date = body.target_date;

  if (typeof body.contribution === "number" && body.contribution > 0) {
    const { data: existing, error: fetchError } = await supabase
      .from("goals")
      .select("current_amount, name")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

    updates.current_amount = Number(existing.current_amount) + body.contribution;

    await supabase.from("transactions").insert({
      user_id: userId,
      type: "expense",
      category: `Goal: ${existing.name}`,
      amount: body.contribution,
      occurred_on: new Date().toISOString().slice(0, 10),
    });
  } else if (body.current_amount !== undefined) {
    updates.current_amount = body.current_amount;
  }

  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ goal: data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
