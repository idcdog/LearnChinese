import Link from "next/link";
import type { CharacterRecord } from "@/lib/characters";

type Props = {
  item: CharacterRecord;
  onAdd?: (char: string) => void;
  inBook?: boolean;
};

// 搜索结果卡片
export default function SearchResultCard({ item, onAdd, inBook }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-2xl font-bold text-slate-900">{item.char}</div>
        <div className="mt-1 text-sm text-slate-600">
          拼音：{item.pinyin.join("、")} · 部首：{item.radical} · {item.strokeCount} 画
        </div>
        <div className="mt-1 text-sm text-slate-500">{item.meanings.join("；")}</div>
      </div>
      <div className="flex w-full flex-col gap-2 text-sm sm:w-auto">
        <Link
          href={`/character?char=${encodeURIComponent(item.char)}`}
          className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-4 text-white transition hover:bg-slate-800 sm:h-auto sm:py-2"
        >
          查看详情
        </Link>
        {onAdd && (
          <button
            type="button"
            onClick={() => onAdd(item.char)}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-4 text-slate-700 ring-1 ring-slate-200 transition hover:ring-slate-300 sm:h-auto sm:py-2"
          >
            {inBook ? "已在生词本" : "加入生词本"}
          </button>
        )}
      </div>
    </div>
  );
}
