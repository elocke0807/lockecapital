"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}

function pacingStatus(goal: Goal): { label: string; variant: "success" | "warning" | "danger" } | null {
  if (!goal.target_date) return null;
  const now = new Date();
  const target = new Date(goal.target_date);
  const created = new Date();
  created.setMonth(created.getMonth() - 1);

  const pct = goal.current_amount / goal.target_amount;
  if (pct >= 1) return { label: "Complete", variant: "success" };
  if (target < now) return { label: "Past due", variant: "danger" };

  const totalDays = (target.getTime() - created.getTime()) / 86400000;
  const elapsedDays = (now.getTime() - created.getTime()) / 86400000;
  const expectedPct = Math.min(1, Math.max(0, elapsedDays / totalDays));

  if (pct + 0.05 >= expectedPct) return { label: "On track", variant: "success" };
  return { label: "Behind", variant: "warning" };
}

export function GoalsCard() {
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [contributionAmounts, setContributionAmounts] = useState<Record<string, string>>({});

  async function load() {
    const res = await fetch("/api/goals");
    if (!res.ok) {
      setGoals([]);
      return;
    }
    const data = await res.json();
    setGoals(data.goals ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addGoal() {
    if (!name.trim() || !target) return;
    await fetch("/api/goals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        target_amount: Number(target),
        current_amount: 0,
        target_date: targetDate || null,
      }),
    });
    setName("");
    setTarget("");
    setTargetDate("");
    setAdding(false);
    load();
  }

  async function deleteGoal(id: string) {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    load();
  }

  async function addContribution(id: string) {
    const amount = Number(contributionAmounts[id]);
    if (!amount || amount <= 0) return;
    await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contribution: amount }),
    });
    setContributionAmounts((prev) => ({ ...prev, [id]: "" }));
    setEditingId(null);
    load();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals</CardTitle>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-text-secondary hover:text-gold transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals === null && <p className="text-sm text-text-secondary">Loading...</p>}
        {goals?.length === 0 && !adding && (
          <p className="text-sm text-text-secondary">No goals yet. Add one to get started.</p>
        )}
        {goals?.map((g) => {
          const pct = Math.min(100, (g.current_amount / g.target_amount) * 100);
          const status = pacingStatus(g);
          const editing = editingId === g.id;
          return (
            <div key={g.id}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2">
                  {g.name}
                  {status && <Badge variant={status.variant}>{status.label}</Badge>}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-text-secondary font-mono text-xs">{Math.round(pct)}%</span>
                  <button
                    onClick={() => setEditingId(editing ? null : g.id)}
                    className="text-text-secondary hover:text-gold transition-colors"
                  >
                    {editing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-text-secondary hover:text-danger transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-text-secondary font-mono">
                <span>
                  {formatCurrency(g.current_amount)} / {formatCurrency(g.target_amount)}
                </span>
                {g.target_date && <span>by {new Date(g.target_date).toLocaleDateString()}</span>}
              </div>

              {editing && (
                <div className="flex gap-2 mt-2">
                  <input
                    value={contributionAmounts[g.id] ?? ""}
                    onChange={(e) =>
                      setContributionAmounts((prev) => ({ ...prev, [g.id]: e.target.value }))
                    }
                    placeholder="Add contribution"
                    type="number"
                    className="flex-1 bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
                  />
                  <Button size="sm" onClick={() => addContribution(g.id)}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {adding && (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Goal name"
              className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
            />
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Target amount"
              type="number"
              className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
            />
            <input
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              type="date"
              className="w-full bg-transparent text-sm outline-none border-b border-border pb-1 text-text-secondary"
            />
            <Button size="sm" className="w-full" onClick={addGoal}>
              Save Goal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
