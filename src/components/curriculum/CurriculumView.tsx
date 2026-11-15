import React, { useState, useEffect, useMemo } from "react";
import { UserProgress } from "../../types";
import {
  getCurriculumModules,
  getCurriculumValidation,
  getLessonById,
  getNextLesson,
  getPrevLesson,
  getAllLessons,
} from "../../data/curriculum";
import { CurriculumSidebar } from "./CurriculumSidebar";
import { CurriculumLessonReader } from "./CurriculumLessonReader";
import { CurriculumDiagnosticView } from "./CurriculumDiagnosticView";
import { CurriculumEmptyGuide } from "./CurriculumEmptyGuide";
import { ValidationResult } from "../../data/curriculum/validate";
import { GlossaryModal } from "../GlossaryModal";
import { BadgesModal } from "../BadgesModal";
import { BadgeCelebrationToast, LessonSavedNotification } from "../BadgeCelebrationToast";
import { getEarnedBadges, getNewlyUnlockedBadge } from "../../data/badges";

interface QuizReturnContext {
  topicTitle: string;
  question?: string;
}

interface CurriculumViewProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onOpenAiAssist: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick: (code: string) => void;
  currentUser: string | null;
  requestedLessonId?: string | null;
  onClearRequestedLesson?: () => void;
  onStartLessonQuiz?: (lessonId: string) => void;
  quizReturnContext?: QuizReturnContext | null;
  onReturnToQuiz?: () => void;
  onDismissQuizReturn?: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  progress,
  onUpdateProgress,
  onOpenAiAssist,
  onPracticeClick,
  currentUser,
  requestedLessonId,
  onClearRequestedLesson,
  onStartLessonQuiz,
  quizReturnContext,
  onReturnToQuiz,
  onDismissQuizReturn,
}) => {
  // Show outline first on both mobile and desktop views; upon selection it hides
  // If a specific lesson was requested via URL (?lesson=...), start with sidebar closed so the lesson is immediately visible
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("lesson");
      if (p) return false;
    }
    return true;
  });
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("lesson");
      if (p) return false;
    }
    return true;
  });
  const [showFormatGuide, setShowFormatGuide] = useState<boolean>(false);
  const [showGlossary, setShowGlossary] = useState<boolean>(false);
  const [showBadges, setShowBadges] = useState<boolean>(false);
  const [celebrationToast, setCelebrationToast] = useState<LessonSavedNotification | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult>(() =>
    getCurriculumValidation()
  );

  const modules = useMemo(() => getCurriculumModules(), []);
  const allLessons = useMemo(() => getAllLessons(), []);

  // Determine initial active lesson and remember where user left off across sessions & logouts
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlLesson = new URLSearchParams(window.location.search).get("lesson");
      if (urlLesson && allLessons.some((item) => item.lesson.id === urlLesson)) {
        return urlLesson;
      }
    }
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("milkypy_last_active_lesson_id") : null;
      if (stored && allLessons.some((item) => item.lesson.id === stored)) {
        return stored;
      }
    } catch (e) {}

    if (progress.lastActiveLessonId) {
      const exists = allLessons.some((item) => item.lesson.id === progress.lastActiveLessonId);
      if (exists) return progress.lastActiveLessonId;
    }
    return allLessons[0]?.lesson.id || "lesson-01-01-what-is-python";
  });

  // Sync when navigated directly to a specific lesson (e.g., from QuizView)
  useEffect(() => {
    if (requestedLessonId && allLessons.some((item) => item.lesson.id === requestedLessonId)) {
      setActiveLessonId(requestedLessonId);
      setMobileSidebarOpen(false);
      setDesktopSidebarOpen(false);
      onClearRequestedLesson?.();
    }
  }, [requestedLessonId, allLessons, onClearRequestedLesson]);

  // Keep progress and persistent storage in sync with active lesson
  useEffect(() => {
    if (activeLessonId) {
      try {
        localStorage.setItem("milkypy_last_active_lesson_id", activeLessonId);
      } catch (e) {}
    }
    if (activeLessonId && activeLessonId !== progress.lastActiveLessonId) {
      onUpdateProgress({
        ...progress,
        lastActiveLessonId: activeLessonId,
      });
    } else if (!activeLessonId && allLessons.length > 0) {
      setActiveLessonId(allLessons[0].lesson.id);
    }
  }, [activeLessonId, allLessons]);

  const activeLessonData = useMemo(() => {
    return getLessonById(activeLessonId) || allLessons[0] || null;
  }, [activeLessonId, allLessons]);

  const nextLessonData = useMemo(() => {
    return getNextLesson(activeLessonId);
  }, [activeLessonId]);

  const prevLessonData = useMemo(() => {
    return getPrevLesson(activeLessonId);
  }, [activeLessonId]);

  // Handle student-controlled mark as complete
  const handleToggleComplete = (lessonId: string) => {
    const prevCount = progress.completedLessonIds.length;
    const isCompleted = progress.completedLessonIds.includes(lessonId);
    let newCompleted: string[];
    let xpDelta = 0;

    if (isCompleted) {
      newCompleted = progress.completedLessonIds.filter((id) => id !== lessonId);
      xpDelta = -25;
    } else {
      newCompleted = [...progress.completedLessonIds, lessonId];
      xpDelta = 25;
    }

    const updated: UserProgress = {
      ...progress,
      completedLessonIds: newCompleted,
      totalXp: Math.max(0, (progress.totalXp || 0) + xpDelta),
    };

    onUpdateProgress(updated);

    if (!isCompleted) {
      const unlocked = getNewlyUnlockedBadge(prevCount, newCompleted.length);
      const lessonMeta = getLessonById(lessonId);
      setCelebrationToast({
        lessonId,
        badge: unlocked,
        lessonTitle: lessonMeta?.lesson.title || "Python Lesson",
        xpEarned: 25,
        currentUser,
      });
    } else if (celebrationToast?.lessonId === lessonId) {
      setCelebrationToast(null);
    }
  };

  const handleUndoComplete = (lessonId: string) => {
    if (!progress.completedLessonIds.includes(lessonId)) return;
    onUpdateProgress({
      ...progress,
      completedLessonIds: progress.completedLessonIds.filter((id) => id !== lessonId),
      totalXp: Math.max(0, (progress.totalXp || 0) - 25),
    });
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setMobileSidebarOpen(false);
    setDesktopSidebarOpen(false);
  };

  const handleNext = () => {
    if (nextLessonData) {
      setActiveLessonId(nextLessonData.lesson.id);
      setMobileSidebarOpen(false);
      setDesktopSidebarOpen(false);
    }
  };

  const handlePrev = () => {
    if (prevLessonData) {
      setActiveLessonId(prevLessonData.lesson.id);
      setMobileSidebarOpen(false);
      setDesktopSidebarOpen(false);
    }
  };

  const handleRetryValidation = () => {
    setValidationResult(getCurriculumValidation());
  };

  // If user requests to view the format guide, show it full-screen
  if (showFormatGuide) {
    return <CurriculumEmptyGuide onBack={() => setShowFormatGuide(false)} />;
  }

  // If no module files have been added yet, display the author guide
  if (modules.length === 0) {
    return <CurriculumEmptyGuide />;
  }

  // If validation fails, present clear diagnostic interface
  if (!validationResult.valid) {
    return (
      <CurriculumDiagnosticView
        validation={validationResult}
        onRetry={handleRetryValidation}
      />
    );
  }

  if (!activeLessonData) {
    return <CurriculumEmptyGuide />;
  }

  const isCompleted = progress.completedLessonIds.includes(activeLessonData.lesson.id);
  const earnedBadgesCount = getEarnedBadges(progress.completedLessonIds).length;

  return (
    <div className="flex-1 flex h-[calc(100vh-7.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Curriculum Outline Desktop Sidebar */}
      {desktopSidebarOpen && (
        <div className="hidden md:block h-full shrink-0 animate-in slide-in-from-left duration-200">
          <CurriculumSidebar
            modules={modules}
            activeLessonId={activeLessonId}
            completedLessonIds={progress.completedLessonIds}
            onSelectLesson={handleSelectLesson}
            isOpenOnMobile={false}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onToggleDesktopCollapse={() => setDesktopSidebarOpen(false)}
            onOpenFormatGuide={() => setShowFormatGuide(true)}
            onOpenGlossary={() => setShowGlossary(true)}
            onOpenBadges={() => setShowBadges(true)}
            earnedBadgesCount={earnedBadgesCount}
            totalXp={progress.totalXp || 0}
            isMobileDrawer={false}
            currentUser={currentUser}
            lastActiveLessonId={progress.lastActiveLessonId || activeLessonId}
          />
        </div>
      )}

      {/* Mobile Drawer (Only renders overlay modal when mobileSidebarOpen is true) */}
      <CurriculumSidebar
        modules={modules}
        activeLessonId={activeLessonId}
        completedLessonIds={progress.completedLessonIds}
        onSelectLesson={handleSelectLesson}
        isOpenOnMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenFormatGuide={() => setShowFormatGuide(true)}
        onOpenGlossary={() => setShowGlossary(true)}
        onOpenBadges={() => setShowBadges(true)}
        earnedBadgesCount={earnedBadgesCount}
        totalXp={progress.totalXp || 0}
        isMobileDrawer={true}
        currentUser={currentUser}
        lastActiveLessonId={progress.lastActiveLessonId || activeLessonId}
      />

      {/* Main Lesson Reader Canvas */}
      <CurriculumLessonReader
        lesson={activeLessonData.lesson}
        module={activeLessonData.module}
        isCompleted={isCompleted}
        onToggleComplete={handleToggleComplete}
        onNextLesson={nextLessonData ? handleNext : undefined}
        onPrevLesson={prevLessonData ? handlePrev : undefined}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        onToggleSidebar={() => setDesktopSidebarOpen((prev) => !prev)}
        sidebarCollapsed={!desktopSidebarOpen}
        onOpenAiAssist={onOpenAiAssist}
        onPracticeClick={onPracticeClick}
        onOpenGlossary={() => setShowGlossary(true)}
        onOpenBadges={() => setShowBadges(true)}
        onStartLessonQuiz={onStartLessonQuiz}
        quizReturnContext={quizReturnContext}
        onReturnToQuiz={onReturnToQuiz}
        onDismissQuizReturn={onDismissQuizReturn}
      />

      {/* Interactive Python Glossary Modal */}
      <GlossaryModal
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
      />

      {/* Coding Badges & XP Trophy Modal */}
      <BadgesModal
        isOpen={showBadges}
        onClose={() => setShowBadges(false)}
        completedLessonIds={progress.completedLessonIds}
        totalXp={progress.totalXp || 0}
      />

      {/* Subtle Local-Save & Milestone Toast */}
      <BadgeCelebrationToast
        notification={celebrationToast}
        onClose={() => setCelebrationToast(null)}
        onUndo={handleUndoComplete}
        onNextLesson={nextLessonData ? handleNext : undefined}
        onOpenBadges={() => setShowBadges(true)}
      />
    </div>
  );
};
