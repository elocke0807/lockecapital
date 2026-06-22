"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils";
import { Sparkline } from "@/components/sparkline";

interface Index {
  name: string;
  value: string;
  change: number;
  history: number[];
}

interface NewsItem {
  headline: string;
  source: string;
  time: string;
}

export function MarketsOverview() {
  const [indices, setIndices] = useState<Index[] | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    fetch("/api/markets").then(async (res) => {
      setIndices(res.ok ? (await res.json()).indices ?? [] : []);
    });
    fetch("/api/news").then(async (res) => {
      setNews(res.ok ? (await res.json()).news ?? [] : []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices === null && (
          <Card>
            <CardContent className="py-8 text-sm text-text-secondary">Loading...</CardContent>
          </Card>
        )}
        {indices?.map((i) => (
          <Card key={i.name}>
            <CardHeader>
              <CardTitle>{i.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-mono font-semibold">{i.value}</p>
              <Badge variant={i.change >= 0 ? "success" : "danger"} className="mt-2">
                {formatPercent(i.change)}
              </Badge>
              {i.history.length > 1 && (
                <div className="mt-3 -mx-1">
                  <Sparkline data={i.history} positive={i.change >= 0} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Stories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {news === null && <p className="text-sm text-text-secondary">Loading...</p>}
          {news?.length === 0 && <p className="text-sm text-text-secondary">No news available right now.</p>}
          {news?.map((n) => (
            <div key={n.headline} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <p className="text-sm">{n.headline}</p>
              <p className="text-xs text-text-secondary mt-1 font-mono">
                {n.source} {n.time && `· ${n.time}`}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
