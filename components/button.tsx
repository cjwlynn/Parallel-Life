"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
>;

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-[#101418] text-white hover:bg-[#22303a]",
        variant === "secondary" && "border border-slate-200 bg-white text-[#101418] hover:bg-slate-50",
        variant === "ghost" && "text-[#101418] hover:bg-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
