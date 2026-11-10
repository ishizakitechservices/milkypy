import { AIDebugResult, AIExplainResult } from "../types";

/**
 * Offline Python Knowledge Engine & Error Diagnoser
 * Runs 100% locally on-device without any internet or API keys.
 */

export function diagnoseOfflineError(code: string, errorMessage?: string): AIDebugResult {
  const err = (errorMessage || "").trim();
  const lines = code.split("\n");

  // Default fallback if error message is minimal or empty
  if (!err) {
    return {
      bugType: "General Python Syntax Check",
      explanation: "No specific Python runtime error was captured. Check for basic syntax mistakes like missing colons (:), unmatched parentheses, or incorrect indentation.",
      fixedCode: code,
      tips: [
        "Ensure all if, for, while, def statements end with a colon (:)",
        "Check that brackets and quotation marks are balanced",
        "Keep indentation consistent with 4 spaces per block"
      ],
    };
  }

  // 1. SyntaxError: invalid syntax / missing colon
  if (err.includes("SyntaxError")) {
    let lineNum = extractLineNumber(err);
    let specificHint = "A SyntaxError means Python encountered code that violates language grammar rules.";
    const tips = [
      "Check that statement headers end with a colon (:)",
      "Verify strings have matching opening and closing quotes",
      "Ensure brackets (), [], {} are properly closed"
    ];

    if (err.includes("expected ':'") || err.includes("invalid syntax")) {
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (
          (trimmed.startsWith("if ") ||
            trimmed.startsWith("elif ") ||
            trimmed.startsWith("else") ||
            trimmed.startsWith("for ") ||
            trimmed.startsWith("while ") ||
            trimmed.startsWith("def ") ||
            trimmed.startsWith("class ")) &&
          !trimmed.endsWith(":")
        ) {
          lineNum = i + 1;
          specificHint = `Line ${lineNum} is missing a colon (:) at the end of the statement. In Python, all control flow headers (if, for, while, def, class) must end with a colon.`;
          lines[i] = lines[i] + ":";
          tips.unshift(`Added missing colon to line ${lineNum}`);
          break;
        }
      }
    }

    if (err.includes("unexpected EOF") || err.includes("unmatched")) {
      specificHint = "You have an unclosed quotation mark (\" or ') or an unclosed parenthesis ((), [], {}). Check the end of your script.";
    }

    return {
      bugType: "SyntaxError",
      explanation: `**[Offline Diagnostic] SyntaxError Detected**\n\n${specificHint}\n\n*Original Error:* \`${err}\``,
      fixedCode: lines.join("\n"),
      tips,
    };
  }

  // 2. IndentationError
  if (err.includes("IndentationError")) {
    const lineNum = extractLineNumber(err);
    return {
      bugType: "IndentationError",
      explanation: `**[Offline Diagnostic] IndentationError Detected**\n\nPython relies on consistent indentation (usually 4 spaces) to define code blocks inside if, for, while, or def statements.\n\nMake sure lines following a colon : are indented by 4 spaces, and avoid mixing tabs and spaces.${lineNum ? ` Check around line ${lineNum}.` : ""}`,
      fixedCode: code,
      tips: [
        "Indent the body of loops, functions, and conditionals by 4 spaces",
        "Do not mix tabs and spaces in the same file",
        "Align statements at the same block level"
      ],
    };
  }

  // 3. NameError: name '...' is not defined
  if (err.includes("NameError")) {
    const match = err.match(/name '(\w+)' is not defined/);
    const varName = match ? match[1] : "variable";
    const lineNum = extractLineNumber(err);

    return {
      bugType: "NameError",
      explanation: `**[Offline Diagnostic] NameError: '${varName}' is not defined**\n\nThis occurs when you attempt to use the variable or function \`${varName}\` before assigning a value to it, or if there is a spelling typo.${lineNum ? ` (at line ${lineNum})` : ""}`,
      fixedCode: code,
      tips: [
        `Ensure ${varName} is assigned before use: ${varName} = ...`,
        "Python is case-sensitive: myVar and myvar are different names",
        "If from a library (like random or math), write 'import random' or 'import math'"
      ],
    };
  }

  // 4. ZeroDivisionError
  if (err.includes("ZeroDivisionError")) {
    const lineNum = extractLineNumber(err);
    return {
      bugType: "ZeroDivisionError",
      explanation: `**[Offline Diagnostic] ZeroDivisionError: division by zero**\n\nIn mathematics and Python, dividing a number by zero (/ 0 or % 0) is undefined.${lineNum ? ` Error at line ${lineNum}.` : ""}`,
      fixedCode: code,
      tips: [
        "Add a check before dividing: if divisor != 0: ...",
        "Provide a default fallback value when divisor is 0",
        "Validate inputs to ensure user input cannot be zero"
      ],
    };
  }

  // 5. TypeError
  if (err.includes("TypeError")) {
    const lineNum = extractLineNumber(err);
    return {
      bugType: "TypeError",
      explanation: `**[Offline Diagnostic] TypeError Detected**\n\nAn operation was performed on incompatible data types (for example, adding a string to an integer: "Score: " + 10).${lineNum ? ` Check line ${lineNum}.` : ""}`,
      fixedCode: code,
      tips: [
        "Convert numbers to strings before concatenation: 'Score: ' + str(10)",
        "Use f-strings for clean formatting: f'Score: {10}'",
        "Verify function arguments match expected types"
      ],
    };
  }

  // 6. IndexError
  if (err.includes("IndexError")) {
    const lineNum = extractLineNumber(err);
    return {
      bugType: "IndexError",
      explanation: `**[Offline Diagnostic] IndexError: list index out of range**\n\nAttempted to access an index that does not exist in the list or string. Python uses 0-based indexing: a list with 3 elements has valid indices 0, 1, and 2.${lineNum ? ` Occurred at line ${lineNum}.` : ""}`,
      fixedCode: code,
      tips: [
        "Check list length with len(my_list) before indexing",
        "Remember the last item is at index len(my_list) - 1 or my_list[-1]",
        "Use 'for item in my_list:' to safely iterate without indices"
      ],
    };
  }

  // 7. KeyError
  if (err.includes("KeyError")) {
    const lineNum = extractLineNumber(err);
    return {
      bugType: "KeyError",
      explanation: `**[Offline Diagnostic] KeyError Detected**\n\nA dictionary key was accessed that does not exist in the dictionary.${lineNum ? ` Occurred at line ${lineNum}.` : ""}`,
      fixedCode: code,
      tips: [
        "Use my_dict.get(key, default) for safe lookups with fallbacks",
        "Check key existence with 'if key in my_dict:'",
        "Print my_dict.keys() to inspect available keys"
      ],
    };
  }

  // Generic fallback
  const lineNum = extractLineNumber(err);
  return {
    bugType: "RuntimeError",
    explanation: `**[Offline Diagnostic] Execution Issue**\n\nPython reported:\n\`\`\`\n${err}\n\`\`\`\n\nCheck variable definitions, argument types, and data boundaries near line ${lineNum || "where the error occurred"}.`,
    fixedCode: code,
    tips: [
      "Review the line referenced in the error message",
      "Inspect variable types and values using print() statements",
      "Verify syntax and indentation of surrounding code"
    ],
  };
}

function extractLineNumber(err: string): number | null {
  const match = err.match(/line (\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

export function explainOfflineCode(code: string): AIExplainResult {
  const lines = code.split("\n");
  const summaryParts: string[] = [];
  const steps: string[] = [];
  const concepts: string[] = [];

  let hasLoops = false;
  let hasFunctions = false;
  let hasConditions = false;
  let hasImports = false;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const lineNo = idx + 1;

    if (!trimmed || trimmed.startsWith("#")) return;

    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      hasImports = true;
      steps.push(`Line ${lineNo}: Imports external library module \`${trimmed}\``);
      concepts.push("Modules & Imports");
    } else if (trimmed.startsWith("def ")) {
      hasFunctions = true;
      const fnName = trimmed.replace("def ", "").split("(")[0];
      steps.push(`Line ${lineNo}: Declares reusable function \`${fnName}\``);
      concepts.push("Functions & Parameters");
    } else if (trimmed.startsWith("for ") || trimmed.startsWith("while ")) {
      hasLoops = true;
      steps.push(`Line ${lineNo}: Executes loop iteration \`${trimmed}\``);
      concepts.push("Loops & Iteration");
    } else if (trimmed.startsWith("if ") || trimmed.startsWith("elif ") || trimmed.startsWith("else:")) {
      hasConditions = true;
      steps.push(`Line ${lineNo}: Evaluates condition \`${trimmed}\``);
      concepts.push("Conditionals & Logic");
    } else if (trimmed.includes("print(")) {
      steps.push(`Line ${lineNo}: Outputs text or data to terminal`);
      concepts.push("Standard Output");
    } else if (trimmed.includes("input(")) {
      steps.push(`Line ${lineNo}: Requests keyboard input from user`);
      concepts.push("User Input");
    }
  });

  if (hasImports) summaryParts.push("utilizes external Python libraries");
  if (hasFunctions) summaryParts.push("declares modular functions");
  if (hasLoops) summaryParts.push("executes iterative loops");
  if (hasConditions) summaryParts.push("branches based on conditional statements");

  const summary = summaryParts.length > 0
    ? `This Python program ${summaryParts.join(", ")} to perform its computation.`
    : "This Python script executes sequential statements and computes outputs.";

  const uniqueConcepts = Array.from(new Set(concepts));
  if (uniqueConcepts.length === 0) {
    uniqueConcepts.push("Python Basics", "Variable Assignment");
  }

  return {
    summary: `**[Offline Code Breakdown]**\n${summary}`,
    steps: steps.slice(0, 10),
    concepts: uniqueConcepts,
  };
}

export function getOfflineChatReply(query: string, code: string): string {
  const q = query.toLowerCase();

  if (q.includes("loop") || q.includes("for") || q.includes("repeat")) {
    return `### For Loops in Python (Offline Guide)

Use a \`for\` loop when you want to repeat code a specific number of times:

\`\`\`python
# Repeat 5 times (0, 1, 2, 3, 4)
for i in range(5):
    print(f"Iteration: {i}")

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

*Tip:* \`range(start, stop, step)\` allows custom intervals like \`range(2, 10, 2)\` for even numbers!`;
  }

  if (q.includes("function") || q.includes("def") || q.includes("method")) {
    return `### Functions in Python (Offline Guide)

Functions are defined using the \`def\` keyword:

\`\`\`python
def greet(name, times=1):
    """Greets a user multiple times."""
    for _ in range(times):
        print(f"Hello, {name}!")

# Call the function
greet("Alex", times=2)
\`\`\`

*Return values:*
\`\`\`python
def add(a, b):
    return a + b

total = add(15, 25)  # 40
\`\`\``;
  }

  if (q.includes("if") || q.includes("condition") || q.includes("else")) {
    return `### If / Elif / Else Statements (Offline Guide)

Python evaluates conditional expressions sequentially:

\`\`\`python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Keep practicing!")
\`\`\`

*Comparison operators:* \`==\` (equal), \`!=\` (not equal), \`>\`, \`<\`, \`>=\`, \`<=\`.`;
  }

  if (q.includes("list") || q.includes("array")) {
    return `### Lists in Python (Offline Guide)

Lists store ordered sequences of items:

\`\`\`python
inventory = ["sword", "shield", "potion"]

# Add an item
inventory.append("magic ring")

# Access by index (0-based)
print(inventory[0])  # "sword"

# Check length
print(f"Items count: {len(inventory)}")

# Check if item exists
if "potion" in inventory:
    print("You have a healing potion!")
\`\`\``;
  }

  if (q.includes("dict") || q.includes("dictionary") || q.includes("key")) {
    return `### Dictionaries in Python (Offline Guide)

Dictionaries store key-value pairs:

\`\`\`python
player = {
    "name": "Knight",
    "hp": 100,
    "level": 3
}

# Access values
print(player["name"])

# Safely access with default
coins = player.get("coins", 0)

# Add or update
player["gold"] = 50
\`\`\``;
  }

  if (q.includes("random") || q.includes("dice") || q.includes("chance")) {
    return `### Random Numbers in Python (Offline Guide)

Import the standard \`random\` module:

\`\`\`python
import random

# Random integer between 1 and 6 (inclusive)
dice_roll = random.randint(1, 6)

# Random item from a list
choices = ["Rock", "Paper", "Scissors"]
bot_choice = random.choice(choices)

# Float between 0.0 and 1.0
probability = random.random()
\`\`\``;
  }

  if (q.includes("input") || q.includes("user input")) {
    return `### User Input in Python (Offline Guide)

Use \`input(prompt)\` to receive typed input from the terminal:

\`\`\`python
user_name = input("What is your name? ")
print(f"Welcome to Milky AI Tutor, {user_name}!")

# Remember: input() returns a string! Convert to int if needed:
age = int(input("Enter your age: "))
next_year = age + 1
print(f"Next year you will be {next_year} years old.")
\`\`\``;
  }

  return `### Milky AI Tutor Offline Python Knowledge Base

You are currently in **Offline Standalone Mode**. Code execution, arcade games, lessons, and syntax verification are running locally on your device!

**Quick Topics You Can Ask About:**
- *Loops* (for, while, range)
- *Functions* (def, return, parameters)
- *Conditionals* (if, elif, else)
- *Lists & Dictionaries*
- *User Input & Print formatting*
- *Random numbers & Games logic*

*(Tip: When connected to the internet, live Milky AI Tutor reasoning will automatically activate!)*`;
}
