import React, { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "../lib/clipboard";

interface CopyCodeButtonProps {
  code: string;
  label?: string;
  copiedLabel?: string;
  compact?: boolean;
  className?: string;
  title?: string;
}

export const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({
  code,
  label = "Copy",
  copiedLabel = "Copied",
  compact = false,
  className = "",
  title = "Copy code to clipboard",
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied to clipboard" : title}
      aria-label={copied ? "Copied to clipboard" : title}
      className={`inline-flex items-center gap-1 font-sans font-semibold transition-colors cursor-pointer select-none ${
        compact ? "px-2 py-1 text-[11px] rounded-md" : "px-2.5 py-1 text-xs rounded-lg"
      } ${
        copied
          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70"
          : "bg-white/90 dark:bg-[#15171E] hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#252933]"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
