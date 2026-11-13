// Pyodide Web Worker with granular download progress reporting & safe Python error handling

declare var self: any;

const CACHE_NAME = "pyodide-cdn-cache-v0.25.1";

// Override global fetch inside the worker to cache all CDN requests
const originalFetch = self.fetch;
self.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

  if (url.includes("cdn.jsdelivr.net/pyodide")) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = (await cache.match(url)) || (await cache.match(url, { ignoreSearch: true }));
      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await originalFetch(input, init);
      if (networkResponse && networkResponse.status === 200) {
        await cache.put(url, networkResponse.clone());
      }
      return networkResponse;
    } catch (err) {
      try {
        const fallbackMatch = await caches.match(url, { ignoreSearch: true });
        if (fallbackMatch) return fallbackMatch;
      } catch {
        // ignore
      }
      console.warn("Cache API matching/writing failed, falling back to network:", err);
    }
  }
  return originalFetch(input, init);
};

let pyodide: any = null;
let sessionId = "";
let preloadedInputs: string[] = [];

self.onmessage = async (event: MessageEvent) => {
  const data = event.data;

  if (data.type === "INIT") {
    sessionId = data.sessionId;
    try {
      if (data.simulateCrash) {
        self.postMessage({
          type: "PROGRESS",
          progress: 35,
          stage: "Downloading WebAssembly core (pyodide.asm.wasm)...",
        });
        setTimeout(() => {
          self.postMessage({
            type: "PROGRESS",
            progress: 75,
            stage: "CRITICAL ERROR: WASM compilation failed (out of memory)",
          });
          self.postMessage({
            type: "ERROR",
            error: "WebAssembly memory allocation exceeded. Runtime crashed at 75% initialization.",
            isCrashAt75: true,
          });
        }, 1500);
        return;
      }

      self.postMessage({
        type: "PROGRESS",
        progress: 40,
        stage: "Loading Python WebAssembly runtime...",
      });

      let loadPyodideFn: any = null;
      let effectiveIndexURL = "/pyodide/";

      try {
        const localPath = ["", "pyodide", "pyodide.mjs"].join("/");
        // @ts-ignore
        const localModule = await import(/* @vite-ignore */ localPath);
        if (localModule && localModule.loadPyodide) {
          loadPyodideFn = localModule.loadPyodide;
          effectiveIndexURL = "/pyodide/";
        }
      } catch (localErr) {
        console.warn("Local Pyodide bundle not loaded, trying CDN fallback:", localErr);
      }

      if (!loadPyodideFn) {
        effectiveIndexURL = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/";
        // @ts-ignore
        const cdnModule = await import("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs");
        loadPyodideFn = cdnModule.loadPyodide;
      }

      self.postMessage({
        type: "PROGRESS",
        progress: 80,
        stage: "Initializing Python runtime...",
      });

      pyodide = await loadPyodideFn({
        indexURL: effectiveIndexURL,
      });

      self.postMessage({
        type: "PROGRESS",
        progress: 95,
        stage: "Configuring IO channels & streams...",
      });

      pyodide.setStdout({
        batched: (str: string) => self.postMessage({ type: "STDOUT", text: str + "\n" }),
      });
      pyodide.setStderr({
        batched: (str: string) => self.postMessage({ type: "STDERR", text: str + "\n" }),
      });

      // Override input: consumes preloaded inputs first, then falls back to server wait-input
      pyodide.globals.set("js_input_fn", (promptText: string) => {
        if (promptText) {
          self.postMessage({ type: "STDOUT", text: promptText });
        }

        if (preloadedInputs.length > 0) {
          const val = preloadedInputs.shift() ?? "";
          self.postMessage({ type: "STDOUT", text: val + "\n" });
          return val;
        }

        self.postMessage({ type: "INPUT_REQUEST" });

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/pyodide/wait-input?sessionId=${encodeURIComponent(sessionId)}`, false);
        try {
          xhr.send(null);
          const contentType = xhr.getResponseHeader("content-type") || "";
          if (xhr.status !== 200 || contentType.includes("text/html")) {
            return "";
          }
          return xhr.responseText || "";
        } catch {
          return "";
        }
      });

      await pyodide.runPythonAsync(`
import builtins
def _milky_input(prompt=""):
    p_str = str(prompt) if prompt is not None else ""
    val = js_input_fn(p_str)
    if val is None:
        return ""
    val_str = str(val)
    if val_str.endswith("\\n"):
        val_str = val_str[:-1]
    return val_str

builtins.input = _milky_input
`);

      self.postMessage({
        type: "PROGRESS",
        progress: 100,
        stage: "Python Engine Ready!",
      });

      self.postMessage({ type: "READY" });
    } catch (e: any) {
      self.postMessage({ type: "ERROR", error: e?.message || "Failed to initialize Pyodide." });
    }
  } else if (data.type === "RUN") {
    if (!pyodide) {
      self.postMessage({
        type: "STDERR",
        text: "Python WebAssembly runtime is not initialized yet.",
      });
      self.postMessage({ type: "DONE" });
      return;
    }

    preloadedInputs = Array.isArray(data.preloadedInputs) ? [...data.preloadedInputs] : [];
    const code = String(data.code || "");

    try {
      await pyodide.runPythonAsync(code);
      self.postMessage({ type: "DONE" });
    } catch (e: any) {
      const msg = e?.message || String(e);
      self.postMessage({
        type: "STDERR",
        text: msg.endsWith("\n") ? msg : msg + "\n",
      });
      self.postMessage({ type: "DONE" });
    }
  }
};
