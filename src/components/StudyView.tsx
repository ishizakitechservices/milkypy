import React, { useState, useEffect } from "react";
import { UserProgress, PythonLesson, ExecutionResult } from "../types";
import {
  BookOpen,
  Sparkles,
  Code2,
  CheckCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  Check,
  Copy,
  ArrowRight,
  ArrowLeft,
  X,
  List,
  RotateCcw,
  Lightbulb,
  Play,
  Sprout,
  Terminal,
  HelpCircle,
  GraduationCap,
  AlertTriangle,
  BrainCircuit,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  ChevronLeft
} from "lucide-react";
import Markdown from "react-markdown";
import { PYTHON_MODULES } from "../data/pythonLessons";
import { GLOSSARY_TERMS, getGlossaryEntry } from "../data/glossary";
import { GlossaryModal, TermPopover } from "./GlossaryModal";
import { SeedsTrackerModal, PlantedSeed } from "./SeedsTrackerModal";
import { translatePythonError, FriendlyErrorTranslation } from "../lib/errorTranslator";
import { runPythonCode } from "../lib/pyodideRunner";
import { CodeEditor } from "./CodeEditor";
import { motion, AnimatePresence } from "motion/react";
import { DynamicQuizQuestion, generateRandomQuiz } from "../lib/quizGenerator";
import { getApiUrl } from "../lib/apiConfig";

interface StudyViewProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onOpenAiAssist: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick: (code: string) => void;
  currentUser: string | null;
}

interface LessonCodeTracerProps {
  code: string;
  whatJustHappened?: string[];
  onLoadIntoSandbox: () => void;
}

export const LessonCodeTracer: React.FC<LessonCodeTracerProps> = ({
  code,
  whatJustHappened,
  onLoadIntoSandbox,
}) => {
  const lines = code.split("\n").filter((l) => l.trim().length > 0);
  const [currentStep, setCurrentStep] = useState(0);

  // Parse simulated stdout for print() calls up to currentStep
  const accumulatedOutputs: string[] = [];
  lines.slice(0, currentStep + 1).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
      const inner = trimmed.slice(6, -1).trim();
      if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
        accumulatedOutputs.push(inner.slice(1, -1));
      } else {
        accumulatedOutputs.push(inner);
      }
    }
  });

  const activeLine = lines[currentStep] || "";
  const explanation =
    (whatJustHappened && whatJustHappened[currentStep]) ||
    (activeLine.startsWith("#")
      ? "Comment line: Python ignores comments, which are notes written for humans."
      : activeLine.includes("print(")
      ? "Executes print() to output data to standard output console."
      : activeLine.includes("=")
      ? "Stores value in memory variable."
      : `Executes instruction step ${currentStep + 1}.`);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">Execution Tracer (Line-by-Line)</span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">
          Step {currentStep + 1} of {lines.length}
        </span>
      </div>

      {/* Code Lines with Execution Pointer */}
      <div className="space-y-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 overflow-x-auto">
        {lines.map((line, idx) => {
          const isCurrent = idx === currentStep;
          const isPassed = idx < currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 px-2 py-1 rounded transition-colors ${
                isCurrent
                  ? "bg-blue-950/90 border-l-2 border-blue-400 text-white font-bold"
                  : isPassed
                  ? "text-slate-400 opacity-80"
                  : "text-slate-500 opacity-50"
              }`}
            >
              <span className="w-4 text-right text-[10px] text-slate-500 select-none">
                {idx + 1}
              </span>
              <span className={`w-3 select-none text-[10px] ${isCurrent ? "text-blue-400 font-bold" : "text-transparent"}`}>
                ▶
              </span>
              <code className="text-xs whitespace-pre">{line}</code>
            </div>
          );
        })}
      </div>

      {/* Active Line Explanation */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-sans space-y-1">
        <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
          Interpreter Action:
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{explanation}</p>
      </div>

      {/* Accumulated Terminal Output */}
      <div className="space-y-1">
        <div className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider">
          Standard Output So Far:
        </div>
        <div className="p-2.5 rounded-xl bg-black border border-slate-900 text-emerald-400 min-h-[46px] font-mono text-xs">
          {accumulatedOutputs.length === 0 ? (
            <span className="text-slate-600 italic select-none">No output produced yet...</span>
          ) : (
            accumulatedOutputs.map((out, oIdx) => <div key={oIdx}>{out}</div>)
          )}
        </div>
      </div>

      {/* Tracer Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-sans text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 font-semibold cursor-pointer transition-colors"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(lines.length - 1, prev + 1))}
            disabled={currentStep >= lines.length - 1}
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 font-bold cursor-pointer transition-colors"
          >
            Next ▶
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Reset step tracer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onLoadIntoSandbox}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline flex items-center gap-1"
        >
          <span>Edit in Sandbox</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export const StudyView: React.FC<StudyViewProps> = ({
  progress,
  onUpdateProgress,
  onOpenAiAssist,
  onPracticeClick,
  currentUser,
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Active Lesson & Module
  const activeModule = PYTHON_MODULES[activeModuleIndex] || PYTHON_MODULES[0];
  const activeLesson = activeModule.lessons[activeLessonIndex] || activeModule.lessons[0];

  // Right-zone Mode: "sandbox" (Integrated IDE) vs "quiz" (AI Quiz Arena)
  const [rightStageTab, setRightStageTab] = useState<"sandbox" | "quiz">("sandbox");

  // Mobile View Tab: "textbook" (Lesson Guide) vs "sandbox" (IDE Sandbox & Output)
  const [mobileZoneTab, setMobileZoneTab] = useState<"textbook" | "sandbox">("textbook");

  // Curriculum Completion Filter: "all" vs "incomplete" vs "completed"
  const [curriculumFilter, setCurriculumFilter] = useState<"all" | "incomplete" | "completed">("all");

  // Track Selector: "all" vs "phases" (Zero-to-Pro) vs "mrcet" (MRCET University Syllabus)
  const [syllabusTrack, setSyllabusTrack] = useState<"all" | "phases" | "mrcet">("all");

  // Visual Code Step Tracer Mode for active code example
  const [showTracer, setShowTracer] = useState<boolean>(false);

  // Code Editor State in Sandbox
  const [sandboxCode, setSandboxCode] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [errorTranslation, setErrorTranslation] = useState<FriendlyErrorTranslation | null>(null);
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Challenge Hint Progression State
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0);

  // Quick Check Answers for the active lesson: record of { [questionIdx]: selectedOptionIdx }
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<Record<number, number>>({});

  // Glossary and Seeds Modals State
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [activeGlossaryTermId, setActiveGlossaryTermId] = useState<string | null>(null);
  const [popoverTermId, setPopoverTermId] = useState<string | null>(null);
  const [seedsModalOpen, setSeedsModalOpen] = useState(false);

  // Dynamic Quiz State for Tab 2
  const [currentQuiz, setCurrentQuiz] = useState<DynamicQuizQuestion | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizDifficulty, setQuizDifficulty] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [showQuizHint, setShowQuizHint] = useState(false);

  // Auto expand module when active module changes
  useEffect(() => {
    setExpandedModules((prev) => ({ ...prev, [activeModuleIndex]: true }));
  }, [activeModuleIndex]);

  // Auto expand modules when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const allExpanded: Record<number, boolean> = {};
      PYTHON_MODULES.forEach((_, idx) => {
        allExpanded[idx] = true;
      });
      setExpandedModules(allExpanded);
    }
  }, [searchQuery]);

  // Initialize or change active lesson
  useEffect(() => {
    if (activeLesson) {
      const initialCode =
        activeLesson.yourTurn?.starterCode ||
        activeLesson.codeExample ||
        activeLesson.practiceCode ||
        `# ${activeLesson.title}\nprint("Ready to code!")\n`;
      setSandboxCode(initialCode);
      setExecutionResult(null);
      setErrorTranslation(null);
      setVerificationPassed(null);
      setRevealedHintLevel(0);
      setQuickCheckAnswers({});
      setPopoverTermId(null);
      setCopiedCode(false);
      setShowTracer(false);
    }
  }, [activeLesson?.id]);

  // Handle Code Execution
  const handleRunSandbox = async () => {
    setIsRunning(true);
    setVerificationPassed(null);
    setErrorTranslation(null);

    try {
      const res = await runPythonCode(sandboxCode);
      setExecutionResult(res);

      if (res.isError && res.stderr) {
        const translated = translatePythonError(res.stderr);
        setErrorTranslation(translated);
      }
    } catch (err: any) {
      const errRes: ExecutionResult = {
        stdout: "",
        stderr: err?.message || "Execution failed",
        executionTimeMs: 0,
        isError: true,
      };
      setExecutionResult(errRes);
      setErrorTranslation(translatePythonError(errRes.stderr));
    } finally {
      setIsRunning(false);
    }
  };

  // Automated Verification Engine for the Your Turn Challenge
  const handleVerifyChallenge = async () => {
    setIsRunning(true);
    setErrorTranslation(null);

    try {
      const res = await runPythonCode(sandboxCode);
      setExecutionResult(res);

      if (res.isError && res.stderr) {
        setErrorTranslation(translatePythonError(res.stderr));
        setVerificationPassed(false);
        setIsRunning(false);
        return;
      }

      // Check expected pattern or test logic
      const expected = activeLesson.yourTurn?.expectedOutputPattern;
      let passed = false;
      if (expected) {
        passed = res.stdout.toLowerCase().includes(expected.toLowerCase());
      } else {
        passed = !res.isError && res.stdout.trim().length > 0;
      }
      setVerificationPassed(passed);

      if (passed && !progress.completedLessonIds.includes(activeLesson.id)) {
        onUpdateProgress({
          ...progress,
          completedLessonIds: [...progress.completedLessonIds, activeLesson.id],
          totalXp: progress.totalXp + 50,
        });
      }
    } catch {
      setVerificationPassed(false);
    } finally {
      setIsRunning(false);
    }
  };

  // Reset Code
  const handleResetSandbox = () => {
    const defaultCode =
      activeLesson.yourTurn?.starterCode ||
      activeLesson.codeExample ||
      activeLesson.practiceCode;
    setSandboxCode(defaultCode);
    setExecutionResult(null);
    setErrorTranslation(null);
    setVerificationPassed(null);
    setMobileZoneTab("sandbox");
  };

  // Load Example into Editor
  const handleLoadExample = () => {
    if (activeLesson.codeExample) {
      setSandboxCode(activeLesson.codeExample);
      setExecutionResult(null);
      setErrorTranslation(null);
      setVerificationPassed(null);
      setMobileZoneTab("sandbox");
    }
  };

  // Load Solution into Editor
  const handleLoadSolution = () => {
    if (activeLesson.yourTurn?.solutionCode) {
      setSandboxCode(activeLesson.yourTurn.solutionCode);
      setExecutionResult(null);
      setErrorTranslation(null);
      setVerificationPassed(null);
      setMobileZoneTab("sandbox");
    }
  };

  // Copy code example helper
  const handleCopyCodeExample = () => {
    if (activeLesson.codeExample) {
      navigator.clipboard.writeText(activeLesson.codeExample);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Load Next Dynamic Quiz for Tab 2
  const loadNextQuiz = async (lesson: PythonLesson, preferredDiff = quizDifficulty) => {
    setQuizAnswerSelected(null);
    setShowQuizHint(false);
    setIsGeneratingQuiz(true);

    const diffParam = preferredDiff === "all" ? "intermediate" : preferredDiff;

    try {
      if (typeof navigator !== "undefined" && navigator.onLine) {
        const res = await fetch(getApiUrl("/api/ai/quiz"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonConcept: lesson.concept || lesson.plainEnglish,
            difficulty: diffParam,
          }),
        });
        const data = await res.json();
        if (data.success && data.quiz) {
          setCurrentQuiz(data.quiz);
          setIsGeneratingQuiz(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Quiz API fallback:", err);
    }

    const fallback = generateRandomQuiz(
      lesson.id,
      lesson.title,
      lesson.concept || lesson.plainEnglish || "",
      preferredDiff === "all" ? undefined : preferredDiff
    );
    setCurrentQuiz(fallback);
    setIsGeneratingQuiz(false);
  };

  const handleLessonSelect = (modIdx: number, lesIdx: number) => {
    setActiveModuleIndex(modIdx);
    setActiveLessonIndex(lesIdx);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllModules = () => {
    const all: Record<number, boolean> = {};
    PYTHON_MODULES.forEach((_, i) => (all[i] = true));
    setExpandedModules(all);
  };

  const collapseAllModules = () => {
    setExpandedModules({ [activeModuleIndex]: true });
  };

  const isCompleted = (id: string) => progress.completedLessonIds.includes(id);

  // Navigate to previous lesson
  const handlePreviousLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex((prev) => prev - 1);
    } else if (activeModuleIndex > 0) {
      const prevModIdx = activeModuleIndex - 1;
      setActiveModuleIndex(prevModIdx);
      setActiveLessonIndex(PYTHON_MODULES[prevModIdx].lessons.length - 1);
      setExpandedModules((prev) => ({ ...prev, [prevModIdx]: true }));
    }
  };

  // Navigate to next lesson or mark complete
  const handleCompleteAndAdvance = () => {
    const lessonId = activeLesson.id;
    if (!progress.completedLessonIds.includes(lessonId)) {
      onUpdateProgress({
        ...progress,
        completedLessonIds: [...progress.completedLessonIds, lessonId],
        totalXp: progress.totalXp + 50,
      });
    }

    // Advance to next lesson
    if (activeLessonIndex < activeModule.lessons.length - 1) {
      setActiveLessonIndex((prev) => prev + 1);
    } else if (activeModuleIndex < PYTHON_MODULES.length - 1) {
      setActiveModuleIndex((prev) => prev + 1);
      setActiveLessonIndex(0);
      setExpandedModules((prev) => ({ ...prev, [activeModuleIndex + 1]: true }));
    }
  };

  // Collect all planted seeds across all modules for SeedsTracker
  const allPlantedSeeds: PlantedSeed[] = [];
  PYTHON_MODULES.forEach((mod, mIdx) => {
    mod.lessons.forEach((l) => {
      if (l.seedsForLater) {
        allPlantedSeeds.push({
          lessonId: l.id,
          lessonTitle: l.title,
          seed: l.seedsForLater,
          isUnlocked: activeModuleIndex > mIdx,
        });
      }
    });
  });

  const totalLessons = PYTHON_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = progress.completedLessonIds.length;
  const progressPercent = Math.round((completedCount / (totalLessons || 1)) * 100);

  // Filter modules based on search query, completion status, and syllabus track
  const filteredModules = PYTHON_MODULES.map((mod, modIdx) => {
    const isMrcet = mod.id.startsWith("mrcet") || !!mod.mrcetUnit;
    if (syllabusTrack === "phases" && isMrcet) return null;
    if (syllabusTrack === "mrcet" && !isMrcet) return null;

    let matching = mod.lessons;

    if (curriculumFilter === "completed") {
      matching = matching.filter((l) => isCompleted(l.id));
    } else if (curriculumFilter === "incomplete") {
      matching = matching.filter((l) => !isCompleted(l.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matching = matching.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          (l.mrcetUnit && l.mrcetUnit.toLowerCase().includes(q)) ||
          (l.mrcetTopic && l.mrcetTopic.toLowerCase().includes(q)) ||
          (l.plainEnglish && l.plainEnglish.toLowerCase().includes(q)) ||
          (l.concept && l.concept.toLowerCase().includes(q))
      );
    }

    return {
      module: mod,
      originalIndex: modIdx,
      matchingLessons: matching,
    };
  }).filter((item): item is { module: typeof PYTHON_MODULES[number]; originalIndex: number; matchingLessons: typeof PYTHON_MODULES[number]["lessons"] } => item !== null && item.matchingLessons.length > 0);

  // Curriculum Sidebar Component
  const curriculumSidebar = (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900 select-none">
      {/* Topics Header */}
      <div className="p-3.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <h2 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider truncate">
            {syllabusTrack === "mrcet"
              ? "MRCET B.Tech Syllabus"
              : syllabusTrack === "phases"
              ? "Zero to Pro Phases"
              : "Blended Curriculum"}
          </h2>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          title="Collapse curriculum sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Mastery Progress Bar */}
      <div className="px-3.5 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 dark:text-blue-200">
          <span>Overall Mastery</span>
          <span className="tabular-nums">
            {progressPercent}% ({completedCount}/{totalLessons})
          </span>
        </div>
        <div className="h-1.5 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Search & Completion Filter Section */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shrink-0 space-y-1.5">
        {/* Track Filter Tabs (All vs Zero-to-Pro vs MRCET Syllabus) */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setSyllabusTrack("all")}
            className={`flex-1 py-1 px-1.5 rounded-md text-[10px] font-bold transition-all text-center cursor-pointer ${
              syllabusTrack === "all"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All Tracks
          </button>
          <button
            onClick={() => setSyllabusTrack("phases")}
            className={`flex-1 py-1 px-1.5 rounded-md text-[10px] font-bold transition-all text-center cursor-pointer ${
              syllabusTrack === "phases"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Phases
          </button>
          <button
            onClick={() => setSyllabusTrack("mrcet")}
            className={`flex-1 py-1 px-1.5 rounded-md text-[10px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
              syllabusTrack === "mrcet"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            }`}
          >
            <GraduationCap className="w-3 h-3 shrink-0" />
            <span>MRCET</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons (e.g. loops, sys.argv, mrcet)..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setCurriculumFilter("all")}
            className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors text-center cursor-pointer ${
              curriculumFilter === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            All ({totalLessons})
          </button>
          <button
            onClick={() => setCurriculumFilter("incomplete")}
            className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors text-center cursor-pointer ${
              curriculumFilter === "incomplete"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Pending ({totalLessons - completedCount})
          </button>
          <button
            onClick={() => setCurriculumFilter("completed")}
            className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors text-center cursor-pointer ${
              curriculumFilter === "completed"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        {/* Expand / Collapse All Controls */}
        <div className="flex items-center justify-between pt-0.5 px-1 text-[10px] text-slate-500 dark:text-slate-400">
          <span>{PYTHON_MODULES.length} Modules · {totalLessons} Lessons</span>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAllModules}
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium"
            >
              Expand All
            </button>
            <span>·</span>
            <button
              onClick={collapseAllModules}
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Tools Bar */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-1.5 bg-slate-100/50 dark:bg-slate-950/30 shrink-0">
        <button
          onClick={() => {
            setActiveGlossaryTermId(null);
            setGlossaryOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Glossary</span>
        </button>

        <button
          onClick={() => setSeedsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <Sprout className="w-3.5 h-3.5 text-emerald-500" />
          <span>Seeds ({allPlantedSeeds.filter((s) => s.isUnlocked).length})</span>
        </button>
      </div>

      {/* Accordion Module List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredModules.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 space-y-1">
            <p>No lessons found matching "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          filteredModules.map(({ module: mod, originalIndex: modIdx, matchingLessons }) => {
            const isModActive = activeModuleIndex === modIdx;
            const completedInMod = mod.lessons.filter((l) => isCompleted(l.id)).length;
            const modDone = completedInMod === mod.lessons.length;
            const isExpanded = !!expandedModules[modIdx];

            return (
              <div
                key={mod.id}
                className={`rounded-xl border transition-all overflow-hidden bg-white dark:bg-slate-900/60 ${
                  isModActive
                    ? "border-blue-300 dark:border-blue-800 shadow-2xs"
                    : "border-slate-200/80 dark:border-slate-800"
                }`}
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(modIdx)}
                  className={`w-full flex items-center justify-between p-2.5 text-left font-bold text-xs transition-colors cursor-pointer ${
                    isModActive
                      ? "bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isModActive ? "bg-blue-600" : modDone ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    <div className="truncate">
                      <div className="truncate text-xs font-bold leading-tight">{mod.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {completedInMod}/{mod.lessons.length} completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {modDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </button>

                {/* Lesson List */}
                {isExpanded && (
                  <div className="p-1 pt-0 space-y-0.5 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800/60">
                    {matchingLessons.map((lesson) => {
                      const lesIdx = mod.lessons.findIndex((l) => l.id === lesson.id);
                      const isActive = activeModuleIndex === modIdx && activeLessonIndex === lesIdx;
                      const done = isCompleted(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonSelect(modIdx, lesIdx)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                            isActive
                              ? "bg-blue-600 text-white font-bold shadow-xs"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span
                              className={`text-[10px] font-mono shrink-0 px-1 py-0.2 rounded ${
                                isActive
                                  ? "bg-white/20 text-white font-bold"
                                  : "bg-slate-200/70 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {lesson.id.replace("l-", "").replace(/-/g, ".")}
                            </span>
                            <span className="truncate">{lesson.title.replace(/^Lesson \d+\.\d+: /, "")}</span>
                          </div>

                          {done ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-white" : "text-emerald-500"
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-2 h-2 rounded-full border shrink-0 ${
                                isActive
                                  ? "border-white/60 bg-white/40"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}
                            />
                          )}
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
    </div>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row p-1.5 sm:p-3 gap-2 sm:gap-3 w-full h-[calc(100vh-7.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 max-w-[2600px] mx-auto font-sans">
      {/* Desktop Sidebar Toggle Tab (When sidebar is collapsed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden md:flex flex-col items-center justify-center w-9 h-32 my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 rounded-r-xl shadow-xs text-slate-500 hover:text-blue-600 transition-colors cursor-pointer shrink-0 z-20 group"
          title="Open Curriculum Sidebar"
        >
          <PanelLeftOpen className="w-4 h-4 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
            Curriculum
          </span>
        </button>
      )}

      {/* Desktop Sidebar */}
      {sidebarOpen && (
        <div className="hidden md:flex md:w-64 lg:w-72 xl:w-80 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0 h-full overflow-hidden shadow-xs">
          {curriculumSidebar}
        </div>
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-4/5 max-w-sm h-full shadow-2xl z-10"
            >
              {curriculumSidebar}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Workspace Mode Switcher (< md screens) */}
      <div className="md:hidden flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0 gap-1 text-xs font-bold w-full">
        <button
          onClick={() => setMobileZoneTab("textbook")}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileZoneTab === "textbook"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lesson Guide</span>
        </button>

        <button
          onClick={() => setMobileZoneTab("sandbox")}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileZoneTab === "sandbox"
              ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code & Run</span>
          {verificationPassed === true && (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          )}
        </button>
      </div>

      {/* Zone 1: Textbook Reader (Concepts Explained Thoroughly Before Code) */}
      <div
        className={`flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex-col h-full overflow-hidden shadow-xs min-w-0 ${
          mobileZoneTab === "textbook" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Textbook Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2 truncate">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200/70 dark:border-blue-800 transition-colors cursor-pointer shrink-0"
              >
                <List className="w-3.5 h-3.5" />
                <span>Curriculum</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs truncate">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                {activeModule.title}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 truncate">
                {activeLesson.title}
              </span>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setMobileZoneTab("sandbox")}
              className="md:hidden px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Switch to Code Sandbox"
            >
              <Code2 className="w-3 h-3" />
              <span>IDE</span>
            </button>

            <button
              onClick={() => {
                setActiveGlossaryTermId(null);
                setGlossaryOpen(true);
              }}
              title="Open Technical Glossary"
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Glossary</span>
            </button>

            <button
              onClick={() => setSeedsModalOpen(true)}
              title="View Planted Concept Seeds"
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Seeds</span>
            </button>
          </div>
        </div>

        {/* Textbook Scrollable Body: Pedagogical Flow with Concepts Explained FIRST */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* Chapter Title & Description */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span>{activeModule.title}</span>
              <span>·</span>
              <span>Lesson {activeLessonIndex + 1} of {activeModule.lessons.length}</span>
              {activeLesson.mrcetUnit && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300 font-extrabold normal-case bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/70 text-[10px]">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    MRCET B.Tech III-II · {activeLesson.mrcetUnit}
                  </span>
                </>
              )}
            </div>
            {activeLesson.mrcetTopic && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800 w-fit">
                <span className="font-bold text-slate-700 dark:text-slate-300">University Topic:</span>
                <span>{activeLesson.mrcetTopic}</span>
              </div>
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {activeLesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeLesson.description}
            </p>
          </div>

          {/* 1. The Intuitive Hook & Everyday Metaphor */}
          {activeLesson.hook && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 space-y-2">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300">
                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>The Intuitive Hook (Real-World Analogy)</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-sans">
                {activeLesson.hook}
              </p>
            </div>
          )}

          {/* 2. Core Conceptual Explanation (Concepts Thoroughly Explained BEFORE Code) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Conceptual Foundation
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Understand the Concept First
              </span>
            </div>

            {/* Plain-English summary box */}
            {activeLesson.plainEnglish && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  How This Works in Plain English:
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {activeLesson.plainEnglish}
                </p>
              </div>
            )}

            {/* In-depth Conceptual Markdown Guide */}
            {activeLesson.concept && (
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
                <div className="prose prose-slate dark:prose-invert prose-xs max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                  <Markdown
                    components={{
                      h1: ({ children }) => (
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-4 mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                          {children}
                        </h3>
                      ),
                      h2: ({ children }) => (
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1.5">
                          {children}
                        </h4>
                      ),
                      h3: ({ children }) => (
                        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1">
                          {children}
                        </h5>
                      ),
                      p: ({ children }) => (
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-3">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      strong: ({ children }) => (
                        <strong className="font-bold text-slate-900 dark:text-slate-100">
                          {children}
                        </strong>
                      ),
                      code: ({ children, className }) => {
                        const isBlock = !className && String(children).includes("\n");
                        if (isBlock) {
                          return (
                            <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto my-2.5">
                              <code>{children}</code>
                            </pre>
                          );
                        }
                        return (
                          <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-semibold">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {activeLesson.concept}
                  </Markdown>
                </div>
              </div>
            )}
          </div>

          {/* 3. Term-Before-Explanation: Technical Vocabulary Defined Up Front */}
          {activeLesson.glossaryTerms && activeLesson.glossaryTerms.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  Key Technical Terms in this Lesson:
                </span>
                <span className="text-[10px] text-slate-400">Click any keyword for full definition</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeLesson.glossaryTerms.map((termId) => {
                  const term = getGlossaryEntry(termId);
                  if (!term) return null;
                  return (
                    <button
                      key={termId}
                      onClick={() => setPopoverTermId(term.id)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-400 font-mono text-xs font-semibold cursor-pointer transition-colors shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                    >
                      <span>{term.term}</span>
                      <span className="text-[10px] text-slate-400 font-sans">↗</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Now Let's Look at the Code: Verified Code Example with Interactive Line Tracer */}
          {activeLesson.codeExample && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <span>Putting the Concept into Python Syntax</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Now that you understand the theory, here is how we write it:
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Step Tracer Mode Toggle */}
                  <button
                    onClick={() => setShowTracer(!showTracer)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      showTracer
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                    }`}
                    title="Toggle interactive line-by-line execution tracer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showTracer ? "Hide Tracer" : "Step Tracer"}</span>
                  </button>

                  <button
                    onClick={handleCopyCodeExample}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleLoadExample}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
                  >
                    <span>Load into Sandbox</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {showTracer ? (
                <LessonCodeTracer
                  code={activeLesson.codeExample}
                  whatJustHappened={activeLesson.whatJustHappened}
                  onLoadIntoSandbox={handleLoadExample}
                />
              ) : (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
                  <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    <code>{activeLesson.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* 5. Code Anatomy: What Just Happened? Line-by-Line Breakdown */}
          {activeLesson.whatJustHappened && activeLesson.whatJustHappened.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Code Anatomy: What Just Happened?</span>
              </h3>
              <div className="space-y-2 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                {activeLesson.whatJustHappened.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0 bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.5 rounded text-[11px]">
                      Step {sIdx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Deeper Dive & Edge Cases */}
          {activeLesson.deeperDive && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Deeper Dive & "What If?" Exploration
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-100/60 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                {activeLesson.deeperDive}
              </p>
            </div>
          )}

          {/* 7. Common Beginner Mistakes: Side-by-Side [Incorrect] vs [Correct] */}
          {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Beginner Mistakes (Avoid These Bugs)</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {activeLesson.commonMistakes.map((mis, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-4 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-2 text-xs"
                  >
                    <h4 className="font-black text-rose-900 dark:text-rose-300">
                      {mis.title}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-900/60">
                        <span className="text-[10px] uppercase font-bold text-rose-500 block mb-1">
                          [Incorrect Code]
                        </span>
                        <code className="text-rose-700 dark:text-rose-400 whitespace-pre-wrap">{mis.badCode}</code>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/60">
                        <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">
                          [Correct Code]
                        </span>
                        <code className="text-emerald-700 dark:text-emerald-400 whitespace-pre-wrap">{mis.goodCode}</code>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px] pt-1">
                      {mis.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Quick Check Inline Validation Questions */}
          {activeLesson.quickChecks && activeLesson.quickChecks.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Quick Check: Test Your Intuition</span>
              </h3>

              {activeLesson.quickChecks.map((qc, qIdx) => {
                const selected = quickCheckAnswers[qIdx];
                const hasAnswered = selected !== undefined;
                const isCorrect = selected === qc.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2.5"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      Question {qIdx + 1}: {qc.question}
                    </p>

                    <div className="space-y-1.5">
                      {qc.options.map((opt, optIdx) => {
                        let btnStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200";
                        if (hasAnswered) {
                          if (optIdx === qc.correctIndex) {
                            btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                          } else if (selected === optIdx && !isCorrect) {
                            btnStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200";
                          } else {
                            btnStyle = "opacity-50 border-slate-200 dark:border-slate-800 text-slate-500";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={hasAnswered}
                            onClick={() =>
                              setQuickCheckAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                            }
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                          isCorrect ? "bg-emerald-100/70 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-100/70 text-amber-950 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        <strong>{isCorrect ? "Correct! " : "Explanation: "}</strong>
                        {qc.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 9. Your Turn: Practice Challenge */}
          {activeLesson.yourTurn && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  <Play className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
                  <span>Your Turn: Practice Challenge</span>
                </div>
                <button
                  onClick={handleResetSandbox}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
                >
                  Load Starter Code
                </button>
              </div>

              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 font-semibold leading-relaxed">
                {activeLesson.yourTurn.challenge}
              </p>

              {/* Progressive Hints & Reveal Solution */}
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center gap-2">
                {activeLesson.yourTurn.hints.map((hint, hIdx) => {
                  const isRevealed = revealedHintLevel > hIdx;
                  return (
                    <div key={hIdx} className="text-xs">
                      {isRevealed ? (
                        <div className="p-2 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 text-xs font-mono">
                          <strong>Hint {hIdx + 1}:</strong> {hint}
                        </div>
                      ) : (
                        <button
                          onClick={() => setRevealedHintLevel(hIdx + 1)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-200/60 hover:bg-emerald-200 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Show Hint {hIdx + 1}
                        </button>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={handleLoadSolution}
                  className="px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors ml-auto"
                >
                  Reveal Solution
                </button>
              </div>
            </div>
          )}

          {/* 10. Seeds for Later */}
          {activeLesson.seedsForLater && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1 text-xs">
              <div className="flex items-center justify-between font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Seeds for Later: {activeLesson.seedsForLater.concept}</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {activeLesson.seedsForLater.sproutsIn}
                </span>
              </div>
              <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {activeLesson.seedsForLater.teaser}
              </p>
            </div>
          )}

          {/* 11. Core Chapter Recap */}
          {activeLesson.recap && activeLesson.recap.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
                Core Chapter Recap
              </h4>
              <ul className="space-y-1 list-disc pl-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeLesson.recap.map((r, rIdx) => (
                  <li key={rIdx}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousLesson}
              disabled={activeModuleIndex === 0 && activeLessonIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => onPracticeClick(sandboxCode)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>Playground</span>
            </button>
          </div>

          <button
            onClick={handleCompleteAndAdvance}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span>{isCompleted(activeLesson.id) ? "Next Lesson" : "Mark Complete & Advance"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone 2: Integrated Interactive Stage (Right) */}
      <div
        className={`w-full md:w-[420px] lg:w-[480px] xl:w-[540px] 2xl:w-[600px] bg-slate-950 border border-slate-800 rounded-2xl flex-col h-full overflow-hidden shadow-2xl shrink-0 ${
          mobileZoneTab === "sandbox" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Stage Header & Tabs */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMobileZoneTab("textbook")}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              title="Return to lesson reading"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Lesson</span>
            </button>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setRightStageTab("sandbox")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  rightStageTab === "sandbox" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>IDE Sandbox</span>
              </button>

              <button
                onClick={() => {
                  setRightStageTab("quiz");
                  loadNextQuiz(activeLesson);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  rightStageTab === "quiz" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Quiz Arena</span>
              </button>
            </div>
          </div>

          {rightStageTab === "sandbox" && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleVerifyChallenge}
                disabled={isRunning}
                title="Run test validation on your code"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>

              <button
                onClick={handleRunSandbox}
                disabled={isRunning}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? "animate-spin" : ""}`} />
                <span>{isRunning ? "Running..." : "Run"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Interactive IDE Sandbox */}
        {rightStageTab === "sandbox" ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Top Half: Code Editor */}
            <div className="flex-1 min-h-[220px] overflow-hidden flex flex-col border-b border-slate-800">
              <CodeEditor
                code={sandboxCode}
                onChange={setSandboxCode}
                onRun={handleRunSandbox}
                isRunning={isRunning}
                title={`sandbox_${activeLesson.id.replace(/-/g, "_")}.py`}
              />
            </div>

            {/* Bottom Half: Live Console Output & Friendly Error Translator */}
            <div className="h-48 sm:h-56 xl:h-64 bg-slate-950 flex flex-col min-h-0 overflow-hidden">
              <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>Standard Output Console</span>
                </div>
                {executionResult && (
                  <span className="text-[10px] text-slate-500">
                    {executionResult.executionTimeMs}ms
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-2">
                {/* Challenge Verification Banner */}
                {verificationPassed !== null && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-sans font-bold flex items-center gap-2 border ${
                      verificationPassed
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                        : "bg-rose-950/60 border-rose-500/60 text-rose-300"
                    }`}
                  >
                    {verificationPassed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Challenge Solved! Great job!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Challenge not passed yet. Check hints and try again!</span>
                      </>
                    )}
                  </div>
                )}

                {/* Friendly Error Translator Card */}
                {errorTranslation && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 font-sans space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{errorTranslation.headline}</span>
                    </div>
                    <p className="text-[11px] text-rose-200 leading-relaxed">
                      {errorTranslation.explanation}
                    </p>
                    <div className="pt-1 border-t border-rose-900/60 text-[11px] text-amber-200">
                      <strong>Friendly Fix: </strong> {errorTranslation.solutionHint}
                    </div>
                  </div>
                )}

                {/* Raw Stdout / Stderr */}
                {executionResult ? (
                  <>
                    {executionResult.stdout && (
                      <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                        {executionResult.stdout}
                      </pre>
                    )}
                    {executionResult.stderr && !errorTranslation && (
                      <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed">
                        {executionResult.stderr}
                      </pre>
                    )}
                  </>
                ) : (
                  <p className="text-slate-600 italic">
                    Press "Run" to execute in the instant browser sandbox...
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: AI Quiz Arena */
          <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">
                Randomized Practice: {activeLesson.title}
              </span>
              <button
                onClick={() => loadNextQuiz(activeLesson)}
                disabled={isGeneratingQuiz}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isGeneratingQuiz ? "animate-spin" : ""}`} />
                <span>Next Question</span>
              </button>
            </div>

            {currentQuiz && (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <p className="font-bold text-white text-sm">
                  {currentQuiz.question}
                </p>

                {currentQuiz.codeSnippet && (
                  <pre className="p-3 bg-slate-950 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto">
                    <code>{currentQuiz.codeSnippet}</code>
                  </pre>
                )}

                <div className="space-y-1.5">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = quizAnswerSelected === idx;
                    const isCorrect = idx === currentQuiz.correctIndex;
                    const showResult = quizAnswerSelected !== null;

                    let btnCls = "bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500";
                    if (showResult) {
                      if (isCorrect) btnCls = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold";
                      else if (isSelected && !isCorrect) btnCls = "bg-rose-950/60 border-rose-500 text-rose-200";
                      else btnCls = "opacity-40 border-slate-900";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showResult}
                        onClick={() => setQuizAnswerSelected(idx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${btnCls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizAnswerSelected !== null && (
                  <div className="p-3 rounded-lg bg-slate-800 text-slate-200 space-y-1">
                    <span className="font-bold">Explanation:</span>
                    <p>{currentQuiz.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popover for clicked keyword */}
      {popoverTermId && (
        <TermPopover
          termId={popoverTermId}
          onOpenFullGlossary={(tId) => {
            setPopoverTermId(null);
            setActiveGlossaryTermId(tId);
            setGlossaryOpen(true);
          }}
          onClose={() => setPopoverTermId(null)}
        />
      )}

      {/* Full Glossary Modal */}
      <GlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        activeTermId={activeGlossaryTermId}
      />

      {/* Seeds Tracker Modal */}
      <SeedsTrackerModal
        isOpen={seedsModalOpen}
        onClose={() => setSeedsModalOpen(false)}
        plantedSeeds={allPlantedSeeds}
      />
    </div>
  );
};
