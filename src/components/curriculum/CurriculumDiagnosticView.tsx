import React from "react";
import { ValidationResult } from "../../data/curriculum/validate";
import { AlertCircle, RotateCcw, CheckCircle, FileWarning } from "lucide-react";

interface CurriculumDiagnosticViewProps {
  validation: ValidationResult;
  onRetry: () => void;
}

export const CurriculumDiagnosticView: React.FC<CurriculumDiagnosticViewProps> = ({
  validation,
  onRetry,
}) => {
  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Error Header */}
        <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
              <FileWarning className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Curriculum Validation Notice
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The curriculum engine detected {validation.errors.length} issue(s) that require attention.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            PySlide Lab enforces strict prerequisite sequencing and schema validation so students never
            encounter unexplained technical concepts or broken practice items.
          </p>

          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-validate Curriculum</span>
          </button>
        </div>

        {/* Error Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Diagnostic Issues
          </h3>

          {validation.errors.map((err, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-rose-800 dark:text-rose-300">
                <span className="font-mono text-[11px] uppercase tracking-wide">
                  [{err.type}]
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  {err.location}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                {err.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
