"use client";

import Link from "next/link";
import { useState } from "react";
import SearchResultCard from "@/components/SearchResultCard";
import VocabularyBook from "@/components/VocabularyBook";
import PWAInstall from "@/components/PWAInstall";
import DataManager from "@/components/DataManager";
import ReviewSystem from "@/components/ReviewSystem";
import SaveIndicator, { useSaveIndicator } from "@/components/SaveIndicator";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import {
  recommendedList,
  searchCharacters,
  type CharacterRecord,
} from "@/lib/characters";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CharacterRecord[]>([]);
  const [history, setHistory] = useLocalStorageState<string[]>("search-history", []);
  const [book, setBook] = useLocalStorageState<string[]>("vocabulary-book", []);
  const { lastSaved, triggerSave } = useSaveIndicator();

  const handleSearch = (value?: string) => {
    const keyword = (value ?? query).trim();
    if (!keyword) {
      setResults([]);
      return;
    }
    const found = searchCharacters(keyword);
    setResults(found);
    setHistory((prev) => {
      const next = [keyword, ...prev.filter((item) => item !== keyword)].slice(0, 8);
      triggerSave();
      return next;
    });
  };

  const addToBook = (char: string) => {
    setBook((prev) => {
      if (prev.includes(char)) return prev;
      triggerSave();
      return [char, ...prev].slice(0, 30);
    });
  };

  const handleDataImport = (data: { vocabularyBook: string[]; searchHistory: string[] }) => {
    setBook(data.vocabularyBook);
    setHistory(data.searchHistory);
    triggerSave();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 eye-care:from-green-50 eye-care:via-green-50/50 eye-care:to-green-100">
      <PWAInstall />
      <SaveIndicator lastSaved={lastSaved} />

      <header className="relative z-50 border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 eye-care:border-green-300 eye-care:bg-green-50/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-100 eye-care:text-green-900">
            汉字学习工具站
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden gap-4 text-sm text-slate-600 dark:text-slate-300 eye-care:text-green-800 sm:flex">
              <a href="#search" className="hover:text-slate-900 dark:hover:text-slate-100 eye-care:hover:text-green-900">
                汉字查询
              </a>
              <a href="#review" className="hover:text-slate-900 dark:hover:text-slate-100 eye-care:hover:text-green-900">
                智能复习
              </a>
              <a href="#vocabulary" className="hover:text-slate-900 dark:hover:text-slate-100 eye-care:hover:text-green-900">
                生词本
              </a>
            </div>
            <ThemeSwitcher />
            <DataManager
              vocabularyBook={book}
              searchHistory={history}
              onImport={handleDataImport}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-700 px-4 py-8 text-white shadow-xl sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold sm:text-4xl">查汉字 · 看笔顺 · 记生词</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-white/80">
                支持汉字与拼音搜索，内置笔画顺序动画、生词本与搜索历史。
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-white/80">
                <span className="rounded-full bg-white/10 px-3 py-1">拼音/汉字搜索</span>
                <span className="rounded-full bg-white/10 px-3 py-1">笔顺动画</span>
                <span className="rounded-full bg-white/10 px-3 py-1">生词本</span>
                <span className="rounded-full bg-white/10 px-3 py-1">搜索历史</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-4 text-sm backdrop-blur sm:px-5">
              <div className="text-xs text-white/70">快速导航</div>
              <div className="mt-2 flex flex-col gap-2">
                <Link href="#search" className="text-white hover:underline">
                  立即搜索
                </Link>
                <Link href="#recommend" className="text-white hover:underline">
                  查看推荐
                </Link>
                <Link href="#vocabulary" className="text-white hover:underline">
                  打开生词本
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="search"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">汉字/拼音搜索</div>
              <p className="text-sm text-slate-500">支持输入汉字或拼音进行搜索。</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder='输入汉字或拼音，如"学"或"xue"'
              className="h-16 flex-1 rounded-xl border-2 border-slate-200 bg-white px-5 text-lg text-slate-900 outline-none ring-slate-300 transition placeholder:text-slate-500 focus:border-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-slate-500 eye-care:border-green-200 eye-care:bg-green-50 eye-care:text-green-900 eye-care:placeholder:text-green-700/70 eye-care:focus:border-green-300 sm:h-12 sm:text-base"
            />
            <button
              type="button"
              onClick={() => handleSearch()}
              className="h-16 rounded-xl bg-slate-900 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95 sm:h-12 sm:px-5 sm:text-sm"
            >
              搜索
            </button>
          </div>
          {history.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="text-xs font-medium text-slate-500">最近搜索：</span>
              {history.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    handleSearch(item);
                  }}
                  className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 transition hover:bg-slate-200"
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-xs text-slate-400 underline hover:text-slate-600"
              >
                清除
              </button>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">搜索结果</div>
            <div className="text-xs text-slate-500">
              {results.length ? `共 ${results.length} 条` : "输入关键词后查看结果"}
            </div>
          </div>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-5 text-center text-sm text-slate-500 sm:p-6">
              暂无结果，请尝试输入“学”“海”“树”等示例。
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((item) => (
                <SearchResultCard
                  key={item.char}
                  item={item}
                  onAdd={addToBook}
                  inBook={book.includes(item.char)}
                />
              ))}
            </div>
          )}
        </section>

        <section id="recommend" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">每日推荐</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendedList.map((item) => (
              <div key={item.char} className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-slate-900">{item.char}</div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
                    HSK {item.hskLevel ?? "—"}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {item.pinyin.join("、")} · 部首 {item.radical} · {item.strokeCount} 画
                </div>
                <div className="mt-1 text-sm text-slate-500">{item.meanings.join("；")}</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                  {item.words.slice(0, 3).map((w) => (
                    <span key={w} className="rounded-full bg-slate-100 px-2 py-1">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <Link
                    href={`/character?char=${encodeURIComponent(item.char)}`}
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    aria-label={`查看 ${item.char} 的详情`}
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="review">
          <ReviewSystem />
        </section>

        <section id="vocabulary">
          <VocabularyBook />
        </section>
      </main>
    </div>
  );
}
