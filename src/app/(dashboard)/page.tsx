import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { NetWorthChart } from "@/components/net-worth-chart";
import { FadeIn } from "@/components/fade-in";
import { GoalsCard } from "@/components/goals-card";

const snapshot = [
  { label: "Net Worth", value: 84230.12, change: 2.4 },
  { label: "Cash", value: 12450.0, change: 0.1 },
  { label: "Invested", value: 68120.55, change: 3.8 },
  { label: "Monthly Cash Flow", value: 1840.0, change: -4.2 },
];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {snapshot.map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.05}>
              <Card>
                <CardHeader>
                  <CardTitle>{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-mono font-semibold tracking-tight">
                    {formatCurrency(item.value)}
                  </p>
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
                    {formatPercent(item.change)} this month
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <NetWorthChart />
            </CardContent>
          </Card>
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
