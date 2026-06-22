import { Topbar } from "@/components/topbar";
import { PortfolioCard } from "@/components/portfolio-card";

export default function InvestingPage() {
  return (
    <>
      <Topbar title="Investing" subtitle="Your portfolio, performance, and allocation." />
      <div className="p-6 md:p-8">
        <PortfolioCard />
      </div>
    </>
  );
}
