import React, { useState, useEffect, useRef } from "react";
import { ExecutionResult, ConsoleHistoryEntry } from "../types";
import { ConsoleHistory } from "./ConsoleHistory";
import {
  Terminal,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  Send,
  History,
  Square,
  Sparkles,
} from "lucide-react";

interface TerminalOutputProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  streamingOutput?: string;
  isWaitingInput?: boolean;
  onClear: () => void;
  onStop?: () => void;
  onSendStdin?: (input: string) => void;
  onAskAiFix?: (errorMsg: string) => void;
  history?: ConsoleHistoryEntry[];
  onClearHistory?: () => void;
  onRestoreCode?: (code: string) => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  result,
  isRunning,
  streamingOutput,
  isWaitingInput,
  onClear,
  onStop,
  onSendStdin,
  onAskAiFix,
  history = [],
  onClearHistory = () => {},
  onRestoreCode,
}) => {
  const [activeTab, setActiveTab] = useState<"output" | "history">("output");
  const [copied, setCopied] = useState(false);
  const [stdinInput, setStdinInput] = useState("");
  const outputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [result, isRunning, streamingOutput, isWaitingInput]);

  // When a run completes, if user was in terminal output, stay in output
  useEffect(() => {
    if (isRunning) {
      setActiveTab("output");
    }
  }, [isRunning]);

  const handleCopy = () => {
    if (!result) return;
    const text = [
      result.stdout || "",
      result.stderr || "",
    ]
      .filter(Boolean)
      .join("\n\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleStdinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSendStdin) {
      onSendStdin(stdinInput);
      setStdinInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] rounded-xl overflow-hidden shadow-xs">
      {/* Terminal Header Bar */}
      <div className="h-10 bg-slate-100/90 dark:bg-[#15171E] border-b border-slate-200 dark:border-[#252933] px-3 flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-1.5">
          {/* Output Tab */}
          <button
            id="terminal-tab-output"
            onClick={() => setActiveTab("output")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer touch-target ${
              activeTab === "output"
                ? "bg-white dark:bg-[#252933] text-slate-800 dark:text-[#F3F4F6] border border-slate-200 dark:border-white/10 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800 dark:text-[#BFC4CE] dark:hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
            <span>Output</span>
            {result?.isError && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* History Tab */}
          <button
            id="terminal-tab-history"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer touch-target ${
              activeTab === "history"
                ? "bg-white dark:bg-[#252933] text-slate-800 dark:text-[#F3F4F6] border border-slate-200 dark:border-white/10 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800 dark:text-[#BFC4CE] dark:hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
            <span>Past Runs</span>
            {history.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 dark:bg-[#8BBEFF]/20 text-blue-700 dark:text-[#8BBEFF] rounded-full font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {isRunning && onStop && (
            <button
              onClick={onStop}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer touch-target"
              title="Stop Running Code"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          )}
          {activeTab === "output" && (
            <>
              <button
                onClick={handleCopy}
                disabled={!result}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-[#252933] text-slate-500 dark:text-[#BFC4CE] hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-40 cursor-pointer touch-target"
                title="Copy Output"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65D9D0]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={onClear}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-[#252933] text-slate-500 dark:text-[#BFC4CE] hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer touch-target"
                title="Clear Output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Terminal Content Body */}
      {activeTab === "history" ? (
        <div className="flex-1 overflow-hidden">
          <ConsoleHistory
            history={history}
            onClearHistory={onClearHistory}
            onRestoreCode={onRestoreCode}
          />
        </div>
      ) : (
        <div
          ref={outputContainerRef}
          className="flex-1 p-3.5 font-mono text-xs sm:text-sm overflow-y-auto bg-white dark:bg-[#08090D] text-slate-800 dark:text-[#F3F4F6] space-y-2 leading-relaxed"
        >
          {isRunning && (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-[#8BBEFF] font-sans text-xs font-semibold py-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-[#8BBEFF] animate-pulse" />
                <span>Running your Python code...</span>
              </div>
              
              {streamingOutput && (
                <pre className="whitespace-pre-wrap font-mono text-emerald-700 dark:text-[#65D9D0] bg-emerald-50/70 dark:bg-[#65D9D0]/10 p-3 rounded-lg border border-emerald-200 dark:border-[#65D9D0]/30">
                  {streamingOutput}
                </pre>
              )}

              {isWaitingInput && onSendStdin && (
                <form
                  onSubmit={handleStdinSubmit}
                  className="mt-3 p-2 bg-white dark:bg-[#15171E] border border-blue-500/50 dark:border-[#8BBEFF]/50 rounded-lg flex items-center gap-2"
                >
                  <span className="text-xs text-blue-600 dark:text-[#8BBEFF] font-mono font-bold animate-pulse">
                    Input:
                  </span>
                  <input
                    type="text"
                    value={stdinInput}
                    onChange={(e) => setStdinInput(e.target.value)}
                    placeholder="Type your answer here..."
                    autoFocus
                    className="flex-1 bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-[#F3F4F6] font-mono focus:border-blue-500 dark:focus:border-[#8BBEFF] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 dark:bg-[#8BBEFF] dark:hover:bg-[#8BBEFF]/90 text-white dark:text-[#08090D] rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {!isRunning && !result && (
            <div className="text-slate-400 dark:text-[#BFC4CE]/60 py-8 text-center font-sans text-xs select-none">
              Press <strong className="text-emerald-600 dark:text-[#65D9D0] font-bold">Run</strong> or <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#15171E] border border-slate-200 dark:border-white/10 font-mono text-[10px]">Ctrl+Enter</kbd> to see your Python output.
            </div>
          )}

          {!isRunning && result && (
            <div className="space-y-3">
              {/* Output Content */}
              {result.stdout && (
                <pre className="whitespace-pre-wrap font-mono text-slate-800 dark:text-[#F3F4F6] bg-slate-50 dark:bg-[#15171E] p-3 rounded-lg border border-slate-200 dark:border-[#252933] text-xs sm:text-sm">
                  {result.stdout}
                </pre>
              )}

              {/* Error Message */}
              {result.stderr && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 font-sans">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Error in code:</span>
                    </div>
                    {onAskAiFix && (
                      <button
                        type="button"
                        onClick={() => onAskAiFix(result.stderr)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 dark:bg-[#8BBEFF] dark:hover:bg-[#8BBEFF]/90 text-white dark:text-[#08090D] font-sans text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Fix with AI</span>
                      </button>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 text-xs">
                    {result.stderr}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
