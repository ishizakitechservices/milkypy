import React from "react";
import { TypeHintInfo } from "../lib/pythonTypeHints";
import { motion } from "motion/react";
import { Sparkles, Code2, HelpCircle, Check, Copy } from "lucide-react";

interface TypeHintTooltipProps {
  info: TypeHintInfo;
  position: { top: number; left: number };
  onClose?: () => void;
}

export const TypeHintTooltip: React.FC<TypeHintTooltipProps> = ({
  info,
  position,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyExample = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(info.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      style={{ top: position.top, left: position.left }}
      className="absolute z-50 w-80 sm:w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans pointer-events-auto select-text text-xs text-slate-800 dark:text-slate-100 backdrop-blur-md"
    >
      {/* Header with Name & Return Type */}
      <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono">
            builtin
          </span>
          <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
            {info.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-400">returns</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/50 dark:border-blue-900/40">
            {info.returnType}
          </span>
        </div>
      </div>

      {/* Signature Code Box */}
      <div className="p-3 space-y-2.5">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200 leading-relaxed scrollbar-thin">
          <span className="text-purple-600 dark:text-purple-400 font-bold">def </span>
          <span>{info.signature}</span>
        </div>

        {/* Description Summary */}
        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
          {info.summary}
        </p>

        {/* Parameters Breakdown */}
        {info.parameters.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Parameters ({info.parameters.length})
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
              {info.parameters.map((param, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 text-[11px] font-mono p-1 rounded bg-slate-50/80 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {param.name}
                    </span>
                    <span className="text-slate-400">:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {param.type}
                    </span>
                    {param.default && (
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                        = {param.default}
                      </span>
                    )}
                    {param.required ? (
                      <span className="text-[9px] px-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded font-sans font-semibold">
                        req
                      </span>
                    ) : (
                      <span className="text-[9px] px-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-sans">
                        opt
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-sans text-[11px] leading-tight">
                    {param.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Usage */}
        {info.example && (
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              <span>Example Usage</span>
              <button
                type="button"
                onClick={handleCopyExample}
                className="flex items-center gap-1 text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline capitalize"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 overflow-x-auto whitespace-pre-wrap">
              {info.example}
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
};
