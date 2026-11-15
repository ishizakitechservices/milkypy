import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import {
  CheckCircle2,
  XCircle,
  Play,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Trophy,
  Clock,
  Flame,
  Target,
  Layers,
  AlertTriangle,
  History,
  BarChart3,
  Loader2,
  Trash2,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { UserProgress } from "../types";
import { getCurriculumModules, getAllLessons } from "../data/curriculum";
import {
  DynamicQuizQuestion,
  buildAdaptiveQuizDeck,
  generateRandomQuiz,
} from "../lib/quizGenerator";
import {
  QuizScope,
  LessonMasteryRecord,
  QuizSessionRecord,
  QuizQuestionAttempt,
  loadLessonMastery,
  recordLessonQuestionAttempt,
  loadQuizHistorySync,
  loadQuizHistory,
  saveQuizSession,
  clearAllQuizTracking,
  computeOverallQuizStats,
} from "../lib/quizStorage";
import { getApiUrl, fetchWithTimeout } from "../lib/apiConfig";
import { CopyCodeButton } from "./CopyCodeButton";
import { QuizFeedbackActionsBar } from "./QuizFeedbackActionsBar";

const QUIZ_SESSION_STORAGE_KEY = "milkypy_active_quiz_session_v1";

interface QuizViewProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onOpenAiAssist: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick: (code: string, meta?: { topicTitle?: string; question?: string }) => void;
  onOpenLesson: (lessonId: string, meta?: { topicTitle?: string; question?: string }) => void;
  requestedLessonId?: string | null;
  onClearRequestedLesson?: () => void;
}

type QuizTab = "quiz" | "mastery" | "history";
type QuizStage = "setup" | "active" | "summary";

const OPTION_LETTERS = ["A", "B", "C", "D"];

function formatDuration(sec: number): string {
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  return mins > 0 ? `${mins}m ${rem}s` : `${rem}s`;
}

export const QuizView: React.FC<QuizViewProps> = ({
  progress,
  onUpdateProgress,
  onOpenAiAssist,
  onPracticeClick,
  onOpenLesson,
  requestedLessonId,
  onClearRequestedLesson,
}) => {
  const modules = useMemo(() => getCurriculumModules(), []);
  const allLessons = useMemo(() => getAllLessons(), []);

  // Hydrate suspended active/summary quiz session if user jumped away (e.g. Open Lesson / Try in Editor)
  const savedSession = useMemo(() => {
    if (requestedLessonId) return null;
    try {
      const raw = sessionStorage.getItem(QUIZ_SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.deck) && parsed.deck.length > 0) {
        return parsed;
      }
    } catch {
      // ignore invalid session payload
    }
    return null;
  }, []);

  // View & Config state
  const [activeTab, setActiveTab] = useState<QuizTab>("quiz");
  const [stage, setStage] = useState<QuizStage>(() => savedSession?.stage || "setup");
  const [scope, setScope] = useState<QuizScope>(() => savedSession?.scope || "adaptive");
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    () => modules[0]?.id || "module-01-python-basics"
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    () => progress.lastActiveLessonId || allLessons[0]?.lesson.id || ""
  );
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [difficultyPref, setDifficultyPref] = useState<
    "adaptive" | "beginner" | "intermediate" | "mixed"
  >("adaptive");

  // Persistent Mastery & History
  const [masteryMap, setMasteryMap] = useState<Record<string, LessonMasteryRecord>>(
    () => loadLessonMastery()
  );
  const [history, setHistory] = useState<QuizSessionRecord[]>(() =>
    loadQuizHistorySync()
  );
  const [confirmResetStats, setConfirmResetStats] = useState(false);

  // Active Quiz Session state
  const [deck, setDeck] = useState<DynamicQuizQuestion[]>(() => savedSession?.deck || []);
  const [scopeLabel, setScopeLabel] = useState<string>(
    () => savedSession?.scopeLabel || "Recommended"
  );
  const [selectionReason, setSelectionReason] = useState<string>(
    () => savedSession?.selectionReason || ""
  );
  const [currentIdx, setCurrentIdx] = useState<number>(() => savedSession?.currentIdx || 0);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    () => (typeof savedSession?.selectedOption === "number" ? savedSession.selectedOption : null)
  );
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<QuizQuestionAttempt[]>(
    () => savedSession?.attempts || []
  );
  const [streak, setStreak] = useState<number>(() => savedSession?.streak || 0);
  const [bestStreak, setBestStreak] = useState<number>(() => savedSession?.bestStreak || 0);
  const [sessionXp, setSessionXp] = useState<number>(() => savedSession?.sessionXp || 0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    () => savedSession?.elapsedSeconds || 0
  );
  const [blitzRemaining, setBlitzRemaining] = useState<number>(
    () => (typeof savedSession?.blitzRemaining === "number" ? savedSession.blitzRemaining : 90)
  );

  // AI Question synthesis state
  const [isGeneratingAiQ, setIsGeneratingAiQ] = useState<boolean>(false);
  const [aiStatusNote, setAiStatusNote] = useState<string | null>(null);

  // Summary Review Filter & Expandable History Session
  const [reviewFilter, setReviewFilter] = useState<"all" | "missed">(
    () => savedSession?.reviewFilter || "all"
  );
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // Persist active or summary quiz state so jumping to Lesson / Playground never loses quiz progress
  useEffect(() => {
    try {
      if ((stage === "active" || stage === "summary") && deck.length > 0) {
        sessionStorage.setItem(
          QUIZ_SESSION_STORAGE_KEY,
          JSON.stringify({
            stage,
            scope,
            scopeLabel,
            selectionReason,
            deck,
            currentIdx,
            selectedOption,
            attempts,
            streak,
            bestStreak,
            sessionXp,
            elapsedSeconds,
            blitzRemaining,
            reviewFilter,
          })
        );
      } else if (stage === "setup") {
        sessionStorage.removeItem(QUIZ_SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [
    stage,
    scope,
    scopeLabel,
    selectionReason,
    deck,
    currentIdx,
    selectedOption,
    attempts,
    streak,
    bestStreak,
    sessionXp,
    elapsedSeconds,
    blitzRemaining,
    reviewFilter,
  ]);

  // Hydrate IndexedDB quiz history on mount
  useEffect(() => {
    loadQuizHistory().then((loaded) => {
      if (loaded.length > 0) {
        setHistory(loaded);
      }
    });
  }, []);

  // Auto-reset two-step stats confirmation after 3.5s
  useEffect(() => {
    if (!confirmResetStats) return;
    const t = window.setTimeout(() => setConfirmResetStats(false), 3500);
    return () => window.clearTimeout(t);
  }, [confirmResetStats]);

  // Derived curriculum stats
  const completedCount = progress.completedLessonIds?.length || 0;
  const totalCurriculumLessons = allLessons.length || 24;
  const overallStats = useMemo(
    () => computeOverallQuizStats(masteryMap, history),
    [masteryMap, history]
  );

  // Preview plan for setup screen
  const previewPlan = useMemo(() => {
    return buildAdaptiveQuizDeck({
      progress,
      modules,
      masteryMap,
      scope,
      selectedModuleId,
      selectedLessonId,
      count: scope === "timed-blitz" ? 12 : questionCount,
      difficulty: difficultyPref,
    });
  }, [
    progress,
    modules,
    masteryMap,
    scope,
    selectedModuleId,
    selectedLessonId,
    questionCount,
    difficultyPref,
  ]);

  const currentQuestion: DynamicQuizQuestion | undefined = deck[currentIdx];

  const finishQuizSession = useCallback(
    (
      finalAttempts: QuizQuestionAttempt[],
      finalXp: number,
      finalBestStreak: number,
      finalElapsed: number,
      currentScope: QuizScope,
      currentScopeLabel: string
    ) => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const totalQ = finalAttempts.length || 1;
      const correctCount = finalAttempts.filter((a) => a.isCorrect).length;
      const scorePercent = Math.round((correctCount / totalQ) * 100);
      const missedLessonIds = Array.from(
        new Set(finalAttempts.filter((a) => !a.isCorrect).map((a) => a.lessonId))
      );

      const sessionRecord: QuizSessionRecord = {
        id: `qsession-${Date.now()}`,
        timestamp: Date.now(),
        scope: currentScope,
        scopeLabel: currentScopeLabel,
        totalQuestions: finalAttempts.length,
        correctCount,
        scorePercent,
        xpEarned: finalXp,
        bestStreak: finalBestStreak,
        durationSeconds: Math.max(1, finalElapsed),
        missedLessonIds,
        questionResults: finalAttempts,
      };

      if (finalAttempts.length > 0) {
        saveQuizSession(sessionRecord).then(setHistory);
        // Award earned XP directly to global UserProgress
        if (finalXp > 0) {
          onUpdateProgress({
            ...progressRef.current,
            totalXp: (progressRef.current.totalXp || 0) + finalXp,
          });
        }
      }

      setReviewFilter(correctCount < finalAttempts.length ? "missed" : "all");
      setStage("summary");
    },
    [onUpdateProgress]
  );

  // Start a quiz session with optional override scope/lesson/module
  const startQuiz = useCallback(
    (overrides?: {
      scope?: QuizScope;
      lessonId?: string;
      moduleId?: string;
      count?: number;
    }) => {
      const targetScope = overrides?.scope ?? scope;
      const targetLesson = overrides?.lessonId ?? selectedLessonId;
      const targetModule = overrides?.moduleId ?? selectedModuleId;
      const targetCount =
        overrides?.count ?? (targetScope === "timed-blitz" ? 12 : questionCount);

      if (overrides?.scope) setScope(overrides.scope);
      if (overrides?.lessonId) setSelectedLessonId(overrides.lessonId);
      if (overrides?.moduleId) setSelectedModuleId(overrides.moduleId);

      const plan = buildAdaptiveQuizDeck({
        progress,
        modules,
        masteryMap,
        scope: targetScope,
        selectedModuleId: targetModule,
        selectedLessonId: targetLesson,
        count: targetCount,
        difficulty: difficultyPref,
      });

      setDeck(plan.questions);
      setScopeLabel(plan.scopeLabel);
      setSelectionReason(plan.selectionReason);
      setCurrentIdx(0);
      setSelectedOption(null);
      setShowHint(false);
      setAttempts([]);
      setStreak(0);
      setBestStreak(0);
      setSessionXp(0);
      setElapsedSeconds(0);
      setBlitzRemaining(90);
      setAiStatusNote(null);
      setActiveTab("quiz");
      setStage("active");
    },
    [
      scope,
      selectedLessonId,
      selectedModuleId,
      questionCount,
      progress,
      modules,
      masteryMap,
      difficultyPref,
    ]
  );

  // Handle requestedLessonId from CurriculumLessonReader ("Quiz Me")
  useEffect(() => {
    if (requestedLessonId) {
      startQuiz({
        scope: "current-lesson",
        lessonId: requestedLessonId,
        count: 5,
      });
      onClearRequestedLesson?.();
    }
  }, [requestedLessonId, startQuiz, onClearRequestedLesson]);

  // Active quiz timer (elapsed + countdown in timed-blitz mode)
  useEffect(() => {
    if (stage !== "active") {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      if (scope === "timed-blitz") {
        setBlitzRemaining((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [stage, scope]);

  // Auto-finish timed blitz when timer reaches 0
  useEffect(() => {
    if (stage === "active" && scope === "timed-blitz" && blitzRemaining === 0) {
      finishQuizSession(
        attempts,
        sessionXp,
        bestStreak,
        elapsedSeconds,
        scope,
        scopeLabel
      );
    }
  }, [
    stage,
    scope,
    blitzRemaining,
    attempts,
    sessionXp,
    bestStreak,
    elapsedSeconds,
    scopeLabel,
    finishQuizSession,
  ]);

  const handleSelectAnswer = useCallback(
    (optionIdx: number) => {
      if (!currentQuestion || selectedOption !== null) return;

      const isCorrect = optionIdx === currentQuestion.correctIndex;
      const nextStreak = isCorrect ? streak + 1 : 0;
      const nextBestStreak = Math.max(bestStreak, nextStreak);
      const baseXp =
        currentQuestion.difficulty === "advanced"
          ? 20
          : currentQuestion.difficulty === "intermediate"
          ? 15
          : 10;
      const multiplier = nextStreak >= 5 ? 2 : nextStreak >= 3 ? 1.5 : 1;
      const xpEarned = isCorrect ? Math.round(baseXp * multiplier) : 0;

      setSelectedOption(optionIdx);
      setStreak(nextStreak);
      setBestStreak(nextBestStreak);
      setSessionXp((prev) => prev + xpEarned);

      // Update per-lesson mastery immediately
      const lessonMeta = allLessons.find(
        (l) => l.lesson.id === currentQuestion.lessonId
      );
      const updatedMastery = recordLessonQuestionAttempt(masteryMap, {
        lessonId: currentQuestion.lessonId,
        lessonTitle:
          lessonMeta?.lesson.title || currentQuestion.topicTitle || "Python Topic",
        moduleId:
          lessonMeta?.module.id || currentQuestion.moduleId || "general",
        moduleTitle:
          lessonMeta?.module.title ||
          currentQuestion.moduleTitle ||
          "Python Curriculum",
        isCorrect,
      });
      setMasteryMap(updatedMastery);

      const attempt: QuizQuestionAttempt = {
        questionId: currentQuestion.id,
        lessonId: currentQuestion.lessonId,
        topicTitle: currentQuestion.topicTitle,
        question: currentQuestion.question,
        codeSnippet: currentQuestion.codeSnippet,
        options: currentQuestion.options,
        selectedIndex: optionIdx,
        correctIndex: currentQuestion.correctIndex,
        isCorrect,
        explanation: currentQuestion.explanation,
        xpEarned,
      };
      setAttempts((prev) => [...prev, attempt]);
    },
    [currentQuestion, selectedOption, streak, bestStreak, allLessons, masteryMap]
  );

  const handleNextQuestion = useCallback(() => {
    if (selectedOption === null) return;

    if (currentIdx + 1 >= deck.length) {
      finishQuizSession(
        attempts,
        sessionXp,
        bestStreak,
        elapsedSeconds,
        scope,
        scopeLabel
      );
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
      setAiStatusNote(null);
    }
  }, [
    selectedOption,
    currentIdx,
    deck.length,
    finishQuizSession,
    attempts,
    sessionXp,
    bestStreak,
    elapsedSeconds,
    scope,
    scopeLabel,
  ]);

  // Keyboard shortcuts during active quiz (1-4 / A-D to answer, H for hint, Enter / Right Arrow to advance)
  useEffect(() => {
    if (stage !== "active" || activeTab !== "quiz") return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (selectedOption === null && currentQuestion) {
        const keyMap: Record<string, number> = {
          "1": 0,
          a: 0,
          A: 0,
          "2": 1,
          b: 1,
          B: 1,
          "3": 2,
          c: 2,
          C: 2,
          "4": 3,
          d: 3,
          D: 3,
        };
        if (e.key in keyMap) {
          const idx = keyMap[e.key];
          if (idx < currentQuestion.options.length) {
            e.preventDefault();
            handleSelectAnswer(idx);
          }
          return;
        }
        if (e.key === "h" || e.key === "H") {
          e.preventDefault();
          setShowHint((prev) => !prev);
        }
      } else if (selectedOption !== null) {
        if (e.key === "Enter" || e.key === "ArrowRight") {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    stage,
    activeTab,
    selectedOption,
    currentQuestion,
    handleSelectAnswer,
    handleNextQuestion,
  ]);

  // Generate a Bonus Question appended directly into the current deck
  const handleAddAiChallengeQuestion = async () => {
    setIsGeneratingAiQ(true);
    setAiStatusNote(null);

    const targetLessonItem =
      allLessons.find((l) => l.lesson.id === selectedLessonId) ||
      allLessons.find((l) => l.lesson.id === progress.lastActiveLessonId) ||
      allLessons[0];

    const topicTitle = targetLessonItem?.lesson.title || "Python Fundamentals";
    const topicConcept =
      targetLessonItem?.lesson.summary ||
      targetLessonItem?.lesson.learningObjectives?.join("; ") ||
      "Variables, conditionals, loops, lists, dictionaries, and functions";

    try {
      const res = await fetchWithTimeout(
        getApiUrl("/api/ai/quiz"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          timeoutMs: 15000,
          body: JSON.stringify({
            lessonId: targetLessonItem?.lesson.id || "custom",
            lessonTitle: topicTitle,
            lessonConcept: topicConcept,
            difficulty:
              difficultyPref === "beginner" ? "beginner" : "intermediate",
          }),
        }
      );

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        throw new Error("AI endpoint unavailable in current environment.");
      }
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.quiz) {
        throw new Error(data?.error || "Could not create question.");
      }

      const aiQ: DynamicQuizQuestion = {
        ...data.quiz,
        moduleId: targetLessonItem?.module.id,
        moduleTitle: targetLessonItem?.module.title,
        conceptTag: "Bonus",
        source: "ai",
      };

      if (stage === "active") {
        const insertAt = currentIdx + 1;
        setDeck((prev) => [
          ...prev.slice(0, insertAt),
          aiQ,
          ...prev.slice(insertAt),
        ]);
        setAiStatusNote(`Added a bonus question on "${topicTitle}" next.`);
      } else {
        setDeck([aiQ]);
        setScopeLabel(`Bonus: ${topicTitle}`);
        setSelectionReason(`Bonus question on ${topicTitle}.`);
        setCurrentIdx(0);
        setSelectedOption(null);
        setShowHint(false);
        setAttempts([]);
        setStreak(0);
        setBestStreak(0);
        setSessionXp(0);
        setElapsedSeconds(0);
        setStage("active");
      }
    } catch {
      const fallbackQ = generateRandomQuiz(
        targetLessonItem?.lesson.id || "custom",
        topicTitle,
        topicConcept,
        difficultyPref === "beginner" ? "beginner" : "intermediate",
        targetLessonItem
          ? { id: targetLessonItem.module.id, title: targetLessonItem.module.title }
          : undefined
      );
      if (stage === "active") {
        const insertAt = currentIdx + 1;
        setDeck((prev) => [
          ...prev.slice(0, insertAt),
          fallbackQ,
          ...prev.slice(insertAt),
        ]);
        setAiStatusNote(`Added a new question on "${topicTitle}" next.`);
      } else {
        setDeck([fallbackQ]);
        setScopeLabel(`Quick Quiz: ${topicTitle}`);
        setSelectionReason(`Practice question for ${topicTitle}.`);
        setCurrentIdx(0);
        setSelectedOption(null);
        setShowHint(false);
        setAttempts([]);
        setStreak(0);
        setBestStreak(0);
        setSessionXp(0);
        setElapsedSeconds(0);
        setStage("active");
      }
    } finally {
      setIsGeneratingAiQ(false);
    }
  };

  const renderCodeBlock = (code: string) => {
    const highlighted = Prism.highlight(
      code,
      Prism.languages.python,
      "python"
    );
    const lines = code.split("\n");
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050608] overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-[#15171E]">
          <span className="text-xs font-mono text-slate-500 dark:text-[#BFC4CE]">
            Python snippet
          </span>
          <CopyCodeButton code={code} compact />
        </div>
        <div className="flex overflow-x-auto p-3.5 text-xs sm:text-sm font-mono leading-relaxed">
          <div
            aria-hidden="true"
            className="select-none pr-3 mr-3 border-r border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-right tabular-nums"
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="m-0 bg-transparent text-slate-900 dark:text-slate-100 whitespace-pre">
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
      </div>
    );
  };

  const handleStartMissedPractice = () => {
    const missedIds = Array.from(
      new Set(attempts.filter((a) => !a.isCorrect).map((a) => a.lessonId))
    );
    if (missedIds.length > 0) {
      startQuiz({ scope: "weak-spots", count: Math.max(5, missedIds.length * 2) });
    } else {
      startQuiz({ scope: "adaptive" });
    }
  };

  const handleResetAllStats = async () => {
    if (!confirmResetStats) {
      setConfirmResetStats(true);
      return;
    }
    await clearAllQuizTracking();
    setMasteryMap({});
    setHistory([]);
    setConfirmResetStats(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#08090D] text-slate-900 dark:text-[#F3F4F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-20 md:pb-10">
        {/* Top Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6] text-balance">
              Python Quiz
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-[#BFC4CE] tabular-nums">
              <span>
                {completedCount} of {totalCurriculumLessons} lessons done
              </span>
              <span aria-hidden="true">·</span>
              <span>{progress.totalXp || 0} XP</span>
              <span aria-hidden="true">·</span>
              <span>
                {overallStats.totalQuestionsAnswered > 0
                  ? `${overallStats.overallAccuracy}% right (${overallStats.totalQuestionsAnswered} answered)`
                  : "No quizzes taken yet"}
              </span>
            </div>
          </div>

          {/* Interactive Sub-View Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-[#15171E] border border-slate-200 dark:border-slate-800 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-white dark:bg-[#252933] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Target className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
              <span>Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mastery")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "mastery"
                  ? "bg-white dark:bg-[#252933] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65D9D0]" />
              <span>Topics</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "history"
                  ? "bg-white dark:bg-[#252933] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-500 dark:text-[#F2BC72]" />
              <span className="tabular-nums">History ({history.length})</span>
            </button>
          </div>
        </header>

        {activeTab === "quiz" && (
          <>
            {stage === "setup" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-6 items-start">
                <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] p-5 sm:p-6 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      New Quiz
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-[#BFC4CE]">
                      Questions are picked from your finished lessons and topics to review.
                    </p>
                  </div>

                  {/* Scope Selector */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE] block">
                      Quiz Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(
                        [
                          {
                            id: "adaptive" as QuizScope,
                            title: "Recommended",
                            desc: "Mix of your finished lessons and topics to review",
                            icon: Target,
                          },
                          {
                            id: "current-lesson" as QuizScope,
                            title: "One Lesson",
                            desc: "Practice questions from a single lesson",
                            icon: BookOpen,
                          },
                          {
                            id: "module" as QuizScope,
                            title: "Full Module",
                            desc: "Questions from every lesson in one module",
                            icon: Layers,
                          },
                          {
                            id: "weak-spots" as QuizScope,
                            title: "Review Mistakes",
                            desc:
                              overallStats.weakLessonIds.length > 0
                                ? `${overallStats.weakLessonIds.length} topic${overallStats.weakLessonIds.length === 1 ? "" : "s"} under 75%`
                                : "Revisit earlier lessons you finished",
                            icon: AlertTriangle,
                          },
                          {
                            id: "timed-blitz" as QuizScope,
                            title: "90s Sprint",
                            desc: "Answer as many questions as you can in 90 seconds",
                            icon: Clock,
                          },
                        ] as const
                      ).map((item) => {
                        const Icon = item.icon;
                        const isActive = scope === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setScope(item.id)}
                            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isActive
                                ? "border-blue-500 bg-blue-50/70 dark:bg-[#8BBEFF]/10 dark:border-[#8BBEFF]"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#08090D]/50"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                isActive
                                  ? "text-blue-600 dark:text-[#8BBEFF]"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-[#BFC4CE] mt-0.5 leading-snug">
                                {item.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditional Target Pickers for Lesson / Module Scope */}
                  {scope === "current-lesson" && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="quiz-lesson-select"
                        className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE] block"
                      >
                        Choose Lesson
                      </label>
                      <select
                        id="quiz-lesson-select"
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#08090D] text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                      >
                        {modules.map((mod) => (
                          <optgroup key={mod.id} label={mod.title}>
                            {mod.lessons.map((l) => {
                              const done = progress.completedLessonIds.includes(
                                l.id
                              );
                              return (
                                <option key={l.id} value={l.id}>
                                  {l.title} {done ? "(Completed)" : ""}
                                </option>
                              );
                            })}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  )}

                  {scope === "module" && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="quiz-module-select"
                        className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE] block"
                      >
                        Choose Module
                      </label>
                      <select
                        id="quiz-module-select"
                        value={selectedModuleId}
                        onChange={(e) => setSelectedModuleId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#08090D] text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                      >
                        {modules.map((mod) => {
                          const doneInMod = mod.lessons.filter((l) =>
                            progress.completedLessonIds.includes(l.id)
                          ).length;
                          return (
                            <option key={mod.id} value={mod.id}>
                              {mod.title} ({doneInMod}/{mod.lessons.length} done)
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* Question Count & Difficulty Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {scope !== "timed-blitz" && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE] block">
                          Session Length
                        </span>
                        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#08090D] rounded-xl border border-slate-200 dark:border-slate-800">
                          {[5, 8, 12].map((cnt) => (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => setQuestionCount(cnt)}
                              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                                questionCount === cnt
                                  ? "bg-white dark:bg-[#252933] text-slate-900 dark:text-white shadow-xs"
                                  : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              {cnt} Questions
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE] block">
                        Difficulty Level
                      </span>
                      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#08090D] rounded-xl border border-slate-200 dark:border-slate-800">
                        {(
                          [
                            { id: "adaptive", label: "Auto" },
                            { id: "beginner", label: "Beginner" },
                            { id: "intermediate", label: "Interm." },
                            { id: "mixed", label: "Mixed" },
                          ] as const
                        ).map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setDifficultyPref(d.id)}
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                              difficultyPref === d.id
                                ? "bg-white dark:bg-[#252933] text-slate-900 dark:text-white shadow-xs"
                                : "text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => startQuiz()}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#73aef8] text-white dark:text-[#08090D] font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Quiz</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddAiChallengeQuestion}
                      disabled={isGeneratingAiQ}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-700 dark:text-[#F3F4F6] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                    >
                      {isGeneratingAiQ ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                          <span>Bonus Question</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>

                {/* Right Companion Preview & Progress Summary Deck */}
                <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] p-5 sm:p-6 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      What's Included
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#BFC4CE] leading-relaxed">
                      {previewPlan.selectionReason}
                    </p>
                  </div>

                  {/* Included Lessons Preview */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE]">
                      Lessons covered
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                      {previewPlan.targetLessonIds.slice(0, 5).map((lid) => {
                        const found = allLessons.find((l) => l.lesson.id === lid);
                        const rec = masteryMap[lid];
                        const acc =
                          rec && rec.attempts > 0
                            ? `${Math.round((rec.correct / rec.attempts) * 100)}%`
                            : "New";
                        return (
                          <div
                            key={lid}
                            className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50/50 dark:bg-[#08090D]/50 text-xs"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {found?.lesson.title || lid}
                            </span>
                            <span className="font-mono text-slate-500 dark:text-[#BFC4CE] tabular-nums shrink-0">
                              {acc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compact Lifetime Snapshot */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                        Quizzes
                      </div>
                      <div className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                        {overallStats.totalQuizzes}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                        Accuracy
                      </div>
                      <div className="text-lg font-bold tabular-nums text-emerald-600 dark:text-[#65D9D0]">
                        {overallStats.totalQuestionsAnswered > 0
                          ? `${overallStats.overallAccuracy}%`
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                        Best Streak
                      </div>
                      <div className="text-lg font-bold tabular-nums text-amber-600 dark:text-[#F2BC72]">
                        {overallStats.bestSessionStreak}
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {/* STAGE 2: ACTIVE INTERACTIVE QUIZ STAGE */}
            {stage === "active" && currentQuestion && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-6 items-start">
                {/* Primary Question Zone */}
                <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] p-5 sm:p-6 space-y-5">
                  {/* Question Progress Header */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-[#BFC4CE]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                          Question {currentIdx + 1} of {deck.length}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{currentQuestion.topicTitle}</span>
                        {currentQuestion.conceptTag && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{currentQuestion.conceptTag}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{currentQuestion.difficulty}</span>
                      </div>

                      {scope === "timed-blitz" ? (
                        <div
                          className={`flex items-center gap-1.5 font-mono font-bold tabular-nums ${
                            blitzRemaining <= 15
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-amber-600 dark:text-[#F2BC72]"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{blitzRemaining}s left</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-mono tabular-nums">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDuration(elapsedSeconds)}</span>
                        </div>
                      )}
                    </div>

                    {/* Smooth Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-[#08090D] overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-[#8BBEFF] transition-all duration-200"
                        style={{
                          width: `${Math.round(
                            ((currentIdx + (selectedOption !== null ? 1 : 0)) /
                              Math.max(1, deck.length)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug text-balance">
                    {currentQuestion.question}
                  </h2>

                  {/* Syntax-Highlighted Python Code Block */}
                  {currentQuestion.codeSnippet &&
                    renderCodeBlock(currentQuestion.codeSnippet)}

                  {/* Hint Control & Drawer (Available before answering) */}
                  {selectedOption === null && currentQuestion.hint && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowHint((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-[#F2BC72] hover:underline cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{showHint ? "Hide Hint (H)" : "Show Hint (H)"}</span>
                      </button>
                      {showHint && (
                        <div className="mt-2 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/25 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                          {currentQuestion.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4 Interactive Answer Choices */}
                  <div className="space-y-2.5 pt-1" role="radiogroup" aria-label="Answer options">
                    {currentQuestion.options.map((opt, idx) => {
                      const hasAnswered = selectedOption !== null;
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;

                      let cardClass =
                        "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#08090D]/60 hover:border-blue-400 dark:hover:border-[#8BBEFF]/60 hover:bg-white dark:hover:bg-[#1c1f28] text-slate-900 dark:text-slate-100";

                      if (hasAnswered) {
                        if (isCorrect) {
                          cardClass =
                            "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/35 text-emerald-950 dark:text-emerald-100";
                        } else if (isSelected) {
                          cardClass =
                            "border-rose-500 bg-rose-50 dark:bg-rose-950/35 text-rose-950 dark:text-rose-100";
                        } else {
                          cardClass =
                            "border-slate-200/70 dark:border-slate-800/70 bg-slate-50/30 dark:bg-[#08090D]/30 text-slate-500 dark:text-slate-500 opacity-75";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full min-h-[48px] text-left px-4 py-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                            hasAnswered ? "cursor-default" : "cursor-pointer"
                          } ${cardClass}`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-md border text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                hasAnswered && isCorrect
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : hasAnswered && isSelected && !isCorrect
                                  ? "border-rose-600 bg-rose-600 text-white"
                                  : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15171E] text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {OPTION_LETTERS[idx] || idx + 1}
                            </span>
                            <span className="text-sm font-medium whitespace-pre-wrap break-words font-sans leading-snug">
                              {opt}
                            </span>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {hasAnswered && isCorrect && (
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Correct</span>
                              </span>
                            )}
                            {hasAnswered && isSelected && !isCorrect && (
                              <span className="flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                                <XCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Your pick</span>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Feedback Box */}
                  {selectedOption !== null && (
                    <div
                      className={`rounded-xl border p-4 space-y-3.5 ${
                        selectedOption === currentQuestion.correctIndex
                          ? "border-emerald-300 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/25"
                          : "border-rose-300 dark:border-rose-800/70 bg-rose-50/70 dark:bg-rose-950/25"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {selectedOption === currentQuestion.correctIndex ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="text-emerald-900 dark:text-emerald-200">
                                Correct
                              </span>
                              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                                · +{attempts[attempts.length - 1]?.xpEarned || 10} XP
                                {streak >= 3 ? ` (${streak} streak)` : ""}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                              <span className="text-rose-900 dark:text-rose-200">
                                Not quite — answer is{" "}
                                {OPTION_LETTERS[currentQuestion.correctIndex]}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {currentQuestion.explanation}
                      </p>

                      {/* Interactive Action Bar & Live Mini-Sandbox */}
                      <QuizFeedbackActionsBar
                        codeSnippet={currentQuestion.codeSnippet}
                        lessonId={currentQuestion.lessonId}
                        hasLesson={allLessons.some(
                          (l) => l.lesson.id === currentQuestion.lessonId
                        )}
                        topicTitle={currentQuestion.topicTitle}
                        question={currentQuestion.question}
                        options={currentQuestion.options}
                        selectedIndex={selectedOption}
                        correctIndex={currentQuestion.correctIndex}
                        isCorrect={selectedOption === currentQuestion.correctIndex}
                        explanation={currentQuestion.explanation}
                        onPracticeClick={(snippet) =>
                          onPracticeClick(snippet, {
                            topicTitle: currentQuestion.topicTitle,
                            question: currentQuestion.question,
                          })
                        }
                        onOpenLesson={(lid) =>
                          onOpenLesson(lid, {
                            topicTitle: currentQuestion.topicTitle,
                            question: currentQuestion.question,
                          })
                        }
                        onOpenAiAssist={onOpenAiAssist}
                        rightAction={
                          <button
                            type="button"
                            onClick={handleNextQuestion}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#73aef8] text-white dark:text-[#08090D] font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer ml-auto"
                          >
                            <span>
                              {currentIdx + 1 >= deck.length
                                ? "Finish Quiz"
                                : "Next"}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        }
                      />
                    </div>
                  )}

                  {aiStatusNote && (
                    <div className="text-xs text-blue-700 dark:text-[#8BBEFF]">
                      {aiStatusNote}
                    </div>
                  )}
                </section>

                {/* Quiz Telemetry & Progress Sidebar */}
                <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] p-5 space-y-5 lg:sticky lg:top-20">
                  {/* Mode Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                        Mode
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {scopeLabel}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStage("setup")}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-[#BFC4CE] dark:hover:text-white cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* Live Score Metrics */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                        Score
                      </div>
                      <div className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                        {attempts.filter((a) => a.isCorrect).length}/{attempts.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                        Streak
                      </div>
                      <div className="text-xl font-bold tabular-nums flex items-center gap-1 text-amber-600 dark:text-[#F2BC72]">
                        <Flame className="w-4 h-4" />
                        <span>{streak}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                        XP
                      </div>
                      <div className="text-xl font-bold tabular-nums text-emerald-600 dark:text-[#65D9D0]">
                        +{sessionXp}
                      </div>
                    </div>
                  </div>

                  {/* Question Progress Map */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-500 dark:text-[#BFC4CE]">
                      Questions
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-1.5">
                      {deck.map((q, i) => {
                        const att = attempts[i];
                        const isCurr = i === currentIdx;
                        let boxCls =
                          "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#08090D] text-slate-500 dark:text-slate-400";
                        if (att) {
                          boxCls = att.isCorrect
                            ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                            : "border-rose-500/70 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold";
                        } else if (isCurr) {
                          boxCls =
                            "border-blue-600 dark:border-[#8BBEFF] bg-blue-50 dark:bg-[#8BBEFF]/15 text-blue-700 dark:text-[#8BBEFF] font-bold";
                        }
                        return (
                          <div
                            key={q.id}
                            className={`h-8 rounded-lg border text-xs font-mono tabular-nums flex items-center justify-center ${boxCls}`}
                            title={q.topicTitle}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Bonus Question mid-session */}
                  <button
                    type="button"
                    onClick={handleAddAiChallengeQuestion}
                    disabled={isGeneratingAiQ}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#252933] text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isGeneratingAiQ ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                        <span>Add Extra Question</span>
                      </>
                    )}
                  </button>

                  {/* Keyboard Shortcuts */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-[#BFC4CE] flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      <kbd className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        1-4
                      </kbd>{" "}
                      Answer
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      <kbd className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        H
                      </kbd>{" "}
                      Hint
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      <kbd className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        Enter
                      </kbd>{" "}
                      Next
                    </span>
                  </div>
                </aside>
              </div>
            )}

            {/* STAGE 3: QUIZ SUMMARY */}
            {stage === "summary" && (
              <div className="space-y-6">
                {(() => {
                  const totalQ = attempts.length || 1;
                  const correctCount = attempts.filter((a) => a.isCorrect).length;
                  const pct = Math.round((correctCount / totalQ) * 100);
                  const verdict =
                    pct >= 90
                      ? "Great Score!"
                      : pct >= 75
                      ? "Well Done!"
                      : pct >= 50
                      ? "Good Start"
                      : "Keep Practicing";

                  return (
                    <>
                      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-[#8BBEFF]">
                            <Trophy className="w-4 h-4" />
                            <span>{scopeLabel}</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                            {verdict}
                          </h2>
                          <p className="text-sm text-slate-600 dark:text-[#BFC4CE] max-w-xl">
                            Your scores and XP are saved.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 shrink-0">
                          <div>
                            <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                              Score
                            </div>
                            <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                              {correctCount}/{attempts.length} ({pct}%)
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                              XP
                            </div>
                            <div className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-[#65D9D0]">
                              +{sessionXp}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                              Best Streak
                            </div>
                            <div className="text-2xl font-bold tabular-nums text-amber-600 dark:text-[#F2BC72]">
                              {bestStreak}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                              Time
                            </div>
                            <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                              {formatDuration(elapsedSeconds)}
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => startQuiz()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#73aef8] text-white dark:text-[#08090D] font-bold text-sm transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Try Another</span>
                          </button>

                          {correctCount < attempts.length && (
                            <button
                              type="button"
                              onClick={handleStartMissedPractice}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15171E] hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-800 dark:text-white text-sm font-semibold transition-colors cursor-pointer"
                            >
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              <span>Retry Missed</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setStage("setup")}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#BFC4CE] hover:text-slate-900 dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                          >
                            Back to Setup
                          </button>
                        </div>

                        {/* Review Filter */}
                        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-[#15171E] border border-slate-200 dark:border-slate-800 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setReviewFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer tabular-nums ${
                              reviewFilter === "all"
                                ? "bg-white dark:bg-[#252933] text-slate-900 dark:text-white shadow-xs"
                                : "text-slate-600 dark:text-[#BFC4CE]"
                            }`}
                          >
                            All ({attempts.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setReviewFilter("missed")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer tabular-nums ${
                              reviewFilter === "missed"
                                ? "bg-white dark:bg-[#252933] text-slate-900 dark:text-white shadow-xs"
                                : "text-slate-600 dark:text-[#BFC4CE]"
                            }`}
                          >
                            Missed ({attempts.length - correctCount})
                          </button>
                        </div>
                      </div>

                      {/* Detailed Question Review Cards */}
                      <div className="space-y-4">
                        {attempts
                          .filter((a) => (reviewFilter === "missed" ? !a.isCorrect : true))
                          .map((att, idx) => (
                            <div
                              key={`${att.questionId}-${idx}`}
                              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] p-5 space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#BFC4CE]">
                                  <span className="font-semibold text-slate-900 dark:text-white">
                                    {att.topicTitle}
                                  </span>
                                </div>
                                {att.isCorrect ? (
                                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Correct</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                                    <XCircle className="w-4 h-4" />
                                    <span>Missed</span>
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                {att.question}
                              </h3>

                              {att.codeSnippet && renderCodeBlock(att.codeSnippet)}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div
                                  className={`p-2.5 rounded-lg border ${
                                    att.isCorrect
                                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200"
                                      : "border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/25 text-rose-900 dark:text-rose-200"
                                  }`}
                                >
                                  <span className="font-semibold">Your answer: </span>
                                  <span>{att.options[att.selectedIndex]}</span>
                                </div>
                                {!att.isCorrect && (
                                  <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200">
                                    <span className="font-semibold">Correct answer: </span>
                                    <span>{att.options[att.correctIndex]}</span>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 dark:text-[#BFC4CE] leading-relaxed">
                                {att.explanation}
                              </p>

                              <QuizFeedbackActionsBar
                                codeSnippet={att.codeSnippet}
                                lessonId={att.lessonId}
                                hasLesson={allLessons.some(
                                  (l) => l.lesson.id === att.lessonId
                                )}
                                topicTitle={att.topicTitle}
                                question={att.question}
                                options={att.options}
                                selectedIndex={att.selectedIndex}
                                correctIndex={att.correctIndex}
                                isCorrect={att.isCorrect}
                                explanation={att.explanation}
                                onPracticeClick={(snippet) =>
                                  onPracticeClick(snippet, {
                                    topicTitle: att.topicTitle,
                                    question: att.question,
                                  })
                                }
                                onOpenLesson={(lid) =>
                                  onOpenLesson(lid, {
                                    topicTitle: att.topicTitle,
                                    question: att.question,
                                  })
                                }
                                onOpenAiAssist={onOpenAiAssist}
                              />
                            </div>
                          ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {/* ============================================================
            TAB 2: CURRICULUM TOPIC MASTERY MATRIX (All 7 Modules / 24 Lessons)
           ============================================================ */}
        {activeTab === "mastery" && (
          <div className="space-y-5">
            {modules.map((mod) => {
              const modLessons = mod.lessons;
              const modCompleted = modLessons.filter((l) =>
                progress.completedLessonIds.includes(l.id)
              ).length;
              const modAttempts = modLessons.reduce(
                (sum, l) => sum + (masteryMap[l.id]?.attempts || 0),
                0
              );
              const modCorrect = modLessons.reduce(
                (sum, l) => sum + (masteryMap[l.id]?.correct || 0),
                0
              );
              const modAcc =
                modAttempts > 0 ? Math.round((modCorrect / modAttempts) * 100) : null;

              return (
                <section
                  key={mod.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {mod.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-[#BFC4CE] flex items-center gap-2 tabular-nums">
                        <span>
                          {modCompleted}/{modLessons.length} lessons completed
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {modAcc !== null
                            ? `${modAcc}% quiz accuracy (${modAttempts} Qs)`
                            : "Not quizzed yet"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        startQuiz({
                          scope: "module",
                          moduleId: mod.id,
                          count: Math.min(8, Math.max(5, mod.lessons.length * 2)),
                        })
                      }
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#252933] text-xs font-semibold text-slate-800 dark:text-white transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 text-blue-600 dark:text-[#8BBEFF]" />
                      <span>Quiz Module</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {modLessons.map((lesson) => {
                      const isDone = progress.completedLessonIds.includes(lesson.id);
                      const rec = masteryMap[lesson.id];
                      const acc =
                        rec && rec.attempts > 0
                          ? Math.round((rec.correct / rec.attempts) * 100)
                          : null;

                      return (
                        <div
                          key={lesson.id}
                          className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-[#1b1e28] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {lesson.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-[#BFC4CE] tabular-nums">
                                {isDone ? "Completed" : "In syllabus"}
                                {rec && rec.attempts > 0
                                  ? ` · ${rec.correct}/${rec.attempts} correct (${acc}%)`
                                  : " · No quiz attempts yet"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => onOpenLesson(lesson.id)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#252933] text-xs font-semibold text-slate-700 dark:text-[#BFC4CE] cursor-pointer"
                            >
                              Open Lesson
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                startQuiz({
                                  scope: "current-lesson",
                                  lessonId: lesson.id,
                                  count: 5,
                                })
                              }
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#73aef8] text-white dark:text-[#08090D] text-xs font-bold cursor-pointer"
                            >
                              Quiz Topic
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* ============================================================
            TAB 3: QUIZ SESSION HISTORY
           ============================================================ */}
        {activeTab === "history" && (
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171E] p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Past Quizzes
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                  Saved locally in your browser so you can check them offline.
                </p>
              </div>

              {history.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetAllStats}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      confirmResetStats
                        ? "border-rose-500 bg-rose-600 text-white"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-[#BFC4CE] hover:text-rose-600 dark:hover:text-rose-400"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{confirmResetStats ? "Confirm Reset?" : "Reset Stats"}</span>
                  </button>
                  {confirmResetStats && (
                    <button
                      type="button"
                      onClick={() => setConfirmResetStats(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-slate-600 dark:text-[#BFC4CE]">
                  You haven't completed a quiz session yet.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("quiz");
                    setStage("setup");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#8BBEFF] dark:hover:bg-[#73aef8] text-white dark:text-[#08090D] text-xs font-bold cursor-pointer"
                >
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {history.map((session) => {
                  const isExpanded = expandedHistoryId === session.id;
                  const hasQuestions =
                    Array.isArray(session.questionResults) &&
                    session.questionResults.length > 0;
                  return (
                    <div
                      key={session.id}
                      className="bg-slate-50/40 dark:bg-[#08090D]/40"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          hasQuestions &&
                          setExpandedHistoryId(isExpanded ? null : session.id)
                        }
                        className={`w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-colors ${
                          hasQuestions
                            ? "hover:bg-slate-100/70 dark:hover:bg-[#15171E]/70 cursor-pointer"
                            : "cursor-default"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{session.scopeLabel}</span>
                            {hasQuestions && (
                              <span className="text-[11px] font-medium text-blue-600 dark:text-[#8BBEFF]">
                                {isExpanded ? "Hide questions" : "Review questions"}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-[#BFC4CE] flex flex-wrap items-center gap-2 tabular-nums">
                            <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                            <span aria-hidden="true">·</span>
                            <span>{formatDuration(session.durationSeconds)}</span>
                            <span aria-hidden="true">·</span>
                            <span>Best streak {session.bestStreak}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 tabular-nums">
                          <div className="text-right">
                            <div
                              className={`text-base font-bold ${
                                session.scorePercent >= 75
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-[#F2BC72]"
                              }`}
                            >
                              {session.correctCount}/{session.totalQuestions} ({session.scorePercent}%)
                            </div>
                            <div className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                              +{session.xpEarned} XP
                            </div>
                          </div>
                          {hasQuestions && (
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </button>

                      {isExpanded && hasQuestions && (
                        <div className="p-4 pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-3 bg-white dark:bg-[#15171E]">
                          {session.questionResults.map((att, qIdx) => (
                            <div
                              key={`${session.id}-${att.questionId}-${qIdx}`}
                              className="rounded-xl border border-slate-200 dark:border-[#252933] bg-slate-50/50 dark:bg-[#08090D] p-4 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {att.topicTitle}
                                </span>
                                <span
                                  className={`font-bold flex items-center gap-1 ${
                                    att.isCorrect
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-rose-600 dark:text-rose-400"
                                  }`}
                                >
                                  {att.isCorrect ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Correct</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Missed</span>
                                    </>
                                  )}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                                {att.question}
                              </p>

                              {att.codeSnippet && renderCodeBlock(att.codeSnippet)}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div
                                  className={`p-2 rounded-lg border ${
                                    att.isCorrect
                                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200"
                                      : "border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/25 text-rose-900 dark:text-rose-200"
                                  }`}
                                >
                                  <span className="font-semibold">Your answer: </span>
                                  <span>{att.options[att.selectedIndex]}</span>
                                </div>
                                {!att.isCorrect && (
                                  <div className="p-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200">
                                    <span className="font-semibold">Correct answer: </span>
                                    <span>{att.options[att.correctIndex]}</span>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 dark:text-[#BFC4CE] leading-relaxed">
                                {att.explanation}
                              </p>

                              <QuizFeedbackActionsBar
                                codeSnippet={att.codeSnippet}
                                lessonId={att.lessonId}
                                hasLesson={allLessons.some(
                                  (l) => l.lesson.id === att.lessonId
                                )}
                                topicTitle={att.topicTitle}
                                question={att.question}
                                options={att.options}
                                selectedIndex={att.selectedIndex}
                                correctIndex={att.correctIndex}
                                isCorrect={att.isCorrect}
                                explanation={att.explanation}
                                onPracticeClick={(snippet) =>
                                  onPracticeClick(snippet, {
                                    topicTitle: att.topicTitle,
                                    question: att.question,
                                  })
                                }
                                onOpenLesson={(lid) =>
                                  onOpenLesson(lid, {
                                    topicTitle: att.topicTitle,
                                    question: att.question,
                                  })
                                }
                                onOpenAiAssist={onOpenAiAssist}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
