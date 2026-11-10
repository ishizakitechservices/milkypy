process.env.DISABLE_HMR = "true";
import "dotenv/config";

import express from "express";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";


const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Persistent JSON Storage Path
const DB_FILE = path.join(process.cwd(), "user_cloud_db.json");

interface StoredUser {
  userId: string;
  passwordHash: string;
  createdAt: number;
}

interface StoredCloudFile {
  id: string;
  userId: string;
  name: string;
  code: string;
  updatedAt: number;
}

export interface StoredSharedSnippet {
  id: string;
  code: string;
  title: string;
  author: string;
  createdAt: number;
}

interface DBData {
  users: Record<string, StoredUser>;
  files: Record<string, StoredCloudFile[]>;
  sharedSnippets?: Record<string, StoredSharedSnippet>;
}

// Load or Initialize DB
const loadDB = (): DBData => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to read DB file, initializing fresh store:", e);
  }
  return { users: {}, files: {} };
};

const saveDB = (data: DBData) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write DB file:", e);
  }
};

let db = loadDB();

// Initialize Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
const firebaseApp = initializeApp({
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
});
const firestore = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);


function cleanAndParseJson(text: string): any {
  let clean = text.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\n?/i, "");
    clean = clean.replace(/\n?```$/, "");
  }
  return JSON.parse(clean.trim());
}

// Smart In-Memory Cache for $0.00 zero-cost repeated queries
interface AICacheEntry {
  data: any;
  timestamp: number;
}
const aiResponseCache = new Map<string, AICacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

function getCacheKey(type: string, prompt: string, extra?: string): string {
  const normalized = `${type}:${prompt.trim().replace(/\s+/g, " ")}:${(extra || "").trim()}`;
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return `${type}_${Math.abs(hash)}`;
}

// DeepSeek Direct API Caller (Lowest-Cost LLM Model)
async function callDeepSeekDirect(options: {
  systemInstruction?: string;
  prompt: string;
  messages?: Array<{ role: "user" | "assistant"; text: string }>;
  responseType?: "json" | "text";
  maxTokens?: number;
  apiKey?: string;
}): Promise<any> {
  const apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) {
    throw new Error("No DeepSeek API key provided or found in DEEPSEEK_API_KEY.");
  }

  const formattedMessages: Array<{ role: string; content: string }> = [];
  if (options.systemInstruction) {
    formattedMessages.push({ role: "system", content: options.systemInstruction });
  }
  if (options.messages && options.messages.length > 0) {
    for (const m of options.messages) {
      formattedMessages.push({ role: m.role, content: m.text });
    }
  }
  if (options.prompt) {
    formattedMessages.push({ role: "user", content: options.prompt });
  }

  if (formattedMessages.length === 0) {
    formattedMessages.push({ role: "user", content: "Hello" });
  }

  // DeepSeek-V3 ultra-low cost model (~$0.14/1M input tokens)
  const payload: any = {
    model: "deepseek-chat",
    messages: formattedMessages,
    temperature: 0.2,
    max_tokens: Math.min(options.maxTokens || 500, 1000),
  };

  if (options.responseType === "json") {
    payload.response_format = { type: "json_object" };
  }

  const resp = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`DeepSeek API returned error ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || "";

  if (options.responseType === "json") {
    return cleanAndParseJson(content);
  }
  return { text: content };
}

// Pure Full DeepSeek AI Engine (100% DeepSeek, No Gemini)
async function callDeepSeekAi(options: {
  cacheKeyPrefix: string;
  systemInstruction?: string;
  prompt: string;
  messages?: Array<{ role: "user" | "assistant"; text: string }>;
  responseType?: "json" | "text";
  maxTokens?: number;
  apiKey?: string;
  fallbackGenerator?: () => any;
}): Promise<any> {
  // 1. Check Smart In-Memory Cache (Instant $0.00 cost)
  const fullText = options.prompt + (options.messages ? options.messages.map(m => m.text).join("|") : "");
  const cacheKey = getCacheKey(options.cacheKeyPrefix, fullText);
  const cached = aiResponseCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { ...cached.data, _fromCache: true, _engine: "deepseek" };
  }

  // 2. Pure DeepSeek Direct API
  try {
    const result = await callDeepSeekDirect({
      systemInstruction: options.systemInstruction,
      prompt: options.prompt,
      messages: options.messages,
      responseType: options.responseType,
      maxTokens: options.maxTokens,
      apiKey: options.apiKey,
    });

    aiResponseCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return { ...result, _engine: "deepseek" };
  } catch (deepseekError: any) {
    console.error("[DeepSeek AI Error]:", deepseekError.message);

    // 3. Fallback generator if provided
    if (options.fallbackGenerator) {
      return options.fallbackGenerator();
    }
    throw deepseekError;
  }
}

// Pyodide Sync Input store
const pendingInputs = new Map<string, (text: string) => void>();

app.get("/api/pyodide/wait-input", (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) return res.status(400).send("");
  
  const timeout = setTimeout(() => {
    pendingInputs.delete(sessionId);
    res.send("");
  }, 300000);

  pendingInputs.set(sessionId, (text: string) => {
    clearTimeout(timeout);
    res.send(text);
  });
});

app.post("/api/pyodide/submit-input", express.json(), (req, res) => {
  const { sessionId, input } = req.body;
  const resolver = pendingInputs.get(sessionId);
  if (resolver) {
    pendingInputs.delete(sessionId);
    resolver(input);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Session not waiting" });
  }
});

// Instant Native Server Python Execution Endpoint (Zero-Latency Fallback & Hybrid Runner)
app.post("/api/py/run", (req, res) => {
  try {
    const { code, input } = req.body;
    if (typeof code !== "string") {
      res.status(400).json({ error: "Code string is required" });
      return;
    }

    const startTime = Date.now();
    let stdout = "";
    let stderr = "";
    let finished = false;

    // Execute with python3 unbuffered (-u)
    const pyProcess = spawn("python3", ["-u", "-c", code], {
      timeout: 10000,
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });

    const timeoutTimer = setTimeout(() => {
      if (!finished) {
        finished = true;
        pyProcess.kill("SIGKILL");
        res.json({
          stdout,
          stderr: stderr ? `${stderr}\nExecution timed out (10s limit).` : "Execution timed out (10s limit).",
          executionTimeMs: Date.now() - startTime,
          isError: true,
        });
      }
    }, 10000);

    if (typeof input === "string" && input.length > 0) {
      pyProcess.stdin.write(input.endsWith("\n") ? input : input + "\n");
      pyProcess.stdin.end();
    } else {
      pyProcess.stdin.end();
    }

    pyProcess.stdout.on("data", (data) => {
      stdout += data.toString();
      if (stdout.length > 500000) {
        pyProcess.kill("SIGKILL");
      }
    });

    pyProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    pyProcess.on("close", (exitCode) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutTimer);
      const executionTimeMs = Date.now() - startTime;
      res.json({
        stdout,
        stderr,
        executionTimeMs,
        isError: exitCode !== 0 || !!stderr.trim().length,
      });
    });

    pyProcess.on("error", (err) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutTimer);
      res.json({
        stdout,
        stderr: "Native execution error: " + err.message,
        executionTimeMs: Date.now() - startTime,
        isError: true,
      });
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Execution failed" });
  }
});

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// User Auth Endpoint (Support simple user IDs like m162, k234, m2, l23)
app.post("/api/auth/login", (req, res) => {
  try {
    const rawUserId = (req.body.userId || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!rawUserId) {
      res.status(400).json({ error: "User ID is required (e.g. m162, k234, l23)." });
      return;
    }

    if (!password) {
      res.status(400).json({ error: "Password is required." });
      return;
    }

    // Check if user exists
    let user = db.users[rawUserId];

    if (!user) {
      // Auto-register new student user ID if valid
      user = {
        userId: rawUserId,
        passwordHash: password,
        createdAt: Date.now(),
      };
      db.users[rawUserId] = user;
      db.files[rawUserId] = [
        {
          id: `file-${rawUserId}-1`,
          userId: rawUserId,
          name: "main.py",
          code: `# Write your Python code here\n`,
          updatedAt: Date.now(),
        },
      ];
      saveDB(db);
    } else {
      // Verify password
      if (user.passwordHash !== password) {
        res.status(401).json({ error: "Incorrect password for user " + rawUserId });
        return;
      }
    }

    const userFiles = db.files[rawUserId] || [];
    res.json({
      success: true,
      userId: rawUserId,
      files: userFiles,
      message: `Welcome back, ${rawUserId}!`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Authentication failed" });
  }
});

// Fetch user cloud files
app.get("/api/user/files/:userId", async (req, res) => {
  try {
    const userId = (req.params.userId || "").trim().toLowerCase();
    const q = query(collection(firestore, "files"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const files = snapshot.docs.map(doc => doc.data() as StoredCloudFile);
    res.json({ success: true, userId, files });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch cloud files" });
  }
});

// Save user cloud file
app.post("/api/user/files/save", async (req, res) => {
  try {
    const userId = (req.body.userId || "").trim().toLowerCase();
    let fileId = req.body.fileId;
    const name = (req.body.name || "untitled.py").trim();
    const code = req.body.code ?? "";

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    // Check if name exists
    const q = query(collection(firestore, "files"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const existingFiles = snapshot.docs.map(d => d.data() as StoredCloudFile);
    
    const existingFile = existingFiles.find(f => f.id === fileId || f.name.toLowerCase() === name.toLowerCase());
    if (existingFile) {
      fileId = existingFile.id;
    } else if (!fileId) {
      fileId = `file-${userId}-${Date.now()}`;
    }

    const updatedFile: StoredCloudFile = {
      id: fileId,
      userId,
      name,
      code,
      updatedAt: Date.now(),
    };

    await setDoc(doc(firestore, "files", fileId), updatedFile);

    const newSnapshot = await getDocs(q);
    const files = newSnapshot.docs.map(d => d.data() as StoredCloudFile);

    res.json({
      success: true,
      file: updatedFile,
      files,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save cloud file" });
  }
});

// Delete user cloud file
app.post("/api/user/files/delete", async (req, res) => {
  try {
    const userId = (req.body.userId || "").trim().toLowerCase();
    const fileId = req.body.fileId;

    if (!userId || !fileId) {
      res.status(400).json({ error: "User ID and File ID required" });
      return;
    }

    await deleteDoc(doc(firestore, "files", fileId));

    const q = query(collection(firestore, "files"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const files = snapshot.docs.map(d => d.data() as StoredCloudFile);

    res.json({ success: true, files });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete cloud file" });
  }
});

// Share code snippet permanently via Firebase
app.post("/api/snippets/share", async (req, res) => {
  try {
    const code = (req.body.code || "").toString();
    const title = (req.body.title || "Shared Python Script").toString().trim();
    const author = (req.body.author || "MilkyPy Student").toString().trim();

    if (!code.trim()) {
      res.status(400).json({ error: "Code cannot be empty to share" });
      return;
    }

    const snippetId = `snip-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const snippetData: StoredSharedSnippet = {
      id: snippetId,
      code,
      title,
      author,
      createdAt: Date.now(),
    };

    // Save to Firestore permanent shared_snippets collection
    try {
      await setDoc(doc(firestore, "shared_snippets", snippetId), snippetData);
    } catch (fsErr) {
      console.warn("Firestore save warning, falling back to local store:", fsErr);
    }

    // Save to local backup store
    const db = loadDB();
    if (!db.sharedSnippets) db.sharedSnippets = {};
    db.sharedSnippets[snippetId] = snippetData;
    saveDB(db);

    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "localhost:3000";
    const shareUrl = `${proto}://${host}/?snippet=${snippetId}`;

    res.json({
      success: true,
      snippetId,
      shareUrl,
      snippet: snippetData,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate share link" });
  }
});

// Fetch shared snippet by unique ID
app.get("/api/snippets/:id", async (req, res) => {
  try {
    const snippetId = (req.params.id || "").trim();
    if (!snippetId) {
      res.status(400).json({ error: "Snippet ID is required" });
      return;
    }

    // 1. Try Firestore first
    try {
      const snap = await getDoc(doc(firestore, "shared_snippets", snippetId));
      if (snap.exists()) {
        res.json({ success: true, snippet: snap.data() });
        return;
      }
    } catch (fsErr) {
      console.warn("Firestore snippet read fallback:", fsErr);
    }

    // 2. Fallback to local DB store
    const db = loadDB();
    const localSnippet = db.sharedSnippets?.[snippetId];
    if (localSnippet) {
      res.json({ success: true, snippet: localSnippet });
      return;
    }

    res.status(404).json({ error: "Shared Python snippet not found" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to load shared snippet" });
  }
});

// Groq Endpoint: Debug & Fix Code
app.post("/api/ai/debug", async (req, res) => {
  try {
    const { code, errorMessage } = req.body;
    if (!code) {
      res.status(400).json({ error: "Code is required" });
      return;
    }

    const prompt = `You are a friendly, expert Python tutor for beginner and intermediate learners.
Analyze this Python code and the execution error (if any):

PYTHON CODE:
\`\`\`python
${code}
\`\`\`

ERROR / ISSUE REPORTED:
${errorMessage || "No explicit error, but code might have logical or runtime bugs."}

Instructions:
1. Provide a fixed, working version of the Python code.
2. Explain what caused the issue in simple, clear terms.
3. List 2-3 key takeaways or tips for the student.

Respond ONLY in valid JSON matching this structure:
{
  "fixedCode": "string (the full corrected python code)",
  "explanation": "string (clear summary of the bug and how it was fixed)",
  "bugType": "string (e.g. IndentationError, TypeError, SyntaxError, LogicError)",
  "tips": ["string", "string"]
}`;

    const parsed = await callDeepSeekAi({
      cacheKeyPrefix: "debug",
      prompt,
      responseType: "json",
      maxTokens: 500,
    });

    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("AI Debug Error (DeepSeek):", error);
    res.status(500).json({ error: error.message || "Failed to process AI debugging request with DeepSeek." });
  }
});

// DeepSeek Endpoint: Add Guided Comments
app.post("/api/ai/add-comments", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ error: "Code is required" });
      return;
    }

    const prompt = `You are a Python programming guide. Your goal is to add concise, educational, step-by-step inline Python comments (# comments) to the following code so that a student can easily understand how every part works.

PYTHON CODE:
\`\`\`python
${code}
\`\`\`

Instructions:
- Preserve all existing functionality and structure.
- Insert clear, informative comments above or beside key code lines.
- Keep comments friendly and educational.

Respond ONLY in valid JSON with format:
{
  "commentedCode": "string (the full python code with added educational comments)",
  "summary": "string (brief sentence describing what this code achieves)"
}`;

    const parsed = await callDeepSeekAi({
      cacheKeyPrefix: "comment",
      prompt,
      responseType: "json",
      maxTokens: 500,
    });

    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("AI Comment Error (DeepSeek):", error);
    res.status(500).json({ error: error.message || "Failed to generate comments with DeepSeek." });
  }
});

// DeepSeek Endpoint: Explain Code
app.post("/api/ai/explain", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ error: "Code is required" });
      return;
    }

    const prompt = `Explain the following Python code step-by-step for a beginner learner:

\`\`\`python
${code}
\`\`\`

Provide:
1. High-level summary of what the code does.
2. Step-by-step execution walkthrough.
3. Important Python concepts used (e.g. loops, list comprehensions, f-strings).

Respond in JSON format:
{
  "summary": "string",
  "steps": ["string", "string"],
  "concepts": ["string", "string"]
}`;

    const parsed = await callDeepSeekAi({
      cacheKeyPrefix: "explain",
      prompt,
      responseType: "json",
      maxTokens: 400,
    });

    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("AI Explain Error (DeepSeek):", error);
    res.status(500).json({ error: error.message || "Failed to explain code with DeepSeek." });
  }
});

// DeepSeek Endpoint: Progressive Lesson Hint
app.post("/api/ai/hint", async (req, res) => {
  try {
    const { lessonTitle, lessonDescription, currentCode, targetOutput } = req.body;

    const prompt = `A student is working on the lesson "${lessonTitle || "Python Exercise"}".
Lesson task: ${lessonDescription}
Expected output/goal: ${targetOutput || "Correct solution"}

Student's current code:
\`\`\`python
${currentCode || "# Empty"}
\`\`\`

Give a subtle, encouraging hint (2-3 sentences max) to help them take the next logical step without giving away the complete code directly.

Respond in JSON:
{
  "hint": "string (encouraging tip)",
  "conceptToReview": "string"
}`;

    const parsed = await callDeepSeekAi({
      cacheKeyPrefix: "hint",
      prompt,
      responseType: "json",
      maxTokens: 250,
    });

    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("AI Hint Error (DeepSeek):", error);
    res.status(500).json({ error: error.message || "Failed to generate hint with DeepSeek." });
  }
});

// DeepSeek Endpoint: Chat Tutor
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, code, lessonContext } = req.body;

    const systemInstruction = `You are a helpful Python programming tutor. 
The user is currently writing the following code:
\`\`\`python
${code}
\`\`\`
${lessonContext ? `They are currently working on this lesson: ${lessonContext.title} - ${lessonContext.description}` : ""}

Provide concise, encouraging, and educational responses. If you suggest code fixes, provide the complete updated code in a single \`\`\`python block.`;

    const result = await callDeepSeekAi({
      cacheKeyPrefix: "chat",
      systemInstruction,
      prompt: "",
      messages: (messages || []).map((m: any) => ({
        role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
        text: m.text || "",
      })),
      responseType: "text",
      maxTokens: 500,
    });

    res.json({ success: true, text: result.text });
  } catch (error: any) {
    console.error("AI Chat Error (DeepSeek):", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response with DeepSeek." });
  }
});

// DeepSeek Endpoint: Dynamic Randomized AI Quiz Generator
app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { lessonTitle, lessonConcept, difficulty } = req.body;

    const systemInstruction = `You are a Python curriculum specialist creating randomized, engaging quiz questions.
Generate a brand-new, unique multiple-choice question testing the specified Python concept.
Never use generic or repeated presets. Include code snippets where appropriate.

Format your output strictly as a JSON object with this exact shape:
{
  "question": "string (the question prompt)",
  "codeSnippet": "string (optional python code block, or empty string)",
  "options": ["string", "string", "string", "string"],
  "correctIndex": 0,
  "explanation": "string (clear explanation of why this answer is correct and why other choices are wrong)",
  "hint": "string (helpful hint to guide the student)"
}`;

    const prompt = `Create a dynamic Python quiz question for:
Topic: ${lessonTitle || "Python Fundamentals"}
Concept details: ${lessonConcept ? lessonConcept.slice(0, 500) : "Variables, types, control flow, functions, or data structures"}
Difficulty: ${difficulty || "intermediate"}`;

    const parsed = await callDeepSeekAi({
      cacheKeyPrefix: "quiz",
      systemInstruction,
      prompt,
      responseType: "json",
      maxTokens: 350,
    });

    if (parsed && parsed.question && Array.isArray(parsed.options) && typeof parsed.correctIndex === "number") {
      res.json({
        success: true,
        quiz: {
          id: `ai-quiz-${Date.now()}`,
          lessonId: req.body.lessonId || "custom",
          topicTitle: lessonTitle || "Python Practice",
          type: parsed.codeSnippet ? "predict-output" : "multiple-choice",
          question: parsed.question,
          codeSnippet: parsed.codeSnippet || undefined,
          options: parsed.options,
          correctIndex: parsed.correctIndex,
          explanation: parsed.explanation || "Correct answer.",
          hint: parsed.hint || "Review the lesson concepts.",
          difficulty: difficulty || "intermediate",
        },
      });
    } else {
      throw new Error("Invalid quiz JSON structure received from model");
    }
  } catch (error: any) {
    console.warn("AI Quiz generation error (DeepSeek):", error.message);
    res.status(500).json({ error: error.message || "Failed to generate AI quiz with DeepSeek" });
  }
});

// Vite & Static file setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    // Intercept /@vite/client to suppress benign WebSocket reconnect notice
    app.get("/@vite/client", async (req, res, next) => {
      try {
        const mod = await vite.transformRequest("/@vite/client");
        if (mod && mod.code) {
          const patched = mod.code
            .replace(
              'reject(new Error("WebSocket closed without opened."));',
              'resolve();'
            )
            .replace(
              'reject(new Error("WebSocket closed without opened."))',
              'resolve()'
            )
            .replace(
              /console\.error\(`\[vite\] failed to connect to websocket.*?\);/g,
              '/* suppressed */'
            );
          res.set({ "Content-Type": "application/javascript" });
          return res.send(patched);
        }
      } catch (err) {
        // Fallback to default vite middleware
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MilkPy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
