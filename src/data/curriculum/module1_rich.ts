// buildModularCurriculum.ts
// Generates the comprehensive, in-depth, word-rich W3Schools curriculum for PySlide Lab.
// Packed with thorough conceptual explanations, real-world analogies, step-by-step execution walkthroughs,
// and practical software engineering best practices.
import fs from "fs";
import path from "path";

const curriculum = {
  curriculumId: "pyslide-python-fundamentals",
  title: "Python Programming Tutorial",
  version: "3.0.0",
  description: "A comprehensive, friendly, and in-depth step-by-step Python course. Master coding from foundational syntax all the way to modular functions with rich explanations and hands-on exercises.",
  author: "PySlide Lab",
  totalEstimatedHours: 14,
  modules: [
    // =========================================================================
    // MODULE 1: Python Basics & Syntax
    // =========================================================================
    {
      id: "module-01-python-basics",
      title: "1. Python Basics & Syntax",
      order: 1,
      description: "Discover what Python is, learn how a computer reads code line by line, display text and numbers on screen, leave helpful comments, and perform mathematical calculations.",
      category: "standard",
      lessons: [
        {
          id: "lesson-01-01-what-is-python",
          title: "Python Introduction",
          order: 1,
          summary: "Learn what Python is, why it is one of the world's most popular programming languages, and how your computer executes code line by line.",
          difficulty: "beginner",
          estimatedMinutes: 8,
          learningObjectives: [
            "Understand what a computer program actually is and how code is executed",
            "Learn why Python was designed for readability and how it differs from other languages",
            "Understand how the Python interpreter reads instructions from top to bottom",
            "Write, inspect, and run your very first Python program"
          ],
          prerequisites: [],
          conceptsIntroduced: ["concept-python-basics", "concept-io-output"],
          tags: ["intro", "python", "basics"],
          sections: [
            {
              id: "sec-01-01-exp",
              type: "explanation",
              title: "Welcome to Python",
              content: "Python is a modern, high-level programming language created in 1991 by a Dutch computer scientist named Guido van Rossum. When Guido designed Python, he had a clear and powerful guiding philosophy: **code should be as pleasant and straightforward to read as plain everyday English**.\n\nIn many traditional programming languages like C, C++, or Java, printing a simple greeting on the screen requires writing five or ten lines of complex setup code with curly brackets `{}`, semicolons `;`, class declarations, and memory management rules. In Python, doing that requires just one single, beautiful line:\n\n```python\nprint(\"Hello, World!\")\n```\n\n### Why Has Python Taken Over the World?\nPython is consistently ranked as the number one most requested and popular programming language across universities, technology giants, and research labs worldwide. Here is why programmers love it:\n\n* **Unmatched Readability:** Python eliminates confusing punctuation like curly braces and semicolons. Instead, it uses clean, readable indentation. When you look at Python code, you can immediately tell what it does.\n* **Versatility & Power:** Python is not a toy language; it is an industry powerhouse. NASA uses Python to calculate spacecraft trajectories; Netflix uses Python to deliver video recommendations to hundreds of millions of screens; Google uses Python across search infrastructure; and leading artificial intelligence researchers build modern neural networks using Python.\n* **Fast Prototyping:** Because Python lets you express ideas in far fewer lines of code than other languages, software engineers can test an idea, build an application, and fix bugs in a fraction of the time.\n\n### How Your Computer Runs Python Code\nComputers cannot directly understand human words. Inside your computer, the central processing unit (CPU) only understands electrical pulses—zeros and ones called machine code. Python acts as a brilliant, lightning-fast translator known as an **interpreter**.\n\nWhen you click the green **Run Code** button, the Python interpreter opens your script and reads your instructions **from top to bottom, exactly one line after another**, just like a chef reading a step-by-step culinary recipe:\n\n1. It looks at **Line 1**, verifies that your spelling and grammar (syntax) follow Python's rules, and executes that instruction immediately.\n2. Once Line 1 finishes, it proceeds down to **Line 2**, executes Line 2, and continues sequentially down the file until it reaches the end.\n\nTo communicate with the person sitting in front of the screen, your first tool is Python's built-in `print()` function. Let's look closely at how it works.",
              keyPoints: []
            },
            {
              id: "sec-01-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "print(\"Your message here\")",
              description: "The print() command tells Python to output whatever is placed between its parentheses onto the screen.",
              components: [
                {
                  component: "print",
                  purpose: "The built-in Python command word (function) that sends output to the screen or console.",
                  example: "print",
                  required: true
                },
                {
                  component: "( )",
                  purpose: "Parentheses tell Python: 'Execute this command with the contents provided inside.'",
                  example: "(\"...\")",
                  required: true
                },
                {
                  component: "\" \" or ' '",
                  purpose: "Quotation marks wrap text to mark it as a string of characters rather than executable code words.",
                  example: "\"Hello, World!\"",
                  required: true
                }
              ],
              notes: "You can use double quotes (\"...\") or single quotes ('...'). Just be consistent and ensure that the quote mark you open with matches the quote mark you close with!"
            },
            {
              id: "sec-01-01-example",
              type: "example",
              title: "Example: Hello, World!",
              code: "print(\"Hello, World!\")\nprint(\"I am learning Python!\")",
              description: "A complete two-line Python program displaying two separate messages in sequence. Python automatically begins each new print() statement on a brand new line.",
              expectedOutput: "Hello, World!\nI am learning Python!",
              stepByStep: [
                "Line 1: Python reads print(\"Hello, World!\"). It extracts the text between the quotation marks and outputs 'Hello, World!' to the console.",
                "Automatic Newline: After completing the Line 1 print statement, Python automatically moves the cursor down to the beginning of the next line.",
                "Line 2: Python proceeds downward to print(\"I am learning Python!\"), printing that message directly beneath the first message.",
                "Program Finish: Reaching the end of the instructions, Python exits cleanly."
              ]
            },
            {
              id: "sec-01-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Edit the code below so it prints 'Welcome to Python!' instead of 'Hello, World!', then click Run Code.",
              starterCode: "print(\"Hello, World!\")\n",
              solutionCode: "print(\"Welcome to Python!\")",
              expectedOutput: "Welcome to Python!",
              hints: [
                "Make sure you keep the quotation marks inside the parentheses.",
                "Carefully spell 'Welcome to Python!' inside the quotes."
              ]
            },
            {
              id: "sec-01-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting Quotation Marks Around Text",
                  badCode: "print(Hello World)  # SyntaxError: invalid syntax",
                  goodCode: "print(\"Hello World\")",
                  explanation: "When you omit quotes, Python searches its internal dictionary for built-in code words or variables named 'Hello' and 'World'. Because no such commands exist, Python stops and raises a SyntaxError."
                },
                {
                  title: "2. Capitalizing the 'P' in Print",
                  badCode: "Print(\"Hello\")  # NameError: name 'Print' is not defined",
                  goodCode: "print(\"Hello\")",
                  explanation: "Python is strictly case-sensitive. The command name is lowercase 'print'. Writing 'Print' or 'PRINT' will cause Python to report that it cannot find any command with that uppercase spelling."
                },
                {
                  title: "3. Mismatched Quotation Marks",
                  badCode: "print(\"Hello')  # SyntaxError: unterminated string literal",
                  goodCode: "print(\"Hello\") or print('Hello')",
                  explanation: "If you open with a double quote, you must close with a double quote. Python cannot match a double quote with a single quote."
                }
              ]
            },
            {
              id: "sec-01-01-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-01-01-1",
                  type: "short-answer",
                  question: "What is the exact built-in command word used to display words and data onto the screen in Python?",
                  prompt: "Type the function name:",
                  correctAnswer: "print",
                  acceptedAnswers: ["print", "print()"],
                  hint: "It is a lowercase word starting with 'p' and ending with 't'.",
                  explanation: "The print() function is Python's universal tool for displaying text, numbers, and variables."
                },
                {
                  id: "q-01-01-2",
                  type: "multiple-choice",
                  question: "In what sequence does the Python interpreter read and execute your program?",
                  options: [
                    "Sequentially from top to bottom, one line at a time",
                    "Simultaneously executing all lines at the exact same instant",
                    "In reverse order from bottom to top",
                    "Randomly based on CPU speed"
                  ],
                  correctIndex: 0,
                  explanation: "Python reads and executes program instructions sequentially, moving line by line from the first line down to the last."
                }
              ]
            },
            {
              id: "sec-01-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Computer programs are ordered sequences of instructions executed by the Python interpreter from top to bottom.",
                "The print() function sends textual messages and calculated data directly to the user's screen.",
                "Always enclose plain human text within matching quotation marks (single or double) to create a valid string."
              ]
            }
          ]
        },
        {
          id: "lesson-01-02-the-print-function",
          title: "The print() Function",
          order: 2,
          summary: "Learn how to output multiple values at once, mix words with numbers, customize spacing with 'sep', and prevent automatic line breaks with 'end'.",
          difficulty: "beginner",
          estimatedMinutes: 8,
          learningObjectives: [
            "Output multiple data items in a single print() statement using commas",
            "Understand why numerical values do not require quotation marks",
            "Master the 'sep' parameter to define custom separators between printed items",
            "Master the 'end' parameter to control or prevent automatic line breaks"
          ],
          prerequisites: ["lesson-01-01-what-is-python"],
          conceptsIntroduced: ["concept-io-output-sep-end"],
          tags: ["print", "output", "parameters"],
          sections: [
            {
              id: "sec-01-02-exp",
              type: "explanation",
              title: "Advanced Printing: Multiple Items & Custom Formatting",
              content: "As your programs grow, you will frequently need to display more than just a single static phrase. You might want to print a player's username followed by their score, format a calendar date with dashes, or print progress dots across the screen without jumping down to a new line.\n\nPython's `print()` function is remarkably flexible and comes with built-in features that make output formatting intuitive.\n\n### 1. Printing Multiple Items With Commas\nYou can pass as many items as you want inside the parentheses of a single `print()` call simply by separating them with commas:\n\n```python\nprint(\"Player:\", \"Alex\", \"Score:\", 100)\n```\n\nWhen Python sees commas separating items, it performs two helpful tasks automatically:\n* It outputs every item in the exact order you listed them.\n* It automatically inserts a single space between each item so words don't awkwardly crash into one another.\n\n### 2. Notice That Numbers Don't Need Quotation Marks\nTake a close look at the number `100` in the example above. Notice that it does **not** have quotation marks around it! In Python:\n* When you wrap digits in quotes like `\"100\"`, Python treats them like letters printed on paper (a text string).\n* When you write digits cleanly without quotes like `100`, Python recognizes them as a genuine number that can participate in math and calculations.\n\n### 3. Customizing Separators with `sep`\nBy default, Python inserts a standard space between items separated by commas. What if you want to format a date like `2026-10-26` with hyphens, or a file path like `folder/subfolder/file` with slashes? You can customize the separator by providing the `sep=` parameter:\n\n```python\nprint(\"2026\", \"10\", \"26\", sep=\"-\")   # Outputs: 2026-10-26\nprint(\"apples\", \"bananas\", sep=\" & \") # Outputs: apples & bananas\n```\n\n### 4. Controlling Line Breaks with `end`\nEvery time a standard `print()` statement finishes, Python automatically prints a hidden newline character (`\\n`) that shifts the cursor down to the next row. If you want two separate print statements to stay on the exact same line, you can change the ending character using `end=`:\n\n```python\nprint(\"Loading\", end=\"...\")\nprint(\"Complete!\")\n# Outputs: Loading...Complete! on one single line!\n```",
              keyPoints: []
            },
            {
              id: "sec-01-02-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "print(item1, item2, ..., sep=\" \", end=\"\\n\")",
              description: "How to customize separators and line endings inside Python's print() function.",
              components: [
                {
                  component: "item1, item2, ...",
                  purpose: "The sequence of words, numbers, or calculated values you wish to display, separated by commas.",
                  example: "\"Age:\", 18",
                  required: true
                },
                {
                  component: "sep=\"...\"",
                  purpose: "Specifies the character or text to place between each item. Defaults to a single space \" \".",
                  example: "sep=\"-\"",
                  required: false
                },
                {
                  component: "end=\"...\"",
                  purpose: "Specifies what character to print after the final item. Defaults to a newline \"\\n\".",
                  example: "end=\" \"",
                  required: false
                }
              ],
              notes: "You can combine both sep and end in the same print() call. Always place them at the very end of your arguments list."
            },
            {
              id: "sec-01-02-example",
              type: "example",
              title: "Example: Multiple Items & Custom Spacers",
              code: "print(\"Python\", \"is\", \"fun!\")\nprint(\"2026\", \"10\", \"26\", sep=\"-\")\nprint(\"Downloading\", end=\"...\")\nprint(\"Done!\")",
              description: "Demonstrating comma-separated printing, custom hyphen separators, and connecting two print calls on one line.",
              expectedOutput: "Python is fun!\n2026-10-26\nDownloading...Done!",
              stepByStep: [
                "Line 1: Evaluates the three text arguments and prints 'Python is fun!' with default spaces between words.",
                "Line 2: Prints '2026', '10', and '26', but overrides the separator with sep='-', printing '2026-10-26'.",
                "Line 3: Prints 'Downloading' with end='...'. Because no newline character was sent, the cursor remains on the same row right after the dots.",
                "Line 4: Prints 'Done!' directly adjacent to the dots on that same line, then finishes with a normal newline."
              ]
            },
            {
              id: "sec-01-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Write a print statement that displays your name and your age separated by a comma (for example: print(\"Alex\", 16)), then click Run Code.",
              starterCode: "# Print your name and age below using a comma\nprint(\"Alex\", 16)\n",
              solutionCode: "print(\"Alex\", 16)",
              expectedOutput: "Alex 16",
              hints: [
                "Put quotes around the name: \"Alex\"",
                "Do not put quotes around the number: 16",
                "Separate them with a comma."
              ]
            },
            {
              id: "sec-01-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Using the Plus Symbol (+) to Combine Text and Numbers",
                  badCode: "print(\"Score: \" + 100)  # TypeError: can only concatenate str to str",
                  goodCode: "print(\"Score:\", 100)",
                  explanation: "In Python, the plus operator (+) tries to mathematically add numbers or glue text together. It refuses to glue text directly to a raw number. Using a comma (,) works universally with all data types and inserts a friendly space automatically."
                },
                {
                  title: "2. Misspelling Parameter Names",
                  badCode: "print(\"A\", \"B\", separator=\"-\")  # TypeError: unexpected keyword",
                  goodCode: "print(\"A\", \"B\", sep=\"-\")",
                  explanation: "The parameter name is strictly abbreviated as 'sep', not 'separator'. Likewise, line endings are controlled with 'end', not 'ending'."
                }
              ]
            },
            {
              id: "sec-01-02-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-01-02-1",
                  type: "code-output",
                  question: "What exact text will be displayed in the console when this line runs?",
                  codeSnippet: "print(\"Red\", \"Blue\", \"Green\", sep=\"*\")",
                  correctAnswer: "Red*Blue*Green",
                  acceptedAnswers: ["Red*Blue*Green"],
                  hint: "The sep parameter replaces every space between comma-separated items with an asterisk (*).",
                  explanation: "sep='*' places an asterisk between each of the three words, resulting in 'Red*Blue*Green'."
                }
              ]
            },
            {
              id: "sec-01-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Separate multiple items with commas in print() to display them sequentially with automatic spaces.",
                "Real numerical values do not require quotation marks; only textual strings need quotes.",
                "Use sep=\"...\" to define custom spacers between items and end=\"...\" to control line endings."
              ]
            }
          ]
        },
        {
          id: "lesson-01-03-comments",
          title: "Comments in Python",
          order: 3,
          summary: "Learn why code documentation is essential, how to write single-line and multi-line comments, and how to use comments for rapid debugging.",
          difficulty: "beginner",
          estimatedMinutes: 6,
          learningObjectives: [
            "Understand why software engineers document their code using comments",
            "Learn how the Python interpreter detects and completely ignores the hash (#) symbol",
            "Learn how to write multi-line documentation strings using triple quotes",
            "Use commenting techniques to isolate bugs without deleting code"
          ],
          prerequisites: ["lesson-01-01-what-is-python"],
          conceptsIntroduced: ["concept-comments-syntax"],
          tags: ["comments", "documentation", "best-practices"],
          sections: [
            {
              id: "sec-01-03-exp",
              type: "explanation",
              title: "Writing Notes for Humans",
              content: "In professional software development, there is a famous industry truth: **code is read ten times more often than it is written**. When you return to a program you wrote two months ago—or when a teammate on your engineering project reviews your work—clear explanations can save hours of confusion.\n\nA **comment** is a special note written directly inside your code file that is entirely intended for human readers. Whenever the Python interpreter encounters a comment, it completely ignores it, treating it as if it were blank space.\n\n### How to Write Comments in Python\nPython provides clean, flexible ways to add notes to your scripts:\n\n1. **Single-Line Comments (`#`):** Any text following a hash symbol `#` on that line is ignored by Python:\n```python\n# Calculate player health after damage\nhealth = 100 - 25\n```\n\n2. **Inline Comments:** You can place comments at the end of an active code line to explain that specific statement:\n```python\nprint(\"Game Over\")  # Display final status to user\n```\n\n3. **Multi-line Notes & Docstrings (`\"\"\"`):** If you need to write a lengthy paragraph explaining a complex algorithm or listing copyright details, you can enclose the text inside triple quotation marks:\n```python\n\"\"\"\nThis script handles player movement.\nControls:\nW = Up, S = Down, A = Left, D = Right\n\"\"\"\n```\n\n### The Power of 'Commenting Out' Code\nComments are not just for notes; they are also an indispensable debugging tool. If a specific line of code is throwing an error and you want to test whether the rest of your program works without it, you don't have to delete the line! Just add a `#` at the beginning of the line to temporarily disable it. Once you find the bug, simply remove the `#` to restore the code.",
              keyPoints: []
            },
            {
              id: "sec-01-03-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "# Your comment text here",
              description: "The hash symbol tells Python to ignore everything from the symbol to the end of the line.",
              components: [
                {
                  component: "#",
                  purpose: "The hash or pound character signals to the interpreter that a human note begins here.",
                  example: "# Set score",
                  required: true
                },
                {
                  component: "Comment text",
                  purpose: "Human-readable explanation of why the code is written this way or how it works.",
                  example: "Initialize user balance",
                  required: false
                }
              ],
              notes: "Comments should explain 'why' you wrote something, not just restate the obvious 'what'."
            },
            {
              id: "sec-01-03-example",
              type: "example",
              title: "Example: Documenting Code & Inline Notes",
              code: "# This program demonstrates clean comments\nprint(\"Starting simulation...\")\n\n# The line below is active\nprint(\"Processing calculations...\")\n\n# print(\"This line is commented out and will NEVER run!\")\nprint(\"Simulation complete!\")",
              description: "A Python program featuring single-line header comments, explanatory notes, and a commented-out line that is safely bypassed.",
              expectedOutput: "Starting simulation...\nProcessing calculations...\nSimulation complete!",
              stepByStep: [
                "Line 1: Python encounters '#' at the start. It immediately skips the entire line.",
                "Line 2: Python executes print(\"Starting simulation...\").",
                "Line 4: Another comment line is detected and skipped.",
                "Line 5: Python executes print(\"Processing calculations...\").",
                "Line 7: Python sees '#' at the beginning of the line. The entire print statement is ignored and never executed.",
                "Line 8: Python executes print(\"Simulation complete!\") and exits."
              ]
            },
            {
              id: "sec-01-03-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Add a comment above the print statement starting with '#' explaining what it does, then run the code.",
              starterCode: "# Add your comment on this line\nprint(\"Python comments are easy!\")\n",
              solutionCode: "# Display a friendly message\nprint(\"Python comments are easy!\")",
              expectedOutput: "Python comments are easy!",
              hints: [
                "Start your comment line with the # character.",
                "Write any brief note you like after the #."
              ]
            },
            {
              id: "sec-01-03-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting the Hash (#) Character",
                  badCode: "This is my note to explain the score  # SyntaxError!\nscore = 100",
                  goodCode: "# This is my note to explain the score\nscore = 100",
                  explanation: "If you forget the leading '#' symbol, Python attempts to parse your English words as variable names and commands, resulting in an immediate SyntaxError."
                },
                {
                  title: "2. Using Slashes (//) Like Other Languages",
                  badCode: "// This is not a comment in Python  # SyntaxError!",
                  goodCode: "# Use hash for Python comments",
                  explanation: "In C, Java, and JavaScript, comments start with double slashes (//). In Python, '//' means integer floor division! Python comments must always begin with the '#' symbol."
                }
              ]
            },
            {
              id: "sec-01-03-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-01-03-1",
                  type: "multiple-choice",
                  question: "Which symbol must you use to start a single-line comment in Python?",
                  options: [
                    "# (Hash / Pound)",
                    "// (Double forward slash)",
                    "/* (Slash asterisk)",
                    "-- (Double hyphen)"
                  ],
                  correctIndex: 0,
                  explanation: "Python uses the '#' symbol to indicate the start of a single-line comment."
                }
              ]
            },
            {
              id: "sec-01-03-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Comments are notes written for humans that are completely ignored by the Python interpreter.",
                "Begin single-line and inline notes with the '#' character.",
                "Use comments to explain why your code works and to temporarily disable lines during debugging."
              ]
            }
          ]
        },
        {
          id: "lesson-01-04-basic-math",
          title: "Numbers & Basic Calculations",
          order: 4,
          summary: "Turn Python into a high-speed calculator by mastering integers, decimal floats, standard math operators, modulo remainders, and exponents.",
          difficulty: "beginner",
          estimatedMinutes: 8,
          learningObjectives: [
            "Distinguish between whole integers (int) and decimal numbers (float)",
            "Perform arithmetic using +, -, *, /, //, %, and **",
            "Understand how Python computes whole-number division and remainders",
            "Apply order of operations (PEMDAS) using parentheses"
          ],
          prerequisites: ["lesson-01-01-what-is-python"],
          conceptsIntroduced: ["concept-math-operators", "concept-data-numbers"],
          tags: ["math", "numbers", "operators", "calculations"],
          sections: [
            {
              id: "sec-01-04-exp",
              type: "explanation",
              title: "Python as a Powerful Calculator",
              content: "One of Python's greatest strengths is its extraordinary capability for numerical computation. Scientists, engineers, and financial analysts rely on Python because it performs arithmetic with immense speed and precision.\n\nIn Python, numbers primarily fall into two fundamental categories:\n* **Integers (`int`):** Whole numbers without any decimal fraction. Examples include `42`, `0`, `-15`, and `1000000`.\n* **Floating-Point Numbers (`float`):** Numbers that contain a fractional decimal point. Examples include `3.14159`, `0.75`, and `-2.5`.\n\n### The Arithmetic Operators\nPython supports standard arithmetic along with specialized operators for advanced mathematics:\n\n| Operator | Operation | Code Example | Calculated Result |\n|---|---|---|---|\n| `+` | Addition | `12 + 8` | `20` |\n| `-` | Subtraction | `50 - 15` | `35` |\n| `*` | Multiplication | `6 * 7` | `42` |\n| `/` | True Division | `10 / 4` | `2.5` (Always produces a float!) |\n| `//` | Floor Division | `10 // 4` | `2` (Chops off the decimal part) |\n| `%` | Modulo (Remainder) | `10 % 4` | `2` (The leftover remainder) |\n| `**` | Exponent (Power) | `2 ** 3` | `8` (2 multiplied by itself 3 times) |\n\n### Understanding Floor Division (`//`) and Modulo (`%`)\nThink back to elementary school when you learned division with remainders:\nIf you have `10` cookies and divide them evenly among `4` friends:\n* Each friend receives `2` whole cookies. In Python: `10 // 4` gives `2`.\n* You have `2` leftover cookies that cannot be divided evenly. In Python: `10 % 4` gives `2`.\n\nModulo is one of the most useful tricks in game development and software engineering. For example, any number `% 2` will return `0` if the number is **even**, and `1` if the number is **odd**!\n\n### Order of Operations (PEMDAS)\nJust like in algebra class, Python strictly obeys standard mathematical precedence:\n1. **P**arentheses `()` are always evaluated first.\n2. **E**xponents `**` are evaluated next.\n3. **M**ultiplication `*`, **D**ivision `/`, Floor Division `//`, and Modulo `%` are evaluated from left to right.\n4. **A**ddition `+` and **S**ubtraction `-` are evaluated last.\n\nWhen writing complex calculations, always use parentheses `( )` to make your intended order unambiguous to both Python and your fellow human programmers.",
              keyPoints: []
            },
            {
              id: "sec-01-04-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "result = (a + b) * c",
              description: "How arithmetic expressions are written and evaluated in Python.",
              components: [
                {
                  component: "Operands (numbers)",
                  purpose: "The raw numerical values or variables involved in the calculation.",
                  example: "10, 5",
                  required: true
                },
                {
                  component: "Operators",
                  purpose: "Symbols specifying which mathematical operation to perform (+, -, *, /, //, %, **).",
                  example: "*",
                  required: true
                },
                {
                  component: "( )",
                  purpose: "Explicitly controls evaluation order, ensuring grouped operations occur first.",
                  example: "(10 + 5) * 2",
                  required: false
                }
              ],
              notes: "Standard division (/) always returns a float, even if the division divides evenly (e.g., 6 / 2 returns 3.0, not 3)."
            },
            {
              id: "sec-01-04-example",
              type: "example",
              title: "Example: Basic Calculations & Order of Operations",
              code: "print(10 + 5 * 2)\nprint((10 + 5) * 2)\nprint(17 // 5)\nprint(17 % 5)\nprint(2 ** 4)",
              description: "Comparing operator precedence with parentheses, calculating floor division with remainders, and raising powers.",
              expectedOutput: "20\n30\n3\n2\n16",
              stepByStep: [
                "Line 1: Evaluates 5 * 2 = 10 first due to multiplication precedence, then adds 10 to get 20.",
                "Line 2: Parentheses force (10 + 5) to compute first, giving 15, which is multiplied by 2 to yield 30.",
                "Line 3: 17 // 5 computes how many whole times 5 fits into 17 (3 times). The decimal portion is discarded.",
                "Line 4: 17 % 5 computes the leftover remainder when 17 is divided by 5 (17 - 15 = 2).",
                "Line 5: 2 ** 4 computes 2 to the fourth power (2 * 2 * 2 * 2 = 16)."
              ]
            },
            {
              id: "sec-01-04-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Calculate 5 raised to the power of 3 (5 cubed) using Python's exponent operator (**), wrap it in print(), and click Run Code.",
              starterCode: "# Calculate 5 to the power of 3 below\nprint(5 ** 3)\n",
              solutionCode: "print(5 ** 3)",
              expectedOutput: "125",
              hints: [
                "Use the ** operator for exponents.",
                "Type: print(5 ** 3)"
              ]
            },
            {
              id: "sec-01-04-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Division by Zero",
                  badCode: "print(10 / 0)  # ZeroDivisionError: division by zero",
                  goodCode: "if divisor != 0:\n    print(10 / divisor)",
                  explanation: "In mathematics and computer science, dividing any number by zero is undefined. Python will crash immediately with a ZeroDivisionError."
                },
                {
                  title: "2. Confusing Power (**) with the Caret (^) Symbol",
                  badCode: "print(2 ^ 3)  # Outputs 1! (Bitwise XOR, not power)",
                  goodCode: "print(2 ** 3)  # Outputs 8 (True power)",
                  explanation: "In Python, the caret symbol '^' is the bitwise XOR operator, NOT exponentiation! To raise a number to a power, always use double asterisks (**)."
                }
              ]
            },
            {
              id: "sec-01-04-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-01-04-1",
                  type: "code-output",
                  question: "What exact number will this expression print?",
                  codeSnippet: "print(20 // 6)",
                  correctAnswer: "3",
                  acceptedAnswers: ["3"],
                  hint: "The // operator performs floor division, keeping only the whole integer quotient.",
                  explanation: "6 fits into 20 three whole times (3 * 6 = 18). The fractional part is discarded, giving 3."
                }
              ]
            },
            {
              id: "sec-01-04-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Python supports integers (whole numbers) and floats (numbers with decimal points).",
                "True division (/) always yields a float, while floor division (//) truncates to a whole integer.",
                "Modulo (%) returns division remainders, and double asterisks (**) compute exponents."
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Write out to curriculum.json
const targetFile = path.resolve(process.cwd(), "src/data/curriculum/curriculum.json");
console.log("Saving rich curriculum...");
