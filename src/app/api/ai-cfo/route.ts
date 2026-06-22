import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the AI CFO inside Locke Capital AI, a premium personal finance platform.
Answer using the user's account balances, goals, cash flow, and portfolio data when provided.
Be concise, concrete, and speak like a trusted private CFO — confident, never hedging unnecessarily.`;

export async function POST(req: NextRequest) {
  const { message, context } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "AI CFO is running in demo mode. Set GEMINI_API_KEY to enable live, personalized answers grounded in your account data.",
    });
  }

  const prompt = context
    ? `Financial context:\n${JSON.stringify(context)}\n\nQuestion: ${message}`
    : message;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 600 },
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ reply: "The AI CFO is temporarily unavailable. Please try again." }, { status: 502 });
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response.";
  return NextResponse.json({ reply });
}
