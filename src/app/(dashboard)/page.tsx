import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { GoalsCard } from "@/components/goals-card";
import { NetWorthOverview } from "@/components/net-worth-overview";
import { TopHoldingsCard } from "@/components/top-holdings-card";

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" subtitle="Your financial snapshot, today." />
      <div className="p-6 md:p-8 space-y-6">
        <FadeIn>
          <NetWorthOverview />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TopHoldingsCard />
          </div>

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
