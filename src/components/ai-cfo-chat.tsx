"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Can I afford a $2,000 vacation this summer?",
  "Am I on track for my emergency fund goal?",
  "Should I increase my 401(k) contribution?",
  "How is my portfolio allocated right now?",
];

const financialContext = {
  netWorth: 84230.12,
  cash: 12450.0,
  invested: 68120.55,
  monthlyCashFlow: 1840.0,
  goals: [
    { name: "Emergency Fund", progress: 82, target: 15000 },
    { name: "Down Payment", progress: 34, target: 60000 },
  ],
};

export function AiCfoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm your AI CFO. I can see your accounts, goals, cash flow, and portfolio. Ask me anything about your finances.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-cfo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, context: financialContext }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Something went wrong reaching the AI CFO. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-180px)] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
            {m.role === "assistant" && (
              <div className="h-8 w-8 shrink-0 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
            )}
            <div
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%]",
                m.role === "user"
                  ? "bg-gold text-black"
                  : "bg-background-secondary border border-border text-text-primary"
              )}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="h-8 w-8 shrink-0 rounded-full bg-card border border-border flex items-center justify-center">
                <User className="h-4 w-4 text-text-secondary" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <div className="rounded-xl px-4 py-2.5 text-sm bg-background-secondary border border-border text-text-secondary">
              Thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs rounded-full border border-border bg-background-secondary px-3 py-1.5 text-text-secondary hover:text-text-primary hover:border-gold/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI CFO anything..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-secondary"
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
