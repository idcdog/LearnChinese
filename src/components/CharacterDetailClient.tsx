"use client";

import Link from "next/link";
import StrokeAnimation from "@/components/StrokeAnimation";
import TextToSpeech from "@/components/TextToSpeech";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { useReviewSystem } from "@/components/ReviewSystem";
import type { CharacterRecord } from "@/lib/characters";

type Props = {
  data: CharacterRecord;
};

export default function CharacterDetailClient({ data }: Props) {
  const [book, setBook] = useLocalStorageState<string[]>("vocabulary-book", []);
  const { records, addToReview, removeFromReview } = useReviewSystem();

  const inBook = book.includes(data.char);
  const inReview = records.some((r) => r.char === data.char);

  const toggleBook = () => {
    setBook((prev) => {
      if (prev.includes(data.char)) return prev.filter((c) => c !== data.char);
      return [data.char, ...prev].slice(0, 30);
    });
  };

  const toggleReview = () => {
    if (inReview) {
      removeFromReview(data.char);
    } else {
      addToReview(data.char);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-slate-500">汉字详情</div>
          <div className="mt-2 text-4xl font-bold text-slate-900">{data.char}</div>
          <div className="mt-2 text-sm text-slate-600">
            拼音：{data.pinyin.join("、")} · 部首：{data.radical} · {data.strokeCount} 画
          </div>
          <div className="mt-1 text-sm text-slate-500">{data.meanings.join("；")}</div>
          <div className="mt-3 flex gap-2 text-xs text-slate-500">
            {data.frequencyRank && <span className="rounded-full bg-slate-100 px-3 py-1">字频 #{data.frequencyRank}</span>}
            {data.hskLevel && <span className="rounded-full bg-slate-100 px-3 py-1">HSK {data.hskLevel}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <TextToSpeech
            text={`${data.char}，${data.pinyin.join("，")}`}
            buttonText="朗读"
          />
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            返回搜索
          </Link>
          <button
            type="button"
            onClick={toggleReview}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${
              inReview
                ? "border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>{inReview ? "⏰" : "📅"}</span>
            <span className="hidden sm:inline">{inReview ? "已加入复习" : "加入复习"}</span>
          </button>
          <button
            type="button"
            onClick={toggleBook}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-95"
          >
            {inBook ? "移出生词本" : "加入生词本"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="text-lg font-semibold text-slate-900">笔画顺序</div>
          <p className="text-sm text-slate-500">基于 hanzi-writer，默认循环播放。</p>
          <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-inner">
            <StrokeAnimation char={data.char} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="text-lg font-semibold text-slate-900">释义</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {data.meanings.map((item) => (
                <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="text-lg font-semibold text-slate-900">常用词组</div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
              {data.words.map((w) => (
                <span key={w} className="rounded-full bg-slate-100 px-3 py-1">
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="text-lg font-semibold text-slate-900">示例句子</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {data.sentences.map((s) => (
                <li key={s} className="rounded-lg bg-slate-50 px-3 py-2">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

