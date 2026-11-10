/**
 * Python Code Auto-Formatter
 * Implements PEP 8 compliant indentation, line spacing, and syntax cleanup:
 * - 4-space indentation hierarchy (blocks, control flows, functions, classes)
 * - Automatic dedenting for elif, else, except, finally, and closing brackets
 * - Preserves multiline strings/docstrings (""" and ''') verbatim
 * - Standardizes operator spacing (=, ==, !=, <=, >=, +, -, *, /, etc.)
 * - Standardizes comma and colon spacing (dict pairs, function signatures)
 * - Comment formatting (# comment)
 * - Strips trailing whitespace and normalizes excess blank lines
 */

export interface FormatResult {
  code: string;
  changed: boolean;
  message?: string;
}

/**
 * Helper to tokenize a line into code, strings, and comments so we only
 * format syntax/operators in genuine code tokens, never inside strings or comments.
 */
interface LineSegment {
  type: "code" | "string" | "comment";
  text: string;
}

function parseLineSegments(line: string, initialQuoteState: string | null): { segments: LineSegment[]; endingQuoteState: string | null } {
  const segments: LineSegment[] = [];
  let currentQuote: string | null = initialQuoteState;
  let buffer = "";
  let i = 0;

  // If already inside a multiline string from a previous line
  if (currentQuote) {
    const endIdx = line.indexOf(currentQuote);
    if (endIdx !== -1) {
      const stringPart = line.slice(0, endIdx + currentQuote.length);
      segments.push({ type: "string", text: stringPart });
      i = endIdx + currentQuote.length;
      currentQuote = null;
    } else {
      // Entire line is part of multiline string
      segments.push({ type: "string", text: line });
      return { segments, endingQuoteState: currentQuote };
    }
  }

  while (i < line.length) {
    // Check for comment
    if (line[i] === "#" && !currentQuote) {
      if (buffer) {
        segments.push({ type: "code", text: buffer });
        buffer = "";
      }
      segments.push({ type: "comment", text: line.slice(i) });
      break;
    }

    // Check for multiline string start (""" or ''')
    if (!currentQuote && (line.startsWith('"""', i) || line.startsWith("'''", i))) {
      const quoteType = line.slice(i, i + 3);
      if (buffer) {
        segments.push({ type: "code", text: buffer });
        buffer = "";
      }
      // Check if it closes on the same line after the opening
      const closeIdx = line.indexOf(quoteType, i + 3);
      if (closeIdx !== -1) {
        segments.push({ type: "string", text: line.slice(i, closeIdx + 3) });
        i = closeIdx + 3;
        continue;
      } else {
        segments.push({ type: "string", text: line.slice(i) });
        currentQuote = quoteType;
        break;
      }
    }

    // Check for single-line string start (" or ')
    if (!currentQuote && (line[i] === '"' || line[i] === "'")) {
      const q = line[i];
      if (buffer) {
        segments.push({ type: "code", text: buffer });
        buffer = "";
      }
      let strBuf = q;
      i++;
      while (i < line.length) {
        if (line[i] === "\\" && i + 1 < line.length) {
          strBuf += line[i] + line[i + 1];
          i += 2;
          continue;
        }
        strBuf += line[i];
        if (line[i] === q) {
          i++;
          break;
        }
        i++;
      }
      segments.push({ type: "string", text: strBuf });
      continue;
    }

    buffer += line[i];
    i++;
  }

  if (buffer) {
    segments.push({ type: "code", text: buffer });
  }

  return { segments, endingQuoteState: currentQuote };
}

/**
 * Cleans up syntax spacing in code portions:
 * - Proper spacing around binary operators (=, ==, !=, <=, >=, <, >, +, -, *, /, etc.)
 * - Proper spacing after commas: "a,b" -> "a, b"
 * - Proper spacing for colons in dictionaries and annotations: "key : val" -> "key: val"
 * - Cleans multiple internal spaces (outside indentation)
 */
function cleanCodeSyntax(codeSegment: string): string {
  let s = codeSegment;

  // Normalize commas: ensure no space before comma, and single space after comma unless followed by closing bracket/quote/end
  s = s.replace(/\s*,\s*/g, ", ");
  s = s.replace(/,\s*([)\]}])/g, ",$1"); // trailing comma before closing bracket: foo(a, ) -> foo(a,)

  // Colons:
  // " : " -> ": "
  s = s.replace(/\s+:\s*/g, ": ");
  // " :" at end of statement (e.g. def foo() : -> def foo():)
  s = s.replace(/\s+:/g, ":");

  // Arrow return type: " -> "
  s = s.replace(/\s*->\s*/g, " -> ");

  // Comparison & Assignment operators (ensure single space around)
  // Be careful not to break **=, //=, <=, >=, ==, !=, +=, -=, *=, /=
  s = s.replace(/\s*(==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\/\/=|\*\*=)\s*/g, " $1 ");

  // Single = assignment: replace solitary = with " = ", but avoid ==, !=, <=, >=, +=, -=, etc.
  s = s.replace(/(?<![=!<>+\-*/%])\s*=\s*(?![=])/g, " = ");

  // Comparison < and > (not inside arrow ->, not inside << or >>)
  s = s.replace(/(?<!-)\s*<\s*(?![=<])/g, " < ");
  s = s.replace(/(?<![->])\s*>\s*(?![=>])/g, " > ");

  // Cleanup any accidental double spaces introduced in the code segment
  s = s.replace(/ {2,}/g, " ");

  // Clean space right after opening brackets or before closing brackets: ( a ) -> (a)
  s = s.replace(/\(\s+/g, "(");
  s = s.replace(/\s+\)/g, ")");
  s = s.replace(/\[\s+/g, "[");
  s = s.replace(/\s+\]/g, "]");
  s = s.replace(/\{\s+/g, "{");
  s = s.replace(/\s+\}/g, "}");

  return s;
}

/**
 * Cleans up comment format:
 * "#comment" -> "# comment" (unless shebang, special directive, or separator like "###")
 */
function cleanCommentSyntax(comment: string): string {
  if (comment.startsWith("#!") || comment.startsWith("#-*-") || comment.startsWith("# coding")) {
    return comment;
  }
  // If it starts with '#' followed immediately by a letter or digit, insert space
  if (/^#[a-zA-Z0-9]/.test(comment)) {
    return "# " + comment.slice(1);
  }
  return comment;
}

/**
 * Main Python Auto-Formatting function
 */
export function formatPythonCode(rawCode: string): FormatResult {
  if (!rawCode || rawCode.trim() === "") {
    return { code: rawCode, changed: false, message: "Code is empty" };
  }

  // 1. Normalize line endings and convert tabs to 4 spaces
  const normalized = rawCode.replace(/\r\n/g, "\n").replace(/\t/g, "    ");
  const rawLines = normalized.split("\n");

  let multilineQuoteState: string | null = null;
  let currentIndentLevel = 0;
  let bracketDepth = 0; // nesting depth for ( ) [ ] { }
  const formattedLines: string[] = [];

  for (let idx = 0; idx < rawLines.length; idx++) {
    const rawLine = rawLines[idx];
    const trimmed = rawLine.trim();

    // If blank line
    if (trimmed === "") {
      if (multilineQuoteState) {
        // Inside docstring, keep as empty line
        formattedLines.push("");
      } else {
        // Avoid more than 2 consecutive blank lines (PEP 8)
        const last1 = formattedLines[formattedLines.length - 1];
        const last2 = formattedLines[formattedLines.length - 2];
        if (last1 === "" && last2 === "") {
          // Skip third blank line
          continue;
        }
        formattedLines.push("");
      }
      continue;
    }

    // Inside active multiline string: preserve exact indentation or content
    if (multilineQuoteState) {
      formattedLines.push(rawLine.trimEnd());
      // Check if docstring ends on this line
      const endQuoteIdx = rawLine.indexOf(multilineQuoteState);
      if (endQuoteIdx !== -1) {
        multilineQuoteState = null;
      }
      continue;
    }

    // Parse code segments, strings, and comments
    const { segments, endingQuoteState } = parseLineSegments(trimmed, multilineQuoteState);
    multilineQuoteState = endingQuoteState;

    // Format individual code and comment segments
    let formattedContent = segments
      .map((seg) => {
        if (seg.type === "code") {
          return cleanCodeSyntax(seg.text);
        } else if (seg.type === "comment") {
          return cleanCommentSyntax(seg.text);
        }
        return seg.text; // strings are kept untouched
      })
      .join("");

    // Trim outer whitespace of the reconstructed line
    formattedContent = formattedContent.trim();

    // Determine Dedent for the CURRENT line:
    // 1. Keywords: elif, else, except, finally
    const isDedentKeyword = /^(elif\b|else\b|except\b|finally\b)/.test(formattedContent);

    // 2. Closing brackets at the start of line: ), ], }
    const startsWithClosingBracket = /^[)\]}]+/.test(formattedContent);

    // Check if previous line had a statement that signals returning to parent scope (pass, return, raise, break, continue)
    let lineIndent = currentIndentLevel;
    if (isDedentKeyword) {
      lineIndent = Math.max(0, currentIndentLevel - 1);
    } else if (startsWithClosingBracket) {
      lineIndent = Math.max(0, currentIndentLevel - 1);
    }

    // If we're inside parentheses/brackets from previous lines and not a dedent keyword, give a continuation indent
    let appliedIndent = lineIndent;
    if (bracketDepth > 0 && !isDedentKeyword && !startsWithClosingBracket && currentIndentLevel === 0) {
      appliedIndent = 1;
    }

    const indentSpaces = "    ".repeat(appliedIndent);
    formattedLines.push(indentSpaces + formattedContent);

    // Calculate Indent Level for the NEXT line:
    // Does this line end with ':' (ignoring comments)
    // Extract code part without comments
    const codeWithoutComment = segments
      .filter((s) => s.type !== "comment")
      .map((s) => s.text)
      .join("")
      .trim();

    if (codeWithoutComment.endsWith(":")) {
      currentIndentLevel = lineIndent + 1;
    } else if (isDedentKeyword) {
      // If an else: or elif: or except: line ends with ':', next line goes inside it
      if (codeWithoutComment.endsWith(":")) {
        currentIndentLevel = lineIndent + 1;
      } else {
        currentIndentLevel = lineIndent;
      }
    }

    // Track bracket balance: ( ) [ ] { }
    for (const seg of segments) {
      if (seg.type === "code") {
        const opens = (seg.text.match(/[[({]/g) || []).length;
        const closes = (seg.text.match(/[\])}]/g) || []).length;
        bracketDepth = Math.max(0, bracketDepth + opens - closes);
      }
    }
  }

  // Remove leading empty lines
  while (formattedLines.length > 0 && formattedLines[0] === "") {
    formattedLines.shift();
  }

  // Ensure trailing newline
  let result = formattedLines.join("\n");
  if (result.length > 0 && !result.endsWith("\n")) {
    result += "\n";
  }

  const changed = result !== rawCode;
  return {
    code: result,
    changed,
    message: changed ? "Code formatted successfully" : "Code is already clean",
  };
}
