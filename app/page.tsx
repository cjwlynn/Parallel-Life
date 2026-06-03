import Link from "next/link";
import { ArrowRight, GitBranch, LineChart, Network, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/app-header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl items-center gap-10 px-5 pb-12 pt-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#101418] md:text-6xl">
              AI 平行人生模拟器
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold leading-9 text-slate-700">
              如果你 22 岁去了深圳而不是上海，2035 年的你会是什么样？
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              输入专业、城市、创业和婚姻等关键选择，生成另一个宇宙里的时间线、财富曲线、社交圈变化和来自未来自己的信。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/questionnaire"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#101418] px-6 text-sm font-bold text-white hover:bg-[#24313a]"
              >
                开始模拟
                <ArrowRight size={18} />
              </Link>
              <a
                href="#sample"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-6 text-sm font-bold text-[#101418] hover:bg-slate-50"
              >
                查看示例报告
              </a>
            </div>
          </div>

          <div id="sample" className="glass-panel soft-grid rounded-lg p-4 md:p-6">
            <div className="rounded-lg bg-[#101418] p-5 text-white shadow-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/55">Parallel Life Report</p>
                  <h2 className="mt-2 text-2xl font-bold">2035 年，深圳宇宙里的你</h2>
                </div>
                <Sparkles className="text-[#b8f24b]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <PreviewCard icon={<GitBranch />} title="平行人生时间线" value="2026 - 2035" />
                <PreviewCard icon={<LineChart />} title="财富曲线" value="36 → 88" />
                <PreviewCard icon={<Network />} title="社交圈变化" value="熟人减少，机会关系增加" />
                <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <p className="text-sm text-white/55">AI 未来照片</p>
                  <div className="mt-4 h-36 rounded-md bg-[linear-gradient(135deg,#263238,#111418_70%,#12c8d8)]" />
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-white/10 bg-white/8 p-4">
                <p className="text-sm leading-6 text-white/70">
                  你没有马上变得更成功，但你更早学会把机会、关系和风险放进同一张人生地图里。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PreviewCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/8 p-4">
      <div className="text-[#12c8d8]">{icon}</div>
      <p className="mt-4 text-sm text-white/55">{title}</p>
      <p className="mt-2 text-base font-bold leading-6">{value}</p>
    </div>
  );
}
