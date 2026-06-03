import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="glass-panel max-w-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-black text-[#101418]">记录不存在</h1>
        <p className="mt-4 text-slate-600">这个平行宇宙可能已经消失，或链接地址不正确。</p>
        <Link
          href="/questionnaire"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-[#101418] px-5 text-sm font-bold text-white"
        >
          重新生成
        </Link>
      </section>
    </main>
  );
}
