import { z } from "zod";

// ==========================================
// 1. Technical Terms Schema
// ==========================================
export const TechnicalTermSchema = z.object({
  id: z.string().optional(),
  term: z.string().min(1, "Term name is required"),
  definition: z.string().min(1, "Definition is required"),
  example: z.string().optional(),
  pointOfIntroduction: z.string().optional(),
  metaphor: z.string().optional(),
  codeSnippet: z.string().optional(),
  category: z.string().optional(),
  definitionStatus: z.string().optional(),
  sourceLessonId: z.string().optional(),
});
export type TechnicalTerm = z.infer<typeof TechnicalTermSchema>;

// ==========================================
// 2. Line-by-Line Code Explanation Schema
// ==========================================
export const LineExplanationSchema = z.object({
  line: z.number().int().positive("Line number must be a positive integer"),
  code: z.string(),
  explanation: z.string().min(1, "Line explanation is required"),
  conceptId: z.string().optional(),
});
export type LineExplanation = z.infer<typeof LineExplanationSchema>;

// ==========================================
// 3. Practice Question Schemas (Discriminated Union)
// ==========================================
export const MultipleChoiceQuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  type: z.literal("multiple-choice"),
  question: z.string().optional(),
  prompt: z.string().optional(),
  codeSnippet: z.string().nullable().optional(),
  options: z.array(z.string()).optional(),
  correctIndex: z.number().int().optional(),
  correctAnswer: z.string().optional(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
  origin: z.string().optional(),
  authoringStatus: z.string().optional(),
});
export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestionSchema>;

export const PredictOutputQuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  type: z.literal("predict-output"),
  question: z.string().optional(),
  prompt: z.string().optional(),
  codeSnippet: z.string().optional(),
  expectedOutput: z.string().optional(),
  correctAnswer: z.string().optional(),
  acceptedOutputs: z.array(z.string()).optional(),
  acceptedAnswers: z.array(z.string()).optional(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});
export type PredictOutputQuestion = z.infer<typeof PredictOutputQuestionSchema>;

export const CodeFixQuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  type: z.literal("code-fix"),
  question: z.string().optional(),
  prompt: z.string().optional(),
  taskInstructions: z.string().optional(),
  brokenCode: z.string().optional(),
  solutionCode: z.string().optional(),
  expectedOutputPattern: z.string().optional(),
  hints: z.array(z.string()).optional(),
  explanation: z.string().optional(),
});
export type CodeFixQuestion = z.infer<typeof CodeFixQuestionSchema>;

export const ShortAnswerQuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  type: z.literal("short-answer"),
  prompt: z.string().optional(),
  question: z.string().optional(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  acceptedAnswers: z.array(z.string()).optional(),
  codeSnippet: z.string().nullable().optional(),
  starterCode: z.string().nullable().optional(),
  solutionCode: z.string().nullable().optional(),
  testCases: z.array(z.any()).optional(),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  origin: z.string().optional(),
  authoringStatus: z.string().optional(),
});
export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;

export const CodeOutputQuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  type: z.literal("code-output"),
  prompt: z.string().optional(),
  question: z.string().optional(),
  options: z.array(z.string()).optional(),
  codeSnippet: z.string().nullable().optional(),
  correctAnswer: z.string().optional(),
  acceptedAnswers: z.array(z.string()).optional(),
  starterCode: z.string().nullable().optional(),
  solutionCode: z.string().nullable().optional(),
  testCases: z.array(z.any()).optional(),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  origin: z.string().optional(),
  authoringStatus: z.string().optional(),
});
export type CodeOutputQuestion = z.infer<typeof CodeOutputQuestionSchema>;

export const PracticeQuestionSchema = z.discriminatedUnion("type", [
  MultipleChoiceQuestionSchema,
  PredictOutputQuestionSchema,
  CodeFixQuestionSchema,
  ShortAnswerQuestionSchema,
  CodeOutputQuestionSchema,
]);
export type PracticeQuestion = z.infer<typeof PracticeQuestionSchema>;

// ==========================================
// 4. Typed Lesson Sections (Discriminated Union)
// ==========================================
export const SyntaxComponentSchema = z.object({
  component: z.string().min(1, "Component name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  example: z.string().optional(),
  required: z.boolean().optional(),
});
export type SyntaxComponent = z.infer<typeof SyntaxComponentSchema>;

export const SyntaxSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("syntax"),
  title: z.string().optional(),
  syntax: z.string().optional(),
  code: z.string().optional(),
  components: z.array(SyntaxComponentSchema).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});
export type SyntaxSection = z.infer<typeof SyntaxSectionSchema>;

export const ExplanationSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("explanation"),
  title: z.string().optional(),
  content: z.string().min(1, "Explanation content cannot be empty"),
  keyPoints: z.array(z.string()).optional(),
});
export type ExplanationSection = z.infer<typeof ExplanationSectionSchema>;

export const TermsSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("terms"),
  title: z.string().optional(),
  terms: z.array(TechnicalTermSchema).min(1, "At least one term is required"),
});
export type TermsSection = z.infer<typeof TermsSectionSchema>;

export const ExampleSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("example"),
  title: z.string().optional(),
  language: z.string().optional(),
  code: z.string().min(1, "Example code is required"),
  description: z.string().optional(),
  explanation: z.string().optional(),
  expectedOutput: z.string().optional(),
  stepByStep: z.array(z.string()).optional(),
  walkthrough: z.array(z.string()).optional(),
  lineWalkthrough: z.array(LineExplanationSchema).optional(),
  origin: z.string().optional(),
});
export type ExampleSection = z.infer<typeof ExampleSectionSchema>;

export const EditorActivitySectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("editor-activity"),
  title: z.string().optional(),
  objective: z.string().optional(),
  instructions: z.union([z.string(), z.array(z.string())]),
  starterCode: z.string(),
  solutionCode: z.string().optional(),
  expectedOutput: z.string().optional(),
  expectedOutputPattern: z.string().optional(),
  hints: z.array(z.string()).optional(),
  tests: z.array(z.any()).optional(),
});
export type EditorActivitySection = z.infer<typeof EditorActivitySectionSchema>;

export const PracticeSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("practice"),
  title: z.string().optional(),
  instructions: z.string().optional(),
  questions: z.array(PracticeQuestionSchema).min(1, "At least one practice question is required"),
});
export type PracticeSection = z.infer<typeof PracticeSectionSchema>;

export const CommonMistakesSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("common-mistakes"),
  title: z.string().optional(),
  mistakes: z.array(
    z.object({
      title: z.string().optional(),
      mistake: z.string().optional(),
      badCode: z.string().optional(),
      incorrectCode: z.string().optional(),
      goodCode: z.string().optional(),
      correctedCode: z.string().optional(),
      explanation: z.string().optional(),
      whyItHappens: z.string().optional(),
      correction: z.string().optional(),
    })
  ).min(1, "At least one mistake entry is required"),
});
export type CommonMistakesSection = z.infer<typeof CommonMistakesSectionSchema>;

export const RecapSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("recap"),
  title: z.string().optional(),
  takeaways: z.array(z.string()).optional(),
  keyPoints: z.array(z.string()).optional(),
  takeaway: z.string().optional(),
});
export type RecapSection = z.infer<typeof RecapSectionSchema>;

export const DeeperDiveSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("deeper-dive"),
  title: z.string().optional(),
  content: z.string().min(1, "Deeper dive content is required"),
  challenge: z.string().optional(),
  hints: z.array(z.string()).optional(),
  solutionCode: z.string().optional(),
});
export type DeeperDiveSection = z.infer<typeof DeeperDiveSectionSchema>;

export const FuturePreviewSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("future-preview"),
  title: z.string().optional(),
  concept: z.string().optional(),
  sproutsIn: z.string().optional(),
  teaser: z.string().optional(),
  content: z.string().optional(),
});
export type FuturePreviewSection = z.infer<typeof FuturePreviewSectionSchema>;

export const LessonSectionSchema = z.discriminatedUnion("type", [
  ExplanationSectionSchema,
  SyntaxSectionSchema,
  TermsSectionSchema,
  ExampleSectionSchema,
  EditorActivitySectionSchema,
  PracticeSectionSchema,
  CommonMistakesSectionSchema,
  RecapSectionSchema,
  DeeperDiveSectionSchema,
  FuturePreviewSectionSchema,
]);
export type LessonSection = z.infer<typeof LessonSectionSchema>;

// ==========================================
// 5. Lesson Schema
// ==========================================
export const CurriculumLessonSchema = z.object({
  id: z.string().min(1, "Lesson ID is required"),
  title: z.string().min(1, "Lesson title is required"),
  order: z.number().int().min(1, "Lesson order must be >= 1"),
  summary: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  learningObjectives: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  conceptsIntroduced: z.array(z.string()).default([]),
  conceptsReservedForLater: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  prerequisitesReviewed: z.boolean().optional(),
  sections: z.array(LessonSectionSchema).min(1, "At least one lesson section is required"),
  sourceMetadata: z.any().optional(),
});
export type CurriculumLesson = z.infer<typeof CurriculumLessonSchema>;

// ==========================================
// 6. Module Schema
// ==========================================
export const CurriculumModuleSchema = z.object({
  id: z.string().min(1, "Module ID is required"),
  title: z.string().min(1, "Module title is required"),
  order: z.number().int().min(1, "Module order must be >= 1"),
  description: z.string().min(1, "Module description is required"),
  category: z.string().default("standard"),
  learningObjectives: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  lessons: z.array(CurriculumLessonSchema).min(1, "Module must contain at least one lesson"),
});
export type CurriculumModule = z.infer<typeof CurriculumModuleSchema>;

// ==========================================
// 7. Curriculum Package Schema
// ==========================================
export const CurriculumMetadataSchema = z.object({
  id: z.string().optional(),
  curriculumId: z.string().optional(),
  title: z.string().optional(),
  version: z.string().optional(),
  schemaVersion: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  totalEstimatedHours: z.number().optional(),
  totalModules: z.number().optional(),
  totalLessons: z.number().optional(),
  targetAudience: z.string().optional(),
  estimatedTotalMinutes: z.number().optional(),
  topics: z.array(z.string()).optional(),
});
export type CurriculumMetadata = z.infer<typeof CurriculumMetadataSchema>;

export const CurriculumPackageSchema = z.object({
  metadata: CurriculumMetadataSchema.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  curriculumId: z.string().optional(),
  schemaVersion: z.string().optional(),
  language: z.string().optional(),
  programmingLanguage: z.string().optional(),
  modules: z.array(CurriculumModuleSchema).min(1, "Curriculum must contain at least one module"),
});
export type CurriculumPackage = z.infer<typeof CurriculumPackageSchema>;

export const SingleCurriculumSchema = z.union([
  CurriculumPackageSchema,
  z.array(CurriculumModuleSchema),
  CurriculumModuleSchema,
]);
export type SingleCurriculum = z.infer<typeof SingleCurriculumSchema>;
