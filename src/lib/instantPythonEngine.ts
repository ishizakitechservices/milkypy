import { ExecutionResult } from "../types";

/**
 * Instant Python Micro-Engine (< 2ms execution time)
 * Handles clean, fundamental Python scripts without network or WASM startup delay.
 * Advanced syntax (classes, try/except, comprehensions, slices, etc.) automatically
 * routes to full Pyodide WebAssembly / CPython.
 */

export function canExecuteInstantly(code: string): boolean {
  const advancedPatterns = [
    /\bclass\s+[a-zA-Z_]/,
    /\btry\s*:/,
    /\bexcept\b/,
    /\bfinally\s*:/,
    /\bwith\s+/,
    /\blambda\b/,
    /\byield\b/,
    /\basync\s+def\b/,
    /\bawait\b/,
    /\bglobal\b/,
    /\bnonlocal\b/,
    /"""|'''/,
    /@\w+/,
    /\[[^\]]*\bfor\b[^\]]*\bin\b[^\]]*\]/,
    /\[[^:\]]*:[^:\]]*\]/,
  ];

  for (const pat of advancedPatterns) {
    if (pat.test(code)) return false;
  }

  const lines = code.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      if (
        !trimmed.includes("math") &&
        !trimmed.includes("random") &&
        !trimmed.includes("time")
      ) {
        return false;
      }
    }
    // Tuple unpacking like `a, b = 1, 2`
    if (/^[a-zA-Z_]\w*\s*,\s*[a-zA-Z_]\w*\s*=/.test(trimmed)) {
      return false;
    }
  }
  return true;
}

function stripCommentOutsideStrings(line: string): string {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (ch === "#" && !inSingle && !inDouble) {
      return line.slice(0, i);
    }
  }
  return line;
}

export function executePythonInstantly(
  code: string,
  providedInput = ""
): ExecutionResult {
  const startTime = performance.now();
  const stdoutArr: string[] = [];
  const stderrArr: string[] = [];
  let isError = false;

  const formatPyVal = (arg: any): string => {
    if (arg === null || arg === undefined) return "None";
    if (typeof arg === "boolean") return arg ? "True" : "False";
    if (Array.isArray(arg)) return "[" + arg.map((item) => (typeof item === "string" ? `'${item}'` : formatPyVal(item))).join(", ") + "]";
    if (typeof arg === "object") return JSON.stringify(arg);
    return String(arg);
  };

  const scope: Record<string, any> = {
    print: (...args: any[]) => {
      stdoutArr.push(args.map(formatPyVal).join(" ") + "\n");
    },
    len: (obj: any) => {
      if (typeof obj === "string" || Array.isArray(obj)) return obj.length;
      if (obj && typeof obj === "object") return Object.keys(obj).length;
      return 0;
    },
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
    int: (val: any) => {
      const parsed = parseInt(val, 10);
      if (Number.isNaN(parsed)) throw new Error(`ValueError: invalid literal for int(): '${val}'`);
      return parsed;
    },
    float: (val: any) => {
      const parsed = parseFloat(val);
      if (Number.isNaN(parsed)) throw new Error(`ValueError: could not convert string to float: '${val}'`);
      return parsed;
    },
    str: (val: any) => formatPyVal(val),
    bool: (val: any) => Boolean(val),
    round: (val: number, ndigits = 0) => {
      const factor = Math.pow(10, ndigits);
      return Math.round(val * factor) / factor;
    },
    type: (val: any) => {
      if (val === null || val === undefined) return "<class 'NoneType'>";
      if (typeof val === "boolean") return "<class 'bool'>";
      if (typeof val === "number") return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
      if (typeof val === "string") return "<class 'str'>";
      if (Array.isArray(val)) return "<class 'list'>";
      return "<class 'object'>";
    },
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
      randint: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
      choice: (arr: any[]) =>
        Array.isArray(arr) && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null,
      random: () => Math.random(),
    },
    time: {
      time: () => Date.now() / 1000,
      sleep: () => {},
    },
    True: true,
    False: false,
    None: null,
  };

  try {
    const jsCode = transpilePythonToJs(code);
    const runner = new Function("scope", `with (scope) {\n${jsCode}\n}`);
    runner(scope);
  } catch (err: any) {
    isError = true;
    stderrArr.push(`${err.message || err}\n`);
  }

  const duration = Math.max(1, Math.round(performance.now() - startTime));

  return {
    stdout: stdoutArr.join(""),
    stderr: stderrArr.join(""),
    executionTimeMs: duration,
    isError,
  };
}

function transpilePythonToJs(pyCode: string): string {
  const rawLines = pyCode.split("\n");
  const jsLines: string[] = [];
  const indentStack: number[] = [0];

  const closeBlocksTo = (targetIndent: number) => {
    while (indentStack.length > 1 && targetIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push(" ".repeat(indentStack[indentStack.length - 1]) + "}");
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const noComment = stripCommentOutsideStrings(rawLines[i]).replace(/\t/g, "    ");
    if (!noComment.trim()) continue;

    const indentMatch = noComment.match(/^(\s*)/);
    const indentLen = indentMatch ? indentMatch[1].length : 0;
    const indent = " ".repeat(indentLen);
    let trimmed = noComment.trim();

    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      continue;
    }

    // Close open blocks whenever indentation decreases
    closeBlocksTo(indentLen);

    // Handle elif / else (must align with matching if block)
    const elifMatch = trimmed.match(/^elif\s+(.+):$/);
    if (elifMatch) {
      if (indentStack.length > 1 && indentStack[indentStack.length - 1] === indentLen) {
        indentStack.pop();
      }
      jsLines.push(`${indent}} else if (${transformExpr(elifMatch[1])}) {`);
      indentStack.push(indentLen + 4);
      continue;
    }

    if (trimmed === "else:") {
      if (indentStack.length > 1 && indentStack[indentStack.length - 1] === indentLen) {
        indentStack.pop();
      }
      jsLines.push(`${indent}} else {`);
      indentStack.push(indentLen + 4);
      continue;
    }

    // For loop
    const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/);
    if (forMatch) {
      const varName = forMatch[1];
      const iterable = transformExpr(forMatch[2]);
      jsLines.push(`${indent}for (let ${varName} of ${iterable}) {`);
      indentStack.push(indentLen + 4);
      continue;
    }

    // While loop
    const whileMatch = trimmed.match(/^while\s+(.+):$/);
    if (whileMatch) {
      const condition = transformExpr(whileMatch[1]);
      jsLines.push(`${indent}let _loopGuard_${i} = 0;`);
      jsLines.push(`${indent}while (${condition}) {`);
      jsLines.push(
        `${indent}  if (++_loopGuard_${i} > 100000) throw new Error("Infinite loop detected (100,000 iterations limit)");`
      );
      indentStack.push(indentLen + 4);
      continue;
    }

    // If statement
    const ifMatch = trimmed.match(/^if\s+(.+):$/);
    if (ifMatch) {
      jsLines.push(`${indent}if (${transformExpr(ifMatch[1])}) {`);
      indentStack.push(indentLen + 4);
      continue;
    }

    // Function definition
    const defMatch = trimmed.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\):$/);
    if (defMatch) {
      const fnName = defMatch[1];
      const params = defMatch[2];
      jsLines.push(`${indent}function ${fnName}(${params}) {`);
      indentStack.push(indentLen + 4);
      continue;
    }

    trimmed = transformExpr(trimmed);

    // Variable assignment (declare with var on assignment, avoiding == / != / <= / >= / += / -= / *= / /=)
    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(?!=)(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const val = assignMatch[2];
      jsLines.push(`${indent}var ${varName} = ${val};`);
      continue;
    }

    jsLines.push(`${indent}${trimmed};`);
  }

  closeBlocksTo(0);
  return jsLines.join("\n");
}

function transformExpr(expr: string): string {
  let out = expr;
  // Convert f-strings: f"Hello {name}!" -> `Hello ${name}!`
  out = out.replace(/f"([^"]*)"/g, (_, content) => {
    const transformed = content.replace(/\{([^}]+)\}/g, "${$1}");
    return `\`${transformed}\``;
  });
  out = out.replace(/f'([^']*)'/g, (_, content) => {
    const transformed = content.replace(/\{([^}]+)\}/g, "${$1}");
    return `\`${transformed}\``;
  });

  // Convert Python booleans & None outside quotes (simple token boundary replacement)
  out = out.replace(/\bTrue\b/g, "true");
  out = out.replace(/\bFalse\b/g, "false");
  out = out.replace(/\bNone\b/g, "null");

  // Logical operators
  out = out.replace(/\band\b/g, "&&");
  out = out.replace(/\bor\b/g, "||");
  out = out.replace(/\bnot\s+/g, "!");

  // Common string/list methods
  out = out.replace(/\.append\(/g, ".push(");
  out = out.replace(/\.upper\(\)/g, ".toUpperCase()");
  out = out.replace(/\.lower\(\)/g, ".toLowerCase()");
  out = out.replace(/\.strip\(\)/g, ".trim()");

  return out;
}
