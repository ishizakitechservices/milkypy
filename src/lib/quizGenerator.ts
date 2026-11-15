import { CurriculumLesson, CurriculumModule } from "../data/curriculum/schema";
import { UserProgress } from "../types";
import { LessonMasteryRecord, QuizScope } from "./quizStorage";

export interface DynamicQuizQuestion {
  id: string;
  lessonId: string;
  moduleId?: string;
  moduleTitle?: string;
  topicTitle: string;
  conceptTag?: string;
  type: "predict-output" | "multiple-choice" | "find-bug" | "code-fill";
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  source?: "procedural" | "curriculum" | "ai";
}

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeId(prefix = "quiz"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

function shuffleOptions(
  correctText: string,
  distractors: string[]
): { options: string[]; correctIndex: number } {
  const uniqueDistractors: string[] = [];
  for (const d of distractors) {
    if (d !== correctText && !uniqueDistractors.includes(d)) {
      uniqueDistractors.push(d);
    }
  }
  const chosenDistractors = uniqueDistractors
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const all = [correctText, ...chosenDistractors].sort(() => Math.random() - 0.5);
  return {
    options: all,
    correctIndex: all.indexOf(correctText),
  };
}

const PERSON_NAMES = ["Alice", "Maya", "Liam", "Noah", "Zara", "Kenji", "Priya", "Owen"];
const ITEM_WORDS = ["apple", "mango", "cherry", "kiwi", "peach", "grape", "melon"];
const WORDS = ["Python", "MilkyPy", "Developer", "Algorithm", "Compiler", "Function"];

/**
 * Extract multiple-choice questions authored directly in curriculum.json
 */
export function extractCurriculumMcqs(
  lesson: CurriculumLesson,
  module: CurriculumModule
): DynamicQuizQuestion[] {
  const results: DynamicQuizQuestion[] = [];
  for (const section of lesson.sections || []) {
    if (section.type === "practice") {
      for (const q of section.questions || []) {
        if (
          q.type === "multiple-choice" &&
          Array.isArray(q.options) &&
          q.options.length >= 2
        ) {
          let correctIdx =
            typeof q.correctIndex === "number" ? q.correctIndex : -1;
          if (correctIdx < 0 && q.correctAnswer) {
            correctIdx = q.options.findIndex(
              (o) =>
                o.trim().toLowerCase() === q.correctAnswer!.trim().toLowerCase()
            );
          }
          if (correctIdx >= 0 && correctIdx < q.options.length) {
            results.push({
              id: `curr-${lesson.id}-${q.id}`,
              lessonId: lesson.id,
              moduleId: module.id,
              moduleTitle: module.title,
              topicTitle: lesson.title,
              conceptTag: lesson.conceptsIntroduced?.[0]?.replace(/^concept-/, "") || "Curriculum",
              type: q.codeSnippet ? "predict-output" : "multiple-choice",
              question: q.question || q.prompt || "Choose the best answer:",
              codeSnippet: q.codeSnippet || undefined,
              options: q.options,
              correctIndex: correctIdx,
              explanation:
                q.explanation ||
                `Review "${lesson.title}" in ${module.title} for the full concept walkthrough.`,
              hint: q.hint || "Think carefully about how Python evaluates each line.",
              difficulty:
                lesson.difficulty === "intermediate"
                  ? "intermediate"
                  : lesson.difficulty === "advanced"
                  ? "advanced"
                  : "beginner",
              source: "curriculum",
            });
          }
        }
      }
    }
  }
  return results;
}

type QuestionVariantFactory = () => DynamicQuizQuestion;

/**
 * Generates a rich, randomized procedural question mapped accurately to any of the 24 lessons
 * or freeform lesson title/concept string.
 */
export function generateRandomQuiz(
  lessonId: string,
  lessonTitle: string,
  lessonConcept = "",
  preferredDifficulty?: "beginner" | "intermediate" | "advanced",
  moduleMeta?: { id: string; title: string }
): DynamicQuizQuestion {
  const qId = makeId("quiz");
  const key = `${lessonId} ${lessonTitle} ${lessonConcept}`.toLowerCase();
  const baseMeta = {
    id: qId,
    lessonId,
    moduleId: moduleMeta?.id,
    moduleTitle: moduleMeta?.title,
    topicTitle: lessonTitle,
    source: "procedural" as const,
  };

  // Helper to attach default meta safely
  const build = (
    partial: Omit<
      DynamicQuizQuestion,
      "id" | "lessonId" | "moduleId" | "moduleTitle" | "topicTitle" | "source"
    >
  ): DynamicQuizQuestion => ({
    ...baseMeta,
    ...partial,
  });

  // ------------------------------------------------------------------
  // MODULE 1: Python Basics & Syntax
  // ------------------------------------------------------------------

  // 1.1 Python Introduction / print basics
  if (key.includes("01-01") || key.includes("what-is-python") || key.includes("introduction")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const line1 = sample(["Loading...", "Starting...", "Booting..."]);
        const line2 = sample(["Ready!", "Complete!", "Hello, Python!"]);
        const { options, correctIndex } = shuffleOptions(
          `${line1}\n${line2}`,
          [`${line2}\n${line1}`, `${line1} ${line2}`, `print("${line1}")`]
        );
        return build({
          conceptTag: "Top-to-Bottom Execution",
          type: "predict-output",
          question: "In what exact order does Python execute and print these statements?",
          codeSnippet: `print("${line1}")\nprint("${line2}")`,
          options,
          correctIndex,
          explanation: `Python executes scripts sequentially from top to bottom. The first print() prints "${line1}" on line 1, and the second prints "${line2}" on a new line below it.`,
          hint: "Python reads your code line by line from top to bottom, and each print() adds a newline.",
          difficulty: "beginner",
        });
      },
      () => {
        const msg = sample(["Welcome!", "Hi there!", "Let's code!"]);
        const { options, correctIndex } = shuffleOptions("NameError (print is case-sensitive)", [
          msg,
          `"${msg}"`,
          "Nothing is printed, no error",
        ]);
        return build({
          conceptTag: "Case Sensitivity",
          type: "find-bug",
          question: "What happens when you capitalize Print instead of print?",
          codeSnippet: `Print("${msg}")`,
          options,
          correctIndex,
          explanation: `Python is strictly case-sensitive. The built-in function is lowercase print(), not Print(). Using Print() raises NameError: name 'Print' is not defined.`,
          hint: "Check the capitalization of Python's built-in print function.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // 1.2 The print() Function (sep= and end=)
  if (key.includes("01-02") || key.includes("the-print-function") || key.includes("sep") || key.includes("end=")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const sep = sample(["-", " | ", "/", "_"]);
        const words = sample([
          ["2026", "11", "14"],
          ["A", "B", "C"],
          ["red", "green", "blue"],
        ]);
        const correct = words.join(sep);
        const { options, correctIndex } = shuffleOptions(correct, [
          words.join(" "),
          words.join("") + sep,
          words.join("\n"),
        ]);
        return build({
          conceptTag: "print(sep=...)",
          type: "predict-output",
          question: "What does this print() call output when using the sep= parameter?",
          codeSnippet: `print("${words[0]}", "${words[1]}", "${words[2]}", sep="${sep}")`,
          options,
          correctIndex,
          explanation: `By default print() separates comma arguments with a single space (" "). Passing sep="${sep}" replaces that space with "${sep}" between each value.`,
          hint: "sep stands for separator—it sits between each argument passed to print().",
          difficulty: "beginner",
        });
      },
      () => {
        const first = sample(["Score:", "Level:", "Count:"]);
        const val = randInt(10, 99);
        const { options, correctIndex } = shuffleOptions(`${first} ${val}`, [
          `${first}\n${val}`,
          `${first}${val}`,
          `${val} ${first}`,
        ]);
        return build({
          conceptTag: "print(end=...)",
          type: "predict-output",
          question: "What is printed on screen when end=\" \" is specified on the first print()?",
          codeSnippet: `print("${first}", end=" ")\nprint(${val})`,
          options,
          correctIndex,
          explanation: `Normally print() finishes with a newline (\\n). Setting end=" " tells Python to finish with a single space instead, so the second print(${val}) appears on the same line.`,
          hint: "end=\" \" prevents the line break and inserts a space before the next print().",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // 1.4 Python Comments
  if (key.includes("01-04") || key.includes("comments")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const a = randInt(4, 9);
        const b = randInt(2, 6);
        const { options, correctIndex } = shuffleOptions(String(a), [
          String(a + b),
          `${a}\n${a + b}`,
          "SyntaxError",
        ]);
        return build({
          conceptTag: "Comments",
          type: "predict-output",
          question: "What does this snippet print to the console?",
          codeSnippet: `x = ${a}\n# x = x + ${b}\nprint(x)`,
          options,
          correctIndex,
          explanation: `Anything starting with # is a comment and is completely ignored by Python. Because line 2 is commented out, x stays ${a}.`,
          hint: "Lines starting with # are never executed by Python.",
          difficulty: "beginner",
        });
      },
      () => {
        const val = randInt(10, 50);
        const { options, correctIndex } = shuffleOptions(String(val), [
          `${val} # show score`,
          "SyntaxError: invalid comment",
          "Nothing is printed",
        ]);
        return build({
          conceptTag: "Inline Comments",
          type: "predict-output",
          question: "What output does Python produce when a # comment follows code on the same line?",
          codeSnippet: `score = ${val} # starting score\nprint(score) # show score`,
          options,
          correctIndex,
          explanation: `Inline comments start at the # symbol and extend to the end of that line. Python runs print(score) normally and ignores "# show score".`,
          hint: "Python ignores everything from # to the end of that line.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // 1.3 Numbers & Math
  if (
    key.includes("01-03") ||
    key.includes("numbers-and-math") ||
    key.includes("math") ||
    key.includes("arithmetic") ||
    key.includes("precedence")
  ) {
    const a = randInt(8, 19);
    const b = randInt(3, 5);
    const mode = sample(["modulo", "floor_div", "exponent", "precedence"]);

    if (mode === "modulo") {
      const correct = a % b;
      const { options, correctIndex } = shuffleOptions(String(correct), [
        String(Math.floor(a / b)),
        String(correct + 1),
        String(Math.max(0, correct - 1)),
      ]);
      return build({
        conceptTag: "Modulo (%)",
        type: "predict-output",
        question: "What is the exact output of this modulo remainder operation?",
        codeSnippet: `a = ${a}\nb = ${b}\nprint(a % b)`,
        options,
        correctIndex,
        explanation: `The modulo operator (%) gives the remainder after integer division. ${a} divided by ${b} is ${Math.floor(a / b)} with a remainder of ${correct}.`,
        hint: "Modulo (%) returns only the leftover remainder.",
        difficulty: "beginner",
      });
    }

    if (mode === "floor_div") {
      const correct = Math.floor(a / b);
      const { options, correctIndex } = shuffleOptions(String(correct), [
        (a / b).toFixed(2),
        String(a % b),
        String(Math.ceil(a / b)),
      ]);
      return build({
        conceptTag: "Floor Division (//)",
        type: "predict-output",
        question: "What does floor division (//) print here?",
        codeSnippet: `print(${a} // ${b})`,
        options,
        correctIndex,
        explanation: `Floor division (//) divides and rounds down to the whole integer (${correct}), whereas single slash (/) always returns a decimal float.`,
        hint: "// drops the decimal remainder and keeps the whole integer quotient.",
        difficulty: "beginner",
      });
    }

    if (mode === "exponent") {
      const base = randInt(2, 4);
      const exp = randInt(3, 4);
      const correct = Math.pow(base, exp);
      const { options, correctIndex } = shuffleOptions(String(correct), [
        String(base * exp),
        String(base + exp),
        String(correct - base),
      ]);
      return build({
        conceptTag: "Exponents (**)",
        type: "predict-output",
        question: "What value is computed by Python's ** operator?",
        codeSnippet: `print(${base} ** ${exp})`,
        options,
        correctIndex,
        explanation: `In Python, ** raises the left number to the power of the right number (${base} raised to ${exp} = ${correct}). Note that * multiplies (${base * exp}).`,
        hint: "** is exponentiation (power), not multiplication.",
        difficulty: "beginner",
      });
    }

    const c = randInt(2, 4);
    const d = randInt(2, 3);
    const e = randInt(3, 6);
    const correct = c + d * e;
    const { options, correctIndex } = shuffleOptions(String(correct), [
      String((c + d) * e),
      String(c * d + e),
      String(correct + d),
    ]);
    return build({
      conceptTag: "Operator Precedence",
      type: "predict-output",
      question: "Which value is printed when following Python's order of operations?",
      codeSnippet: `result = ${c} + ${d} * ${e}\nprint(result)`,
      options,
      correctIndex,
      explanation: `Multiplication (*) binds tighter than addition (+). Python calculates ${d} * ${e} = ${d * e} first, then adds ${c} to produce ${correct}.`,
      hint: "Multiply before you add.",
      difficulty: "beginner",
    });
  }

  // ------------------------------------------------------------------
  // MODULE 2: Variables & Core Data Types
  // ------------------------------------------------------------------

  // 2.2 Variable Naming Rules
  if (key.includes("02-02") || key.includes("variable-names") || key.includes("naming")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const good = sample(["user_score", "total_points_2", "_max_hp", "player1_name"]);
        const bad1 = sample(["2nd_player", "1st_score", "9_lives"]);
        const bad2 = sample(["user-score", "first-name", "max-hp"]);
        const bad3 = sample(["my score", "for", "class"]);
        const { options, correctIndex } = shuffleOptions(good, [bad1, bad2, bad3]);
        return build({
          conceptTag: "Variable Naming Rules",
          type: "multiple-choice",
          question: "Which of these is a VALID Python variable name?",
          options,
          correctIndex,
          explanation: `Variable names in Python can contain letters, numbers, and underscores (_), cannot start with a digit, cannot contain hyphens (-) or spaces, and cannot be reserved keywords like "for" or "class". Therefore, ${good} is valid.`,
          hint: "Python variables use underscores (_), never hyphens (-) or leading numbers.",
          difficulty: "beginner",
        });
      },
      () => {
        const { options, correctIndex } = shuffleOptions("SyntaxError", [
          "100",
          "player-score",
          "TypeError",
        ]);
        return build({
          conceptTag: "Invalid Identifiers",
          type: "find-bug",
          question: "What happens when Python attempts to run this variable assignment?",
          codeSnippet: `player-score = 100\nprint(player-score)`,
          options,
          correctIndex,
          explanation: `Python treats "-" as the subtraction operator, not part of a variable name. Use snake_case (player_score = 100) instead to avoid a SyntaxError.`,
          hint: "Think about what the minus sign (-) means in Python.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // 2.3 Python Data Types & type()
  if (key.includes("02-03") || key.includes("data-types") || key.includes("type-function")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const num = randInt(12, 88);
        const { options, correctIndex } = shuffleOptions("<class 'str'>", [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'bool'>",
        ]);
        return build({
          conceptTag: "type() Inspection",
          type: "predict-output",
          question: "What does type() report when a number is wrapped in quotes?",
          codeSnippet: `value = "${num}"\nprint(type(value))`,
          options,
          correctIndex,
          explanation: `Anything inside quotation marks ("${num}" or '${num}') is stored as text—a string (<class 'str'>)—even if the characters look like digits.`,
          hint: "Look closely at the quotes around the value.",
          difficulty: "beginner",
        });
      },
      () => {
        const whole = randInt(2, 9);
        const { options, correctIndex } = shuffleOptions("<class 'float'>", [
          "<class 'int'>",
          "<class 'str'>",
          "<class 'bool'>",
        ]);
        return build({
          conceptTag: "int vs float",
          type: "predict-output",
          question: "What type does single-slash division (/) ALWAYS return in Python 3?",
          codeSnippet: `result = ${whole * 2} / 2\nprint(type(result))`,
          options,
          correctIndex,
          explanation: `Even though ${whole * 2} / 2 equals ${whole}.0 cleanly, Python 3's true division operator (/) always returns a <class 'float'>.`,
          hint: "Single slash (/) always produces a floating-point number in Python 3.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // 2.4 Type Casting
  if (key.includes("02-04") || key.includes("type-conversion") || key.includes("casting")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const a = randInt(10, 30);
        const b = randInt(5, 15);
        const { options, correctIndex } = shuffleOptions(String(a + b), [
          `${a}${b}`,
          "TypeError",
          `"${a} + ${b}"`,
        ]);
        return build({
          conceptTag: "int() Casting",
          type: "predict-output",
          question: "What is printed after casting the string with int()?",
          codeSnippet: `text_num = "${a}"\ntotal = int(text_num) + ${b}\nprint(total)`,
          options,
          correctIndex,
          explanation: `int("${a}") converts the string "${a}" into the integer ${a}. Adding ${b} then performs numeric addition to give ${a + b}.`,
          hint: "int() turns numeric text into an integer you can do math with.",
          difficulty: "beginner",
        });
      },
      () => {
        const val = randInt(15, 95);
        const { options, correctIndex } = shuffleOptions("TypeError", [
          `"Score: ${val}"`,
          `Score: ${val}`,
          "ValueError",
        ]);
        return build({
          conceptTag: "str + int Trap",
          type: "find-bug",
          question: "What happens when you concatenate a string and an integer directly with +?",
          codeSnippet: `score = ${val}\nprint("Score: " + score)`,
          options,
          correctIndex,
          explanation: `Python will not silently convert an int into a str when using +. Use str(score) or an f-string like f"Score: {score}" to avoid a TypeError.`,
          hint: "Can Python add a str and an int with +?",
          difficulty: "beginner",
        });
      },
      () => {
        const whole = randInt(3, 8);
        const decimal = randInt(7, 9);
        const { options, correctIndex } = shuffleOptions(String(whole), [
          String(whole + 1),
          `${whole}.${decimal}`,
          "ValueError",
        ]);
        return build({
          conceptTag: "int(float) Truncation",
          type: "predict-output",
          question: "What does int() do when given a decimal float?",
          codeSnippet: `num = ${whole}.${decimal}\nprint(int(num))`,
          options,
          correctIndex,
          explanation: `int() truncates toward zero (drops the decimal digits) rather than rounding up, so int(${whole}.${decimal}) becomes ${whole}.`,
          hint: "int() removes the fractional part—it does not round to the nearest integer.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // 2.1 Python Variables (Reassignment)
  if (key.includes("02-01") || key.includes("creating-variables")) {
    const start = randInt(4, 12);
    const delta = randInt(3, 7);
    const mult = randInt(2, 3);
    const finalVal = (start + delta) * mult;
    const { options, correctIndex } = shuffleOptions(String(finalVal), [
      String(start),
      String(start + delta),
      String(start * mult),
    ]);
    return build({
      conceptTag: "Variable Reassignment",
      type: "predict-output",
      question: "What is the final value printed for coins after these reassignments?",
      codeSnippet: `coins = ${start}\ncoins = coins + ${delta}\ncoins = coins * ${mult}\nprint(coins)`,
      options,
      correctIndex,
      explanation: `Variables update step by step: coins starts at ${start}, becomes ${start + delta} on line 2, and becomes (${start + delta}) * ${mult} = ${finalVal} on line 3.`,
      hint: "Trace the value of coins line by line from top to bottom.",
      difficulty: "beginner",
    });
  }

  // ------------------------------------------------------------------
  // MODULE 3: Operators & Booleans
  // ------------------------------------------------------------------

  // 3.1 Comparison Operators
  if (key.includes("03-01") || key.includes("comparison-operators")) {
    const x = randInt(10, 20);
    const threshold = randInt(10, 20);
    const op = sample([">=", "!=", "=="] as const);
    const result =
      op === ">=" ? x >= threshold : op === "!=" ? x !== threshold : x === threshold;
    const correctStr = result ? "True" : "False";
    const wrongStr = result ? "False" : "True";
    const { options, correctIndex } = shuffleOptions(correctStr, [
      wrongStr,
      String(x),
      "SyntaxError",
    ]);
    return build({
      conceptTag: "Comparison Operators",
      type: "predict-output",
      question: "What boolean value does this comparison expression print?",
      codeSnippet: `x = ${x}\ny = ${threshold}\nprint(x ${op} y)`,
      options,
      correctIndex,
      explanation: `Comparing ${x} ${op} ${threshold} evaluates to ${correctStr}. Comparison operators always return a boolean (True or False).`,
      hint: "Plug in the values of x and y and check whether the comparison holds.",
      difficulty: "beginner",
    });
  }

  // 3.2 Logical Operators (and, or, not)
  if (key.includes("03-02") || key.includes("logical-operators")) {
    const hasKey = sample([true, false]);
    const isAdmin = sample([true, false]);
    const mode = sample(["and", "or", "not"] as const);

    const pyBool = (b: boolean) => (b ? "True" : "False");
    let code = "";
    let answer = false;
    let explain = "";

    if (mode === "and") {
      code = `has_key = ${pyBool(hasKey)}\nis_admin = ${pyBool(isAdmin)}\nprint(has_key and is_admin)`;
      answer = hasKey && isAdmin;
      explain = `'and' returns True ONLY when both sides are True. Here ${pyBool(hasKey)} and ${pyBool(isAdmin)} evaluates to ${pyBool(answer)}.`;
    } else if (mode === "or") {
      code = `has_key = ${pyBool(hasKey)}\nis_admin = ${pyBool(isAdmin)}\nprint(has_key or is_admin)`;
      answer = hasKey || isAdmin;
      explain = `'or' returns True if AT LEAST ONE side is True. Here ${pyBool(hasKey)} or ${pyBool(isAdmin)} evaluates to ${pyBool(answer)}.`;
    } else {
      code = `locked = ${pyBool(hasKey)}\nprint(not locked)`;
      answer = !hasKey;
      explain = `'not' flips a boolean value to its opposite: not ${pyBool(hasKey)} evaluates to ${pyBool(answer)}.`;
    }

    const { options, correctIndex } = shuffleOptions(pyBool(answer), [
      pyBool(!answer),
      "None",
      "TypeError",
    ]);
    return build({
      conceptTag: `Logical '${mode}'`,
      type: "predict-output",
      question: `What does this boolean expression with '${mode}' print?`,
      codeSnippet: code,
      options,
      correctIndex,
      explanation: explain,
      hint: "Evaluate each boolean condition carefully using and / or / not truth rules.",
      difficulty: "beginner",
    });
  }

  // 3.3 F-Strings & String Operations
  if (key.includes("03-03") || key.includes("fstring") || key.includes("string")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const name = sample(PERSON_NAMES);
        const val1 = randInt(3, 8);
        const val2 = randInt(2, 5);
        const product = val1 * val2;
        const { options, correctIndex } = shuffleOptions(`${name}: ${product}`, [
          `${name}: {${val1} * ${val2}}`,
          `${name}: ${val1 + val2}`,
          "SyntaxError",
        ]);
        return build({
          conceptTag: "F-Strings",
          type: "predict-output",
          question: "What does this f-string evaluate and print?",
          codeSnippet: `player = "${name}"\na = ${val1}\nb = ${val2}\nprint(f"{player}: {a * b}")`,
          options,
          correctIndex,
          explanation: `In an f-string, Python evaluates every expression inside { } at runtime. {player} becomes "${name}" and {a * b} becomes ${product}.`,
          hint: "Anything inside curly braces {} in an f-string runs as live Python.",
          difficulty: "beginner",
        });
      },
      () => {
        const points = randInt(15, 45);
        const { options, correctIndex } = shuffleOptions("Points: {points}", [
          `Points: ${points}`,
          "NameError",
          "SyntaxError",
        ]);
        return build({
          conceptTag: "F-String Prefix Trap",
          type: "find-bug",
          question: "Watch carefully! Notice there is NO 'f' before the string quote. What is printed?",
          codeSnippet: `points = ${points}\nprint("Points: {points}")`,
          options,
          correctIndex,
          explanation: `Without the leading f (f"..."), Python treats "{points}" as plain literal characters instead of substituting the variable.`,
          hint: "Check whether the string starts with f\"...\" or plain \"...\".",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // ------------------------------------------------------------------
  // MODULE 4: Conditions & Decisions (If...Else)
  // ------------------------------------------------------------------

  // 4.1 The if Statement & Indentation
  if (key.includes("04-01") || key.includes("the-if-statement") || key.includes("indentation")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const score = randInt(20, 45);
        const { options, correctIndex } = shuffleOptions("Done", [
          "High Score!\nDone",
          "High Score!",
          "Nothing is printed",
        ]);
        return build({
          conceptTag: "if & Indentation",
          type: "predict-output",
          question: "Pay attention to indentation! What does this code output?",
          codeSnippet: `score = ${score}\nif score >= 80:\n    print("High Score!")\nprint("Done")`,
          options,
          correctIndex,
          explanation: `Since score (${score}) < 80, the indented line print("High Score!") is skipped. However, print("Done") is NOT indented inside the if block, so it always runs!`,
          hint: "Only indented lines belong to the if block.",
          difficulty: "beginner",
        });
      },
      () => {
        const { options, correctIndex } = shuffleOptions(
          "SyntaxError (missing ':' at end of if line)",
          [
            "Runs normally and prints VIP",
            "IndentationError",
            "TypeError",
          ]
        );
        return build({
          conceptTag: "Colon Syntax",
          type: "find-bug",
          question: "What happens when Python tries to parse this if statement?",
          codeSnippet: `is_vip = True\nif is_vip\n    print("VIP")`,
          options,
          correctIndex,
          explanation: `Every compound header in Python (if, elif, else, for, while, def) MUST end with a colon (:). Omitting it causes a SyntaxError.`,
          hint: "Inspect the end of the 'if is_vip' line carefully.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // 4.2 else and elif
  if (key.includes("04-02") || key.includes("else-and-elif") || key.includes("elif")) {
    const temp = randInt(82, 95);
    const { options, correctIndex } = shuffleOptions("Warm", [
      "Warm\nVery Hot",
      "Very Hot",
      "Mild",
    ]);
    return build({
      conceptTag: "elif Top-Down Branching",
      type: "predict-output",
      question: "Both conditions (>= 70 and >= 80) are true mathematically. What does elif print?",
      codeSnippet: `temp = ${temp}\nif temp >= 70:\n    print("Warm")\nelif temp >= 80:\n    print("Very Hot")\nelse:\n    print("Mild")`,
      options,
      correctIndex,
      explanation: `An if / elif / else chain executes at most ONE branch—the FIRST condition that evaluates to True from top to bottom. Because temp >= 70 is checked first and is True, Python prints "Warm" and skips the rest.`,
      hint: "In an if-elif-else chain, Python stops checking once the first True condition matches.",
      difficulty: "intermediate",
    });
  }

  // ------------------------------------------------------------------
  // MODULE 5: Loops (Repeating Things)
  // ------------------------------------------------------------------

  // 5.1 while Loop
  if (key.includes("05-01") || key.includes("while-loops")) {
    const start = randInt(1, 2);
    const limit = start + 3;
    const vals: number[] = [];
    for (let c = start; c < limit; c++) vals.push(c);
    const correct = vals.join(" ");
    const { options, correctIndex } = shuffleOptions(correct, [
      [...vals, limit].join(" "),
      vals.slice(0, -1).join(" "),
      `${limit}`,
    ]);
    return build({
      conceptTag: "while Loop",
      type: "predict-output",
      question: "What numbers does this while loop print before stopping?",
      codeSnippet: `count = ${start}\nwhile count < ${limit}:\n    print(count, end=" ")\n    count += 1`,
      options,
      correctIndex,
      explanation: `The loop runs while count < ${limit}: it prints ${vals.join(", ")}. Once count increments to ${limit}, the condition ${limit} < ${limit} becomes False and the loop exits.`,
      hint: "Trace count on each pass and check when count < limit stops being True.",
      difficulty: "intermediate",
    });
  }

  // 5.2 for Loop & range()
  if (key.includes("05-02") || key.includes("for-loops-and-range") || key.includes("range")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const stop = randInt(4, 6);
        const seq = Array.from({ length: stop }, (_, i) => i).join(" ");
        const oneBased = Array.from({ length: stop }, (_, i) => i + 1).join(" ");
        const incStop = Array.from({ length: stop + 1 }, (_, i) => i).join(" ");
        const { options, correctIndex } = shuffleOptions(seq, [
          oneBased,
          incStop,
          `0 ${stop}`,
        ]);
        return build({
          conceptTag: "range(stop)",
          type: "predict-output",
          question: "What sequence does range() with a single argument generate?",
          codeSnippet: `for i in range(${stop}):\n    print(i, end=" ")`,
          options,
          correctIndex,
          explanation: `range(${stop}) starts at 0 by default and stops BEFORE ${stop}, producing ${seq}.`,
          hint: "range(n) starts at 0 and excludes n itself.",
          difficulty: "beginner",
        });
      },
      () => {
        const start = randInt(1, 2);
        const stop = randInt(8, 11);
        const step = 2;
        const nums: number[] = [];
        for (let i = start; i < stop; i += step) nums.push(i);
        const correctStr = nums.join(" ");
        const { options, correctIndex } = shuffleOptions(correctStr, [
          nums.concat([stop]).join(" "),
          nums.map((n) => n + 1).join(" "),
          nums.slice(0, -1).join(" "),
        ]);
        return build({
          conceptTag: "range(start, stop, step)",
          type: "predict-output",
          question: "What numbers are printed with a step argument in range()?",
          codeSnippet: `for n in range(${start}, ${stop}, ${step}):\n    print(n, end=" ")`,
          options,
          correctIndex,
          explanation: `range(${start}, ${stop}, ${step}) starts at ${start}, adds ${step} each turn, and stops strictly before ${stop}: ${correctStr}.`,
          hint: "The 3rd argument in range() is the step increment.",
          difficulty: "intermediate",
        });
      },
    ];
    return sample(variants)();
  }

  // 5.3 break and continue
  if (key.includes("05-03") || key.includes("break-and-continue") || key.includes("break") || key.includes("continue")) {
    const useBreak = Math.random() > 0.5;
    if (useBreak) {
      const { options, correctIndex } = shuffleOptions("1 2", [
        "1 2 3",
        "1 2 4 5",
        "1 2 3 4 5",
      ]);
      return build({
        conceptTag: "break Statement",
        type: "predict-output",
        question: "What is printed before 'break' halts the loop?",
        codeSnippet: `for i in [1, 2, 3, 4, 5]:\n    if i == 3:\n        break\n    print(i, end=" ")`,
        options,
        correctIndex,
        explanation: `'break' exits the entire loop immediately. When i reaches 3, print(i) does not run and the loop terminates with 1 2 printed.`,
        hint: "break exits the loop completely.",
        difficulty: "intermediate",
      });
    }
    const { options, correctIndex } = shuffleOptions("1 2 4 5", [
      "1 2 3 4 5",
      "1 2",
      "3",
    ]);
    return build({
      conceptTag: "continue Statement",
      type: "predict-output",
      question: "What is printed when 'continue' runs at i == 3?",
      codeSnippet: `for i in [1, 2, 3, 4, 5]:\n    if i == 3:\n        continue\n    print(i, end=" ")`,
      options,
      correctIndex,
      explanation: `'continue' skips the remainder of the current iteration and moves to the next item. So i == 3 is skipped, while 1, 2, 4, and 5 still print.`,
      hint: "continue skips only the current pass and keeps looping.",
      difficulty: "intermediate",
    });
  }

  // ------------------------------------------------------------------
  // MODULE 6: Collections (Lists & Dictionaries)
  // ------------------------------------------------------------------

  // 6.1 Python Lists & Indexing
  if (key.includes("06-01") || key.includes("python-lists") || key.includes("indexing")) {
    const items = sample([
      ["red", "blue", "green", "gold"],
      ["cat", "dog", "fox", "owl"],
      ["oak", "pine", "birch", "maple"],
    ]);
    const negIdx = sample([-1, -2]);
    const correct = items[items.length + negIdx];
    const { options, correctIndex } = shuffleOptions(correct, [
      items[0],
      items[Math.abs(negIdx)],
      "IndexError",
    ]);
    return build({
      conceptTag: "List Negative Indexing",
      type: "predict-output",
      question: "Which element is retrieved by this negative list index?",
      codeSnippet: `items = ${JSON.stringify(items).replace(/"/g, '"')}\nprint(items[${negIdx}])`,
      options,
      correctIndex,
      explanation: `Negative indices count from the end of the list: -1 is the last item ("${items[items.length - 1]}") and -2 is second from the end ("${items[items.length - 2]}").`,
      hint: "Index -1 always refers to the final element in a list.",
      difficulty: "intermediate",
    });
  }

  // 6.2 List Methods (append, len, remove)
  if (key.includes("06-02") || key.includes("list-methods") || key.includes("append")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const { options, correctIndex } = shuffleOptions("None", [
          "[1, 2, 3, 4]",
          "[1, 2, 3]",
          "4",
        ]);
        return build({
          conceptTag: "In-Place .append()",
          type: "predict-output",
          question: "What does assigning the return value of .append() print?",
          codeSnippet: `nums = [1, 2, 3]\nout = nums.append(4)\nprint(out)`,
          options,
          correctIndex,
          explanation: `List methods like .append(), .remove(), and .sort() mutate the list in-place and return None. 'nums' becomes [1, 2, 3, 4], but 'out' is None.`,
          hint: ".append() modifies the original list directly instead of returning a new list.",
          difficulty: "intermediate",
        });
      },
      () => {
        const fruit = sample(ITEM_WORDS);
        const { options, correctIndex } = shuffleOptions("3", ["4", "2", "ValueError"]);
        return build({
          conceptTag: "len() & .remove()",
          type: "predict-output",
          question: "What does len(bag) return after calling .remove()?",
          codeSnippet: `bag = ["${fruit}", "pen", "${fruit}", "key"]\nbag.remove("${fruit}")\nprint(len(bag))`,
          options,
          correctIndex,
          explanation: `bag.remove("${fruit}") removes ONLY the first matching occurrence of "${fruit}", leaving 3 items in the list.`,
          hint: ".remove(value) deletes the first match, not every match.",
          difficulty: "intermediate",
        });
      },
    ];
    return sample(variants)();
  }

  // 6.3 Looping Through Lists
  if (key.includes("06-03") || key.includes("looping-through-lists") || key.includes("comprehension")) {
    const threshold = randInt(4, 6);
    const nums = [2, 5, 8, 3, 9];
    const sum = nums.filter((n) => n > threshold).reduce((a, b) => a + b, 0);
    const { options, correctIndex } = shuffleOptions(String(sum), [
      String(nums.reduce((a, b) => a + b, 0)),
      String(nums.filter((n) => n > threshold).length),
      String(sum + threshold),
    ]);
    return build({
      conceptTag: "List Filtering Accumulator",
      type: "predict-output",
      question: "What total does this list loop compute?",
      codeSnippet: `nums = [2, 5, 8, 3, 9]\ntotal = 0\nfor n in nums:\n    if n > ${threshold}:\n        total += n\nprint(total)`,
      options,
      correctIndex,
      explanation: `The loop visits each number in nums and adds only values strictly greater than ${threshold} (${nums.filter((n) => n > threshold).join(" + ")}), producing ${sum}.`,
      hint: "Add up only the elements in nums that pass n > " + threshold + ".",
      difficulty: "intermediate",
    });
  }

  // 6.4 Python Dictionaries
  if (key.includes("06-04") || key.includes("dictionaries") || key.includes("dict")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const missingKey = sample(["shield", "mana", "rank", "clan"]);
        const fallback = randInt(25, 90);
        const { options, correctIndex } = shuffleOptions(String(fallback), [
          `KeyError: '${missingKey}'`,
          "None",
          "0",
        ]);
        return build({
          conceptTag: "Dictionary .get()",
          type: "predict-output",
          question: "What does dict.get() return when the requested key is missing?",
          codeSnippet: `hero = {"name": "Nova", "hp": 100}\nprint(hero.get("${missingKey}", ${fallback}))`,
          options,
          correctIndex,
          explanation: `Unlike hero["${missingKey}"] which raises a KeyError if absent, .get(key, default) safely returns the fallback value (${fallback}).`,
          hint: "The second argument of .get() is the fallback when a key isn't found.",
          difficulty: "intermediate",
        });
      },
      () => {
        const newHp = randInt(40, 85);
        const { options, correctIndex } = shuffleOptions(String(newHp), [
          "100",
          String(100 + newHp),
          "KeyError",
        ]);
        return build({
          conceptTag: "Updating Dictionary Keys",
          type: "predict-output",
          question: "What happens when you assign to an existing dictionary key?",
          codeSnippet: `stats = {"hp": 100, "lvl": 2}\nstats["hp"] = ${newHp}\nprint(stats["hp"])`,
          options,
          correctIndex,
          explanation: `Dictionaries map each unique key to one value. Assigning stats["hp"] = ${newHp} overwrites the old value (100) with ${newHp}.`,
          hint: "Assigning to an existing key replaces its previous value.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // ------------------------------------------------------------------
  // MODULE 7: Functions & Reusable Blocks
  // ------------------------------------------------------------------

  // 7.1 Creating & Calling Functions
  if (key.includes("07-01") || key.includes("creating-functions")) {
    const { options, correctIndex } = shuffleOptions("Start\nRunning", [
      "Running\nStart",
      "Running",
      "Start",
    ]);
    return build({
      conceptTag: "def vs Calling",
      type: "predict-output",
      question: "When does code inside a def block actually execute?",
      codeSnippet: `def task():\n    print("Running")\n\nprint("Start")\ntask()`,
      options,
      correctIndex,
      explanation: `Defining a function with def only stores it in memory—it does not run yet. Python prints "Start" first, then executes task() when called with ().`,
      hint: "def defines a recipe; () actually runs it.",
      difficulty: "beginner",
    });
  }

  // 7.2 Function Parameters & Arguments
  if (key.includes("07-02") || key.includes("parameters-and-arguments") || key.includes("args")) {
    const x = randInt(6, 12);
    const y = randInt(2, 4);
    const { options, correctIndex } = shuffleOptions(String(x - y), [
      String(y - x),
      String(x + y),
      "TypeError",
    ]);
    return build({
      conceptTag: "Keyword Arguments",
      type: "predict-output",
      question: "What does this function output when arguments are passed by keyword?",
      codeSnippet: `def subtract(a, b):\n    return a - b\n\nprint(subtract(b=${y}, a=${x}))`,
      options,
      correctIndex,
      explanation: `Keyword arguments match by parameter name regardless of position. Here a gets ${x} and b gets ${y}, so ${x} - ${y} = ${x - y}.`,
      hint: "Match a and b by their names, not their left-to-right order.",
      difficulty: "intermediate",
    });
  }

  // 7.3 The return Statement
  if (key.includes("07-03") || key.includes("returning-values") || key.includes("return")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const val = randInt(4, 9);
        const { options, correctIndex } = shuffleOptions("None", [
          String(val * 2),
          "TypeError",
          "0",
        ]);
        return build({
          conceptTag: "return vs print()",
          type: "predict-output",
          question: "What value is stored in total when double() prints instead of returning?",
          codeSnippet: `def double(n):\n    print(n * 2)\n\ntotal = double(${val})\nprint(total)`,
          options,
          correctIndex,
          explanation: `double(${val}) prints ${val * 2}, then exits without a return statement—so Python implicitly returns None. Printing 'total' on the last line outputs None!`,
          hint: "A function without a return statement implicitly returns None.",
          difficulty: "intermediate",
        });
      },
      () => {
        const a = randInt(3, 8);
        const { options, correctIndex } = shuffleOptions(String(a + 5), [
          `${a + 5}\nDone`,
          "Done",
          "None",
        ]);
        return build({
          conceptTag: "Early Exit on return",
          type: "predict-output",
          question: "Does the print(\"Done\") line run after return?",
          codeSnippet: `def calc(x):\n    return x + 5\n    print("Done")\n\nprint(calc(${a}))`,
          options,
          correctIndex,
          explanation: `Executing 'return' immediately exits the function and hands the value back to the caller. Any lines indented after return in the same path never run.`,
          hint: "return ends the function execution right away.",
          difficulty: "intermediate",
        });
      },
    ];
    return sample(variants)();
  }

  // 7.4 Variable Scope & Default Parameters
  if (key.includes("07-04") || key.includes("variable-scope") || key.includes("scope")) {
    const variants: QuestionVariantFactory[] = [
      () => {
        const outer = randInt(10, 30);
        const inner = randInt(50, 90);
        const { options, correctIndex } = shuffleOptions(String(outer), [
          String(inner),
          `${inner}\n${outer}`,
          "NameError",
        ]);
        return build({
          conceptTag: "Local vs Global Scope",
          type: "predict-output",
          question: "What does the outer print(x) output after calling test()?",
          codeSnippet: `x = ${outer}\ndef test():\n    x = ${inner}\n\ntest()\nprint(x)`,
          options,
          correctIndex,
          explanation: `Assigning x = ${inner} inside test() creates a brand-new LOCAL variable scoped only to that function. The outer global variable x stays ${outer}.`,
          hint: "Assigning inside a function creates a local variable unless 'global' is declared.",
          difficulty: "intermediate",
        });
      },
      () => {
        const base = randInt(5, 12);
        const bonus = 10;
        const { options, correctIndex } = shuffleOptions(String(base + bonus), [
          String(base),
          String(bonus),
          "TypeError",
        ]);
        return build({
          conceptTag: "Default Parameters",
          type: "predict-output",
          question: "What value does this function compute when the optional argument is omitted?",
          codeSnippet: `def add_bonus(points, bonus=${bonus}):\n    return points + bonus\n\nprint(add_bonus(${base}))`,
          options,
          correctIndex,
          explanation: `Since only one argument was passed, bonus uses its default value of ${bonus}: ${base} + ${bonus} = ${base + bonus}.`,
          hint: "Default parameter values apply whenever the caller omits that argument.",
          difficulty: "beginner",
        });
      },
    ];
    return sample(variants)();
  }

  // ------------------------------------------------------------------
  // General Fallback Mastery Pool (if arbitrary custom lesson title passed)
  // ------------------------------------------------------------------
  const pool = [
    {
      conceptTag: "Mutability",
      question: "Which of these Python collections is MUTABLE (can be modified in-place)?",
      codeSnippet: `a = (1, 2, 3)     # Tuple\nb = "hello"       # String\nc = [1, 2, 3]     # List`,
      correct: "c (List)",
      distractors: ["a (Tuple)", "b (String)", "All of them are immutable"],
      explanation:
        "Lists are mutable—you can call .append(), .pop(), or assign items by index. Tuples and strings are immutable.",
      hint: "Which collection uses [ ] and supports .append()?",
      difficulty: (preferredDifficulty || "beginner") as "beginner" | "intermediate" | "advanced",
    },
    {
      conceptTag: "Truthy & Falsy",
      question: "What does bool([]) evaluate to in Python?",
      codeSnippet: `empty_list = []\nprint(bool(empty_list))`,
      correct: "False",
      distractors: ["True", "None", "TypeError"],
      explanation:
        "Empty collections ([], {}, \"\", ()) and 0 are considered falsy in Python, so bool([]) returns False.",
      hint: "Think about how empty lists behave inside an if statement.",
      difficulty: "beginner" as const,
    },
  ];
  const chosen = sample(pool);
  const { options, correctIndex } = shuffleOptions(chosen.correct, chosen.distractors);
  return build({
    conceptTag: chosen.conceptTag,
    type: "multiple-choice",
    question: chosen.question,
    codeSnippet: chosen.codeSnippet,
    options,
    correctIndex,
    explanation: chosen.explanation,
    hint: chosen.hint,
    difficulty: chosen.difficulty,
  });
}

export interface AdaptiveDeckPlan {
  questions: DynamicQuizQuestion[];
  scopeLabel: string;
  selectionReason: string;
  targetLessonIds: string[];
}

interface IndexedLesson {
  lesson: CurriculumLesson;
  module: CurriculumModule;
  globalIndex: number;
}

/**
 * Builds an intelligent, deduplicated quiz deck driven directly by the user's
 * Curriculum Progress, Active Lesson, and historical Topic Mastery.
 */
export function buildAdaptiveQuizDeck(params: {
  progress: UserProgress;
  modules: CurriculumModule[];
  masteryMap: Record<string, LessonMasteryRecord>;
  scope: QuizScope;
  selectedModuleId?: string;
  selectedLessonId?: string;
  count: number;
  difficulty: "adaptive" | "beginner" | "intermediate" | "mixed";
}): AdaptiveDeckPlan {
  const {
    progress,
    modules,
    masteryMap,
    scope,
    selectedModuleId,
    selectedLessonId,
    count,
    difficulty,
  } = params;

  const flat: IndexedLesson[] = [];
  let idx = 0;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      flat.push({ lesson, module: mod, globalIndex: idx++ });
    }
  }

  if (flat.length === 0) {
    return {
      questions: [generateRandomQuiz("custom", "Python Fundamentals")],
      scopeLabel: "Python Practice",
      selectionReason: "General Python fundamentals",
      targetLessonIds: [],
    };
  }

  const completedSet = new Set(progress.completedLessonIds || []);
  const activeId = progress.lastActiveLessonId || flat[0].lesson.id;

  let candidates: IndexedLesson[] = [];
  let scopeLabel = "Recommended";
  let selectionReason = "";

  if (scope === "current-lesson") {
    const targetId = selectedLessonId || activeId;
    const found = flat.find((item) => item.lesson.id === targetId) || flat[0];
    candidates = [found];
    scopeLabel = found.lesson.title;
    selectionReason = `Questions from ${found.lesson.title} (${found.module.title}).`;
  } else if (scope === "module") {
    const targetMod =
      modules.find((m) => m.id === selectedModuleId) || modules[0];
    candidates = flat.filter((item) => item.module.id === targetMod.id);
    scopeLabel = targetMod.title;
    selectionReason = `Questions from all ${candidates.length} lessons in ${targetMod.title}.`;
  } else if (scope === "weak-spots") {
    const weakRanked = flat
      .map((item) => {
        const rec = masteryMap[item.lesson.id];
        const acc = rec && rec.attempts > 0 ? rec.correct / rec.attempts : null;
        return { item, acc, attempts: rec?.attempts || 0 };
      })
      .filter((x) => x.acc !== null && x.acc < 0.8)
      .sort((a, b) => (a.acc ?? 1) - (b.acc ?? 1));

    if (weakRanked.length > 0) {
      candidates = weakRanked.map((x) => x.item);
      scopeLabel = "Review Mistakes";
      selectionReason = `Focusing on ${candidates.length} topic${candidates.length === 1 ? "" : "s"} where you scored under 80%.`;
    } else {
      // Fallback gracefully to completed + active lessons
      candidates = flat.filter(
        (item) => completedSet.has(item.lesson.id) || item.lesson.id === activeId
      );
      if (candidates.length === 0) candidates = flat.slice(0, 4);
      scopeLabel = "Quick Review";
      selectionReason =
        "No weak topics yet. Reviewing your recent lessons.";
    }
  } else if (scope === "timed-blitz") {
    const unlocked = flat.filter(
      (item) => completedSet.has(item.lesson.id) || item.lesson.id === activeId
    );
    candidates = unlocked.length >= 3 ? unlocked : flat.slice(0, 6);
    scopeLabel = "90s Sprint";
    selectionReason =
      completedSet.size > 0
        ? `Quick sprint from your ${completedSet.size} completed lessons and current topic.`
        : "Quick Python sprint starting with basics, variables, and logic.";
  } else {
    // "adaptive": Weighted toward completed lessons + active lesson + next-up lesson, prioritizing unpracticed or weaker topics
    const unlocked = flat.filter(
      (item) => completedSet.has(item.lesson.id) || item.lesson.id === activeId
    );
    const maxUnlockedIdx = unlocked.reduce(
      (max, item) => Math.max(max, item.globalIndex),
      0
    );
    const nextUp = flat[maxUnlockedIdx + 1];

    if (completedSet.size === 0) {
      const mod1 = flat.filter((item) => item.module.order === 1);
      candidates = [...mod1];
      if (!candidates.some((c) => c.lesson.id === activeId)) {
        const activeItem = flat.find((item) => item.lesson.id === activeId);
        if (activeItem) candidates.push(activeItem);
      }
      scopeLabel = "Starter Mix";
      selectionReason =
        "Starts with Module 1 basics and your current lesson.";
    } else {
      const scored = unlocked.map((item) => {
        const rec = masteryMap[item.lesson.id];
        let weight = 1;
        if (item.lesson.id === activeId) weight += 2.5;
        if (!rec || rec.attempts === 0) weight += 2;
        else {
          const acc = rec.correct / rec.attempts;
          if (acc < 0.7) weight += 3;
          else if (acc < 0.9) weight += 1.2;
        }
        return { item, weight };
      });
      scored.sort((a, b) => b.weight - a.weight);
      candidates = scored.map((s) => s.item);
      if (nextUp && !candidates.some((c) => c.lesson.id === nextUp.lesson.id)) {
        candidates.push(nextUp);
      }
      scopeLabel = "Recommended";
      selectionReason = `Picked from your ${completedSet.size} finished lesson${completedSet.size === 1 ? "" : "s"}, active topic, and past quiz scores.`;
    }
  }

  // Optional difficulty preference
  if (difficulty === "beginner") {
    const filtered = candidates.filter((c) => (c.lesson.difficulty || "beginner") === "beginner");
    if (filtered.length > 0) candidates = filtered;
  } else if (difficulty === "intermediate") {
    const filtered = candidates.filter((c) => c.lesson.difficulty === "intermediate");
    if (filtered.length > 0) candidates = filtered;
  }

  // Build questions while avoiding repeating identical prompt strings
  const questions: DynamicQuizQuestion[] = [];
  const seenPrompts = new Set<string>();

  // Gather authentic curriculum MCQs from candidate lessons first (shuffled)
  const currMcqs: DynamicQuizQuestion[] = [];
  for (const c of candidates) {
    currMcqs.push(...extractCurriculumMcqs(c.lesson, c.module));
  }
  currMcqs.sort(() => Math.random() - 0.5);

  // Mix in up to ~35% authored curriculum MCQs + fresh procedural variations
  const maxCurr = Math.min(currMcqs.length, Math.max(1, Math.floor(count * 0.35)));
  for (let i = 0; i < maxCurr && questions.length < count; i++) {
    const q = currMcqs[i];
    const sig = `${q.question}|${q.codeSnippet || ""}`;
    if (!seenPrompts.has(sig)) {
      seenPrompts.add(sig);
      questions.push(q);
    }
  }

  let safety = 0;
  let pointer = 0;
  while (questions.length < count && safety < count * 8) {
    safety++;
    const target = candidates[pointer % candidates.length];
    pointer++;
    const prefDiff =
      difficulty === "beginner"
        ? "beginner"
        : difficulty === "intermediate"
        ? "intermediate"
        : target.lesson.difficulty === "intermediate"
        ? "intermediate"
        : "beginner";

    const q = generateRandomQuiz(
      target.lesson.id,
      target.lesson.title,
      target.lesson.summary || (target.lesson.conceptsIntroduced || []).join(" "),
      prefDiff,
      { id: target.module.id, title: target.module.title }
    );
    const sig = `${q.question}|${q.codeSnippet || ""}`;
    if (!seenPrompts.has(sig) || safety > count * 5) {
      seenPrompts.add(sig);
      questions.push(q);
    }
  }

  // Shuffle final deck order unless current-lesson single focus
  const finalQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, count);
  const targetLessonIds = Array.from(new Set(finalQuestions.map((q) => q.lessonId)));

  return {
    questions: finalQuestions,
    scopeLabel,
    selectionReason,
    targetLessonIds,
  };
}
