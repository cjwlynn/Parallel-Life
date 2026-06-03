import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const simulations = await prisma.simulation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      shareSlug: true,
      title: true,
      summary: true,
      imageUrl: true,
      textSource: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ simulations });
}
