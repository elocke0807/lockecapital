import { Topbar } from "@/components/topbar";
import { CashFlowEngine } from "@/components/cash-flow-engine";

export default function WealthPage() {
  return (
    <>
      <Topbar title="Wealth" subtitle="Paycheck, budgeting, and cash flow in one view." />
      <div className="p-6 md:p-8">
        <CashFlowEngine />
      </div>
    </>
  );
}
