"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetWorthChart } from "@/components/net-worth-chart";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Plus, Trash2 } from "lucide-react";

interface Account {
  id: string;
  name: string;
  type: "cash" | "investment" | "other";
  balance: number;
}

interface SnapshotPoint {
  snapshot_date: string;
  total: number;
}

interface Transaction {
  type: "income" | "expense";
  amount: number;
  occurred_on: string;
}

interface Paycheck {
  gross: number;
  taxes: number;
  retirement_401k: number;
  pay_date: string;
}

export function NetWorthOverview() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [history, setHistory] = useState<SnapshotPoint[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [paychecks, setPaychecks] = useState<Paycheck[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "investment" | "other">("cash");
  const [balance, setBalance] = useState("");

  async function load() {
    const [aRes, tRes, pRes] = await Promise.all([
      fetch("/api/accounts"),
      fetch("/api/transactions"),
      fetch("/api/paychecks"),
    ]);
    setAccounts(aRes.ok ? (await aRes.json()).accounts ?? [] : []);
    setTransactions(tRes.ok ? (await tRes.json()).transactions ?? [] : []);
    setPaychecks(pRes.ok ? (await pRes.json()).paychecks ?? [] : []);

    const hRes = await fetch("/api/net-worth-history");
    setHistory(hRes.ok ? (await hRes.json()).history ?? [] : []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addAccount() {
    if (!name.trim() || !balance) return;
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, type, balance: Number(balance) }),
    });
    setName("");
    setBalance("");
    setAdding(false);
    load();
  }

  async function deleteAccount(id: string) {
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    load();
  }

  if (accounts === null || history === null || transactions === null || paychecks === null) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-text-secondary">Loading...</CardContent>
      </Card>
    );
  }

  const cash = accounts.filter((a) => a.type === "cash").reduce((s, a) => s + a.balance, 0);
  const invested = accounts.filter((a) => a.type === "investment").reduce((s, a) => s + a.balance, 0);
  const other = accounts.filter((a) => a.type === "other").reduce((s, a) => s + a.balance, 0);
  const netWorth = cash + invested + other;

  const now = new Date();
  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.occurred_on);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthPaycheckNet = paychecks
    .filter((p) => {
      const d = new Date(p.pay_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, p) => s + (p.gross - p.taxes - p.retirement_401k), 0);
  const monthIncome =
    monthPaycheckNet + monthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const monthlyCashFlow = monthIncome - monthExpenses;

  function changePct(current: number, snapshotKey: "total") {
    if (history!.length < 2) return null;
    const prior = history![0][snapshotKey];
    if (prior === 0) return null;
    return ((current - prior) / prior) * 100;
  }

  const netWorthChange = changePct(netWorth, "total");

  const chartData = history.map((h) => ({
    month: new Date(h.snapshot_date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: h.total,
  }));

  const snapshot = [
    { label: "Net Worth", value: netWorth, change: netWorthChange },
    { label: "Cash", value: cash, change: null },
    { label: "Invested", value: invested, change: null },
    { label: "Monthly Cash Flow", value: monthlyCashFlow, change: null },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {snapshot.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-semibold tracking-tight">
                {formatCurrency(item.value)}
              </p>
              {item.change !== null && (
                <div
                  className={`mt-2 flex items-center gap-1 text-xs font-mono ${
                    item.change >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {item.change >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {formatPercent(item.change)} since last snapshot
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <NetWorthChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <button
            onClick={() => setAdding((v) => !v)}
            className="text-text-secondary hover:text-gold transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {accounts.length === 0 && !adding && (
            <p className="text-sm text-text-secondary">No accounts yet. Add one to track your net worth.</p>
          )}
          {accounts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-text-secondary capitalize">{a.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-mono">{formatCurrency(a.balance)}</p>
                <button
                  onClick={() => deleteAccount(a.id)}
                  className="text-text-secondary hover:text-danger transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {adding && (
            <div className="space-y-2 rounded-lg border border-border p-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Account name (e.g. Chase Checking)"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <div className="flex gap-2">
                {(["cash", "investment", "other"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-md py-1.5 text-sm capitalize ${
                      type === t ? "bg-gold/20 text-gold" : "text-text-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Balance"
                type="number"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <Button size="sm" className="w-full" onClick={addAccount}>
                Save Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
