export interface FriendlyErrorTranslation {
  errorType: string;
  headline: string;
  explanation: string;
  solutionHint: string;
  lineNumber?: number;
}

export function translatePythonError(stderr: string): FriendlyErrorTranslation | null {
  if (!stderr || typeof stderr !== "string") return null;

  // Extract line number if present
  let lineNumber: number | undefined;
  const lineMatch = stderr.match(/line (\d+)/i);
  if (lineMatch) {
    lineNumber = parseInt(lineMatch[1], 10);
  }

  // 1. NameError
  if (stderr.includes("NameError")) {
    const varMatch = stderr.match(/name '(\w+)' is not defined/);
    const missingName = varMatch ? varMatch[1] : "that word";
    return {
      errorType: "NameError",
      headline: `Python doesn't recognize "${missingName}" yet`,
      explanation: `Python encountered "${missingName}" but couldn't find a variable, function, or keyword with that name in memory. Remember: Python is sensitive to exact spelling and capitalization ("Name" is completely different from "name").`,
      solutionHint: `Double check your spelling! If you meant for "${missingName}" to be plain text, make sure to wrap it in quotation marks: "${missingName}". If it's a variable, check that you defined it above this line first.`,
      lineNumber,
    };
  }

  // 2. SyntaxError
  if (stderr.includes("SyntaxError")) {
    if (stderr.includes("expected ':'") || stderr.includes("invalid syntax") && stderr.includes(":")) {
      return {
        errorType: "SyntaxError",
        headline: "Missing Colon (:) or Punctuation Alert",
        explanation: "Python expected a colon (:) at the end of a header statement (like if, else, elif, for, while, or def).",
        solutionHint: "Look at the very end of your statement and ensure you included a colon ':'. For example: if x > 5: (with the colon).",
        lineNumber,
      };
    }
    if (stderr.includes("unmatched") || stderr.includes("was never closed") || stderr.includes("EOL while scanning string literal")) {
      return {
        errorType: "SyntaxError",
        headline: "Unclosed Quote or Parenthesis",
        explanation: "Python reached the end of the line or file before finding the matching closing quote (' or \") or parenthesis ')'.",
        solutionHint: "Check every opening quote and bracket. Every opening character ( \" or ( ) must have an exact matching closing partner on the same line.",
        lineNumber,
      };
    }
    return {
      errorType: "SyntaxError",
      headline: "Python Grammar Rule Broken",
      explanation: "Python could not parse this line because something about the punctuation or grammar doesn't match Python's rules.",
      solutionHint: "Check for missing parentheses, extra commas, misspelled reserved words, or unclosed quotes near the highlighted line.",
      lineNumber,
    };
  }

  // 3. IndentationError
  if (stderr.includes("IndentationError")) {
    return {
      errorType: "IndentationError",
      headline: "Code Spacing / Indentation Alert",
      explanation: "Python uses indentation (4 spaces) to know which lines belong inside a block (such as inside an if statement, loop, or function).",
      solutionHint: "Check the indent of the line. Make sure statements inside a block are indented by 4 spaces (or press Tab). Avoid mixing tabs and spaces.",
      lineNumber,
    };
  }

  // 4. TypeError
  if (stderr.includes("TypeError")) {
    if (stderr.includes("can only concatenate str") || stderr.includes("unsupported operand type")) {
      return {
        errorType: "TypeError",
        headline: "Data Type Clash: Mixing Incompatible Types",
        explanation: "Python was asked to combine two values that don't belong together (for example, trying to glue text and numbers directly with '+').",
        solutionHint: "Convert your number to text first using str(my_number), or use an f-string: f\"Total: {my_number}\".",
        lineNumber,
      };
    }
    return {
      errorType: "TypeError",
      headline: "Unexpected Data Type Operation",
      explanation: "An operation or function was applied to a data type that doesn't support it.",
      solutionHint: "Check the types of your variables using print(type(your_variable)) to verify what Python is actually seeing.",
      lineNumber,
    };
  }

  // 5. ZeroDivisionError
  if (stderr.includes("ZeroDivisionError")) {
    return {
      errorType: "ZeroDivisionError",
      headline: "Math Alert: Division by Zero",
      explanation: "In mathematics and computer science, dividing any number by zero is impossible and causes the computer to stop.",
      solutionHint: "Check your math divisor. Make sure the number you are dividing by is not 0 before performing the division.",
      lineNumber,
    };
  }

  // 6. IndexError
  if (stderr.includes("IndexError")) {
    return {
      errorType: "IndexError",
      headline: "List Boundary Reached (Index Out of Range)",
      explanation: "You requested an item at a position number that doesn't exist in the list or string. Remember: Python lists start counting at index 0!",
      solutionHint: "If a list has 3 items, its valid indices are 0, 1, and 2. Index 3 is out of bounds! Use len(my_list) to check the length.",
      lineNumber,
    };
  }

  // 7. KeyError
  if (stderr.includes("KeyError")) {
    const keyMatch = stderr.match(/KeyError:\s*['"]?(\w+)['"]?/);
    const missingKey = keyMatch ? keyMatch[1] : "that key";
    return {
      errorType: "KeyError",
      headline: `Dictionary Key "${missingKey}" Not Found`,
      explanation: `You tried to look up "${missingKey}" in a dictionary, but that key does not exist inside it.`,
      solutionHint: `Double check the dictionary keys, or use my_dict.get("${missingKey}", default_value) to safely retrieve values without crashing.`,
      lineNumber,
    };
  }

  // 8. ValueError
  if (stderr.includes("ValueError")) {
    return {
      errorType: "ValueError",
      headline: "Invalid Value Passed",
      explanation: "The data type was acceptable, but the actual value inside it could not be processed (for example, trying to convert the word 'hello' into an integer with int('hello')).",
      solutionHint: "Check the values you are passing to functions like int() or float() to ensure they represent valid numbers.",
      lineNumber,
    };
  }

  return null;
}
