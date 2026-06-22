"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { AllocationDonut } from "@/components/allocation-donut";
import { PortfolioHealthScore } from "@/components/portfolio-health-score";
import { Plus, Trash2 } from "lucide-react";

interface Holding {
  id: string;
  ticker: string;
  name: string;
  shares: number;
  price: number;
}

export function PortfolioCard() {
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");

  async function load() {
    const res = await fetch("/api/holdings");
    setHoldings(res.ok ? (await res.json()).holdings ?? [] : []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addHolding() {
    if (!ticker.trim() || !shares || !price) return;
    await fetch("/api/holdings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ticker, name, shares: Number(shares), price: Number(price) }),
    });
    setTicker("");
    setName("");
    setShares("");
    setPrice("");
    setAdding(false);
    load();
  }

  async function deleteHolding(id: string) {
    await fetch(`/api/holdings/${id}`, { method: "DELETE" });
    load();
  }

  if (holdings === null) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-text-secondary">Loading...</CardContent>
      </Card>
    );
  }

  const totalValue = holdings.reduce((acc, h) => acc + h.shares * h.price, 0);
  const withAllocation = holdings.map((h) => ({
    ...h,
    value: h.shares * h.price,
    allocation: totalValue > 0 ? Math.round(((h.shares * h.price) / totalValue) * 1000) / 10 : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-semibold tracking-tight">
              {formatCurrency(totalValue)}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {holdings.length} holding{holdings.length === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {withAllocation.length === 0 ? (
              <p className="text-sm text-text-secondary">Add a holding to see allocation.</p>
            ) : (
              <AllocationDonut data={withAllocation} />
            )}
          </CardContent>
        </Card>
      </div>

      <PortfolioHealthScore holdings={withAllocation} />

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <button
            onClick={() => setAdding((v) => !v)}
            className="text-text-secondary hover:text-gold transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="p-0">
          {holdings.length === 0 && !adding && (
            <p className="text-sm text-text-secondary px-5 py-4">
              No holdings yet. Add one to track your portfolio.
            </p>
          )}
          {holdings.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs">
                  <th className="text-left font-medium px-5 py-3">Symbol</th>
                  <th className="text-right font-medium px-5 py-3">Shares</th>
                  <th className="text-right font-medium px-5 py-3">Price</th>
                  <th className="text-right font-medium px-5 py-3">Value</th>
                  <th className="text-right font-medium px-5 py-3">Allocation</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {withAllocation.map((h) => (
                  <tr key={h.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-mono font-medium">{h.ticker}</p>
                      <p className="text-xs text-text-secondary">{h.name}</p>
                    </td>
                    <td className="text-right px-5 py-3 font-mono">{h.shares}</td>
                    <td className="text-right px-5 py-3 font-mono">{formatCurrency(h.price)}</td>
                    <td className="text-right px-5 py-3 font-mono">{formatCurrency(h.value)}</td>
                    <td className="text-right px-5 py-3 font-mono text-text-secondary">
                      {h.allocation}%
                    </td>
                    <td className="text-right px-5 py-3">
                      <button
                        onClick={() => deleteHolding(h.id)}
                        className="text-text-secondary hover:text-danger transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {adding && (
            <div className="space-y-2 p-5">
              <input
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Ticker (e.g. VOO)"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <input
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="Shares"
                type="number"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per share"
                type="number"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <Button size="sm" className="w-full" onClick={addHolding}>
                Save Holding
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
