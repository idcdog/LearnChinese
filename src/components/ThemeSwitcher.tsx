"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

const themes = [
  {
    id: "light" as const,
    name: "白天模式",
    icon: "☀️",
    description: "明亮清晰",
  },
  {
    id: "dark" as const,
    name: "夜间模式",
    icon: "🌙",
    description: "护眼舒适",
  },
  {
    id: "eye-care" as const,
    name: "护眼模式",
    icon: "🍃",
    description: "绿色柔和",
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 eye-care:border-green-700 eye-care:bg-green-50 eye-care:text-green-900 eye-care:hover:bg-green-100"
        aria-label="切换主题"
      >
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none">
          {currentTheme.icon}
        </span>
        <span className="hidden sm:inline">{currentTheme.name}</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full z-[60] mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 eye-care:border-green-700 eye-care:bg-green-50">
            <div className="p-2">
              <div className="mb-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 eye-care:text-green-700">
                选择主题模式
              </div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setShowMenu(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                    theme === t.id
                      ? "bg-slate-900 text-white dark:bg-slate-700 eye-care:bg-green-600 eye-care:text-white"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700 eye-care:text-green-900 eye-care:hover:bg-green-100"
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{t.name}</div>
                    <div
                      className={`text-xs ${
                        theme === t.id
                          ? "text-white/80"
                          : "text-slate-500 dark:text-slate-400 eye-care:text-green-700"
                      }`}
                    >
                      {t.description}
                    </div>
                  </div>
                  {theme === t.id && <span className="text-sm">✓</span>}
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 eye-care:border-green-200 eye-care:text-green-700">
              💡 主题会自动保存
            </div>
          </div>
        </>
      )}
    </div>
  );
}
