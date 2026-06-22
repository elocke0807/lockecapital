"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Holding {
  id: string;
  ticker: string;
  name: string;
  shares: number;
  price: number;
}

export function TopHoldingsCard() {
  const [holdings, setHoldings] = useState<Holding[] | null>(null);

  useEffect(() => {
    fetch("/api/holdings").then(async (res) => {
      setHoldings(res.ok ? (await res.json()).holdings ?? [] : []);
    });
  }, []);

  const top = (holdings ?? [])
    .map((h) => ({ ...h, value: h.shares * h.price }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Holdings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {holdings === null && <p className="text-sm text-text-secondary">Loading...</p>}
        {holdings?.length === 0 && (
          <p className="text-sm text-text-secondary">No holdings yet. Add one on the Investing page.</p>
        )}
        {top.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium font-mono">{h.ticker}</p>
              <p className="text-xs text-text-secondary">{h.name}</p>
            </div>
            <p className="text-sm font-mono">{formatCurrency(h.value)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
