import { LessonModule } from "../../types";

export const PHASE_0_MODULE: LessonModule = {
  id: "phase-0",
  title: "Phase 0: Welcome to Python",
  description: "Computer literalism, your browser workspace, sequence execution, and reading error messages without fear.",
  lessons: [
    {
      id: "l-0-1",
      title: "Lesson 0.1: What Even Is Code?",
      phaseId: "phase-0",
      phaseTitle: "Phase 0: Welcome to Python",
      description: "Understand computer literalism and how computers follow exact step-by-step instructions.",
      hook: "Imagine asking a friendly robot to make you a peanut butter sandwich. If you say 'put the peanut butter on the bread', the robot might place the unopened glass jar directly on top of the loaf! Computers have zero common sense; they do exactly what you tell them, not what you intended.",
      plainEnglish: "Code is a precise list of written instructions. Because computers are ultra-literal, you must break every complex task down into unambiguous, ordered steps.",
      codeExample: `# The Computer Literalism Demonstration
print("Step 1: Open the bag of bread.")
print("Step 2: Take out two slices.")
print("Step 3: Open the peanut butter jar.")
print("Step 4: Spread peanut butter on slice one.")
print("Step 5: Put the slices together.")`,
      whatJustHappened: [
        "Line 1: Python executes print() and displays Step 1 on your screen.",
        "Line 2: Python moves straight to the next line and outputs Step 2.",
        "Lines 3-5: Instructions run in sequential order, from top to bottom."
      ],
      deeperDive: "Why can't computers just 'guess' what we mean? Human language is full of slang, idioms, and assumptions. Programming languages like Python were designed with strict grammar so there is never any ambiguity about what instruction runs next.",
      yourTurn: {
        challenge: "Write 3 print statements that explain how to pour a glass of water, line by line.",
        starterCode: `# Write your 3 steps below using print()
print("Step 1: Get a clean glass.")
`,
        solutionCode: `print("Step 1: Get a clean glass.")
print("Step 2: Turn on the cold water faucet.")
print("Step 3: Fill the glass and turn off faucet.")`,
        hints: [
          "Every message needs to be wrapped inside print(\"...\")",
          "Ensure your double quotes match at the start and end of the text."
        ],
        expectedOutputPattern: "Step 1"
      },
      quickChecks: [
        {
          question: "Why do computers require completely precise instructions?",
          options: [
            "Computers cannot infer intent or use human common sense",
            "Computers only understand numbers greater than 100",
            "Computers will crash if you write more than one sentence",
            "Computers require human emotions to process data"
          ],
          correctIndex: 0,
          explanation: "Computers are ultra-literal calculation machines that follow instructions verbatim without making human assumptions."
        }
      ],
      commonMistakes: [
        {
          title: "Missing Quotation Marks",
          badCode: "print(Hello world)",
          goodCode: "print(\"Hello world\")",
          explanation: "Without quotes, Python thinks Hello is a program variable that doesn't exist yet, triggering a NameError."
        },
        {
          title: "Capitalizing the print command",
          badCode: "Print(\"Ready\")",
          goodCode: "print(\"Ready\")",
          explanation: "Python is case-sensitive! print must always be all-lowercase."
        }
      ],
      seedsForLater: {
        concept: "Sequence Flow",
        sproutsIn: "Phase 2: Making Decisions",
        teaser: "Right now, code runs strictly from top to bottom. Soon, you will learn how to make code choose different paths based on decisions!"
      },
      recap: [
        "Code is a sequence of literal, unambiguous instructions.",
        "Python executes statements one at a time, moving strictly from top to bottom.",
        "The print() tool displays text directly onto your screen."
      ],
      glossaryTerms: ["algorithm", "bug", "syntax", "print", "output"],
      concept: `### What Even Is Code?

Imagine asking a robot to make you a peanut butter sandwich. If you say "put the peanut butter on the bread", the robot might place the unopened glass jar directly on top of the loaf! Computers have zero common sense. They do **exactly** what you tell them, not what you meant.

---

#### 1. Plain-English Concept
Code is simply a clear, unambiguous list of instructions written in a language both humans and computers can read. Because computers are ultra-literal, every task must be broken down into ordered, atomic steps.

\`\`\`python
# The Computer Literalism Demonstration
print("Step 1: Open the bag of bread.")
print("Step 2: Take out two slices.")
print("Step 3: Open the peanut butter jar.")
print("Step 4: Spread peanut butter on slice one.")
print("Step 5: Put the slices together.")
\`\`\`

---

#### 2. What Just Happened?
- **Line 1**: Python encounters the built-in \`print()\` instruction and sends text to your screen.
- **Line 2-5**: Python moves top-to-bottom, executing each line in exact sequential order.

---

#### 3. Common Beginner Pitfalls
- **Missing Quotes**: Writing \`print(Hello)\` triggers a \`NameError\` because Python thinks you are looking for a variable named \`Hello\`. Always wrap text in \`"quotes"\`.
- **Capitalization**: Writing \`Print("Hi")\` will fail because Python is strictly case-sensitive. All built-in commands are lowercase.`,
      practiceCode: `print("Step 1: Open the bag of bread.")
print("Step 2: Take out two slices.")
print("Step 3: Spread peanut butter.")
print("Step 4: Enjoy your sandwich!")`,
      quizQuestion: "What happens if you run Print(\"Hello\") with a capital P?",
      quizOptions: [
        "NameError: name 'Print' is not defined",
        "It prints Hello in bold letters",
        "It asks the user to retype the sentence",
        "It converts the text to uppercase"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-0-2",
      title: "Lesson 0.2: Meet Python",
      phaseId: "phase-0",
      phaseTitle: "Phase 0: Welcome to Python",
      description: "Why Python is the most popular programming language in the world and how it translates human ideas into machine actions.",
      hook: "In the 1980s, computer languages were verbose and ugly, packed with cryptic semicolons and curly braces. A programmer named Guido van Rossum wanted a language that read like plain English poetry. He named it after Monty Python's Flying Circus!",
      plainEnglish: "Python is designed for maximum readability. It lets you express powerful ideas in fewer lines of code than almost any other language, powering NASA, YouTube, Instagram, and modern AI.",
      codeExample: `# Python reads like clear English
mission = "Mars Rover"
speed_kmh = 24000

print("Mission Name:", mission)
print("Speed:", speed_kmh, "km/h")`,
      whatJustHappened: [
        "Line 2: Stored the text 'Mars Rover' under the label 'mission'.",
        "Line 3: Stored the number 24000 under the label 'speed_kmh'.",
        "Lines 5-6: Printed both pieces of information out cleanly."
      ],
      deeperDive: "Python is an interpreted language. That means you do not have to wait around for a separate compile step before running your code. You write a line, press Run, and see results instantly.",
      yourTurn: {
        challenge: "Create a mission log that prints your favorite spacecraft or vehicle and its destination.",
        starterCode: `vehicle = "Apollo 11"
destination = "The Moon"
# Print both below:
`,
        solutionCode: `vehicle = "Apollo 11"
destination = "The Moon"
print("Vehicle:", vehicle)
print("Destination:", destination)`,
        hints: [
          "Use commas inside print() to print multiple items side-by-side."
        ]
      },
      quickChecks: [
        {
          question: "What is the primary design philosophy of Python?",
          options: [
            "Code readability and clarity resembling plain English",
            "Making code as short and cryptic as possible",
            "Requiring strict semicolons at the end of every line",
            "Only running on supercomputers"
          ],
          correctIndex: 0,
          explanation: "Python emphasizes readable, clean syntax that allows humans to write and understand instructions naturally."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting Commas Between Multiple Items",
          badCode: "print(\"Mission:\" mission)",
          goodCode: "print(\"Mission:\", mission)",
          explanation: "When passing multiple items to print(), separate them with a comma."
        }
      ],
      seedsForLater: {
        concept: "Variables and Labels",
        sproutsIn: "Phase 1: Storing Information",
        teaser: "We just stored 'Mars Rover' inside a box named 'mission'. In Phase 1, we will master variables and data types in depth!"
      },
      recap: [
        "Python was built to be readable, elegant, and beginner-friendly.",
        "It powers modern web apps, scientific research, and artificial intelligence.",
        "You can separate items with commas inside print() to display them on one line."
      ],
      glossaryTerms: ["program", "syntax", "variable", "print"],
      concept: `### Meet Python

In the late 1980s, computer languages were verbose and painful to read, full of cryptic symbols, mandatory semicolons, and complicated memory management. A programmer named Guido van Rossum decided programming should feel as clear and expressive as plain English.

---

#### 1. Why Python?
1. **Readability First**: Python avoids visual clutter.
2. **Batteries Included**: Comes with built-in tools for math, text, files, and networking.
3. **Everywhere in Industry**: Powers NASA trajectory simulations, Netflix recommendation engines, and artificial intelligence models worldwide.

\`\`\`python
# Clean, readable code
mission = "Mars Exploration"
distance_million_km = 225

print("Target:", mission)
print("Distance:", distance_million_km, "million kilometers")
\`\`\`

---

#### 2. What Just Happened?
Python evaluated the values and output them cleanly to your console, automatically placing spaces between items separated by commas.`,
      practiceCode: `spacecraft = "Voyager 1"
year_launched = 1977
print("Exploring deep space with:", spacecraft)
print("Years active since:", year_launched)`,
      quizQuestion: "How does Python separate multiple items passed to print(\"A\", \"B\") by default?",
      quizOptions: [
        "With a single space",
        "With a dash",
        "With a newline",
        "With no space at all"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-0-3",
      title: "Lesson 0.3: Your Browser Workspace",
      phaseId: "phase-0",
      phaseTitle: "Phase 0: Welcome to Python",
      description: "Master the interactive code editor, the live output console, and WebAssembly execution.",
      hook: "In the past, learning Python meant installing terminal software, setting path variables, and fighting operating system permissions before writing a single line. Today, your browser runs an entire Python virtual machine right on your device!",
      plainEnglish: "Your workspace has two main parts: the Code Editor on the left where you write instructions, and the Output Panel on the right where Python shows you what happened.",
      codeExample: `# Try changing the values below and click Run
greeting = "Welcome to the Milky AI Python Lab!"
print(greeting)
print("=" * 40)`,
      whatJustHappened: [
        "Line 2: Stored our greeting message in a text variable.",
        "Line 3: Printed the message to standard output.",
        "Line 4: Multiplied the '=' symbol by 40 to draw a neat divider line!"
      ],
      deeperDive: "Behind the scenes, your browser runs WebAssembly (WASM). That means your Python code executes locally with near-zero latency, even if your internet connection drops.",
      yourTurn: {
        challenge: "Change the divider symbol from '=' to '*' and write your own welcome message.",
        starterCode: `msg = "My Python journey begins today!"
print(msg)
# Multiply '*' by 30 below:
`,
        solutionCode: `msg = "My Python journey begins today!"
print(msg)
print("*" * 30)`,
        hints: [
          "In Python, multiplying text by a number repeats that text! For example: '-' * 10"
        ]
      },
      quickChecks: [
        {
          question: "Where do the results of print() appear?",
          options: [
            "In the Output Panel (standard output console)",
            "As a pop-up alert on your operating system desktop",
            "In a separate email notification",
            "Inside the code editor replacing your code"
          ],
          correctIndex: 0,
          explanation: "Standard output is directed straight to the Output Panel next to your editor."
        }
      ],
      commonMistakes: [
        {
          title: "Typing code into the output panel instead of the editor",
          badCode: "# Trying to click output to type code",
          goodCode: "# Always write instructions in the editor, then click Run",
          explanation: "The output panel displays results; the code editor is where you compose instructions."
        }
      ],
      seedsForLater: {
        concept: "String Multiplication",
        sproutsIn: "Phase 1: Storing Information",
        teaser: "Notice how '*' * 30 repeated the asterisk 30 times? In Phase 1, we will explore string operations in full detail!"
      },
      recap: [
        "The Code Editor is where you write and edit Python instructions.",
        "The Output Panel displays messages, calculations, and errors.",
        "Clicking Run executes your script instantly via client-side WebAssembly."
      ],
      glossaryTerms: ["output", "syntax", "string", "print"],
      concept: `### Your Browser Workspace

Historically, getting started with Python required installing compilers, configuring system environment paths, and wrestling with terminal permissions. 

In this textbook, a full Python runtime executes directly inside your web browser via **WebAssembly**.

---

#### 1. The Two-Zone Layout
- **Left Zone (Textbook & Editor)**: Where you read concepts, inspect line-by-line breakdowns, and compose Python code.
- **Right Zone (Output Console & Sandbox)**: Where your instructions execute instantly and print results.

\`\`\`python
greeting = "Welcome to Python Zero -> Pro!"
print(greeting)
print("-" * 35)
print("Ready for action.")
\`\`\`

---

#### 2. Repeating Characters with Math
Did you notice line 3? \`"-" * 35\` repeats the dash character 35 times! Python allows you to multiply text by integers to create clean visual borders without having to type 35 dashes by hand.`,
      practiceCode: `title = "PYTHON ZERO -> PRO"
print("=" * 30)
print(title)
print("=" * 30)`,
      quizQuestion: "What is the result of print(\"-\" * 5)?",
      quizOptions: [
        "-----",
        "-5",
        "Error: Cannot multiply text",
        "- - - - -"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-0-4",
      title: "Lesson 0.4: Your First Real Program",
      phaseId: "phase-0",
      phaseTitle: "Phase 0: Welcome to Python",
      description: "Understanding sequential execution flow from top to bottom.",
      hook: "Have you ever followed a recipe that said: '1. Preheat oven to 400°. 2. Mix batter. 3. Bake for 25 minutes.' What would happen if you did step 3 first? Raw batter! Order of operations is everything.",
      plainEnglish: "Python reads your file like a human reading a book: one line at a time, strictly from line 1 downward. A line cannot use something created on a future line.",
      codeExample: `# Execution flows sequentially
print("Initializing launch sequence...")
countdown = 3
print("T-minus:", countdown)
countdown = countdown - 1
print("T-minus:", countdown)
print("Liftoff achieved!")`,
      whatJustHappened: [
        "Line 2: Prints the initialization status.",
        "Line 3: Sets countdown to 3.",
        "Line 4: Prints 'T-minus: 3'.",
        "Line 5: Updates countdown from 3 down to 2.",
        "Line 6: Prints 'T-minus: 2'.",
        "Line 7: Confirms liftoff!"
      ],
      deeperDive: "If line 4 tried to print countdown before line 3 existed, Python would halt instantly with a NameError. Python never peeks ahead to future lines when evaluating the current line.",
      yourTurn: {
        challenge: "Add countdown steps for 1 and 0 before the Liftoff message.",
        starterCode: `print("Launch prep...")
count = 2
print("T-minus:", count)
count = count - 1
print("T-minus:", count)
# Decrement count again and print Liftoff:
`,
        solutionCode: `print("Launch prep...")
count = 2
print("T-minus:", count)
count = count - 1
print("T-minus:", count)
count = count - 1
print("T-minus:", count)
print("Liftoff!")`,
        hints: [
          "Use count = count - 1 to decrease the number by 1 each time."
        ]
      },
      quickChecks: [
        {
          question: "In what direction does standard Python code execute?",
          options: [
            "Strictly line by line from top to bottom",
            "Simultaneously across all lines at once",
            "From bottom to top",
            "Randomly based on file size"
          ],
          correctIndex: 0,
          explanation: "Standard execution is strictly sequential, top to bottom."
        }
      ],
      commonMistakes: [
        {
          title: "Using a variable before creating it",
          badCode: "print(score)\nscore = 10",
          goodCode: "score = 10\nprint(score)",
          explanation: "Python cannot read the future! Always define your variable before referencing it."
        }
      ],
      seedsForLater: {
        concept: "Loops and Automation",
        sproutsIn: "Phase 3: Repeating Things",
        teaser: "Notice how we typed countdown lines manually? In Phase 3, loops will do this countdown in just two lines of code!"
      },
      recap: [
        "Python executes instructions strictly sequentially from top to bottom.",
        "Variables must be defined on earlier lines before they can be read on later lines.",
        "Reassigning a variable updates its value in memory immediately."
      ],
      glossaryTerms: ["sequence", "assignment", "variable", "bug"],
      concept: `### Your First Real Program

Programs are not static blobs; they are dynamic processes that unfold over time. Python executes each instruction line by line, from the very top of your file to the very bottom.

---

#### 1. The Principle of Sequence
When Python encounters a line, it finishes executing that line completely before moving down to the next.

\`\`\`python
print("Initializing launch sequence...")
countdown = 3
print("T-minus:", countdown)

countdown = countdown - 1
print("T-minus:", countdown)

print("Liftoff achieved!")
\`\`\`

---

#### 2. Memory State Changes Over Time
Notice how the variable \`countdown\` changes value!
1. On line 2, \`countdown\` is created with value \`3\`.
2. On line 5, the expression \`countdown - 1\` evaluates to \`2\`, and the \`=\` operator updates \`countdown\` to \`2\`.
3. When line 6 runs, Python prints the updated value \`2\`.`,
      practiceCode: `print("Loading system...")
status = "Online"
print("Current system status:", status)
status = "Busy processing"
print("Current system status:", status)`,
      quizQuestion: "What is the value of x at the end: x = 5; x = x + 2?",
      quizOptions: [
        "7",
        "5",
        "2",
        "52"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-0-5",
      title: "Lesson 0.5: Comments: Notes for Humans",
      phaseId: "phase-0",
      phaseTitle: "Phase 0: Welcome to Python",
      description: "Writing clean notes using the # symbol that explain the 'why' behind your code.",
      hook: "Have you ever looked at notes you took six months ago and thought: 'Who wrote this and what does it mean?' Code is read 10 times more often than it is written. Comments are your message to future-you.",
      plainEnglish: "Any line starting with a hash mark (#) is a comment. Python completely ignores comments when running your program. They exist purely for human comprehension.",
      codeExample: `# Compute total order with standard sales tax
subtotal = 50.00
tax_rate = 0.08  # 8 percent state tax
total = subtotal + (subtotal * tax_rate)

print("Final Total:", total)`,
      whatJustHappened: [
        "Line 1: Python sees '#' and skips straight to line 2.",
        "Line 2: subtotal is assigned 50.00.",
        "Line 3: tax_rate is assigned 0.08; the inline comment is ignored.",
        "Line 4: Calculates the combined tax and subtotal.",
        "Line 6: Prints the final calculated amount: 54.0."
      ],
      deeperDive: "A good comment explains *why* code was written, not *what* it does. Writing '# Add 1 to x' next to 'x = x + 1' adds no value. Writing '# Account for leap year offset' explains the business reason.",
      yourTurn: {
        challenge: "Add a comment explaining what discount percentage is being applied to the price.",
        starterCode: `price = 100
# Add your comment below:
discounted_price = price * 0.80
print("Discounted:", discounted_price)
`,
        solutionCode: `# Apply a 20 percent seasonal promotional discount
price = 100
discounted_price = price * 0.80
print("Discounted:", discounted_price)`,
        hints: [
          "Start your comment with a # symbol."
        ]
      },
      quickChecks: [
        {
          question: "What does Python do when it encounters the # symbol?",
          options: [
            "Ignores everything after it on that line",
            "Prints the text in green on the screen",
            "Raises a SyntaxError",
            "Encrypts the line for security"
          ],
          correctIndex: 0,
          explanation: "Python treats everything following a '#' on that line as a comment and ignores it during execution."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting the # symbol for comments",
          badCode: "This calculates the price\nprice = 50",
          goodCode: "# This calculates the price\nprice = 50",
          explanation: "Plain English without a # will cause a SyntaxError because Python tries to parse it as code."
        }
      ],
      seedsForLater: {
        concept: "Docstrings",
        sproutsIn: "Phase 5: Functions & Reusable Blocks",
        teaser: "Comments explain single lines. Later in Phase 5, you will learn how to write multi-line documentation strings (docstrings) for functions!"
      },
      recap: [
        "Comments begin with # and are completely ignored by Python.",
        "Use comments to explain why a decision was made, not to restate obvious code.",
        "Inline comments sit at the end of a line of code after two spaces."
      ],
      glossaryTerms: ["comment", "syntax", "bug"],
      concept: `### Comments: Notes for Humans

Code is read far more frequently than it is written. When you return to a project after three weeks away, well-crafted comments are what prevent you from having to reverse-engineer your own logic.

---

#### 1. Syntax of a Comment
Any character after a \`#\` symbol on the same line is considered a comment.

\`\`\`python
# Configuration settings for game session
max_players = 4
initial_lives = 3  # Each player gets 3 attempts

print("Game configured with", max_players, "players.")
\`\`\`

---

#### 2. Golden Rule of Commenting
- **Weak Comment**: \`x = x + 1  # Add one to x\` (states the obvious)
- **Strong Comment**: \`x = x + 1  # Increment round counter after boss defeat\` (explains the human reasoning)`,
      practiceCode: `# Player profile configuration
player_name = "Jordan"
health_points = 100  # Max starting health
print(player_name, "starts with", health_points, "HP")`,
      quizQuestion: "Which line represents a valid Python comment?",
      quizOptions: [
        "# Set initial volume level",
        "// Set initial volume level",
        "/* Set initial volume level */",
        "<!-- Set initial volume level -->"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-0-6",
      title: "Lesson 0.6: How to Read Errors",
      phaseId: "phase-0",
      phaseTitle: "Phase 0: Welcome to Python",
      description: "Decoding Python tracebacks, understanding NameError and SyntaxError, and debugging without panic.",
      hook: "When beginner coders see red error text, their heart rate spikes and they think: 'I broke it!' But professional software engineers celebrate errors. An error message is Python being a helpful co-pilot, pointing directly to the line that needs attention.",
      plainEnglish: "An error report is called a Traceback. Read it from the very bottom upward. The last line tells you the exact error category and why it occurred.",
      codeExample: `# Let's deliberately inspect a common error
city = "Tokyo"
# Notice the spelling mismatch below
print("Welcome to", city)`,
      whatJustHappened: [
        "Line 2: Stored the text 'Tokyo' inside variable city.",
        "Line 4: Correctly printed city.",
        "If you misspelled city as 'cuty', Python would output: NameError: name 'cuty' is not defined."
      ],
      deeperDive: "The three most common beginner errors are:\n1. NameError: You referenced a word Python has never heard of (usually a typo).\n2. SyntaxError: You forgot a closing quote or parenthesis.\n3. IndentationError: Your spacing is uneven.",
      yourTurn: {
        challenge: "Fix the misspelled variable name below so the program runs with zero errors.",
        starterCode: `hero = "Aria"
# Fix the typo on the next line:
print("Hero name is:", heroo)
`,
        solutionCode: `hero = "Aria"
print("Hero name is:", hero)`,
        hints: [
          "Look closely at 'heroo' vs 'hero'."
        ]
      },
      quickChecks: [
        {
          question: "When reading a Python traceback, where is the most useful error summary located?",
          options: [
            "At the very bottom line of the message",
            "At the top of the file",
            "In your computer's system logs",
            "In the browser address bar"
          ],
          correctIndex: 0,
          explanation: "The bottom line of a Python traceback names the specific error type (e.g. NameError) and gives the direct explanation."
        }
      ],
      commonMistakes: [
        {
          title: "Panicking and deleting your entire code block",
          badCode: "# Deleting everything when a red error appears",
          goodCode: "# Read the bottom line of the traceback and check the line number indicated",
          explanation: "Most bugs are simple 1-character typos. Read the line number and fix that specific character."
        }
      ],
      seedsForLater: {
        concept: "Exception Handling",
        sproutsIn: "Phase 9: Error Handling & Defensive Code",
        teaser: "Right now errors stop your program. In Phase 9, you will learn try/except blocks to catch errors gracefully!"
      },
      recap: [
        "Errors are helpful diagnostic roadmaps, not failures.",
        "Read tracebacks from the bottom up to see the error type immediately.",
        "NameError means an unknown word; SyntaxError means broken grammar."
      ],
      glossaryTerms: ["traceback", "syntax", "bug", "debugging"],
      concept: `### How to Read Errors

Every software engineer in the world encounters error messages multiple times a day. Error messages are Python's diagnostic tool telling you:
1. Which file and line number had an issue.
2. What category of error occurred.
3. A description of what went wrong.

---

#### 1. Anatomy of a Traceback
\`\`\`
Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(usr_name)
NameError: name 'usr_name' is not defined. Did you mean: 'user_name'?
\`\`\`

- **Line Indicator**: Tells you to inspect line 3.
- **Error Name**: \`NameError\` tells you a variable or function name could not be found.
- **Hint**: Python even suggests: *Did you mean 'user_name'?*

---

#### 2. The Big Three Beginner Errors
1. **NameError**: Misspelled variable, or forgetting quotes around plain text.
2. **SyntaxError**: Missing closing quote (\`"\`) or closing parenthesis (\`)\`).
3. **TypeError**: Trying to combine data types that cannot mix (e.g. text + numbers directly).`,
      practiceCode: `# A clean, error-free program
item = "Compass"
durability = 100
print("Inventory item:", item)
print("Durability remaining:", durability)`,
      quizQuestion: "What causes a NameError in Python?",
      quizOptions: [
        "Referencing a variable name that has not been defined or was misspelled",
        "Forgetting to save the file",
        "Typing too fast",
        "Dividing two numbers"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-0-7",
      title: "Lesson 0.7: Project: Greeting Card",
      phaseId: "phase-0",
      phaseTitle: "Phase 0: Welcome to Python",
      description: "Capstone Project for Phase 0: Build a formatted, decorative digital greeting card using structured prints.",
      hook: "You now know computer literalism, sequential execution, printing, comments, and how to read errors. It is time to assemble these tools into your very first standalone project: an elegant digital greeting card!",
      plainEnglish: "In this project, you will combine multiple print statements, formatted text borders, and variables to create a personalized celebration card.",
      codeExample: `# Phase 0 Capstone: Digital Greeting Card
recipient = "Sam"
sender = "Python Zero -> Pro Team"
occasion = "First Milestone Complete"

border = "+" + ("-" * 36) + "+"

print(border)
print(f"|  CELEBRATION: {occasion:<23} |")
print(border)
print(f"|  Dear {recipient:<30} |")
print("|  You mastered Phase 0 concepts!    |")
print("|  - Computer literalism              |")
print("|  - Sequential execution flow        |")
print("|  - Clean error decoding             |")
print(border)
print(f"|  From: {sender:<28} |")
print(border)`,
      whatJustHappened: [
        "Lines 2-4: Declared metadata variables for recipient, sender, and occasion.",
        "Line 6: Dynamically constructed a decorative border using string multiplication.",
        "Lines 8-18: Printed the card line by line in perfect sequential order."
      ],
      deeperDive: "Notice how consistent width alignment creates a clean tabular box on your console screen. Console art (ASCII graphics) was how the earliest computer games rendered graphics in the 1970s!",
      yourTurn: {
        challenge: "Customize the greeting card with your own name and your own custom celebratory message.",
        starterCode: `recipient = "Your Name"
sender = "Yourself"
# Print your card with borders below:
`,
        solutionCode: `recipient = "Alex"
sender = "Milky AI"
print("+" + ("-" * 30) + "+")
print("| Congratulations " + recipient + "! |")
print("| You completed Phase 0!       |")
print("+" + ("-" * 30) + "+")`,
        hints: [
          "Use string concatenation (+) or comma separators to combine text."
        ]
      },
      quickChecks: [
        {
          question: "What makes structured console output readable for users?",
          options: [
            "Clear visual hierarchy, consistent borders, and organized spacing",
            "Printing 100 blank lines between every word",
            "Using random capital letters",
            "Writing all instructions on a single line"
          ],
          correctIndex: 0,
          explanation: "Visual boundaries, consistent margins, and structured spacing make terminal output effortless to read."
        }
      ],
      commonMistakes: [
        {
          title: "Mismatched border lengths",
          badCode: "print(\"--------\")\nprint(\"Hello\")\nprint(\"-----------------\")",
          goodCode: "border = \"-\" * 20\nprint(border)\nprint(\"Hello\")\nprint(border)",
          explanation: "Store your border in a variable like border = '-' * 20 so all top and bottom edges match perfectly."
        }
      ],
      seedsForLater: {
        concept: "f-strings and String Formatting",
        sproutsIn: "Phase 1: Storing Information (Lesson 1.6)",
        teaser: "Notice the {recipient} format syntax? In Lesson 1.6, we will dive deep into Python's legendary f-strings!"
      },
      recap: [
        "You completed Phase 0 of your journey to Python proficiency!",
        "You understand computer literalism, sequence flow, and error debugging.",
        "You built a real greeting card project using structured code."
      ],
      glossaryTerms: ["program", "variable", "string", "delimiter", "output"],
      concept: `### Project: Digital Greeting Card

Congratulations on reaching the capstone project of **Phase 0: Welcome to Python**! 

In this project, we synthesize:
1. Sequential execution flow.
2. Clean print statements and string repetition borders.
3. Descriptive human comments.
4. Error-free variable referencing.

\`\`\`python
# Phase 0 Capstone: Digital Greeting Card
recipient = "Sam"
sender = "Python Zero -> Pro Team"
border = "+" + ("-" * 32) + "+"

print(border)
print("|  MILESTONE 0 COMPLETE!         |")
print(border)
print("|  Dear", recipient + ",")
print("|  You mastered:                 |")
print("|  1. Computer literalism        |")
print("|  2. Sequential execution       |")
print("|  3. Traceback decoding         |")
print(border)
print("|  From:", sender)
print(border)
\`\`\`

---

#### Milestone Achieved!
You are now ready to step into **Phase 1: Storing Information**, where we unlock variables, data types, numbers, string manipulation, and user input!`,
      practiceCode: `recipient = "Sam"
border = "*" * 28
print(border)
print("* Welcome to Python Pro!   *")
print("* Great job on Phase 0, " + recipient + "! *")
print(border)`,
      quizQuestion: "What is the best way to ensure top and bottom borders match in length?",
      quizOptions: [
        "Store the repeated border in a variable and print that same variable twice",
        "Manually count the characters by hand every time",
        "Use random numbers",
        "Do not use borders at all"
      ],
      quizAnswerIndex: 0
    }
  ]
};
