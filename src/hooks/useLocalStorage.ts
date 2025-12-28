import { useState } from "react";

// 简单的 localStorage 状态封装，避免重复代码
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : defaultValue;
    } catch (error) {
      console.warn("读取本地数据失败", error);
      return defaultValue;
    }
  });

  const updateState = (val: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (error) {
        console.warn("写入本地数据失败", error);
      }
      return next;
    });
  };

  return [state, updateState];
}
