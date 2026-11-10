import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Award, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { LEARNER_BADGES, getEarnedBadges, LearnerBadge } from "../data/badges";

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedLessonIds: string[];
  totalXp: number;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  completedLessonIds,
  totalXp,
}) => {
  if (!isOpen) return null;

  const earned = getEarnedBadges(completedLessonIds);
  const earnedIds = new Set(earned.map((b) => b.id));

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                  My Coding Badges
                </h3>
                <p className="text-xs text-blue-100 opacity-90">
                  {earned.length} of {LEARNER_BADGES.length} unlocked · {totalXp} XP
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badges Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
            {LEARNER_BADGES.map((badge) => {
              const isUnlocked = earnedIds.has(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                    isUnlocked
                      ? "bg-amber-50/50 dark:bg-slate-800/80 border-amber-200 dark:border-amber-900/60 shadow-xs"
                      : "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70"
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                      isUnlocked
                        ? `bg-linear-to-br ${badge.gradient} text-white`
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400 grayscale"
                    }`}
                  >
                    <span>{badge.icon}</span>
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                        {badge.title}
                      </h4>
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          <Lock className="w-2.5 h-2.5" />
                          {badge.requiredCount} Lessons
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Complete lessons to unlock all trophies!
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Keep Learning
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
