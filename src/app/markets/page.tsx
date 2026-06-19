import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils";
import { Sparkline } from "@/components/sparkline";
import { FadeIn } from "@/components/fade-in";

const indices = [
  { name: "S&P 500", value: "6,142.30", change: 0.84, history: [6010, 6040, 6020, 6080, 6110, 6090, 6142] },
  { name: "Nasdaq", value: "19,820.10", change: 1.12, history: [19400, 19500, 19450, 19600, 19700, 19680, 19820] },
  { name: "Dow Jones", value: "43,210.55", change: -0.21, history: [43500, 43400, 43450, 43300, 43350, 43280, 43210] },
  { name: "10Y Treasury", value: "4.32%", change: -0.04, history: [4.4, 4.38, 4.36, 4.35, 4.33, 4.34, 4.32] },
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
          {indices.map((i, idx) => (
            <FadeIn key={i.name} delay={idx * 0.05}>
              <Card>
                <CardHeader>
                  <CardTitle>{i.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-mono font-semibold">{i.value}</p>
                  <Badge variant={i.change >= 0 ? "success" : "danger"} className="mt-2">
                    {formatPercent(i.change)}
                  </Badge>
                  <div className="mt-3 -mx-1">
                    <Sparkline data={i.history} positive={i.change >= 0} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
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
        </FadeIn>
      </div>
    </>
  );
}
