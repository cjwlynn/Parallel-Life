import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateOpenAIImage } from "@/lib/openai-service";
import { prisma } from "@/lib/prisma";
import type { SimulationResult } from "@/lib/schemas";

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

    const result = JSON.parse(simulation.resultJson) as SimulationResult;
    const imageUrl = await generateOpenAIImage(id, result.imagePrompt);
    const updated = await prisma.simulation.update({
      where: { id },
      data: { imageUrl },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 照片生成失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
