"use client";

import { useEffect, useState } from "react";

interface SaveIndicatorProps {
  lastSaved?: Date;
}

export default function SaveIndicator({ lastSaved }: SaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (lastSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {showSaved && (
        <div className="animate-fade-in rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800 shadow-lg">
          <span className="mr-1">✓</span>
          已自动保存
        </div>
      )}
    </div>
  );
}

export function useSaveIndicator() {
  const [lastSaved, setLastSaved] = useState<Date>();

  const triggerSave = () => {
    setLastSaved(new Date());
  };

  return { lastSaved, triggerSave };
}
