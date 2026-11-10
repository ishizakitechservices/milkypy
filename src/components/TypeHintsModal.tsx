import React, { useState } from "react";
import { PYTHON_BUILTIN_TYPE_HINTS, TypeHintInfo } from "../lib/pythonTypeHints";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  X,
  Code2,
  Copy,
  Check,
  BookOpen,
  Filter,
  Layers,
} from "lucide-react";

interface TypeHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet?: (code: string) => void;
}

export const TypeHintsModal: React.FC<TypeHintsModalProps> = ({
  isOpen,
  onClose,
  onInsertSnippet,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedFunc, setSelectedFunc] = useState<TypeHintInfo | null>(() => {
    return PYTHON_BUILTIN_TYPE_HINTS["print"] || null;
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const allHints = Object.values(PYTHON_BUILTIN_TYPE_HINTS);

  const filteredHints = allHints.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.signature.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCopyExample = (example: string) => {
    navigator.clipboard.writeText(example);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl h-[85vh] max-h-[720px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2">
                  <span>Python Built-in Type Hints & Signatures</span>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 bg-white/20 rounded-full font-mono font-medium">
                    Python 3.11
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100">
                  Touch & mobile-friendly reference for function parameters, return types, and docstrings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close Type Hints"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 sm:items-center justify-between shrink-0">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Python built-ins (e.g. print, len, range, dict)..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills (Scrollable horizontally) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-[11px] font-medium text-slate-600 dark:text-slate-400 no-scrollbar">
              {[
                { id: "all", label: "All" },
                { id: "io", label: "I/O" },
                { id: "collection", label: "Collections" },
                { id: "math", label: "Math" },
                { id: "conversion", label: "Conversion" },
                { id: "utility", label: "Utilities" },
                { id: "inspection", label: "Inspection" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                    categoryFilter === cat.id
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Split Body: Function List & Details Viewer */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
            {/* Left Column: Function List (Span 4) */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[35vh] md:max-h-none p-2 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
              {filteredHints.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No matching Python functions found
                </div>
              ) : (
                filteredHints.map((fn) => {
                  const isSelected = selectedFunc?.name === fn.name;
                  return (
                    <button
                      key={fn.name}
                      onClick={() => setSelectedFunc(fn)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold truncate">
                          {fn.name}()
                        </span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                            isSelected
                              ? "bg-blue-700 text-blue-100"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {fn.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono shrink-0 ${
                          isSelected ? "text-blue-100" : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        → {fn.returnType}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Column: Active Function Detail (Span 8) */}
            <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-slate-900 space-y-4">
              {selectedFunc ? (
                <>
                  {/* Name, Category, Return Type */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xl text-blue-600 dark:text-blue-400">
                        {selectedFunc.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold uppercase">
                        built-in
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-slate-400">returns:</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/50 dark:border-blue-900/40">
                        {selectedFunc.returnType}
                      </span>
                    </div>
                  </div>

                  {/* Signature Code Box */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                      Signature Definition
                    </label>
                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto text-slate-900 dark:text-slate-200 leading-relaxed">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">def </span>
                      <span className="whitespace-pre-wrap">{selectedFunc.signature}</span>
                    </div>
                  </div>

                  {/* Summary / Docstring */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Description
                    </label>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedFunc.summary}
                    </p>
                  </div>

                  {/* Parameters */}
                  {selectedFunc.parameters.length > 0 && (
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                        Parameters ({selectedFunc.parameters.length})
                      </label>
                      <div className="space-y-2">
                        {selectedFunc.parameters.map((param, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-xs"
                          >
                            <div className="flex items-center gap-1.5 font-mono shrink-0">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {param.name}
                              </span>
                              <span className="text-slate-400">:</span>
                              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                {param.type}
                              </span>
                              {param.default && (
                                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                  = {param.default}
                                </span>
                              )}
                              {param.required ? (
                                <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded font-sans font-bold">
                                  required
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-sans">
                                  optional
                                </span>
                              )}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 text-xs">
                              {param.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example Code */}
                  {selectedFunc.example && (
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                        <span>Working Python Example</span>
                        <button
                          type="button"
                          onClick={() => handleCopyExample(selectedFunc.example)}
                          className="flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline capitalize"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Example</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {selectedFunc.example}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-sm text-slate-400">
                  Select a Python built-in function to inspect its type hints and parameter specifications
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-3 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400">
              Tip: On desktop, hover over function names in the editor to see instant type tooltips.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
