import { NextResponse } from "next/server";

const FEED_URL = "https://feeds.content.dowjones.io/public/rss/mw_topstories";

export async function GET() {
  try {
    const res = await fetch(FEED_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    const xml = await res.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 8).map((match) => {
      const block = match[1];
      const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() ?? "Untitled";
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();
      return {
        headline: title,
        source: "MarketWatch",
        time: pubDate ? new Date(pubDate).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "",
      };
    });

    return NextResponse.json({ news: items });
  } catch {
    return NextResponse.json({ news: [] });
  }
}
