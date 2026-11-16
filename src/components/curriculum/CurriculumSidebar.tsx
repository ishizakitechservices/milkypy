import React, { useState, useEffect, useMemo } from "react";
import { CurriculumModule } from "../../data/curriculum/schema";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Search,
  X,
  PanelLeftClose,
  FileCode,
  BookmarkCheck,
  Play,
  BookMarked,
  Award,
  ChevronsUpDown,
} from "lucide-react";

interface CurriculumSidebarProps {
  modules: CurriculumModule[];
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lessonId: string) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  onToggleDesktopCollapse?: () => void;
  onOpenFormatGuide?: () => void;
  onOpenGlossary?: () => void;
  onOpenBadges?: () => void;
  earnedBadgesCount?: number;
  totalXp?: number;
  isMobileDrawer?: boolean;
  currentUser?: string | null;
  lastActiveLessonId?: string;
}

type LessonFilterMode = "all" | "todo" | "done";

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  modules,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  isOpenOnMobile = false,
  onCloseMobile,
  onToggleDesktopCollapse,
  onOpenFormatGuide,
  onOpenGlossary,
  onOpenBadges,
  earnedBadgesCount = 0,
  totalXp = 0,
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

  // Listen for Escape key cleanly (mobile drawer only when open; desktop sidebar only on desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isMobileDrawer) {
        if (isOpenOnMobile && onCloseMobile) {
          onCloseMobile();
        }
      } else if (onToggleDesktopCollapse) {
        onToggleDesktopCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDrawer, isOpenOnMobile, onCloseMobile, onToggleDesktopCollapse]);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    modules.forEach((mod) => {
      const hasActive = mod.lessons.some((l) => l.id === activeLessonId);
      map[mod.id] = hasActive || mod.order <= 2;
    });
    return map;
  });

  // Auto-expand whichever module owns the newly selected active lesson
  useEffect(() => {
    if (!activeLessonId) return;
    const owner = modules.find((m) => m.lessons.some((l) => l.id === activeLessonId));
    if (owner) {
      setExpandedModules((prev) => (prev[owner.id] ? prev : { ...prev, [owner.id]: true }));
    }
  }, [activeLessonId, modules]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<LessonFilterMode>("all");

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);

  const filteredModules = useMemo(() => {
    const lower = searchQuery.trim().toLowerCase();
    return modules
      .map((mod) => {
        const matchingLessons = mod.lessons.filter((l) => {
          const isDone = completedSet.has(l.id);
          if (filterMode === "todo" && isDone) return false;
          if (filterMode === "done" && !isDone) return false;
          if (!lower) return true;
          return (
            l.title.toLowerCase().includes(lower) ||
            mod.title.toLowerCase().includes(lower) ||
            l.learningObjectives.some((obj) => obj.toLowerCase().includes(lower))
          );
        });
        return {
          ...mod,
          lessons: matchingLessons,
        };
      })
      .filter((mod) => mod.lessons.length > 0);
  }, [modules, searchQuery, filterMode, completedSet]);

  const allVisibleExpanded =
    filteredModules.length > 0 && filteredModules.every((m) => expandedModules[m.id]);

  const handleToggleExpandAll = () => {
    const nextState = !allVisibleExpanded;
    const updated: Record<string, boolean> = {};
    modules.forEach((m) => {
      updated[m.id] = nextState;
    });
    setExpandedModules(updated);
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalCompleted = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => completedSet.has(l.id)).length,
    0
  );
  const percentComplete = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const chooseLesson = (lessonId: string) => {
    onSelectLesson(lessonId);
    if (isMobileDrawer && onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#08090D] border-r border-slate-200 dark:border-[#252933] text-slate-800 dark:text-[#F3F4F6]">
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-[#252933] bg-white dark:bg-[#15171E] space-y-3 shrink-0 select-none">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Lessons Outline
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleExpandAll}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252933] cursor-pointer transition-colors"
              title={allVisibleExpanded ? "Collapse all modules" : "Expand all modules"}
              aria-label={allVisibleExpanded ? "Collapse all modules" : "Expand all modules"}
            >
              <ChevronsUpDown className="w-4 h-4" />
            </button>
            {!isMobileDrawer && onToggleDesktopCollapse && (
              <button
                type="button"
                onClick={onToggleDesktopCollapse}
                className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252933] cursor-pointer"
                title="Collapse sidebar (Esc)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
            {isMobileDrawer && isOpenOnMobile && onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252933] cursor-pointer touch-target"
                title="Close outline"
                aria-label="Close lessons outline"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Progress Line */}
        <div>
          <div className="text-xs text-slate-500 dark:text-[#BFC4CE] flex items-center justify-between mb-1.5">
            <span>{totalCompleted} of {totalLessons} completed</span>
            <span className="font-mono tabular-nums text-slate-700 dark:text-[#8BBEFF] font-semibold">
              {percentComplete}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-[#252933] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-[#8BBEFF] transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Search Input with Clear Button */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#BFC4CE]/60 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full pl-8 pr-8 py-2 bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] rounded-lg text-xs text-slate-800 dark:text-[#F3F4F6] focus:outline-none focus:border-blue-500 dark:focus:border-[#8BBEFF]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              aria-label="Clear lesson search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Mode Segmented Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] text-[11px] font-semibold">
          {(
            [
              { id: "all", label: `All (${totalLessons})` },
              { id: "todo", label: `To Do (${totalLessons - totalCompleted})` },
              { id: "done", label: `Done (${totalCompleted})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`py-1.5 px-1 rounded-md transition-colors cursor-pointer truncate ${
                filterMode === tab.id
                  ? "bg-white dark:bg-[#252933] text-blue-600 dark:text-[#8BBEFF] shadow-2xs font-bold"
                  : "text-slate-500 dark:text-[#BFC4CE] hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* If logged out, give quick option to continue lesson where left off */}
        {!currentUser && lastActiveItem && (
          <div className="p-2.5 bg-blue-50/70 dark:bg-[#15171E] border border-blue-200 dark:border-[#8BBEFF]/30 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 dark:text-[#8BBEFF] uppercase tracking-wider">
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                <span>Resume Lesson</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#BFC4CE]">Saved locally</span>
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-[#F3F4F6] line-clamp-1">
              {lastActiveItem.lesson.title}
            </div>
            <button
              type="button"
              onClick={() => chooseLesson(lastActiveItem.lesson.id)}
              className="w-full min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#8BBEFF]/90 text-white dark:text-[#08090D] text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Continue lesson</span>
            </button>
          </div>
        )}
      </div>

      {/* Module List Accordion */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
        {filteredModules.length === 0 ? (
          <div className="text-center py-8 px-3 text-xs text-slate-500 dark:text-[#BFC4CE] space-y-2">
            <p className="font-semibold">No matching lessons</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterMode("all");
              }}
              className="text-blue-600 dark:text-[#8BBEFF] font-semibold hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredModules.map((mod) => {
            const isExpanded =
              expandedModules[mod.id] || searchQuery.trim().length > 0 || filterMode !== "all";
            const modCompleted = mod.lessons.filter((l) => completedSet.has(l.id)).length;

            return (
              <div key={mod.id} className="rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full min-h-[42px] px-2.5 py-2 flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-[#F3F4F6] hover:bg-slate-200/60 dark:hover:bg-[#15171E] rounded-md transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#BFC4CE] shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#BFC4CE] shrink-0" />
                    )}
                    <span className="truncate">{mod.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-[#BFC4CE] font-mono shrink-0 tabular-nums">
                    {modCompleted}/{mod.lessons.length}
                  </div>
                </button>

                {isExpanded && (
                  <div className="pl-3.5 pr-1 py-0.5 space-y-0.5">
                    {mod.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isCompleted = completedSet.has(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => chooseLesson(lesson.id)}
                          className={`w-full min-h-[44px] px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isActive
                              ? "bg-blue-600 dark:bg-[#8BBEFF] text-white dark:text-[#08090D] font-bold shadow-xs"
                              : "text-slate-600 dark:text-[#BFC4CE] hover:bg-slate-200/60 dark:hover:bg-[#15171E] hover:text-slate-900 dark:hover:text-white"
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
                                  isActive ? "text-white/80 dark:text-[#08090D]/80" : "text-slate-300 dark:text-[#353A46]"
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
          })
        )}
      </div>

      {/* Footer: Glossary, Badges, & Curriculum Format Guide */}
      {(onOpenGlossary || onOpenBadges || onOpenFormatGuide) && (
        <div className="p-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-slate-200 dark:border-[#252933] bg-slate-100/50 dark:bg-[#15171E]/50 space-y-1.5 shrink-0 select-none">
          {(onOpenGlossary || onOpenBadges) && (
            <div className="grid grid-cols-2 gap-1.5">
              {onOpenGlossary && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenGlossary();
                    if (isMobileDrawer && onCloseMobile) onCloseMobile();
                  }}
                  className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-white dark:bg-[#08090D] hover:bg-slate-50 dark:hover:bg-[#252933] border border-slate-200 dark:border-[#252933] text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer"
                >
                  <BookMarked className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                  <span>Glossary</span>
                </button>
              )}
              {onOpenBadges && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenBadges();
                    if (isMobileDrawer && onCloseMobile) onCloseMobile();
                  }}
                  className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-white dark:bg-[#08090D] hover:bg-slate-50 dark:hover:bg-[#252933] border border-slate-200 dark:border-[#252933] text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer"
                  title={`${totalXp} XP earned`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500 dark:text-[#F2BC72]" />
                  <span>Badges ({earnedBadgesCount})</span>
                </button>
              )}
            </div>
          )}
          {onOpenFormatGuide && (
            <button
              type="button"
              onClick={() => {
                onOpenFormatGuide();
                if (isMobileDrawer && onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] text-slate-500 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Format Guide</span>
            </button>
          )}
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
        <div className="relative w-[88vw] max-w-sm h-[100dvh] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
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
