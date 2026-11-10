export type AppMode = "study" | "playground" | "games";

export type ThemeMode = "dark" | "light";

export interface LessonQuickCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonMistake {
  title: string;
  badCode: string;
  goodCode: string;
  explanation: string;
}

export interface LessonSeed {
  concept: string;
  sproutsIn: string;
  teaser: string;
}

export interface LessonChallenge {
  challenge: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  expectedOutputPattern?: string;
}

export interface PythonLesson {
  id: string;
  title: string;
  description: string;
  phaseId?: string;
  phaseTitle?: string;
  hook?: string;
  plainEnglish?: string;
  codeExample?: string;
  whatJustHappened?: string[];
  deeperDive?: string;
  yourTurn?: LessonChallenge;
  quickChecks?: LessonQuickCheck[];
  commonMistakes?: LessonMistake[];
  seedsForLater?: LessonSeed;
  recap?: string[];
  glossaryTerms?: string[];
  concept: string; // Formatted markdown textbook representation
  practiceCode: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizAnswerIndex?: number;
  mrcetUnit?: "UNIT I" | "UNIT II" | "UNIT III" | "UNIT IV" | "UNIT V";
  mrcetTopic?: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  plainDefinition: string;
  metaphor: string;
  codeSnippet: string;
  introducedInPhase: string;
  category: "core" | "data-type" | "control-flow" | "data-structure" | "function" | "oop" | "syntax";
}

export interface LessonModule {
  id: string;
  title: string;
  description?: string;
  mrcetUnit?: "UNIT I" | "UNIT II" | "UNIT III" | "UNIT IV" | "UNIT V";
  lessons: PythonLesson[];
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  returnValue?: string;
  executionTimeMs: number;
  isError: boolean;
}

export interface ConsoleHistoryEntry {
  id: string;
  runIndex: number;
  timestamp: number;
  code: string;
  result: ExecutionResult;
}

export interface AutocompleteItem {
  label: string;
  type: "keyword" | "builtin" | "method" | "snippet" | "variable" | "function";
  detail?: string;
  insertText: string;
  description?: string;
}

export interface UserAccount {
  userId: string;
  loggedIn: boolean;
}

export interface UserCloudFile {
  id: string;
  userId: string;
  name: string;
  code: string;
  updatedAt: number;
}

export interface CloudSnippet {
  id: string;
  title: string;
  code: string;
  updatedAt: number;
}

export interface UserProgress {
  completedLessonIds: string[];
  lastActiveLessonId: string;
  totalXp: number;
  streakDays: number;
  savedPlaygroundCode: string;
}

export interface AIDebugResult {
  fixedCode: string;
  explanation: string;
  bugType: string;
  tips: string[];
}

export interface AICommentResult {
  commentedCode: string;
  summary: string;
}

export interface AIExplainResult {
  summary: string;
  steps: string[];
  concepts: string[];
}
