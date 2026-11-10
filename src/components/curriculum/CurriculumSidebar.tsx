import React, { useState, useEffect, useMemo } from "react";
import { CurriculumModule } from "../../data/curriculum/schema";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Search, X, PanelLeftClose, FileCode, BookmarkCheck, Play } from "lucide-react";

interface CurriculumSidebarProps {
  modules: CurriculumModule[];
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lessonId: string) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  onToggleDesktopCollapse?: () => void;
  onOpenFormatGuide?: () => void;
  isMobileDrawer?: boolean;
  currentUser?: string | null;
  lastActiveLessonId?: string;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  modules,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  isOpenOnMobile = false,
  onCloseMobile,
  onToggleDesktopCollapse,
  onOpenFormatGuide,
  isMobileDrawer = false,
  currentUser = null,
  lastActiveLessonId,
}) => {
  // Find last active lesson for resuming when logged out
  const lastActiveItem = useMemo(() => {
    const targetId = lastActiveLessonId || activeLessonId;
    if (!targetId) return null;
    for (const mod of modules) {
      const lesson = mod.lessons.find((l) => l.id === targetId);
      if (lesson) return { lesson, module: mod };
    }
    return null;
  }, [modules, lastActiveLessonId, activeLessonId]);
  // Listen for Escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpenOnMobile && onCloseMobile) {
          onCloseMobile();
        } else if (onToggleDesktopCollapse) {
          onToggleDesktopCollapse();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpenOnMobile, onCloseMobile, onToggleDesktopCollapse]);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand module of active lesson by default
    const map: Record<string, boolean> = {};
    modules.forEach((mod) => {
      const hasActive = mod.lessons.some((l) => l.id === activeLessonId);
      map[mod.id] = hasActive || mod.order <= 2;
    });
    return map;
  });

  const [searchQuery, setSearchQuery] = useState("");

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedSet = new Set(completedLessonIds);

  const filteredModules = modules.map((mod) => {
    if (!searchQuery.trim()) return mod;
    const lower = searchQuery.toLowerCase();
    const matchingLessons = mod.lessons.filter(
      (l) => l.title.toLowerCase().includes(lower) || l.learningObjectives.some((obj) => obj.toLowerCase().includes(lower))
    );
    return {
      ...mod,
      lessons: matchingLessons,
    };
  }).filter((mod) => mod.lessons.length > 0);

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalCompleted = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => completedSet.has(l.id)).length,
    0
  );
  const percentComplete = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#08090D] border-r border-slate-200 dark:border-[#252933] select-none text-slate-800 dark:text-[#F3F4F6]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#252933] bg-white dark:bg-[#15171E]">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Lessons Outline
          </h2>
          <div className="flex items-center gap-1">
            {onToggleDesktopCollapse && (
              <button
                onClick={onToggleDesktopCollapse}
                className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer touch-target"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
            {isOpenOnMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer touch-target"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Progress Line */}
        <div className="text-xs text-slate-500 dark:text-[#BFC4CE] flex items-center justify-between mb-1.5">
          <span>{totalCompleted} of {totalLessons} completed</span>
          <span className="font-mono tabular-nums text-slate-700 dark:text-[#8BBEFF] font-semibold">{percentComplete}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-[#252933] rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-[#8BBEFF] transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Search Input */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#BFC4CE]/60 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] rounded-lg text-xs text-slate-800 dark:text-[#F3F4F6] focus:outline-none focus:border-blue-500 dark:focus:border-[#8BBEFF]"
          />
        </div>

        {/* If logged out, give prominent option to continue lesson where left off */}
        {!currentUser && lastActiveItem && (
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#15171E] dark:to-[#252933] border border-blue-200 dark:border-[#8BBEFF]/30 rounded-xl shadow-xs">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 dark:text-[#8BBEFF] uppercase tracking-wider">
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                <span>Resume Lesson</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#BFC4CE] font-medium">Guest Mode</span>
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-[#F3F4F6] line-clamp-1 mb-0.5">
              {lastActiveItem.lesson.title}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#BFC4CE] mb-2.5 line-clamp-1">
              {lastActiveItem.module.title}
            </div>
            <button
              onClick={() => {
                onSelectLesson(lastActiveItem.lesson.id);
                if (isOpenOnMobile && onCloseMobile) onCloseMobile();
                if (onToggleDesktopCollapse) onToggleDesktopCollapse();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#8BBEFF]/90 text-white dark:text-[#08090D] text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer touch-target"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Continue where you left off »</span>
            </button>
          </div>
        )}
      </div>

      {/* Module List Accordion */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredModules.map((mod) => {
          const isExpanded = expandedModules[mod.id] || searchQuery.length > 0;
          const modCompleted = mod.lessons.filter((l) => completedSet.has(l.id)).length;

          return (
            <div key={mod.id} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full px-2.5 py-2 flex items-center justify-between text-left text-xs font-medium text-slate-700 dark:text-[#F3F4F6] hover:bg-slate-200/50 dark:hover:bg-[#15171E] rounded-md transition-colors cursor-pointer touch-target"
              >
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#BFC4CE] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#BFC4CE] shrink-0" />
                  )}
                  <span className="truncate">{mod.title}</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-[#BFC4CE] font-mono shrink-0 tabular-nums">
                  {modCompleted}/{mod.lessons.length}
                </div>
              </button>

              {isExpanded && (
                <div className="pl-4 pr-1 py-0.5 space-y-0.5">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = completedSet.has(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          onSelectLesson(lesson.id);
                          if (isOpenOnMobile && onCloseMobile) {
                            onCloseMobile();
                          }
                          if (onToggleDesktopCollapse) {
                            onToggleDesktopCollapse();
                          }
                        }}
                        className={`w-full px-2.5 py-2 rounded-md text-left text-xs flex items-center justify-between gap-2 transition-all cursor-pointer touch-target ${
                          isActive
                            ? "bg-blue-600 dark:bg-[#8BBEFF] text-white dark:text-[#08090D] font-bold shadow-xs"
                            : "text-slate-600 dark:text-[#BFC4CE] hover:bg-slate-200/50 dark:hover:bg-[#15171E] hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-white dark:text-[#08090D]" : "text-emerald-500 dark:text-[#65D9D0]"
                              }`}
                            />
                          ) : (
                            <Circle
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-white/80 dark:text-[#08090D]/80" : "text-slate-300 dark:text-[#252933]"
                              }`}
                            />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: Curriculum Schema Guide */}
      {onOpenFormatGuide && (
        <div className="p-2.5 border-t border-slate-200 dark:border-[#252933] bg-slate-100/50 dark:bg-[#15171E]/50">
          <button
            onClick={onOpenFormatGuide}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs text-slate-500 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white transition-colors touch-target"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Format Guide</span>
          </button>
        </div>
      )}
    </div>
  );

  // If this instance is designated as the mobile drawer:
  if (isMobileDrawer) {
    if (!isOpenOnMobile) return null;
    return (
      <div className="fixed inset-0 z-50 md:hidden flex">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
        <div className="relative w-4/5 max-w-sm h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Otherwise, render desktop sidebar
  return (
    <aside className="h-full shrink-0 w-72 lg:w-80">
      {sidebarContent}
    </aside>
  );
};
