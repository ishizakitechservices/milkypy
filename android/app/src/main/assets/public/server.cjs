var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_child_process = require("child_process");
var import_vite = require("vite");
var import_groq_sdk = __toESM(require("groq-sdk"), 1);
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "5mb" }));
var DB_FILE = import_path.default.join(process.cwd(), "user_cloud_db.json");
var loadDB = () => {
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to read DB file, initializing fresh store:", e);
  }
  return { users: {}, files: {} };
};
var saveDB = (data) => {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write DB file:", e);
  }
};
var db = loadDB();
var firebaseConfig = JSON.parse(import_fs.default.readFileSync(import_path.default.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
var firebaseApp = (0, import_app.initializeApp)({
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain
});
var firestore = (0, import_firestore.getFirestore)(firebaseApp, firebaseConfig.firestoreDatabaseId);
var getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured. Please set GROQ_API_KEY in your secrets.");
  }
  return new import_groq_sdk.default({ apiKey });
};
function cleanAndParseJson(text) {
  let clean = text.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\n?/i, "");
    clean = clean.replace(/\n?```$/, "");
  }
  return JSON.parse(clean.trim());
}
var cachedGroqModel = null;
async function getAvailableGroqModel(groq) {
  if (process.env.GROQ_MODEL) {
    return process.env.GROQ_MODEL;
  }
  if (cachedGroqModel) {
    return cachedGroqModel;
  }
  try {
    const listRes = await groq.models.list();
    const availableIds = listRes.data.map((m) => m.id);
    const preferredOrder = [
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "llama-3.3-70b-versatile",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "llama3-70b-8192",
      "llama3-8b-8192",
      "mixtral-8x7b-32768"
    ];
    for (const pref of preferredOrder) {
      if (availableIds.includes(pref)) {
        cachedGroqModel = pref;
        console.log(`[Groq] Selected model from account: ${cachedGroqModel}`);
        return cachedGroqModel;
      }
    }
    const genericChatModel = availableIds.find(
      (id) => !id.includes("whisper") && !id.includes("guard") && !id.includes("orpheus")
    );
    if (genericChatModel) {
      cachedGroqModel = genericChatModel;
      console.log(`[Groq] Fallback to available chat model: ${cachedGroqModel}`);
      return cachedGroqModel;
    }
  } catch (err) {
    console.warn("[Groq] Unable to list models from API, using default qwen/qwen3.8-27b:", err.message);
  }
  cachedGroqModel = "qwen/qwen3.8-27b";
  return cachedGroqModel;
}
async function callGroqAi(options) {
  const groq = getGroqClient();
  let model = await getAvailableGroqModel(groq);
  const apiMessages = [];
  if (options.systemInstruction) {
    apiMessages.push({ role: "system", content: options.systemInstruction });
  }
  if (options.messages && options.messages.length > 0) {
    for (const m of options.messages) {
      apiMessages.push({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text
      });
    }
  }
  if (options.prompt) {
    apiMessages.push({ role: "user", content: options.prompt });
  }
  let completion;
  try {
    completion = await groq.chat.completions.create({
      model,
      messages: apiMessages,
      temperature: 0.2,
      ...options.responseType === "json" ? { response_format: { type: "json_object" } } : {}
    });
  } catch (err) {
    if (err?.status === 404 || err?.message?.includes("model_not_found") || err?.message?.includes("does not exist")) {
      console.warn(`[Groq] Model ${model} not available, retrying with alternative model...`);
      cachedGroqModel = null;
      const alternativeModel = model === "qwen/qwen3.8-27b" ? "openai/gpt-oss-120b" : "qwen/qwen3.8-27b";
      completion = await groq.chat.completions.create({
        model: alternativeModel,
        messages: apiMessages,
        temperature: 0.2,
        ...options.responseType === "json" ? { response_format: { type: "json_object" } } : {}
      });
      cachedGroqModel = alternativeModel;
    } else {
      throw err;
    }
  }
  const content = completion.choices[0]?.message?.content || "";
  if (options.responseType === "json") {
    try {
      return cleanAndParseJson(content);
    } catch (e) {
      console.warn("Groq returned invalid JSON, content:", content, e);
      throw new Error("Groq returned an invalid JSON response structure.");
    }
  }
  return { text: content };
}
var pendingInputs = /* @__PURE__ */ new Map();
app.get("/api/pyodide/wait-input", (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId) return res.status(400).send("");
  const timeout = setTimeout(() => {
    pendingInputs.delete(sessionId);
    res.send("");
  }, 3e5);
  pendingInputs.set(sessionId, (text) => {
    clearTimeout(timeout);
    res.send(text);
  });
});
app.post("/api/pyodide/submit-input", import_express.default.json(), (req, res) => {
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
    const pyProcess = (0, import_child_process.spawn)("python3", ["-u", "-c", code], {
      timeout: 1e4,
      env: { ...process.env, PYTHONUNBUFFERED: "1" }
    });
    const timeoutTimer = setTimeout(() => {
      if (!finished) {
        finished = true;
        pyProcess.kill("SIGKILL");
        res.json({
          stdout,
          stderr: stderr ? `${stderr}
Execution timed out (10s limit).` : "Execution timed out (10s limit).",
          executionTimeMs: Date.now() - startTime,
          isError: true
        });
      }
    }, 1e4);
    if (typeof input === "string" && input.length > 0) {
      pyProcess.stdin.write(input.endsWith("\n") ? input : input + "\n");
      pyProcess.stdin.end();
    } else {
      pyProcess.stdin.end();
    }
    pyProcess.stdout.on("data", (data) => {
      stdout += data.toString();
      if (stdout.length > 5e5) {
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
        isError: exitCode !== 0 || !!stderr.trim().length
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
        isError: true
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Execution failed" });
  }
});
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});
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
    let user = db.users[rawUserId];
    if (!user) {
      user = {
        userId: rawUserId,
        passwordHash: password,
        createdAt: Date.now()
      };
      db.users[rawUserId] = user;
      db.files[rawUserId] = [
        {
          id: `file-${rawUserId}-1`,
          userId: rawUserId,
          name: "main.py",
          code: `# Write your Python code here
`,
          updatedAt: Date.now()
        }
      ];
      saveDB(db);
    } else {
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
      message: `Welcome back, ${rawUserId}!`
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Authentication failed" });
  }
});
app.get("/api/user/files/:userId", async (req, res) => {
  try {
    const userId = (req.params.userId || "").trim().toLowerCase();
    const q = (0, import_firestore.query)((0, import_firestore.collection)(firestore, "files"), (0, import_firestore.where)("userId", "==", userId));
    const snapshot = await (0, import_firestore.getDocs)(q);
    const files = snapshot.docs.map((doc2) => doc2.data());
    res.json({ success: true, userId, files });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch cloud files" });
  }
});
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
    const q = (0, import_firestore.query)((0, import_firestore.collection)(firestore, "files"), (0, import_firestore.where)("userId", "==", userId));
    const snapshot = await (0, import_firestore.getDocs)(q);
    const existingFiles = snapshot.docs.map((d) => d.data());
    const existingFile = existingFiles.find((f) => f.id === fileId || f.name.toLowerCase() === name.toLowerCase());
    if (existingFile) {
      fileId = existingFile.id;
    } else if (!fileId) {
      fileId = `file-${userId}-${Date.now()}`;
    }
    const updatedFile = {
      id: fileId,
      userId,
      name,
      code,
      updatedAt: Date.now()
    };
    await (0, import_firestore.setDoc)((0, import_firestore.doc)(firestore, "files", fileId), updatedFile);
    const newSnapshot = await (0, import_firestore.getDocs)(q);
    const files = newSnapshot.docs.map((d) => d.data());
    res.json({
      success: true,
      file: updatedFile,
      files
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save cloud file" });
  }
});
app.post("/api/user/files/delete", async (req, res) => {
  try {
    const userId = (req.body.userId || "").trim().toLowerCase();
    const fileId = req.body.fileId;
    if (!userId || !fileId) {
      res.status(400).json({ error: "User ID and File ID required" });
      return;
    }
    await (0, import_firestore.deleteDoc)((0, import_firestore.doc)(firestore, "files", fileId));
    const q = (0, import_firestore.query)((0, import_firestore.collection)(firestore, "files"), (0, import_firestore.where)("userId", "==", userId));
    const snapshot = await (0, import_firestore.getDocs)(q);
    const files = snapshot.docs.map((d) => d.data());
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete cloud file" });
  }
});
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
    const snippetData = {
      id: snippetId,
      code,
      title,
      author,
      createdAt: Date.now()
    };
    try {
      await (0, import_firestore.setDoc)((0, import_firestore.doc)(firestore, "shared_snippets", snippetId), snippetData);
    } catch (fsErr) {
      console.warn("Firestore save warning, falling back to local store:", fsErr);
    }
    const db2 = loadDB();
    if (!db2.sharedSnippets) db2.sharedSnippets = {};
    db2.sharedSnippets[snippetId] = snippetData;
    saveDB(db2);
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const shareUrl = `${proto}://${host}/?snippet=${snippetId}`;
    res.json({
      success: true,
      snippetId,
      shareUrl,
      snippet: snippetData
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate share link" });
  }
});
app.get("/api/snippets/:id", async (req, res) => {
  try {
    const snippetId = (req.params.id || "").trim();
    if (!snippetId) {
      res.status(400).json({ error: "Snippet ID is required" });
      return;
    }
    try {
      const snap = await (0, import_firestore.getDoc)((0, import_firestore.doc)(firestore, "shared_snippets", snippetId));
      if (snap.exists()) {
        res.json({ success: true, snippet: snap.data() });
        return;
      }
    } catch (fsErr) {
      console.warn("Firestore snippet read fallback:", fsErr);
    }
    const db2 = loadDB();
    const localSnippet = db2.sharedSnippets?.[snippetId];
    if (localSnippet) {
      res.json({ success: true, snippet: localSnippet });
      return;
    }
    res.status(404).json({ error: "Shared Python snippet not found" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to load shared snippet" });
  }
});
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
    const parsed = await callGroqAi({
      prompt,
      responseType: "json"
    });
    res.json({ success: true, ...parsed });
  } catch (error) {
    console.error("AI Debug Error (Groq):", error);
    res.status(500).json({ error: error.message || "Failed to process AI debugging request with Groq." });
  }
});
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
    const parsed = await callGroqAi({
      prompt,
      responseType: "json"
    });
    res.json({ success: true, ...parsed });
  } catch (error) {
    console.error("AI Comment Error (Groq):", error);
    res.status(500).json({ error: error.message || "Failed to generate comments with Groq." });
  }
});
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
    const parsed = await callGroqAi({
      prompt,
      responseType: "json"
    });
    res.json({ success: true, ...parsed });
  } catch (error) {
    console.error("AI Explain Error (Groq):", error);
    res.status(500).json({ error: error.message || "Failed to explain code with Groq." });
  }
});
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
    const parsed = await callGroqAi({
      prompt,
      responseType: "json"
    });
    res.json({ success: true, ...parsed });
  } catch (error) {
    console.error("AI Hint Error (Groq):", error);
    res.status(500).json({ error: error.message || "Failed to generate hint with Groq." });
  }
});
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
    const result = await callGroqAi({
      systemInstruction,
      prompt: "",
      messages: (messages || []).map((m) => ({
        role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
        text: m.text || ""
      })),
      responseType: "text"
    });
    res.json({ success: true, text: result.text });
  } catch (error) {
    console.error("AI Chat Error (Groq):", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response with Groq." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MilkPy server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
