"use client";

import { useState, useEffect } from "react";

interface TextToSpeechProps {
  text: string;
  lang?: string;
  buttonText?: string;
  className?: string;
}

export default function TextToSpeech({
  text,
  lang = "zh-CN",
  buttonText,
  className,
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
  }, []);

  const speak = () => {
    if (!isSupported || !text) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // 稍慢一点，便于学习
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={speak}
      className={
        className ||
        "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 eye-care:border-green-700 eye-care:bg-green-50 eye-care:text-green-900 eye-care:hover:bg-green-100"
      }
      aria-label={isSpeaking ? "停止朗读" : "朗读"}
    >
      <span className="text-base">{isSpeaking ? "🔊" : "🔈"}</span>
      <span className="hidden sm:inline">{buttonText || (isSpeaking ? "停止" : "朗读")}</span>
    </button>
  );
}
