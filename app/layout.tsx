import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parallel Life | AI 平行人生模拟器",
  description: "输入关键人生选择，生成另一个宇宙里的时间线、曲线和人生报告。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
