"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Archive, LogIn, LogOut, Sparkles } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string;
} | null;

export function AppHeader() {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
      <Link href="/" className="flex items-center gap-3 text-[#101418]">
        <span className="grid size-9 place-items-center rounded-md bg-[#101418] text-white">
          <Sparkles size={18} />
        </span>
        <span className="text-base font-bold tracking-normal">Parallel Life</span>
      </Link>
      <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Link href="/questionnaire" className="hidden rounded-md px-3 py-2 hover:bg-slate-100 hover:text-[#101418] md:inline-flex">
          开始模拟
        </Link>
        <Link href="/history" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100 hover:text-[#101418]">
          <Archive size={16} />
          历史档案
        </Link>
        {user ? (
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100 hover:text-[#101418]">
            <LogOut size={16} />
            {user.name}
          </button>
        ) : (
          <Link href="/login" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100 hover:text-[#101418]">
            <LogIn size={16} />
            登录
          </Link>
        )}
      </nav>
    </header>
  );
}
