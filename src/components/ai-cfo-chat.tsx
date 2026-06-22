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

interface Account {
  name: string;
  type: string;
  balance: number;
}
interface Goal {
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}
interface Holding {
  ticker: string;
  shares: number;
  price: number;
}
interface Transaction {
  type: "income" | "expense";
  category: string;
  amount: number;
  occurred_on: string;
}
interface Paycheck {
  gross: number;
  taxes: number;
  retirement_401k: number;
  pay_date: string;
}

async function buildFinancialContext() {
  const [accountsRes, goalsRes, holdingsRes, transactionsRes, paychecksRes] = await Promise.all([
    fetch("/api/accounts").then((r) => r.json()),
    fetch("/api/goals").then((r) => r.json()),
    fetch("/api/holdings").then((r) => r.json()),
    fetch("/api/transactions").then((r) => r.json()),
    fetch("/api/paychecks").then((r) => r.json()),
  ]);

  const accounts: Account[] = accountsRes.accounts ?? [];
  const goals: Goal[] = goalsRes.goals ?? [];
  const holdings: Holding[] = holdingsRes.holdings ?? [];
  const transactions: Transaction[] = transactionsRes.transactions ?? [];
  const paychecks: Paycheck[] = paychecksRes.paychecks ?? [];

  const cash = accounts.filter((a) => a.type === "cash").reduce((sum, a) => sum + Number(a.balance), 0);
  const invested = accounts.filter((a) => a.type === "investment").reduce((sum, a) => sum + Number(a.balance), 0);
  const other = accounts.filter((a) => a.type === "other").reduce((sum, a) => sum + Number(a.balance), 0);
  const netWorth = cash + invested + other;

  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);
  const monthlyIncome = transactions
    .filter((t) => t.type === "income" && t.occurred_on.startsWith(thisMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense" && t.occurred_on.startsWith(thisMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    netWorth: Math.round(netWorth * 100) / 100,
    cash: Math.round(cash * 100) / 100,
    invested: Math.round(invested * 100) / 100,
    monthlyIncome: Math.round(monthlyIncome * 100) / 100,
    monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
    monthlyCashFlow: Math.round((monthlyIncome - monthlyExpenses) * 100) / 100,
    accounts: accounts.map((a) => ({ name: a.name, type: a.type, balance: Number(a.balance) })),
    goals: goals.map((g) => ({
      name: g.name,
      currentAmount: Number(g.current_amount),
      targetAmount: Number(g.target_amount),
      targetDate: g.target_date,
    })),
    holdings: holdings.map((h) => ({
      ticker: h.ticker,
      shares: Number(h.shares),
      value: Math.round(Number(h.shares) * Number(h.price) * 100) / 100,
    })),
    recentPaycheck: paychecks[0]
      ? {
          gross: Number(paychecks[0].gross),
          taxes: Number(paychecks[0].taxes),
          retirement401k: Number(paychecks[0].retirement_401k),
          payDate: paychecks[0].pay_date,
        }
      : null,
  };
}

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
      const context = await buildFinancialContext();
      const res = await fetch("/api/ai-cfo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, context }),
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
