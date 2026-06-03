import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const simulation = await prisma.simulation.findUnique({
    where: { id },
  });

  if (!simulation) {
    return NextResponse.json({ error: "模拟记录不存在" }, { status: 404 });
  }

  return NextResponse.json(simulation);
}
