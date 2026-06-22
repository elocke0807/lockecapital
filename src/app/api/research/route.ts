import { NextRequest, NextResponse } from "next/server";

async function askGemini(apiKey: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 1000, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  );
  if (!res.ok) throw new Error("Gemini request failed");
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response.";
}

export async function POST(req: NextRequest) {
  const { mode, input } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      result:
        "Research tools are running in demo mode. Set GEMINI_API_KEY to enable live AI-assisted analysis.",
    });
  }

  if (!input || typeof input !== "string" || !input.trim()) {
    return NextResponse.json({ error: "Input is required." }, { status: 400 });
  }

  try {
    if (mode === "stock") {
      const ticker = input.trim().toUpperCase();
      const finnhubKey = process.env.FINNHUB_API_KEY;
      let quoteLine = "";

      if (finnhubKey) {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${finnhubKey}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const q = await res.json();
          if (q.c && q.pc) {
            const change = (((q.c - q.pc) / q.pc) * 100).toFixed(2);
            quoteLine = `Current price: $${q.c.toFixed(2)}, previous close: $${q.pc.toFixed(2)}, change: ${change}%.`;
          }
        }
      }

      const systemPrompt =
        "You are an equity research analyst for a premium personal finance platform. Give a concise, balanced analysis of the requested stock or fund: what it does, current valuation context, key risks, and a clear stance (Buy/Hold/Sell/Core Holding style). Be direct, no fluff. This is not personalized financial advice — note that briefly only if relevant.";
      const userPrompt = quoteLine
        ? `Ticker: ${ticker}\n${quoteLine}\n\nProvide a research summary.`
        : `Ticker: ${ticker}\n\nProvide a research summary (no live price data available).`;

      const result = await askGemini(apiKey, systemPrompt, userPrompt);
      return NextResponse.json({ result });
    }

    if (mode === "article") {
      const systemPrompt =
        "You simplify dense financial articles, SEC filings, and earnings reports into plain English for a general audience. Summarize the key points, what changed, and why it matters, in a few short paragraphs or bullet points. Avoid jargon; define any term you must use.";
      const result = await askGemini(apiKey, systemPrompt, input);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Invalid mode." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Research request failed. Please try again." }, { status: 502 });
  }
}
