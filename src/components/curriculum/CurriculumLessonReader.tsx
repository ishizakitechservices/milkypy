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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

            {/* Read Time */}
            {lesson.estimatedMinutes && (
              <div className="text-xs text-slate-400 dark:text-[#BFC4CE]/70 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{lesson.estimatedMinutes} min read</span>
              </div>
            )}
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
              key={idx}
              section={section}
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

            {/* Mark Complete Action */}
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
                <span className="text-xs font-medium text-emerald-600 dark:text-[#65D9D0] px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#65D9D0]/10 border border-emerald-200 dark:border-[#65D9D0]/30">
                  🎉 Final Lesson
                </span>
              )}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};
