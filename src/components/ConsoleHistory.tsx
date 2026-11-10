import React, { useState } from "react";
import { ConsoleHistoryEntry } from "../types";
import {
  History,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Search,
  Download,
  Filter,
  Code2,
  ChevronDown,
  ChevronRight,
  Terminal,
} from "lucide-react";

interface ConsoleHistoryProps {
  history: ConsoleHistoryEntry[];
  onClearHistory: () => void;
  onRestoreCode?: (code: string) => void;
  onSelectRun?: (entry: ConsoleHistoryEntry) => void;
}

export const ConsoleHistory: React.FC<ConsoleHistoryProps> = ({
  history,
  onClearHistory,
  onRestoreCode,
  onSelectRun,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "success" | "error">("all");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyOutput = (entry: ConsoleHistoryEntry) => {
    const text = [
      `# Run #${entry.runIndex} (${new Date(entry.timestamp).toLocaleTimeString()})`,
      `# Execution Time: ${entry.result.executionTimeMs} ms`,
      `# Status: ${entry.result.isError ? "Error" : "Success"}`,
      entry.result.stdout ? `=== STDOUT ===\n${entry.result.stdout}` : "",
      entry.result.stderr ? `=== STDERR ===\n${entry.result.stderr}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportHistory = () => {
    if (history.length === 0) return;
    const logText = history
      .map((entry) => {
        return [
          `==================================================`,
          `RUN #${entry.runIndex} - ${new Date(entry.timestamp).toLocaleString()}`,
          `Duration: ${entry.result.executionTimeMs} ms | Status: ${entry.result.isError ? "ERROR" : "SUCCESS"}`,
          `CODE:`,
          entry.code,
          `OUTPUT:`,
          entry.result.stdout || "[No stdout]",
          entry.result.stderr ? `ERRORS:\n${entry.result.stderr}` : "",
          `==================================================\n`,
        ].join("\n");
      })
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `milkypy_session_console_history_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter and search
  const filteredHistory = history.filter((item) => {
    if (filterType === "success" && item.result.isError) return false;
    if (filterType === "error" && !item.result.isError) return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.code.toLowerCase().includes(query) ||
      (item.result.stdout && item.result.stdout.toLowerCase().includes(query)) ||
      (item.result.stderr && item.result.stderr.toLowerCase().includes(query)) ||
      `#${item.runIndex}`.includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#08090D] font-mono text-xs">
      {/* History Header & Controls */}
      <div className="p-2.5 bg-slate-50 dark:bg-[#15171E] border-b border-slate-200 dark:border-[#252933] flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-[#F3F4F6] font-bold">
            <History className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
            <span>Session History</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 dark:bg-[#8BBEFF]/20 text-blue-700 dark:text-[#8BBEFF] rounded-full font-sans font-bold">
              {history.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-200/80 dark:bg-[#252933] rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2 py-0.5 rounded ${
                filterType === "all"
                  ? "bg-white dark:bg-[#15171E] text-slate-800 dark:text-[#F3F4F6] font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-700 dark:text-[#BFC4CE] dark:hover:text-white"
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterType("success")}
              className={`px-2 py-0.5 rounded ${
                filterType === "success"
                  ? "bg-emerald-500 text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-700 dark:text-[#BFC4CE] dark:hover:text-white"
              }`}
            >
              Success
            </button>
            <button
              onClick={() => setFilterType("error")}
              className={`px-2 py-0.5 rounded ${
                filterType === "error"
                  ? "bg-rose-500 text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-700 dark:text-[#BFC4CE] dark:hover:text-white"
              }`}
            >
              Errors
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400 dark:text-[#BFC4CE]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="pl-7 pr-2 py-1 bg-white dark:bg-[#252933] border border-slate-200 dark:border-white/10 rounded-md text-[11px] text-slate-800 dark:text-[#F3F4F6] focus:outline-none focus:border-blue-500 dark:focus:border-[#8BBEFF] w-28 sm:w-36 transition-all"
            />
          </div>

          <button
            onClick={handleExportHistory}
            disabled={history.length === 0}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#252933] text-slate-500 dark:text-[#BFC4CE] hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-colors touch-target"
            title="Download Session History Log (.txt)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#252933] text-slate-500 dark:text-[#BFC4CE] hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 transition-colors touch-target"
            title="Clear Console History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2.5">
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-[#BFC4CE]/60 flex flex-col items-center justify-center space-y-2">
            <History className="w-8 h-8 stroke-1 opacity-50 text-slate-400" />
            <div className="font-semibold text-xs text-slate-500 dark:text-[#F3F4F6]">
              {history.length === 0
                ? "No previous runs in this session yet."
                : "No runs match your search filter."}
            </div>
            <p className="text-[11px] max-w-xs text-slate-400 dark:text-[#BFC4CE]">
              Click "Run (Ctrl+Enter)" in the playground to execute Python code. Previous outputs will be saved here.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isExpanded = expandedIds[item.id] !== false; // Default expanded
            const dateStr = new Date(item.timestamp).toLocaleTimeString();

            return (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/70 dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
              >
                {/* Run Card Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="px-3 py-2 bg-slate-100/90 dark:bg-slate-850 dark:bg-slate-800/90 flex items-center justify-between gap-2 cursor-pointer select-none hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}

                    {/* Status Icon */}
                    {item.result.isError ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Run #{item.runIndex}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Run #{item.runIndex}</span>
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono">
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold">
                      <Clock className="w-3 h-3 text-slate-400 inline-block shrink-0" /> {item.result.executionTimeMs}ms
                    </span>

                    {/* Restore Code Button */}
                    {onRestoreCode && (
                      <button
                        onClick={() => onRestoreCode(item.code)}
                        className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-950 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Restore this code snippet into Editor"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}

                    {/* Copy Output Button */}
                    <button
                      onClick={() => handleCopyOutput(item)}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      title="Copy Run Output"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Run Card Body */}
                {isExpanded && (
                  <div className="p-3 space-y-2.5 bg-white dark:bg-slate-950/60">
                    {/* Code Snippet Preview */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
                          <Code2 className="w-3 h-3 text-blue-500" />
                          <span>Code Run:</span>
                        </span>
                        {onRestoreCode && (
                          <button
                            onClick={() => onRestoreCode(item.code)}
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Load into editor</span>
                          </button>
                        )}
                      </div>
                      <pre className="p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200/80 dark:border-slate-800 text-[11px] max-h-24 overflow-y-auto text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                        {item.code}
                      </pre>
                    </div>

                    {/* Output: stdout */}
                    {item.result.stdout && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                          <Terminal className="w-3 h-3" />
                          <span>Stdout Output:</span>
                        </div>
                        <pre className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded text-[11px] text-emerald-800 dark:text-emerald-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {item.result.stdout}
                        </pre>
                      </div>
                    )}

                    {/* Output: stderr */}
                    {item.result.stderr && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Error Traceback:</span>
                        </div>
                        <pre className="p-2.5 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded text-[11px] text-rose-700 dark:text-rose-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {item.result.stderr}
                        </pre>
                      </div>
                    )}

                    {/* No output message */}
                    {!item.result.stdout && !item.result.stderr && (
                      <div className="text-[11px] text-slate-400 italic py-1 font-mono">
                        (Executed without stdout or stderr output)
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
