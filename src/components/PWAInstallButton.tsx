import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { Download, Smartphone, X, Check, Share2, MoreVertical } from "lucide-react";

interface PWAInstallButtonProps {
  compact?: boolean;
  className?: string;
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
  className = "",
  label,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isMobile, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState<"ios" | "android" | null>(null);
  const [installing, setInstalling] = useState(false);

  // If already running inside an installed standalone PWA, hide install prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      try {
        await install();
      } finally {
        setInstalling(false);
      }
      return;
    }

    if (isIOS) {
      setShowGuideModal("ios");
      return;
    }

    // Android / other mobile browser fallback
    if (isAndroid || isMobile) {
      setShowGuideModal("android");
      return;
    }

    // Desktop fallback
    setShowGuideModal("android");
  };

  const buttonLabel = label || (isIOS ? "Install App" : isInstallable ? "Install App" : "Install");

  return (
    <>
      <button
        onClick={handleInstallClick}
        disabled={installing}
        title="Install MilkyPy app on your phone, tablet, or desktop for offline coding"
        className={
          className ||
          (compact
            ? "flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-all shadow-xs cursor-pointer"
            : "flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer")
        }
      >
        {isIOS ? (
          <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
        ) : (
          <Download className="w-3.5 h-3.5 text-emerald-300" />
        )}
        <span>{installing ? "Installing..." : buttonLabel}</span>
      </button>

      {/* Guided Installation Modal for iOS Safari */}
      {showGuideModal === "ios" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold">Install MilkyPy on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-relaxed">
                  Tap the <strong className="text-white">Share</strong> icon (square with upward arrow) at the bottom toolbar of Safari.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-relaxed">
                  Scroll down the share sheet and tap <strong className="text-white">Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-relaxed">
                  Tap <strong className="text-white">Add</strong> in the top-right corner. MilkyPy will now launch like a native mobile app with complete offline support!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(null)}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Guided Installation Modal for Android / Chrome */}
      {showGuideModal === "android" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold">Install MilkyPy on Android / Mobile</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-relaxed">
                  Tap the <strong className="text-white">three dots (⋮)</strong> menu icon in the top-right corner of Chrome or your browser.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-relaxed">
                  Select <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-relaxed">
                  Confirm <strong className="text-white">Install</strong>. MilkyPy will be added to your home screen with zero latency and full offline capabilities!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(null)}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
