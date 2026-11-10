import fs from "fs";
import path from "path";
import { PYTHON_MODULES } from "../src/data/pythonLessons";
import { GLOSSARY_TERMS } from "../src/data/glossary";
import {
  CurriculumModule,
  CurriculumLesson,
  LessonSection,
  MultipleChoiceQuestion,
  LineExplanation,
  TechnicalTerm,
  CurriculumModuleSchema,
} from "../src/data/curriculum/schema";

const outputDir = path.join(process.cwd(), "src/data/curriculum/modules");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map glossary by term lowercase for fast lookup
const glossaryMap = new Map<string, { term: string; def: string }>();
for (const entry of GLOSSARY_TERMS) {
  glossaryMap.set(entry.term.toLowerCase(), {
    term: entry.term,
    def: `${entry.plainDefinition} ${entry.metaphor ? `Analogy: ${entry.metaphor}` : ""}`.trim(),
  });
  glossaryMap.set(entry.id.toLowerCase(), {
    term: entry.term,
    def: `${entry.plainDefinition} ${entry.metaphor ? `Analogy: ${entry.metaphor}` : ""}`.trim(),
  });
}

// Track concepts introduced across lessons sequentially
const taughtConceptsSet = new Set<string>([
  "concept-python-basics",
  "concept-syntax-comments",
  "concept-io-output",
  "concept-numeric-literals",
  "concept-basic-text-strings",
]);

let totalLessonsMigrated = 0;
let totalModulesMigrated = 0;
const generatedModules: CurriculumModule[] = [];

PYTHON_MODULES.forEach((mod, modIdx) => {
  const moduleOrder = modIdx + 1;
  const isMrcet = mod.id.startsWith("mrcet") || !!mod.mrcetUnit;

  const migratedLessons: CurriculumLesson[] = mod.lessons.map((lesson, lessonIdx) => {
    totalLessonsMigrated++;
    const lessonOrder = lessonIdx + 1;
    const lessonId = lesson.id || `lesson-${mod.id}-${lessonOrder}`;

    // 1. Objectives
    const learningObjectives: string[] = [];
    if (lesson.description) {
      learningObjectives.push(lesson.description);
    }
    if (lesson.hook) {
      learningObjectives.push(lesson.hook);
    }
    if (learningObjectives.length === 0) {
      learningObjectives.push(`Master ${lesson.title}`);
    }

    // 2. Concepts Introduced & Prerequisites
    const primaryConcept = `concept-${lessonId.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase()}`;
    const conceptsIntroduced = [primaryConcept];

    // Pick 1-2 taught concepts as prerequisites
    const availablePrereqs = Array.from(taughtConceptsSet);
    const prerequisites: string[] = [];
    if (availablePrereqs.length > 0) {
      // Pick the most recent taught concept as prerequisite
      prerequisites.push(availablePrereqs[availablePrereqs.length - 1]);
    }
    if (availablePrereqs.length > 3 && lessonOrder > 1) {
      prerequisites.push(availablePrereqs[availablePrereqs.length - 2]);
    }

    // Register this concept for subsequent lessons
    taughtConceptsSet.add(primaryConcept);

    // 3. Sections
    const sections: LessonSection[] = [];

    // Section: Explanation
    const explanationContent = [
      lesson.plainEnglish ? `### Plain-English Overview\n${lesson.plainEnglish}` : "",
      lesson.concept ? lesson.concept : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    sections.push({
      type: "explanation",
      title: "Core Concepts",
      content: explanationContent || `In this lesson, we study ${lesson.title}.`,
    });

    // Section: Terms
    if (lesson.glossaryTerms && lesson.glossaryTerms.length > 0) {
      const terms: TechnicalTerm[] = [];
      for (const t of lesson.glossaryTerms) {
        const found = glossaryMap.get(t.toLowerCase());
        if (found) {
          terms.push({
            term: found.term,
            definition: found.def,
            pointOfIntroduction: lesson.title,
          });
        } else {
          terms.push({
            term: t,
            definition: `Key technical term introduced in ${lesson.title}.`,
            pointOfIntroduction: lesson.title,
          });
        }
      }
      if (terms.length > 0) {
        sections.push({
          type: "terms",
          title: "Technical Vocabulary",
          terms,
        });
      }
    }

    // Section: Worked Example
    if (lesson.codeExample) {
      const codeLines = lesson.codeExample.split("\n").filter((l) => l.trim().length > 0);
      const lineWalkthrough: LineExplanation[] = codeLines.map((line, lIdx) => {
        const explanation =
          (lesson.whatJustHappened && lesson.whatJustHappened[lIdx]) ||
          (line.trim().startsWith("#")
            ? "Comment line: Python ignores comments, which are notes written for humans."
            : line.includes("print(")
            ? "Calls print() to output data to standard output console."
            : line.includes("=")
            ? "Stores value in memory variable."
            : `Executes instruction step ${lIdx + 1}.`);

        return {
          line: lIdx + 1,
          code: line,
          explanation,
        };
      });

      sections.push({
        type: "example",
        title: "Code Example & Execution",
        code: lesson.codeExample,
        description: "Review the program below and trace how Python executes each statement step-by-step.",
        expectedOutput: undefined,
        lineWalkthrough,
      });
    }

    // Section: Editor Activity
    const starter = lesson.yourTurn?.starterCode || lesson.practiceCode || lesson.codeExample || "# Write your Python code here\n";
    const instructions = lesson.yourTurn?.challenge || `Write and run code testing the concepts from ${lesson.title}.`;
    const solution = lesson.yourTurn?.solutionCode;
    const hints = lesson.yourTurn?.hints || ["Carefully check indentation and syntax.", "Use print() to inspect variables."];

    sections.push({
      type: "editor-activity",
      title: "Try It Yourself",
      instructions,
      starterCode: starter,
      solutionCode: solution,
      hints,
    });

    // Section: Practice Questions
    const questions: MultipleChoiceQuestion[] = [];
    if (lesson.quickChecks && lesson.quickChecks.length > 0) {
      lesson.quickChecks.forEach((qc, qIdx) => {
        questions.push({
          id: `q-${lessonId}-qc-${qIdx + 1}`,
          type: "multiple-choice",
          question: qc.question,
          options: qc.options,
          correctIndex: Math.max(0, Math.min(qc.options.length - 1, qc.correctIndex)),
          hint: "Think about the behavior of Python syntax and rules discussed in this lesson.",
          explanation: qc.explanation || "Correct! This follows the rules explained in this lesson.",
        });
      });
    }

    if (lesson.quizQuestion && lesson.quizOptions && lesson.quizOptions.length >= 2) {
      questions.push({
        id: `q-${lessonId}-quiz-1`,
        type: "multiple-choice",
        question: lesson.quizQuestion,
        options: lesson.quizOptions,
        correctIndex: Math.max(0, Math.min(lesson.quizOptions.length - 1, lesson.quizAnswerIndex || 0)),
        hint: "Review the lesson overview and code examples above.",
        explanation: "Correct answer for this practice challenge.",
      });
    }

    if (questions.length === 0) {
      // Create a sensible question based on lesson title
      questions.push({
        id: `q-${lessonId}-auto-1`,
        type: "multiple-choice",
        question: `What is the primary purpose of ${lesson.title}?`,
        options: [
          `To learn and apply ${lesson.title} correctly in Python programs.`,
          "To delete files from the computer filesystem.",
          "To format the hard drive.",
          "To bypass Python syntax checking.",
        ],
        correctIndex: 0,
        hint: `Consider what capability was introduced in this lesson.`,
        explanation: `Correct! ${lesson.title} provides fundamental functionality for writing clear, working Python code.`,
      });
    }

    sections.push({
      type: "practice",
      title: "Practice Questions",
      questions,
    });

    // Section: Common Mistakes
    if (lesson.commonMistakes && lesson.commonMistakes.length > 0) {
      sections.push({
        type: "common-mistakes",
        title: "Common Pitfalls & Mistakes",
        mistakes: lesson.commonMistakes.map((m) => ({
          title: m.title,
          badCode: m.badCode,
          goodCode: m.goodCode,
          explanation: m.explanation,
        })),
      });
    }

    // Section: Recap
    const takeaways = lesson.recap && lesson.recap.length > 0 ? lesson.recap : [`Reviewed core principles of ${lesson.title}.`, "Practiced interactive code execution in Pyodide."];
    sections.push({
      type: "recap",
      title: "Lesson Recap",
      takeaways,
    });

    // Section: Deeper Dive
    if (lesson.deeperDive) {
      sections.push({
        type: "deeper-dive",
        title: "Deeper Dive & Expert Insights",
        content: lesson.deeperDive,
      });
    }

    const curriculumLesson: CurriculumLesson = {
      id: lessonId,
      title: lesson.title,
      order: lessonOrder,
      estimatedMinutes: 10,
      learningObjectives,
      prerequisites,
      conceptsIntroduced,
      sections,
    };

    return curriculumLesson;
  });

  const category = isMrcet ? "mrcet-syllabus" : "standard";
  const modSlug = mod.id.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
  const filename = `module-${String(moduleOrder).padStart(2, "0")}-${modSlug}.json`;
  const fullPath = path.join(outputDir, filename);

  const curriculumModule: CurriculumModule = {
    id: mod.id,
    title: mod.title,
    order: moduleOrder,
    description: mod.description || `Comprehensive lessons and exercises for ${mod.title}.`,
    category,
    lessons: migratedLessons,
  };

  // Validate module with Zod
  const validated = CurriculumModuleSchema.parse(curriculumModule);
  fs.writeFileSync(fullPath, JSON.stringify(validated, null, 2), "utf-8");
  console.log(`Saved module [${moduleOrder}/16]: ${filename} (${migratedLessons.length} lessons)`);
  totalModulesMigrated++;
  generatedModules.push(curriculumModule);
});

console.log("\n=======================================================");
console.log(`Successfully migrated ${totalModulesMigrated} modules and ${totalLessonsMigrated} lessons!`);
console.log("=======================================================\n");
