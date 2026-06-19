import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/fade-in";

const stocks = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    rating: "Strong Buy",
    pe: 48.2,
    summary: "AI infrastructure demand remains the dominant growth driver heading into next earnings cycle.",
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    rating: "Hold",
    pe: 31.4,
    summary: "Services growth offsetting flat hardware revenue; valuation near historical premium.",
  },
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    rating: "Core Holding",
    pe: 24.8,
    summary: "Broad market exposure with low expense ratio; foundational allocation for most goals.",
  },
];

const ratingVariant: Record<string, "success" | "warning" | "gold"> = {
  "Strong Buy": "success",
  Hold: "warning",
  "Core Holding": "gold",
};

export default function ResearchPage() {
  return (
    <>
      <Topbar title="Research" subtitle="AI-assisted equity and fund analysis." />
      <div className="p-6 md:p-8 space-y-4">
        {stocks.map((s, idx) => (
          <FadeIn key={s.ticker} delay={idx * 0.07}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary text-base font-medium">
                  <span className="font-mono text-gold">{s.ticker}</span>
                  <span className="text-text-secondary text-sm">{s.name}</span>
                </CardTitle>
                <Badge variant={ratingVariant[s.rating] ?? "neutral"}>{s.rating}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary leading-relaxed">{s.summary}</p>
                <p className="text-xs font-mono text-text-secondary mt-3">P/E {s.pe}</p>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </>
  );
}
