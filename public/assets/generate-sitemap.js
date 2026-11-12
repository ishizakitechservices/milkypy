#!/usr/bin/env node

/**
 * MilkyPy Sitemap Generator Script
 * --------------------------------
 * Automatically discovers all core platform views, curriculum modules,
 * individual Python lessons, and arcade games to generate a standards-compliant
 * sitemap.xml for search engine indexing (Google, Bing, DuckDuckGo, etc.).
 *
 * Location: public/assets/generate-sitemap.js
 * Usage: node public/assets/generate-sitemap.js [--domain https://milkypy.com] [--out public/sitemap.xml]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Defaults
const DEFAULT_DOMAIN = "https://milkypy.com";
const DEFAULT_OUT_PATH = path.resolve(__dirname, "../sitemap.xml");
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// Command line argument parser
const args = process.argv.slice(2);
let domain = DEFAULT_DOMAIN;
let outPath = DEFAULT_OUT_PATH;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--domain" && args[i + 1]) {
    domain = args[i + 1].replace(/\/+$/, "");
    i++;
  } else if (args[i] === "--out" && args[i + 1]) {
    outPath = path.resolve(process.cwd(), args[i + 1]);
    i++;
  }
}

/**
 * Escapes characters for XML conformance
 */
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Loads all curriculum lessons from curriculum.json or module files
 */
function loadCurriculumLessons() {
  const rootDir = path.resolve(__dirname, "../..");
  const curriculumJsonPath = path.join(rootDir, "src/data/curriculum/curriculum.json");
  const publicAssetJsonPath = path.join(__dirname, "aistudio/curriculum__1__99cdf36b.json");
  const modulesDir = path.join(rootDir, "src/data/curriculum/modules");

  let rawData = null;

  if (fs.existsSync(curriculumJsonPath)) {
    try {
      rawData = JSON.parse(fs.readFileSync(curriculumJsonPath, "utf-8"));
    } catch (e) {
      console.warn("Failed reading src/data/curriculum/curriculum.json:", e.message);
    }
  }

  if (!rawData && fs.existsSync(publicAssetJsonPath)) {
    try {
      rawData = JSON.parse(fs.readFileSync(publicAssetJsonPath, "utf-8"));
    } catch (e) {
      console.warn("Failed reading asset curriculum JSON:", e.message);
    }
  }

  const lessons = [];

  if (rawData && Array.isArray(rawData.modules)) {
    for (const mod of rawData.modules) {
      if (Array.isArray(mod.lessons)) {
        for (const lesson of mod.lessons) {
          lessons.push({
            id: lesson.id,
            title: lesson.title,
            moduleTitle: mod.title,
          });
        }
      }
    }
  } else if (fs.existsSync(modulesDir)) {
    const files = fs.readdirSync(modulesDir).filter((f) => f.endsWith(".json"));
    for (const f of files) {
      try {
        const mod = JSON.parse(fs.readFileSync(path.join(modulesDir, f), "utf-8"));
        if (Array.isArray(mod.lessons)) {
          for (const lesson of mod.lessons) {
            lessons.push({
              id: lesson.id,
              title: lesson.title,
              moduleTitle: mod.title,
            });
          }
        }
      } catch (e) {}
    }
  }

  return lessons;
}

/**
 * Loads premade games from premadeGames.ts or falls back to known game IDs
 */
function loadGames() {
  const rootDir = path.resolve(__dirname, "../..");
  const gamesPath = path.join(rootDir, "src/data/premadeGames.ts");

  const defaultGames = [
    { id: "pacman-classic", title: "Pac-Man Maze Classic" },
    { id: "snake-ascii", title: "ChompSnake Classic" },
    { id: "tictactoe-ai", title: "Tic-Tac-Toe Minimax AI" },
    { id: "hangman", title: "Hangman Word Classic" },
  ];

  if (!fs.existsSync(gamesPath)) {
    return defaultGames;
  }

  try {
    const content = fs.readFileSync(gamesPath, "utf-8");
    const idMatches = content.match(/id:\s*["']([^"']+)["']/g);
    const titleMatches = content.match(/title:\s*["']([^"']+)["']/g);

    if (idMatches && idMatches.length > 0) {
      const games = [];
      for (let i = 0; i < idMatches.length; i++) {
        const id = idMatches[i].replace(/id:\s*["']/, "").replace(/["']/, "");
        const title = titleMatches && titleMatches[i]
          ? titleMatches[i].replace(/title:\s*["']/, "").replace(/["']/, "")
          : id;
        games.push({ id, title });
      }
      return games;
    }
  } catch (e) {
    console.warn("Could not parse premadeGames.ts, using defaults:", e.message);
  }

  return defaultGames;
}

/**
 * Main sitemap builder
 */
export function generateSitemap() {
  console.log("==================================================");
  console.log("       MilkyPy Platform Sitemap Generator         ");
  console.log("==================================================");
  console.log(`Target Domain:   ${domain}`);
  console.log(`Output Location: ${outPath}`);
  console.log(`Generation Date: ${TODAY}\n`);

  const urls = [];

  // 1. Primary Landing Page
  urls.push({
    loc: `${domain}/`,
    lastmod: TODAY,
    changefreq: "daily",
    priority: "1.0",
    description: "MilkyPy Home - Learn Python easily with interactive AI Tutor",
  });

  // 2. Core Platform Modes
  urls.push({
    loc: `${domain}/?mode=study`,
    lastmod: TODAY,
    changefreq: "daily",
    priority: "0.9",
    description: "MilkyPy Lessons - Structured step-by-step Python curriculum",
  });

  urls.push({
    loc: `${domain}/?mode=playground`,
    lastmod: TODAY,
    changefreq: "weekly",
    priority: "0.9",
    description: "MilkyPy Playground - In-browser WebAssembly Python IDE & compiler",
  });

  urls.push({
    loc: `${domain}/?mode=games`,
    lastmod: TODAY,
    changefreq: "weekly",
    priority: "0.9",
    description: "MilkyPy Arcade - Gamified Python games lab",
  });

  // 3. Curriculum Lessons
  const lessons = loadCurriculumLessons();
  console.log(`Discovered ${lessons.length} curriculum lessons.`);
  for (const lesson of lessons) {
    urls.push({
      loc: `${domain}/?mode=study&lesson=${encodeURIComponent(lesson.id)}`,
      lastmod: TODAY,
      changefreq: "monthly",
      priority: "0.8",
      description: `${lesson.moduleTitle || "Python Lesson"}: ${lesson.title}`,
    });
  }

  // 4. Arcade Games
  const games = loadGames();
  console.log(`Discovered ${games.length} arcade games.`);
  for (const game of games) {
    urls.push({
      loc: `${domain}/?mode=games&game=${encodeURIComponent(game.id)}`,
      lastmod: TODAY,
      changefreq: "monthly",
      priority: "0.7",
      description: `Python Arcade: ${game.title}`,
    });
  }

  // Construct XML
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const entry of urls) {
    xmlLines.push("  <url>");
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    xmlLines.push("  </url>");
  }

  xmlLines.push("</urlset>");
  xmlLines.push("");

  const sitemapXml = xmlLines.join("\n");

  // Ensure output directory exists
  const targetDir = path.dirname(outPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(outPath, sitemapXml, "utf-8");

  console.log(`\nSuccessfully generated sitemap.xml with ${urls.length} indexable URLs!`);
  console.log(`File saved to: ${outPath}\n`);
}

// Execute generator
if (process.argv[1] && process.argv[1].endsWith("generate-sitemap.js")) {
  try {
    generateSitemap();
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    process.exit(1);
  }
}
