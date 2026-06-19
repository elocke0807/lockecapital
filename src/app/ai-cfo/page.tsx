import { Topbar } from "@/components/topbar";
import { AiCfoChat } from "@/components/ai-cfo-chat";

export default function AiCfoPage() {
  return (
    <>
      <Topbar title="AI CFO" subtitle="Personalized answers grounded in your real financial data." />
      <div className="p-6 md:p-8">
        <AiCfoChat />
      </div>
    </>
  );
}
