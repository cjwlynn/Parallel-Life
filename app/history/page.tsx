import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
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

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#101418] md:text-6xl">历史档案</h1>
            <p className="mt-4 text-base text-slate-600">保存你登录后生成过的所有平行人生。</p>
          </div>
          <Link href="/questionnaire" className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#101418] px-5 text-sm font-bold text-white">
            新建模拟
          </Link>
        </div>

        {simulations.length === 0 ? (
          <section className="glass-panel rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[#101418]">还没有历史记录</h2>
            <p className="mt-3 text-slate-600">先生成一次，之后结果会自动归档。</p>
          </section>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {simulations.map((item) => (
              <Link key={item.id} href={`/result/${item.id}`} className="glass-panel overflow-hidden rounded-lg p-5 transition hover:-translate-y-1">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="mb-4 h-48 w-full rounded-md object-cover" />
                ) : null}
                <div className="mb-3 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                  {item.textSource === "openai" ? "OpenAI 文本" : "Mock 初版"}
                </div>
                <h2 className="text-xl font-bold leading-7 text-[#101418]">{item.title}</h2>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{item.summary}</p>
                <p className="mt-4 text-xs font-semibold text-slate-400">{item.createdAt.toLocaleString("zh-CN")}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
