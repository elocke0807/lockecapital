import { NextResponse } from "next/server";

const SYMBOLS = [
  { symbol: "SPY", name: "S&P 500 (SPY)" },
  { symbol: "QQQ", name: "Nasdaq (QQQ)" },
  { symbol: "DIA", name: "Dow Jones (DIA)" },
  { symbol: "IWM", name: "Russell 2000 (IWM)" },
];

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ indices: SYMBOLS.map((s) => ({ name: s.name, value: "N/A", change: 0, history: [] })) });
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
        return {
          name,
          value: current.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          change: Math.round(change * 100) / 100,
          history: [] as number[],
        };
      } catch {
        return { name, value: "N/A", change: 0, history: [] };
      }
    })
  );

  return NextResponse.json({ indices: results });
}
