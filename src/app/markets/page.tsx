import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils";

const indices = [
  { name: "S&P 500", value: "6,142.30", change: 0.84 },
  { name: "Nasdaq", value: "19,820.10", change: 1.12 },
  { name: "Dow Jones", value: "43,210.55", change: -0.21 },
  { name: "10Y Treasury", value: "4.32%", change: -0.04 },
];

const news = [
  {
    headline: "Fed signals measured approach to rate cuts amid steady inflation data",
    source: "Reuters",
    time: "2h ago",
  },
  {
    headline: "Semiconductor stocks rally as AI capex guidance beats expectations",
    source: "Bloomberg",
    time: "4h ago",
  },
  {
    headline: "Consumer spending holds firm heading into Q3 earnings season",
    source: "WSJ",
    time: "6h ago",
  },
];

export default function MarketsPage() {
  return (
    <>
      <Topbar title="Markets" subtitle="Live indices and financial news." />
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((i) => (
            <Card key={i.name}>
              <CardHeader>
                <CardTitle>{i.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-mono font-semibold">{i.value}</p>
                <Badge variant={i.change >= 0 ? "success" : "danger"} className="mt-2">
                  {formatPercent(i.change)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Stories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {news.map((n) => (
              <div key={n.headline} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <p className="text-sm">{n.headline}</p>
                <p className="text-xs text-text-secondary mt-1 font-mono">
                  {n.source} · {n.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
