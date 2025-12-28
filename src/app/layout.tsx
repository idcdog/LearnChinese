import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "汉字学习工具站",
  description: "汉字查询、笔顺动画、生词本的轻量学习工具（纯静态）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
