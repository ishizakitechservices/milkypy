import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Lightbulb, Check, Terminal, AlertCircle, Square, MessageSquare, ExternalLink } from "lucide-react";
import { runPythonCode, stopPythonExecution } from "../../lib/pyodideRunner";
import { ExecutionResult } from "../../types";
import { translatePythonError } from "../../lib/errorTranslator";
import { CopyCodeButton } from "../CopyCodeButton";

interface CurriculumInlineEditorProps {
  starterCode: string;
  instructions: string;
  solutionCode?: string;
  expectedOutput?: string;
  hints?: string[];
  lessonContext?: any;
  onOpenAiAssist?: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick?: (code: string) => void;
}

export const CurriculumInlineEditor: React.FC<CurriculumInlineEditorProps> = ({
  starterCode,
  instructions,
  solutionCode,
  expectedOutput,
  hints = [],
  lessonContext,
  onOpenAiAssist,
  onPracticeClick,
}) => {
  const [code, setCode] = useState<string>(starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);

  // Sync editor state whenever lesson starterCode changes
  useEffect(() => {
    setCode(starterCode);
    setResult(null);
    setShowSolution(false);
    setShowHints(false);
  }, [starterCode]);

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await runPythonCode(code);
      setResult(res);
    } catch (err: any) {
      setResult({
        stdout: "",
        stderr: err?.message || "Execution failed",
        executionTimeMs: 0,
        isError: true,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    stopPythonExecution();
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(starterCode);
    setResult(null);
    setShowSolution(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
      return;
    }

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = code.lastIndexOf("\n", start - 1) + 1;
        const lineText = code.slice(lineStart, end);
        if (lineText.startsWith("    ")) {
          setCode(code.slice(0, lineStart) + lineText.slice(4) + code.slice(end));
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, start - 4);
            textarea.selectionEnd = Math.max(lineStart, end - 4);
          }, 0);
        }
      } else {
        setCode(code.slice(0, start) + "    " + code.slice(end));
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
      return;
    }

    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const beforeCursor = code.slice(lineStart, start);
      const indentMatch = beforeCursor.match(/^(\s*)/);
      const baseIndent = indentMatch ? indentMatch[1] : "";
      const extraIndent = beforeCursor.replace(/#.*$/, "").trimEnd().endsWith(":") ? "    " : "";
      const insertion = "\n" + baseIndent + extraIndent;
      setCode(code.slice(0, start) + insertion + code.slice(end));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
      }, 0);
    }
  };

  const friendlyError = result?.isError && result.stderr ? translatePythonError(result.stderr) : null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs my-6 transition-colors">
      {/* Activity Prompt Header */}
      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Try it Yourself</span>
          </div>
          {onPracticeClick && (
            <button
              type="button"
              onClick={() => onPracticeClick(code)}
              className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-[#8BBEFF] hover:underline cursor-pointer"
              title="Open this exercise in the full Playground IDE"
            >
              <span>Open in Playground</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {instructions}
        </p>
      </div>

      {/* Code Editor Surface: Theme-Adaptive Surface (Soft gray/white in Light Mode, deep slate in Dark Mode) */}
      <div className="relative font-mono text-xs">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          rows={Math.max(4, Math.min(12, code.split("\n").length + 1))}
          className="w-full p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 caret-emerald-600 dark:caret-emerald-400 font-mono text-[13px] leading-relaxed resize-y focus:outline-hidden border-none placeholder:text-slate-400 dark:placeholder:text-slate-500 selection:bg-emerald-100 dark:selection:bg-emerald-950/60"
          placeholder="# Type your Python code here..."
        />
      </div>

      {/* Action Toolbar */}
      <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs transition-colors cursor-pointer"
              title="Stop running code"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Code</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium shadow-xs transition-colors cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <CopyCodeButton code={code} label="Copy" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenAiAssist && (
            <button
              type="button"
              onClick={() =>
                onOpenAiAssist(code, result?.stderr || undefined, {
                  ...lessonContext,
                  expectedOutput: expectedOutput || lessonContext?.expectedOutput,
                })
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-[#8BBEFF]/10 hover:bg-blue-100 dark:hover:bg-[#8BBEFF]/20 border border-blue-200 dark:border-[#8BBEFF]/30 text-blue-700 dark:text-[#8BBEFF] font-semibold shadow-xs transition-colors cursor-pointer"
              title="Get help on this exercise"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Code Help</span>
            </button>
          )}

          {hints && hints.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-300 font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHints ? "Hide Hint" : "Hint"}</span>
            </button>
          )}

          {solutionCode && (
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium shadow-xs transition-colors cursor-pointer"
            >
              <span>{showSolution ? "Hide Solution" : "View Solution"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Hint */}
      {showHints && hints && hints.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border-t border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <ul className="list-disc list-inside space-y-1 font-medium">
            {hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Expandable Solution */}
      {showSolution && solutionCode && (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px] font-sans font-semibold">
            <span>Here is the answer:</span>
            <div className="flex items-center gap-2">
              <CopyCodeButton code={solutionCode} compact />
              <button
                type="button"
                onClick={() => setCode(solutionCode)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Use this answer
              </button>
            </div>
          </div>
          <pre className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto text-emerald-700 dark:text-emerald-400 font-mono text-[12px]">
            {solutionCode}
          </pre>
        </div>
      )}

      {/* Live Output Console */}
      {result && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-sans px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Console Output</span>
            </div>
            <span className="tabular-nums font-mono text-[10px] text-slate-400 dark:text-slate-500">
              {result.executionTimeMs}ms
            </span>
          </div>

          <div className="p-4 space-y-2.5">
            {result.stdout && (
              <pre className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-mono">
                {result.stdout}
              </pre>
            )}

            {result.isError && result.stderr && (
              <div className="space-y-1.5">
                <pre className="text-rose-600 dark:text-rose-400 whitespace-pre-wrap leading-relaxed font-mono">
                  {result.stderr}
                </pre>
                {friendlyError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-rose-800 dark:text-rose-300 text-[11px] font-sans flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{friendlyError.errorType}: </span>
                      <span>{friendlyError.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!result.stdout && !result.stderr && (
              <div className="text-slate-400 dark:text-slate-500 italic text-[11px] font-sans">
                (Your code ran, but did not print anything. Use print() to show words on screen!)
              </div>
            )}

            {expectedOutput && result.stdout.trim() === expectedOutput.trim() && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-sans font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Great job! Your answer matches.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
