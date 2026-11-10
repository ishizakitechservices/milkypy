(function(){"use strict";const d="pyodide-cdn-cache-v0.25.1",l=self.fetch;self.fetch=async function(a,n){const s=typeof a=="string"?a:a instanceof URL?a.toString():a.url;if(s.includes("cdn.jsdelivr.net/pyodide"))try{const o=await caches.open(d),e=await o.match(s)||await o.match(s,{ignoreSearch:!0});if(e)return e;const r=await l(a,n);return r&&r.status===200&&await o.put(s,r.clone()),r}catch(o){try{const e=await caches.match(s,{ignoreSearch:!0});if(e)return e}catch{}console.warn("Cache API matching/writing failed, falling back to network:",o)}return l(a,n)};let c=null,p="";self.onmessage=async a=>{const n=a.data;if(n.type==="INIT"){p=n.sessionId;try{if(n.simulateCrash){self.postMessage({type:"PROGRESS",progress:35,stage:"Downloading WebAssembly core (pyodide.asm.wasm)..."}),setTimeout(()=>{self.postMessage({type:"PROGRESS",progress:75,stage:"CRITICAL ERROR: WASM compilation failed (out of memory)"}),self.postMessage({type:"ERROR",error:"WebAssembly memory allocation exceeded. Runtime crashed at 75% initialization.",isCrashAt75:!0})},1500);return}self.postMessage({type:"PROGRESS",progress:15,stage:"Connecting to Pyodide package repository..."});let s=20;const o=setInterval(()=>{if(s<75){s+=Math.floor(Math.random()*8)+4;let t="Downloading WebAssembly core (pyodide.asm.wasm)...";s>45&&(t="Downloading Python 3.11 standard packages (stdlib.zip)..."),self.postMessage({type:"PROGRESS",progress:Math.min(s,75),stage:t})}},400);let e=null,r="/pyodide/";try{const i=await import(["","pyodide","pyodide.mjs"].join("/"));i&&i.loadPyodide&&(e=i.loadPyodide,r="/pyodide/")}catch(t){console.warn("Local Pyodide bundle not loaded, trying CDN fallback:",t)}e||(r="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",e=(await import("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs")).loadPyodide),self.postMessage({type:"PROGRESS",progress:80,stage:"Unpacking Python runtime packages..."}),c=await e({indexURL:r}),clearInterval(o),self.postMessage({type:"PROGRESS",progress:95,stage:"Configuring IO channels & streams..."}),c.setStdout({batched:t=>self.postMessage({type:"STDOUT",text:t+`
`})}),c.setStderr({batched:t=>self.postMessage({type:"STDERR",text:t+`
`})}),c.globals.set("js_input_fn",t=>{t&&self.postMessage({type:"STDOUT",text:t}),self.postMessage({type:"INPUT_REQUEST"});const i=new XMLHttpRequest;i.open("GET",`/api/pyodide/wait-input?sessionId=${p}`,!1);try{return i.send(null),i.responseText}catch{return""}}),self.postMessage({type:"PROGRESS",progress:100,stage:"Python Engine Ready!"}),self.postMessage({type:"READY"})}catch(s){self.postMessage({type:"ERROR",error:s.message})}}else if(n.type==="RUN"){if(!c){self.postMessage({type:"ERROR",error:"Pyodide not initialized"});return}const o=`
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
${n.code.split(`
`).map(e=>"    "+e).join(`
`)}
    pass
except Exception as e:
    traceback.print_exc()
`;try{await c.runPythonAsync(o),self.postMessage({type:"DONE"})}catch(e){self.postMessage({type:"ERROR",error:e.message})}}}})();
