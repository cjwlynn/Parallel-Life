"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Camera, Copy, Network, RefreshCw, Share2, Sparkles, TrendingUp, Users, Wand2 } from "lucide-react";
import type { BranchComparison, PartnerResult, SimulationInput, SimulationResult } from "@/lib/schemas";
import { Button } from "@/components/button";

type ResultReportProps = {
  simulationId?: string;
  input: SimulationInput;
  result: SimulationResult;
  shareSlug?: string;
  imageUrl?: string | null;
  textSource?: string;
  branchComparison?: BranchComparison[];
  partnerResult?: PartnerResult | null;
  editable?: boolean;
};

export function ResultReport({
  simulationId,
  input,
  result,
  shareSlug,
  imageUrl,
  textSource = "mock",
  branchComparison = [],
  partnerResult,
  editable = false,
}: ResultReportProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const shareUrl =
    typeof window !== "undefined" && shareSlug ? `${window.location.origin}/share/${shareSlug}` : "";

  async function copyShareUrl() {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
    }
  }

  async function runAction(path: string, label: string) {
    if (!simulationId) return;
    setActionError("");
    setActionLabel(label);
    const response = await fetch(path, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setActionError(data.error ?? `${label}失败`);
      setActionLabel("");
      return;
    }
    startTransition(() => router.refresh());
    setActionLabel("");
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8">
      <section className="grid gap-6 py-6 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="glass-panel rounded-lg p-6 md:p-8">
          <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {textSource === "openai" ? "真实 OpenAI 文本" : "快速 Mock 初版"}
              </div>
              <h1 className="text-3xl font-bold leading-tight text-[#101418] md:text-5xl">
                {result.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                {result.oneSentence}
              </p>
            </div>
            <Sparkles className="hidden shrink-0 text-[#12c8d8] md:block" size={34} />
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <Info label="专业" value={input.major} />
            <Info label="当前城市" value={input.currentCity} />
            <Info label="现实选择" value={input.realChoice} />
            <Info label="平行选择" value={input.alternativeChoice} />
            <Info label="创业" value={input.startedBusiness ? "是" : "否"} />
            <Info label="婚姻" value={input.married ? "是" : "否"} />
            <Info label="风险承受度" value={input.riskLevel || "中"} />
            <Info label="理想生活" value={input.idealLife || input.values.join("、")} />
          </div>

          {editable ? (
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#101418]">AI 升级</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    为了响应更快，问卷提交先生成初版；这里再按需调用真实 OpenAI。
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="secondary"
                    disabled={Boolean(actionLabel) || isPending}
                    onClick={() => runAction(`/api/simulations/${simulationId}/enhance-text`, "OpenAI 文本生成")}
                  >
                    <Wand2 size={17} />
                    真实文本
                  </Button>
                  <Button
                    disabled={Boolean(actionLabel) || isPending}
                    onClick={() => runAction(`/api/simulations/${simulationId}/generate-photo`, "AI 照片生成")}
                  >
                    <Camera size={17} />
                    真实照片
                  </Button>
                </div>
              </div>
              {actionLabel ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <RefreshCw className="animate-spin" size={16} />
                  {actionLabel}中，请稍候...
                </p>
              ) : null}
              {actionError ? <p className="mt-3 text-sm font-semibold text-red-600">{actionError}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg bg-[#101418] p-6 text-white shadow-2xl md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Camera className="text-[#b8f24b]" />
            <h2 className="text-xl font-bold">AI 生成照片</h2>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#1f2b31,#111418_58%,#2d3e40)]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="AI 生成的未来照片" className="h-full min-h-80 w-full object-cover" />
            ) : (
              <div className="relative flex h-full min-h-80 flex-col justify-end p-6">
                <div className="absolute right-5 top-5 h-24 w-24 rounded-full border border-[#12c8d8]/30" />
                <div className="absolute bottom-0 right-0 h-44 w-44 bg-[#ff6d5a]/20 blur-3xl" />
                <p className="relative text-sm uppercase text-white/50">Future Portrait Prompt</p>
                <p className="relative mt-3 text-lg font-semibold leading-7">{result.imagePrompt}</p>
                <p className="relative mt-5 text-sm leading-6 text-white/55">
                  未生成真实图片时展示提示词；点击“真实照片”后会保存到本地公开资源。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel icon={<TrendingUp size={20} />} title="财富 / 幸福 / 事业曲线">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.curve}>
                <defs>
                  <linearGradient id="wealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12c8d8" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#12c8d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="happiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6d5a" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="#ff6d5a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8dee6" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="wealth" name="财富" stroke="#12c8d8" fill="url(#wealth)" strokeWidth={3} />
                <Area type="monotone" dataKey="happiness" name="幸福" stroke="#ff6d5a" fill="url(#happiness)" strokeWidth={3} />
                <Area type="monotone" dataKey="career" name="事业" stroke="#7ccf26" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel icon={<Network size={20} />} title="社交圈变化">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.socialCircle}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8dee6" />
                <XAxis dataKey="label" interval={0} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="realWorld" name="现实宇宙" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="parallelWorld" name="平行宇宙" fill="#12c8d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-2">
            {result.socialCircle.map((item) => (
              <p key={item.label} className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-[#101418]">{item.label}：</span>
                {item.note}
              </p>
            ))}
          </div>
        </Panel>
      </section>

      {branchComparison.length > 0 ? (
        <Panel className="mt-6" title="多分支对比">
          <div className="grid gap-4 md:grid-cols-3">
            {branchComparison.map((branch) => (
              <div key={branch.name} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-bold text-[#101418]">{branch.name}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">{branch.choice}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <Score label="财富" value={branch.wealth} />
                  <Score label="幸福" value={branch.happiness} />
                  <Score label="事业" value={branch.career} />
                  <Score label="关系" value={branch.relationship} />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{branch.summary}</p>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {partnerResult ? (
        <Panel className="mt-6" icon={<Users size={20} />} title="双人平行人生">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="rounded-lg bg-[#101418] p-6 text-white">
              <p className="text-sm text-white/50">协同指数</p>
              <p className="mt-3 text-6xl font-black text-[#b8f24b]">{partnerResult.synergyScore}</p>
              <h3 className="mt-5 text-xl font-bold">{partnerResult.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">{partnerResult.summary}</p>
            </div>
            <div className="space-y-4">
              {partnerResult.timeline.map((item) => (
                <div key={item.year} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-black text-[#ff6d5a]">{item.year}</p>
                  <h4 className="mt-1 font-bold text-[#101418]">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      ) : null}

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <Panel title="平行人生时间线">
          <div className="space-y-5">
            {result.timeline.map((item) => (
              <div key={item.year} className="grid grid-cols-[64px_1fr] gap-4">
                <div className="text-lg font-black text-[#ff6d5a]">{item.year}</div>
                <div className="border-l border-slate-200 pl-5">
                  <h3 className="font-bold text-[#101418]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="人生总结">
          <div className="whitespace-pre-line text-base leading-8 text-slate-700">{result.summary}</div>
          <div className="mt-6 rounded-lg border border-[#ff6d5a]/30 bg-[#fff4f1] p-5">
            <h3 className="text-base font-bold text-[#101418]">命运转折点</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{result.turningPoint}</p>
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="来自平行宇宙自己的信">
          <div className="whitespace-pre-line text-base leading-8 text-slate-700">{result.letterFromParallelSelf}</div>
        </Panel>
        <Panel icon={<Share2 size={20} />} title="分享">
          <p className="text-base leading-7 text-slate-700">{result.shareText}</p>
          {shareSlug ? (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button onClick={copyShareUrl}>
                <Copy size={17} />
                复制分享链接
              </Button>
              <a
                href={`/share/${shareSlug}`}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 text-sm font-semibold text-[#101418] hover:bg-slate-50"
              >
                打开分享页
              </a>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">这是公开分享视图。</p>
          )}
        </Panel>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-bold text-[#101418]">{value}</p>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-[#12c8d8]" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-xs font-bold text-[#101418]">{value}</p>
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass-panel rounded-lg p-5 md:p-6 ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        {icon ? <span className="text-[#12c8d8]">{icon}</span> : null}
        <h2 className="text-xl font-bold text-[#101418]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
