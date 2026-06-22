"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CashFlowChart } from "@/components/cash-flow-chart";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

interface Paycheck {
  id: string;
  gross: number;
  taxes: number;
  retirement_401k: number;
  pay_date: string;
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  occurred_on: string;
}

interface Budget {
  id: string;
  category: string;
  monthly_limit: number;
}

export function CashFlowEngine() {
  const [paychecks, setPaychecks] = useState<Paycheck[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [budgets, setBudgets] = useState<Budget[] | null>(null);

  const [addingPaycheck, setAddingPaycheck] = useState(false);
  const [gross, setGross] = useState("");
  const [taxes, setTaxes] = useState("");
  const [retirement, setRetirement] = useState("");

  const [addingTxn, setAddingTxn] = useState(false);
  const [txnType, setTxnType] = useState<"income" | "expense">("expense");
  const [txnCategory, setTxnCategory] = useState("");
  const [txnAmount, setTxnAmount] = useState("");

  const [addingBudget, setAddingBudget] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  async function load() {
    const [pRes, tRes, bRes] = await Promise.all([
      fetch("/api/paychecks"),
      fetch("/api/transactions"),
      fetch("/api/budgets"),
    ]);
    setPaychecks(pRes.ok ? (await pRes.json()).paychecks ?? [] : []);
    setTransactions(tRes.ok ? (await tRes.json()).transactions ?? [] : []);
    setBudgets(bRes.ok ? (await bRes.json()).budgets ?? [] : []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addPaycheck() {
    if (!gross) return;
    await fetch("/api/paychecks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        gross: Number(gross),
        taxes: Number(taxes || 0),
        retirement_401k: Number(retirement || 0),
        pay_date: new Date().toISOString().slice(0, 10),
      }),
    });
    setGross("");
    setTaxes("");
    setRetirement("");
    setAddingPaycheck(false);
    load();
  }

  async function addTransaction() {
    if (!txnCategory.trim() || !txnAmount) return;
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: txnType,
        category: txnCategory,
        amount: Number(txnAmount),
        occurred_on: new Date().toISOString().slice(0, 10),
      }),
    });
    setTxnCategory("");
    setTxnAmount("");
    setAddingTxn(false);
    load();
  }

  async function addBudget() {
    if (!budgetCategory.trim() || !budgetLimit) return;
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ category: budgetCategory, monthly_limit: Number(budgetLimit) }),
    });
    setBudgetCategory("");
    setBudgetLimit("");
    setAddingBudget(false);
    load();
  }

  if (paychecks === null || transactions === null || budgets === null) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-text-secondary">Loading...</CardContent>
      </Card>
    );
  }

  const latestPaycheck = paychecks[0];
  const net = latestPaycheck
    ? latestPaycheck.gross - latestPaycheck.taxes - latestPaycheck.retirement_401k
    : 0;

  const now = new Date();
  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.occurred_on);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthIncome =
    net + monthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const netRemaining = monthIncome - monthExpenses;

  const cashFlowData = [
    { label: "Income", value: monthIncome, type: "in" },
    { label: "Expenses", value: -monthExpenses, type: "out" },
    { label: "Net Remaining", value: netRemaining, type: "net" },
  ];

  function spentForCategory(category: string) {
    return monthTransactions
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((s, t) => s + t.amount, 0);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Paycheck Breakdown</CardTitle>
            <button
              onClick={() => setAddingPaycheck((v) => !v)}
              className="text-text-secondary hover:text-gold transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono">
            {!latestPaycheck && !addingPaycheck && (
              <p className="text-text-secondary font-sans">No paychecks logged yet.</p>
            )}
            {latestPaycheck && (
              <>
                <Row label="Gross Pay" value={latestPaycheck.gross} />
                <Row label="Taxes" value={-latestPaycheck.taxes} />
                <Row label="401(k)" value={-latestPaycheck.retirement_401k} />
                <div className="border-t border-border pt-2 mt-2">
                  <Row label="Net Pay" value={net} bold />
                </div>
              </>
            )}

            {addingPaycheck && (
              <div className="space-y-2 rounded-lg border border-border p-3 font-sans mt-2">
                <input
                  value={gross}
                  onChange={(e) => setGross(e.target.value)}
                  placeholder="Gross pay"
                  type="number"
                  className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
                />
                <input
                  value={taxes}
                  onChange={(e) => setTaxes(e.target.value)}
                  placeholder="Taxes withheld"
                  type="number"
                  className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
                />
                <input
                  value={retirement}
                  onChange={(e) => setRetirement(e.target.value)}
                  placeholder="401(k) contribution"
                  type="number"
                  className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
                />
                <Button size="sm" className="w-full" onClick={addPaycheck}>
                  Save Paycheck
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow Engine</CardTitle>
            <button
              onClick={() => setAddingTxn((v) => !v)}
              className="text-text-secondary hover:text-gold transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <CashFlowChart data={cashFlowData} />

            {addingTxn && (
              <div className="space-y-2 rounded-lg border border-border p-3 mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTxnType("income")}
                    className={`flex-1 rounded-md py-1.5 text-sm ${
                      txnType === "income" ? "bg-success/20 text-success" : "text-text-secondary"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setTxnType("expense")}
                    className={`flex-1 rounded-md py-1.5 text-sm ${
                      txnType === "expense" ? "bg-danger/20 text-danger" : "text-text-secondary"
                    }`}
                  >
                    Expense
                  </button>
                </div>
                <input
                  value={txnCategory}
                  onChange={(e) => setTxnCategory(e.target.value)}
                  placeholder="Category (e.g. Housing, Food)"
                  className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
                />
                <input
                  value={txnAmount}
                  onChange={(e) => setTxnAmount(e.target.value)}
                  placeholder="Amount"
                  type="number"
                  className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
                />
                <Button size="sm" className="w-full" onClick={addTransaction}>
                  Save Transaction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
          <button
            onClick={() => setAddingBudget((v) => !v)}
            className="text-text-secondary hover:text-gold transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.length === 0 && !addingBudget && (
            <p className="text-sm text-text-secondary">No budget categories yet. Add one to get started.</p>
          )}
          {budgets.map((b) => {
            const spent = spentForCategory(b.category);
            const pct = Math.min(100, (spent / b.monthly_limit) * 100);
            const over = spent > b.monthly_limit;
            return (
              <div key={b.id}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span>{b.category}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-text-secondary">
                      {formatCurrency(spent)} / {formatCurrency(b.monthly_limit)}
                    </span>
                    {over && <Badge variant="danger">Over</Badge>}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${over ? "bg-danger" : "bg-gold"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          {addingBudget && (
            <div className="space-y-2 rounded-lg border border-border p-3">
              <input
                value={budgetCategory}
                onChange={(e) => setBudgetCategory(e.target.value)}
                placeholder="Category"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <input
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="Monthly limit"
                type="number"
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
              />
              <Button size="sm" className="w-full" onClick={addBudget}>
                Save Budget
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold" : ""}`}>
      <span className="text-text-secondary font-sans">{label}</span>
      <span className={value < 0 ? "text-danger" : ""}>{formatCurrency(value)}</span>
    </div>
  );
}
