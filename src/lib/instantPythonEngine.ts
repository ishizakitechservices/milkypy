import { ExecutionResult } from "../types";

/**
 * Instant Python Micro-Engine (< 2ms execution time)
 * Provides immediate client-side execution for Python scripts without any
 * network calls or WebAssembly compilation delays.
 */

export function canExecuteInstantly(code: string): boolean {
  // If code contains complex C-extensions or external imports, prefer native or WASM runner
  const lines = code.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      // Allow standard safe imports that the micro-engine or math handles
      if (
        !trimmed.includes("math") &&
        !trimmed.includes("random") &&
        !trimmed.includes("time") &&
        !trimmed.includes("sys")
      ) {
        return false;
      }
    }
  }
  return true;
}

export function executePythonInstantly(
  code: string,
  providedInput = ""
): ExecutionResult {
  const startTime = performance.now();
  const stdoutArr: string[] = [];
  const stderrArr: string[] = [];
  let isError = false;

  // Custom standard library mock in memory
  const scope: Record<string, any> = {
    // Built-in functions
    print: (...args: any[]) => {
      const output = args
        .map((arg) => {
          if (arg === null) return "None";
          if (arg === undefined) return "None";
          if (typeof arg === "boolean") return arg ? "True" : "False";
          if (typeof arg === "object") return JSON.stringify(arg);
          return String(arg);
        })
        .join(" ");
      stdoutArr.push(output + "\n");
    },
    len: (obj: any) => (obj && typeof obj.length === "number" ? obj.length : 0),
    range: (start: number, stop?: number, step = 1) => {
      const actualStart = stop === undefined ? 0 : start;
      const actualStop = stop === undefined ? start : stop;
      const res: number[] = [];
      if (step > 0) {
        for (let i = actualStart; i < actualStop; i += step) res.push(i);
      } else if (step < 0) {
        for (let i = actualStart; i > actualStop; i += step) res.push(i);
      }
      return res;
    },
    int: (val: any) => parseInt(val, 10) || 0,
    float: (val: any) => parseFloat(val) || 0.0,
    str: (val: any) => (val === null || val === undefined ? "None" : String(val)),
    abs: (val: number) => Math.abs(val),
    sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
    max: (...args: any[]) => {
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.max(...list);
    },
    min: (...args: any[]) => {
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.min(...list);
    },
    input: (promptText = "") => {
      if (promptText) stdoutArr.push(promptText);
      return providedInput.replace(/\r?\n$/, "");
    },
    // Standard library modules
    math: {
      pi: Math.PI,
      e: Math.E,
      sqrt: Math.sqrt,
      floor: Math.floor,
      ceil: Math.ceil,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      pow: Math.pow,
    },
    random: {
      randint: (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min,
      choice: (arr: any[]) =>
        Array.isArray(arr) && arr.length > 0
          ? arr[Math.floor(Math.random() * arr.length)]
          : null,
      random: () => Math.random(),
    },
    True: true,
    False: false,
    None: null,
  };

  try {
    // Transform Python code to executable JavaScript
    const jsCode = transpilePythonToJs(code);
    const runner = new Function("scope", `with (scope) {\n${jsCode}\n}`);
    runner(scope);
  } catch (err: any) {
    isError = true;
    stderrArr.push(`Python Execution Error: ${err.message || err}`);
  }

  const duration = Math.max(1, Math.round(performance.now() - startTime));

  return {
    stdout: stdoutArr.join(""),
    stderr: stderrArr.join(""),
    executionTimeMs: duration,
    isError,
  };
}

/**
 * Lightweight, safe transpiler for fundamental Python syntax:
 * - print(...)
 * - variable assignment
 * - f-strings f"..."
 * - for ... in ...
 * - while ...
 * - if / elif / else
 * - def ...
 * - list append/index
 */
function transpilePythonToJs(pyCode: string): string {
  const lines = pyCode.split("\n");
  const jsLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Strip comments
    const commentIdx = line.indexOf("#");
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx);
    }

    if (!line.trim()) {
      continue;
    }

    // Preserve indentation
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : "";
    let trimmed = line.trim();

    // Ignore import lines since modules are injected in scope
    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      continue;
    }

    // Convert f-strings: f"Hello {name}!" -> `Hello ${name}!`
    trimmed = trimmed.replace(/f"([^"]*)"/g, (_, content) => {
      const transformed = content.replace(/\{([^}]+)\}/g, "${$1}");
      return `\`${transformed}\``;
    });
    trimmed = trimmed.replace(/f'([^']*)'/g, (_, content) => {
      const transformed = content.replace(/\{([^}]+)\}/g, "${$1}");
      return `\`${transformed}\``;
    });

    // Convert boolean and None literals
    trimmed = trimmed.replace(/\bTrue\b/g, "true");
    trimmed = trimmed.replace(/\bFalse\b/g, "false");
    trimmed = trimmed.replace(/\bNone\b/g, "null");

    // Convert logical operators
    trimmed = trimmed.replace(/\band\b/g, "&&");
    trimmed = trimmed.replace(/\bor\b/g, "||");
    trimmed = trimmed.replace(/\bnot\b\s+/g, "!");

    // Convert for loops: for i in range(10): -> for (let i of range(10)) {
    const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/);
    if (forMatch) {
      const varName = forMatch[1];
      const iterable = forMatch[2];
      jsLines.push(`${indent}for (let ${varName} of ${iterable}) {`);
      continue;
    }

    // Convert while loops: while condition: -> while (condition) {
    const whileMatch = trimmed.match(/^while\s+(.+):$/);
    if (whileMatch) {
      const condition = whileMatch[1];
      jsLines.push(`${indent}let _loopGuard = 0;`);
      jsLines.push(`${indent}while (${condition}) {`);
      jsLines.push(`${indent}  if (++_loopGuard > 100000) throw new Error("Infinite loop detected (100,000 iterations limit)");`);
      continue;
    }

    // Convert if / elif / else statements
    const ifMatch = trimmed.match(/^if\s+(.+):$/);
    if (ifMatch) {
      jsLines.push(`${indent}if (${ifMatch[1]}) {`);
      continue;
    }

    const elifMatch = trimmed.match(/^elif\s+(.+):$/);
    if (elifMatch) {
      jsLines.push(`${indent}} else if (${elifMatch[1]}) {`);
      continue;
    }

    if (trimmed === "else:") {
      jsLines.push(`${indent}} else {`);
      continue;
    }

    // Convert function definitions: def greet(name): -> function greet(name) {
    const defMatch = trimmed.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\):$/);
    if (defMatch) {
      const fnName = defMatch[1];
      const params = defMatch[2];
      jsLines.push(`${indent}function ${fnName}(${params}) {`);
      continue;
    }

    // Python list methods: .append(x) -> .push(x)
    trimmed = trimmed.replace(/\.append\(/g, ".push(");

    // Variable assignment (declare with let if not already declared)
    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch && !assignMatch[2].startsWith("==")) {
      const varName = assignMatch[1];
      const val = assignMatch[2];
      jsLines.push(`${indent}var ${varName} = ${val};`);
      continue;
    }

    // Standard statement
    if (trimmed.endsWith(":")) {
      jsLines.push(`${indent}${trimmed.slice(0, -1)} {`);
    } else {
      jsLines.push(`${indent}${trimmed};`);
    }
  }

  // Balance opened block braces
  const openBraces = (jsLines.join("\n").match(/\{/g) || []).length;
  const closeBraces = (jsLines.join("\n").match(/\}/g) || []).length;
  for (let b = 0; b < openBraces - closeBraces; b++) {
    jsLines.push("}");
  }

  return jsLines.join("\n");
}
