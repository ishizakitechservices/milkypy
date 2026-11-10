import React, { useState, useEffect } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import {
  subscribeOfflineStatus,
  preloadPyodideForOffline,
  OfflineStatus,
} from "../lib/offlineManager";
import { WifiOff, CloudDownload, CheckCircle2, RefreshCw } from "lucide-react";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    isServiceWorkerReady: false,
    isPyodideCached: false,
    cachedCount: 0,
    totalCount: 6,
    isDownloading: false,
    downloadProgress: 0,
  });

  useEffect(() => {
    return subscribeOfflineStatus((status) => {
      setOfflineStatus(status);
    });
  }, []);

  // When offline, display prominent banner
  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500/95 dark:bg-amber-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-white shadow-xl border border-amber-400/40 animate-in fade-in slide-in-from-bottom-2">
        <WifiOff className="w-4 h-4 text-white shrink-0 animate-pulse" />
        <div className="flex flex-col">
          <span className="font-semibold">Offline Mode Active</span>
          <span className="text-[10px] text-amber-100">
            {offlineStatus.isPyodideCached
              ? "Pyodide core cached. Full offline Python execution enabled."
              : "Using cached app assets. Pyodide executing from local storage."}
          </span>
        </div>
      </div>
    );
  }

  // When online, if downloading offline assets, show progress
  if (offlineStatus.isDownloading) {
    return (
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3.5 py-2 text-xs text-slate-200 shadow-xl">
        <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
        <div className="flex flex-col">
          <span className="font-medium text-slate-100">
            Caching Pyodide core for offline use...
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${offlineStatus.downloadProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {offlineStatus.downloadProgress}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
