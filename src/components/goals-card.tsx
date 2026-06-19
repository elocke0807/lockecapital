"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

export function GoalsCard() {
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

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
      body: JSON.stringify({ name, target_amount: Number(target), current_amount: 0 }),
    });
    setName("");
    setTarget("");
    setAdding(false);
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
          return (
            <div key={g.id}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span>{g.name}</span>
                <span className="text-text-secondary font-mono text-xs">{Math.round(pct)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
              </div>
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
            <Button size="sm" className="w-full" onClick={addGoal}>
              Save Goal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
