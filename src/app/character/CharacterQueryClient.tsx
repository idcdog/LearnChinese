"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import CharacterDetailClient from "@/components/CharacterDetailClient";
import { getCharacterByChar } from "@/lib/characters";

function getCharFromSearchParams(value: string | null) {
  if (!value) return "";
  return value.trim();
}

export default function CharacterQueryClient() {
  const searchParams = useSearchParams();
  const char = getCharFromSearchParams(searchParams.get("char"));

  const data = useMemo(() => {
    if (!char) return undefined;
    return getCharacterByChar(char);
  }, [char]);

  if (!char) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 eye-care:border-green-300 eye-care:bg-green-50/70 eye-care:text-green-800">
        未指定要查看的汉字，请从首页搜索后进入详情页。
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 eye-care:border-green-300 eye-care:bg-green-50/70">
        <div className="text-base font-semibold text-slate-900 dark:text-slate-100 eye-care:text-green-900">未找到汉字</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 eye-care:text-green-800">当前数据集中未包含“{char}”，请返回搜索页尝试其他汉字。</p>
      </div>
    );
  }

  return <CharacterDetailClient data={data} />;
}
