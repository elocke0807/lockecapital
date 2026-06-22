import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const SYMBOLS = [
  { symbol: "SPY", name: "S&P 500 (SPY)" },
  { symbol: "QQQ", name: "Nasdaq (QQQ)" },
  { symbol: "DIA", name: "Dow Jones (DIA)" },
  { symbol: "IWM", name: "Russell 2000 (IWM)" },
];

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;
  const supabase = getSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  if (!apiKey) {
    return NextResponse.json({
      indices: SYMBOLS.map((s) => ({ name: s.name, value: "N/A", change: 0, history: [] })),
    });
  }

  const results = await Promise.all(
    SYMBOLS.map(async ({ symbol, name }) => {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        const current = data.c;
        const prevClose = data.pc;
        if (!current || !prevClose) throw new Error("no data");
        const change = ((current - prevClose) / prevClose) * 100;

        await supabase
          .from("market_snapshots")
          .upsert({ symbol, snapshot_date: today, value: current }, { onConflict: "symbol,snapshot_date" });

        const { data: history } = await supabase
          .from("market_snapshots")
          .select("value")
          .eq("symbol", symbol)
          .order("snapshot_date", { ascending: true })
          .limit(30);

        return {
          name,
          value: current.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          change: Math.round(change * 100) / 100,
          history: (history ?? []).map((h) => Number(h.value)).slice(-7),
        };
      } catch {
        return { name, value: "N/A", change: 0, history: [] };
      }
    })
  );

  return NextResponse.json({ indices: results });
}
