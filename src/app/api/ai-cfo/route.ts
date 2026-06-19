import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the AI CFO inside Locke Capital AI, a premium personal finance platform.
Answer using the user's account balances, goals, cash flow, and portfolio data when provided.
Be concise, concrete, and speak like a trusted private CFO — confident, never hedging unnecessarily.`;

export async function POST(req: NextRequest) {
  const { message, context } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "AI CFO is running in demo mode. Set ANTHROPIC_API_KEY to enable live, personalized answers grounded in your account data.",
    });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: context
            ? `Financial context:\n${JSON.stringify(context)}\n\nQuestion: ${message}`
            : message,
        },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ reply: "The AI CFO is temporarily unavailable. Please try again." }, { status: 502 });
  }

  const data = await res.json();
  const reply = data?.content?.[0]?.text ?? "I couldn't generate a response.";
  return NextResponse.json({ reply });
}
