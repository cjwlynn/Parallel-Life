import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResultReport } from "@/components/result-report";
import { prisma } from "@/lib/prisma";
import type { BranchComparison, PartnerResult, SimulationInput, SimulationResult } from "@/lib/schemas";

export default async function SharePage({ params }: { params: Promise<{ shareSlug: string }> }) {
  const { shareSlug } = await params;
  const simulation = await prisma.simulation.findUnique({
    where: { shareSlug },
  });

  if (!simulation) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#101418]">
          <ArrowLeft size={17} />
          Parallel Life
        </Link>
        <Link
          href="/questionnaire"
          className="rounded-md bg-[#101418] px-4 py-2 text-sm font-bold text-white hover:bg-[#24313a]"
        >
          生成我的人生
        </Link>
      </header>
      <ResultReport
        input={JSON.parse(simulation.inputJson) as SimulationInput}
        result={JSON.parse(simulation.resultJson) as SimulationResult}
        imageUrl={simulation.imageUrl}
        textSource={simulation.textSource}
        branchComparison={simulation.branchJson ? (JSON.parse(simulation.branchJson) as BranchComparison[]) : []}
        partnerResult={simulation.partnerJson ? (JSON.parse(simulation.partnerJson) as PartnerResult | null) : null}
      />
    </div>
  );
}
