import {
  CurriculumModule,
  CurriculumModuleSchema,
  PracticeQuestion,
} from "./schema";

export interface CurriculumValidationError {
  type:
    | "schema"
    | "duplicate-id"
    | "unresolved-prerequisite"
    | "out-of-order-prerequisite"
    | "invalid-reference"
    | "invalid-order";
  location: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: CurriculumValidationError[];
  warnings: string[];
  stats: {
    modulesCount: number;
    lessonsCount: number;
    questionsCount: number;
    conceptsCount: number;
  };
}

/**
 * Pure, browser-safe validator for curriculum modules and prerequisites.
 */
export function validateCurriculum(
  modules: CurriculumModule[],
  fundamentalConceptIds: string[] = []
): ValidationResult {
  const errors: CurriculumValidationError[] = [];
  const warnings: string[] = [];

  const seenModuleIds = new Set<string>();
  const seenLessonIds = new Set<string>();
  const seenQuestionIds = new Set<string>();

  // Map of concept ID -> first lesson ID that introduces it
  const conceptIntroductionMap = new Map<string, string>();
  for (const c of fundamentalConceptIds) {
    conceptIntroductionMap.set(c, "fundamentals");
  }

  // Pre-scan all introduced concepts across all lessons to distinguish "introduced later" vs "never introduced"
  const allFutureIntroducedConcepts = new Map<string, { moduleId: string; lessonId: string }>();
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      for (const cId of lesson.conceptsIntroduced || []) {
        if (!allFutureIntroducedConcepts.has(cId)) {
          allFutureIntroducedConcepts.set(cId, { moduleId: mod.id, lessonId: lesson.id });
        }
      }
    }
  }

  const allFutureLessons = new Map<string, { moduleId: string; lessonId: string }>();
  const allFutureModules = new Set<string>();
  for (const mod of modules) {
    allFutureModules.add(mod.id);
    for (const l of mod.lessons) {
      allFutureLessons.set(l.id, { moduleId: mod.id, lessonId: l.id });
    }
  }

  const activeTaughtConcepts = new Set<string>(fundamentalConceptIds);
  let totalQuestions = 0;

  // Validate modules and lessons sequentially
  modules.forEach((mod, modIdx) => {
    const modLoc = `Module #${modIdx + 1} (${mod.id || "unnamed"})`;

    // 1. Zod Schema Validation for Module
    const modParse = CurriculumModuleSchema.safeParse(mod);
    if (!modParse.success) {
      for (const issue of modParse.error.issues) {
        errors.push({
          type: "schema",
          location: `${modLoc} -> ${issue.path.join(".")}`,
          message: issue.message,
        });
      }
    }

    // 2. Module ID Uniqueness
    if (seenModuleIds.has(mod.id)) {
      errors.push({
        type: "duplicate-id",
        location: modLoc,
        message: `Duplicate module ID "${mod.id}" detected.`,
      });
    }
    seenModuleIds.add(mod.id);

    // 3. Lesson Iteration
    const seenLessonOrders = new Set<number>();

    mod.lessons.forEach((lesson, lessonIdx) => {
      const lessonLoc = `${modLoc} -> Lesson #${lessonIdx + 1} (${lesson.id || "unnamed"})`;

      // Lesson ID Uniqueness
      if (seenLessonIds.has(lesson.id)) {
        errors.push({
          type: "duplicate-id",
          location: lessonLoc,
          message: `Duplicate lesson ID "${lesson.id}" detected across curriculum.`,
        });
      }
      seenLessonIds.add(lesson.id);

      // Lesson Order Check
      if (seenLessonOrders.has(lesson.order)) {
        errors.push({
          type: "invalid-order",
          location: lessonLoc,
          message: `Duplicate lesson order ${lesson.order} in module "${mod.id}".`,
        });
      }
      seenLessonOrders.add(lesson.order);

      // 4. Prerequisite Verification (supports concept IDs, prior lesson IDs, and prior module IDs)
      for (const prereqId of lesson.prerequisites || []) {
        const isTaughtConcept = activeTaughtConcepts.has(prereqId);
        const isCompletedLesson = seenLessonIds.has(prereqId);
        const isCompletedModule = seenModuleIds.has(prereqId);

        if (!isTaughtConcept && !isCompletedLesson && !isCompletedModule) {
          const futureLesson = allFutureLessons.get(prereqId);
          const futureConcept = allFutureIntroducedConcepts.get(prereqId);
          if (futureLesson) {
            errors.push({
              type: "out-of-order-prerequisite",
              location: lessonLoc,
              message: `Prerequisite lesson "${prereqId}" is used here before being taught! It is taught later in Module "${futureLesson.moduleId}".`,
            });
          } else if (futureConcept) {
            errors.push({
              type: "out-of-order-prerequisite",
              location: lessonLoc,
              message: `Prerequisite concept "${prereqId}" is used here before being taught! It is introduced later in Module "${futureConcept.moduleId}", Lesson "${futureConcept.lessonId}".`,
            });
          } else {
            // Non-blocking warning for external tags or concepts
            warnings.push(`[${lessonLoc}] Prerequisite "${prereqId}" is treated as foundational.`);
          }
        }
      }

      // Register concepts and lesson ID into active taught set
      activeTaughtConcepts.add(lesson.id);
      for (const introducedId of lesson.conceptsIntroduced || []) {
        activeTaughtConcepts.add(introducedId);
      }
      for (const tag of lesson.tags || []) {
        activeTaughtConcepts.add(tag);
      }

      // 5. Practice Questions Validation
      lesson.sections.forEach((sec) => {
        if (sec.type === "practice") {
          sec.questions.forEach((q: PracticeQuestion, qIdx: number) => {
            totalQuestions++;
            const qLoc = `${lessonLoc} -> Practice Question #${qIdx + 1} (${q.id})`;

            if (seenQuestionIds.has(q.id)) {
              errors.push({
                type: "duplicate-id",
                location: qLoc,
                message: `Duplicate question ID "${q.id}".`,
              });
            }
            seenQuestionIds.add(q.id);

            if (q.type === "multiple-choice" && q.options && q.correctIndex !== undefined) {
              if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
                errors.push({
                  type: "invalid-reference",
                  location: qLoc,
                  message: `correctIndex ${q.correctIndex} is out of bounds for options length (${q.options.length}).`,
                });
              }
            }
          });
        }
      });
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      modulesCount: modules.length,
      lessonsCount: seenLessonIds.size,
      questionsCount: totalQuestions,
      conceptsCount: activeTaughtConcepts.size,
    },
  };
}
