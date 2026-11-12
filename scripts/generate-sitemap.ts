import fs from "fs";
import path from "path";
import { PREMADE_GAMES } from "../src/data/premadeGames";

/**
 * TypeScript Sitemap Generator Script for MilkyPy
 * Run: npx tsx scripts/generate-sitemap.ts
 */

const DOMAIN = "https://milkypy.com";
const OUT_PATH = path.resolve(process.cwd(), "public/sitemap.xml");
const TODAY = new Date().toISOString().split("T")[0];

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function run() {
  const curriculumJsonPath = path.resolve(process.cwd(), "src/data/curriculum/curriculum.json");
  let lessons: { id: string; title: string; moduleTitle: string }[] = [];

  if (fs.existsSync(curriculumJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(curriculumJsonPath, "utf-8"));
      if (Array.isArray(data.modules)) {
        for (const mod of data.modules) {
          if (Array.isArray(mod.lessons)) {
            for (const l of mod.lessons) {
              lessons.push({
                id: l.id,
                title: l.title,
                moduleTitle: mod.title,
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not read curriculum.json:", e);
    }
  }

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

  // Home & Main Modes
  urls.push({ loc: `${DOMAIN}/`, lastmod: TODAY, changefreq: "daily", priority: "1.0" });
  urls.push({ loc: `${DOMAIN}/?mode=study`, lastmod: TODAY, changefreq: "daily", priority: "0.9" });
  urls.push({ loc: `${DOMAIN}/?mode=playground`, lastmod: TODAY, changefreq: "weekly", priority: "0.9" });
  urls.push({ loc: `${DOMAIN}/?mode=games`, lastmod: TODAY, changefreq: "weekly", priority: "0.9" });

  // Individual Lessons
  for (const lesson of lessons) {
    urls.push({
      loc: `${DOMAIN}/?mode=study&lesson=${encodeURIComponent(lesson.id)}`,
      lastmod: TODAY,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  // Individual Games
  for (const game of PREMADE_GAMES) {
    urls.push({
      loc: `${DOMAIN}/?mode=games&game=${encodeURIComponent(game.id)}`,
      lastmod: TODAY,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    ),
    "</urlset>\n",
  ].join("\n");

  fs.writeFileSync(OUT_PATH, xml, "utf-8");
  console.log(`✅ Generated sitemap at ${OUT_PATH} with ${urls.length} indexable URLs.`);
}

run();
