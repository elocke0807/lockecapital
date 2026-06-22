import { NextResponse } from "next/server";

const SYMBOLS = [
  { symbol: "^spx", name: "S&P 500" },
  { symbol: "^ndq", name: "Nasdaq" },
  { symbol: "^dji", name: "Dow Jones" },
  { symbol: "10usy.b", name: "10Y Treasury" },
];

function parseCsv(csv: string) {
  const lines = csv.trim().split("\n");
  return lines.slice(1).map((line) => {
    const [, , close] = line.split(",");
    return Number(close);
  });
}

export async function GET() {
  const results = await Promise.all(
    SYMBOLS.map(async ({ symbol, name }) => {
      try {
        const res = await fetch(
          `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("fetch failed");
        const csv = await res.text();
        const closes = parseCsv(csv).filter((n) => !Number.isNaN(n));
        const history = closes.slice(-7);
        const latest = history[history.length - 1];
        const prior = history[history.length - 2];
        const change = prior ? ((latest - prior) / prior) * 100 : 0;
        const isYield = symbol.includes("usy");
        return {
          name,
          value: isYield ? `${latest.toFixed(2)}%` : latest.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          change: Math.round(change * 100) / 100,
          history,
        };
      } catch {
        return { name, value: "N/A", change: 0, history: [] };
      }
    })
  );

  return NextResponse.json({ indices: results });
}
