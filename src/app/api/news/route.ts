import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return NextResponse.json({ news: [] });

  try {
    const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();

    const items = (Array.isArray(data) ? data : []).slice(0, 8).map((item: { headline: string; source: string; datetime: number }) => ({
      headline: item.headline,
      source: item.source,
      time: item.datetime
        ? new Date(item.datetime * 1000).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : "",
    }));

    return NextResponse.json({ news: items });
  } catch {
    return NextResponse.json({ news: [] });
  }
}
