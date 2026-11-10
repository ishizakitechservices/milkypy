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

interface CurriculumViewProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onOpenAiAssist: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick: (code: string) => void;
  currentUser: string | null;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  progress,
  onUpdateProgress,
  onOpenAiAssist,
  onPracticeClick,
  currentUser,
}) => {
  // Show outline first on both mobile and desktop views; upon selection it hides
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(true);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(true);
  const [showFormatGuide, setShowFormatGuide] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>(() =>
    getCurriculumValidation()
  );

  const modules = useMemo(() => getCurriculumModules(), []);
  const allLessons = useMemo(() => getAllLessons(), []);

  // Determine initial active lesson and remember where user left off across sessions & logouts
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
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

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] overflow-hidden">
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
      />
    </div>
  );
};
