import { Topbar } from "@/components/topbar";
import { MarketsOverview } from "@/components/markets-overview";

export default function MarketsPage() {
  return (
    <>
      <Topbar title="Markets" subtitle="Live indices and financial news." />
      <div className="p-6 md:p-8">
        <MarketsOverview />
      </div>
    </>
  );
}
