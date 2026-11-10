import React from "react";
import { LessonSeed } from "../types";
import { X, Sprout, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export interface PlantedSeed {
  lessonId: string;
  lessonTitle: string;
  seed: LessonSeed;
  isUnlocked: boolean; // whether student reached or passed the sprouting phase
}

interface SeedsTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantedSeeds: PlantedSeed[];
}

export const SeedsTrackerModal: React.FC<SeedsTrackerModalProps> = ({
  isOpen,
  onClose,
  plantedSeeds,
}) => {
  if (!isOpen) return null;

  const total = plantedSeeds.length;
  const unlocked = plantedSeeds.filter((s) => s.isUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Seeds for Later Tracker</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
                  {unlocked} / {total} Sprouted
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Concepts introduced early so your brain connects the dots when they sprout!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {plantedSeeds.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">
              Start your first lesson to plant seeds!
            </p>
          ) : (
            plantedSeeds.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  item.isUnlocked
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                    : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {item.seed.concept}
                    </span>
                    {item.isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Sprouted!</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        Planted
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                    Sprouts in: {item.seed.sproutsIn}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                  {item.seed.teaser}
                </p>

                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span>Planted in lesson:</span>
                  <strong className="text-slate-600 dark:text-slate-300 font-medium">
                    {item.lessonTitle}
                  </strong>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </motion.div>
    </div>
  );
};
