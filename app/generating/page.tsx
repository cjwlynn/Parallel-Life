"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brain, LineChart, Network, Sparkles } from "lucide-react";

export default function GeneratingPage() {
  return (
    <Suspense fallback={<GeneratingShell />}>
      <GeneratingContent />
    </Suspense>
  );
}

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      router.replace("/questionnaire");
      return;
    }

    const timer = window.setTimeout(() => {
      router.replace(`/result/${id}`);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [id, router]);

  return (
    <GeneratingShell />
  );
}

function GeneratingShell() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="glass-panel w-full max-w-3xl rounded-lg p-8 text-center md:p-12">
        <div className="mx-auto grid size-16 place-items-center rounded-lg bg-[#101418] text-white">
          <Sparkles className="animate-pulse" />
        </div>
        <h1 className="mt-7 text-3xl font-black text-[#101418] md:text-5xl">AI 正在生成平行人生</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
          正在重组关键选择、城市变量、关系状态和 2035 年的人生曲线。
        </p>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          <Step icon={<Brain />} label="生成总结" />
          <Step icon={<LineChart />} label="计算曲线" />
          <Step icon={<Network />} label="重排社交圈" />
        </div>
      </section>
    </main>
  );
}

function Step({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mx-auto grid size-10 place-items-center rounded-md bg-[#12c8d8]/15 text-[#0a8d99]">{icon}</div>
      <p className="mt-3 text-sm font-bold text-[#101418]">{label}</p>
    </div>
  );
}
