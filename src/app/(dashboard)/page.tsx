import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { GoalsCard } from "@/components/goals-card";
import { NetWorthOverview } from "@/components/net-worth-overview";

const holdings = [
  { ticker: "VOO", name: "Vanguard S&P 500", value: 24310.2, change: 1.8 },
  { ticker: "AAPL", name: "Apple Inc.", value: 9820.4, change: -0.6 },
  { ticker: "NVDA", name: "NVIDIA Corp.", value: 14210.85, change: 4.2 },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" subtitle="Your financial snapshot, today." />
      <div className="p-6 md:p-8 space-y-6">
        <FadeIn>
          <NetWorthOverview />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Holdings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {holdings.map((h) => (
                <div
                  key={h.ticker}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium font-mono">{h.ticker}</p>
                    <p className="text-xs text-text-secondary">{h.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">{formatCurrency(h.value)}</p>
                    <Badge variant={h.change >= 0 ? "success" : "danger"} className="mt-1">
                      {formatPercent(h.change)}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <GoalsCard />
        </div>

        <Card className="border-gold/30 bg-gradient-to-br from-card to-background-secondary">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-sm font-medium">Ask your AI CFO</p>
              <p className="text-sm text-text-secondary">
                &ldquo;Can I afford a $2,000 vacation this summer without touching my emergency fund?&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
