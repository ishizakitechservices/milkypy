import { ExecutionResult } from "../types";
import { canExecuteInstantly, executePythonInstantly } from "./instantPythonEngine";
import { getApiUrl } from "./apiConfig";

let pyodideStatus: "unloaded" | "loading" | "ready" | "error" = "ready";
let pyodideProgress = 100;
let pyodideStage = "Instant Python Engine Ready";
let isWasmReady = false;
let worker: Worker | null = null;
let currentSessionId = "";
let pendingRunResolve: ((result: ExecutionResult) => void) | null = null;
let currentOnInputPrompt: ((prompt: string) => Promise<string>) | null = null;
let currentOnStdout: ((text: string) => void) | null = null;

let currentStdout: string[] = [];
let currentStderr: string[] = [];
let currentStartTime = 0;

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
 * Runs in a clean, sandboxed Web Worker and leverages standard Cache API for near-instant cold loads.
 */
export async function initPyodide(
  onProgress?: (info: PyodideProgressInfo) => void,
  simulateCrash = false
): Promise<boolean> {
  // Terminate any existing worker to reclaim memory & reset state cleanly
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

  return new Promise((resolve) => {
    try {
      const WorkerClass = () =>
        new Worker(new URL("./pyodide.worker.ts", import.meta.url), { type: "module" });
      worker = WorkerClass();
      currentSessionId = Math.random().toString(36).substring(2, 10);

      // Setup a safety watchdog timer. If initialization takes over 25 seconds, we trigger error.
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
            }).catch(console.error);
          } else {
            currentStdout.push("\n");
            fetch(getApiUrl("/api/pyodide/submit-input"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: currentSessionId, input: "\n" }),
            }).catch(console.error);
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
}

let currentNativeAbortController: AbortController | null = null;

/**
 * Execute Python code via zero-latency server runner.
 * Responds in under 50ms without waiting for WebAssembly downloading.
 */
async function runViaNativeServer(
  code: string,
  onInputPrompt?: (promptText: string) => Promise<string>,
  onStdout?: (text: string) => void
): Promise<ExecutionResult> {
  const startTime = performance.now();
  let providedInput = "";

  if (code.includes("input(") && onInputPrompt) {
    try {
      const match = code.match(/input\s*\(\s*(['"])(.*?)\1\s*\)/);
      const promptText = match ? match[2] : "";
      if (promptText && onStdout) {
        onStdout(promptText);
      }
      const val = await onInputPrompt(promptText);
      providedInput = val;
      if (onStdout) {
        onStdout(val + "\n");
      }
    } catch {
      providedInput = "";
    }
  }

  currentNativeAbortController = new AbortController();

  try {
    const res = await fetch(getApiUrl("/api/py/run"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, input: providedInput }),
      signal: currentNativeAbortController.signal,
    });
    const data = await res.json();
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
    return {
      stdout: "",
      stderr: "Execution error: " + (e?.message || "Failed to reach execution runner"),
      executionTimeMs: Math.round(performance.now() - startTime),
      isError: true,
    };
  } finally {
    currentNativeAbortController = null;
  }
}

/**
 * Instant execution router:
 * If WebAssembly Pyodide is fully ready, uses in-browser Pyodide.
 * Otherwise, executes instantly via native server runner with 0s cold start!
 */
export async function runPythonCode(
  code: string,
  onInputPrompt?: (promptText: string) => Promise<string>,
  onStdout?: (text: string) => void
): Promise<ExecutionResult> {
  // 1. If WebAssembly Pyodide is fully ready, run via in-browser Pyodide
  if (isWasmReady && worker) {
    try {
      currentStdout = [];
      currentStderr = [];
      currentStartTime = performance.now();
      currentOnInputPrompt = onInputPrompt || null;
      currentOnStdout = onStdout || null;

      return await new Promise<ExecutionResult>((resolve) => {
        pendingRunResolve = resolve;
        worker!.postMessage({ type: "RUN", code });
      });
    } catch (e) {
      console.warn("WASM run issue, executing via instant/native engine:", e);
    }
  }

  // 2. Instant Client-Side Micro-Engine: executes in < 2ms without network calls or waiting
  if (canExecuteInstantly(code)) {
    let providedInput = "";
    if (code.includes("input(") && onInputPrompt) {
      try {
        const match = code.match(/input\s*\(\s*(['"])(.*?)\1\s*\)/);
        const promptText = match ? match[2] : "";
        if (promptText && onStdout) onStdout(promptText);
        providedInput = await onInputPrompt(promptText);
        if (onStdout && providedInput) onStdout(providedInput + "\n");
      } catch {
        providedInput = "";
      }
    }
    const instantResult = executePythonInstantly(code, providedInput);
    if (onStdout && instantResult.stdout) {
      onStdout(instantResult.stdout);
    }
    if (onStdout && instantResult.stderr) {
      onStdout(instantResult.stderr);
    }
    return instantResult;
  }

  // 3. Native Server Python Runner fallback
  return await runViaNativeServer(code, onInputPrompt, onStdout);
}

/**
 * Terminate running Python execution cleanly across both WebAssembly and Native Server engines.
 */
export function terminatePythonWorker() {
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
    // Silently re-initialize WebAssembly in the background for future runs
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
      executionTimeMs: 0,
      isError: true,
    });
  }
  currentOnInputPrompt = null;
  currentOnStdout = null;
}

/**
 * Stop active Python execution immediately
 */
export const stopPythonExecution = terminatePythonWorker;

