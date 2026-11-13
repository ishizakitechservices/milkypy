import { ExecutionResult } from "../types";
import { canExecuteInstantly, executePythonInstantly } from "./instantPythonEngine";
import { getApiUrl } from "./apiConfig";

let pyodideStatus: "unloaded" | "loading" | "ready" | "error" = "ready";
let pyodideProgress = 100;
let pyodideStage = "Instant Python Engine Ready";
let isWasmReady = false;
let worker: Worker | null = null;
let initPromise: Promise<boolean> | null = null;
let currentSessionId = "";
let pendingRunResolve: ((result: ExecutionResult) => void) | null = null;
let currentOnInputPrompt: ((prompt: string) => Promise<string>) | null = null;
let currentOnStdout: ((text: string) => void) | null = null;
let currentInputCancel: (() => void) | null = null;

let currentStdout: string[] = [];
let currentStderr: string[] = [];
let currentStartTime = 0;

let cachedServerSupportsPyRun: boolean | null = null;

export interface PyodideProgressInfo {
  progress: number;
  stage: string;
  status: "unloaded" | "loading" | "ready" | "error";
}

export function getPyodideStatus() {
  return pyodideStatus;
}

export function getPyodideProgress() {
  return pyodideProgress;
}

export function getPyodideStage() {
  return pyodideStage;
}

export function isWebAssemblyReady() {
  return isWasmReady;
}

/**
 * Pre-warms and initializes the Python execution environment.
 * Runs in a clean, sandboxed Web Worker and leverages Cache API for fast loads.
 */
export async function initPyodide(
  onProgress?: (info: PyodideProgressInfo) => void,
  simulateCrash = false
): Promise<boolean> {
  if (worker) {
    try {
      worker.terminate();
    } catch (e) {
      console.warn("Failed to terminate old worker:", e);
    }
    worker = null;
  }

  isWasmReady = false;
  pyodideStatus = "loading";
  pyodideProgress = 10;
  pyodideStage = "Initializing worker sandbox...";

  if (onProgress) {
    onProgress({ progress: pyodideProgress, stage: pyodideStage, status: "loading" });
  }

  initPromise = new Promise((resolve) => {
    try {
      worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url), { type: "module" });
      currentSessionId = Math.random().toString(36).substring(2, 10);

      const watchdog = setTimeout(() => {
        if (pyodideStatus === "loading") {
          pyodideStatus = "error";
          pyodideStage = "Initialization timed out. Please click Reload.";
          if (onProgress) {
            onProgress({ progress: pyodideProgress, stage: pyodideStage, status: "error" });
          }
          resolve(false);
        }
      }, 25000);

      worker.onmessage = async (e) => {
        const data = e.data;
        if (data.type === "PROGRESS") {
          pyodideProgress = data.progress;
          pyodideStage = data.stage;
          if (onProgress) {
            onProgress({
              progress: pyodideProgress,
              stage: pyodideStage,
              status: "loading",
            });
          }
        } else if (data.type === "READY") {
          clearTimeout(watchdog);
          isWasmReady = true;
          pyodideStatus = "ready";
          pyodideProgress = 100;
          pyodideStage = "Python Engine Ready!";
          if (onProgress) {
            onProgress({
              progress: 100,
              stage: pyodideStage,
              status: "ready",
            });
          }
          resolve(true);
        } else if (data.type === "ERROR") {
          clearTimeout(watchdog);
          // If an execution was actively running, resolve it as a runtime error instead of hanging
          if (pendingRunResolve) {
            const resolveFn = pendingRunResolve;
            pendingRunResolve = null;
            currentOnInputPrompt = null;
            currentOnStdout = null;
            const errMsg = data.error || "Python runtime error";
            currentStderr.push(errMsg);
            resolveFn({
              stdout: currentStdout.join(""),
              stderr: currentStderr.join(""),
              executionTimeMs: Math.round(performance.now() - currentStartTime),
              isError: true,
            });
            return;
          }

          isWasmReady = false;
          pyodideStatus = "error";
          pyodideProgress = data.isCrashAt75 ? 75 : pyodideProgress;
          pyodideStage = data.error || "Failed to compile WebAssembly runtime";
          if (onProgress) {
            onProgress({
              progress: pyodideProgress,
              stage: pyodideStage,
              status: "error",
            });
          }
          resolve(false);
        } else if (data.type === "STDOUT") {
          currentStdout.push(data.text);
          if (currentOnStdout) currentOnStdout(data.text);
        } else if (data.type === "STDERR") {
          currentStderr.push(data.text);
          if (currentOnStdout) currentOnStdout(data.text);
        } else if (data.type === "INPUT_REQUEST") {
          if (currentOnInputPrompt) {
            const userInput = await currentOnInputPrompt("");
            const echoedInput = userInput + "\n";
            currentStdout.push(echoedInput);
            if (currentOnStdout) currentOnStdout(echoedInput);

            fetch(getApiUrl("/api/pyodide/submit-input"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: currentSessionId, input: echoedInput }),
            }).catch(() => {});
          } else {
            currentStdout.push("\n");
            fetch(getApiUrl("/api/pyodide/submit-input"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: currentSessionId, input: "\n" }),
            }).catch(() => {});
          }
        } else if (data.type === "DONE") {
          if (pendingRunResolve) {
            const endTime = performance.now();
            const result: ExecutionResult = {
              stdout: currentStdout.join(""),
              stderr: currentStderr.join(""),
              executionTimeMs: Math.round(endTime - currentStartTime),
              isError: !!currentStderr.length,
            };
            const resolveFn = pendingRunResolve;
            pendingRunResolve = null;
            currentOnInputPrompt = null;
            currentOnStdout = null;
            resolveFn(result);
          }
        }
      };

      worker.onerror = (err) => {
        clearTimeout(watchdog);
        if (pendingRunResolve) {
          const resolveFn = pendingRunResolve;
          pendingRunResolve = null;
          currentOnInputPrompt = null;
          currentOnStdout = null;
          resolveFn({
            stdout: currentStdout.join(""),
            stderr: err?.message || "Web Worker execution error",
            executionTimeMs: Math.round(performance.now() - currentStartTime),
            isError: true,
          });
        }
        resolve(false);
      };

      worker.postMessage({ type: "INIT", sessionId: currentSessionId, simulateCrash });
    } catch (err: any) {
      pyodideStatus = "error";
      pyodideStage = "Worker failure: " + (err.message || err);
      if (onProgress) {
        onProgress({ progress: 75, stage: pyodideStage, status: "error" });
      }
      resolve(false);
    }
  });

  return initPromise;
}

let currentNativeAbortController: AbortController | null = null;

async function checkHasPersistentBackend(): Promise<boolean> {
  if (cachedServerSupportsPyRun !== null) return cachedServerSupportsPyRun;
  try {
    const res = await fetch(getApiUrl("/api/health"));
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      cachedServerSupportsPyRun = false;
      return false;
    }
    const data = await res.json();
    cachedServerSupportsPyRun = data?.runtime === "node-express";
    return cachedServerSupportsPyRun;
  } catch {
    cachedServerSupportsPyRun = false;
    return false;
  }
}

async function promptForInputs(
  code: string,
  onInputPrompt?: (promptText: string) => Promise<string>,
  onStdout?: (text: string) => void
): Promise<{ cancelled: boolean; inputs: string[] }> {
  const inputs: string[] = [];
  if (!code.includes("input(") || !onInputPrompt) {
    return { cancelled: false, inputs };
  }

  // Count static input() occurrences or prompt for the first one cleanly
  const regex = /input\s*\(\s*(?:(['"])(.*?)\1)?\s*\)/g;
  const matches = [...code.matchAll(regex)];
  const count = Math.max(1, Math.min(matches.length, 5));

  for (let i = 0; i < count; i++) {
    const promptText = matches[i]?.[2] || "";
    if (promptText && onStdout) {
      onStdout(promptText);
    }
    let aborted = false;
    const val = await new Promise<string>((resolve) => {
      currentInputCancel = () => {
        aborted = true;
        resolve("");
      };
      onInputPrompt(promptText).then(resolve).catch(() => resolve(""));
    });
    currentInputCancel = null;
    if (aborted) {
      return { cancelled: true, inputs };
    }
    inputs.push(val);
    if (onStdout) {
      onStdout(val + "\n");
    }
  }

  return { cancelled: false, inputs };
}

/**
 * Execute Python code via server runner (Node.js only).
 */
async function runViaNativeServer(
  code: string,
  onInputPrompt?: (promptText: string) => Promise<string>,
  onStdout?: (text: string) => void
): Promise<ExecutionResult | { fallbackToWasm: true }> {
  const startTime = performance.now();
  const { cancelled, inputs } = await promptForInputs(code, onInputPrompt, onStdout);

  if (cancelled) {
    return {
      stdout: "",
      stderr: "\n[Execution stopped by user]",
      executionTimeMs: Math.round(performance.now() - startTime),
      isError: true,
    };
  }

  currentNativeAbortController = new AbortController();

  try {
    const res = await fetch(getApiUrl("/api/py/run"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, input: inputs.join("\n") }),
      signal: currentNativeAbortController.signal,
    });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return { fallbackToWasm: true };
    }
    const data = await res.json();
    if (data.browserWasmRequired) {
      cachedServerSupportsPyRun = false;
      return { fallbackToWasm: true };
    }
    if (onStdout && data.stdout) {
      onStdout(data.stdout);
    }
    if (onStdout && data.stderr) {
      onStdout(data.stderr);
    }
    return {
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      executionTimeMs: data.executionTimeMs || Math.round(performance.now() - startTime),
      isError: !!data.isError,
    };
  } catch (e: any) {
    if (e?.name === "AbortError" || currentNativeAbortController?.signal.aborted) {
      return {
        stdout: "",
        stderr: "\n[Execution stopped by user]",
        executionTimeMs: Math.round(performance.now() - startTime),
        isError: true,
      };
    }
    return { fallbackToWasm: true };
  } finally {
    currentNativeAbortController = null;
  }
}

async function runInPyodideWorker(
  code: string,
  onInputPrompt?: (promptText: string) => Promise<string>,
  onStdout?: (text: string) => void
): Promise<ExecutionResult> {
  const hasPersistentBackend = await checkHasPersistentBackend();
  let preloadedInputs: string[] = [];

  // On Cloudflare / static hosting where /api/pyodide/wait-input is stateless, pre-collect input() values cleanly
  if (!hasPersistentBackend && code.includes("input(") && onInputPrompt) {
    const promptRes = await promptForInputs(code, onInputPrompt);
    if (promptRes.cancelled) {
      return {
        stdout: "",
        stderr: "\n[Execution stopped by user]",
        executionTimeMs: 0,
        isError: true,
      };
    }
    preloadedInputs = promptRes.inputs;
  }

  currentStdout = [];
  currentStderr = [];
  currentStartTime = performance.now();
  currentOnInputPrompt = onInputPrompt || null;
  currentOnStdout = onStdout || null;

  return await new Promise<ExecutionResult>((resolve) => {
    pendingRunResolve = resolve;
    worker!.postMessage({ type: "RUN", code, preloadedInputs });
  });
}

/**
 * Execution router:
 * 1. Uses full Pyodide WebAssembly in-browser whenever ready.
 * 2. Uses Instant Client-Side Micro-Engine for safe beginner scripts while WASM boots.
 * 3. Uses Native Server runner or waits for Pyodide WASM when full Python features are required.
 */
export async function runPythonCode(
  code: string,
  onInputPrompt?: (promptText: string) => Promise<string>,
  onStdout?: (text: string) => void
): Promise<ExecutionResult> {
  // 1. If WebAssembly Pyodide is ready, run in real CPython via WebAssembly
  if (isWasmReady && worker) {
    try {
      return await runInPyodideWorker(code, onInputPrompt, onStdout);
    } catch (e) {
      console.warn("WASM run issue, falling back:", e);
    }
  }

  // 2. Instant Client-Side Micro-Engine for clean beginner scripts while WASM finishes warming up
  if (canExecuteInstantly(code)) {
    const { cancelled, inputs } = await promptForInputs(code, onInputPrompt, onStdout);
    if (cancelled) {
      return {
        stdout: "",
        stderr: "\n[Execution stopped by user]",
        executionTimeMs: 0,
        isError: true,
      };
    }
    const instantResult = executePythonInstantly(code, inputs[0] || "");
    if (!instantResult.isError) {
      if (onStdout && instantResult.stdout) onStdout(instantResult.stdout);
      return instantResult;
    }
    // If micro-engine hit an unsupported edge syntax error, fall through to full Python engine
  }

  // 3. Try native server Python runner (Node.js)
  const nativeRes = await runViaNativeServer(code, onInputPrompt, onStdout);
  if (!("fallbackToWasm" in nativeRes)) {
    return nativeRes;
  }

  // 4. Wait for Pyodide WASM initialization (critical on Cloudflare Pages when running imports/classes)
  if (onStdout) {
    onStdout("Loading Python runtime (WebAssembly)...\n");
  }
  const ready = initPromise ? await initPromise : await initPyodide();
  if (ready && worker) {
    return await runInPyodideWorker(code, onInputPrompt, onStdout);
  }

  return {
    stdout: "",
    stderr: "Python runtime failed to initialize. Check your internet connection and click Reload Engine.",
    executionTimeMs: 0,
    isError: true,
  };
}

/**
 * Terminate running Python execution cleanly across WebAssembly, Input prompts, and Native Server engines.
 */
export function terminatePythonWorker() {
  if (currentInputCancel) {
    try {
      currentInputCancel();
    } catch {}
    currentInputCancel = null;
  }

  if (currentNativeAbortController) {
    try {
      currentNativeAbortController.abort();
    } catch (e) {
      console.warn("Failed to abort native runner:", e);
    }
    currentNativeAbortController = null;
  }

  if (worker) {
    try {
      worker.terminate();
    } catch (e) {
      console.warn("Failed to terminate worker:", e);
    }
    worker = null;
    isWasmReady = false;
    setTimeout(() => {
      initPyodide().catch(() => {});
    }, 150);
  } else {
    isWasmReady = false;
  }

  if (pendingRunResolve) {
    const resolveFn = pendingRunResolve;
    pendingRunResolve = null;
    resolveFn({
      stdout: currentStdout.join(""),
      stderr: "\n[Execution stopped by user]",
      executionTimeMs: Math.round(performance.now() - currentStartTime),
      isError: true,
    });
  }
  currentOnInputPrompt = null;
  currentOnStdout = null;
}

export const stopPythonExecution = terminatePythonWorker;
