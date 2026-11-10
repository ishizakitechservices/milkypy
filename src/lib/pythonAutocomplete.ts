import { AutocompleteItem } from "../types";

const PYTHON_KEYWORDS = [
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "False", "finally", "for",
  "from", "global", "if", "import", "in", "is", "lambda", "None",
  "nonlocal", "not", "or", "pass", "raise", "return", "True", "try",
  "while", "with", "yield"
];

const PYTHON_BUILTINS = [
  { name: "print", detail: "print(*objects, sep=' ', end='\\n')", insert: "print(${1:value})" },
  { name: "len", detail: "len(s) -> int", insert: "len(${1:sequence})" },
  { name: "range", detail: "range(stop) or range(start, stop[, step])", insert: "range(${1:start}, ${2:stop})" },
  { name: "input", detail: "input(prompt='') -> str", insert: "input('${1:Enter value: }')" },
  { name: "type", detail: "type(object) -> type", insert: "type(${1:object})" },
  { name: "int", detail: "int(x=0) -> integer", insert: "int(${1:value})" },
  { name: "str", detail: "str(object='') -> str", insert: "str(${1:object})" },
  { name: "float", detail: "float(x=0.0) -> float", insert: "float(${1:value})" },
  { name: "list", detail: "list([iterable]) -> new list", insert: "list(${1:iterable})" },
  { name: "dict", detail: "dict(**kwarg) -> new dictionary", insert: "dict()" },
  { name: "set", detail: "set([iterable]) -> new set", insert: "set(${1:iterable})" },
  { name: "tuple", detail: "tuple([iterable]) -> new tuple", insert: "tuple(${1:iterable})" },
  { name: "sum", detail: "sum(iterable, start=0)", insert: "sum(${1:iterable})" },
  { name: "min", detail: "min(iterable) -> minimum value", insert: "min(${1:iterable})" },
  { name: "max", detail: "max(iterable) -> maximum value", insert: "max(${1:iterable})" },
  { name: "abs", detail: "abs(x) -> absolute value", insert: "abs(${1:x})" },
  { name: "sorted", detail: "sorted(iterable, key=None, reverse=False)", insert: "sorted(${1:iterable})" },
  { name: "enumerate", detail: "enumerate(iterable, start=0)", insert: "enumerate(${1:iterable})" },
  { name: "zip", detail: "zip(*iterables)", insert: "zip(${1:a}, ${2:b})" },
  { name: "isinstance", detail: "isinstance(object, classinfo)", insert: "isinstance(${1:obj}, ${2:Class})" },
  { name: "open", detail: "open(file, mode='r')", insert: "open('${1:file.txt}', '${2:r}')" },
];

const PYTHON_SNIPPETS: { label: string; detail: string; insertText: string }[] = [
  {
    label: "for loop with range",
    detail: "for i in range(10):",
    insertText: "for i in range(${1:10}):\n    ${2:pass}",
  },
  {
    label: "def function",
    detail: "def func_name(args):",
    insertText: "def ${1:function_name}(${2:args}):\n    \"\"\"Docstring\"\"\"\n    ${3:return None}",
  },
  {
    label: "class definition",
    detail: "class MyClass:",
    insertText: "class ${1:MyClass}:\n    def __init__(self, ${2:param}):\n        self.${2:param} = ${2:param}\n",
  },
  {
    label: "if __name__ == '__main__':",
    detail: "Main script entry point",
    insertText: "if __name__ == '__main__':\n    ${1:main()}",
  },
  {
    label: "try-except block",
    detail: "Error handling wrapper",
    insertText: "try:\n    ${1:pass}\nexcept Exception as e:\n    print(f\"Error: {e}\")",
  },
  {
    label: "list comprehension",
    detail: "[x for x in iterable]",
    insertText: "[${1:x} for ${1:x} in ${2:iterable}]",
  },
  {
    label: "while loop",
    detail: "while condition:",
    insertText: "while ${1:condition}:\n    ${2:pass}",
  },
  {
    label: "with open file",
    detail: "with open(filename) as f:",
    insertText: "with open(${1:filename}, '${2:r}') as f:\n    ${3:content = f.read()}",
  },
];

// Rich Standard Python Library Autocomplete
const PYTHON_MODULES: Record<string, { name: string; detail: string; insert: string; type: "method" | "builtin" | "variable" }[]> = {
  math: [
    { name: "sin", detail: "math.sin(x) -> sine of x", insert: "sin(${1:x})", type: "method" },
    { name: "cos", detail: "math.cos(x) -> cosine of x", insert: "cos(${1:x})", type: "method" },
    { name: "tan", detail: "math.tan(x) -> tangent of x", insert: "tan(${1:x})", type: "method" },
    { name: "sqrt", detail: "math.sqrt(x) -> square root", insert: "sqrt(${1:x})", type: "method" },
    { name: "pi", detail: "math.pi -> 3.141592...", insert: "pi", type: "variable" },
    { name: "e", detail: "math.e -> 2.718281...", insert: "e", type: "variable" },
    { name: "radians", detail: "math.radians(x) -> deg to rad", insert: "radians(${1:x})", type: "method" },
    { name: "degrees", detail: "math.degrees(x) -> rad to deg", insert: "degrees(${1:x})", type: "method" },
    { name: "factorial", detail: "math.factorial(x) -> x!", insert: "factorial(${1:x})", type: "method" },
    { name: "ceil", detail: "math.ceil(x) -> ceiling", insert: "ceil(${1:x})", type: "method" },
    { name: "floor", detail: "math.floor(x) -> floor", insert: "floor(${1:x})", type: "method" },
    { name: "log", detail: "math.log(x[, base])", insert: "log(${1:x})", type: "method" },
    { name: "pow", detail: "math.pow(x, y) -> x ** y", insert: "pow(${1:x}, ${2:y})", type: "method" },
    { name: "gcd", detail: "math.gcd(x, y) -> greatest common divisor", insert: "gcd(${1:x}, ${2:y})", type: "method" },
  ],
  random: [
    { name: "random", detail: "random.random() -> float in [0.0, 1.0)", insert: "random()", type: "method" },
    { name: "randint", detail: "random.randint(a, b) -> integer in [a, b]", insert: "randint(${1:a}, ${2:b})", type: "method" },
    { name: "choice", detail: "random.choice(seq) -> random element", insert: "choice(${1:seq})", type: "method" },
    { name: "shuffle", detail: "random.shuffle(seq) -> shuffle in place", insert: "shuffle(${1:seq})", type: "method" },
    { name: "uniform", detail: "random.uniform(a, b) -> random float", insert: "uniform(${1:a}, ${2:b})", type: "method" },
    { name: "randrange", detail: "random.randrange(start, stop[, step])", insert: "randrange(${1:start}, ${2:stop})", type: "method" },
    { name: "sample", detail: "random.sample(population, k)", insert: "sample(${1:population}, ${2:k})", type: "method" },
    { name: "seed", detail: "random.seed(a=None)", insert: "seed(${1:a})", type: "method" },
  ],
  time: [
    { name: "time", detail: "time.time() -> epoch float", insert: "time()", type: "method" },
    { name: "sleep", detail: "time.sleep(seconds) -> delay execution", insert: "sleep(${1:seconds})", type: "method" },
    { name: "ctime", detail: "time.ctime() -> current local time string", insert: "ctime()", type: "method" },
    { name: "localtime", detail: "time.localtime() -> local time structure", insert: "localtime()", type: "method" },
    { name: "strftime", detail: "time.strftime(format[, t])", insert: "strftime('${1:%Y-%m-%d %H:%M:%S}')", type: "method" },
  ],
  json: [
    { name: "loads", detail: "json.loads(s) -> parse JSON string", insert: "loads(${1:string})", type: "method" },
    { name: "dumps", detail: "json.dumps(obj) -> serialize to JSON string", insert: "dumps(${1:obj})", type: "method" },
    { name: "load", detail: "json.load(fp) -> read JSON file pointer", insert: "load(${1:file_pointer})", type: "method" },
    { name: "dump", detail: "json.dump(obj, fp) -> write JSON file pointer", insert: "dump(${1:obj}, ${2:file_pointer})", type: "method" },
  ],
  sys: [
    { name: "argv", detail: "sys.argv -> command line arguments list", insert: "argv", type: "variable" },
    { name: "exit", detail: "sys.exit([status]) -> termination", insert: "exit(${1:0})", type: "method" },
    { name: "path", detail: "sys.path -> module search path list", insert: "path", type: "variable" },
    { name: "stdout", detail: "sys.stdout -> standard output stream", insert: "stdout", type: "variable" },
    { name: "stderr", detail: "sys.stderr -> standard error stream", insert: "stderr", type: "variable" },
  ],
  os: [
    { name: "getcwd", detail: "os.getcwd() -> current working directory", insert: "getcwd()", type: "method" },
    { name: "listdir", detail: "os.listdir(path='.') -> files list", insert: "listdir(${1:'.'})", type: "method" },
    { name: "mkdir", detail: "os.mkdir(path) -> create directory", insert: "mkdir(${1:path})", type: "method" },
    { name: "remove", detail: "os.remove(path) -> delete file", insert: "remove(${1:path})", type: "method" },
    { name: "rename", detail: "os.rename(src, dst) -> rename", insert: "rename(${1:src}, ${2:dst})", type: "method" },
    { name: "environ", detail: "os.environ -> environment variables", insert: "environ", type: "variable" },
    { name: "system", detail: "os.system(command)", insert: "system(${1:command})", type: "method" },
    { name: "path", detail: "os.path submodule", insert: "path", type: "variable" },
  ],
  "os.path": [
    { name: "join", detail: "os.path.join(path, *paths) -> combined path", insert: "join(${1:path1}, ${2:path2})", type: "method" },
    { name: "exists", detail: "os.path.exists(path) -> bool", insert: "exists(${1:path})", type: "method" },
    { name: "isdir", detail: "os.path.isdir(path) -> bool", insert: "isdir(${1:path})", type: "method" },
    { name: "isfile", detail: "os.path.isfile(path) -> bool", insert: "isfile(${1:path})", type: "method" },
    { name: "split", detail: "os.path.split(path) -> (head, tail)", insert: "split(${1:path})", type: "method" },
    { name: "abspath", detail: "os.path.abspath(path) -> absolute path", insert: "abspath(${1:path})", type: "method" },
    { name: "basename", detail: "os.path.basename(path) -> tail", insert: "basename(${1:path})", type: "method" },
    { name: "dirname", detail: "os.path.dirname(path) -> head", insert: "dirname(${1:path})", type: "method" },
  ],
  datetime: [
    { name: "datetime", detail: "datetime.datetime class", insert: "datetime", type: "builtin" },
    { name: "date", detail: "datetime.date class", insert: "date", type: "builtin" },
    { name: "time", detail: "datetime.time class", insert: "time", type: "builtin" },
    { name: "timedelta", detail: "datetime.timedelta class", insert: "timedelta", type: "builtin" },
  ],
  turtle: [
    { name: "forward", detail: "turtle.forward(distance)", insert: "forward(${1:100})", type: "method" },
    { name: "backward", detail: "turtle.backward(distance)", insert: "backward(${1:100})", type: "method" },
    { name: "right", detail: "turtle.right(angle)", insert: "right(${1:90})", type: "method" },
    { name: "left", detail: "turtle.left(angle)", insert: "left(${1:90})", type: "method" },
    { name: "penup", detail: "turtle.penup() -> pen up", insert: "penup()", type: "method" },
    { name: "pendown", detail: "turtle.pendown() -> pen down", insert: "pendown()", type: "method" },
    { name: "color", detail: "turtle.color(colorstring)", insert: "color('${1:red}')", type: "method" },
    { name: "circle", detail: "turtle.circle(radius)", insert: "circle(${1:50})", type: "method" },
    { name: "speed", detail: "turtle.speed(speed)", insert: "speed(${1:3})", type: "method" },
  ]
};

// Rich object type methods
const LIST_METHODS = [
  { name: "append", detail: "list.append(item) -> add to end", insert: "append(${1:item})" },
  { name: "extend", detail: "list.extend(iterable) -> extend list", insert: "extend(${1:iterable})" },
  { name: "insert", detail: "list.insert(idx, item) -> insert at idx", insert: "insert(${1:index}, ${2:item})" },
  { name: "remove", detail: "list.remove(item) -> remove first match", insert: "remove(${1:item})" },
  { name: "pop", detail: "list.pop([idx]) -> remove and return", insert: "pop()" },
  { name: "clear", detail: "list.clear() -> remove all items", insert: "clear()" },
  { name: "index", detail: "list.index(item) -> find first index", insert: "index(${1:item})" },
  { name: "count", detail: "list.count(item) -> count occurrences", insert: "count(${1:item})" },
  { name: "sort", detail: "list.sort(reverse=False) -> sort list", insert: "sort()" },
  { name: "reverse", detail: "list.reverse() -> reverse list in place", insert: "reverse()" },
  { name: "copy", detail: "list.copy() -> return shallow copy", insert: "copy()" },
];

const DICT_METHODS = [
  { name: "keys", detail: "dict.keys() -> dictionary keys", insert: "keys()" },
  { name: "values", detail: "dict.values() -> dictionary values", insert: "values()" },
  { name: "items", detail: "dict.items() -> dictionary (key, value) pairs", insert: "items()" },
  { name: "get", detail: "dict.get(key, default=None) -> value", insert: "get(${1:key})" },
  { name: "pop", detail: "dict.pop(key[, default]) -> remove and return", insert: "pop(${1:key})" },
  { name: "popitem", detail: "dict.popitem() -> remove/return last pair", insert: "popitem()" },
  { name: "update", detail: "dict.update([other]) -> update dictionary", insert: "update(${1:other})" },
  { name: "clear", detail: "dict.clear() -> remove all keys", insert: "clear()" },
  { name: "copy", detail: "dict.copy() -> return shallow copy", insert: "copy()" },
];

const STR_METHODS = [
  { name: "split", detail: "str.split(sep=None) -> list of strings", insert: "split(${1:sep})" },
  { name: "join", detail: "str.join(iterable) -> joined string", insert: "join(${1:iterable})" },
  { name: "strip", detail: "str.strip() -> strip whitespace", insert: "strip()" },
  { name: "replace", detail: "str.replace(old, new) -> replace substrings", insert: "replace('${1:old}', '${2:new}')" },
  { name: "lower", detail: "str.lower() -> lowercase string", insert: "lower()" },
  { name: "upper", detail: "str.upper() -> uppercase string", insert: "upper()" },
  { name: "find", detail: "str.find(sub) -> first index of substring", insert: "find(${1:substring})" },
  { name: "startswith", detail: "str.startswith(prefix) -> bool", insert: "startswith(${1:prefix})" },
  { name: "endswith", detail: "str.endswith(suffix) -> bool", insert: "endswith(${1:suffix})" },
  { name: "isalpha", detail: "str.isalpha() -> true if alphabetical", insert: "isalpha()" },
  { name: "isdigit", detail: "str.isdigit() -> true if digital", insert: "isdigit()" },
];

const SET_METHODS = [
  { name: "add", detail: "set.add(element) -> add element", insert: "add(${1:element})" },
  { name: "remove", detail: "set.remove(element) -> remove element", insert: "remove(${1:element})" },
  { name: "discard", detail: "set.discard(element) -> discard element", insert: "discard(${1:element})" },
  { name: "pop", detail: "set.pop() -> remove & return random", insert: "pop()" },
  { name: "union", detail: "set.union(*others) -> new union set", insert: "union(${1:other})" },
  { name: "intersection", detail: "set.intersection(*others) -> new intersection", insert: "intersection(${1:other})" },
  { name: "difference", detail: "set.difference(*others) -> new difference", insert: "difference(${1:other})" },
  { name: "clear", detail: "set.clear() -> clear all elements", insert: "clear()" },
];

const PYTHON_MODULE_ITEMS = [
  { name: "math", detail: "Mathematics module", insert: "math" },
  { name: "random", detail: "Random number generator", insert: "random" },
  { name: "time", detail: "Time access and conversions", insert: "time" },
  { name: "json", detail: "JSON encoder and decoder", insert: "json" },
  { name: "sys", detail: "System-specific parameters and functions", insert: "sys" },
  { name: "os", detail: "Miscellaneous operating system interfaces", insert: "os" },
  { name: "datetime", detail: "Basic date and time types", insert: "datetime" },
  { name: "turtle", detail: "Turtle graphics framework", insert: "turtle" },
];

function formatInsertText(insert: string, type: string): string {
  if (type === "snippet") {
    return insert.replace(/\$\{\d+:?([^}]*)\}/g, "$1");
  }

  // For builtins or methods, if they are functions/methods (contain parentheses),
  // strip all placeholders inside the parentheses completely, e.g. print(${1:value}) -> print()
  if (type === "builtin" || type === "method") {
    const firstParen = insert.indexOf("(");
    const lastParen = insert.lastIndexOf(")");
    if (firstParen !== -1 && lastParen !== -1 && lastParen > firstParen) {
      const inside = insert.slice(firstParen + 1, lastParen);
      if (inside.includes("${")) {
        return insert.slice(0, firstParen + 1) + ")" + insert.slice(lastParen + 1);
      }
    }
  }

  return insert.replace(/\$\{\d+:?([^}]*)\}/g, "$1");
}

export function getCompletions(code: string, cursorOffset: number): AutocompleteItem[] {
  const textBeforeCursor = code.slice(0, cursorOffset);
  const matches: AutocompleteItem[] = [];

  // Check if we are doing a member access (dot notation)
  // Matching something like: math. or os.path. or self. or my_list.
  const memberMatch = textBeforeCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\.([a-zA-Z0-9_]*)$/);

  if (memberMatch) {
    const objName = memberMatch[1];
    const prefix = memberMatch[2].toLowerCase();

    // 1. Module Member suggestions
    if (PYTHON_MODULES[objName]) {
      for (const item of PYTHON_MODULES[objName]) {
        if (item.name.toLowerCase().startsWith(prefix)) {
          matches.push({
            label: item.name,
            type: item.type,
            detail: item.detail,
            insertText: formatInsertText(item.insert, item.type),
            description: `${objName} member`
          });
        }
      }
    }
    // 2. Class 'self.' context suggestions
    else if (objName === "self") {
      const userSymbols = extractUserSymbols(code);
      for (const sym of userSymbols) {
        if (sym.name.toLowerCase().startsWith(prefix)) {
          matches.push({
            label: sym.name,
            type: sym.type === "function" ? "method" : "variable",
            detail: `self.${sym.name} (User Defined)`,
            insertText: sym.name,
            description: "class member"
          });
        }
      }
    }
    // 3. User Variable Type-inferred Suggestions
    else {
      const varType = inferVariableType(objName, code);
      let methodsList: typeof LIST_METHODS = [];
      if (varType === "list") methodsList = LIST_METHODS;
      else if (varType === "dict") methodsList = DICT_METHODS;
      else if (varType === "str") methodsList = STR_METHODS;
      else if (varType === "set") methodsList = SET_METHODS;
      else {
        // Fallback generic standard python methods
        methodsList = [
          ...LIST_METHODS.slice(0, 3),
          ...DICT_METHODS.slice(0, 3),
          ...STR_METHODS.slice(0, 3)
        ];
      }

      const seenMethods = new Set<string>();
      for (const method of methodsList) {
        if (method.name.toLowerCase().startsWith(prefix) && !seenMethods.has(method.name)) {
          seenMethods.add(method.name);
          matches.push({
            label: method.name,
            type: "method",
            detail: method.detail,
            insertText: formatInsertText(method.insert, "method"),
            description: `${varType === "other" ? "generic" : varType} method`
          });
        }
      }
    }

    // Sort: starting matches first, then limit to 10
    return matches.slice(0, 10);
  }

  // Fallback: Normal word autocomplete
  const words = textBeforeCursor.split(/[\s,()\[\]{}:;+\-*/%&|^~<>=!.]+/);
  const currentWord = words[words.length - 1] || "";

  if (currentWord.length < 1) {
    return [];
  }

  const lowerWord = currentWord.toLowerCase();

  // 1. Snippets
  for (const snip of PYTHON_SNIPPETS) {
    if (snip.label.toLowerCase().includes(lowerWord)) {
      matches.push({
        label: snip.label,
        type: "snippet",
        detail: snip.detail,
        insertText: formatInsertText(snip.insertText, "snippet"),
        description: "Code Snippet",
      });
    }
  }

  // 2. Builtins
  for (const builtin of PYTHON_BUILTINS) {
    if (builtin.name.toLowerCase().startsWith(lowerWord)) {
      matches.push({
        label: builtin.name,
        type: "builtin",
        detail: builtin.detail,
        insertText: formatInsertText(builtin.insert, "builtin"),
        description: "Built-in Function",
      });
    }
  }

  // 3. Keywords
  for (const kw of PYTHON_KEYWORDS) {
    if (kw.toLowerCase().startsWith(lowerWord)) {
      matches.push({
        label: kw,
        type: "keyword",
        detail: "Python Keyword",
        insertText: kw + " ",
        description: "Keyword",
      });
    }
  }

  // 4. Standard Modules list
  for (const mod of PYTHON_MODULE_ITEMS) {
    if (mod.name.toLowerCase().startsWith(lowerWord)) {
      matches.push({
        label: mod.name,
        type: "builtin",
        detail: mod.detail,
        insertText: mod.insert,
        description: "Python Module",
      });
    }
  }

  // 5. User variables & functions from current code
  const userVars = extractUserSymbols(code);
  for (const sym of userVars) {
    if (sym.name.toLowerCase().startsWith(lowerWord) && sym.name !== currentWord) {
      matches.push({
        label: sym.name,
        type: sym.type as any,
        detail: `User Defined ${sym.type}`,
        insertText: sym.name,
        description: sym.type,
      });
    }
  }

  // Substring fallback search (for lower exact matches)
  if (matches.length < 10) {
    for (const builtin of PYTHON_BUILTINS) {
      if (builtin.name.toLowerCase().includes(lowerWord) && !matches.some(m => m.label === builtin.name)) {
        matches.push({
          label: builtin.name,
          type: "builtin",
          detail: builtin.detail,
          insertText: formatInsertText(builtin.insert, "builtin"),
          description: "Built-in Function (fuzzy)",
        });
        if (matches.length >= 10) break;
      }
    }
  }

  return matches.slice(0, 10);
}

function inferVariableType(varName: string, code: string): "list" | "dict" | "str" | "set" | "other" {
  const lowerVar = varName.toLowerCase();
  if (lowerVar.endsWith("list") || lowerVar.endsWith("items") || lowerVar === "arr") return "list";
  if (lowerVar.endsWith("dict") || lowerVar.endsWith("mapping") || lowerVar === "data") return "dict";
  if (lowerVar.endsWith("str") || lowerVar.endsWith("text") || lowerVar.endsWith("msg") || lowerVar.endsWith("message")) return "str";
  if (lowerVar.endsWith("set")) return "set";

  // Scan code for assignment patterns
  // list literal check: varName = [
  const listRegex = new RegExp("\\b" + varName + "\\s*=\\s*\\[");
  if (listRegex.test(code)) return "list";

  // dict literal check: varName = {
  const dictRegex = new RegExp("\\b" + varName + "\\s*=\\s*\\{");
  if (dictRegex.test(code)) {
    // defaults to dict
    return "dict";
  }

  // string literal check: varName = " or '
  const strRegex = new RegExp("\\b" + varName + "\\s*=\\s*['\"`]");
  if (strRegex.test(code)) return "str";

  // set constructor check: varName = set(
  const setRegex = new RegExp("\\b" + varName + "\\s*=\\s*set\\(");
  if (setRegex.test(code)) return "set";

  return "other";
}

function extractUserSymbols(code: string): { name: string; type: "variable" | "function" }[] {
  const symbols: { name: string; type: "variable" | "function" }[] = [];
  const seen = new Set<string>();

  // Function defs
  const funcRegex = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  let match;
  while ((match = funcRegex.exec(code)) !== null) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      symbols.push({ name: match[1], type: "function" });
    }
  }

  // Variable assignments
  const varRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
  while ((match = varRegex.exec(code)) !== null) {
    const varName = match[1];
    if (!seen.has(varName) && !PYTHON_KEYWORDS.includes(varName)) {
      seen.add(varName);
      symbols.push({ name: varName, type: "variable" });
    }
  }

  return symbols;
}
