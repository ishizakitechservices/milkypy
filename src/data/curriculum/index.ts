import {
  CurriculumModule,
  CurriculumLesson,
  CurriculumMetadata,
} from "./schema";
import fundamentalsJson from "./fundamentals.json";
import { validateCurriculum, ValidationResult } from "./validate";

// Metadata for PySlide Lab Curriculum Package
export const CURRICULUM_METADATA: CurriculumMetadata = {
  id: "pyslide-python-core",
  title: "PySlide Lab: Complete Python Mastery",
  version: "2.0.0",
  description:
    "A structured, zero-to-advanced Python engineering curriculum featuring interactive WASM execution, deep theory, and university syllabus alignment.",
  author: "PySlide Lab Curriculum Team",
  totalEstimatedHours: 40,
};

// Eagerly import all curriculum files:
// 1. Single file: ./curriculum.json or any *.json in root of curriculum (excluding fundamentals/templates)
// 2. Or separate module files in ./modules/*.json
const rootJsonFiles = import.meta.glob("./*.json", { eager: true }) as Record<string, any>;
const moduleFiles = import.meta.glob("./modules/*.json", { eager: true }) as Record<string, any>;

let cachedModules: CurriculumModule[] | null = null;
let cachedValidationResult: ValidationResult | null = null;

function extractModulesFromData(raw: any): CurriculumModule[] {
  const data = raw?.default || raw;
  if (!data) return [];

  // Case 1: Package object with .modules array { metadata?: ..., modules: [...] }
  if (Array.isArray(data.modules)) {
    if (data.title) {
      CURRICULUM_METADATA.title = data.title;
    } else if (data.metadata?.title) {
      CURRICULUM_METADATA.title = data.metadata.title;
    }

    if (data.description) {
      CURRICULUM_METADATA.description = data.description;
    } else if (data.metadata?.description) {
      CURRICULUM_METADATA.description = data.metadata.description;
    }

    if (data.curriculumId) {
      CURRICULUM_METADATA.id = data.curriculumId;
    } else if (data.metadata?.id) {
      CURRICULUM_METADATA.id = data.metadata.id;
    }

    return data.modules.filter((m: any) => m && m.id && Array.isArray(m.lessons));
  }

  // Case 2: Direct array of modules [ { id, title, order, lessons: [...] }, ... ]
  if (Array.isArray(data)) {
    return data.filter((m: any) => m && m.id && Array.isArray(m.lessons));
  }

  // Case 3: Single module object { id, title, order, lessons: [...] }
  if (data.id && Array.isArray(data.lessons)) {
    return [data];
  }

  return [];
}

export function getCurriculumModules(): CurriculumModule[] {
  if (cachedModules) {
    return cachedModules;
  }

  const loaded: CurriculumModule[] = [];

  // 1. Check for single-file curriculum in src/data/curriculum/ (e.g. curriculum.json)
  for (const path in rootJsonFiles) {
    if (
      path.includes("fundamentals.json") ||
      path.includes("template-") ||
      path.includes("firebase")
    ) {
      continue;
    }
    const extracted = extractModulesFromData(rootJsonFiles[path]);
    if (extracted.length > 0) {
      loaded.push(...extracted);
    }
  }

  // 2. If no single-file modules were found in root, check ./modules/*.json
  if (loaded.length === 0) {
    for (const path in moduleFiles) {
      const extracted = extractModulesFromData(moduleFiles[path]);
      if (extracted.length > 0) {
        loaded.push(...extracted);
      }
    }
  }

  // Deduplicate and sort modules strictly by explicit order
  const uniqueModulesMap = new Map<string, CurriculumModule>();
  for (const mod of loaded) {
    if (!uniqueModulesMap.has(mod.id)) {
      uniqueModulesMap.set(mod.id, mod);
    }
  }
  const result = Array.from(uniqueModulesMap.values());
  result.sort((a, b) => (a.order || 0) - (b.order || 0));

  cachedModules = result;
  return result;
}

export function getCurriculumValidation(): ValidationResult {
  if (cachedValidationResult) {
    return cachedValidationResult;
  }
  const modules = getCurriculumModules();
  const fundamentalIds = (fundamentalsJson.fundamentalConcepts || []).map((c: any) => c.id);
  cachedValidationResult = validateCurriculum(modules, fundamentalIds);
  return cachedValidationResult;
}

export function getFoundationalConcepts() {
  return fundamentalsJson.fundamentalConcepts || [];
}

export function getAllLessons(): { lesson: CurriculumLesson; module: CurriculumModule }[] {
  const modules = getCurriculumModules();
  const all: { lesson: CurriculumLesson; module: CurriculumModule }[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      all.push({ lesson, module: mod });
    }
  }
  return all;
}

export function getLessonById(
  lessonId: string
): { lesson: CurriculumLesson; module: CurriculumModule } | null {
  const modules = getCurriculumModules();
  for (const mod of modules) {
    const found = mod.lessons.find((l) => l.id === lessonId);
    if (found) {
      return { lesson: found, module: mod };
    }
  }
  return null;
}

export function getModuleById(moduleId: string): CurriculumModule | null {
  const modules = getCurriculumModules();
  return modules.find((m) => m.id === moduleId) || null;
}

export function getNextLesson(
  lessonId: string
): { lesson: CurriculumLesson; module: CurriculumModule } | null {
  const all = getAllLessons();
  const idx = all.findIndex((item) => item.lesson.id === lessonId);
  if (idx >= 0 && idx < all.length - 1) {
    return all[idx + 1];
  }
  return null;
}

export function getPrevLesson(
  lessonId: string
): { lesson: CurriculumLesson; module: CurriculumModule } | null {
  const all = getAllLessons();
  const idx = all.findIndex((item) => item.lesson.id === lessonId);
  if (idx > 0) {
    return all[idx - 1];
  }
  return null;
}
