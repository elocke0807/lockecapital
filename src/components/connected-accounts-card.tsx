"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { PlaidLinkButton } from "@/components/plaid-link-button";

interface Account {
  id: string;
  name: string;
  type: "cash" | "investment" | "other";
  balance: number;
}

export function ConnectedAccountsCard() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "investment" | "other">("cash");
  const [balance, setBalance] = useState("");

  async function load() {
    const res = await fetch("/api/accounts");
    setAccounts(res.ok ? (await res.json()).accounts ?? [] : []);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {accounts === null && <p className="text-sm text-text-secondary">Loading...</p>}
        {accounts?.length === 0 && !adding && (
          <p className="text-sm text-text-secondary">
            No accounts yet. Add one to track your net worth.
          </p>
        )}
        {accounts?.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
          >
            <div>
              <span className="text-sm">{a.name}</span>
              <p className="text-xs text-text-secondary capitalize">{a.type}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono">{formatCurrency(a.balance)}</span>
              <button
                onClick={() => deleteAccount(a.id)}
                className="text-text-secondary hover:text-danger transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {adding ? (
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
        ) : (
          <Button variant="secondary" className="w-full mt-2" onClick={() => setAdding(true)}>
            + Add account manually
          </Button>
        )}
        <PlaidLinkButton onLinked={load} />
      </CardContent>
    </Card>
  );
}
