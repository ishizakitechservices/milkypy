import React, { useRef, useEffect } from "react";
import { CurriculumLesson, CurriculumModule } from "../../data/curriculum/schema";
import { LessonSection } from "./LessonSection";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Clock,
  MessageSquare,
  BookMarked,
  Award,
  Target,
  X,
} from "lucide-react";

interface CurriculumLessonReaderProps {
  lesson: CurriculumLesson;
  module: CurriculumModule;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string) => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  onOpenMobileSidebar?: () => void;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
  onOpenAiAssist?: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick?: (code: string) => void;
  onOpenGlossary?: () => void;
  onOpenBadges?: () => void;
  onStartLessonQuiz?: (lessonId: string) => void;
  quizReturnContext?: { topicTitle: string; question?: string } | null;
  onReturnToQuiz?: () => void;
  onDismissQuizReturn?: () => void;
}

export const CurriculumLessonReader: React.FC<CurriculumLessonReaderProps> = ({
  lesson,
  module,
  isCompleted,
  onToggleComplete,
  onNextLesson,
  onPrevLesson,
  onOpenMobileSidebar,
  onToggleSidebar,
  sidebarCollapsed,
  onOpenAiAssist,
  onPracticeClick,
  onOpenGlossary,
  onOpenBadges,
  onStartLessonQuiz,
  quizReturnContext,
  onReturnToQuiz,
  onDismissQuizReturn,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryLessonCode = React.useMemo(() => {
    const activity = lesson.sections.find((s) => s.type === "editor-activity");
    if (activity && "starterCode" in activity && activity.starterCode) {
      return activity.starterCode;
    }
    const example = lesson.sections.find((s) => s.type === "example");
    if (example && "code" in example && example.code) {
      return example.code;
    }
    return "";
  }, [lesson]);

  const lessonContextPayload = React.useMemo(
    () => ({
      title: lesson.title,
      description: lesson.summary || module.title,
      learningObjectives: lesson.learningObjectives,
      starterCode: primaryLessonCode || undefined,
    }),
    [lesson, module.title, primaryLessonCode]
  );

  // Auto scroll to top when changing lesson
  useEffect(() => {
    const scrollToTop = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = setTimeout(scrollToTop, 20);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [lesson.id]);

  const handleNextClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (onNextLesson) {
      onNextLesson();
    }
  };

  const handlePrevClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (onPrevLesson) {
      onPrevLesson();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-white dark:bg-[#08090D] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 scroll-smooth"
    >
      <article className="max-w-2xl mx-auto space-y-8">
        {quizReturnContext && onReturnToQuiz && (
          <div className="rounded-xl border border-blue-200 dark:border-[#8BBEFF]/30 bg-blue-50/70 dark:bg-[#15171E] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="text-xs font-semibold text-blue-800 dark:text-[#8BBEFF]">
                Reviewing from quiz: {quizReturnContext.topicTitle}
              </div>
              {quizReturnContext.question && (
                <p className="text-xs text-slate-600 dark:text-[#BFC4CE] truncate">
                  {quizReturnContext.question}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onReturnToQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#73aef8] text-white dark:text-[#08090D] text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Quiz</span>
              </button>
              {onDismissQuizReturn && (
                <button
                  type="button"
                  onClick={onDismissQuizReturn}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  aria-label="Dismiss quiz banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Top Header with Breadcrumbs & Sidebar Toggle */}
        <header className="border-b border-slate-200 dark:border-[#252933] pb-6 space-y-3">
          <div className="flex items-center justify-between gap-4">
            {/* Sidebar Toggle for Desktop and Mobile */}
            <div className="flex items-center gap-2">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#15171E] transition-colors cursor-pointer touch-target"
                  title={sidebarCollapsed ? "Show course outline" : "Collapse course outline"}
                >
                  {sidebarCollapsed ? (
                    <>
                      <PanelLeftOpen className="w-4 h-4 text-blue-600 dark:text-[#8BBEFF]" />
                      <span>Show Outline</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="w-4 h-4 text-blue-600 dark:text-[#8BBEFF]" />
                      <span>Hide Outline</span>
                    </>
                  )}
                </button>
              )}

              {onOpenMobileSidebar && (
                <button
                  onClick={onOpenMobileSidebar}
                  className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#8BBEFF] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#15171E] border border-slate-200 dark:border-[#252933] transition-colors cursor-pointer touch-target"
                >
                  <Menu className="w-4 h-4" />
                  <span>Lessons Outline</span>
                </button>
              )}
            </div>

            {/* Read Time, Quick Modals & Ask AI */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {lesson.estimatedMinutes && (
                <div className="hidden sm:flex text-xs text-slate-400 dark:text-[#BFC4CE]/70 items-center gap-1 font-mono mr-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lesson.estimatedMinutes} min read</span>
                </div>
              )}
              {onOpenGlossary && (
                <button
                  type="button"
                  onClick={onOpenGlossary}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#15171E] dark:hover:bg-[#252933] border border-slate-200 dark:border-[#252933] text-slate-700 dark:text-[#BFC4CE] text-xs font-semibold transition-colors cursor-pointer touch-target"
                  title="Open Python Glossary"
                >
                  <BookMarked className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                  <span className="hidden sm:inline">Glossary</span>
                </button>
              )}
              {onOpenBadges && (
                <button
                  type="button"
                  onClick={onOpenBadges}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#15171E] dark:hover:bg-[#252933] border border-slate-200 dark:border-[#252933] text-slate-700 dark:text-[#BFC4CE] text-xs font-semibold transition-colors cursor-pointer touch-target"
                  title="View Coding Badges & XP"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500 dark:text-[#F2BC72]" />
                </button>
              )}
              {onOpenAiAssist && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenAiAssist(primaryLessonCode, undefined, lessonContextPayload)
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-[#8BBEFF]/10 dark:hover:bg-[#8BBEFF]/20 border border-blue-200 dark:border-[#8BBEFF]/30 text-blue-700 dark:text-[#8BBEFF] text-xs font-bold transition-colors cursor-pointer touch-target whitespace-nowrap"
                  title="Get help with this lesson"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Code Help</span>
                </button>
              )}
            </div>
          </div>

          {/* Module Kicker & Lesson Number */}
          <div className="text-xs text-slate-500 dark:text-[#BFC4CE] flex items-center gap-2">
            <span className="font-semibold text-blue-600 dark:text-[#8BBEFF]">
              {module.title}
            </span>
            <span aria-hidden="true">·</span>
            <span>Lesson {lesson.order}</span>
          </div>

          {/* Clean Main Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight leading-tight">
            {lesson.title}
          </h1>

          {/* Clean Summary */}
          {lesson.summary && (
            <p className="text-base text-slate-600 dark:text-[#BFC4CE] leading-relaxed font-normal">
              {lesson.summary}
            </p>
          )}

          {/* Clean Learning Goals (Unboxed, simple bullet points) */}
          {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE] uppercase tracking-wider block mb-1.5">
                What you'll learn:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-[#BFC4CE]">
                {lesson.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {/* Lesson Content Sections */}
        <div className="space-y-4">
          {lesson.sections.map((section, idx) => (
            <LessonSection
              key={`${lesson.id}-${idx}`}
              section={section}
              lessonContext={lessonContextPayload}
              onOpenAiAssist={onOpenAiAssist}
              onPracticeClick={onPracticeClick}
            />
          ))}
        </div>

        {/* Clean Footer Navigation & Mark Complete */}
        <footer className="pt-8 pb-4 border-t border-slate-200 dark:border-[#252933]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Previous Lesson */}
            <div>
              {onPrevLesson ? (
                <button
                  onClick={handlePrevClick}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#252933] hover:bg-slate-50 dark:hover:bg-[#15171E] text-xs text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer touch-target"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Mark Complete & Quiz Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onToggleComplete(lesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer touch-target ${
                  isCompleted
                    ? "bg-emerald-50 dark:bg-[#65D9D0]/10 text-emerald-700 dark:text-[#65D9D0] border border-emerald-200 dark:border-[#65D9D0]/30"
                    : "bg-slate-100 dark:bg-[#15171E] hover:bg-slate-200 dark:hover:bg-[#252933] text-slate-800 dark:text-[#F3F4F6] border border-slate-200 dark:border-[#252933]"
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-600 dark:text-[#65D9D0]" : "text-slate-400"}`} />
                <span>{isCompleted ? "Completed" : "Mark as Complete"}</span>
              </button>

              {onStartLessonQuiz && (
                <button
                  type="button"
                  onClick={() => onStartLessonQuiz(lesson.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#252933] hover:bg-slate-100 dark:hover:bg-[#15171E] text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer touch-target"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65D9D0]" />
                  <span>Quiz This Lesson</span>
                </button>
              )}
            </div>

            {/* Next Lesson or Course Finish */}
            <div>
              {onNextLesson ? (
                <button
                  onClick={handleNextClick}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#8BBEFF]/90 text-white dark:text-[#08090D] text-xs font-bold transition-colors cursor-pointer shadow-xs touch-target"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 dark:text-[#65D9D0] px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#65D9D0]/10 border border-emerald-200 dark:border-[#65D9D0]/30">
                  All Lessons Done
                </span>
              )}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};
