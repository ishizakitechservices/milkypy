// Offline manager for Service Worker & Pyodide Core Pre-caching

const PYODIDE_VERSION = "v0.25.1";
export const PYODIDE_CACHE_NAME = `pyodide-cdn-cache-${PYODIDE_VERSION}`;

export const PYODIDE_CORE_FILES = [
  `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.mjs`,
  `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.asm.js`,
  `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.asm.wasm`,
  `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/python_stdlib.zip`,
  `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/repodata.json`,
  `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide-lock.json`,
];

export interface OfflineStatus {
  isServiceWorkerReady: boolean;
  isPyodideCached: boolean;
  cachedCount: number;
  totalCount: number;
  isDownloading: boolean;
  downloadProgress: number; // 0 - 100
}

type OfflineListener = (status: OfflineStatus) => void;
const listeners = new Set<OfflineListener>();

let currentStatus: OfflineStatus = {
  isServiceWorkerReady: false,
  isPyodideCached: false,
  cachedCount: 0,
  totalCount: PYODIDE_CORE_FILES.length,
  isDownloading: false,
  downloadProgress: 0,
};

function notify() {
  listeners.forEach((fn) => fn({ ...currentStatus }));
}

export function subscribeOfflineStatus(listener: OfflineListener) {
  listeners.add(listener);
  listener({ ...currentStatus });
  return () => {
    listeners.delete(listener);
  };
}

export async function checkOfflineStatus(): Promise<OfflineStatus> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return currentStatus;
  }

  currentStatus.isServiceWorkerReady =
    "serviceWorker" in navigator && !!navigator.serviceWorker.controller;

  try {
    // Check if running inside native Android APK container
    // In Capacitor, all Pyodide assets are served locally from device storage
    if (typeof window !== "undefined" && (window as any).Capacitor?.isNativePlatform?.()) {
      currentStatus.isPyodideCached = true;
      currentStatus.cachedCount = currentStatus.totalCount;
      currentStatus.downloadProgress = 100;
      notify();
      return currentStatus;
    }

    // Also check local asset availability via fast HEAD fetch
    try {
      const localCheck = await fetch("/pyodide/pyodide-lock.json", { method: "HEAD" });
      if (localCheck.ok || localCheck.status === 200 || localCheck.type === "basic") {
        currentStatus.isPyodideCached = true;
        currentStatus.cachedCount = currentStatus.totalCount;
        currentStatus.downloadProgress = 100;
        notify();
        return currentStatus;
      }
    } catch {}

    const cache = await caches.open(PYODIDE_CACHE_NAME);
    let matched = 0;
    for (const url of PYODIDE_CORE_FILES) {
      const match = await cache.match(url);
      if (match) {
        matched++;
      }
    }
    currentStatus.cachedCount = matched;
    currentStatus.isPyodideCached = matched >= 4; // Core files (mjs, js, wasm, stdlib)
    if (currentStatus.isPyodideCached && !currentStatus.isDownloading) {
      currentStatus.downloadProgress = 100;
    }
  } catch (e) {
    console.warn("Failed to check Pyodide cache:", e);
  }

  notify();
  return currentStatus;
}

export async function preloadPyodideForOffline(): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }

  if (currentStatus.isDownloading) return true;

  currentStatus.isDownloading = true;
  currentStatus.downloadProgress = 0;
  notify();

  try {
    const cache = await caches.open(PYODIDE_CACHE_NAME);
    let count = 0;

    for (let i = 0; i < PYODIDE_CORE_FILES.length; i++) {
      const url = PYODIDE_CORE_FILES[i];
      try {
        const existing = await cache.match(url);
        if (!existing) {
          const res = await fetch(url, { mode: "cors" });
          if (res.ok) {
            await cache.put(url, res.clone());
          }
        }
        count++;
      } catch (err) {
        console.warn(`Could not cache ${url} during prewarm:`, err);
      }
      currentStatus.downloadProgress = Math.round(
        ((i + 1) / PYODIDE_CORE_FILES.length) * 100
      );
      currentStatus.cachedCount = count;
      notify();
    }

    currentStatus.isDownloading = false;
    currentStatus.isPyodideCached = count >= 4;
    notify();
    return currentStatus.isPyodideCached;
  } catch (err) {
    console.error("Failed to preload Pyodide offline assets:", err);
    currentStatus.isDownloading = false;
    notify();
    return false;
  }
}

// Background auto-prewarm when browser is idle and online
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    // Check initial cache state
    setTimeout(() => {
      checkOfflineStatus().then((status) => {
        if (!status.isPyodideCached && navigator.onLine) {
          // Prewarm when idle
          if ("requestIdleCallback" in window) {
            (window as any).requestIdleCallback(() => {
              preloadPyodideForOffline();
            });
          } else {
            setTimeout(preloadPyodideForOffline, 3000);
          }
        }
      });
    }, 1500);
  });
}
