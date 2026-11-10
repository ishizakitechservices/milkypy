/**
 * IndexedDB Storage Engine for MilkyPy
 * 
 * Provides robust client-side persistence for:
 * 1. Local Python code snippets (accessible offline without internet or before cloud sync)
 * 2. Milky AI Chat conversation history
 * 3. Offline scratchpad & cache
 */

export interface LocalSnippet {
  id: string;
  name: string;
  code: string;
  updatedAt: number;
  userId: string;
  isLocalDraft?: boolean;
  synced?: boolean;
  tags?: string[];
}

export interface AiChatMessage {
  role: "user" | "model";
  text: string;
  timestamp?: number;
}

export interface AiChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: AiChatMessage[];
  codeSnippet?: string;
}

const DB_NAME = "MilkyPy_OfflineDB";
const DB_VERSION = 1;

const STORE_SNIPPETS = "local_snippets";
const STORE_AI_CHAT = "ai_chat_history";

let dbInstance: IDBDatabase | null = null;

export async function openIndexedDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this browser environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Local Snippets Store
      if (!db.objectStoreNames.contains(STORE_SNIPPETS)) {
        const snippetStore = db.createObjectStore(STORE_SNIPPETS, { keyPath: "id" });
        snippetStore.createIndex("userId", "userId", { unique: false });
        snippetStore.createIndex("updatedAt", "updatedAt", { unique: false });
        snippetStore.createIndex("name", "name", { unique: false });
      }

      // 2. AI Chat History Store
      if (!db.objectStoreNames.contains(STORE_AI_CHAT)) {
        const chatStore = db.createObjectStore(STORE_AI_CHAT, { keyPath: "id" });
        chatStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      console.error("Failed to open IndexedDB:", request.error);
      reject(request.error);
    };
  });
}

// --------------------------------------------------------------------------
// Local Code Snippets (Offline Access)
// --------------------------------------------------------------------------

/**
 * Save or update a local code snippet in IndexedDB
 */
export async function saveLocalSnippet(snippet: LocalSnippet): Promise<void> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SNIPPETS], "readwrite");
    const store = transaction.objectStore(STORE_SNIPPETS);
    const request = store.put({
      ...snippet,
      updatedAt: snippet.updatedAt || Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all local snippets, optionally filtered by userId
 */
export async function getLocalSnippets(userId?: string | null): Promise<LocalSnippet[]> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SNIPPETS], "readonly");
    const store = transaction.objectStore(STORE_SNIPPETS);
    const request = store.getAll();

    request.onsuccess = () => {
      let results: LocalSnippet[] = request.result || [];
      if (userId) {
        results = results.filter((s) => s.userId === userId || s.userId === "local");
      }
      // Sort newest first
      results.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      resolve(results);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Get a single local snippet by ID
 */
export async function getLocalSnippetById(id: string): Promise<LocalSnippet | null> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SNIPPETS], "readonly");
    const store = transaction.objectStore(STORE_SNIPPETS);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a local snippet by ID
 */
export async function deleteLocalSnippet(id: string): Promise<void> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SNIPPETS], "readwrite");
    const store = transaction.objectStore(STORE_SNIPPETS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// --------------------------------------------------------------------------
// Milky AI Chat History (IndexedDB Persistence)
// --------------------------------------------------------------------------

/**
 * Save an entire AI chat session
 */
export async function saveAiChatSession(session: AiChatSession): Promise<void> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_AI_CHAT], "readwrite");
    const store = transaction.objectStore(STORE_AI_CHAT);
    const request = store.put({
      ...session,
      timestamp: session.timestamp || Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all AI chat history sessions sorted newest first
 */
export async function getAiChatSessions(): Promise<AiChatSession[]> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_AI_CHAT], "readonly");
    const store = transaction.objectStore(STORE_AI_CHAT);
    const request = store.getAll();

    request.onsuccess = () => {
      const results: AiChatSession[] = request.result || [];
      results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      resolve(results);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete an AI chat session by ID
 */
export async function deleteAiChatSession(id: string): Promise<void> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_AI_CHAT], "readwrite");
    const store = transaction.objectStore(STORE_AI_CHAT);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all AI chat sessions
 */
export async function clearAllAiChatSessions(): Promise<void> {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_AI_CHAT], "readwrite");
    const store = transaction.objectStore(STORE_AI_CHAT);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// --------------------------------------------------------------------------
// Offline Initial Seed Helper
// --------------------------------------------------------------------------
export async function ensureDefaultLocalSnippets(): Promise<void> {
  try {
    const existing = await getLocalSnippets();
    if (existing.length === 0) {
      const defaultSnippet: LocalSnippet = {
        id: "local-main",
        name: "main.py",
        code: `# Welcome to Milky AI Tutor!\n# This file is cached locally in your browser via IndexedDB for offline access.\n\ndef greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("Pythonista"))\nfor i in range(1, 6):\n    print(f"Counting: {i}")\n`,
        updatedAt: Date.now(),
        userId: "local",
        isLocalDraft: true,
        synced: false,
      };
      await saveLocalSnippet(defaultSnippet);
    }
  } catch (err) {
    console.warn("Could not seed default local snippet in IndexedDB:", err);
  }
}
