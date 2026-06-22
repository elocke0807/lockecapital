import { Topbar } from "@/components/topbar";
import { ResearchTools } from "@/components/research-tools";

export default function ResearchPage() {
  return (
    <>
      <Topbar title="Research" subtitle="AI-assisted equity and fund analysis." />
      <div className="p-6 md:p-8">
        <ResearchTools />
      </div>
    </>
  );
}
