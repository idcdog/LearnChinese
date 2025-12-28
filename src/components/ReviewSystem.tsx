"use client";

import { useLocalStorageState } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { useMemo } from "react";
import { getCharacterByChar } from "@/lib/characters";

interface ReviewRecord {
  char: string;
  lastReviewDate: string;
  reviewCount: number;
  nextReviewDate: string;
}

// 艾宾浩斯遗忘曲线复习间隔（天）
const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30, 60];

export function useReviewSystem() {
  const [records, setRecords] = useLocalStorageState<ReviewRecord[]>("review-records", []);

  const addToReview = (char: string) => {
    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + REVIEW_INTERVALS[0]);

    setRecords((prev) => {
      const existing = prev.find((r) => r.char === char);
      if (existing) return prev;

      return [
        ...prev,
        {
          char,
          lastReviewDate: now.toISOString(),
          reviewCount: 0,
          nextReviewDate: nextDate.toISOString(),
        },
      ];
    });
  };

  const markAsReviewed = (char: string) => {
    const now = new Date();

    setRecords((prev) =>
      prev.map((record) => {
        if (record.char !== char) return record;

        const newCount = Math.min(record.reviewCount + 1, REVIEW_INTERVALS.length - 1);
        const nextDate = new Date(now);
        nextDate.setDate(nextDate.getDate() + REVIEW_INTERVALS[newCount]);

        return {
          ...record,
          lastReviewDate: now.toISOString(),
          reviewCount: newCount,
          nextReviewDate: nextDate.toISOString(),
        };
      })
    );
  };

  const removeFromReview = (char: string) => {
    setRecords((prev) => prev.filter((r) => r.char !== char));
  };

  const getDueReviews = () => {
    const now = new Date();
    return records.filter((record) => new Date(record.nextReviewDate) <= now);
  };

  return {
    records,
    addToReview,
    markAsReviewed,
    removeFromReview,
    getDueReviews,
  };
}

export default function ReviewSystem() {
  const { records, markAsReviewed, removeFromReview, getDueReviews } = useReviewSystem();
  const dueReviews = useMemo(() => getDueReviews(), [records]);

  const dueCharacters = useMemo(
    () =>
      dueReviews
        .map((r) => getCharacterByChar(r.char))
        .filter(Boolean)
        .map((item) => item!),
    [dueReviews]
  );

  const upcomingReviews = useMemo(() => {
    const now = new Date();
    return records
      .filter((record) => new Date(record.nextReviewDate) > now)
      .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
      .slice(0, 5);
  }, [records]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "明天";
    if (diffDays === -1) return "昨天";
    if (diffDays > 0) return `${diffDays}天后`;
    return `${Math.abs(diffDays)}天前`;
  };

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="text-base font-semibold text-slate-900">智能复习</div>
        <p className="mt-2 text-sm text-slate-500">
          还没有复习计划。在汉字详情页点击"加入复习"，系统将根据艾宾浩斯遗忘曲线提醒您复习。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Due reviews */}
      {dueReviews.length > 0 && (
        <div className="rounded-xl border-2 border-cyan-200 bg-cyan-50/50 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⏰</span>
              <div className="font-semibold text-cyan-900">待复习 ({dueReviews.length})</div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {dueCharacters.map((item) => (
              <div
                key={item.char}
                className="flex items-center justify-between rounded-lg border border-cyan-200 bg-white px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl font-bold text-slate-900">{item.char}</div>
                  <div className="text-xs text-slate-500">{item.pinyin.join("、")}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  <Link
                    href={`/character?char=${encodeURIComponent(item.char)}`}
                    className="rounded-full bg-cyan-600 px-3 py-1 text-white hover:bg-cyan-700"
                  >
                    开始复习
                  </Link>
                  <button
                    onClick={() => markAsReviewed(item.char)}
                    className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    标记已复习
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming reviews */}
      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold text-slate-900">复习计划</div>
          <div className="text-xs text-slate-500">共 {records.length} 个</div>
        </div>

        {upcomingReviews.length > 0 && (
          <div className="mt-3 space-y-2">
            {upcomingReviews.map((record) => {
              const char = getCharacterByChar(record.char);
              if (!char) return null;

              return (
                <div
                  key={record.char}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-slate-900">{char.char}</div>
                    <div className="text-xs text-slate-500">{char.pinyin.join("、")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-500">{formatDate(record.nextReviewDate)}</div>
                    <button
                      onClick={() => removeFromReview(record.char)}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      移除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
