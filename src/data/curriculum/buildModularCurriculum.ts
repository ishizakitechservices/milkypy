// buildModularCurriculum.ts
// Generates the comprehensive, modular W3Schools curriculum for PySlide Lab.
// Written in simple, friendly, beginner-accessible English throughout!
import fs from "fs";
import path from "path";

const curriculum = {
  curriculumId: "pyslide-python-fundamentals",
  title: "Python Programming Tutorial",
  version: "2.2.0",
  description: "A friendly, step-by-step Python course using the clear W3Schools format. Learn to code from your first line up to reusable functions.",
  author: "PySlide Lab",
  totalEstimatedHours: 10,
  modules: [
    // =========================================================================
    // MODULE 1: Python Basics & Syntax
    // =========================================================================
    {
      id: "module-01-python-basics",
      title: "1. Python Basics & Syntax",
      order: 1,
      description: "Write your very first line of code, show words on screen with print(), do simple math, and leave notes with comments.",
      category: "standard",
      lessons: [
        {
          id: "lesson-01-01-what-is-python",
          title: "Python Introduction",
          order: 1,
          summary: "Learn what Python is, why people love it, and how a computer follows your code line by line.",
          difficulty: "beginner",
          estimatedMinutes: 5,
          learningObjectives: [
            "Understand what a computer program is",
            "Learn how Python runs code from top to bottom",
            "Write and run your very first Python program"
          ],
          prerequisites: [],
          conceptsIntroduced: ["concept-python-basics", "concept-io-output"],
          tags: ["intro", "python", "basics"],
          sections: [
            {
              id: "sec-01-01-exp",
              type: "explanation",
              title: "What is Python?",
              content: "Python is a friendly programming language created in 1991 by Guido van Rossum. It is designed to be as easy to read as everyday English.\n\n### Why Learn Python?\n* **Easy to Read:** Python uses clean words instead of lots of messy brackets and symbols.\n* **Does Amazing Things:** People use Python to build websites, make games, analyze science data, and teach robots.\n* **Runs Line by Line:** A computer reads your code like a recipe—starting at line 1, then line 2, and working all the way down to the end.\n\nTo see your first result on screen, you use a built-in tool called `print()`.",
              keyPoints: [
                "Python code reads like simple English.",
                "Computers run your instructions from top to bottom, one line at a time.",
                "Use print() to display words and numbers on your screen."
              ]
            },
            {
              id: "sec-01-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "print(\"Your message here\")",
              description: "The print() function shows text or numbers on your screen.",
              components: [
                {
                  component: "print",
                  purpose: "The built-in word that tells Python to show something on screen.",
                  example: "print",
                  required: true
                },
                {
                  component: "( )",
                  purpose: "Parentheses hold the information you want to display.",
                  example: "(\"...\")",
                  required: true
                },
                {
                  component: "\" \"",
                  purpose: "Quotation marks tell Python: 'This is plain human text, not a code command.'",
                  example: "\"Hello, World!\"",
                  required: true
                }
              ],
              notes: "You can use double quotes (\"...\") or single quotes ('...'). Just make sure both ends match!"
            },
            {
              id: "sec-01-01-example",
              type: "example",
              title: "Example: Hello, World!",
              code: "print(\"Hello, World!\")\nprint(\"I am learning Python!\")",
              description: "This small two-line program shows two messages. Each print() starts on a new line.",
              expectedOutput: "Hello, World!\nI am learning Python!",
              stepByStep: [
                "Python reads line 1 and displays 'Hello, World!'.",
                "Python moves to line 2 and displays 'I am learning Python!' right below it."
              ]
            },
            {
              id: "sec-01-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Change the message inside the quotes to 'Welcome to Python!' and click Run Code.",
              starterCode: "print(\"Hello, World!\")\n",
              solutionCode: "print(\"Welcome to Python!\")",
              expectedOutput: "Welcome to Python!",
              hints: [
                "Keep the quotation marks inside the parentheses.",
                "Type Welcome to Python! inside the quotes."
              ]
            },
            {
              id: "sec-01-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting Quotes Around Text",
                  badCode: "print(Hello World)",
                  goodCode: "print(\"Hello World\")",
                  explanation: "Without quotes, Python gets confused and thinks Hello is a code command instead of plain words."
                },
                {
                  title: "2. Using a Capital P in Print",
                  badCode: "Print(\"Hello\")",
                  goodCode: "print(\"Hello\")",
                  explanation: "Python cares about capital letters. 'print' must always be lowercase."
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
                  question: "Type the missing word to show words on screen: ____(\"Python is fun\")",
                  prompt: "Type the word:",
                  correctAnswer: "print",
                  acceptedAnswers: ["print", "print()"],
                  hint: "It starts with the letter 'p'.",
                  explanation: "The print() command shows words on your screen."
                },
                {
                  id: "q-01-01-2",
                  type: "multiple-choice",
                  question: "How does Python run your code?",
                  options: [
                    "From top to bottom, one line after another",
                    "All lines at the exact same second",
                    "Backwards from the bottom to the top",
                    "In a random order every time"
                  ],
                  correctIndex: 0,
                  explanation: "Python follows instructions in order, from top to bottom."
                }
              ]
            },
            {
              id: "sec-01-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Programs are step-by-step instructions for computers.",
                "print() displays words on your screen.",
                "Always wrap plain words in quotes like \"Hello\"."
              ]
            }
          ]
        },
        {
          id: "lesson-01-02-the-print-function",
          title: "The print() Function",
          order: 2,
          summary: "Print multiple things together, display numbers, and choose custom spaces or line endings.",
          difficulty: "beginner",
          estimatedMinutes: 6,
          learningObjectives: [
            "Print multiple words separated by commas",
            "See the difference between printing words and numbers",
            "Use 'sep' to change the spacer and 'end' to control lines"
          ],
          prerequisites: ["lesson-01-01-what-is-python"],
          conceptsIntroduced: ["concept-io-output-sep-end"],
          tags: ["print", "output"],
          sections: [
            {
              id: "sec-01-02-exp",
              type: "explanation",
              title: "Printing More Than One Thing",
              content: "You can print several items at once by separating them with commas. Python puts a space between each item for you automatically.\n\n### Numbers Don't Need Quotes!\nNotice that numbers do not need quotation marks. If you type `print(25)`, Python understands it as a real number. If you type `print(\"25\")`, Python treats it like letters in a book.",
              keyPoints: [
                "Use commas to print multiple items on the same line.",
                "Words need quotes; real numbers do not.",
                "Use sep='-' to change the space between items."
              ]
            },
            {
              id: "sec-01-02-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "print(item1, item2, sep=\" \", end=\"\\n\")",
              description: "How to customize what print() displays.",
              components: [
                {
                  component: "item1, item2",
                  purpose: "The words, numbers, or variables you want to print, separated by commas.",
                  example: "\"Age:\", 12",
                  required: true
                },
                {
                  component: "sep=\" \"",
                  purpose: "What Python puts between items. Default is a single space.",
                  example: "sep=\"-\"",
                  required: false
                },
                {
                  component: "end=\"\\n\"",
                  purpose: "What Python puts at the very end. Default is a new line.",
                  example: "end=\" \"",
                  required: false
                }
              ],
              notes: "Setting end=\" \" stops Python from jumping to a new line, so the next print() continues on the same line."
            },
            {
              id: "sec-01-02-example",
              type: "example",
              title: "Example: Multiple Items & Custom Spacers",
              code: "print(\"Python\", \"is\", \"fun!\")\nprint(\"2026\", \"10\", \"24\", sep=\"-\")\nprint(\"Loading\", end=\"...\")\nprint(\"Done!\")",
              description: "Printing words with commas, using a dash separator, and keeping text on one line with end='...'.",
              expectedOutput: "Python is fun!\n2026-10-24\nLoading...Done!",
              stepByStep: [
                "Line 1 prints 3 words separated by spaces.",
                "Line 2 replaces the space with a dash: '2026-10-24'.",
                "Line 3 prints 'Loading...' without starting a new line.",
                "Line 4 prints 'Done!' right after it on the same line."
              ]
            },
            {
              id: "sec-01-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Print your name and your age separated by a comma. For example: print(\"Sam\", 15)",
              starterCode: "# Print your name and age below\nprint(\"Sam\", 15)\n",
              solutionCode: "print(\"Sam\", 15)",
              expectedOutput: "Sam 15",
              hints: [
                "Put quotes around the name, but no quotes around the number.",
                "Put a comma between them."
              ]
            },
            {
              id: "sec-01-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Using + to Combine Words and Numbers",
                  badCode: "print(\"Score: \" + 10)  # TypeError!",
                  goodCode: "print(\"Score:\", 10)",
                  explanation: "You cannot add text and numbers together with '+'. Use a comma (,) instead—it works with everything."
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
                  question: "What does this code display?",
                  codeSnippet: "print(\"Cat\", \"Dog\", sep=\"&\")",
                  correctAnswer: "Cat&Dog",
                  acceptedAnswers: ["Cat&Dog"],
                  hint: "sep replaces the space between Cat and Dog with an & symbol.",
                  explanation: "sep='&' places an ampersand between the two words."
                }
              ]
            },
            {
              id: "sec-01-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Commas let you print multiple things on one line.",
                "Numbers do not need quotation marks.",
                "Use sep to change the spacer between items."
              ]
            }
          ]
        },
        {
          id: "lesson-01-03-numbers-and-math",
          title: "Numbers & Basic Math",
          order: 3,
          summary: "Use Python as a super-fast calculator to add, subtract, multiply, and divide numbers.",
          difficulty: "beginner",
          estimatedMinutes: 7,
          learningObjectives: [
            "Learn about whole numbers (int) and decimal numbers (float)",
            "Do math with +, -, *, /, //, %, and **",
            "Understand the math order of operations"
          ],
          prerequisites: ["lesson-01-01-what-is-python"],
          conceptsIntroduced: ["concept-math-operators", "concept-data-numbers"],
          tags: ["math", "numbers", "operators"],
          sections: [
            {
              id: "sec-01-03-exp",
              type: "explanation",
              title: "Python Works Just Like a Calculator",
              content: "Python loves numbers! There are two main types of numbers you will use:\n\n* **Whole numbers (`int`):** Numbers without decimals, like `5`, `100`, or `-3`.\n* **Decimal numbers (`float`):** Numbers with a decimal point, like `3.14`, `0.5`, or `9.99`.\n\n### The Math Symbols\nHere are the symbols Python uses for math:\n\n* `+` for addition (`10 + 5 = 15`)\n* `-` for subtraction (`10 - 4 = 6`)\n* `*` for multiplication (`6 * 7 = 42`)\n* `/` for normal division (`10 / 2 = 5.0`)\n* `//` for whole-number division (`10 // 3 = 3`)\n* `%` for remainder (`10 % 3 = 1`)\n* `**` for power (`2 ** 3 = 8`, which means 2 * 2 * 2)",
              keyPoints: [
                "Normal division (/) always gives you a decimal number with a dot.",
                "Use ** to calculate powers (like 5 squared).",
                "Python follows standard math rules: it does multiplication before addition."
              ]
            },
            {
              id: "sec-01-03-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "answer = number1 + number2",
              description: "Doing math between two numbers.",
              components: [
                {
                  component: "number1, number2",
                  purpose: "The numbers you want to calculate with.",
                  example: "10, 5",
                  required: true
                },
                {
                  component: "operator",
                  purpose: "The math symbol: +, -, *, /, //, %, or **.",
                  example: "*",
                  required: true
                }
              ],
              notes: "You can use parentheses () to group calculations, like (2 + 3) * 4."
            },
            {
              id: "sec-01-03-example",
              type: "example",
              title: "Example: Math in Action",
              code: "print(10 + 5)\nprint(20 - 7)\nprint(4 * 6)\nprint(15 / 2)\nprint(2 ** 3)",
              description: "Adding, subtracting, multiplying, dividing, and raising to a power.",
              expectedOutput: "15\n13\n24\n7.5\n8",
              stepByStep: [
                "10 + 5 makes 15.",
                "20 - 7 makes 13.",
                "4 * 6 makes 24.",
                "15 / 2 makes 7.5.",
                "2 ** 3 means 2 * 2 * 2 = 8."
              ]
            },
            {
              id: "sec-01-03-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Calculate 5 to the power of 3 using ** and print the answer.",
              starterCode: "# Print 5 to the power of 3 below\nprint(5 ** 3)\n",
              solutionCode: "print(5 ** 3)",
              expectedOutput: "125",
              hints: [
                "Use the ** symbol for powers.",
                "5 ** 3 means 5 * 5 * 5."
              ]
            },
            {
              id: "sec-01-03-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Using ^ for Powers Instead of **",
                  badCode: "print(2 ^ 3)  # In Python, ^ does not mean power!",
                  goodCode: "print(2 ** 3) # Evaluates to 8",
                  explanation: "In Python, power uses two stars (**). A single caret (^) means something completely different."
                },
                {
                  title: "2. Dividing by Zero",
                  badCode: "print(10 / 0)",
                  goodCode: "print(10 / 2)",
                  explanation: "You cannot divide by zero. Python will show an error called ZeroDivisionError."
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
                  type: "short-answer",
                  question: "What is 10 plus 4 times 2 in Python? (print(10 + 4 * 2))",
                  prompt: "Enter the number:",
                  correctAnswer: "18",
                  acceptedAnswers: ["18"],
                  hint: "Multiplication happens first: 4 * 2 = 8, then 10 + 8.",
                  explanation: "Python multiplies 4 * 2 = 8 first, then adds 10 to get 18."
                }
              ]
            },
            {
              id: "sec-01-03-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Python does math just like a calculator.",
                "Use * to multiply and / to divide.",
                "Use ** to raise a number to a power."
              ]
            }
          ]
        },
        {
          id: "lesson-01-04-comments",
          title: "Python Comments",
          order: 4,
          summary: "Leave friendly notes in your code that Python ignores when running.",
          difficulty: "beginner",
          estimatedMinutes: 5,
          learningObjectives: [
            "Write notes in your code using the # symbol",
            "Understand why comments help you and other programmers",
            "Temporarily turn off a line of code while testing"
          ],
          prerequisites: ["lesson-01-01-what-is-python"],
          conceptsIntroduced: ["concept-comments"],
          tags: ["comments", "notes"],
          sections: [
            {
              id: "sec-01-04-exp",
              type: "explanation",
              title: "Notes for Humans",
              content: "A **comment** is a note you leave in your code for yourself or other people to read. Whenever Python sees a `#` symbol, it completely ignores everything on that line after the `#`.\n\n### Why Write Comments?\n* **Explain your ideas:** Remind yourself why you wrote tricky code.\n* **Test ideas:** Temporarily put a `#` in front of a line so Python skips it while you test something else.",
              keyPoints: [
                "Comments start with the '#' symbol.",
                "Python ignores comments completely.",
                "Comments help you remember what your code does."
              ]
            },
            {
              id: "sec-01-04-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "# This is a helpful note\nprint(\"Hello\")  # You can also put notes here",
              description: "Put # before any words you want Python to skip.",
              components: [
                {
                  component: "#",
                  purpose: "The comment symbol telling Python to ignore the rest of the line.",
                  example: "# Set user points",
                  required: true
                },
                {
                  component: "Note text",
                  purpose: "Your friendly explanation in plain English.",
                  example: "Add 10 points",
                  required: false
                }
              ],
              notes: "Comments can be on their own line, or at the end of a line of code."
            },
            {
              id: "sec-01-04-example",
              type: "example",
              title: "Example: Friendly Notes in Code",
              code: "# Calculate the total price of apples\nprice = 2\nquantity = 5\ntotal = price * quantity  # Multiply price by count\n\nprint(\"Total is $\", total)",
              description: "Showing how comments help explain what each line of code is doing.",
              expectedOutput: "Total is $ 10",
              stepByStep: [
                "Python skips line 1 because it starts with #.",
                "Python stores price = 2 and quantity = 5.",
                "Python calculates total = 10, skipping the note on the right.",
                "Python prints 'Total is $ 10'."
              ]
            },
            {
              id: "sec-01-04-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Add a comment above the print line that says '# Say hello' and run your code.",
              starterCode: "# Say hello\nprint(\"Hello friend!\")\n",
              solutionCode: "# Say hello\nprint(\"Hello friend!\")",
              expectedOutput: "Hello friend!",
              hints: [
                "Start your note with the # symbol.",
                "Notice that adding a comment does not change the output."
              ]
            },
            {
              id: "sec-01-04-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Putting the # Inside Quotation Marks",
                  badCode: "print(\"# This is a note\")  # This prints the text with #!",
                  goodCode: "# This is a real note\nprint(\"Hello\")",
                  explanation: "Inside quotes, # is treated as plain text and will be printed out."
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
                  type: "multiple-choice",
                  question: "Which symbol starts a comment in Python?",
                  options: ["#", "//", "--", "/*"],
                  correctIndex: 0,
                  explanation: "The hash mark (#) is used for comments in Python."
                }
              ]
            },
            {
              id: "sec-01-04-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Comments start with #.",
                "Python ignores comments when running code.",
                "Use comments to explain your thoughts."
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // MODULE 2: Variables & Data Types
    // =========================================================================
    {
      id: "module-02-variables",
      title: "2. Variables & Core Data Types",
      order: 2,
      description: "Save information in named boxes called variables, follow naming rules, and convert between types.",
      category: "standard",
      lessons: [
        {
          id: "lesson-02-01-creating-variables",
          title: "Python Variables",
          order: 1,
          summary: "Variables are like labeled storage boxes in your computer that hold information you can use later.",
          difficulty: "beginner",
          estimatedMinutes: 6,
          learningObjectives: [
            "Create a variable using the = sign",
            "Store words and numbers in variables",
            "Change the value inside a variable"
          ],
          prerequisites: ["lesson-01-01-what-is-python", "lesson-01-03-numbers-and-math"],
          conceptsIntroduced: ["concept-variables", "concept-assignment"],
          tags: ["variables", "storage"],
          sections: [
            {
              id: "sec-02-01-exp",
              type: "explanation",
              title: "What is a Variable?",
              content: "Imagine you have a cardboard box. You write a label on the outside: **`score`**. Inside the box, you put the number **`100`**.\n\nThat is exactly what a **variable** is! It is a named box in computer memory where you save a piece of information so you can use it again later.\n\n### How to Create a Variable\nYou type the name you want, followed by an equals sign `=`, followed by what you want to save inside.",
              keyPoints: [
                "Variables let you save information and reuse it later.",
                "The '=' sign puts the value into the box.",
                "You can change what is inside the box anytime."
              ]
            },
            {
              id: "sec-02-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "box_name = value",
              description: "Saving a value inside a variable.",
              components: [
                {
                  component: "box_name",
                  purpose: "The name you choose for your variable.",
                  example: "player_name",
                  required: true
                },
                {
                  component: "=",
                  purpose: "The assignment sign: puts the value on the right into the box on the left.",
                  example: "=",
                  required: true
                },
                {
                  component: "value",
                  purpose: "The words, numbers, or data you want to save.",
                  example: "\"Alex\"",
                  required: true
                }
              ],
              notes: "The variable name must always go on the left, and the value on the right."
            },
            {
              id: "sec-02-01-example",
              type: "example",
              title: "Example: Creating and Changing Variables",
              code: "name = \"Maya\"\npoints = 50\nprint(name, \"has\", points, \"points\")\n\n# Give Maya 20 more points:\npoints = 70\nprint(name, \"now has\", points, \"points\")",
              description: "Storing words and numbers, then updating the points variable.",
              expectedOutput: "Maya has 50 points\nMaya now has 70 points",
              stepByStep: [
                "name stores 'Maya'.",
                "points stores 50.",
                "Line 3 displays 'Maya has 50 points'.",
                "Line 6 changes points to 70.",
                "Line 7 displays the new score."
              ]
            },
            {
              id: "sec-02-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Create a variable named 'score' with the value 100, then print it.",
              starterCode: "# Create score below\nscore = 100\nprint(score)\n",
              solutionCode: "score = 100\nprint(score)",
              expectedOutput: "100",
              hints: [
                "Type 'score = 100'.",
                "Print score without quotes: print(score)."
              ]
            },
            {
              id: "sec-02-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Putting Variable Names in Quotes When Printing",
                  badCode: "name = \"Sam\"\nprint(\"name\")  # Prints the literal word 'name'",
                  goodCode: "name = \"Sam\"\nprint(name)    # Prints 'Sam'",
                  explanation: "If you put quotes around the variable name, Python prints the letters n-a-m-e instead of what is inside the box."
                }
              ]
            },
            {
              id: "sec-02-01-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-02-01-1",
                  type: "short-answer",
                  question: "Which symbol puts a value into a variable? x ___ 10",
                  prompt: "Enter symbol:",
                  correctAnswer: "=",
                  acceptedAnswers: ["="],
                  hint: "The equals sign.",
                  explanation: "The single equals sign (=) saves the value on the right into the variable on the left."
                }
              ]
            },
            {
              id: "sec-02-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Variables are named boxes that hold information.",
                "Use the = sign to store a value.",
                "Do not put quotes around variable names when printing."
              ]
            }
          ]
        },
        {
          id: "lesson-02-02-variable-names",
          title: "Variable Naming Rules",
          order: 2,
          summary: "Learn the rules for naming your variables and how to use clean snake_case.",
          difficulty: "beginner",
          estimatedMinutes: 5,
          learningObjectives: [
            "Learn what characters are allowed in variable names",
            "Understand why variables cannot start with a number",
            "Use underscores instead of spaces"
          ],
          prerequisites: ["lesson-02-01-creating-variables"],
          conceptsIntroduced: ["concept-variable-naming"],
          tags: ["naming", "variables", "rules"],
          sections: [
            {
              id: "sec-02-02-exp",
              type: "explanation",
              title: "Rules for Naming Variables",
              content: "Python has a few simple rules for choosing variable names:\n\n* **Must start with a letter** (a-z) or an underscore (`_`).\n* **Cannot start with a number.**\n* **No spaces allowed!** Use an underscore `_` to connect words, like `user_name`.\n* **Capital letters matter:** `score`, `Score`, and `SCORE` are three different boxes.\n* **No special symbols:** Symbols like `-`, `!`, `@`, `$`, `%` are not allowed.",
              keyPoints: [
                "Start with a letter or underscore.",
                "Never put spaces in variable names: use snake_case like 'my_name'.",
                "Pick names that clearly describe what is inside."
              ]
            },
            {
              id: "sec-02-02-syntax",
              type: "syntax",
              title: "Syntax: snake_case",
              syntax: "first_name = \"Sarah\"\nuser_age = 14",
              description: "Use all lowercase letters with words connected by underscores.",
              components: [
                {
                  component: "lowercase_word",
                  purpose: "Spells out a clear descriptive word.",
                  example: "user",
                  required: true
                },
                {
                  component: "_",
                  purpose: "Connects two words together instead of a space.",
                  example: "_",
                  required: false
                }
              ],
              notes: "Python programmers call this 'snake_case' because the words crawl on the ground connected by underscores!"
            },
            {
              id: "sec-02-02-example",
              type: "example",
              title: "Example: Clean Variable Names",
              code: "student_name = \"Alex\"\nmath_score = 95\nis_happy = True\n\nprint(student_name, \"got\", math_score)",
              description: "Clear, easy-to-read variable names following Python style.",
              expectedOutput: "Alex got 95",
              stepByStep: [
                "student_name explains that this box holds a student's name.",
                "math_score explains that this box holds an exam grade.",
                "Both use underscores instead of spaces."
              ]
            },
            {
              id: "sec-02-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Fix the broken variable name '2nd_player' so it starts with a letter like 'second_player' and runs.",
              starterCode: "# Fix the variable name below:\nsecond_player = \"Jordan\"\nprint(second_player)\n",
              solutionCode: "second_player = \"Jordan\"\nprint(second_player)",
              expectedOutput: "Jordan",
              hints: [
                "Variable names cannot start with a number.",
                "Spell out 'second_player'."
              ]
            },
            {
              id: "sec-02-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Putting Spaces in Names",
                  badCode: "user name = \"Sam\"  # SyntaxError!",
                  goodCode: "user_name = \"Sam\"",
                  explanation: "Python gets confused by spaces in names. Connect words with an underscore (_)."
                }
              ]
            },
            {
              id: "sec-02-02-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-02-02-1",
                  type: "multiple-choice",
                  question: "Which of these is a correct Python variable name?",
                  options: [
                    "player_score",
                    "player score",
                    "1st_player",
                    "player-score"
                  ],
                  correctIndex: 0,
                  explanation: "player_score uses an underscore and starts with a letter."
                }
              ]
            },
            {
              id: "sec-02-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Start names with a letter.",
                "Use underscores instead of spaces (snake_case).",
                "Names cannot start with numbers."
              ]
            }
          ]
        },
        {
          id: "lesson-02-03-python-data-types",
          title: "Python Data Types",
          order: 3,
          summary: "Learn the four basic types of data: text (str), whole numbers (int), decimals (float), and True/False (bool).",
          difficulty: "beginner",
          estimatedMinutes: 7,
          learningObjectives: [
            "Learn the four main data types in Python",
            "Use type() to ask Python what type a variable is",
            "Learn how True and False booleans work"
          ],
          prerequisites: ["lesson-02-01-creating-variables"],
          conceptsIntroduced: ["concept-data-types", "concept-type-function"],
          tags: ["types", "str", "int", "float", "bool"],
          sections: [
            {
              id: "sec-02-03-exp",
              type: "explanation",
              title: "The 4 Main Kinds of Data",
              content: "Just like a kitchen has different ingredients (milk, flour, eggs), Python has different **data types**:\n\n* **Text (`str` / String):** Plain words wrapped in quotes, like `\"Hello\"`.\n* **Whole Numbers (`int` / Integer):** Numbers without a dot, like `42` or `-7`.\n* **Decimal Numbers (`float`):** Numbers with a decimal point, like `9.99`.\n* **Yes/No (`bool` / Boolean):** Strictly `True` or `False`.\n\nYou can ask Python what type something is anytime using `type(x)`.",
              keyPoints: [
                "Text is called 'str' (string).",
                "Whole numbers are called 'int'.",
                "Decimals are called 'float'.",
                "True and False are called 'bool' (booleans)."
              ]
            },
            {
              id: "sec-02-03-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "type(my_variable)",
              description: "Ask Python to tell you what kind of data is inside a variable.",
              components: [
                {
                  component: "type()",
                  purpose: "The built-in tool that inspects a variable's type.",
                  example: "type(age)",
                  required: true
                }
              ],
              notes: "type(10) outputs <class 'int'>. type('hello') outputs <class 'str'>."
            },
            {
              id: "sec-02-03-example",
              type: "example",
              title: "Example: Checking Data Types",
              code: "city = \"Tokyo\"\nage = 14\nprice = 4.99\nis_open = True\n\nprint(type(city))\nprint(type(age))\nprint(type(price))\nprint(type(is_open))",
              description: "Creating one variable of each type and printing their types.",
              expectedOutput: "<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'bool'>",
              stepByStep: [
                "city has quotes -> <class 'str'>.",
                "age is a whole number -> <class 'int'>.",
                "price has a decimal point -> <class 'float'>.",
                "is_open is True -> <class 'bool'>."
              ]
            },
            {
              id: "sec-02-03-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Create a boolean variable named 'is_sunny' set to True, and print its type.",
              starterCode: "is_sunny = True\nprint(type(is_sunny))\n",
              solutionCode: "is_sunny = True\nprint(type(is_sunny))",
              expectedOutput: "<class 'bool'>",
              hints: [
                "Capitalize True with a capital 'T'.",
                "Use print(type(is_sunny))."
              ]
            },
            {
              id: "sec-02-03-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Lowercase true or false",
                  badCode: "is_ready = true   # NameError!",
                  goodCode: "is_ready = True",
                  explanation: "In Python, True and False MUST start with a capital letter."
                }
              ]
            },
            {
              id: "sec-02-03-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-02-03-1",
                  type: "multiple-choice",
                  question: "What kind of data type is 7.5?",
                  options: ["float", "int", "str", "bool"],
                  correctIndex: 0,
                  explanation: "Any number with a decimal point is a float in Python."
                }
              ]
            },
            {
              id: "sec-02-03-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "str holds text in quotes.",
                "int holds whole numbers.",
                "float holds decimal numbers.",
                "bool holds True or False."
              ]
            }
          ]
        },
        {
          id: "lesson-02-04-type-conversion",
          title: "Type Casting (Conversion)",
          order: 4,
          summary: "Turn text numbers into real numbers with int() and float() so you can do math on them.",
          difficulty: "beginner",
          estimatedMinutes: 6,
          learningObjectives: [
            "Convert text into numbers using int() and float()",
            "Turn numbers into text using str()",
            "Understand why type conversion is needed"
          ],
          prerequisites: ["lesson-02-03-python-data-types"],
          conceptsIntroduced: ["concept-type-casting"],
          tags: ["convert", "int", "float", "str"],
          sections: [
            {
              id: "sec-02-04-exp",
              type: "explanation",
              title: "Changing Data from One Type to Another",
              content: "Sometimes you have a number that is trapped inside quotes as text, like `\"10\"`. Python sees this as text characters, not as a number you can do math with!\n\n**Type conversion** (also called casting) lets you transform data:\n* `int(\"10\")` turns the text `\"10\"` into the real number `10`.\n* `float(\"3.5\")` turns the text `\"3.5\"` into a decimal `3.5`.\n* `str(100)` turns the number `100` into text `\"100\"`.",
              keyPoints: [
                "Use int() to turn text into a whole number.",
                "Use float() to turn text into a decimal number.",
                "Use str() to turn a number into text."
              ]
            },
            {
              id: "sec-02-04-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "real_number = int(\"25\")\ndecimal_number = float(\"9.99\")\ntext_words = str(100)",
              description: "Converting values between types.",
              components: [
                {
                  component: "int()",
                  purpose: "Converts to a whole number.",
                  example: "int(\"5\")",
                  required: true
                },
                {
                  component: "float()",
                  purpose: "Converts to a decimal number.",
                  example: "float(\"3.14\")",
                  required: true
                },
                {
                  component: "str()",
                  purpose: "Converts to text wrapped in quotes.",
                  example: "str(42)",
                  required: true
                }
              ],
              notes: "If you convert a float like int(9.99), Python chops off the decimal and leaves you with 9."
            },
            {
              id: "sec-02-04-example",
              type: "example",
              title: "Example: Converting Text to Number for Math",
              code: "text_points = \"50\"\n# Convert text into a real number:\npoints = int(text_points)\nbonus = points + 20\n\nprint(\"Total points:\", bonus)",
              description: "Converting '50' into a real number so we can add 20 to it.",
              expectedOutput: "Total points: 70",
              stepByStep: [
                "text_points starts as text: '50'.",
                "int(text_points) turns it into the number 50.",
                "50 + 20 makes 70.",
                "The total 70 is printed."
              ]
            },
            {
              id: "sec-02-04-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Convert the text '15' into an integer, add 5 to it, and print the result.",
              starterCode: "text_num = \"15\"\n# Convert text_num to int and add 5\nnum = int(text_num)\nprint(num + 5)\n",
              solutionCode: "text_num = \"15\"\nnum = int(text_num)\nprint(num + 5)",
              expectedOutput: "20",
              hints: [
                "Use int(text_num).",
                "Add 5 to the converted number."
              ]
            },
            {
              id: "sec-02-04-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Converting Words into Numbers",
                  badCode: "number = int(\"ten\")  # ValueError!",
                  goodCode: "number = int(\"10\")",
                  explanation: "Python cannot turn the English word 'ten' into a number. The text inside quotes must be digits like '10'."
                }
              ]
            },
            {
              id: "sec-02-04-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-02-04-1",
                  type: "short-answer",
                  question: "What is the answer to int(5.8)?",
                  prompt: "Enter number:",
                  correctAnswer: "5",
                  acceptedAnswers: ["5"],
                  hint: "int() chops off the decimal part.",
                  explanation: "int() removes the decimal part without rounding, leaving 5."
                }
              ]
            },
            {
              id: "sec-02-04-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "int() turns text numbers into whole numbers.",
                "float() turns text into decimal numbers.",
                "str() turns numbers into text."
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // MODULE 3: Operators & Booleans
    // =========================================================================
    {
      id: "module-03-operators",
      title: "3. Operators & Booleans",
      order: 3,
      description: "Compare values to see what is bigger or smaller, combine rules with and/or/not, and format text with f-strings.",
      category: "standard",
      lessons: [
        {
          id: "lesson-03-01-comparison-operators",
          title: "Comparison Operators",
          order: 1,
          summary: "Compare two values to see if something is bigger, smaller, or equal. The result is always True or False.",
          difficulty: "beginner",
          estimatedMinutes: 6,
          learningObjectives: [
            "Use == to check if two things are equal",
            "Use != to check if two things are different",
            "Use >, <, >=, and <= to compare numbers"
          ],
          prerequisites: ["lesson-02-03-python-data-types"],
          conceptsIntroduced: ["concept-comparison-operators"],
          tags: ["compare", "booleans"],
          sections: [
            {
              id: "sec-03-01-exp",
              type: "explanation",
              title: "Comparing Things in Code",
              content: "Whenever you compare two things, Python gives you back an answer of either **`True`** or **`False`**.\n\n### Comparison Signs\n* `==` means **equal to** (`5 == 5` is `True`)\n* `!=` means **not equal to** (`5 != 3` is `True`)\n* `>` means **greater than** (`10 > 7` is `True`)\n* `<` means **less than** (`4 < 2` is `False`)\n* `>=` means **greater than or equal to** (`8 >= 8` is `True`)\n* `<=` means **less than or equal to** (`5 <= 3` is `False`)",
              keyPoints: [
                "Comparisons always give back True or False.",
                "Double equals '==' checks if values match.",
                "Single equals '=' is for saving into a variable."
              ]
            },
            {
              id: "sec-03-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "is_allowed = (age >= 18)",
              description: "Comparing two values.",
              components: [
                {
                  component: "==",
                  purpose: "Checks if two values are equal.",
                  example: "score == 100",
                  required: false
                },
                {
                  component: "!=",
                  purpose: "Checks if two values are NOT equal.",
                  example: "score != 0",
                  required: false
                },
                {
                  component: ">, <, >=, <=",
                  purpose: "Checks which number is bigger or smaller.",
                  example: "age >= 18",
                  required: false
                }
              ],
              notes: "Never use a single '=' to compare. Always use double '=='."
            },
            {
              id: "sec-03-01-example",
              type: "example",
              title: "Example: Comparing Numbers",
              code: "age = 15\nprint(\"Is adult (18 or older):\", age >= 18)\nprint(\"Is teenager (equal to 15):\", age == 15)\nprint(\"Is not zero:\", age != 0)",
              description: "Checking age against different rules.",
              expectedOutput: "Is adult (18 or older): False\nIs teenager (equal to 15): True\nIs not zero: True",
              stepByStep: [
                "15 >= 18 is False.",
                "15 == 15 is True.",
                "15 != 0 is True."
              ]
            },
            {
              id: "sec-03-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Check if 20 is greater than 10 and print the True/False answer.",
              starterCode: "# Print if 20 > 10 below\nprint(20 > 10)\n",
              solutionCode: "print(20 > 10)",
              expectedOutput: "True",
              hints: [
                "Use the > symbol.",
                "print(20 > 10)"
              ]
            },
            {
              id: "sec-03-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Using Single = Instead of Double ==",
                  badCode: "if score = 100:  # Error!",
                  goodCode: "if score == 100:",
                  explanation: "A single '=' is used to save into a variable. Double '==' is used to check if things are equal."
                }
              ]
            },
            {
              id: "sec-03-01-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-03-01-1",
                  type: "code-output",
                  question: "What does this code display?",
                  codeSnippet: "print(10 == 20)",
                  correctAnswer: "False",
                  acceptedAnswers: ["False"],
                  hint: "Does 10 equal 20?",
                  explanation: "Since 10 is not equal to 20, Python says False."
                }
              ]
            },
            {
              id: "sec-03-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Comparisons always result in True or False.",
                "Use == to test if two things are equal.",
                "Use > and < to check bigger and smaller."
              ]
            }
          ]
        },
        {
          id: "lesson-03-02-logical-operators",
          title: "Logical Operators (and, or, not)",
          order: 2,
          summary: "Combine rules using everyday words: 'and' (both must be true), 'or' (either can be true), and 'not' (flip the answer).",
          difficulty: "beginner",
          estimatedMinutes: 6,
          learningObjectives: [
            "Use 'and' to check if two conditions are both True",
            "Use 'or' to check if at least one condition is True",
            "Use 'not' to flip True to False and False to True"
          ],
          prerequisites: ["lesson-03-01-comparison-operators"],
          conceptsIntroduced: ["concept-logical-operators"],
          tags: ["and", "or", "not", "logic"],
          sections: [
            {
              id: "sec-03-02-exp",
              type: "explanation",
              title: "Checking More Than One Rule",
              content: "In real life, rules often go together: *\"To ride the roller coaster, you must be 12 years old **AND** have a ticket.\"*\n\nPython has 3 simple words to combine rules:\n* **`and`:** Both sides must be `True`.\n* **`or`:** At least one side must be `True`.\n* **`not`:** Flips the answer (`not True` becomes `False`).",
              keyPoints: [
                "'and' requires both rules to be True.",
                "'or' is happy if either rule is True.",
                "'not' flips the answer upside down."
              ]
            },
            {
              id: "sec-03-02-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "can_enter = has_ticket and age >= 12\ncan_play = is_weekend or is_holiday\nis_offline = not is_online",
              description: "Combining rules with and, or, and not.",
              components: [
                {
                  component: "and",
                  purpose: "True only if BOTH sides are True.",
                  example: "age >= 10 and has_ticket",
                  required: false
                },
                {
                  component: "or",
                  purpose: "True if EITHER side is True.",
                  example: "is_sat or is_sun",
                  required: false
                },
                {
                  component: "not",
                  purpose: "Flips True to False, or False to True.",
                  example: "not is_closed",
                  required: false
                }
              ],
              notes: "Python uses plain English words (and, or, not)."
            },
            {
              id: "sec-03-02-example",
              type: "example",
              title: "Example: Checking Roller Coaster Rules",
              code: "age = 14\nhas_ticket = True\n\ncan_ride = (age >= 12) and has_ticket\nprint(\"Can ride roller coaster:\", can_ride)\n\nis_sunny = False\nis_warm = True\ngood_weather = is_sunny or is_warm\nprint(\"Good weather:\", good_weather)",
              description: "Testing 'and' with two rules, and 'or' with weather rules.",
              expectedOutput: "Can ride roller coaster: True\nGood weather: True",
              stepByStep: [
                "age >= 12 is True, and has_ticket is True -> True and True = True.",
                "is_sunny is False, but is_warm is True -> False or True = True."
              ]
            },
            {
              id: "sec-03-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Check if temperature > 20 and temperature < 30, and print the answer.",
              starterCode: "temp = 25\n# Check if temp is between 20 and 30\nprint(temp > 20 and temp < 30)\n",
              solutionCode: "temp = 25\nprint(temp > 20 and temp < 30)",
              expectedOutput: "True",
              hints: [
                "Use the word 'and' between the two comparisons.",
                "temp > 20 and temp < 30"
              ]
            },
            {
              id: "sec-03-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Using && or ||",
                  badCode: "if age > 10 && has_ticket:  # Error!",
                  goodCode: "if age > 10 and has_ticket:",
                  explanation: "Python does not use && or || like other languages. Always spell out 'and' and 'or'."
                }
              ]
            },
            {
              id: "sec-03-02-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-03-02-1",
                  type: "code-output",
                  question: "What does this code display?",
                  codeSnippet: "print(not (5 > 2))",
                  correctAnswer: "False",
                  acceptedAnswers: ["False"],
                  hint: "5 > 2 is True. What does 'not True' become?",
                  explanation: "5 > 2 is True, and 'not True' flips to False."
                }
              ]
            },
            {
              id: "sec-03-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "'and' requires both to be True.",
                "'or' requires at least one to be True.",
                "'not' flips the result."
              ]
            }
          ]
        },
        {
          id: "lesson-03-03-fstrings",
          title: "F-Strings (Formatted Strings)",
          order: 3,
          summary: "Insert your variables directly inside messages using {curly braces} and an f in front.",
          difficulty: "beginner",
          estimatedMinutes: 6,
          learningObjectives: [
            "Put an 'f' in front of quotes to make an f-string",
            "Insert variables inside {curly braces}",
            "Write clean, readable messages without messy plus signs"
          ],
          prerequisites: ["lesson-02-01-creating-variables", "lesson-01-02-the-print-function"],
          conceptsIntroduced: ["concept-fstrings", "concept-string-interpolation"],
          tags: ["f-strings", "strings", "formatting"],
          sections: [
            {
              id: "sec-03-03-exp",
              type: "explanation",
              title: "The Cleanest Way to Build Messages",
              content: "Putting words and numbers together used to be clumsy. In modern Python, you use an **f-string**:\n\n1. Put the letter **`f`** right in front of the opening quotation mark: `f\"...\"`.\n2. Put any variable or calculation you want inside **`{curly braces}`**.\n\nPython automatically swaps out `{name}` for the actual value!",
              keyPoints: [
                "Put the letter 'f' before the quotes.",
                "Wrap your variables inside {curly braces}.",
                "Much easier to read than lots of commas or plus signs."
              ]
            },
            {
              id: "sec-03-03-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "f\"Hello, {name}! Your score is {score}.\"",
              description: "Putting variables inside text.",
              components: [
                {
                  component: "f",
                  purpose: "Tells Python to look for {curly braces} inside.",
                  example: "f\"...\"",
                  required: true
                },
                {
                  component: "{variable}",
                  purpose: "Replaced with the actual value of that variable.",
                  example: "{player_name}",
                  required: true
                }
              ],
              notes: "You can even do math inside the braces, like {5 + 5}."
            },
            {
              id: "sec-03-03-example",
              type: "example",
              title: "Example: Creating Friendly Messages",
              code: "name = \"Lucas\"\nlevel = 4\nprint(f\"Welcome back, {name}!\")\nprint(f\"You are on level {level}, and next is level {level + 1}.\")",
              description: "Using f-strings to display a name, level, and quick math calculation.",
              expectedOutput: "Welcome back, Lucas!\nYou are on level 4, and next is level 5.",
              stepByStep: [
                "{name} is replaced with 'Lucas'.",
                "{level} is replaced with 4.",
                "{level + 1} calculates 4 + 1 and prints 5."
              ]
            },
            {
              id: "sec-03-03-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Use an f-string to print 'My dog is named Max' using the pet variable.",
              starterCode: "pet = \"Max\"\n# Print 'My dog is named Max' using an f-string:\nprint(f\"My dog is named {pet}\")\n",
              solutionCode: "pet = \"Max\"\nprint(f\"My dog is named {pet}\")",
              expectedOutput: "My dog is named Max",
              hints: [
                "Put the letter f before the first quote.",
                "Put {pet} inside the string."
              ]
            },
            {
              id: "sec-03-03-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting the 'f' Before Quotes",
                  badCode: "print(\"Hello {name}\")  # Prints literal '{name}'!",
                  goodCode: "print(f\"Hello {name}\")",
                  explanation: "Without the 'f' in front, Python thinks you literally want to print the curly braces and the word name."
                }
              ]
            },
            {
              id: "sec-03-03-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-03-03-1",
                  type: "code-output",
                  question: "What does this code display?",
                  codeSnippet: "x = 10\nprint(f\"Double is {x * 2}\")",
                  correctAnswer: "Double is 20",
                  acceptedAnswers: ["Double is 20"],
                  hint: "x * 2 calculates 10 * 2 = 20.",
                  explanation: "{x * 2} evaluates to 20, producing 'Double is 20'."
                }
              ]
            },
            {
              id: "sec-03-03-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "f-strings start with 'f' before the opening quote.",
                "Variables go inside {curly braces}.",
                "F-strings are the modern, clean way to build messages."
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // MODULE 4: Conditions & Decisions (If...Else)
    // =========================================================================
    {
      id: "module-04-conditions",
      title: "4. Conditions & Decisions (If...Else)",
      order: 4,
      description: "Teach your program to make smart choices using if, elif, and else, and master 4-space indentation.",
      category: "standard",
      lessons: [
        {
          id: "lesson-04-01-the-if-statement",
          title: "The if Statement & Indentation",
          order: 1,
          summary: "Make your code do something only when a rule is met, and learn how Python uses 4-space indentation.",
          difficulty: "beginner",
          estimatedMinutes: 7,
          learningObjectives: [
            "Write an if statement with a condition and colon (:)",
            "Indent lines with 4 spaces to show what belongs inside",
            "Understand how Python skips code when a condition is False"
          ],
          prerequisites: ["lesson-03-01-comparison-operators"],
          conceptsIntroduced: ["concept-control-flow-if", "concept-indentation"],
          tags: ["if", "choices", "indentation"],
          sections: [
            {
              id: "sec-04-01-exp",
              type: "explanation",
              title: "Teaching Code to Make Choices",
              content: "A program that does the exact same thing every time is boring. Real programs make decisions: *\"If the password is right, log in. If the player runs out of hearts, show Game Over.\"*\n\n### The Colon and 4 Spaces\nTo write an `if` statement in Python:\n1. Write `if` followed by your rule.\n2. Put a colon `:` at the end of the line.\n3. **Indent** the next line by **4 spaces**! Python uses these spaces to know which lines belong inside the decision.",
              keyPoints: [
                "An if statement runs code only when its rule is True.",
                "Always end the if line with a colon (:).",
                "Lines inside the if statement must be indented by 4 spaces."
              ]
            },
            {
              id: "sec-04-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "if condition:\n    # Indented 4 spaces\n    do_this_action()",
              description: "Making a choice in Python.",
              components: [
                {
                  component: "if",
                  purpose: "Starts the decision statement.",
                  example: "if",
                  required: true
                },
                {
                  component: "condition",
                  purpose: "The rule Python tests (must evaluate to True or False).",
                  example: "score >= 50",
                  required: true
                },
                {
                  component: ":",
                  purpose: "Signals that the action steps start on the next line.",
                  example: ":",
                  required: true
                },
                {
                  component: "4 Spaces",
                  purpose: "Shows Python that these actions belong inside the if block.",
                  example: "    print(\"Passed!\")",
                  required: true
                }
              ],
              notes: "Lines that are not indented are outside the if statement and will run regardless."
            },
            {
              id: "sec-04-01-example",
              type: "example",
              title: "Example: Passing the Test",
              code: "score = 85\n\nif score >= 60:\n    print(\"Great job!\")\n    print(\"You passed the exam.\")\n\nprint(\"Report card complete.\")",
              description: "Because 85 >= 60 is True, both indented print lines execute. The unindented line always runs.",
              expectedOutput: "Great job!\nYou passed the exam.\nReport card complete.",
              stepByStep: [
                "score is 85.",
                "85 >= 60 is True.",
                "Python runs the indented lines: 'Great job!' and 'You passed the exam.'.",
                "Python continues to the unindented line: 'Report card complete.'."
              ]
            },
            {
              id: "sec-04-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Write an if statement that checks if temperature > 30. If so, print 'It is hot!'.",
              starterCode: "temperature = 35\n# Write your if statement below:\nif temperature > 30:\n    print(\"It is hot!\")\n",
              solutionCode: "temperature = 35\nif temperature > 30:\n    print(\"It is hot!\")",
              expectedOutput: "It is hot!",
              hints: [
                "End the if line with a colon (:).",
                "Indent print('It is hot!') with 4 spaces."
              ]
            },
            {
              id: "sec-04-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting the Colon (:)",
                  badCode: "if score >= 50\n    print(\"Passed\")  # SyntaxError!",
                  goodCode: "if score >= 50:\n    print(\"Passed\")",
                  explanation: "You must always place a colon (:) at the end of the if line."
                },
                {
                  title: "2. Forgetting to Indent",
                  badCode: "if score >= 50:\nprint(\"Passed\")  # IndentationError!",
                  goodCode: "if score >= 50:\n    print(\"Passed\")",
                  explanation: "Python requires code inside an if statement to be indented by 4 spaces."
                }
              ]
            },
            {
              id: "sec-04-01-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-04-01-1",
                  type: "short-answer",
                  question: "What punctuation mark must go at the end of the line: if age >= 18__",
                  prompt: "Enter symbol:",
                  correctAnswer: ":",
                  acceptedAnswers: [":"],
                  hint: "A colon (:).",
                  explanation: "Python statements like if, else, for, while, and def must end with a colon (:)."
                }
              ]
            },
            {
              id: "sec-04-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "if runs code only when a condition is True.",
                "Always end the line with a colon (:).",
                "Indent lines inside by 4 spaces."
              ]
            }
          ]
        },
        {
          id: "lesson-04-02-else-and-elif",
          title: "The else and elif Statements",
          order: 2,
          summary: "Add backup plans with 'else', and check multiple choices with 'elif'.",
          difficulty: "beginner",
          estimatedMinutes: 7,
          learningObjectives: [
            "Use 'else' to provide a backup plan when 'if' is False",
            "Use 'elif' to test several choices in a row",
            "Understand that only one choice in the chain will run"
          ],
          prerequisites: ["lesson-04-01-the-if-statement"],
          conceptsIntroduced: ["concept-control-flow-elif-else"],
          tags: ["else", "elif", "choices"],
          sections: [
            {
              id: "sec-04-02-exp",
              type: "explanation",
              title: "Backup Plans & Multiple Choices",
              content: "What if you want to do one thing when a rule is True, and something else when it is False? That's what **`else`** is for:\n\n* **`else`:** Means *\"otherwise, do this\"*. It has no condition of its own—it runs when the `if` was `False`.\n* **`elif`:** Short for *\"else if\"*. It lets you test 3, 4, or 5 different choices. As soon as Python finds one that is `True`, it runs that block and skips the rest!",
              keyPoints: [
                "else gives you a fallback when if is False.",
                "elif lets you test additional choices.",
                "Only one branch in the ladder will ever run."
              ]
            },
            {
              id: "sec-04-02-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "if score >= 90:\n    print(\"Grade A\")\nelif score >= 80:\n    print(\"Grade B\")\nelse:\n    print(\"Keep practicing!\")",
              description: "Choosing between multiple paths.",
              components: [
                {
                  component: "if rule:",
                  purpose: "Tested first.",
                  example: "if score >= 90:",
                  required: true
                },
                {
                  component: "elif rule:",
                  purpose: "Tested second if the first was False.",
                  example: "elif score >= 80:",
                  required: false
                },
                {
                  component: "else:",
                  purpose: "Runs if none of the rules above were True.",
                  example: "else:",
                  required: false
                }
              ],
              notes: "Notice that 'else' does NOT have a condition. It is just 'else:'."
            },
            {
              id: "sec-04-02-example",
              type: "example",
              title: "Example: Choosing Traffic Light Actions",
              code: "light = \"yellow\"\n\nif light == \"red\":\n    print(\"Stop!\")\nelif light == \"yellow\":\n    print(\"Slow down!\")\nelse:\n    print(\"Go!\")",
              description: "Checking traffic light colors with if, elif, and else.",
              expectedOutput: "Slow down!",
              stepByStep: [
                "light == 'red' is False.",
                "light == 'yellow' is True! Python prints 'Slow down!'.",
                "The else block is skipped."
              ]
            },
            {
              id: "sec-04-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "If age < 13 print 'Child', elif age < 20 print 'Teenager', else print 'Adult'.",
              starterCode: "age = 15\nif age < 13:\n    print(\"Child\")\nelif age < 20:\n    print(\"Teenager\")\nelse:\n    print(\"Adult\")\n",
              solutionCode: "age = 15\nif age < 13:\n    print(\"Child\")\nelif age < 20:\n    print(\"Teenager\")\nelse:\n    print(\"Adult\")",
              expectedOutput: "Teenager",
              hints: [
                "15 is not < 13, but it is < 20.",
                "So it prints 'Teenager'."
              ]
            },
            {
              id: "sec-04-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Giving 'else' a Rule",
                  badCode: "else score < 50:  # SyntaxError!",
                  goodCode: "else:\n    print(\"Try again\")",
                  explanation: "'else' is a catch-all fallback and does not take a rule. If you need a rule, use 'elif'."
                }
              ]
            },
            {
              id: "sec-04-02-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-04-02-1",
                  type: "code-output",
                  question: "What does this code display?",
                  codeSnippet: "x = 5\nif x > 10:\n    print(\"Big\")\nelse:\n    print(\"Small\")",
                  correctAnswer: "Small",
                  acceptedAnswers: ["Small"],
                  hint: "Is 5 > 10? No, so it goes to else.",
                  explanation: "Since 5 > 10 is False, the else block runs and displays 'Small'."
                }
              ]
            },
            {
              id: "sec-04-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "use elif to test more choices.",
                "use else for the final fallback.",
                "Only one choice in the ladder will run."
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // MODULE 5: Loops (Repeating Things)
    // =========================================================================
    {
      id: "module-05-loops",
      title: "5. Loops (Repeating Things)",
      order: 5,
      description: "Automate repetitive tasks with while loops, for loops with range(), and control loops with break and continue.",
      category: "standard",
      lessons: [
        {
          id: "lesson-05-01-while-loops",
          title: "The while Loop",
          order: 1,
          summary: "Repeat code again and again as long as a condition stays True.",
          difficulty: "intermediate",
          estimatedMinutes: 7,
          learningObjectives: [
            "Write a while loop with a condition",
            "Update the loop counter so the loop finishes",
            "Understand how to avoid infinite loops"
          ],
          prerequisites: ["lesson-04-01-the-if-statement"],
          conceptsIntroduced: ["concept-loops-while"],
          tags: ["while", "loops", "repeat"],
          sections: [
            {
              id: "sec-05-01-exp",
              type: "explanation",
              title: "Repeating Code with while",
              content: "A **loop** lets you repeat a block of code without typing it out ten times. A `while` loop keeps running **as long as its condition remains `True`**.\n\n### The 3 Parts of a while Loop:\n1. **Start:** Set a starting number (e.g. `count = 1`).\n2. **Check:** Python checks if `count <= 3` is True.\n3. **Step Forward:** Add 1 to your counter (`count += 1`).\n\nIf you forget step 3, the loop will run forever! That is called an **infinite loop**.",
              keyPoints: [
                "while loops repeat as long as their condition is True.",
                "Always make sure to update your counter so the loop can finish.",
                "count += 1 is shorthand for count = count + 1."
              ]
            },
            {
              id: "sec-05-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1  # Move forward!",
              description: "Repeating code with a condition.",
              components: [
                {
                  component: "while",
                  purpose: "Starts the repeat loop.",
                  example: "while",
                  required: true
                },
                {
                  component: "condition",
                  purpose: "Checked before each round. If True, the code inside repeats.",
                  example: "count <= 3",
                  required: true
                },
                {
                  component: "count += 1",
                  purpose: "Increases the counter so the loop eventually stops.",
                  example: "count += 1",
                  required: true
                }
              ],
              notes: "Always remember to update your counter inside the loop!"
            },
            {
              id: "sec-05-01-example",
              type: "example",
              title: "Example: Rocket Countdown",
              code: "countdown = 3\n\nwhile countdown > 0:\n    print(countdown)\n    countdown -= 1\n\nprint(\"Blast off!\")",
              description: "Counting down from 3 to 1 and stopping at 0.",
              expectedOutput: "3\n2\n1\nBlast off!",
              stepByStep: [
                "Round 1: countdown is 3 -> prints 3, decreases to 2.",
                "Round 2: countdown is 2 -> prints 2, decreases to 1.",
                "Round 3: countdown is 1 -> prints 1, decreases to 0.",
                "Round 4: countdown is 0 (0 > 0 is False) -> loop stops.",
                "Prints 'Blast off!'."
              ]
            },
            {
              id: "sec-05-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Write a while loop that prints numbers from 1 up to 3.",
              starterCode: "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1\n",
              solutionCode: "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1",
              expectedOutput: "1\n2\n3",
              hints: [
                "Use 'while i <= 3:'.",
                "Don't forget 'i += 1'."
              ]
            },
            {
              id: "sec-05-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting to Add to the Counter (Infinite Loop)",
                  badCode: "i = 1\nwhile i <= 3:\n    print(i)  # i never changes; runs forever!",
                  goodCode: "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1",
                  explanation: "Without i += 1, i stays 1 forever, so the loop never stops running."
                }
              ]
            },
            {
              id: "sec-05-01-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-05-01-1",
                  type: "short-answer",
                  question: "How many times does this loop print? x = 0; while x < 3: x += 1; print(x)",
                  prompt: "Enter number:",
                  correctAnswer: "3",
                  acceptedAnswers: ["3"],
                  hint: "It runs for x = 0, 1, and 2.",
                  explanation: "The loop runs 3 times before x reaches 3."
                }
              ]
            },
            {
              id: "sec-05-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "while loops repeat as long as their condition is True.",
                "Always increase your counter so the loop can stop.",
                "Infinite loops happen when the condition never turns False."
              ]
            }
          ]
        },
        {
          id: "lesson-05-02-for-loops-and-range",
          title: "The for Loop & range()",
          order: 2,
          summary: "Repeat an action a specific number of times easily using for loops and range().",
          difficulty: "intermediate",
          estimatedMinutes: 7,
          learningObjectives: [
            "Use 'for i in range()' to repeat code easily",
            "Understand that range(5) counts 0, 1, 2, 3, 4",
            "Use range(start, stop) to pick your starting number"
          ],
          prerequisites: ["lesson-05-01-while-loops"],
          conceptsIntroduced: ["concept-loops-for", "concept-range"],
          tags: ["for", "loops", "range"],
          sections: [
            {
              id: "sec-05-02-exp",
              type: "explanation",
              title: "Counting with for and range()",
              content: "When you already know how many times you want to repeat something (like 5 times), a **`for` loop** is the cleanest tool.\n\n### How range() Works\nThe `range()` tool counts numbers for you:\n* `range(4)` gives: `0, 1, 2, 3` (starts at 0, stops before 4).\n* `range(1, 5)` gives: `1, 2, 3, 4` (starts at 1, stops before 5).\n\nRemember: `range()` always **stops before the end number**!",
              keyPoints: [
                "for loops are the easiest way to repeat code a set number of times.",
                "range(5) counts 5 numbers: 0, 1, 2, 3, 4.",
                "range() stops right before the final number."
              ]
            },
            {
              id: "sec-05-02-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "for i in range(3):\n    print(\"Hello!\")",
              description: "Repeating code a set number of times.",
              components: [
                {
                  component: "for",
                  purpose: "Starts the sequence loop.",
                  example: "for",
                  required: true
                },
                {
                  component: "i",
                  purpose: "The counter variable that holds the current number.",
                  example: "i",
                  required: true
                },
                {
                  component: "in range(count)",
                  purpose: "Tells Python how many times to count.",
                  example: "in range(5)",
                  required: true
                }
              ],
              notes: "range(1, 4) produces 1, 2, 3 (it stops right before 4)."
            },
            {
              id: "sec-05-02-example",
              type: "example",
              title: "Example: Counting Up",
              code: "print(\"Counting 0 to 2:\")\nfor i in range(3):\n    print(i)\n\nprint(\"Counting 1 to 3:\")\nfor num in range(1, 4):\n    print(num)",
              description: "Using range(3) and range(1, 4).",
              expectedOutput: "Counting 0 to 2:\n0\n1\n2\nCounting 1 to 3:\n1\n2\n3",
              stepByStep: [
                "range(3) counts 0, 1, 2.",
                "range(1, 4) starts at 1 and stops before 4: 1, 2, 3."
              ]
            },
            {
              id: "sec-05-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Write a for loop with range(3) to print numbers 0, 1, and 2.",
              starterCode: "for i in range(3):\n    print(i)\n",
              solutionCode: "for i in range(3):\n    print(i)",
              expectedOutput: "0\n1\n2",
              hints: [
                "Use 'for i in range(3):'.",
                "Print i inside the loop."
              ]
            },
            {
              id: "sec-05-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Expecting range(5) to Include 5",
                  badCode: "for i in range(1, 5):\n    print(i)  # Prints 1, 2, 3, 4 (stops before 5!)",
                  goodCode: "for i in range(1, 6):\n    print(i)  # Prints 1, 2, 3, 4, 5",
                  explanation: "range() always stops before the end number. To count to 5, write range(1, 6)."
                }
              ]
            },
            {
              id: "sec-05-02-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-05-02-1",
                  type: "code-output",
                  question: "What is the last number printed by this loop?",
                  codeSnippet: "for i in range(1, 4):\n    print(i)",
                  correctAnswer: "3",
                  acceptedAnswers: ["3"],
                  hint: "It stops before 4.",
                  explanation: "range(1, 4) produces 1, 2, 3. The last number is 3."
                }
              ]
            },
            {
              id: "sec-05-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "for loops iterate over a sequence of numbers.",
                "range(n) starts at 0 and stops before n.",
                "range(1, 5) counts 1, 2, 3, 4."
              ]
            }
          ]
        },
        {
          id: "lesson-05-03-break-and-continue",
          title: "break and continue",
          order: 3,
          summary: "Stop a loop early with break, or skip to the next round with continue.",
          difficulty: "intermediate",
          estimatedMinutes: 6,
          learningObjectives: [
            "Stop a loop immediately using 'break'",
            "Skip the rest of a round using 'continue'",
            "Use if checks inside loops to control flow"
          ],
          prerequisites: ["lesson-05-02-for-loops-and-range"],
          conceptsIntroduced: ["concept-loops-break-continue"],
          tags: ["break", "continue", "loops"],
          sections: [
            {
              id: "sec-05-03-exp",
              type: "explanation",
              title: "Controlling Your Loops",
              content: "Sometimes you need to change how a loop behaves while it is running:\n\n* **`break`:** Stops the loop completely right now! Jump straight out of the loop.\n* **`continue`:** Skips the rest of this one round and jumps right to the next round.",
              keyPoints: [
                "break stops the whole loop completely.",
                "continue skips only the current turn.",
                "Both are used inside an if check inside the loop."
              ]
            },
            {
              id: "sec-05-03-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "for item in range(10):\n    if item == 3:\n        break     # Stop loop now!\n    if item == 1:\n        continue  # Skip 1 and move to 2",
              description: "Stopping or skipping loop rounds.",
              components: [
                {
                  component: "break",
                  purpose: "Exits the loop immediately.",
                  example: "break",
                  required: false
                },
                {
                  component: "continue",
                  purpose: "Skips to the next round of the loop.",
                  example: "continue",
                  required: false
                }
              ],
              notes: "Use break when you find what you were looking for and don't need to check any more."
            },
            {
              id: "sec-05-03-example",
              type: "example",
              title: "Example: break vs continue",
              code: "print(\"--- Testing break ---\")\nfor i in range(1, 5):\n    if i == 3:\n        break\n    print(i)\n\nprint(\"--- Testing continue ---\")\nfor i in range(1, 5):\n    if i == 3:\n        continue\n    print(i)",
              description: "break stops at 3, while continue skips 3 and keeps going with 4.",
              expectedOutput: "--- Testing break ---\n1\n2\n--- Testing continue ---\n1\n2\n4",
              stepByStep: [
                "With break: when i reaches 3, the loop terminates immediately (prints 1, 2).",
                "With continue: when i reaches 3, it skips printing 3, then continues to print 4."
              ]
            },
            {
              id: "sec-05-03-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Use continue to skip printing the number 2 in a loop from 1 to 4.",
              starterCode: "for i in range(1, 5):\n    if i == 2:\n        continue\n    print(i)\n",
              solutionCode: "for i in range(1, 5):\n    if i == 2:\n        continue\n    print(i)",
              expectedOutput: "1\n3\n4",
              hints: [
                "Use 'if i == 2: continue'.",
                "Notice that 2 is skipped while 1, 3, and 4 print."
              ]
            },
            {
              id: "sec-05-03-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting to Update Counter in while Loops",
                  badCode: "i = 0\nwhile i < 5:\n    if i == 2:\n        continue  # i stays 2 forever!\n    i += 1",
                  goodCode: "i = 0\nwhile i < 5:\n    i += 1\n    if i == 2:\n        continue\n    print(i)",
                  explanation: "In while loops, update your counter before calling continue, otherwise your loop gets stuck."
                }
              ]
            },
            {
              id: "sec-05-03-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-05-03-1",
                  type: "multiple-choice",
                  question: "Which word stops the loop completely and jumps out?",
                  options: ["break", "continue", "skip", "stop"],
                  correctIndex: 0,
                  explanation: "'break' exits the loop immediately."
                }
              ]
            },
            {
              id: "sec-05-03-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "break stops the loop immediately.",
                "continue skips to the next turn.",
                "Both help you control loop flow."
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // MODULE 6: Collections (Lists & Dictionaries)
    // =========================================================================
    {
      id: "module-06-collections",
      title: "6. Collections (Lists & Dictionaries)",
      order: 6,
      description: "Store groups of items together in ordered Lists and label data by name in Dictionaries.",
      category: "standard",
      lessons: [
        {
          id: "lesson-06-01-python-lists",
          title: "Python Lists & Indexing",
          order: 1,
          summary: "A list is a shopping cart that holds items in order. Pick items out by their position (starting at 0).",
          difficulty: "intermediate",
          estimatedMinutes: 7,
          learningObjectives: [
            "Create a list using square brackets [ ]",
            "Pick items using 0-based indexing",
            "Use [-1] to grab the last item easily"
          ],
          prerequisites: ["lesson-02-01-creating-variables"],
          conceptsIntroduced: ["concept-lists", "concept-indexing"],
          tags: ["lists", "indexing"],
          sections: [
            {
              id: "sec-06-01-exp",
              type: "explanation",
              title: "Shopping Carts for Your Data",
              content: "Until now, each variable held only one thing. A **List** is like a shopping cart: you can put multiple items inside a single variable!\n\n### Square Brackets and Counting from 0\nLists are written with square brackets `[item1, item2, item3]`.\n\nEvery item has a position number called an **index**:\n* **First item is index `0`** (programmers count from 0!).\n* Second item is index `1`.\n* Third item is index `2`.\n* **Index `[-1]`** grabs the very last item!",
              keyPoints: [
                "Lists use square brackets [].",
                "Positions start at 0, not 1.",
                "[-1] gets the last item."
              ]
            },
            {
              id: "sec-06-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "fruits = [\"Apple\", \"Banana\", \"Cherry\"]\nfirst = fruits[0]\nlast = fruits[-1]",
              description: "Creating a list and picking items out.",
              components: [
                {
                  component: "[ ]",
                  purpose: "Square brackets that hold the list items.",
                  example: "[\"A\", \"B\"]",
                  required: true
                },
                {
                  component: "list[0]",
                  purpose: "Gets the very first item (position 0).",
                  example: "fruits[0]",
                  required: true
                },
                {
                  component: "list[-1]",
                  purpose: "Gets the last item from the right.",
                  example: "fruits[-1]",
                  required: false
                }
              ],
              notes: "Asking for an index that doesn't exist (like index 10 in a 3-item list) causes an IndexError."
            },
            {
              id: "sec-06-01-example",
              type: "example",
              title: "Example: Colors in a List",
              code: "colors = [\"Red\", \"Green\", \"Blue\"]\n\nprint(\"First color:\", colors[0])\nprint(\"Second color:\", colors[1])\nprint(\"Last color:\", colors[-1])",
              description: "Picking colors using positions 0, 1, and -1.",
              expectedOutput: "First color: Red\nSecond color: Green\nLast color: Blue",
              stepByStep: [
                "colors[0] is 'Red'.",
                "colors[1] is 'Green'.",
                "colors[-1] is 'Blue'."
              ]
            },
            {
              id: "sec-06-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Print the second animal (index 1) from the animals list.",
              starterCode: "animals = [\"Dog\", \"Cat\", \"Bird\"]\n# Print the second animal:\nprint(animals[1])\n",
              solutionCode: "animals = [\"Dog\", \"Cat\", \"Bird\"]\nprint(animals[1])",
              expectedOutput: "Cat",
              hints: [
                "Index 0 is Dog, so index 1 is Cat.",
                "Use animals[1]."
              ]
            },
            {
              id: "sec-06-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Counting from 1 Instead of 0",
                  badCode: "items = [\"A\", \"B\", \"C\"]\nprint(items[3])  # IndexError!",
                  goodCode: "print(items[2])  # Index 2 is 'C'",
                  explanation: "For 3 items, the positions are 0, 1, and 2. Index 3 does not exist!"
                }
              ]
            },
            {
              id: "sec-06-01-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-06-01-1",
                  type: "code-output",
                  question: "What does this code display?",
                  codeSnippet: "nums = [10, 20, 30]\nprint(nums[-1])",
                  correctAnswer: "30",
                  acceptedAnswers: ["30"],
                  hint: "Index -1 grabs the final item.",
                  explanation: "nums[-1] accesses the last item, which is 30."
                }
              ]
            },
            {
              id: "sec-06-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Lists hold multiple items in square brackets [].",
                "Counting starts at 0.",
                "[-1] grabs the last item."
              ]
            }
          ]
        },
        {
          id: "lesson-06-02-list-methods",
          title: "List Methods (append, len, remove)",
          order: 2,
          summary: "Add new items with .append(), count items with len(), and remove items with .remove().",
          difficulty: "intermediate",
          estimatedMinutes: 7,
          learningObjectives: [
            "Use len(list) to see how many items are in a list",
            "Use list.append() to add a new item to the end",
            "Use list.remove() to delete an item"
          ],
          prerequisites: ["lesson-06-01-python-lists"],
          conceptsIntroduced: ["concept-list-methods"],
          tags: ["append", "len", "remove", "lists"],
          sections: [
            {
              id: "sec-06-02-exp",
              type: "explanation",
              title: "Modifying Your Lists",
              content: "Lists can grow and shrink whenever you want! Python gives you handy tools to modify them:\n\n* **`len(my_list)`:** Counts how many items are inside.\n* **`my_list.append(new_item)`:** Puts a new item at the very end of your list.\n* **`my_list.remove(item)`:** Removes an item from the list.",
              keyPoints: [
                "len(list) gives the total count of items.",
                "append() adds an item to the end of your list.",
                "remove() deletes an item by its name."
              ]
            },
            {
              id: "sec-06-02-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "my_list.append(\"New Item\")\nmy_list.remove(\"Old Item\")\ntotal = len(my_list)",
              description: "Adding, deleting, and counting items in a list.",
              components: [
                {
                  component: ".append(item)",
                  purpose: "Adds item to the end of the list.",
                  example: "fruits.append(\"Orange\")",
                  required: true
                },
                {
                  component: "len(list)",
                  purpose: "Returns how many items are inside.",
                  example: "len(fruits)",
                  required: true
                },
                {
                  component: ".remove(item)",
                  purpose: "Deletes the specified item.",
                  example: "fruits.remove(\"Apple\")",
                  required: false
                }
              ],
              notes: "append() changes your list directly. Do not write my_list = my_list.append()."
            },
            {
              id: "sec-06-02-example",
              type: "example",
              title: "Example: Managing a To-Do List",
              code: "tasks = [\"Clean room\", \"Read book\"]\nprint(\"Total tasks:\", len(tasks))\n\ntasks.append(\"Feed dog\")\nprint(\"After adding:\", tasks)\n\ntasks.remove(\"Clean room\")\nprint(\"After removing:\", tasks)",
              description: "Counting tasks, adding a task with append, and removing a completed task.",
              expectedOutput: "Total tasks: 2\nAfter adding: ['Clean room', 'Read book', 'Feed dog']\nAfter removing: ['Read book', 'Feed dog']",
              stepByStep: [
                "len(tasks) starts at 2.",
                "append('Feed dog') adds to the end.",
                "remove('Clean room') deletes that task.",
                "2 tasks remain."
              ]
            },
            {
              id: "sec-06-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Append 'Grape' to the fruits list and print how many fruits there are using len().",
              starterCode: "fruits = [\"Apple\", \"Banana\"]\n# Append 'Grape' and print len(fruits):\nfruits.append(\"Grape\")\nprint(len(fruits))\n",
              solutionCode: "fruits = [\"Apple\", \"Banana\"]\nfruits.append(\"Grape\")\nprint(len(fruits))",
              expectedOutput: "3",
              hints: [
                "Call fruits.append('Grape').",
                "Print len(fruits)."
              ]
            },
            {
              id: "sec-06-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Reassigning with append()",
                  badCode: "fruits = fruits.append(\"Kiwi\")  # fruits is now None!",
                  goodCode: "fruits.append(\"Kiwi\")",
                  explanation: "append() modifies the list directly. If you put fruits =, you accidentally replace your list with None!"
                }
              ]
            },
            {
              id: "sec-06-02-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-06-02-1",
                  type: "short-answer",
                  question: "Which method adds an item to the end of a list? fruits.____(\"Peach\")",
                  prompt: "Enter method:",
                  correctAnswer: "append",
                  acceptedAnswers: ["append", "append()"],
                  hint: "It starts with 'app'.",
                  explanation: "append() adds a new item to the end of a list."
                }
              ]
            },
            {
              id: "sec-06-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "len() counts the items in a list.",
                "append() adds to the end.",
                "remove() deletes by name."
              ]
            }
          ]
        },
        {
          id: "lesson-06-03-looping-through-lists",
          title: "Looping Through Lists",
          order: 3,
          summary: "Look at every single item in your list one by one using a clean for loop.",
          difficulty: "intermediate",
          estimatedMinutes: 7,
          learningObjectives: [
            "Use 'for item in my_list' to visit every item",
            "Do actions with each item during the loop",
            "Filter or add up items as you loop"
          ],
          prerequisites: ["lesson-06-01-python-lists", "lesson-05-02-for-loops-and-range"],
          conceptsIntroduced: ["concept-looping-lists"],
          tags: ["loops", "lists", "iteration"],
          sections: [
            {
              id: "sec-06-03-exp",
              type: "explanation",
              title: "Visiting Every Item in Your List",
              content: "Programmers constantly work with lists of items: sending a message to every user, printing every name, or adding up every score.\n\nPython makes this super easy with: `for item in my_list:`.\nPython goes through your list in order, picks up each item, and runs your code with it!",
              keyPoints: [
                "Use 'for item in my_list:' to visit every item.",
                "Python picks up one item at a time.",
                "You don't have to keep track of index numbers."
              ]
            },
            {
              id: "sec-06-03-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "for item in my_list:\n    print(item)",
              description: "Visiting each item in a list.",
              components: [
                {
                  component: "for",
                  purpose: "Starts the item loop.",
                  example: "for",
                  required: true
                },
                {
                  component: "item",
                  purpose: "A friendly name for the current item in this round.",
                  example: "fruit",
                  required: true
                },
                {
                  component: "in my_list",
                  purpose: "The list you want to look through.",
                  example: "in fruits",
                  required: true
                }
              ],
              notes: "Pick singular names: for dog in dogs, for score in scores."
            },
            {
              id: "sec-06-03-example",
              type: "example",
              title: "Example: Welcoming Each Guest",
              code: "guests = [\"Alice\", \"Bob\", \"Charlie\"]\n\nfor guest in guests:\n    print(f\"Welcome to the party, {guest}!\")",
              description: "Looping through the guests list to greet each person.",
              expectedOutput: "Welcome to the party, Alice!\nWelcome to the party, Bob!\nWelcome to the party, Charlie!",
              stepByStep: [
                "Round 1: guest is 'Alice' -> prints welcome for Alice.",
                "Round 2: guest is 'Bob' -> prints welcome for Bob.",
                "Round 3: guest is 'Charlie' -> prints welcome for Charlie."
              ]
            },
            {
              id: "sec-06-03-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Loop through colors and print each color.",
              starterCode: "colors = [\"Red\", \"Green\", \"Blue\"]\n# Loop through colors below:\nfor c in colors:\n    print(c)\n",
              solutionCode: "colors = [\"Red\", \"Green\", \"Blue\"]\nfor c in colors:\n    print(c)",
              expectedOutput: "Red\nGreen\nBlue",
              hints: [
                "Use 'for c in colors:'.",
                "Print c inside the loop."
              ]
            },
            {
              id: "sec-06-03-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Deleting Items While Inside the Loop",
                  badCode: "for item in my_list:\n    my_list.remove(item)  # Skips items!",
                  goodCode: "# Don't delete directly while looping over it",
                  explanation: "If you remove items while looping over a list, Python's counter skips elements."
                }
              ]
            },
            {
              id: "sec-06-03-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-06-03-1",
                  type: "multiple-choice",
                  question: "What is the cleanest way to visit every item in a list named pets?",
                  options: [
                    "for pet in pets:",
                    "while pets.has_more():",
                    "loop through pets:",
                    "for i in range(len(pets)): print(i)"
                  ],
                  correctIndex: 0,
                  explanation: "'for pet in pets:' is the simple Python way to visit each item."
                }
              ]
            },
            {
              id: "sec-06-03-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Use 'for item in list:' to visit every item.",
                "Python does the counting for you.",
                "Pick friendly singular names for items."
              ]
            }
          ]
        },
        {
          id: "lesson-06-04-python-dictionaries",
          title: "Python Dictionaries",
          order: 4,
          summary: "Store information by name using key-value pairs inside curly braces {}, like a phone contact book.",
          difficulty: "intermediate",
          estimatedMinutes: 8,
          learningObjectives: [
            "Create a dictionary using curly braces { }",
            "Store information in 'key': value pairs",
            "Look up and update values using their key names"
          ],
          prerequisites: ["lesson-06-01-python-lists"],
          conceptsIntroduced: ["concept-dictionaries", "concept-key-value"],
          tags: ["dict", "dictionaries", "key-value"],
          sections: [
            {
              id: "sec-06-04-exp",
              type: "explanation",
              title: "Labeling Data by Name",
              content: "Lists use position numbers (0, 1, 2). But in real life, data has names: your phone contacts have a **Name** and a **Phone Number**.\n\nA **Dictionary (`dict`)** stores data in **key-value pairs** inside curly braces `{}`:\n* The **key** is the label (like `\"name\"`).\n* The **value** is the data (like `\"Alex\"`).\n\nYou look up information using the key: `user[\"name\"]`.",
              keyPoints: [
                "Dictionaries use curly braces {}.",
                "Data is stored in 'key': value pairs.",
                "Look up values by their key name: dict[key]."
              ]
            },
            {
              id: "sec-06-04-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "person = {\"name\": \"Alex\", \"age\": 15}\nprint(person[\"name\"])\nperson[\"age\"] = 16  # Update age",
              description: "Creating and using dictionaries.",
              components: [
                {
                  component: "{ }",
                  purpose: "Curly braces that hold the key-value pairs.",
                  example: "{\"a\": 1}",
                  required: true
                },
                {
                  component: "key : value",
                  purpose: "The label and its data, separated by a colon (:).",
                  example: "\"score\": 100",
                  required: true
                },
                {
                  component: "dict[key]",
                  purpose: "Looks up the value stored under that key.",
                  example: "person[\"name\"]",
                  required: true
                }
              ],
              notes: "You can also use dict.get(\"key\") to look up values safely without errors."
            },
            {
              id: "sec-06-04-example",
              type: "example",
              title: "Example: Storing User Profile",
              code: "user = {\n    \"username\": \"pixel_hero\",\n    \"level\": 5,\n    \"is_online\": True\n}\n\nprint(\"Player:\", user[\"username\"])\nprint(\"Level:\", user[\"level\"])\n\n# Level up!\nuser[\"level\"] = 6\nprint(\"New Level:\", user[\"level\"])",
              description: "Creating a player profile, reading the values, and updating the level.",
              expectedOutput: "Player: pixel_hero\nLevel: 5\nNew Level: 6",
              stepByStep: [
                "user dictionary holds username, level, and is_online.",
                "user['username'] retrieves 'pixel_hero'.",
                "user['level'] = 6 updates the level to 6."
              ]
            },
            {
              id: "sec-06-04-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Create a car dictionary with 'brand': 'Tesla' and 'year': 2024, and print car['brand'].",
              starterCode: "# Create car dictionary below:\ncar = {\"brand\": \"Tesla\", \"year\": 2024}\nprint(car[\"brand\"])\n",
              solutionCode: "car = {\"brand\": \"Tesla\", \"year\": 2024}\nprint(car[\"brand\"])",
              expectedOutput: "Tesla",
              hints: [
                "Use curly braces: car = {'brand': 'Tesla', 'year': 2024}.",
                "Look up brand with car['brand']."
              ]
            },
            {
              id: "sec-06-04-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Looking Up a Key That Doesn't Exist",
                  badCode: "user = {\"name\": \"Alex\"}\nprint(user[\"phone\"])  # KeyError!",
                  goodCode: "print(user.get(\"phone\", \"No phone\"))",
                  explanation: "If you ask for a key that isn't in the dictionary, Python stops with a KeyError. Use .get() for safety."
                }
              ]
            },
            {
              id: "sec-06-04-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-06-04-1",
                  type: "short-answer",
                  question: "Which bracket is used to look up a key? car__\"brand\"]",
                  prompt: "Enter bracket:",
                  correctAnswer: "[",
                  acceptedAnswers: ["["],
                  hint: "Square brackets are used to look up keys: dict[key].",
                  explanation: "Use square brackets to look up values: dict[key]."
                }
              ]
            },
            {
              id: "sec-06-04-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Dictionaries store data by name inside curly braces {}.",
                "Each item has a key and a value.",
                "Look up values with dict[key]."
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // MODULE 7: Functions & Reusable Blocks
    // =========================================================================
    {
      id: "module-07-functions",
      title: "7. Functions & Reusable Blocks",
      order: 7,
      description: "Package your code into reusable recipes using def, pass ingredients with parameters, and send answers back with return.",
      category: "standard",
      lessons: [
        {
          id: "lesson-07-01-creating-functions",
          title: "Creating & Calling Functions",
          order: 1,
          summary: "A function is a named recipe of code instructions that you can run anytime you need it.",
          difficulty: "intermediate",
          estimatedMinutes: 7,
          learningObjectives: [
            "Create a reusable function using the 'def' keyword",
            "Call (run) your function using parentheses ()",
            "Understand why functions make coding faster and cleaner"
          ],
          prerequisites: ["lesson-01-01-what-is-python", "lesson-04-01-the-if-statement"],
          conceptsIntroduced: ["concept-functions-def", "concept-functions-call"],
          tags: ["functions", "def", "recipe"],
          sections: [
            {
              id: "sec-07-01-exp",
              type: "explanation",
              title: "What is a Function?",
              content: "Imagine you have a recipe for baking cookies. Instead of rewriting the recipe every time you want a snack, you give it a name: **`bake_cookies()`**. Whenever you want cookies, you simply call that recipe name!\n\nThat is what a **function** is in programming: a named bundle of code that you can reuse whenever you want.\n\n### The Two Steps:\n1. **Define it:** Use `def` to create the function recipe.\n2. **Call it:** Type its name with parentheses `()` to run it.",
              keyPoints: [
                "Use 'def' to create a function.",
                "Code inside only runs when you call the function.",
                "Call a function using parentheses: my_function()."
              ]
            },
            {
              id: "sec-07-01-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "def say_hello():\n    print(\"Hello friend!\")\n\n# Call it to run:\nsay_hello()",
              description: "Defining and running a function.",
              components: [
                {
                  component: "def",
                  purpose: "Short for 'define'. Tells Python you are creating a new recipe.",
                  example: "def",
                  required: true
                },
                {
                  component: "function_name",
                  purpose: "The name you choose for your function.",
                  example: "greet",
                  required: true
                },
                {
                  component: "( )",
                  purpose: "Parentheses holding any inputs.",
                  example: "()",
                  required: true
                },
                {
                  component: ":",
                  purpose: "Colon ending the header and starting the recipe steps.",
                  example: ":",
                  required: true
                }
              ],
              notes: "You must define a function before the line where you call it."
            },
            {
              id: "sec-07-01-example",
              type: "example",
              title: "Example: Reusing a Welcome Banner",
              code: "def show_banner():\n    print(\"********************\")\n    print(\"  Welcome to Python \")\n    print(\"********************\")\n\n# Call the function twice:\nshow_banner()\nprint(\"Some work happening here...\")\nshow_banner()",
              description: "Defining a banner function once and reusing it twice without rewriting code.",
              expectedOutput: "********************\n  Welcome to Python \n********************\nSome work happening here...\n********************\n  Welcome to Python \n********************",
              stepByStep: [
                "Python learns the recipe 'show_banner'.",
                "Line 7 calls show_banner() -> prints the stars and welcome.",
                "Line 8 prints the work note.",
                "Line 9 calls show_banner() again, cleanly reusing the recipe."
              ]
            },
            {
              id: "sec-07-01-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Define a function 'say_hi()' that prints 'Hi there!', then call say_hi().",
              starterCode: "# Define say_hi below:\ndef say_hi():\n    print(\"Hi there!\")\n\n# Call say_hi:\nsay_hi()\n",
              solutionCode: "def say_hi():\n    print(\"Hi there!\")\n\nsay_hi()",
              expectedOutput: "Hi there!",
              hints: [
                "Write 'def say_hi():'.",
                "Indent print('Hi there!').",
                "Call say_hi()."
              ]
            },
            {
              id: "sec-07-01-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting Parentheses When Calling",
                  badCode: "def greet():\n    print(\"Hi\")\n\ngreet  # Nothing happens!",
                  goodCode: "greet()",
                  explanation: "Writing just 'greet' does not run the code. You must add parentheses 'greet()' to call it."
                }
              ]
            },
            {
              id: "sec-07-01-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-07-01-1",
                  type: "short-answer",
                  question: "Which keyword defines a function in Python? ____ my_function():",
                  prompt: "Enter keyword:",
                  correctAnswer: "def",
                  acceptedAnswers: ["def"],
                  hint: "Short for 'define'.",
                  explanation: "The 'def' keyword defines a new function."
                }
              ]
            },
            {
              id: "sec-07-01-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Use 'def' to create a function.",
                "Use '()' to call and run the function.",
                "Functions keep your code organized and reusable."
              ]
            }
          ]
        },
        {
          id: "lesson-07-02-parameters-and-arguments",
          title: "Function Parameters & Arguments",
          order: 2,
          summary: "Pass information into your functions so they can do different things each time.",
          difficulty: "intermediate",
          estimatedMinutes: 8,
          learningObjectives: [
            "Add parameters inside function parentheses",
            "Pass values (arguments) when calling a function",
            "Make your functions flexible and adaptable"
          ],
          prerequisites: ["lesson-07-01-creating-functions"],
          conceptsIntroduced: ["concept-parameters-arguments"],
          tags: ["parameters", "arguments", "inputs"],
          sections: [
            {
              id: "sec-07-02-exp",
              type: "explanation",
              title: "Giving Ingredients to Functions",
              content: "A function that only ever prints the exact same words is limited. To make functions truly powerful, you give them **inputs**:\n\n* A **parameter** is the placeholder name in the definition: `def greet(name):`.\n* An **argument** is the real value you send when calling it: `greet(\"Maya\")`.",
              keyPoints: [
                "Parameters are inputs you give to a function.",
                "Arguments are the real values you send when calling it.",
                "Separate multiple parameters with commas."
              ]
            },
            {
              id: "sec-07-02-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "def greet_person(name):\n    print(f\"Hello, {name}!\")\n\ngreet_person(\"Sam\")",
              description: "Passing data into a function.",
              components: [
                {
                  component: "def func(param)",
                  purpose: "Defines the placeholder variable inside parentheses.",
                  example: "def greet(name):",
                  required: true
                },
                {
                  component: "func(value)",
                  purpose: "Passes the actual value to the function.",
                  example: "greet(\"Sam\")",
                  required: true
                }
              ],
              notes: "You can pass multiple parameters: def add(a, b):."
            },
            {
              id: "sec-07-02-example",
              type: "example",
              title: "Example: Custom Greeter",
              code: "def greet(name, hobby):\n    print(f\"Hi {name}, have fun {hobby}!\")\n\n# Call with different people:\ngreet(\"Alex\", \"skateboarding\")\ngreet(\"Emma\", \"reading\")",
              description: "One function adapting to different inputs.",
              expectedOutput: "Hi Alex, have fun skateboarding!\nHi Emma, have fun reading!",
              stepByStep: [
                "First call passes name='Alex' and hobby='skateboarding'.",
                "Second call passes name='Emma' and hobby='reading'."
              ]
            },
            {
              id: "sec-07-02-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Create a function 'double_number(x)' that prints x * 2. Call double_number(5).",
              starterCode: "# Define double_number below:\ndef double_number(x):\n    print(x * 2)\n\ndouble_number(5)\n",
              solutionCode: "def double_number(x):\n    print(x * 2)\n\ndouble_number(5)",
              expectedOutput: "10",
              hints: [
                "Write 'def double_number(x):'.",
                "Inside the function, print x * 2.",
                "Call double_number(5)."
              ]
            },
            {
              id: "sec-07-02-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Forgetting an Argument",
                  badCode: "def greet(name):\n    print(name)\ngreet()  # TypeError: missing 1 argument!",
                  goodCode: "greet(\"Sam\")",
                  explanation: "If your function expects an input, you must provide one when calling it."
                }
              ]
            },
            {
              id: "sec-07-02-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-07-02-1",
                  type: "code-output",
                  question: "What does this code display?",
                  codeSnippet: "def add(x, y):\n    print(x + y)\nadd(3, 7)",
                  correctAnswer: "10",
                  acceptedAnswers: ["10"],
                  hint: "3 + 7 = 10.",
                  explanation: "3 and 7 are passed to x and y, and 3 + 7 = 10."
                }
              ]
            },
            {
              id: "sec-07-02-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Parameters let functions take in information.",
                "Pass arguments inside parentheses when calling.",
                "Parameters make one recipe work for many different inputs."
              ]
            }
          ]
        },
        {
          id: "lesson-07-03-returning-values",
          title: "The return Statement",
          order: 3,
          summary: "Send calculated answers back to the rest of your program using the return keyword.",
          difficulty: "intermediate",
          estimatedMinutes: 8,
          learningObjectives: [
            "Use the 'return' word to send an answer back",
            "Save returned values into variables",
            "Learn the difference between print() and return"
          ],
          prerequisites: ["lesson-07-02-parameters-and-arguments"],
          conceptsIntroduced: ["concept-functions-return"],
          tags: ["return", "answers", "functions"],
          sections: [
            {
              id: "sec-07-03-exp",
              type: "explanation",
              title: "Sending Answers Back",
              content: "Until now, our functions just printed messages on screen. But in real software, functions usually calculate an answer and **hand it back** so the rest of the code can use it.\n\n### The `return` Keyword\nThe `return` keyword hands a value back to whoever called the function. When Python sees `return`, it **instantly finishes the function** and exits.",
              keyPoints: [
                "print() shows words on screen for humans.",
                "return hands an answer back to your code.",
                "Save returned values into variables: answer = calculate(10)."
              ]
            },
            {
              id: "sec-07-03-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "def add(a, b):\n    return a + b\n\n# Save the answer:\ntotal = add(5, 10)",
              description: "Returning an answer from a function.",
              components: [
                {
                  component: "return",
                  purpose: "Hands the result back to the caller and stops the function.",
                  example: "return result",
                  required: true
                },
                {
                  component: "variable = func()",
                  purpose: "Catches and saves the returned answer.",
                  example: "cost = calc_total(5)",
                  required: true
                }
              ],
              notes: "Lines of code written after a return statement will never run!"
            },
            {
              id: "sec-07-03-example",
              type: "example",
              title: "Example: Area Calculation",
              code: "def calculate_area(width, height):\n    return width * height\n\n# Save the answer into room_size:\nroom_size = calculate_area(5, 4)\nprint(\"Room size:\", room_size)\n\n# Use that answer in another calculation:\ncost = room_size * 10\nprint(\"Flooring cost: $\", cost)",
              description: "Calculating room area, returning it, and using the returned value to calculate price.",
              expectedOutput: "Room size: 20\nFlooring cost: $ 200",
              stepByStep: [
                "calculate_area(5, 4) calculates 5 * 4 = 20.",
                "return hands 20 back to line 5, saving room_size = 20.",
                "Line 9 uses room_size to calculate 20 * 10 = 200."
              ]
            },
            {
              id: "sec-07-03-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Write a function 'square(num)' that returns num * num. Call square(5) and print the answer.",
              starterCode: "# Define square(num) below:\ndef square(num):\n    return num * num\n\nans = square(5)\nprint(ans)\n",
              solutionCode: "def square(num):\n    return num * num\n\nans = square(5)\nprint(ans)",
              expectedOutput: "25",
              hints: [
                "Use 'return num * num'.",
                "ans = square(5)",
                "print(ans)"
              ]
            },
            {
              id: "sec-07-03-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Confusing print() with return",
                  badCode: "def add(a, b):\n    print(a + b)  # Shows on screen, but returns nothing!\n\nx = add(2, 3)\nprint(x * 2)      # Error! x is None",
                  goodCode: "def add(a, b):\n    return a + b\n\nx = add(2, 3)\nprint(x * 2)      # Prints 10",
                  explanation: "print() just displays text on your screen. Use return if you want your code to save and reuse the calculated answer."
                }
              ]
            },
            {
              id: "sec-07-03-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-07-03-1",
                  type: "code-output",
                  question: "What does this code display?",
                  codeSnippet: "def triple(n):\n    return n * 3\nprint(triple(4))",
                  correctAnswer: "12",
                  acceptedAnswers: ["12"],
                  hint: "4 * 3 = 12.",
                  explanation: "triple(4) returns 12, which is printed."
                }
              ]
            },
            {
              id: "sec-07-03-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "return hands an answer back to your program.",
                "print() is for human eyes; return is for code data flow.",
                "return exits the function right away."
              ]
            }
          ]
        },
        {
          id: "lesson-07-04-variable-scope",
          title: "Variable Scope & Functions Recap",
          order: 4,
          summary: "Learn where variables live: variables created inside a function stay inside that function.",
          difficulty: "intermediate",
          estimatedMinutes: 7,
          learningObjectives: [
            "Learn what local scope means (inside a function)",
            "Learn what global scope means (outside all functions)",
            "Use default parameter values like def greet(name='Friend'):"
          ],
          prerequisites: ["lesson-07-03-returning-values"],
          conceptsIntroduced: ["concept-variable-scope", "concept-default-parameters"],
          tags: ["scope", "functions", "defaults"],
          sections: [
            {
              id: "sec-07-04-exp",
              type: "explanation",
              title: "Where Do Variables Live?",
              content: "Not every variable is available everywhere. Where a variable can be seen is called its **scope**:\n\n* **Local Scope (Inside):** A variable created *inside* a function belongs only to that function. When the function finishes, that variable disappears! Code outside cannot touch it.\n* **Global Scope (Outside):** A variable created *outside* in the main code can be read anywhere.\n\n### Default Values for Parameters\nYou can give parameters a backup default value: `def greet(name=\"Friend\"):`. If someone calls `greet()`, it uses `\"Friend\"` automatically!",
              keyPoints: [
                "Variables created inside a function only exist inside that function.",
                "Default parameters provide backup values.",
                "Functions keep your code organized, clean, and bug-free!"
              ]
            },
            {
              id: "sec-07-04-syntax",
              type: "syntax",
              title: "Syntax",
              syntax: "def greet(name=\"Friend\"):\n    local_msg = f\"Hello, {name}!\"\n    return local_msg",
              description: "Default parameters and local variables.",
              components: [
                {
                  component: "name=\"Friend\"",
                  purpose: "Default backup value if no argument is passed.",
                  example: "country=\"USA\"",
                  required: false
                },
                {
                  component: "local_msg",
                  purpose: "A local variable that only exists inside this function.",
                  example: "message = ...",
                  required: true
                }
              ],
              notes: "Always put parameters with default values at the end of the parameter list."
            },
            {
              id: "sec-07-04-example",
              type: "example",
              title: "Example: Default Parameters in Action",
              code: "def say_hello(name=\"Friend\"):\n    return f\"Hi there, {name}!\"\n\n# Call without giving a name (uses default):\nprint(say_hello())\n\n# Call with a custom name:\nprint(say_hello(\"Maya\"))",
              description: "Calling a function with and without the optional parameter.",
              expectedOutput: "Hi there, Friend!\nHi there, Maya!",
              stepByStep: [
                "First call passes nothing -> name defaults to 'Friend'.",
                "Second call passes 'Maya' -> name becomes 'Maya'."
              ]
            },
            {
              id: "sec-07-04-activity",
              type: "editor-activity",
              title: "Try it Yourself",
              instructions: "Create a function 'welcome(name=\"Student\")' and call welcome() with no arguments.",
              starterCode: "# Define welcome with default parameter below:\ndef welcome(name=\"Student\"):\n    return f\"Welcome, {name}!\"\n\nprint(welcome())\n",
              solutionCode: "def welcome(name=\"Student\"):\n    return f\"Welcome, {name}!\"\n\nprint(welcome())",
              expectedOutput: "Welcome, Student!",
              hints: [
                "Set name='Student' in the function header.",
                "Call print(welcome())."
              ]
            },
            {
              id: "sec-07-04-mistakes",
              type: "common-mistakes",
              title: "Common Mistakes to Avoid",
              mistakes: [
                {
                  title: "1. Trying to Use a Local Variable Outside",
                  badCode: "def my_func():\n    secret = 42\n\nmy_func()\nprint(secret)  # NameError: secret is not defined!",
                  goodCode: "def my_func():\n    return 42\n\nsecret = my_func()\nprint(secret)",
                  explanation: "Variables created inside a function are private to that function. Use 'return' to send values outside."
                }
              ]
            },
            {
              id: "sec-07-04-practice",
              type: "practice",
              title: "Test Yourself With Exercises",
              questions: [
                {
                  id: "q-07-04-1",
                  type: "multiple-choice",
                  question: "Where can a variable created inside a function be used?",
                  options: [
                    "Only inside that specific function",
                    "Anywhere in the entire file",
                    "Only inside print statements",
                    "In every program on your computer"
                  ],
                  correctIndex: 0,
                  explanation: "Local variables only exist inside the function where they were created."
                }
              ]
            },
            {
              id: "sec-07-04-recap",
              type: "recap",
              title: "Lesson Recap",
              takeaways: [
                "Variables created inside functions are local to that function.",
                "Default parameters provide friendly backup values.",
                "Congratulations! You now know the core foundations of Python!"
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
fs.writeFileSync(targetFile, JSON.stringify(curriculum, null, 2), "utf8");
console.log(`Successfully generated simple English modular curriculum to ${targetFile}`);
console.log(`Total Modules: ${curriculum.modules.length}`);
let totalLessons = 0;
curriculum.modules.forEach(m => totalLessons += m.lessons.length);
console.log(`Total Lessons: ${totalLessons}`);
