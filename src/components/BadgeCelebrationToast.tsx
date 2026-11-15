import React, { useEffect, useState } from "react";
import { X, CheckCircle2, HardDrive, Award, RotateCcw, ArrowRight } from "lucide-react";
import { LearnerBadge } from "../data/badges";

export interface LessonSavedNotification {
  lessonId: string;
  lessonTitle: string;
  xpEarned: number;
  badge?: LearnerBadge | null;
  currentUser?: string | null;
}

interface BadgeCelebrationToastProps {
  notification: LessonSavedNotification | null;
  onClose: () => void;
  onUndo?: (lessonId: string) => void;
  onNextLesson?: () => void;
  onOpenBadges?: () => void;
}

export const BadgeCelebrationToast: React.FC<BadgeCelebrationToastProps> = ({
  notification,
  onClose,
  onUndo,
  onNextLesson,
  onOpenBadges,
}) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!notification || paused) return;
    const timer = window.setTimeout(() => {
      onClose();
    }, 5500);
    return () => window.clearTimeout(timer);
  }, [notification, paused, onClose]);

  if (!notification) return null;

  const isNewBadge = Boolean(notification.badge);

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="fixed bottom-20 md:bottom-5 right-4 sm:right-5 z-50 pointer-events-auto max-w-sm w-[calc(100vw-2rem)] sm:w-full"
    >
      <div className="relative overflow-hidden rounded-xl bg-white/95 dark:bg-[#15171E]/95 backdrop-blur-md border border-slate-200 dark:border-[#252933] shadow-lg p-3.5 sm:p-4">
        {/* Top subtle status bar */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="flex-1 min-w-0 pr-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-900 dark:text-[#F3F4F6]">
                Lesson completed
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-[#65D9D0] tabular-nums">
                +{notification.xpEarned} XP
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium truncate mt-0.5">
              {notification.lessonTitle}
            </p>

            {/* Explicit local storage confirmation */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#BFC4CE] mt-1.5">
              <HardDrive className="w-3 h-3 text-slate-400 dark:text-slate-400 shrink-0" />
              <span>
                Progress saved locally on this device
                {notification.currentUser ? ` · ${notification.currentUser}` : " (offline ready)"}
              </span>
            </div>

            {/* Milestone badge line (subtle inline row if unlocked) */}
            {isNewBadge && notification.badge && (
              <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between gap-2 text-[11px]">
                <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-medium min-w-0 truncate">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Unlocked: {notification.badge.title}</span>
                </span>
                {onOpenBadges && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenBadges();
                      onClose();
                    }}
                    className="font-semibold text-amber-700 dark:text-amber-300 hover:underline shrink-0 cursor-pointer"
                  >
                    View
                  </button>
                )}
              </div>
            )}

            {/* Quick follow-up actions */}
            {(onUndo || onNextLesson) && (
              <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-[#252933]">
                {onUndo && (
                  <button
                    type="button"
                    onClick={() => {
                      onUndo(notification.lessonId);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-[#BFC4CE] dark:hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                )}
                {onNextLesson && (
                  <button
                    type="button"
                    onClick={() => {
                      onNextLesson();
                      onClose();
                    }}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-[#8BBEFF] hover:underline cursor-pointer"
                  >
                    <span>Next lesson</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#252933] transition-colors cursor-pointer"
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
