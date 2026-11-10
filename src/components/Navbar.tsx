import React, { useState } from "react";
import { AppMode, ThemeMode } from "../types";
import {
  BookOpen,
  Code2,
  Sparkles,
  Sun,
  Moon,
  Zap,
  User,
  LogOut,
  Milk,
  Gamepad2,
  Menu,
  X,
  ChevronRight,
  Terminal,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink,
  Wifi,
  WifiOff,
  CheckCircle2,
  HardDrive,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PWAInstallButton } from "./PWAInstallButton";
import { usePWAInstall } from "../hooks/usePWAInstall";
import {
  subscribeOfflineStatus,
  preloadPyodideForOffline,
  OfflineStatus,
} from "../lib/offlineManager";

interface NavbarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  pyodideStatus: "unloaded" | "loading" | "ready" | "error";
  pyodideProgress?: number;
  pyodideStage?: string;
  onOpenAiAssist: () => void;
  currentUser: string | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onReloadPyodide?: (simulateCrash?: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  theme,
  setTheme,
  pyodideStatus,
  pyodideProgress = 0,
  pyodideStage,
  onOpenAiAssist,
  currentUser,
  onOpenAuth,
  onLogout,
  onReloadPyodide,
}) => {
  const { isInstalled } = usePWAInstall();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRuntimeDetails, setShowRuntimeDetails] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    isServiceWorkerReady: false,
    isPyodideCached: false,
    cachedCount: 0,
    totalCount: 6,
    isDownloading: false,
    downloadProgress: 0,
  });

  React.useEffect(() => {
    return subscribeOfflineStatus((status) => {
      setOfflineStatus(status);
    });
  }, []);

  const handleSelectMode = (newMode: AppMode) => {
    setMode(newMode);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Slim Top-Edge Loading Progress Line for Pyodide (Never breaks header layout) */}
      {pyodideStatus === "loading" && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-amber-500 via-emerald-500 to-blue-500 transition-all duration-300"
            style={{ width: `${Math.max(5, Math.min(100, pyodideProgress))}%` }}
          />
        </div>
      )}

      {/* Main Top Header Bar */}
      <header className="h-14 border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#15171E]/80 backdrop-blur-md px-2 sm:px-4 lg:px-6 select-none sticky top-0 z-40">
        <div className="w-full max-w-[2400px] mx-auto h-full flex items-center justify-between gap-1 sm:gap-2">
          {/* Left Side: Brand Logo + Python Runtime Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Brand */}
            <button
              onClick={() => handleSelectMode("playground")}
              className="flex items-center gap-2 text-left focus:outline-hidden cursor-pointer group shrink-0 py-1"
              title="MilkyPy Python IDE"
            >
              <div className="w-8 h-8 bg-linear-to-br from-[#8BBEFF] to-[#65D9D0] dark:from-[#8BBEFF] dark:to-[#A98BFF] rounded-xl flex items-center justify-center text-[#08090D] font-black shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Milk className="w-4.5 h-4.5 fill-[#08090D]/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm xs:text-base sm:text-lg font-extrabold tracking-tight leading-none text-slate-900 dark:text-[#F3F4F6]">
                  Milky<span className="text-[#0284c7] dark:text-[#8BBEFF]">Py</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-[#BFC4CE] leading-none hidden md:inline mt-0.5">
                  Python IDE & Lessons
                </span>
              </div>
            </button>

            {/* Python Status Pill */}
            <button
              onClick={() => setShowRuntimeDetails(!showRuntimeDetails)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                pyodideStatus === "ready"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-[#65D9A3]"
                  : pyodideStatus === "loading"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-[#F2BC72]"
                  : pyodideStatus === "error"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-[#F08089]"
                  : "bg-slate-100 dark:bg-[#252933] border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#BFC4CE]"
              }`}
              title="Python runtime status"
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  pyodideStatus === "ready"
                    ? "bg-[#65D9A3] skeuo-indicator text-[#65D9A3]"
                    : pyodideStatus === "loading"
                    ? "bg-[#F2BC72] animate-pulse"
                    : pyodideStatus === "error"
                    ? "bg-[#F08089]"
                    : "bg-[#686D78]"
                }`}
              />
              <span className="text-[11px] font-bold hidden min-[480px]:inline">
                {pyodideStatus === "ready"
                  ? "Ready"
                  : pyodideStatus === "loading"
                  ? "Loading..."
                  : "Python"}
              </span>
            </button>
          </div>

          {/* Center: Desktop & Tablet Mode Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-[#252933]/70 rounded-xl border border-slate-200/80 dark:border-white/10 shrink-0">
            {/* Playground Mode */}
            <button
              id="tab-playground-mode"
              onClick={() => setMode("playground")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "playground"
                  ? "bg-white dark:bg-[#15171E] border border-slate-200 dark:border-white/15 shadow-xs text-blue-600 dark:text-[#8BBEFF]"
                  : "text-slate-600 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-[#F3F4F6]"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span>Playground</span>
            </button>

            {/* Lessons Mode */}
            <button
              id="tab-study-mode"
              onClick={() => setMode("study")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "study"
                  ? "bg-white dark:bg-[#15171E] border border-slate-200 dark:border-white/15 shadow-xs text-blue-600 dark:text-[#8BBEFF]"
                  : "text-slate-600 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-[#F3F4F6]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Lessons</span>
            </button>

            {/* Games Lab Mode */}
            <button
              id="tab-games-mode"
              onClick={() => setMode("games")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "games"
                  ? "bg-white dark:bg-[#15171E] border border-slate-200 dark:border-white/15 shadow-xs text-purple-600 dark:text-[#A98BFF]"
                  : "text-slate-600 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-[#F3F4F6]"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#A98BFF] shrink-0" />
              <span className="hidden lg:inline">Games Lab</span>
              <span className="lg:hidden">Games</span>
            </button>
          </nav>

          {/* Right Side: Primary Mobile/Desktop Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Student Auth Badge / Login Trigger (Visible on sm+ and inside mobile drawer) */}
            <div className="hidden sm:flex items-center">
              {currentUser ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/80 dark:bg-[#252933] border border-blue-200/80 dark:border-white/10 text-xs font-mono font-bold text-blue-700 dark:text-[#8BBEFF] shrink-0">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF] shrink-0" />
                  <span className="truncate">{currentUser}</span>
                  <button
                    onClick={onLogout}
                    className="ml-0.5 p-0.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                    title="Log Out Student"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#252933] hover:bg-slate-200 dark:hover:bg-[#353A46] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-[#F3F4F6] transition-all cursor-pointer shrink-0 touch-target"
                  title="Student Login / Cloud Sync"
                >
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF] shrink-0" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Ask AI Assistant Trigger */}
            <button
              id="btn-ai-assist"
              onClick={onOpenAiAssist}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#8BBEFF] dark:to-[#A98BFF] text-white dark:text-[#08090D] text-xs font-extrabold shadow-xs hover:opacity-95 transition-all cursor-pointer shrink-0 touch-target"
              title="Ask AI Assistant (Ctrl+K)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-[#08090D]" />
              <span className="inline">Ask AI</span>
            </button>

            {/* Theme Toggle (Light / Dark) - Visible on sm+ or mobile drawer */}
            <button
              id="btn-theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-[#F3F4F6] bg-slate-100 hover:bg-slate-200 dark:bg-[#252933] dark:hover:bg-[#353A46] border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shrink-0 touch-target items-center justify-center"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-[#F2BC72]" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Global Shortcuts & Help Popover */}
            <div className="relative group/help shrink-0 hidden lg:block">
              <button
                id="btn-global-help"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-[#F3F4F6] bg-slate-100 hover:bg-slate-200 dark:bg-[#252933] dark:hover:bg-[#353A46] border border-slate-200 dark:border-white/10 transition-colors cursor-help shrink-0 flex items-center justify-center"
                title="Keyboard Shortcuts & Help Reference"
              >
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-[#8BBEFF]" />
              </button>
              
              {/* Hover Popover dropdown */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#15171E] border border-slate-200 dark:border-white/12 rounded-2xl p-4 shadow-2xl space-y-3 opacity-0 pointer-events-none group-hover/help:opacity-100 group-hover/help:pointer-events-auto transition-all duration-200 z-50">
                <h4 className="text-xs font-black font-sans text-slate-900 dark:text-[#F3F4F6] border-b border-slate-100 dark:border-white/10 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8BBEFF]" />
                  <span>Keyboard Shortcuts</span>
                </h4>
                <div className="space-y-2 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-[#BFC4CE]">Run Python Code</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 rounded text-slate-700 dark:text-[#F3F4F6] font-mono font-bold text-[10px]">Ctrl+Enter</kbd>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-[#BFC4CE]">Ask Milky AI Assist</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 rounded text-slate-700 dark:text-[#F3F4F6] font-mono font-bold text-[10px]">Ctrl+K</kbd>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-[#BFC4CE]">Trigger Autocomplete</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 rounded text-slate-700 dark:text-[#F3F4F6] font-mono font-bold text-[10px]">Ctrl+Space</kbd>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-[#BFC4CE]">Format Code</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 rounded text-slate-700 dark:text-[#F3F4F6] font-mono font-bold text-[10px]">Alt+Shift+F</kbd>
                  </div>
                </div>
                <p className="text-[10px] font-sans text-slate-400 dark:text-[#BFC4CE]/70 leading-normal border-t border-slate-100 dark:border-white/10 pt-2">
                  Tip: Hover over functions in the editor to inspect signatures and type hints instantly!
                </p>
              </div>
            </div>

            {/* Mobile Drawer Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-[#F3F4F6] bg-slate-100 hover:bg-slate-200 dark:bg-[#252933] dark:hover:bg-[#353A46] border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shrink-0 touch-target flex items-center justify-center"
              aria-label="Toggle navigation drawer"
              title="Open navigation menu drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Runtime Details Popover Dropdown */}
      <AnimatePresence>
        {showRuntimeDetails && (
          <div className="fixed inset-0 z-50" onClick={() => setShowRuntimeDetails(false)}>
            <div className="absolute top-14 left-3 sm:left-4 z-50">
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onClick={(e) => e.stopPropagation()}
                className="w-72 sm:w-80 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-3 font-sans text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Python Status
                    </span>
                  </div>
                  <button
                    onClick={() => setShowRuntimeDetails(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {pyodideStatus === "ready" ? (
                  <div className="space-y-3 py-1">
                    <div>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Python is Ready!
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed mt-1">
                        In-browser WebAssembly engine with local cache storage is fully active. Code executes immediately on-device!
                      </p>
                    </div>

                    {/* Offline Readiness Card */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                          <span>Offline Python Support</span>
                        </div>
                        {offlineStatus.isPyodideCached ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready Offline
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-500 font-medium">
                            {offlineStatus.cachedCount}/{offlineStatus.totalCount} Cached
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {offlineStatus.isPyodideCached
                          ? "Pyodide core WASM & Python standard library are stored locally in Cache API."
                          : "Core Pyodide files are downloading to enable full offline coding."}
                      </p>
                      {!offlineStatus.isPyodideCached && (
                        <button
                          onClick={() => preloadPyodideForOffline()}
                          disabled={offlineStatus.isDownloading}
                          className="w-full mt-1 py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {offlineStatus.isDownloading
                            ? `Caching Pyodide (${offlineStatus.downloadProgress}%)...`
                            : "Pre-Cache Pyodide for Offline"}
                        </button>
                      )}
                    </div>
                    {onReloadPyodide && (
                      <button
                        onClick={() => {
                          onReloadPyodide(true);
                        }}
                        className="w-full py-1.5 px-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 rounded-xl text-[10px] font-bold text-rose-700 dark:text-rose-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Simulate 75% Allocation Crash</span>
                      </button>
                    )}
                  </div>
                ) : pyodideStatus === "loading" ? (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200/70 dark:border-amber-900/60 space-y-2">
                    <div className="flex justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
                      <span>{pyodideStage || "Getting Python ready..."}</span>
                      <span>{pyodideProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-amber-200 dark:bg-amber-900/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${pyodideProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
                      WebAssembly environment files are loaded locally from browser cache API for sub-second, network-free loads on subsequent visits!
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                        <X className="w-4 h-4 text-rose-500" /> Initialization Failed {pyodideProgress === 75 ? "at 75%" : ""}
                      </p>
                      <p className="text-[11px] text-rose-600/90 dark:text-rose-400/90 leading-normal">
                        {pyodideStage || "WebAssembly core memory allocation failed (Out of Memory/OOM error)."}
                      </p>
                    </div>
                    
                    {onReloadPyodide && (
                      <button
                        onClick={() => {
                          onReloadPyodide(false);
                        }}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reload Python Runtime</span>
                      </button>
                    )}
                    
                    <p className="text-[9px] text-slate-400 leading-tight">
                      Note: While WASM is reloading, you can continue coding. Milky AI Tutor seamlessly bridges to safe native backups if offline.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation Menu (Full slide-over sheet for phones & tablets) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header in Drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <Milk className="w-4 h-4 fill-white/20" />
                    </div>
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                      Milky AI Tutor Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Student Auth Section */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono font-bold text-xs">
                            {currentUser.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Student ID: {currentUser}
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              Cloud Sync Active
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Login with your student ID (e.g. m162) to sync your Python scripts to the cloud.
                      </p>
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Student Login / Sign In</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary Mode Navigation Links */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Application Modes
                  </span>

                  <button
                    onClick={() => handleSelectMode("playground")}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      mode === "playground"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Code2 className="w-4 h-4" />
                      <span className="text-xs">Python Playground</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  <button
                    onClick={() => handleSelectMode("study")}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      mode === "study"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs">Interactive Lessons</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>


                  <button
                    onClick={() => handleSelectMode("games")}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      mode === "games"
                        ? "bg-purple-600 text-white font-bold shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Gamepad2 className="w-4 h-4 text-purple-400" />
                      <span className="text-xs">Games Lab (Arcade)</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold uppercase">
                      Soon
                    </span>
                  </button>

                  {/* Ask AI Assistant Trigger */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAiAssist();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Ask AI Assistant</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">
                      Help
                    </span>
                  </button>
                </div>

                {/* PWA App Installation Trigger */}
                {!isInstalled && (
                  <div className="pt-2">
                    <PWAInstallButton />
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Color Theme:</span>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                    <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 text-center">
                  Made for Python learners of all ages
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-[#15171E]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-white/10 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl">
        {/* Playground Tab */}
        <button
          onClick={() => handleSelectMode("playground")}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer touch-target ${
            mode === "playground"
              ? "text-blue-600 dark:text-[#8BBEFF] font-bold bg-blue-50/60 dark:bg-white/5"
              : "text-slate-500 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
          }`}
        >
          <Code2 className="w-5 h-5 mb-0.5 shrink-0" />
          <span className="text-[10px] font-semibold leading-tight truncate">Code</span>
        </button>

        {/* Lessons Tab */}
        <button
          onClick={() => handleSelectMode("study")}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer touch-target ${
            mode === "study"
              ? "text-blue-600 dark:text-[#8BBEFF] font-bold bg-blue-50/60 dark:bg-white/5"
              : "text-slate-500 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5 shrink-0" />
          <span className="text-[10px] font-semibold leading-tight truncate">Lessons</span>
        </button>

        {/* Games Lab Tab */}
        <button
          onClick={() => handleSelectMode("games")}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer touch-target ${
            mode === "games"
              ? "text-purple-600 dark:text-[#A98BFF] font-bold bg-purple-50/60 dark:bg-white/5"
              : "text-slate-500 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
          }`}
        >
          <Gamepad2 className="w-5 h-5 mb-0.5 shrink-0" />
          <span className="text-[10px] font-semibold leading-tight truncate">Games</span>
        </button>

        {/* More / Menu Drawer Trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-500 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6] transition-all cursor-pointer touch-target"
        >
          <Menu className="w-5 h-5 mb-0.5 shrink-0" />
          <span className="text-[10px] font-semibold leading-tight truncate">Menu</span>
        </button>
      </nav>
    </>
  );
};
