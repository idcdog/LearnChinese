"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { getCharacterByChar } from "@/lib/characters";

// 生词本组件，使用 localStorage 做轻量持久化
export default function VocabularyBook() {
  const [book, setBook] = useLocalStorageState<string[]>("vocabulary-book", []);

  const entries = useMemo(
    () =>
      book
        .map((char) => getCharacterByChar(char))
        .filter(Boolean)
        .map((item) => item!),
    [book],
  );

  const remove = (char: string) => {
    setBook((prev) => prev.filter((c) => c !== char));
  };

  if (!entries.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="text-base font-semibold text-slate-900">生词本</div>
        <p className="mt-2 text-sm text-slate-500">还没有收藏的汉字，搜索后点击“加入生词本”即可收藏。</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-slate-900">生词本</div>
        <button
          type="button"
          className="text-xs text-slate-500 hover:text-red-500"
          onClick={() => setBook([])}
        >
          清空
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {entries.map((item) => (
          <div
            key={item.char}
            className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-lg font-semibold text-slate-900">{item.char}</div>
              <div className="text-xs text-slate-500">
                {item.pinyin.join("、")} · 部首 {item.radical} · {item.strokeCount} 画
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs sm:flex-row">
              <Link
                href={`/character?char=${encodeURIComponent(item.char)}`}
                className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800 sm:h-auto sm:px-3 sm:py-1"
              >
                查看
              </Link>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-slate-700 ring-1 ring-slate-200 hover:text-red-500 sm:h-auto sm:px-3 sm:py-1"
                onClick={() => remove(item.char)}
              >
                移除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
