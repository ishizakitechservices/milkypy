import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  Code2,
  BookOpen,
  MessageSquare,
  Pencil,
  RotateCcw,
  Terminal,
  AlertCircle,
  X,
} from "lucide-react";
import { ExecutionResult } from "../types";
import { runPythonCode, stopPythonExecution } from "../lib/pyodideRunner";
import { translatePythonError } from "../lib/errorTranslator";
import { CopyCodeButton } from "./CopyCodeButton";

interface QuizFeedbackActionsBarProps {
  codeSnippet?: string;
  lessonId?: string;
  hasLesson?: boolean;
  topicTitle: string;
  question: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  onPracticeClick: (code: string) => void;
  onOpenLesson?: (lessonId: string) => void;
  onOpenAiAssist: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  rightAction?: React.ReactNode;
}

export const QuizFeedbackActionsBar: React.FC<QuizFeedbackActionsBarProps> = ({
  codeSnippet,
  lessonId,
  hasLesson = false,
  topicTitle,
  question,
  options,
  selectedIndex,
  correctIndex,
  isCorrect,
  explanation,
  onPracticeClick,
  onOpenLesson,
  onOpenAiAssist,
  rightAction,
}) => {
  const [editableCode, setEditableCode] = useState<string>(codeSnippet || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [liveOutput, setLiveOutput] = useState<ExecutionResult | null>(null);

  useEffect(() => {
    setEditableCode(codeSnippet || "");
    setIsEditing(false);
    setLiveOutput(null);
    setIsRunning(false);
  }, [codeSnippet, question]);

  const isModified = Boolean(codeSnippet && editableCode !== codeSnippet);

  const handleRunLive = async () => {
    const targetCode = editableCode.trim();
    if (!targetCode) return;
    setIsRunning(true);
    try {
      const res = await runPythonCode(editableCode);
      setLiveOutput(res);
    } catch (e: any) {
      setLiveOutput({
        stdout: "",
        stderr: e?.message || "Failed to execute snippet",
        executionTimeMs: 0,
        isError: true,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopLive = () => {
    stopPythonExecution();
    setIsRunning(false);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunLive();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const updated = editableCode.slice(0, start) + "    " + editableCode.slice(end);
      setEditableCode(updated);
      window.setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleGetHelp = () => {
    onOpenAiAssist(editableCode || codeSnippet || "", undefined, {
      title: topicTitle,
      description: explanation,
      quizQuestion: {
        question,
        userChoice: options[selectedIndex],
        correctAnswer: options[correctIndex],
        explanation,
        isCorrect,
      },
    });
  };

  const friendlyError =
    liveOutput?.isError && liveOutput.stderr
      ? translatePythonError(liveOutput.stderr)
      : null;

  return (
    <div className="space-y-3">
      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {codeSnippet && (
            <>
              {isRunning ? (
                <button
                  type="button"
                  onClick={handleStopLive}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRunLive}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-[#252933] dark:hover:bg-[#353A46] text-white text-xs font-semibold transition-colors cursor-pointer"
                  title="Run this code live right here"
                >
                  <Play className="w-3 h-3 fill-current text-emerald-400" />
                  <span>{isModified ? "Run Edited" : "Run Code"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  isEditing
                    ? "border-blue-400 dark:border-[#8BBEFF] bg-blue-50 dark:bg-[#8BBEFF]/15 text-blue-700 dark:text-[#8BBEFF]"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15171E] hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-700 dark:text-slate-200"
                }`}
                title="Edit and test a fix inline"
              >
                <Pencil className="w-3 h-3" />
                <span>{isEditing ? "Hide Sandbox" : "Edit & Test"}</span>
              </button>

              <button
                type="button"
                onClick={() => onPracticeClick(editableCode || codeSnippet)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15171E] hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                title="Open snippet in the full Playground editor"
              >
                <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                <span>Try in Editor</span>
              </button>
            </>
          )}

          {hasLesson && lessonId && onOpenLesson && (
            <button
              type="button"
              onClick={() => onOpenLesson(lessonId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15171E] hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Open the matching lesson and return anytime"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-[#65D9D0]" />
              <span>Open Lesson</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleGetHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15171E] hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Get step-by-step help on this question"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
            <span>Get Help</span>
          </button>
        </div>

        {rightAction}
      </div>

      {/* Inline Editable Mini-Sandbox (for tweaking/testing fixes like adding f"...") */}
      {isEditing && codeSnippet && (
        <div className="rounded-xl border border-slate-300 dark:border-[#252933] bg-white dark:bg-[#08090D] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-100/80 dark:bg-[#15171E] border-b border-slate-200 dark:border-[#252933] text-xs">
            <span className="font-medium text-slate-700 dark:text-[#BFC4CE]">
              Test a fix here <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">(Ctrl+Enter to run)</span>
            </span>
            <div className="flex items-center gap-1.5">
              {isModified && (
                <button
                  type="button"
                  onClick={() => setEditableCode(codeSnippet)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-[#BFC4CE] hover:bg-slate-200/70 dark:hover:bg-[#252933] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
              <CopyCodeButton code={editableCode} compact />
              <button
                type="button"
                onClick={handleRunLive}
                disabled={isRunning}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run</span>
              </button>
            </div>
          </div>
          <textarea
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            rows={Math.max(3, Math.min(10, editableCode.split("\n").length + 1))}
            className="w-full p-3 bg-slate-50 dark:bg-[#050608] text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-[13px] leading-relaxed resize-y focus:outline-hidden border-none"
            aria-label="Edit Python snippet to test output"
          />
        </div>
      )}

      {/* Live Output Console */}
      {liveOutput && (
        <div className="rounded-xl border border-slate-300 dark:border-[#252933] bg-white dark:bg-[#050608] overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-slate-200 dark:border-[#252933] bg-slate-50 dark:bg-[#15171E] font-sans">
            <div className="flex items-center gap-2 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {isModified ? "Edited Code Output" : "Output"}
              </span>
              {liveOutput.isError && (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  · Error
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="tabular-nums font-mono text-[10px] text-slate-400">
                {liveOutput.executionTimeMs}ms
              </span>
              {(liveOutput.stdout || liveOutput.stderr) && (
                <CopyCodeButton
                  code={liveOutput.stdout || liveOutput.stderr}
                  label="Copy"
                  compact
                />
              )}
              <button
                type="button"
                onClick={() => setLiveOutput(null)}
                className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                aria-label="Clear output"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-3 space-y-2">
            {liveOutput.stdout && (
              <pre className="text-emerald-700 dark:text-emerald-300 whitespace-pre-wrap m-0 leading-relaxed">
                {liveOutput.stdout}
              </pre>
            )}
            {liveOutput.stderr && (
              <div className="space-y-2">
                <pre className="text-rose-600 dark:text-rose-400 whitespace-pre-wrap m-0 leading-relaxed">
                  {liveOutput.stderr}
                </pre>
                {friendlyError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 font-sans text-[11px] flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{friendlyError.errorType}: </span>
                      <span>{friendlyError.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!liveOutput.stdout && !liveOutput.stderr && (
              <div className="text-slate-400 dark:text-slate-500 italic font-sans text-[11px]">
                (Code finished with no output printed)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
