// expandAllLessons.ts
// Programmatically enhances ALL 24 curriculum lessons with rich, detailed, word-abundant educational text,
// comprehensive real-world analogies, deep conceptual walkthroughs, and clear step-by-step explanations.
import fs from "fs";
import path from "path";

const targetPath = path.resolve(process.cwd(), "src/data/curriculum/curriculum.json");
const curriculum = JSON.parse(fs.readFileSync(targetPath, "utf8"));

interface LessonEnrichment {
  explanationTitle?: string;
  explanationContent: string;
  exampleDescription?: string;
  exampleStepByStep?: string[];
  syntaxNotes?: string;
}

const enrichments: Record<string, LessonEnrichment> = {
  // ===========================================================================
  // MODULE 1: Python Basics & Syntax
  // ===========================================================================

  "lesson-01-01-what-is-python": {
    explanationTitle: "Welcome to Python: The Language of Readable Code",
    explanationContent: `Python is an open-source, high-level programming language created in 1991 by Dutch computer scientist Guido van Rossum. When designing Python, Guido was inspired by a simple but revolutionary philosophy: **code should be as pleasant, transparent, and intuitive to read as plain everyday English**.

In many traditional programming languages like C, C++, or Java, displaying a simple greeting on screen requires five to ten lines of complicated boilerplate—declaring classes, configuring static methods, handling strict memory management, and placing semicolons after every statement. In Python, you accomplish the exact same outcome in one clean, elegant line:

\`\`\`python
print("Hello, World!")
\`\`\`

### Why Has Python Become the World's Most Popular Language?
From universities and coding bootcamps to top research facilities and Fortune 500 tech companies, Python consistently ranks as the world's most widely adopted language:

* **Uncompromising Readability:** Python replaces noisy brackets \`{}\` with clean, visual indentation. When you inspect a Python script, its logic reads like a bulleted sequence of logical instructions.
* **Massive Real-World Impact:** Python is not a toy language; it powers mission-critical systems across the globe. NASA uses Python to process images from the James Webb Space Telescope; Netflix relies on Python for streaming algorithms; Spotify uses Python for music recommendations; and AI researchers build world-class machine learning models with Python frameworks.
* **Rapid Prototyping:** Because Python allows you to express sophisticated logic in fewer lines of code, engineers can design, build, test, and ship complete products in days rather than months.

### How Your Computer Executes Python Code
Computers cannot directly understand words or sentences. Inside your computer's Central Processing Unit (CPU), the hardware only recognizes microscopic electrical pulses—patterns of binary zeros and ones called machine code.

Python acts as an ultra-fast software translator called an **interpreter**. When you click **Run Code**, the interpreter processes your program **from top to bottom, exactly one line after another**, just like a chef following a culinary recipe:

1. **Reading Line 1:** It reads the first instruction, validates that your syntax follows Python's rules, and performs that action immediately.
2. **Moving Line by Line:** Once Line 1 finishes, it moves down to Line 2, executes it, and continues sequentially all the way to the end of the file.
3. **Graceful Completion:** After executing the final statement, the interpreter terminates cleanly.

To communicate results back to the user, your fundamental tool is Python's built-in \`print()\` function. Let's look closely at how it displays information.`,
    exampleDescription: "A complete two-line Python script demonstrating sequential top-to-bottom execution and automatic line breaks.",
    exampleStepByStep: [
      "Step 1 (Line 1): Python reads print(\"Hello, World!\"), extracts the text characters between the quotation marks, and outputs 'Hello, World!' to the console.",
      "Step 2 (Automatic Line Break): Upon completing the print statement, Python automatically transmits a hidden newline character (\\n) that positions the cursor on the next line.",
      "Step 3 (Line 2): Python reads print(\"I am learning Python!\") and outputs that text immediately beneath the first message.",
      "Step 4 (Clean Termination): Reaching the end of the script instructions, Python successfully exits."
    ]
  },

  "lesson-01-02-the-print-function": {
    explanationTitle: "Mastering print(): Multiple Items, Spacers, and Line Control",
    explanationContent: `In real-world software, programs constantly need to display dynamic data—such as a player's username followed by their score, a date formatted with hyphens, or a download progress indicator that updates on the same row.

Python's built-in \`print()\` function provides extraordinary formatting flexibility through multiple arguments, automatic spacing, and keyword parameters.

### 1. Printing Multiple Items With Commas
You can pass as many items as you want inside a single \`print()\` call simply by separating them with commas:

\`\`\`python
print("Player:", "Alex", "Score:", 100)
\`\`\`

When Python encounters comma-separated items, it automatically performs two actions:
* It outputs each item in the exact order specified.
* It automatically places a single space between each item, preventing words from colliding into one another.

### 2. Why Numbers Don't Need Quotation Marks
Notice that the number \`100\` in the example above does not have quotation marks around it. In Python:
* Wrapping characters in quotes like \`"100"\` creates a **string**—a piece of text treated like letters in a book.
* Writing raw digits without quotes like \`100\` creates an **integer**—a mathematical number capable of addition, subtraction, and calculations.

### 3. Customizing the Separator with \`sep=\`
By default, Python places a single space character between items. What if you want to format a date like \`2026-10-24\` with hyphens, or create a list separated by slashes? You can override the default spacer using \`sep=\`:

\`\`\`python
print("2026", "10", "24", sep="-")    # Displays: 2026-10-24
print("apple", "banana", sep=" & ")    # Displays: apple & banana
print("A", "B", "C", sep="")          # Displays: ABC (no spaces at all!)
\`\`\`

### 4. Controlling Line Endings with \`end=\`
Normally, every \`print()\` statement finishes by printing an invisible newline character (\`\\n\`) that jumps the cursor down to the next row. If you want consecutive print statements to remain on the same row, specify the \`end=\` parameter:

\`\`\`python
print("Loading", end="...")
print("Done!")
# Outputs: Loading...Done! on a single line!
\`\`\``,
    exampleDescription: "Demonstrating comma-separated printing, custom hyphen separators, and continuous printing using end='...'.",
    exampleStepByStep: [
      "Step 1 (Line 1): Evaluates print(\"Python\", \"is\", \"fun!\") and outputs the words with standard single spaces.",
      "Step 2 (Line 2): Evaluates print(\"2026\", \"10\", \"24\", sep=\"-\") and replaces standard spaces with dashes, producing '2026-10-24'.",
      "Step 3 (Line 3): Evaluates print(\"Loading\", end=\"...\"). Because the newline was replaced with dots, the cursor stays on the current row.",
      "Step 4 (Line 4): Evaluates print(\"Done!\"), outputting 'Done!' immediately adjacent to the dots on that same row."
    ]
  },

  "lesson-01-03-numbers-and-math": {
    explanationTitle: "Numbers & Basic Math: Python as a High-Precision Calculator",
    explanationContent: `Python is widely celebrated across scientific computing, data science, financial modeling, and game physics because it handles mathematics with tremendous speed and accuracy.

In Python, numerical data primarily falls into two fundamental categories:
* **Integers (\`int\`):** Whole numbers without a decimal point. Examples: \`42\`, \`0\`, \`-15\`, \`1000000\`. Integers can grow to arbitrary size in Python—they never overflow!
* **Floating-Point Numbers (\`float\`):** Numbers that contain a fractional decimal point. Examples: \`3.14159\`, \`0.75\`, \`-2.5\`.

### Complete Arithmetic Operators Table
Python supports all standard algebraic operations along with specialized computer science operators:

| Operator | Operation | Code Example | Calculated Result | Explanation |
|---|---|---|---|---|
| \`+\` | Addition | \`10 + 5\` | \`15\` | Combines values |
| \`-\` | Subtraction | \`20 - 7\` | \`13\` | Computes difference |
| \`*\` | Multiplication | \`4 * 6\` | \`24\` | Multiplies values |
| \`/\` | True Division | \`15 / 2\` | \`7.5\` | Always returns a float! |
| \`//\` | Floor Division | \`15 // 2\` | \`7\` | Discards the decimal fraction |
| \`%\` | Modulo (Remainder) | \`15 % 2\` | \`1\` | Calculates division remainder |
| \`**\` | Exponentiation | \`2 ** 3\` | \`8\` | Raises base to a power (2 * 2 * 2) |

### Notice the True Division Rule
In Python, dividing with a single slash \`/\` **always produces a floating-point number**, even when numbers divide evenly! For instance, \`10 / 2\` produces \`5.0\` instead of \`5\`. If you need an exact whole number with no decimals, use floor division \`10 // 2\`.

### Order of Operations (PEMDAS)
Python strictly follows algebraic rules of precedence:
1. **P**arentheses \`()\` are evaluated first.
2. **E**xponents \`**\` are evaluated next.
3. **M**ultiplication \`*\`, **D**ivision \`/\`, Floor Division \`//\`, and Modulo \`%\` are computed left-to-right.
4. **A**ddition \`+\` and **S**ubtraction \`-\` are computed last.

Always wrap complex operations in parentheses \`()\` to eliminate ambiguity for yourself and other developers.`,
    exampleDescription: "Performing five core arithmetic operations in sequence: addition, subtraction, multiplication, true division, and exponentiation.",
    exampleStepByStep: [
      "Step 1 (Line 1): Evaluates 10 + 5 and prints the sum 15.",
      "Step 2 (Line 2): Evaluates 20 - 7 and prints the difference 13.",
      "Step 3 (Line 3): Evaluates 4 * 6 and prints the product 24.",
      "Step 4 (Line 4): Evaluates 15 / 2 and prints the floating-point result 7.5.",
      "Step 5 (Line 5): Evaluates 2 ** 3 (2 raised to the 3rd power: 2 * 2 * 2) and prints 8."
    ]
  },

  "lesson-01-04-comments": {
    explanationTitle: "Code Documentation: Why Comments Matter in Real Software",
    explanationContent: `There is a well-known proverb among software engineers: **always code as if the person who ends up maintaining your code will be a violent psychopath who knows where you live**. 

More realistically: when you revisit code you wrote six months ago—or when you collaborate with teammates on an engineering project—clear explanations can save days of head-scratching.

A **comment** is a note written directly inside your source code file solely for human readers. Whenever the Python interpreter encounters a comment, it completely ignores it, treating it as if it were blank space.

### Types of Comments in Python
Python provides clean ways to document your code at every level:

1. **Single-Line Comments (\`#\`):** Any text following a hash character \`#\` on that line is ignored by Python:
\`\`\`python
# Calculate total price with 8% sales tax
total = subtotal * 1.08
\`\`\`

2. **Inline Comments:** You can place comments at the end of an active line of code to clarify a specific instruction:
\`\`\`python
timeout = 30  # Maximum seconds to wait for network response
\`\`\`

3. **Multi-Line Explanations & Docstrings (\`"""\`):** When you need to write a lengthy architectural explanation or summarize what a whole module does, enclose the text inside triple quotes:
\`\`\`python
"""
Authentication Module
Handles secure user login, password hashing,
and session token verification.
"""
\`\`\`

### Using Comments for Rapid Debugging
Comments are also one of your most powerful debugging tools. If a specific line of code is throwing an error and you want to test whether the rest of your program works without it, you don't have to delete your work! Simply place a \`#\` at the start of the line to **comment it out**. Once you locate and fix the issue, remove the \`#\` to reactivate the line.`,
    exampleDescription: "A Python script showing header documentation, active code, inline notes, and calculated product costs.",
    exampleStepByStep: [
      "Step 1 (Line 1): Python encounters '#' at the start of '# Calculate the total price of apples' and skips it completely.",
      "Step 2 (Line 2): Assigns the integer 2 to variable price.",
      "Step 3 (Line 3): Assigns the integer 5 to variable quantity.",
      "Step 4 (Line 4): Evaluates price * quantity (2 * 5 = 10) and assigns 10 to total. The inline comment '# Multiply price by count' is ignored.",
      "Step 5 (Line 5): Prints 'Total is $' followed by 10, displaying 'Total is $ 10'."
    ]
  },

  // ===========================================================================
  // MODULE 2: Variables & Core Data Types
  // ===========================================================================

  "lesson-02-01-creating-variables": {
    explanationTitle: "Variables: Labeled Boxes for Storing Program Data",
    explanationContent: `Programs exist to process information: user names, game high scores, shopping cart totals, temperature readings, and account balances. To keep track of this data as your program runs, Python provides **variables**.

### The Mental Model: Labeled Storage Boxes
Think of a variable as a **labeled storage box** in your computer's memory:
* The **name** of the variable (like \`name\` or \`points\`) is written on the front of the box.
* The **value** (like \`"Maya"\` or \`50\`) is the content placed inside the box.

Whenever you want to inspect or change that value later, you simply refer to its label name!

### How Assignment Works in Python
In algebra class, the equals sign \`=\` signifies that two sides are already identical. In Python, however, the \`=\` symbol is the **assignment operator**. It works as an active command:

\`\`\`python
points = 50
points = 70
\`\`\`

Python always executes assignment statements from **right to left**:
1. First, it looks at the value or expression on the **right side** of the \`=\`.
2. Then, it places that value into the variable name on the **left side** (\`points\`).

### Reassigning Variables
Variables are called *variable* because their values can change over time. When you assign a new value to an existing variable name, Python replaces the old value with the new one. The previous value is discarded, and the variable holds only the newest data.`,
    exampleDescription: "Creating variables for a player's name and points, displaying them, and reassigning updated points.",
    exampleStepByStep: [
      "Step 1 (Line 1): Creates a variable named name and assigns it the string 'Maya'.",
      "Step 2 (Line 2): Creates a variable named points and assigns it the initial integer 50.",
      "Step 3 (Line 3): Prints 'Maya has 50 points' using the variable values.",
      "Step 4 (Line 5): Overwrites points with the new integer 70.",
      "Step 5 (Line 6): Prints 'Maya now has 70 points' showing the updated state."
    ]
  },

  "lesson-02-02-variable-names": {
    explanationTitle: "Variable Naming Rules & Professional Python Conventions",
    explanationContent: `Choosing good variable names is one of the most important skills in software engineering. Clear names make your code self-documenting, meaning anyone reading it can understand what the program does without needing extensive comments.

Python has strict syntax rules for variable names that must be followed, as well as community conventions that professional developers respect.

### The 4 Hard Rules of Variable Names
If you break any of these four rules, Python will refuse to run your code and throw a \`SyntaxError\`:

1. **Must begin with a letter or underscore (\`_\`):** \`score\` and \`_temp\` are valid; \`2cool\` is invalid!
2. **Can only contain letters, numbers, and underscores:** No spaces, hyphens, exclamation marks, or dollar signs (\`total_score\` is valid, \`total-score\` is invalid).
3. **Names are strictly case-sensitive:** \`Score\`, \`score\`, and \`SCORE\` are three completely separate variables! Mixing them up is a frequent source of bugs.
4. **Cannot use Python reserved keywords:** You cannot name a variable \`print\`, \`if\`, \`else\`, \`for\`, \`while\`, or \`def\`, because Python uses these words for its own language instructions.

### The Python Standard: snake_case
Different programming languages favor different naming styles. In JavaScript and Java, developers use camelCase (\`studentName\`). In Python, the official style guide (PEP 8) dictates **snake_case**:
* All letters are lowercase.
* Multiple words are joined with underscores (\`student_name\`, \`math_score\`, \`is_happy\`, \`maximum_speed\`).

Descriptive names like \`total_cart_price\` are infinitely better than vague single letters like \`x\` or \`t\`.`,
    exampleDescription: "Demonstrating clean snake_case variable names for text, numbers, and boolean values.",
    exampleStepByStep: [
      "Step 1 (Line 1): Assigns 'Alex' to descriptive variable student_name.",
      "Step 2 (Line 2): Assigns the integer 95 to math_score.",
      "Step 3 (Line 3): Assigns the boolean True to is_happy.",
      "Step 4 (Line 4): Combines student_name, 'got', and math_score to print 'Alex got 95'."
    ]
  },

  "lesson-02-03-python-data-types": {
    explanationTitle: "The Core Data Types: Strings, Integers, Floats, and Booleans",
    explanationContent: `Every piece of data inside a Python program has a specific **type**. The data type tells Python what operations are permitted on that data—you can multiply two numbers, but you cannot multiply two dates or calculate the square root of a person's name!

Python features four primary primitive data types that you will use constantly:

### 1. String (\`str\`)
Text data wrapped in quotation marks (\`"Tokyo"\`, \`'Python'\`). Strings can contain any characters: letters, numbers, spaces, and emoji.
* Example: \`city = "Tokyo"\`

### 2. Integer (\`int\`)
Whole positive or negative numbers without a decimal point. Integers can grow to arbitrary precision in Python.
* Example: \`age = 14\`

### 3. Floating-Point Number (\`float\`)
Numbers that include a decimal point, used for measurements, fractional amounts, and currency.
* Example: \`price = 4.99\`

### 4. Boolean (\`bool\`)
Named after mathematician George Boole, a boolean can only have one of two possible values: \`True\` or \`False\`. Note that both must be capitalized in Python!
* Example: \`is_open = True\`

### Inspecting Types with \`type()\`
When debugging code, you can ask Python to tell you the type of any variable using the built-in \`type()\` function:
\`\`\`python
print(type("Tokyo"))  # Output: <class 'str'>
print(type(14))       # Output: <class 'int'>
print(type(4.99))     # Output: <class 'float'>
print(type(True))     # Output: <class 'bool'>
\`\`\``,
    exampleDescription: "Declaring variables of each primary type and using type() to inspect their internal classes.",
    exampleStepByStep: [
      "Step 1 (Lines 1-4): Creates city (str), age (int), price (float), and is_open (bool).",
      "Step 2 (Line 5): Passes city into type() and prints <class 'str'>.",
      "Step 3 (Line 6): Passes age into type() and prints <class 'int'>.",
      "Step 4 (Line 7): Passes price into type() and prints <class 'float'>.",
      "Step 5 (Line 8): Passes is_open into type() and prints <class 'bool'>."
    ]
  },

  "lesson-02-04-type-conversion": {
    explanationTitle: "Type Conversion: Explicit Casting and Type Inspection",
    explanationContent: `Python is a **strongly typed** programming language. This means Python cares deeply about what type of data you are working with, and it will refuse to guess what you mean if you try to combine incompatible types.

For example, if you try to execute:
\`\`\`python
total = "50" + 20  # CRASH! TypeError
\`\`\`
Python halts and raises a \`TypeError\`. Why? Because \`"50"\` is text and \`20\` is a number. Python does not know whether you wanted to mathematically add them to get \`70\`, or glue the text together to get \`"5020"\`.

To resolve this, you must use **explicit type conversion** (also called **type casting**).

### The Type Conversion Functions
Python provides intuitive constructor functions named directly after each data type:

* **\`int(x)\`:** Converts text or float into an integer. \`int("50")\` becomes \`50\`. \`int(9.99)\` chops off the decimal, giving \`9\`.
* **\`float(x)\`:** Converts text or integer into a float. \`float("3.14")\` becomes \`3.14\`. \`float(5)\` becomes \`5.0\`.
* **\`str(x)\`:** Converts any data into a text string. \`str(100)\` becomes \`"100"\`.
* **\`bool(x)\`:** Converts values into \`True\` or \`False\`.

### Converting Numbers to Strings for Output
When you need to construct a message, converting numbers into strings with \`str()\` allows you to concatenate them with other strings cleanly:
\`\`\`python
age = 15
print("I am " + str(age) + " years old.")
\`\`\``,
    exampleDescription: "Converting a text string into an integer so it can participate in mathematical addition.",
    exampleStepByStep: [
      "Step 1 (Line 1): Assigns the text string '50' to variable text_points.",
      "Step 2 (Line 3): Uses int(text_points) to convert '50' into the real number 50 and stores it in points.",
      "Step 3 (Line 4): Evaluates points + 20 (50 + 20 = 70) and stores 70 in bonus.",
      "Step 4 (Line 5): Prints 'Total points: 70' to the console."
    ]
  },

  // ===========================================================================
  // MODULE 3: Operators & Booleans
  // ===========================================================================

  "lesson-03-01-comparison-operators": {
    explanationTitle: "Comparison Operators: Asking True or False Questions",
    explanationContent: `Computers make decisions by evaluating conditions. Does the player have enough gold to buy this sword? Is the user's password correct? Is the game level greater than 10?

To answer these questions, Python uses **comparison operators**. Every comparison evaluates to one of two boolean values: strictly \`True\` or strictly \`False\`.

### The Six Comparison Operators
| Operator | Meaning | Code Example | Evaluates To |
|---|---|---|---|
| \`==\` | Equal to | \`5 == 5\` | \`True\` |
| \`!=\` | Not equal to | \`5 != 3\` | \`True\` |
| \`>\` | Greater than | \`10 > 7\` | \`True\` |
| \`<\` | Less than | \`4 < 2\` | \`False\` |
| \`>=\` | Greater than or equal to | \`18 >= 18\` | \`True\` |
| \`<=\` | Less than or equal to | \`25 <= 20\` | \`False\` |

### The Critical Difference Between \`=\` and \`==\`
This is one of the most common stumbling blocks for beginners:
* **Single Equals (\`=\`):** The **assignment operator**. It tells Python: 'Store this value inside this variable name.'
* **Double Equals (\`==\`):** The **equality comparison operator**. It asks Python: 'Are these two values equal to each other?'

If you write \`if age = 18:\`, Python will produce a syntax error! Always use \`==\` when comparing.`,
    exampleDescription: "Comparing an age variable against adult, teenage, and non-zero thresholds.",
    exampleStepByStep: [
      "Step 1 (Line 1): Assigns the integer 15 to variable age.",
      "Step 2 (Line 2): Evaluates age >= 18 (15 >= 18), which is False, and prints 'Is adult (18 or older): False'.",
      "Step 3 (Line 3): Evaluates age == 15 (15 == 15), which is True, and prints 'Is teenager (equal to 15): True'.",
      "Step 4 (Line 4): Evaluates age != 0 (15 != 0), which is True, and prints 'Is not zero: True'."
    ]
  },

  "lesson-03-02-logical-operators": {
    explanationTitle: "Logical Operators: Combining Conditions with and, or, and not",
    explanationContent: `Real-world decisions rarely depend on a single factor. To ride a roller coaster, you must be tall enough **AND** you must have a ticket. To get a school snow day, it must be freezing **OR** there must be deep snow.

Python provides three **logical operators** to combine and invert boolean expressions: \`and\`, \`or\`, and \`not\`.

### 1. The \`and\` Operator (Both Must Be True)
The \`and\` operator requires **both** sides of the expression to be \`True\`. If even one side is \`False\`, the entire expression becomes \`False\`:
* \`True and True\` -> \`True\`
* \`True and False\` -> \`False\`
* \`False and False\` -> \`False\`

### 2. The \`or\` Operator (At Least One Must Be True)
The \`or\` operator requires **at least one** side to be \`True\`. It only evaluates to \`False\` if both conditions are \`False\`:
* \`True or False\` -> \`True\`
* \`False or True\` -> \`True\`
* \`False or False\` -> \`False\`

### 3. The \`not\` Operator (Inverts Truth)
The \`not\` operator simply flips any boolean value to its opposite:
* \`not True\` -> \`False\`
* \`not False\` -> \`True\``,
    exampleDescription: "Testing amusement park ride admission using 'and', and weekend weather checks using 'or'.",
    exampleStepByStep: [
      "Step 1 (Lines 1-2): Sets age = 14 and has_ticket = True.",
      "Step 2 (Line 3): Evaluates (age >= 12) [True] and has_ticket [True]. Both are True, so can_ride becomes True.",
      "Step 3 (Line 4): Prints 'Can ride roller coaster: True'.",
      "Step 4 (Lines 6-7): Sets is_sunny = False and is_warm = True.",
      "Step 5 (Line 8): Evaluates is_sunny or is_warm (False or True). At least one is True, so good_weather becomes True.",
      "Step 6 (Line 9): Prints 'Good weather: True'."
    ]
  },

  "lesson-03-03-fstrings": {
    explanationTitle: "F-Strings: The Cleanest, Most Modern Way to Build Messages",
    explanationContent: `When writing real applications, you constantly need to assemble text that mixes static words with live variables: user profiles, shopping totals, game statistics, and system alerts.

In older versions of Python, developers had to use tedious string concatenation with \`+\` and wrap every single number in \`str()\`:
\`\`\`python
# The old, tedious way:
message = "Player " + name + " has " + str(score) + " points!"
\`\`\`

Python 3.6 introduced **f-strings** (formatted string literals), which transformed how Python developers write code.

### How to Write an F-String
1. Place the letter \`f\` or \`F\` immediately before the opening quotation mark: \`f"..."\`.
2. Inside the string, put any variable name or Python expression inside curly braces \`{ }\`.
3. Python automatically calculates whatever is inside the braces and seamlessly converts it into text!

\`\`\`python
name = "Lucas"
level = 4
print(f"Welcome back, {name}! Next level is {level + 1}.")
\`\`\`

### Expressions Inside Braces
You can do math, call functions, and access object attributes directly inside the curly braces:
* \`f"Total: \${price * quantity}"\`
* \`f"Uppercase: {name.upper()}"\`
* \`f"Next year you will be {age + 1}."\`

F-strings are cleaner, significantly faster to execute, and eliminate tedious type conversions.`,
    exampleDescription: "Using f-strings to inject a name and calculate the next level directly inside curly braces.",
    exampleStepByStep: [
      "Step 1 (Lines 1-2): Assigns name = 'Lucas' and level = 4.",
      "Step 2 (Line 3): Python evaluates f'Welcome back, {name}!', replaces {name} with 'Lucas', and prints 'Welcome back, Lucas!'.",
      "Step 3 (Line 4): Evaluates {level} (4) and {level + 1} (5), printing 'You are on level 4, and next is level 5.'."
    ]
  },

  // ===========================================================================
  // MODULE 4: Conditions & Decisions (If...Else)
  // ===========================================================================

  "lesson-04-01-the-if-statement": {
    explanationTitle: "The if Statement: Teaching Your Code to Make Smart Choices",
    explanationContent: `So far, all of our programs have executed every single line from top to bottom. But real applications must adapt: a game should grant a trophy only when the player wins; an online banking app should reject a withdrawal if the balance is too low; an alarm should sound only when smoke is detected.

The \`if\` statement is Python's fundamental tool for creating **conditional branches**—code blocks that only run when a specific condition is met.

### The Anatomy of an if Statement
Every Python if statement consists of three essential elements:
1. The **\`if\` keyword** followed by a condition that evaluates to \`True\` or \`False\`.
2. A **colon \`:\`** at the very end of the line. The colon tells Python: 'Pay attention! A block of code is about to follow.'
3. An **indented block** of code underneath.

\`\`\`python
score = 85
if score >= 60:
    print("Great job!")
    print("You passed the exam.")
print("Report card complete.")
\`\`\`

### The Golden Rule of Python: Indentation
In other programming languages like JavaScript or Java, code blocks are wrapped inside curly brackets \`{ }\`. In Python, **indentation (spacing from the left margin) defines the code block**.

* Standard Python convention is exactly **4 spaces** per indent level.
* Any lines indented under the \`if\` header belong to that block. They only execute if the condition is \`True\`.
* As soon as you unindent back to the left margin, you exit the if statement. Unindented code runs unconditionally, whether the condition was True or False!`,
    exampleDescription: "Testing an exam score threshold with an indented if block that executes only when the condition is met.",
    exampleStepByStep: [
      "Step 1 (Line 1): Assigns the integer 85 to variable score.",
      "Step 2 (Line 2): Python checks if score >= 60 (85 >= 60). The condition is True.",
      "Step 3 (Lines 3-4): Because it is True, Python enters the indented block and prints 'Great job!' and 'You passed the exam.'.",
      "Step 4 (Line 5): Python exits the if block and executes the unindented print('Report card complete.')."
    ]
  },

  "lesson-04-02-else-and-elif": {
    explanationTitle: "The else and elif Statements: Handling Both Paths & Multi-Choice Chains",
    explanationContent: `An \`if\` statement by itself allows your program to do something special when a condition is \`True\`. But what if you need to take an alternative action when the condition is \`False\`?

### The \`else\` Statement: The Alternative Path
Think of an \`if-else\` statement as a **fork in the road**. When your code arrives at the fork, it evaluates the condition:
* If the condition is **\`True\`**, it takes the \`if\` path.
* If the condition is **\`False\`**, it takes the \`else\` path.

Crucially, **exactly one of the two blocks will execute—never both, and never neither!**

### The \`elif\` Statement: Multiple Scenarios
Real life often presents more than just two choices. Traffic lights can be red, yellow, or green; temperatures can be freezing, mild, or hot.

When you have three or more mutually exclusive outcomes, Python provides the **\`elif\`** keyword (short for *else if*):

\`\`\`python
light = "yellow"
if light == "red":
    print("Stop!")
elif light == "yellow":
    print("Slow down!")
else:
    print("Go!")
\`\`\`

### How Python Checks an elif Chain
Python checks each condition from top to bottom. **As soon as it finds the first True condition, it runs that block and immediately skips the rest of the chain!** If none of the conditions were True, the final \`else\` executes as a reliable fallback.`,
    exampleDescription: "A traffic light simulator using if, elif, and else to display the correct driver action.",
    exampleStepByStep: [
      "Step 1 (Line 1): Sets light = 'yellow'.",
      "Step 2 (Line 2): Checks if light == 'red' ('yellow' == 'red') -> False. Skips to the next condition.",
      "Step 3 (Line 4): Checks elif light == 'yellow' ('yellow' == 'yellow') -> True!",
      "Step 4 (Line 5): Executes print('Slow down!').",
      "Step 5 (Line 6): Skips the else block completely because an earlier elif condition matched."
    ]
  },

  // ===========================================================================
  // MODULE 5: Loops (Repeating Things)
  // ===========================================================================

  "lesson-05-01-while-loops": {
    explanationTitle: "The while Loop: Repeating Code Until a Condition Changes",
    explanationContent: `Computers excel at doing repetitive tasks without ever getting tired or making accidental calculation errors. If you had to print numbers 1 through 1,000 by hand, writing 1,000 separate print statements would take hours. With a loop, you can do it in three lines!

A **\`while\` loop** repeatedly executes a block of code **as long as its condition remains \`True\`**.

### The Anatomy of a while Loop
A well-structured while loop always has three critical components:
1. **Initialization:** You set up a counter or state variable *before* the loop begins (e.g. \`countdown = 3\`).
2. **Condition:** The loop evaluates the condition at the start of every iteration (e.g. \`while countdown > 0:\`).
3. **State Update:** Inside the loop, you must change the variable (e.g. \`countdown -= 1\`) so that the condition eventually becomes \`False\`.

\`\`\`python
countdown = 3
while countdown > 0:
    print(countdown)
    countdown -= 1
print("Blast off!")
\`\`\`

### Beware the Infinite Loop!
What happens if you forget to decrement \`countdown -= 1\`? The variable \`countdown\` would stay \`3\` forever. \`3 > 0\` would be \`True\` forever, and Python would run endlessly in what programmers call an **infinite loop**, freezing your application! Whenever you write a while loop, always verify that your code moves toward a termination condition.`,
    exampleDescription: "A rocket launch countdown timer counting down from 3 to 1 before printing 'Blast off!'.",
    exampleStepByStep: [
      "Step 1 (Line 1): Initializes countdown = 3.",
      "Step 2 (Iteration 1): Checks countdown > 0 (3 > 0) -> True. Prints 3, decrements countdown to 2.",
      "Step 3 (Iteration 2): Checks countdown > 0 (2 > 0) -> True. Prints 2, decrements countdown to 1.",
      "Step 4 (Iteration 3): Checks countdown > 0 (1 > 0) -> True. Prints 1, decrements countdown to 0.",
      "Step 5 (Iteration 4): Checks countdown > 0 (0 > 0) -> False! The while loop terminates.",
      "Step 6 (Line 5): Python executes print('Blast off!') after the loop finishes."
    ]
  },

  "lesson-05-02-for-loops-and-range": {
    explanationTitle: "The for Loop & range(): Definite Iteration Over Number Sequences",
    explanationContent: `While a \`while\` loop repeats as long as a condition holds true, a **\`for\` loop** is designed for **definite iteration**—repeating code a predetermined number of times, or visiting every element in a sequence.

In Python, the for loop is praised for its elegant, readable syntax: \`for item in sequence:\`.

### The \`range()\` Function
To repeat an action a specific number of times, Python provides the built-in \`range()\` function. It can be called in three different ways:

1. **\`range(stop)\`:** Generates numbers starting from \`0\` up to (but not including) \`stop\`:
   * \`range(3)\` produces: \`0, 1, 2\` (exactly 3 iterations).
2. **\`range(start, stop)\`:** Starts at \`start\` and goes up to \`stop - 1\`:
   * \`range(1, 4)\` produces: \`1, 2, 3\`.
3. **\`range(start, stop, step)\`:** Increments by \`step\` on each cycle:
   * \`range(0, 10, 2)\` produces: \`0, 2, 4, 6, 8\` (even numbers!).
   * \`range(5, 0, -1)\` produces: \`5, 4, 3, 2, 1\` (counting backwards!).

### Why Does range() Stop Before the End?
A common question from new coders is: *why does range(1, 4) stop at 3 instead of 4?*
This convention matches zero-based indexing and makes calculating lengths easy. Notice that \`stop - start\` gives the exact count of items: \`4 - 1 = 3\` total numbers!`,
    exampleDescription: "Demonstrating range(3) starting at zero and range(1, 4) starting at a custom value.",
    exampleStepByStep: [
      "Step 1 (Line 1): Prints 'Counting 0 to 2:'.",
      "Step 2 (Lines 2-3): for i in range(3): executes three times, with i taking values 0, 1, and 2.",
      "Step 3 (Line 4): Prints 'Counting 1 to 3:'.",
      "Step 4 (Lines 5-6): for num in range(1, 4): executes three times, with num taking values 1, 2, and 3."
    ]
  },

  "lesson-05-03-break-and-continue": {
    explanationTitle: "Loop Control: Early Exits with break and Skipping with continue",
    explanationContent: `Sometimes running a loop from start to finish is unnecessary or wasteful.
* Imagine searching through a database of 100,000 users for an email address. Once you find the matching user on record #5, there is no reason to check the remaining 99,995 records! You want to stop immediately.
* Imagine processing invoices where some entries are blank. You want to skip the blank ones and move directly to the next invoice without crashing.

Python provides two powerful control statements to steer your loops: **\`break\`** and **\`continue\`**.

### 1. The \`break\` Statement: Emergency Exit
When Python encounters \`break\` inside a loop, it **instantly terminates the entire loop**. Execution jumps immediately to the first line of code following the loop block:

\`\`\`python
for i in range(1, 5):
    if i == 3:
        break
    print(i)
# Outputs: 1, 2 (stops when i becomes 3!)
\`\`\`

### 2. The \`continue\` Statement: Skip to the Next Iteration
When Python encounters \`continue\`, it **skips the rest of the current iteration** and jumps directly back up to the top of the loop for the next cycle:

\`\`\`python
for i in range(1, 5):
    if i == 3:
        continue
    print(i)
# Outputs: 1, 2, 4 (only 3 is skipped!)
\`\`\``,
    exampleDescription: "Side-by-side demonstration of break terminating a loop early vs continue skipping a single iteration.",
    exampleStepByStep: [
      "Step 1 (Break Test): Loops i from 1 to 4. When i is 1 and 2, it prints. When i reaches 3, break triggers, ending the loop immediately.",
      "Step 2 (Continue Test): Loops i from 1 to 4. When i reaches 3, continue triggers, skipping print(3) and immediately advancing to i = 4.",
      "Step 3: Prints 4, demonstrating that the rest of the loop survived."
    ]
  },

  // ===========================================================================
  // MODULE 6: Collections (Lists & Dictionaries)
  // ===========================================================================

  "lesson-06-01-python-lists": {
    explanationTitle: "Python Lists: Ordered, Flexible Collections of Data",
    explanationContent: `Until now, our variables have stored a single piece of information at a time: one number, one string, or one boolean. But real software handles collections: a user's shopping cart, a music playlist, game inventory items, or sensor readings.

In Python, the most versatile collection is the **list**. A list is an **ordered, mutable sequence of items** enclosed within square brackets \`[ ]\`.

### Key Characteristics of Lists
* **Enclosed in Square Brackets:** \`colors = ["Red", "Green", "Blue"]\`.
* **Zero-Based Indexing:** Just like strings, the first item is at index \`0\`: \`colors[0]\` is \`"Red"\`.
* **Second Item:** \`colors[1]\` is \`"Green"\`.
* **Negative Indexing:** Python supports negative indices counting backwards from the end! \`colors[-1]\` is the very last element (\`"Blue"\`), and \`colors[-2]\` is the second-to-last.
* **Can Hold Mixed Types:** A Python list can store strings, integers, floats, and booleans simultaneously.

### Finding List Length
To find out how many elements are currently stored in a list, pass it to Python's built-in \`len()\` function:
\`\`\`python
print(len(colors))  # Displays: 3
\`\`\``,
    exampleDescription: "Creating a list of three colors and accessing elements using positive and negative indices.",
    exampleStepByStep: [
      "Step 1 (Line 1): Creates colors containing 'Red', 'Green', and 'Blue'.",
      "Step 2 (Line 2): Accesses colors[0] to retrieve the first item 'Red'.",
      "Step 3 (Line 3): Accesses colors[1] to retrieve the second item 'Green'.",
      "Step 4 (Line 4): Accesses colors[-1] to retrieve the final item 'Blue' using negative indexing."
    ]
  },

  "lesson-06-02-list-methods": {
    explanationTitle: "List Methods: Modifying Lists with append, len, and remove",
    explanationContent: `Unlike strings (which are immutable and cannot be changed once created), **Python lists are mutable**. This means you can freely add items, remove items, replace values, and change elements without creating an entirely new list.

Python provides powerful built-in **methods**—functions attached directly to list objects:

### 1. Adding Items with \`.append()\`
The \`.append(item)\` method adds a new element to the **very end** of the list:
\`\`\`python
tasks = ["Clean room", "Read book"]
tasks.append("Feed dog")
# tasks is now: ["Clean room", "Read book", "Feed dog"]
\`\`\`

### 2. Measuring Length with \`len()\`
The \`len(list)\` function returns the total count of items in the list:
\`\`\`python
print(len(tasks))  # 3
\`\`\`

### 3. Removing Items with \`.remove()\`
The \`.remove(value)\` method finds the first matching item in the list and deletes it:
\`\`\`python
tasks.remove("Clean room")
# tasks is now: ["Read book", "Feed dog"]
\`\`\`

If you try to remove an item that does not exist in the list, Python will raise a \`ValueError\`. You can check if an item is present first using \`if item in tasks:\`.`,
    exampleDescription: "Inspecting list size with len(), appending a new task to the end, and removing a completed task.",
    exampleStepByStep: [
      "Step 1 (Line 1): Creates tasks with two initial string elements.",
      "Step 2 (Line 2): Uses len(tasks) to display 'Total tasks: 2'.",
      "Step 3 (Line 3): Calls tasks.append('Feed dog') to add a third task to the end.",
      "Step 4 (Line 4): Prints the updated list containing all three tasks.",
      "Step 5 (Line 5): Calls tasks.remove('Clean room') to delete that specific task.",
      "Step 6 (Line 6): Prints the final list showing the remaining two tasks."
    ]
  },

  "lesson-06-03-looping-through-lists": {
    explanationTitle: "Looping Through Lists: Iterating Over Every Element with for",
    explanationContent: `One of the most powerful combinations in programming is pairing a **\`for\` loop** with a **list**.

Imagine you are building an email newsletter: you have a list of 5,000 subscriber names and want to send each one a personalized greeting. Writing 5,000 separate function calls would be impossible. With a for loop, you can process every subscriber in just two lines of code!

### The \`for item in list:\` Pattern
Python's syntax for looping through a collection reads like natural English:

\`\`\`python
guests = ["Alice", "Bob", "Charlie"]
for guest in guests:
    print(f"Welcome to the party, {guest}!")
\`\`\`

### How Python Executes the Loop
1. Python inspects the list \`guests\`.
2. On the **first iteration**, it assigns \`"Alice"\` to the loop variable \`guest\` and runs the indented code block.
3. On the **second iteration**, it assigns \`"Bob"\` to \`guest\` and runs the code block.
4. On the **third iteration**, it assigns \`"Charlie"\` to \`guest\` and runs the code block.
5. Having visited every element in the list, Python automatically exits the loop!

You can choose any name for the loop variable (e.g. \`for x in guests:\`), but choosing singular/plural pairs like \`for guest in guests:\` or \`for score in scores:\` is considered professional Python best practice.`,
    exampleDescription: "Iterating through a list of party guests and printing a personalized welcome message for each person.",
    exampleStepByStep: [
      "Step 1 (Line 1): Initializes guests with ['Alice', 'Bob', 'Charlie'].",
      "Step 2 (Iteration 1): Assigns guest = 'Alice' and prints 'Welcome to the party, Alice!'.",
      "Step 3 (Iteration 2): Assigns guest = 'Bob' and prints 'Welcome to the party, Bob!'.",
      "Step 4 (Iteration 3): Assigns guest = 'Charlie' and prints 'Welcome to the party, Charlie!'.",
      "Step 5: Reaching the end of the list, Python terminates the loop cleanly."
    ]
  },

  "lesson-06-04-python-dictionaries": {
    explanationTitle: "Python Dictionaries: Storing Real-World Data with Key-Value Pairs",
    explanationContent: `Lists are great for ordered sequences like shopping lists. But what if you need to represent a person, a product catalog, or a game character?

Imagine a contact book: you don't look up a phone number by asking 'what is item #3?'; you look it up by **name**. In Python, this is called a **Dictionary** (\`dict\`).

A dictionary stores data in **key-value pairs** wrapped in curly braces \`{ }\`:
* The **Key** is the unique identifier (like \`"username"\` or \`"level"\`).
* The **Value** is the data associated with that key (like \`"pixel_hero"\` or \`5\`).

\`\`\`python
user = {
    "username": "pixel_hero",
    "level": 5,
    "is_online": True
}
\`\`\`

### Accessing & Updating Dictionary Data
* **Accessing by Key:** \`user["username"]\` retrieves \`"pixel_hero"\`.
* **Updating an Existing Key:** Simply assign to the key: \`user["level"] = 6\`.
* **Adding a Brand New Key:** \`user["score"] = 250\` creates a new key-value pair immediately!

Dictionaries allow you to structure complex, realistic data cleanly and intuitively.`,
    exampleDescription: "Creating a dictionary representing a game player, accessing values by key, and leveling up the player.",
    exampleStepByStep: [
      "Step 1 (Lines 1-5): Creates dictionary user with keys 'username', 'level', and 'is_online'.",
      "Step 2 (Line 6): Accesses user['username'] and prints 'Player: pixel_hero'.",
      "Step 3 (Line 7): Accesses user['level'] and prints 'Level: 5'.",
      "Step 4 (Line 9): Overwrites user['level'] = 6 to level up the player.",
      "Step 5 (Line 10): Prints 'New Level: 6' showing the modified dictionary state."
    ]
  },

  // ===========================================================================
  // MODULE 7: Functions & Reusable Blocks
  // ===========================================================================

  "lesson-07-01-creating-functions": {
    explanationTitle: "Functions: Packaging Reusable Logic with the def Keyword",
    explanationContent: `In programming, there is a legendary principle known as **DRY: Don't Repeat Yourself**. If you find yourself copying and pasting the same five lines of code in multiple places in your program, you are setting a trap for yourself. If a bug is found, you will have to fix it in every single place you pasted it!

The solution is a **function**—a self-contained, named mini-program that performs a specific task. Once written, you can invoke (call) that function as many times as you like from anywhere in your project!

### Defining vs Calling a Function
Working with functions involves two distinct phases:

1. **Defining the Function (\`def\`):** You write the recipe. Python stores the instructions in memory under the name you chose, but **does not execute them yet**:
\`\`\`python
def show_banner():
    print("********************")
    print("  Welcome to Python ")
    print("********************")
\`\`\`

2. **Calling the Function:** When you want the instructions to actually execute, write the function's name followed by parentheses \`()\`:
\`\`\`python
show_banner()  # Runs the three print lines!
show_banner()  # Runs them again!
\`\`\`

### Execution Flow with Functions
When Python reaches a function call:
1. It pauses its current location in the main program.
2. It jumps directly to the function definition and executes every indented line inside it.
3. When the function finishes, Python jumps back to where it paused and resumes execution!`,
    exampleDescription: "Defining a banner function once with def and calling it twice with intermediate work between.",
    exampleStepByStep: [
      "Step 1 (Lines 1-4): Python reads def show_banner(): and stores the function instructions in memory without running them.",
      "Step 2 (Line 6): Calls show_banner(). Python jumps to line 1 and prints the 3 banner lines.",
      "Step 3 (Line 7): Prints 'Some work happening here...'.",
      "Step 4 (Line 8): Calls show_banner() again. Python re-executes the banner lines and returns cleanly."
    ]
  },

  "lesson-07-02-parameters-and-arguments": {
    explanationTitle: "Parameters & Arguments: Passing Custom Ingredients into Functions",
    explanationContent: `A function that prints the exact same static message every time is helpful, but functions become truly transformative when you can feed them **custom data** so they perform work tailored to that input.

### Parameters vs Arguments
Although these terms are often used interchangeably in casual conversation, they have precise meanings:
* **Parameter:** The variable placeholder listed in the function's definition header (e.g. \`def greet(name, hobby):\`).
* **Argument:** The actual, concrete value passed into the function when you invoke it (e.g. \`greet("Alex", "skateboarding")\`).

Think of a function like a blender:
* The blender's slot is the **parameter** (waiting for fruit).
* The actual strawberries you drop into the blender are the **arguments**!

### Positional Arguments
In Python, arguments are matched to parameters by position from left to right:
\`\`\`python
def greet(name, hobby):
    print(f"Hi {name}, have fun {hobby}!")

greet("Alex", "skateboarding")
greet("Emma", "reading")
\`\`\`

When you call \`greet("Alex", "skateboarding")\`, Python assigns \`"Alex"\` to \`name\` and \`"skateboarding"\` to \`hobby\`. Calling the same function with different arguments produces custom output every time!`,
    exampleDescription: "Defining a greet function with two parameters and calling it with two different pairs of arguments.",
    exampleStepByStep: [
      "Step 1 (Lines 1-2): Defines greet(name, hobby) with two parameters.",
      "Step 2 (Line 4): Calls greet('Alex', 'skateboarding'). Python binds name = 'Alex' and hobby = 'skateboarding', printing 'Hi Alex, have fun skateboarding!'.",
      "Step 3 (Line 5): Calls greet('Emma', 'reading'). Python binds name = 'Emma' and hobby = 'reading', printing 'Hi Emma, have fun reading!'."
    ]
  },

  "lesson-07-03-returning-values": {
    explanationTitle: "The return Statement: Sending Results Back to the Caller",
    explanationContent: `Up to this point, our functions have only used \`print()\` to display output on screen. But in real software, functions often need to **calculate an answer and hand it back** so the rest of the program can use that result in further calculations, store it in a database, or send it over the internet.

To send a value back from a function, Python uses the **\`return\`** keyword.

### The Mental Model: Ordering at a Restaurant
* When you call a function that prints, it's like a waiter showing you the meal on a tray and putting it away.
* When you call a function that returns, it's like the waiter **handing you the plate** so you can eat it, store it in the fridge, or share it!

\`\`\`python
def calculate_area(width, height):
    return width * height

room_size = calculate_area(5, 4)
print("Room size:", room_size)  # 20
\`\`\`

### What Happens When return Executes?
1. Python calculates the value of the expression following \`return\`.
2. It sends that calculated value back to the exact place where the function was called.
3. **The function terminates immediately!** Any lines of code written after a \`return\` statement inside the function will never execute (often referred to as unreachable code).`,
    exampleDescription: "Calculating room area with a return statement and using that returned answer to compute total flooring costs.",
    exampleStepByStep: [
      "Step 1 (Lines 1-2): Defines calculate_area(width, height) which computes width * height and returns the result.",
      "Step 2 (Line 4): Calls calculate_area(5, 4). The function computes 5 * 4 = 20 and returns 20, which is saved into room_size.",
      "Step 3 (Line 5): Prints 'Room size: 20'.",
      "Step 4 (Line 7): Uses the returned room_size to calculate cost = 20 * 10 = 200.",
      "Step 5 (Line 8): Prints 'Flooring cost: $ 200'."
    ]
  },

  "lesson-07-04-variable-scope": {
    explanationTitle: "Variable Scope & Default Parameters: Local vs Global Data",
    explanationContent: `As your Python programs grow larger, understanding where variables can and cannot be accessed becomes vital. This concept is called **variable scope**.

### 1. Local Scope (Inside Functions)
Any variable created inside a function belongs to that function's **local scope**. It is born when the function runs, and it is destroyed as soon as the function finishes!
* Code outside the function **cannot see or access** local variables.
* This isolation prevents different parts of your program from accidentally interfering with each other's data.

### 2. Default Parameter Values
Python allows you to assign fallback default values to parameters in your function definition:
\`\`\`python
def say_hello(name="Friend"):
    return f"Hi there, {name}!"
\`\`\`

* If the caller provides an argument (\`say_hello("Maya")\`), Python uses the provided value.
* If the caller omits the argument (\`say_hello()\`), Python automatically uses the default \`"Friend"\`!

Default parameters make your functions remarkably flexible and user-friendly.`,
    exampleDescription: "Demonstrating default parameters in say_hello(): calling with no arguments vs providing a custom name.",
    exampleStepByStep: [
      "Step 1 (Lines 1-2): Defines say_hello(name='Friend') with default parameter 'Friend'.",
      "Step 2 (Line 4): Calls say_hello() with no arguments. Python uses default 'Friend' and prints 'Hi there, Friend!'.",
      "Step 3 (Line 6): Calls say_hello('Maya') with an explicit argument. Python uses 'Maya' and prints 'Hi there, Maya!'."
    ]
  }
};

// Apply enrichments to all 24 lessons
let enrichedCount = 0;
for (const mod of curriculum.modules) {
  for (const lesson of mod.lessons) {
    const e = enrichments[lesson.id];
    if (e) {
      enrichedCount++;
      for (const section of lesson.sections) {
        if (section.type === "explanation") {
          if (e.explanationTitle) section.title = e.explanationTitle;
          section.content = e.explanationContent;
        } else if (section.type === "example") {
          if (e.exampleDescription) section.description = e.exampleDescription;
          if (e.exampleStepByStep) section.stepByStep = e.exampleStepByStep;
        }
      }
    } else {
      console.warn(`Missing enrichment for lesson: ${lesson.id}`);
    }
  }
}

// Write enriched curriculum
fs.writeFileSync(targetPath, JSON.stringify(curriculum, null, 2), "utf8");
console.log(`Successfully enriched ${enrichedCount} of ${curriculum.modules.flatMap((m: any) => m.lessons).length} lessons with abundant educational text in ${targetPath}!`);
