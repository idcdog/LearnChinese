"use client";

import { useEffect, useState } from "react";

interface PWAInstallProps {
  onUpdate?: () => void;
}

export default function PWAInstall({ onUpdate }: PWAInstallProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered", reg);
          setRegistration(reg);

          // Check for updates
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  onUpdate?.();
                }
              });
            }
          });

          // Check for updates every hour
          setInterval(() => {
            reg.update();
          }, 60 * 60 * 1000);
        })
        .catch((err) => {
          console.error("Service Worker registration failed", err);
        });
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [onUpdate]);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallButton(false);
    }

    setInstallPrompt(null);
  };

  return (
    <>
      {/* Update notification */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-slide-up">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔄</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">新版本可用</div>
                <p className="mt-1 text-sm text-slate-600">应用已更新，刷新以获取最新功能</p>
              </div>
              <button
                onClick={handleUpdate}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                刷新
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed left-4 top-4 z-50 animate-slide-down">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <span className="mr-2">📡</span>
            离线模式
          </div>
        </div>
      )}

      {/* Install app button */}
      {showInstallButton && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-slide-up">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📱</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">安装应用</div>
                <p className="mt-1 text-sm text-slate-600">添加到主屏幕，离线也能使用</p>
              </div>
              <button
                onClick={handleInstall}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                安装
              </button>
              <button
                onClick={() => setShowInstallButton(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
