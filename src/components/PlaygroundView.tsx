import React, { useState, useEffect, useRef } from "react";
import { ExecutionResult, UserCloudFile, ConsoleHistoryEntry } from "../types";
import { CodeEditor } from "./CodeEditor";
import { TerminalOutput } from "./TerminalOutput";
import { CloudFileManager } from "./CloudFileManager";
import { ShareModal } from "./ShareModal";
import { runPythonCode } from "../lib/pyodideRunner";
import { savePlaygroundCode, loadPlaygroundCode } from "../lib/cacheStorage";
import { formatPythonCode } from "../lib/pythonFormatter";
import { getApiUrl } from "../lib/apiConfig";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  Share2,
  Trash2,
  Download,
  RotateCcw,
  Check,
  Copy,
  Zap,
  Wand2,
  Play,
  ArrowDown,
  ArrowUp,
  Terminal as TerminalIcon,
  Code as CodeIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PlaygroundViewProps {
  activeCode: string;
  onCodeChange: (newCode: string) => void;
  onOpenAiAssist: (code: string, errorMsg?: string) => void;
  currentUser: string | null;
  userFiles: UserCloudFile[];
  activeFileId: string | null;
  onSelectFile: (file: UserCloudFile) => void;
  onSaveFile: (fileName: string) => Promise<void>;
  onCreateFile: (fileName: string) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onOpenAuth: () => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  activeCode,
  onCodeChange,
  onOpenAiAssist,
  currentUser,
  userFiles,
  activeFileId,
  onSelectFile,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
  onOpenAuth,
}) => {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize or handle changes
  useEffect(() => {
    if (!activeCode) {
      const initial = currentUser
        ? (loadPlaygroundCode() || "# Start coding in Python\nprint('Hello World!')\n")
        : "# Start coding in Python\nprint('Hello World!')\n";
      onCodeChange(initial);
    }
  }, [currentUser]);

  const [streamingOutput, setStreamingOutput] = useState<string>("");
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [stdinResolver, setStdinResolver] = useState<((val: string) => void) | null>(null);
  const [formatted, setFormatted] = useState(false);
  const [mobileTab, setMobileTab] = useState<"split" | "editor" | "terminal">("split");
  
  // Persistent Console History for Current Session
  const [consoleHistory, setConsoleHistory] = useState<ConsoleHistoryEntry[]>(() => {
    try {
      const stored = sessionStorage.getItem("milkypy_session_console_history");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to read console history from sessionStorage:", e);
    }
    return [];
  });

  const handleClearHistory = () => {
    setConsoleHistory([]);
    try {
      sessionStorage.removeItem("milkypy_session_console_history");
    } catch {}
  };

  const handleRestoreCode = (codeToRestore: string) => {
    handleCodeChange(codeToRestore);
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeCodeRef = useRef(activeCode);
  useEffect(() => {
    activeCodeRef.current = activeCode;
  }, [activeCode]);

  const isRunningRef = useRef(isRunning);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Save to cache on every change
  const handleCodeChange = (newCode: string) => {
    onCodeChange(newCode);
    if (currentUser) {
      savePlaygroundCode(newCode);
    }
  };

  // Format Python Code & Indentation
  const handleFormat = () => {
    const codeToFormat = activeCodeRef.current || activeCode;
    const result = formatPythonCode(codeToFormat);
    handleCodeChange(result.code);
    setFormatted(true);
    setTimeout(() => setFormatted(false), 2000);
  };

  // Firebase Snippet Sharing State
  const [isSharing, setIsSharing] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [generatedShareUrl, setGeneratedShareUrl] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  // Active filename resolution
  const activeFileName = (() => {
    if (activeFileId && userFiles && userFiles.length > 0) {
      const match = userFiles.find((f) => f.id === activeFileId);
      if (match?.name) {
        return match.name.endsWith(".py") ? match.name : `${match.name}.py`;
      }
    }
    return "playground.py";
  })();

  // Download active code snippet as a local .py file
  const handleDownload = () => {
    const codeToDownload = activeCodeRef.current || activeCode;
    const blob = new Blob([codeToDownload], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleShareSnippet = async () => {
    const codeToShare = activeCodeRef.current || activeCode;
    if (!codeToShare.trim()) {
      return;
    }

    try {
      setIsSharing(true);
      const res = await fetch(getApiUrl("/api/snippets/share"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToShare,
          title: "Python Snippet",
          author: currentUser || "Anonymous Student",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate share link");
      }

      setGeneratedShareUrl(data.shareUrl);
      setShareModalOpen(true);
    } catch (err) {
      console.error("Failed to share snippet:", err);
    } finally {
      setIsSharing(false);
    }
  };

  // Run Code
  const handleRun = async () => {
    if (isRunningRef.current) return;
    setIsRunning(true);
    setStreamingOutput("");
    setExecutionResult(null);
    setIsWaitingInput(false);
    
    if (terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (mobileTab === "editor") {
      setMobileTab("split");
    }
    
    const codeToRun = activeCodeRef.current || activeCode;
    const result = await runPythonCode(
      codeToRun,
      (prompt) => {
        return new Promise((resolve) => {
          setIsWaitingInput(true);
          setStdinResolver(() => resolve);
        });
      },
      (text) => {
        setStreamingOutput((prev) => prev + text);
      }
    );
    
    setExecutionResult(result);
    setIsRunning(false);
    setIsWaitingInput(false);
    setStdinResolver(null);

    // Save to persistent session console history
    setConsoleHistory((prev) => {
      const newEntry: ConsoleHistoryEntry = {
        id: `run-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        runIndex: prev.length + 1,
        timestamp: Date.now(),
        code: codeToRun,
        result,
      };
      const updated = [newEntry, ...prev];
      try {
        sessionStorage.setItem(
          "milkypy_session_console_history",
          JSON.stringify(updated.slice(0, 50))
        );
      } catch (err) {
        console.warn("Failed to persist console history:", err);
      }
      return updated;
    });
    
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
  };

  // Global run event listener triggered by Ctrl+Enter anywhere in the app
  useEffect(() => {
    const handleGlobalRunEvent = () => {
      if (!isRunningRef.current) {
        handleRun();
      }
    };
    window.addEventListener("milkypy:run-code", handleGlobalRunEvent);
    return () => window.removeEventListener("milkypy:run-code", handleGlobalRunEvent);
  }, []);

  const handleSendStdin = (input: string) => {
    if (stdinResolver) {
      stdinResolver(input);
      setIsWaitingInput(false);
      setStdinResolver(null);
    }
  };

  // Scroll Helpers
  const scrollToTerminal = () => {
    terminalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-7.5rem)] lg:min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto lg:overflow-hidden bg-slate-50 dark:bg-[#08090D] p-1.5 xs:p-2.5 sm:p-4 2xl:p-6 space-y-2.5 w-full max-w-[2400px] mx-auto">
      {/* Refined Glass & Neumorphic Toolbar Bar */}
      <div className="bg-white/90 dark:bg-[#15171E]/90 border border-slate-200/80 dark:border-white/12 rounded-2xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 select-none shadow-sm shrink-0 backdrop-blur-md">
        {/* User Cloud Files */}
        <CloudFileManager
          currentUser={currentUser}
          userFiles={userFiles}
          activeFileId={activeFileId}
          activeCode={activeCode}
          onSelectFile={onSelectFile}
          onSaveFile={onSaveFile}
          onCreateFile={onCreateFile}
          onDeleteFile={onDeleteFile}
          onOpenAuth={onOpenAuth}
        />

        {/* Clean Controls & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Mobile/Tablet View Switcher (Code | Output | Split) */}
          <div className="lg:hidden flex items-center bg-slate-100 dark:bg-[#252933] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMobileTab("editor")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mobileTab === "editor"
                  ? "bg-white dark:bg-[#15171E] text-blue-600 dark:text-[#8BBEFF] shadow-xs font-bold"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
              }`}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("terminal")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mobileTab === "terminal"
                  ? "bg-white dark:bg-[#15171E] text-blue-600 dark:text-[#8BBEFF] shadow-xs font-bold"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
              }`}
            >
              <span>Output</span>
              {executionResult?.isError && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F08089]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("split")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mobileTab === "split"
                  ? "bg-white dark:bg-[#15171E] text-blue-600 dark:text-[#8BBEFF] shadow-xs font-bold"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
              }`}
            >
              Split
            </button>
          </div>

          {/* Clean Up Code / Format */}
          <button
            id="playground-btn-format"
            onClick={handleFormat}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-target ${
              formatted
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-[#65D9A3] shadow-xs"
                : "bg-slate-100 dark:bg-[#252933] hover:bg-slate-200 dark:hover:bg-[#353A46] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#F3F4F6]"
            }`}
            title="Clean up code spacing and indentation"
          >
            {formatted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65D9A3]" />
                <span>Clean!</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                <span className="hidden sm:inline">Clean Code</span>
              </>
            )}
          </button>

          {/* Share Code Snippet */}
          <button
            id="playground-btn-share"
            onClick={handleShareSnippet}
            disabled={isSharing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-[#252933] hover:bg-slate-200 dark:hover:bg-[#353A46] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#F3F4F6] transition-all shadow-xs cursor-pointer disabled:opacity-50 touch-target"
            title="Get a shareable link"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#A98BFF]" />
            <span className="hidden xs:inline">{isSharing ? "Sharing..." : "Share"}</span>
          </button>

          {/* Download as .py */}
          <button
            id="playground-btn-download"
            onClick={handleDownload}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs cursor-pointer touch-target ${
              downloaded
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-[#65D9A3] shadow-xs"
                : "bg-slate-100 dark:bg-[#252933] hover:bg-slate-200 dark:hover:bg-[#353A46] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#F3F4F6]"
            }`}
            title={`Download ${activeFileName}`}
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65D9A3]" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                <span className="hidden sm:inline">Download</span>
              </>
            )}
          </button>

          {/* Primary Run Code Button */}
          <button
            id="btn-run-code"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-[#65D9A3] dark:hover:bg-[#65D9A3]/90 text-white dark:text-[#050608] text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer shrink-0 touch-target"
            title="Run Python code (Ctrl+Enter)"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
            <span className="hidden xl:inline font-mono opacity-80 text-[10px]">(Ctrl+Enter)</span>
          </button>
        </div>
      </div>

      {/* Main Split Pane: Code Editor + Terminal Console */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* Code Editor (Span 7 cols on desktop, responsive on mobile/tablet) */}
        <div
          ref={editorRef}
          className={`lg:col-span-7 flex flex-col shrink-0 ${
            mobileTab === "terminal"
              ? "hidden lg:flex lg:h-full"
              : mobileTab === "editor"
              ? "h-[calc(100vh-12rem)] lg:h-full"
              : "h-[220px] xs:h-[260px] sm:h-[300px] md:h-[340px] lg:h-full"
          }`}
        >
          <CodeEditor
            code={activeCode}
            onChange={handleCodeChange}
            onRun={handleRun}
            isRunning={isRunning}
            title={activeFileName}
          />
        </div>

        {/* Terminal Output Console (Span 5 cols on desktop, responsive on mobile/tablet) */}
        <div
          ref={terminalRef}
          className={`lg:col-span-5 flex flex-col shrink-0 relative ${
            mobileTab === "editor"
              ? "hidden lg:flex lg:h-full"
              : mobileTab === "terminal"
              ? "h-[calc(100vh-12rem)] lg:h-full"
              : "h-[200px] xs:h-[230px] sm:h-[270px] md:h-[310px] lg:h-full"
          }`}
        >
          <TerminalOutput
            result={executionResult}
            isRunning={isRunning}
            streamingOutput={streamingOutput}
            isWaitingInput={isWaitingInput}
            onSendStdin={handleSendStdin}
            history={consoleHistory}
            onClearHistory={handleClearHistory}
            onRestoreCode={handleRestoreCode}
            onClear={() => {
              setExecutionResult(null);
              setStreamingOutput("");
            }}
          />

          {/* Scroll back up button when in split view on small screens */}
          {mobileTab === "split" && (
            <div className="lg:hidden absolute bottom-3 right-3 z-10">
              <button
                onClick={scrollToEditor}
                className="p-2 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                title="Scroll back up to Code Editor"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Unique Permanent Firebase Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={generatedShareUrl}
        codeSnippet={activeCodeRef.current || activeCode}
      />
    </div>
  );
};
