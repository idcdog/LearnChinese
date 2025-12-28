import Link from "next/link";
import { Suspense } from "react";
import CharacterQueryClient from "./CharacterQueryClient";

export default function CharacterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            汉字学习工具站
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            返回搜索
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 shadow-sm backdrop-blur">
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
