import { UserProgress } from "../types";
import { saveLocalSnippet, ensureDefaultLocalSnippets } from "./indexedDbStorage";

const LOCAL_STORAGE_KEY_PROGRESS = "milkypy_user_progress";
const LOCAL_STORAGE_KEY_PLAYGROUND = "milkypy_playground_code";
const LOCAL_STORAGE_KEY_THEME = "milkypy_theme";

// Initialize default local snippets in IndexedDB
if (typeof window !== "undefined") {
  ensureDefaultLocalSnippets().catch(() => {});
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.completedLessonIds) {
        parsed.completedLessonIds = [];
      }
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to load progress from cache:", e);
  }

  return {
    completedLessonIds: [],
    lastActiveLessonId: "lesson-1-1",
    totalXp: 0,
    streakDays: 1,
    savedPlaygroundCode: `# Start coding in Python\nprint('Hello World!')\n`,
  };
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.warn("Failed to save progress to cache:", e);
  }
}

export function savePlaygroundCode(code: string, fileName = "main.py"): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYGROUND, code);
  } catch (e) {
    console.warn("Failed to cache playground code:", e);
  }

  // Also persist to IndexedDB asynchronously for robust offline durability
  if (typeof window !== "undefined") {
    saveLocalSnippet({
      id: "local-playground",
      name: fileName,
      code,
      updatedAt: Date.now(),
      userId: "local",
      isLocalDraft: true,
      synced: false,
    }).catch((err) => console.warn("Failed to save to IndexedDB:", err));
  }
}

export function loadPlaygroundCode(): string | null {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY_PLAYGROUND);
  } catch (e) {
    return null;
  }
}

export function saveThemePreference(theme: "dark" | "light"): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
  } catch (e) {
    console.warn("Failed to save theme preference:", e);
  }
}

export function loadThemePreference(): "dark" | "light" {
  try {
    const val = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
    if (val === "light" || val === "dark") return val;
  } catch (e) {
    // fallback
  }
  return "dark"; // Default sleek IDE dark aesthetic
}
