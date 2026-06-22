"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HoldingWithAllocation {
  allocation: number;
}

interface Account {
  type: "cash" | "investment" | "other";
  balance: number;
}

interface Transaction {
  type: "income" | "expense";
  amount: number;
  occurred_on: string;
}

function grade(score: number): { label: string; variant: "success" | "warning" | "danger" } {
  if (score >= 80) return { label: "Excellent", variant: "success" };
  if (score >= 60) return { label: "Good", variant: "success" };
  if (score >= 40) return { label: "Fair", variant: "warning" };
  return { label: "Needs Attention", variant: "danger" };
}

export function PortfolioHealthScore({ holdings }: { holdings: HoldingWithAllocation[] }) {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/accounts"), fetch("/api/transactions")]).then(async ([aRes, tRes]) => {
      setAccounts(aRes.ok ? (await aRes.json()).accounts ?? [] : []);
      setTransactions(tRes.ok ? (await tRes.json()).transactions ?? [] : []);
    });
  }, []);

  if (accounts === null || transactions === null) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-text-secondary">Loading...</CardContent>
      </Card>
    );
  }

  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary">
            Add holdings to see your portfolio health score.
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxAllocation = Math.max(...holdings.map((h) => h.allocation));
  const diversificationScore = Math.max(0, Math.min(100, 100 - (maxAllocation - 20) * 2));
  const holdingsCountScore = Math.min(100, holdings.length * 20);

  const cash = accounts.filter((a) => a.type === "cash").reduce((s, a) => s + a.balance, 0);
  const now = new Date();
  const monthExpenses = transactions
    .filter((t) => {
      const d = new Date(t.occurred_on);
      return (
        t.type === "expense" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, t) => s + t.amount, 0);
  const monthsOfCoverage = monthExpenses > 0 ? cash / monthExpenses : 3;
  const emergencyFundScore = Math.min(100, (monthsOfCoverage / 3) * 100);

  const overall = Math.round((diversificationScore + holdingsCountScore + emergencyFundScore) / 3);
  const { label, variant } = grade(overall);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Health Score</CardTitle>
        <Badge variant={variant}>{label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-3xl font-mono font-semibold tracking-tight">{overall}/100</p>
        <div className="space-y-2 text-sm">
          <ScoreRow label="Diversification" score={diversificationScore} />
          <ScoreRow label="Number of Holdings" score={holdingsCountScore} />
          <ScoreRow label="Emergency Fund Coverage" score={emergencyFundScore} />
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreRow({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono text-xs text-text-secondary">{Math.round(score)}/100</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full bg-gold" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
