import React, { useState } from "react";
import { GlossaryEntry } from "../types";
import { GLOSSARY_TERMS, getGlossaryEntry } from "../data/glossary";
import {
  BookOpen,
  Search,
  X,
  Sparkles,
  Lightbulb,
  Code2,
  Bookmark,
  Check,
  Copy,
  Tag,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTermId?: string | null;
  onSelectTerm?: (termId: string) => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  activeTermId,
  onSelectTerm,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All Terms" },
    { id: "core", label: "Core Concepts" },
    { id: "syntax", label: "Syntax & Operators" },
    { id: "data-type", label: "Data Types" },
    { id: "control-flow", label: "Control Flow" },
    { id: "data-structure", label: "Collections" },
    { id: "function", label: "Functions" },
  ];

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesCategory =
      selectedCategory === "all" || term.category === selectedCategory;
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.plainDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.metaphor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl h-[85vh] max-h-[800px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Python Zero to Pro Glossary</span>
                <span className="text-[11px] font-mono text-slate-500 font-normal">
                  ({GLOSSARY_TERMS.length} terms)
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Beginner-friendly explanations, real-world metaphors, and runnable examples.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close Glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts (e.g. variable, loop, f-string)..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                No glossary terms found matching "{searchQuery}"
              </p>
              <p className="text-xs text-slate-400">
                Try searching for a simpler term like "variable", "string", or "print".
              </p>
            </div>
          ) : (
            filteredTerms.map((term) => {
              const isHighlight = activeTermId === term.id;
              return (
                <div
                  key={term.id}
                  id={`glossary-term-${term.id}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isHighlight
                      ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-md ring-2 ring-blue-500/30"
                      : "bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Title & Phase */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        {term.term}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
                        {term.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                      {term.introducedInPhase}
                    </span>
                  </div>

                  {/* Plain English Definition */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    {term.plainDefinition}
                  </p>

                  {/* Real World Metaphor Callout */}
                  <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl mb-3 flex items-start gap-2.5 text-xs">
                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-amber-950 dark:text-amber-200 leading-relaxed">
                      <strong className="font-bold text-amber-900 dark:text-amber-300">
                        Real-World Comparison:{" "}
                      </strong>
                      {term.metaphor}
                    </div>
                  </div>

                  {/* Code Snippet */}
                  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Example</span>
                      <button
                        onClick={() => handleCopyCode(term.codeSnippet, term.id)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === term.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                      <code>{term.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Click any highlighted keyword in lessons to open its quick popover.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Popover component for clicking terms in the lesson text
interface TermPopoverProps {
  termId: string;
  onOpenFullGlossary: (termId: string) => void;
  onClose: () => void;
  anchorRect?: DOMRect | null;
}

export const TermPopover: React.FC<TermPopoverProps> = ({
  termId,
  onOpenFullGlossary,
  onClose,
}) => {
  const term = getGlossaryEntry(termId);
  if (!term) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 space-y-3 relative"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                {term.term}
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                {term.category}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Introduced in {term.introducedInPhase}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {term.plainDefinition}
        </p>

        {/* Metaphor */}
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl text-xs flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-amber-950 dark:text-amber-200 text-[11px]">
            <strong>Metaphor: </strong> {term.metaphor}
          </div>
        </div>

        {/* Small Code Preview */}
        <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
          <code>{term.codeSnippet}</code>
        </pre>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onOpenFullGlossary(term.id)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open in Full Glossary</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
};
