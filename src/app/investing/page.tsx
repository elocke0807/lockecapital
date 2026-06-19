import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { AllocationDonut } from "@/components/allocation-donut";
import { FadeIn } from "@/components/fade-in";

const portfolio = [
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", shares: 42.1, price: 577.3, change: 1.8, allocation: 36 },
  { ticker: "AAPL", name: "Apple Inc.", shares: 45, price: 218.2, change: -0.6, allocation: 15 },
  { ticker: "NVDA", name: "NVIDIA Corp.", shares: 98, price: 144.9, change: 4.2, allocation: 21 },
  { ticker: "BTC", name: "Bitcoin", shares: 0.18, price: 96400, change: 2.1, allocation: 14 },
  { ticker: "VXUS", name: "Vanguard Total Intl Stock", shares: 120, price: 64.1, change: 0.4, allocation: 14 },
];

export default function InvestingPage() {
  const totalValue = portfolio.reduce((acc, p) => acc + p.shares * p.price, 0);

  return (
    <>
      <Topbar title="Investing" subtitle="Your portfolio, performance, and allocation." />
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FadeIn className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-mono font-semibold tracking-tight">
                  {formatCurrency(totalValue)}
                </p>
                <p className="text-sm text-success mt-1 font-mono">+1.94% today</p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <AllocationDonut data={portfolio} />
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs">
                  <th className="text-left font-medium px-5 py-3">Symbol</th>
                  <th className="text-right font-medium px-5 py-3">Shares</th>
                  <th className="text-right font-medium px-5 py-3">Price</th>
                  <th className="text-right font-medium px-5 py-3">Value</th>
                  <th className="text-right font-medium px-5 py-3">Change</th>
                  <th className="text-right font-medium px-5 py-3">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((p) => (
                  <tr key={p.ticker} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-mono font-medium">{p.ticker}</p>
                      <p className="text-xs text-text-secondary">{p.name}</p>
                    </td>
                    <td className="text-right px-5 py-3 font-mono">{p.shares}</td>
                    <td className="text-right px-5 py-3 font-mono">{formatCurrency(p.price)}</td>
                    <td className="text-right px-5 py-3 font-mono">
                      {formatCurrency(p.shares * p.price)}
                    </td>
                    <td className="text-right px-5 py-3">
                      <Badge variant={p.change >= 0 ? "success" : "danger"}>
                        {formatPercent(p.change)}
                      </Badge>
                    </td>
                    <td className="text-right px-5 py-3 font-mono text-text-secondary">
                      {p.allocation}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
