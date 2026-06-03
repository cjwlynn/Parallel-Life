import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { ResultReport } from "@/components/result-report";
import { prisma } from "@/lib/prisma";
import type { BranchComparison, PartnerResult, SimulationInput, SimulationResult } from "@/lib/schemas";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const simulation = await prisma.simulation.findUnique({
    where: { id },
  });

  if (!simulation) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <Link href="/questionnaire" className="inline-flex items-center gap-2 py-3 text-sm font-semibold text-slate-600">
          <ArrowLeft size={17} />
          再生成一次
        </Link>
      </div>
      <ResultReport
        simulationId={simulation.id}
        input={JSON.parse(simulation.inputJson) as SimulationInput}
        result={JSON.parse(simulation.resultJson) as SimulationResult}
        shareSlug={simulation.shareSlug}
        imageUrl={simulation.imageUrl}
        textSource={simulation.textSource}
        branchComparison={simulation.branchJson ? (JSON.parse(simulation.branchJson) as BranchComparison[]) : []}
        partnerResult={simulation.partnerJson ? (JSON.parse(simulation.partnerJson) as PartnerResult | null) : null}
        editable
      />
    </div>
  );
}
