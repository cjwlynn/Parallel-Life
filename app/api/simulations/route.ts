import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateBranchComparison, generateParallelLife, generatePartnerResult } from "@/lib/mock-ai";
import { simulationInputSchema } from "@/lib/schemas";

function makeShareSlug() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = simulationInputSchema.parse(json);
    const result = generateParallelLife(input);
    const branchComparison = generateBranchComparison(input);
    const partnerResult = generatePartnerResult(input);
    const user = await getCurrentUser();

    const simulation = await prisma.simulation.create({
      data: {
        shareSlug: makeShareSlug(),
        userId: user?.id,
        title: result.title,
        summary: result.summary,
        inputJson: JSON.stringify(input),
        resultJson: JSON.stringify(result),
        branchJson: JSON.stringify(branchComparison),
        partnerJson: partnerResult ? JSON.stringify(partnerResult) : null,
      },
      select: {
        id: true,
        shareSlug: true,
        title: true,
      },
    });

    return NextResponse.json(simulation, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建模拟失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
