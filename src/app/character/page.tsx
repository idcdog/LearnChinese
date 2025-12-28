import Link from "next/link";
import { Suspense } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import CharacterQueryClient from "./CharacterQueryClient";

export default function CharacterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 eye-care:from-green-50 eye-care:via-green-50/50 eye-care:to-green-100">
      <header className="relative z-50 border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 eye-care:border-green-300 eye-care:bg-green-50/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-100 eye-care:text-green-900">
            汉字学习工具站
          </Link>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Link href="/" className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 eye-care:text-green-800 eye-care:hover:text-green-900">
              返回搜索
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 eye-care:border-green-300 eye-care:bg-green-50/70 eye-care:text-green-800">
              正在加载…
            </div>
          }
        >
          <CharacterQueryClient />
        </Suspense>
      </main>
    </div>
  );
}
