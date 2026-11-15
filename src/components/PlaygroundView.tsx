import React, { useState, useEffect, useRef, useMemo } from "react";
import JSZip from "jszip";
import { ExecutionResult, UserCloudFile, ConsoleHistoryEntry } from "../types";
import { CodeEditor } from "./CodeEditor";
import { TerminalOutput } from "./TerminalOutput";
import { CloudFileManager } from "./CloudFileManager";
import { ShareModal } from "./ShareModal";
import { runPythonCode, stopPythonExecution } from "../lib/pyodideRunner";
import { savePlaygroundCode, loadPlaygroundCode } from "../lib/cacheStorage";
import { getLocalSnippets } from "../lib/indexedDbStorage";
import { formatPythonCode } from "../lib/pythonFormatter";
import { getApiUrl } from "../lib/apiConfig";
import {
  SlidersHorizontal,
  Share2,
  Download,
  Check,
  Wand2,
  Play,
  Square,
  ArrowUp,
  Terminal as TerminalIcon,
  Code as CodeIcon,
  Columns,
  ChevronDown,
  MessageSquare,
  FileCode2,
  FolderArchive,
  ArrowLeft,
  X,
} from "lucide-react";

const PLAYGROUND_TEMPLATES = [
  {
    id: "hello",
    label: "Hello & Input",
    code: `# Interactive Greeting Program
name = "Pythonista"
print(f"Welcome to MilkyPy, {name}!")

for step in range(1, 4):
    print(f"Step {step}: Ready to code")
`,
  },
  {
    id: "patterns",
    label: "Loops & Star Patterns",
    code: `# Geometric Star Pyramid
rows = 6
for i in range(1, rows + 1):
    spaces = " " * (rows - i)
    stars = "*" * (2 * i - 1)
    print(spaces + stars)
`,
  },
  {
    id: "guess",
    label: "Number Guessing Game",
    code: `import random

secret = random.randint(1, 20)
print("Guess a number between 1 and 20!")

for attempt in range(1, 6):
    raw = input(f"Attempt {attempt}/5 - Your guess: ")
    guess = int(raw)
    if guess == secret:
        print(f"Spot on! You found {secret} in {attempt} tries.")
        break
    elif guess < secret:
        print("Too low — try higher!")
    else:
        print("Too high — try lower!")
else:
    print(f"Out of tries! The secret number was {secret}.")
`,
  },
  {
    id: "primes",
    label: "Prime Checker & Stats",
    code: `def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            return False
    return True

primes = [n for n in range(1, 51) if is_prime(n)]
print(f"Found {len(primes)} primes up to 50:")
print(primes)
print(f"Sum of primes: {sum(primes)}")
`,
  },
  {
    id: "quiz",
    label: "Mini Trivia Quiz",
    code: `questions = [
    ("What keyword defines a function in Python?", "def"),
    ("What function prints text to the console?", "print"),
    ("What data type holds True or False?", "bool"),
]

score = 0
for prompt, answer in questions:
    reply = input(prompt + " ").strip().lower()
    if reply == answer:
        print("Correct!")
        score += 1
    else:
        print(f"Expected '{answer}'.")

print(f"Final score: {score}/{len(questions)}")
`,
  },
];

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
  quizReturnContext?: { topicTitle: string; question?: string } | null;
  onReturnToQuiz?: () => void;
  onDismissQuizReturn?: () => void;
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
  quizReturnContext,
  onReturnToQuiz,
  onDismissQuizReturn,
}) => {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize from local cache (both logged-in and guest users)
  useEffect(() => {
    if (!activeCode) {
      const cached = loadPlaygroundCode();
      const initial = cached || "# Start coding in Python\nprint('Hello World!')\n";
      onCodeChange(initial);
    }
  }, [currentUser]);

  const [streamingOutput, setStreamingOutput] = useState<string>("");
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [stdinResolver, setStdinResolver] = useState<((val: string) => void) | null>(null);
  const [formatted, setFormatted] = useState(false);
  const [mobileTab, setMobileTab] = useState<"split" | "editor" | "terminal">("split");
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);
  
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

  // Save to local cache & IndexedDB on every change (even for guest sessions)
  const handleCodeChange = (newCode: string) => {
    onCodeChange(newCode);
    savePlaygroundCode(newCode, activeFileName);
  };

  // Format Python Code & Indentation
  const handleFormat = () => {
    const codeToFormat = activeCodeRef.current || activeCode;
    const result = formatPythonCode(codeToFormat);
    handleCodeChange(result.code);
    setFormatted(true);
    setActionMenuOpen(false);
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
    setActionMenuOpen(false);
    setTimeout(() => setDownloaded(false), 2000);
  };

  // Export entire MilkyPy workspace (cloud files + local IndexedDB drafts + current script) as a .zip
  const handleExportWorkspaceZip = async () => {
    if (exportingZip) return;
    setExportingZip(true);
    try {
      const zip = new JSZip();
      const addedNames = new Set<string>();
      const ensurePy = (name: string) => (name.endsWith(".py") ? name : `${name}.py`);

      // 1. Add current active script
      const activeName = ensurePy(activeFileName);
      zip.file(activeName, activeCodeRef.current || activeCode);
      addedNames.add(activeName);

      // 2. Add cloud files if signed in
      for (const file of userFiles) {
        const fname = ensurePy(file.name);
        if (!addedNames.has(fname)) {
          zip.file(fname, file.code || "");
          addedNames.add(fname);
        }
      }

      // 3. Add local IndexedDB offline drafts
      try {
        const localSnippets = await getLocalSnippets(currentUser);
        for (const snip of localSnippets) {
          const fname = `local/${ensurePy(snip.name)}`;
          if (!addedNames.has(fname)) {
            zip.file(fname, snip.code || "");
            addedNames.add(fname);
          }
        }
      } catch {
        // IndexedDB unavailable
      }

      zip.file(
        "README.md",
        `# MilkyPy Workspace Export\n\nExported on ${new Date().toISOString()}\nAccount: ${currentUser || "Guest Session"}\nFiles included: ${addedNames.size}\n`
      );

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `milkypy-workspace-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setActionMenuOpen(false);
    } catch (err) {
      console.error("Failed to export workspace zip:", err);
    } finally {
      setExportingZip(false);
    }
  };

  // Parse the deepest line number from any Python traceback for gutter highlighting
  const errorLine = useMemo(() => {
    if (!executionResult?.isError || !executionResult.stderr) return null;
    const matches = [...executionResult.stderr.matchAll(/File\s+"(?:<exec>|[^"]+)",\s+line\s+(\d+)/g)];
    if (matches.length === 0) return null;
    const lastLine = parseInt(matches[matches.length - 1][1], 10);
    return Number.isFinite(lastLine) && lastLine > 0 ? lastLine : null;
  }, [executionResult]);

  const handleShareSnippet = async () => {
    const codeToShare = activeCodeRef.current || activeCode;
    if (!codeToShare.trim()) {
      return;
    }

    try {
      setIsSharing(true);
      setActionMenuOpen(false);
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

  const handleStop = () => {
    stopPythonExecution();
    setIsRunning(false);
    setIsWaitingInput(false);
    setStdinResolver(null);
  };

  // Scroll Helpers
  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-7.5rem)] lg:min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto lg:overflow-hidden bg-slate-50 dark:bg-[#08090D] p-1.5 xs:p-2.5 sm:p-4 2xl:p-6 space-y-3 w-full max-w-[2400px] mx-auto">
      {quizReturnContext && onReturnToQuiz && (
        <div className="rounded-xl border border-blue-200 dark:border-[#8BBEFF]/30 bg-blue-50/70 dark:bg-[#15171E] px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="min-w-0 flex-1 flex items-center gap-2 text-xs">
            <span className="font-semibold text-blue-800 dark:text-[#8BBEFF] shrink-0">
              Practicing from quiz: {quizReturnContext.topicTitle}
            </span>
            {quizReturnContext.question && (
              <span className="hidden sm:inline text-slate-600 dark:text-[#BFC4CE] truncate">
                — {quizReturnContext.question}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onReturnToQuiz}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#73aef8] text-white dark:text-[#08090D] text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Quiz</span>
            </button>
            {onDismissQuizReturn && (
              <button
                type="button"
                onClick={onDismissQuizReturn}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                aria-label="Dismiss quiz notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Refined 'Graphite' Unified Toolbar Bar */}
      <div className="bg-white dark:bg-[#15171E] border border-slate-200 dark:border-[#252933] rounded-2xl px-3 py-2 flex items-center justify-between gap-2 select-none shadow-xs shrink-0 backdrop-blur-md relative z-20">
        {/* Left: User Cloud Files Selector */}
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

        {/* Right: Icon-Based View Switcher + Unified Action Menu + Run Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile/Tablet View Switcher (Icon-Based: Code | Output | Split) */}
          <div className="lg:hidden flex items-center bg-slate-100 dark:bg-[#252933] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMobileTab("editor")}
              className={`p-1.5 px-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer touch-target ${
                mobileTab === "editor"
                  ? "bg-white dark:bg-[#15171E] text-blue-600 dark:text-[#8BBEFF] shadow-xs font-bold"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
              }`}
              title="Show Code Editor Only"
            >
              <CodeIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Code</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("terminal")}
              className={`p-1.5 px-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer touch-target ${
                mobileTab === "terminal"
                  ? "bg-white dark:bg-[#15171E] text-blue-600 dark:text-[#8BBEFF] shadow-xs font-bold"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
              }`}
              title="Show Terminal Output Only"
            >
              <TerminalIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Output</span>
              {executionResult?.isError && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F08089]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("split")}
              className={`p-1.5 px-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer touch-target ${
                mobileTab === "split"
                  ? "bg-white dark:bg-[#15171E] text-blue-600 dark:text-[#8BBEFF] shadow-xs font-bold"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6]"
              }`}
              title="Split View Editor and Terminal"
            >
              <Columns className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Split</span>
            </button>
          </div>

          {/* Unified 'Action Menu' Collapsed Secondary Controls */}
          <div className="relative">
            <button
              id="playground-action-menu-toggle"
              type="button"
              onClick={() => setActionMenuOpen(!actionMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer touch-target ${
                actionMenuOpen
                  ? "bg-slate-200 dark:bg-[#252933] border-blue-500/50 dark:border-[#8BBEFF]/50 text-blue-600 dark:text-[#8BBEFF]"
                  : "bg-slate-100 dark:bg-[#252933] hover:bg-slate-200 dark:hover:bg-[#353A46] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#F3F4F6]"
              }`}
              title="Open secondary code tools"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
              <span className="hidden sm:inline">Tools</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${actionMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {actionMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setActionMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#15171E] border border-slate-200 dark:border-[#252933] rounded-2xl p-1.5 shadow-xl z-40 space-y-1 font-sans text-xs">
                    {/* Starter Templates Picker */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setTemplatesOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode2 className="w-3.5 h-3.5 text-amber-500 dark:text-[#F2BC72]" />
                          <span>Starter Templates</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${templatesOpen ? "rotate-180" : ""}`} />
                      </button>
                      {templatesOpen && (
                        <div className="mt-1 ml-2 pl-2 border-l border-slate-200 dark:border-white/10 space-y-0.5">
                          {PLAYGROUND_TEMPLATES.map((tpl) => (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => {
                                handleCodeChange(tpl.code);
                                setExecutionResult(null);
                                setStreamingOutput("");
                                setTemplatesOpen(false);
                                setActionMenuOpen(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252933] text-[11px] font-medium text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            >
                              {tpl.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Clean Code Format Action */}
                    <button
                      type="button"
                      onClick={handleFormat}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                        <span>Format & Clean Code</span>
                      </div>
                      {formatted && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>

                    {/* Share Snippet Action */}
                    <button
                      type="button"
                      onClick={handleShareSnippet}
                      disabled={isSharing}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#A98BFF]" />
                        <span>Share Code Snippet</span>
                      </div>
                      {isSharing && <span className="text-[10px] text-slate-400">...</span>}
                    </button>

                    {/* Download File Action */}
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65D9D0]" />
                        <span>Download .py File</span>
                      </div>
                      {downloaded && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>

                    {/* Export Entire Workspace (.zip) */}
                    <button
                      type="button"
                      onClick={handleExportWorkspaceZip}
                      disabled={exportingZip}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <FolderArchive className="w-3.5 h-3.5 text-teal-600 dark:text-[#65D9D0]" />
                        <span>Export Workspace (.zip)</span>
                      </div>
                      {exportingZip && <span className="text-[10px] text-slate-400">...</span>}
                    </button>

                    {/* Code Help Action */}
                    <div className="pt-1 border-t border-slate-100 dark:border-[#252933]">
                      <button
                        type="button"
                        onClick={() => {
                          setActionMenuOpen(false);
                          onOpenAiAssist(activeCode, executionResult?.stderr || undefined);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-[#8BBEFF]/10 hover:bg-blue-100 dark:hover:bg-[#8BBEFF]/20 text-blue-700 dark:text-[#8BBEFF] font-semibold transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                        <span>Code Help</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
          </div>

          {/* Icon-Based Primary Run / Stop Code Navigation */}
          {isRunning ? (
            <button
              id="btn-stop-code"
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer shrink-0 touch-target"
              title="Stop running Python code"
            >
              <Square className="w-4 h-4 fill-current shrink-0" />
              <span className="font-bold">Stop</span>
            </button>
          ) : (
            <button
              id="btn-run-code"
              onClick={handleRun}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-[#65D9D0] dark:hover:bg-[#65D9D0]/90 text-white dark:text-[#050608] text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer shrink-0 touch-target"
              title="Run Python code (Ctrl+Enter)"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span className="font-bold">Run</span>
              <span className="hidden xl:inline font-mono opacity-80 text-[10px]">(Ctrl+Enter)</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified 'Graphite' Containment Workspace Area for Editor + Terminal */}
      <div className="flex-1 bg-white dark:bg-[#15171E] border border-slate-200 dark:border-[#252933] rounded-2xl p-2 sm:p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 shadow-xs">
        {/* Code Editor Panel */}
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
            errorLine={errorLine}
          />
        </div>

        {/* Terminal Output Console Panel */}
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
            onStop={handleStop}
            onAskAiFix={(errMsg) => onOpenAiAssist(activeCodeRef.current || activeCode, errMsg)}
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

      {/* Firebase Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={generatedShareUrl}
        codeSnippet={activeCodeRef.current || activeCode}
      />
    </div>
  );
};
