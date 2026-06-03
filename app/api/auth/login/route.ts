import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = authSchema.omit({ name: true }).parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    const message = error instanceof Error ? error.message : "登录失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
