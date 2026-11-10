// Pyodide Web Worker with granular download progress reporting

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
      } catch (cacheErr) {
        // ignore
      }
      console.warn("Cache API matching/writing failed, falling back to network:", err);
    }
  }
  return originalFetch(input, init);
};

let pyodide: any = null;
let sessionId = "";

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

      // Attempt local bundled assets first (offline native APK & local serving)
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
      
      // Override input
      pyodide.globals.set("js_input_fn", (promptText: string) => {
        if (promptText) {
          self.postMessage({ type: "STDOUT", text: promptText });
        }
        self.postMessage({ type: "INPUT_REQUEST" });
        
        // Sync XHR to wait for input
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/pyodide/wait-input?sessionId=${sessionId}`, false);
        try {
          xhr.send(null);
          const response = xhr.responseText;
          return response;
        } catch (e) {
          return "";
        }
      });
      
      self.postMessage({
        type: "PROGRESS",
        progress: 100,
        stage: "Python Engine Ready!",
      });

      self.postMessage({ type: "READY" });
    } catch (e: any) {
      self.postMessage({ type: "ERROR", error: e.message });
    }
  } else if (data.type === "RUN") {
    if (!pyodide) {
      self.postMessage({ type: "ERROR", error: "Pyodide not initialized" });
      return;
    }
    const code = data.code;
    const wrappedCode = `
import sys
import builtins
import traceback

def _custom_input(prompt=""):
    p_str = str(prompt) if prompt is not None else ""
    val = js_input_fn(p_str)
    if val is None:
        val = ""
    val_str = str(val)
    if val_str.endswith("\\n"):
        val_str = val_str[:-1]
    return val_str

builtins.input = _custom_input

try:
${code.split("\n").map((line: string) => "    " + line).join("\n")}
    pass
except Exception as e:
    traceback.print_exc()
`;
    try {
      await pyodide.runPythonAsync(wrappedCode);
      self.postMessage({ type: "DONE" });
    } catch (e: any) {
      self.postMessage({ type: "ERROR", error: e.message });
    }
  }
};
