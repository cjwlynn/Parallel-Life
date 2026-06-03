"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/button";
import type { SimulationInput } from "@/lib/schemas";

const values = ["财富", "爱情", "自由", "安稳", "成就", "冒险"];
const personalities = ["理性规划者", "浪漫冒险家", "稳定生活派", "野心创业者", "佛系观察者"];

export default function QuestionnairePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<SimulationInput>({
    birthYear: 1998,
    currentCity: "上海",
    currentJob: "产品经理",
    major: "计算机科学",
    realChoice: "留在上海做稳定工作",
    alternativeChoice: "22 岁去了深圳加入创业团队",
    values: ["财富", "自由"],
    personality: "理性规划者",
    startedBusiness: false,
    married: false,
    partnerName: "",
    partnerMajor: "",
    partnerChoice: "",
    currentSituation: "工作稳定但成长速度变慢，想知道换城市会不会打开新机会",
    biggestConcern: "担心几年后收入和能力都没有明显变化",
    riskLevel: "中",
    idealLife: "有更高收入，也保留自由感和可控的生活节奏",
  });

  const canSubmit = useMemo(
    () =>
      form.birthYear &&
      form.currentCity &&
      form.currentJob &&
      form.major &&
      form.realChoice &&
      form.alternativeChoice &&
      form.values.length > 0 &&
      form.personality,
    [form],
  );

  function updateField<Key extends keyof SimulationInput>(key: Key, value: SimulationInput[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleValue(value: string) {
    setForm((current) => {
      const exists = current.values.includes(value);
      const nextValues = exists
        ? current.values.filter((item) => item !== value)
        : [...current.values, value].slice(0, 3);
      return { ...current, values: nextValues };
    });
  }

  async function submit() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "生成失败");
      }
      router.push(`/generating?id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl px-5 pb-16 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 py-4 text-sm font-semibold text-slate-600">
          <ArrowLeft size={17} />
          返回首页
        </Link>
        <section className="glass-panel rounded-lg p-5 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#101418] md:text-5xl">输入关键选择</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                提交后先快速生成本地初版，结果页可以继续一键升级真实 OpenAI 文本和真实 AI 照片。
              </p>
            </div>
            <div className="rounded-md bg-[#101418] px-4 py-3 text-sm font-bold text-white">
              快速生成，避免等待模型阻塞
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Field label="出生年份">
              <input
                type="number"
                min={1960}
                max={2010}
                value={form.birthYear}
                onChange={(event) => updateField("birthYear", Number(event.target.value))}
                className="input"
              />
            </Field>
            <Field label="当前城市">
              <input value={form.currentCity} onChange={(event) => updateField("currentCity", event.target.value)} className="input" />
            </Field>
            <Field label="当前职业">
              <input value={form.currentJob} onChange={(event) => updateField("currentJob", event.target.value)} className="input" />
            </Field>
            <Field label="所学专业">
              <input value={form.major} onChange={(event) => updateField("major", event.target.value)} className="input" />
            </Field>
            <Field label="现实选择">
              <textarea value={form.realChoice} onChange={(event) => updateField("realChoice", event.target.value)} className="input min-h-28 resize-none" />
            </Field>
            <Field label="平行选择">
              <textarea value={form.alternativeChoice} onChange={(event) => updateField("alternativeChoice", event.target.value)} className="input min-h-28 resize-none" />
            </Field>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold text-[#101418]">价值观，最多选择 3 个</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {values.map((value) => {
                const active = form.values.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleValue(value)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-bold transition ${
                      active
                        ? "border-[#101418] bg-[#101418] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {active ? <Check size={16} /> : null}
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <Field label="人格类型">
              <select value={form.personality} onChange={(event) => updateField("personality", event.target.value)} className="input">
                {personalities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <SwitchCard label="是否创业" value={form.startedBusiness} onChange={(value) => updateField("startedBusiness", value)} />
            <SwitchCard label="是否结婚" value={form.married} onChange={(value) => updateField("married", value)} />
          </div>

          <section className="mt-7 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-[#101418]">个人画像</h2>
            <p className="mt-1 text-sm text-slate-500">这里填得越具体，人生总结越贴近你，而不是泛泛而谈。</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="你现在的真实状态">
                <textarea
                  value={form.currentSituation}
                  onChange={(event) => updateField("currentSituation", event.target.value)}
                  className="input min-h-24 resize-none"
                />
              </Field>
              <Field label="你最担心什么">
                <textarea
                  value={form.biggestConcern}
                  onChange={(event) => updateField("biggestConcern", event.target.value)}
                  className="input min-h-24 resize-none"
                />
              </Field>
              <Field label="风险承受度">
                <select value={form.riskLevel} onChange={(event) => updateField("riskLevel", event.target.value as "低" | "中" | "高")} className="input">
                  <option>低</option>
                  <option>中</option>
                  <option>高</option>
                </select>
              </Field>
              <Field label="你理想中的生活">
                <textarea
                  value={form.idealLife}
                  onChange={(event) => updateField("idealLife", event.target.value)}
                  className="input min-h-24 resize-none"
                />
              </Field>
            </div>
          </section>

          <section className="mt-7 rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-3">
              <Users className="text-[#12c8d8]" />
              <div>
                <h2 className="text-lg font-bold text-[#101418]">双人平行人生</h2>
                <p className="mt-1 text-sm text-slate-500">可选。填写后结果页会生成你和 TA 的双人宇宙。</p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="TA 的名字">
                <input value={form.partnerName} onChange={(event) => updateField("partnerName", event.target.value)} className="input" />
              </Field>
              <Field label="TA 的专业/背景">
                <input value={form.partnerMajor} onChange={(event) => updateField("partnerMajor", event.target.value)} className="input" />
              </Field>
              <Field label="TA 的关键选择">
                <input value={form.partnerChoice} onChange={(event) => updateField("partnerChoice", event.target.value)} className="input" />
              </Field>
            </div>
          </section>

          {error ? <p className="mt-5 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}

          <div className="mt-8 flex justify-end">
            <Button disabled={!canSubmit || loading} onClick={submit}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
              生成平行人生
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#101418]">{label}</span>
      {children}
    </label>
  );
}

function SwitchCard({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-[#101418]">{label}</p>
      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-md border border-slate-200">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-10 text-sm font-bold ${value === option ? "bg-[#12c8d8] text-[#101418]" : "bg-white text-slate-500"}`}
          >
            {option ? "是" : "否"}
          </button>
        ))}
      </div>
    </div>
  );
}
