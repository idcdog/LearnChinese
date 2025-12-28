"use client";

import { useState } from "react";

interface DataManagerProps {
  vocabularyBook: string[];
  searchHistory: string[];
  onImport: (data: { vocabularyBook: string[]; searchHistory: string[] }) => void;
}

export default function DataManager({ vocabularyBook, searchHistory, onImport }: DataManagerProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleExport = () => {
    const data = {
      vocabularyBook,
      searchHistory,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `汉字学习数据-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowToast("数据导出成功");
    setTimeout(() => setShowToast(null), 3000);
    setShowMenu(false);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!data.vocabularyBook || !Array.isArray(data.vocabularyBook)) {
          throw new Error("Invalid data format");
        }

        if (data.vocabularyBook.length > 0 || data.searchHistory?.length > 0) {
          const confirmed = confirm(
            `确定要导入数据吗？\n\n将导入：\n生词本: ${data.vocabularyBook.length} 个\n搜索历史: ${data.searchHistory?.length || 0} 条\n\n当前数据将被覆盖！`
          );

          if (confirmed) {
            onImport({
              vocabularyBook: data.vocabularyBook || [],
              searchHistory: data.searchHistory || [],
            });
            setShowToast("数据导入成功");
            setTimeout(() => setShowToast(null), 3000);
          }
        }
      } catch (error) {
        alert("导入失败：文件格式错误");
      }
      setShowMenu(false);
    };
    input.click();
  };

  const handleClearAll = () => {
    const confirmed = confirm("确定要清空所有数据吗？此操作不可恢复！");
    if (confirmed) {
      onImport({ vocabularyBook: [], searchHistory: [] });
      setShowToast("数据已清空");
      setTimeout(() => setShowToast(null), 3000);
      setShowMenu(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label="数据管理"
        >
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none">
            💾
          </span>
          <span className="hidden sm:inline">数据管理</span>
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
              <div className="p-1">
                <button
                  onClick={handleExport}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span>📤</span>
                  <span>导出数据</span>
                </button>
                <button
                  onClick={handleImport}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span>📥</span>
                  <span>导入数据</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={handleClearAll}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <span>🗑️</span>
                  <span>清空数据</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 shadow-lg">
            <span className="mr-2">✓</span>
            {showToast}
          </div>
        </div>
      )}
    </>
  );
}
