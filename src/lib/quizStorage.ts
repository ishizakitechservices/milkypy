import {
  saveQuizSessionToDb,
  getQuizSessionsFromDb,
  clearQuizSessionsFromDb,
} from "./indexedDbStorage";

export type QuizScope =
  | "adaptive"
  | "current-lesson"
  | "module"
  | "weak-spots"
  | "timed-blitz";

export interface LessonMasteryRecord {
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
  attempts: number;
  correct: number;
  lastAttemptedAt: number;
  streak: number;
}

export interface QuizQuestionAttempt {
  questionId: string;
  lessonId: string;
  topicTitle: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  xpEarned: number;
}

export interface QuizSessionRecord {
  id: string;
  timestamp: number;
  scope: QuizScope;
  scopeLabel: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  xpEarned: number;
  bestStreak: number;
  durationSeconds: number;
  missedLessonIds: string[];
  questionResults: QuizQuestionAttempt[];
}

const KEY_MASTERY = "milkypy_quiz_mastery_v1";
const KEY_HISTORY = "milkypy_quiz_history_v1";

export function loadLessonMastery(): Record<string, LessonMasteryRecord> {
  try {
    const raw = localStorage.getItem(KEY_MASTERY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load quiz mastery:", e);
  }
  return {};
}

export function saveLessonMastery(mastery: Record<string, LessonMasteryRecord>): void {
  try {
    localStorage.setItem(KEY_MASTERY, JSON.stringify(mastery));
  } catch (e) {
    console.warn("Failed to save quiz mastery:", e);
  }
}

export function recordLessonQuestionAttempt(
  currentMap: Record<string, LessonMasteryRecord>,
  params: {
    lessonId: string;
    lessonTitle: string;
    moduleId: string;
    moduleTitle: string;
    isCorrect: boolean;
  }
): Record<string, LessonMasteryRecord> {
  const prev = currentMap[params.lessonId] || {
    lessonId: params.lessonId,
    lessonTitle: params.lessonTitle,
    moduleId: params.moduleId,
    moduleTitle: params.moduleTitle,
    attempts: 0,
    correct: 0,
    lastAttemptedAt: 0,
    streak: 0,
  };

  const updated: LessonMasteryRecord = {
    ...prev,
    lessonTitle: params.lessonTitle || prev.lessonTitle,
    moduleId: params.moduleId || prev.moduleId,
    moduleTitle: params.moduleTitle || prev.moduleTitle,
    attempts: prev.attempts + 1,
    correct: prev.correct + (params.isCorrect ? 1 : 0),
    lastAttemptedAt: Date.now(),
    streak: params.isCorrect ? prev.streak + 1 : 0,
  };

  const nextMap = {
    ...currentMap,
    [params.lessonId]: updated,
  };
  saveLessonMastery(nextMap);
  return nextMap;
}

export function loadQuizHistorySync(): QuizSessionRecord[] {
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load quiz history:", e);
  }
  return [];
}

export async function loadQuizHistory(): Promise<QuizSessionRecord[]> {
  const local = loadQuizHistorySync();
  try {
    const fromDb = await getQuizSessionsFromDb<QuizSessionRecord>();
    if (fromDb.length >= local.length && fromDb.length > 0) {
      return fromDb;
    }
  } catch {
    // Fallback cleanly to localStorage
  }
  return local;
}

export async function saveQuizSession(session: QuizSessionRecord): Promise<QuizSessionRecord[]> {
  const existing = loadQuizHistorySync();
  const next = [session, ...existing.filter((s) => s.id !== session.id)].slice(0, 40);
  try {
    localStorage.setItem(KEY_HISTORY, JSON.stringify(next));
  } catch (e) {
    console.warn("Failed to cache quiz history:", e);
  }
  saveQuizSessionToDb(session).catch(() => {});
  return next;
}

export async function clearAllQuizTracking(): Promise<void> {
  try {
    localStorage.removeItem(KEY_MASTERY);
    localStorage.removeItem(KEY_HISTORY);
  } catch {
    // ignore
  }
  await clearQuizSessionsFromDb().catch(() => {});
}

export interface OverallQuizStats {
  totalQuizzes: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalQuizXp: number;
  bestSessionStreak: number;
  weakLessonIds: string[];
}

export function computeOverallQuizStats(
  mastery: Record<string, LessonMasteryRecord>,
  history: QuizSessionRecord[]
): OverallQuizStats {
  const records = Object.values(mastery);
  const totalQuestionsAnswered = records.reduce((sum, r) => sum + r.attempts, 0);
  const totalCorrect = records.reduce((sum, r) => sum + r.correct, 0);
  const overallAccuracy =
    totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

  const totalQuizXp = history.reduce((sum, s) => sum + (s.xpEarned || 0), 0);
  const bestSessionStreak = history.reduce((best, s) => Math.max(best, s.bestStreak || 0), 0);

  const weakLessonIds = records
    .filter((r) => r.attempts > 0 && r.correct / r.attempts < 0.75)
    .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts)
    .map((r) => r.lessonId);

  return {
    totalQuizzes: history.length,
    totalQuestionsAnswered,
    totalCorrect,
    overallAccuracy,
    totalQuizXp,
    bestSessionStreak,
    weakLessonIds,
  };
}
