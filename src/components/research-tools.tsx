"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function runResearch(mode: "stock" | "article", input: string) {
  const res = await fetch("/api/research", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ mode, input }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data.result as string;
}

function StockAnalyzer() {
  const [ticker, setTicker] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!ticker.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await runResearch("stock", ticker);
      setResult(r);
    } catch {
      setError("Couldn't analyze that ticker. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-text-primary text-base font-medium">Stock & Fund Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Enter a ticker (e.g. NVDA, VOO)"
            className="flex-1 bg-transparent text-sm outline-none border-b border-border pb-1 placeholder:text-text-secondary"
          />
          <Button size="sm" onClick={analyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {result && (
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{result}</p>
        )}
      </CardContent>
    </Card>
  );
}

function ArticleSimplifier() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function simplify() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await runResearch("article", text);
      setResult(r);
    } catch {
      setError("Couldn't simplify that text. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-text-primary text-base font-medium">Article & Filing Simplifier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article, earnings report, or SEC filing excerpt..."
          rows={5}
          className="w-full bg-transparent text-sm outline-none border border-border rounded-lg p-3 placeholder:text-text-secondary resize-none"
        />
        <Button size="sm" onClick={simplify} disabled={loading}>
          {loading ? "Simplifying..." : "Simplify"}
        </Button>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {result && (
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{result}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ResearchTools() {
  return (
    <div className="space-y-4">
      <StockAnalyzer />
      <ArticleSimplifier />
    </div>
  );
}
