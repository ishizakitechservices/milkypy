import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Award, CheckCircle } from "lucide-react";
import { LearnerBadge } from "../data/badges";

interface BadgeCelebrationToastProps {
  notification: {
    badge?: LearnerBadge | null;
    lessonTitle: string;
    xpEarned: number;
  } | null;
  onClose: () => void;
}

export const BadgeCelebrationToast: React.FC<BadgeCelebrationToastProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const isNewBadge = Boolean(notification.badge);

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 pointer-events-auto max-w-sm w-full">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-500/60 shadow-2xl p-4 sm:p-5"
        >
          {/* Confetti Glow Background Effect */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5">
            {/* Badge or Trophy Icon Circle */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 bg-linear-to-br ${
                notification.badge
                  ? notification.badge.gradient
                  : "from-emerald-400 to-teal-500"
              }`}
            >
              <span className="select-none animate-bounce">
                {notification.badge ? notification.badge.icon : "★"}
              </span>
            </div>

            {/* Notification Text */}
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-1.5 mb-0.5">
                {isNewBadge ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60">
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                    New Badge Unlocked!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                    Lesson Completed!
                  </span>
                )}
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  +{notification.xpEarned} XP
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
                {isNewBadge
                  ? notification.badge?.title
                  : notification.lessonTitle}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {isNewBadge
                  ? notification.badge?.description
                  : "Awesome work! Keep coding and unlock more badges!"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
