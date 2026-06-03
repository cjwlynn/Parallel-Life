import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareSlug: string }> },
) {
  const { shareSlug } = await params;

  const simulation = await prisma.simulation.findUnique({
    where: { shareSlug },
  });

  if (!simulation) {
    return NextResponse.json({ error: "分享链接不存在" }, { status: 404 });
  }

  return NextResponse.json(simulation);
}
