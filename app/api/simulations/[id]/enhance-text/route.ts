import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateBranchComparison, generatePartnerResult } from "@/lib/mock-ai";
import { generateOpenAIText } from "@/lib/openai-service";
import { prisma } from "@/lib/prisma";
import type { SimulationInput } from "@/lib/schemas";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const simulation = await prisma.simulation.findUnique({ where: { id } });
    if (!simulation) {
      return NextResponse.json({ error: "模拟记录不存在" }, { status: 404 });
    }

    const user = await getCurrentUser();
    if (simulation.userId && simulation.userId !== user?.id) {
      return NextResponse.json({ error: "无权修改该记录" }, { status: 403 });
    }

    const input = JSON.parse(simulation.inputJson) as SimulationInput;
    const result = await generateOpenAIText(input);
    const updated = await prisma.simulation.update({
      where: { id },
      data: {
        title: result.title,
        summary: result.summary,
        resultJson: JSON.stringify(result),
        branchJson: JSON.stringify(generateBranchComparison(input)),
        partnerJson: JSON.stringify(generatePartnerResult(input)),
        textSource: "openai",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenAI 文本生成失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
