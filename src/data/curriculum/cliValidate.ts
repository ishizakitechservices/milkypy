import fs from "fs";
import path from "path";
import { CurriculumModule } from "./schema";
import { validateCurriculum } from "./validate";

async function runCLI() {
  const curriculumDir = path.join(process.cwd(), "src/data/curriculum");
  const modulesDir = path.join(curriculumDir, "modules");
  const fundamentalsPath = path.join(curriculumDir, "fundamentals.json");

  console.log("=================================================");
  console.log("   PySlide Lab: Curriculum Integrity Validator   ");
  console.log("=================================================\n");

  if (!fs.existsSync(modulesDir)) {
    console.error(`Error: Modules directory not found at ${modulesDir}`);
    process.exit(1);
  }

  let fundamentalIds: string[] = [];
  if (fs.existsSync(fundamentalsPath)) {
    try {
      const fundData = JSON.parse(fs.readFileSync(fundamentalsPath, "utf-8"));
      fundamentalIds = (fundData.fundamentalConcepts || []).map((c: any) => c.id);
      console.log(`Loaded ${fundamentalIds.length} foundational concepts from fundamentals.json.`);
    } catch (e: any) {
      console.warn(`Warning: Failed to read fundamentals.json: ${e.message}`);
    }
  }

  let modules: CurriculumModule[] = [];
  let sourceDescription = "";

  // 1. Check for single curriculum file in src/data/curriculum/
  const singleFileCandidates = fs
    .readdirSync(curriculumDir)
    .filter((f) => f.endsWith(".json") && !f.includes("fundamentals.json") && !f.startsWith("template-"));

  if (singleFileCandidates.length > 0) {
    const targetFile = singleFileCandidates.includes("curriculum.json")
      ? "curriculum.json"
      : singleFileCandidates[0];
    const fullPath = path.join(curriculumDir, targetFile);
    try {
      const raw = fs.readFileSync(fullPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.modules)) {
        modules = parsed.modules;
      } else if (Array.isArray(parsed)) {
        modules = parsed;
      } else if (parsed.id && Array.isArray(parsed.lessons)) {
        modules = [parsed];
      }
      sourceDescription = `Single file: ${targetFile}`;
      console.log(`📄 Found single curriculum file: ${targetFile} (containing ${modules.length} modules)`);
    } catch (err: any) {
      console.error(`❌ Failed to parse JSON in ${targetFile}: ${err.message}`);
      process.exit(1);
    }
  }

  // 2. If no single-file modules, check modules/ directory
  if (modules.length === 0 && fs.existsSync(modulesDir)) {
    const files = fs
      .readdirSync(modulesDir)
      .filter((f) => f.endsWith(".json"))
      .sort();

    if (files.length > 0) {
      sourceDescription = `Directory: src/data/curriculum/modules/ (${files.length} files)`;
      console.log(`📁 Found ${files.length} module files in ${modulesDir}`);
      for (const file of files) {
        const fullPath = path.join(modulesDir, file);
        try {
          const raw = fs.readFileSync(fullPath, "utf-8");
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.modules)) {
            modules.push(...parsed.modules);
          } else if (Array.isArray(parsed)) {
            modules.push(...parsed);
          } else {
            modules.push(parsed);
          }
        } catch (err: any) {
          console.error(`❌ Failed to parse JSON in ${file}: ${err.message}`);
          process.exit(1);
        }
      }
    }
  }

  if (modules.length === 0) {
    console.log("ℹ️ No curriculum files found yet.");
    console.log("👉 Option A (Single File): Create 'src/data/curriculum/curriculum.json'");
    console.log("   (See 'src/data/curriculum/template-single-file.json' for the format)");
    console.log("👉 Option B (Multi File): Place module files in 'src/data/curriculum/modules/'\n");
    process.exit(0);
  }

  // Sort modules by explicit order
  modules.sort((a, b) => (a.order || 0) - (b.order || 0));

  const result = validateCurriculum(modules, fundamentalIds);

  console.log("\n---------------- Validation Summary ----------------");
  console.log(`Modules Validated:   ${result.stats.modulesCount}`);
  console.log(`Lessons Validated:   ${result.stats.lessonsCount}`);
  console.log(`Practice Questions:  ${result.stats.questionsCount}`);
  console.log(`Active Concepts:     ${result.stats.conceptsCount}`);
  console.log("----------------------------------------------------\n");

  if (!result.valid) {
    console.error(`❌ Found ${result.errors.length} validation errors:\n`);
    result.errors.forEach((err, idx) => {
      console.error(`[${idx + 1}] [${err.type.toUpperCase()}] at ${err.location}`);
      console.error(`    ↳ ${err.message}\n`);
    });
    process.exit(1);
  } else {
    console.log("✅ All curriculum modules, lessons, and prerequisites are 100% valid!\n");
    process.exit(0);
  }
}

runCLI().catch((err) => {
  console.error("Validation CLI crashed:", err);
  process.exit(1);
});
