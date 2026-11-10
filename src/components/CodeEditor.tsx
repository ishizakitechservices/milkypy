import React, { useState, useRef, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import { getCompletions } from "../lib/pythonAutocomplete";
import { formatPythonCode } from "../lib/pythonFormatter";
import { getPythonTypeHint, TypeHintInfo } from "../lib/pythonTypeHints";
import { TypeHintTooltip } from "./TypeHintTooltip";
import { TypeHintsModal } from "./TypeHintsModal";
import { AutocompleteItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  Check,
  Trash2,
  Code,
  UploadCloud,
} from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning?: boolean;
  title?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  isRunning = false,
  title = "main.py",
  readOnly = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePos, setAutocompletePos] = useState({ top: 0, left: 0 });

  // Type Hints Hover Tooltip State
  const [typeHintState, setTypeHintState] = useState<{
    info: TypeHintInfo;
    pos: { top: number; left: number };
  } | null>(null);
  const [showTypeHintsModal, setShowTypeHintsModal] = useState(false);
  const hoverTimeoutRef = useRef<any>(null);
  const closeTimeoutRef = useRef<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Drag and Drop File Support
  const [isDragging, setIsDragging] = useState(false);
  const [dragFeedback, setDragFeedback] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!readOnly) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (readOnly) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          onChange(text);
          setDragFeedback(`Successfully loaded file: ${file.name}`);
          setTimeout(() => setDragFeedback(null), 4000);
        }
      };
      reader.readAsText(file);
    } else {
      // If no files, check if plain text is dropped
      const text = e.dataTransfer.getData("text/plain");
      if (text) {
        onChange(text);
        setDragFeedback("Successfully loaded dropped text!");
        setTimeout(() => setDragFeedback(null), 4000);
      }
    }
  };

  // Dynamically position the autocomplete suggestions box next to the cursor
  useEffect(() => {
    if (showAutocomplete && textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorIndex = textarea.selectionStart;
      const textBefore = code.slice(0, cursorIndex);
      const linesBefore = textBefore.split("\n");
      const currentLineIdx = linesBefore.length - 1;
      const currentColIdx = linesBefore[currentLineIdx].length;

      const scrollTop = textarea.scrollTop;
      const scrollLeft = textarea.scrollLeft;

      // Line height is 24px (leading-6 is line-height: 1.5rem = 24px)
      // Vertical padding of textarea is 12px (p-3 is 0.75rem = 12px)
      let top = 12 + (currentLineIdx * 24) - scrollTop + 24; // place it 24px below cursor line

      // Check if the popup would go off the bottom of the textarea container
      const containerHeight = textarea.clientHeight;
      if (top + 220 > containerHeight) {
        // If it overflows the bottom, place it ABOVE the cursor line
        top = Math.max(10, 12 + (currentLineIdx * 24) - scrollTop - 235);
      }

      // Sidebar width = 44px (w-11). Padding-left = 12px.
      // Monospace char width is approx 8.4px.
      let left = 44 + 12 + (currentColIdx * 8.4) - scrollLeft;

      // Constrain left to be within the editor
      const containerWidth = textarea.clientWidth;
      if (left + 288 > containerWidth) { // 288px is the width of the popup (w-72 = 18rem = 288px)
        left = Math.max(50, containerWidth - 300);
      }

      setAutocompletePos({ top, left });
    }
  }, [showAutocomplete, code]);

  // Sync scroll between textarea and highlighted code pre
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
    // Dismiss type hint overlay on scroll
    setTypeHintState(null);
  };

  // Detect hovering over Python built-in functions
  const handleEditorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showAutocomplete || !textareaRef.current) {
      if (typeHintState) setTypeHintState(null);
      return;
    }

    const textarea = textareaRef.current;
    const rect = textarea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check bounds
    if (x < 8 || y < 8 || x > rect.width || y > rect.height) {
      return;
    }

    const scrollTop = textarea.scrollTop;
    const scrollLeft = textarea.scrollLeft;

    // Line height is 24px, padding-top is 12px
    const lineIdx = Math.floor((y - 12 + scrollTop) / 24);
    // Monospace width is approx 8.4px, padding-left is 12px
    const colIdx = Math.floor((x - 12 + scrollLeft) / 8.4);

    const lines = code.split("\n");
    if (lineIdx < 0 || lineIdx >= lines.length) {
      return;
    }

    const currentLine = lines[lineIdx];
    if (colIdx < 0 || colIdx >= currentLine.length) {
      return;
    }

    // Identify word token at column
    let start = colIdx;
    while (start > 0 && /[a-zA-Z0-9_]/.test(currentLine[start - 1])) {
      start--;
    }
    let end = colIdx;
    while (end < currentLine.length && /[a-zA-Z0-9_]/.test(currentLine[end])) {
      end++;
    }

    const hoveredWord = currentLine.slice(start, end);
    const hint = getPythonTypeHint(hoveredWord);

    if (hint) {
      clearTimeout(closeTimeoutRef.current);
      clearTimeout(hoverTimeoutRef.current);

      hoverTimeoutRef.current = setTimeout(() => {
        // Calculate smart position
        let top = 12 + (lineIdx * 24) - scrollTop + 26;
        if (top + 300 > textarea.clientHeight) {
          top = Math.max(10, 12 + (lineIdx * 24) - scrollTop - 290);
        }

        let left = 44 + 12 + (start * 8.4) - scrollLeft;
        const containerWidth = textarea.clientWidth;
        if (left + 380 > containerWidth) {
          left = Math.max(48, containerWidth - 390);
        }

        setTypeHintState({
          info: hint,
          pos: { top, left },
        });
      }, 120);
    } else {
      clearTimeout(hoverTimeoutRef.current);
      // Give short grace period before dismissing
      closeTimeoutRef.current = setTimeout(() => {
        setTypeHintState(null);
      }, 200);
    }
  };

  const handleEditorMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setTypeHintState(null);
    }, 250);
  };

  // Line numbers calculation
  const lines = code.split("\n");
  const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1);

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Textarea input & autocomplete handling
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onChange(newText);

    // Check autocomplete suggestions
    if (textareaRef.current) {
      const cursorOffset = textareaRef.current.selectionStart;
      const comps = getCompletions(newText, cursorOffset);
      if (comps.length > 0) {
        setSuggestions(comps);
        setSelectedIndex(0);
        setShowAutocomplete(true);
      } else {
        setShowAutocomplete(false);
      }
    }
  };

  // Insert selected autocomplete item
  const applyAutocomplete = (item: AutocompleteItem) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const textBefore = code.slice(0, start);
    const textAfter = code.slice(start);

    // Find the word/prefix before the cursor to replace it correctly
    const match = textBefore.match(/[a-zA-Z0-9_]+$/);
    const wordLength = match ? match[0].length : 0;

    const newCode =
      code.slice(0, start - wordLength) + item.insertText + textAfter;
    onChange(newCode);

    setShowAutocomplete(false);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      let newCursor = start - wordLength + item.insertText.length;
      
      // Smart cursor placement: if there is a parenthesis in the inserted text, place the cursor inside it
      const openParenIdx = item.insertText.indexOf("(");
      if (openParenIdx !== -1 && item.insertText.endsWith(")")) {
        // Position inside parenthesis
        newCursor = start - wordLength + openParenIdx + 1;
      }
      
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  // Keyboard navigation for editor & autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run shortcut: Cmd/Ctrl + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
      return;
    }


    // Auto-Format shortcut: Shift + Alt + F or Ctrl + Alt + F
    if (
      (e.shiftKey && e.altKey && (e.key === "F" || e.key === "f")) ||
      ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === "f" || e.key === "F"))
    ) {
      e.preventDefault();
      if (!readOnly) {
        const formatted = formatPythonCode(code);
        onChange(formatted.code);
      }
      return;
    }

    // Manual autocomplete trigger: Ctrl + Space
    if ((e.ctrlKey || e.metaKey) && e.key === " ") {
      e.preventDefault();
      if (textareaRef.current) {
        const comps = getCompletions(code, textareaRef.current.selectionStart);
        if (comps.length > 0) {
          setSuggestions(comps);
          setSelectedIndex(0);
          setShowAutocomplete(true);
        }
      }
      return;
    }

    if (showAutocomplete && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applyAutocomplete(suggestions[selectedIndex]);
        return;
      }
      if (e.key === "Escape") {
        setShowAutocomplete(false);
        return;
      }
    }

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const char = e.key;

    if (!readOnly) {
      // Auto-closing quotes & brackets
      if (char === "(" || char === "[" || char === "{" || char === '"' || char === "'") {
        e.preventDefault();
        let closingChar = "";
        if (char === "(") closingChar = ")";
        if (char === "[") closingChar = "]";
        if (char === "{") closingChar = "}";
        if (char === '"') closingChar = '"';
        if (char === "'") closingChar = "'";

        const selectedText = code.substring(start, end);
        const newCode = code.substring(0, start) + char + selectedText + closingChar + code.substring(end);
        onChange(newCode);

        setTimeout(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = start + 1 + selectedText.length;
        }, 0);
        return;
      }

      // Skip over existing closing quotes & brackets
      if (char === ")" || char === "]" || char === "}" || char === '"' || char === "'") {
        const nextChar = code.charAt(start);
        if (nextChar === char) {
          e.preventDefault();
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          return;
        }
      }

      // Backspace deletes matching empty pairs
      if (e.key === "Backspace" && start === end && start > 0) {
        const charBefore = code.charAt(start - 1);
        const charAfter = code.charAt(start);
        const isPair = 
          (charBefore === "(" && charAfter === ")") ||
          (charBefore === "[" && charAfter === "]") ||
          (charBefore === "{" && charAfter === "}") ||
          (charBefore === '"' && charAfter === '"') ||
          (charBefore === "'" && charAfter === "'");
        
        if (isPair) {
          e.preventDefault();
          const newCode = code.substring(0, start - 1) + code.substring(start + 1);
          onChange(newCode);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - 1;
          }, 0);
          return;
        }
      }
    }

    // Handle Tab key insertion (4 spaces)
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent
        const lineStart = code.lastIndexOf("\n", start - 1) + 1;
        const lineText = code.slice(lineStart, end);
        if (lineText.startsWith("    ")) {
          const newCode =
            code.slice(0, lineStart) + lineText.slice(4) + code.slice(end);
          onChange(newCode);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, start - 4);
            textarea.selectionEnd = Math.max(lineStart, end - 4);
          }, 0);
        }
      } else {
        // Indent 4 spaces
        const newCode = code.substring(0, start) + "    " + code.substring(end);
        onChange(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
    }
  };

  // Syntax highlighting HTML string generator
  const highlightedCode = React.useMemo(() => {
    try {
      return Prism.highlight(
        code || "",
        Prism.languages.python || Prism.languages.clike,
        "python"
      );
    } catch {
      return code;
    }
  }, [code]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex flex-col h-full bg-white dark:bg-[#15171E] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm relative group"
    >
      {/* Animated Drag Over Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-600/90 dark:bg-[#15171E]/95 backdrop-blur-xs z-40 flex flex-col items-center justify-center p-6 text-white text-center pointer-events-none border-4 border-dashed border-[#8BBEFF]/50 m-2 rounded-xl"
          >
            <UploadCloud className="w-12 h-12 mb-3 text-[#8BBEFF] animate-bounce" />
            <h3 className="text-base font-black uppercase tracking-wider">Drop Python Script / Text File</h3>
            <p className="text-xs text-blue-100 dark:text-[#BFC4CE] mt-1 leading-relaxed max-w-xs">
              Release to instantly import your Python (.py), text (.txt) file or plain text into the editor canvas!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag feedback toast */}
      <AnimatePresence>
        {dragFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-[#8BBEFF] text-white dark:text-[#08090D] font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg z-30 flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 animate-bounce" />
            <span>{dragFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clean, Debloated Editor Header */}
      <div className="h-10 bg-slate-100/90 dark:bg-[#252933]/80 border-b border-slate-200/80 dark:border-white/10 px-3 flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <Code className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF] shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-[#F3F4F6] truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="editor-btn-copy"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer touch-target"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65D9A3]" />
                <span className="text-emerald-600 dark:text-[#65D9A3]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {!readOnly && (
            <button
              id="editor-btn-clear"
              onClick={() => onChange("")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer touch-target"
              title="Clear Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Line Numbers & Code Canvas */}
      <div className="flex-1 relative font-mono text-sm leading-relaxed overflow-hidden flex bg-white dark:bg-[#08090D]">
        {/* Line Numbers Sidebar */}
        <div className="w-11 py-3 bg-slate-50 dark:bg-[#08090D] border-r border-slate-200/80 dark:border-white/10 text-slate-400 dark:text-[#BFC4CE]/50 text-right pr-2.5 font-mono text-xs select-none shrink-0 overflow-hidden">
          {lineNumbers.map((n) => (
            <div key={n} className="h-6 leading-6">
              {n}
            </div>
          ))}
        </div>

        {/* Code Input Canvas */}
        <div
          className="flex-1 relative overflow-hidden h-full"
          onMouseMove={handleEditorMouseMove}
          onMouseLeave={handleEditorMouseLeave}
        >
          {/* Highlighted Prism Overlay */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 m-0 pointer-events-none overflow-auto font-mono text-xs sm:text-sm leading-6 whitespace-pre text-slate-800 dark:text-[#F3F4F6] bg-transparent"
            dangerouslySetInnerHTML={{ __html: highlightedCode + "\n" }}
          />

          {/* Transparent Input Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              setTypeHintState(null);
              handleTextChange(e);
            }}
            onClick={() => setTypeHintState(null)}
            onKeyDown={(e) => {
              setTypeHintState(null);
              handleKeyDown(e);
            }}
            onScroll={handleScroll}
            readOnly={readOnly}
            placeholder="# Write Python code here... (Press Ctrl+Space for Autocomplete)"
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 p-3 m-0 w-full h-full font-mono text-xs sm:text-sm leading-6 whitespace-pre bg-transparent text-transparent caret-blue-600 dark:caret-[#8BBEFF] resize-none outline-hidden border-none overflow-auto"
          />

          {/* Type Hints Tooltip Overlay */}
          <AnimatePresence>
            {typeHintState && (
              <TypeHintTooltip
                info={typeHintState.info}
                position={typeHintState.pos}
                onClose={() => setTypeHintState(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Autocomplete Popup Menu */}
        <AnimatePresence>
          {showAutocomplete && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden text-xs"
              style={{ top: autocompletePos.top, left: autocompletePos.left }}
            >
              <div className="px-3 py-1.5 bg-slate-50/80 dark:bg-slate-950/40 backdrop-blur-sm text-[10px] text-slate-500 dark:text-slate-400 font-sans font-semibold border-b border-slate-200/60 dark:border-slate-800/80 flex justify-between select-none tracking-wide">
                <span>AUTOCOMPLETE SUGGESTIONS</span>
                <span className="text-[9px] text-slate-400 font-sans font-normal">↑↓ Nav • Tab/Enter</span>
              </div>
              <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyAutocomplete(item)}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between font-mono transition-colors ${
                      idx === selectedIndex
                        ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-sans ${
                          item.type === "keyword"
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300"
                            : item.type === "builtin"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : item.type === "snippet"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                    </div>
                    {item.detail && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono italic truncate max-w-[120px] ml-1">
                        {item.detail}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Touch & Mobile-Friendly Python Type Hints Reference Modal */}
      <TypeHintsModal
        isOpen={showTypeHintsModal}
        onClose={() => setShowTypeHintsModal(false)}
      />
    </div>
  );
};
