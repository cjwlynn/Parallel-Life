import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = authSchema.parse(await request.json());
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name || input.email.split("@")[0],
        passwordHash: hashPassword(input.password),
      },
      select: { id: true, email: true, name: true },
    });
    await createSession(user.id);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "注册失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
