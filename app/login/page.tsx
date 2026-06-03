"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/button";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "操作失败");
      }
      router.push("/history");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto grid w-full max-w-5xl gap-8 px-5 pb-16 pt-8 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <section>
          <h1 className="text-4xl font-black leading-tight text-[#101418] md:text-6xl">登录后保存人生档案</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            登录不是商业化入口，只用于把你生成过的平行人生、OpenAI 升级结果和 AI 照片保存到历史档案。
          </p>
          <Link href="/questionnaire" className="mt-7 inline-flex text-sm font-bold text-[#0a8d99]">
            也可以先不登录，直接生成
          </Link>
        </section>

        <section className="glass-panel rounded-lg p-6 md:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-md border border-slate-200 bg-white p-1">
            <button
              onClick={() => setMode("login")}
              className={`min-h-11 rounded-md text-sm font-bold ${mode === "login" ? "bg-[#101418] text-white" : "text-slate-500"}`}
            >
              登录
            </button>
            <button
              onClick={() => setMode("register")}
              className={`min-h-11 rounded-md text-sm font-bold ${mode === "register" ? "bg-[#101418] text-white" : "text-slate-500"}`}
            >
              注册
            </button>
          </div>

          {mode === "register" ? (
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-bold text-[#101418]">昵称</span>
              <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
          ) : null}

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-bold text-[#101418]">邮箱</span>
            <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#101418]">密码</span>
            <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>

          {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

          <Button className="mt-6 w-full" disabled={loading} onClick={submit}>
            {mode === "login" ? "登录" : "注册并登录"}
          </Button>
        </section>
      </main>
    </div>
  );
}
