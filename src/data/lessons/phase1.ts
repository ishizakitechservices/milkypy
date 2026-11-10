import { LessonModule } from "../../types";

export const PHASE_1_MODULE: LessonModule = {
  id: "phase-1",
  title: "Phase 1: Storing Information",
  description: "Variables, data types (int, float, str, bool), arithmetic, f-strings, type conversion, and user input.",
  lessons: [
    {
      id: "l-1-1",
      title: "Lesson 1.1: Variables: Boxes with Names",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Learn how variables store data in computer memory and how to use the assignment operator (=) and snake_case naming.",
      hook: "Imagine moving into a new apartment with 30 unlabeled cardboard boxes. If you need your coffee mug, you have to open all 30 boxes! But if you write 'kitchen_mugs' on the side with a marker, you find it in 2 seconds. A variable is simply that clear label on the box.",
      plainEnglish: "A variable is a named storage tag pointing to a value stored in your computer's memory. You create one using the single equals sign (=).",
      codeExample: `# Creating variables with descriptive snake_case names
player_name = "Alex"
player_score = 1500
current_level = 3

print("Player:", player_name)
print("Score:", player_score)
print("Level:", current_level)`,
      whatJustHappened: [
        "Line 2: Stored 'Alex' in memory and tagged it with player_name.",
        "Line 3: Stored 1500 and tagged it with player_score.",
        "Line 4: Stored 3 and tagged it with current_level.",
        "Lines 6-8: Read the values back out of memory and printed them."
      ],
      deeperDive: "Python uses 'snake_case' for variable names: all lowercase letters with words separated by underscores (like user_account_balance). Variable names cannot start with numbers and cannot contain spaces or dashes.",
      yourTurn: {
        challenge: "Create two variables: city_name and current_temperature, then print them out.",
        starterCode: `# Create your two variables below:

# Print them:
`,
        solutionCode: `city_name = "Seattle"
current_temperature = 68
print("City:", city_name)
print("Temperature:", current_temperature)`,
        hints: [
          "Use snake_case with underscores: city_name = '...'",
          "Numbers do not need quotation marks."
        ]
      },
      quickChecks: [
        {
          question: "Which of the following is a valid Python variable name following snake_case convention?",
          options: [
            "user_score_total",
            "user-score-total",
            "1st_user_score",
            "User Score Total"
          ],
          correctIndex: 0,
          explanation: "In Python, variable names must use lowercase letters and underscores, cannot contain dashes or spaces, and cannot start with numbers."
        }
      ],
      commonMistakes: [
        {
          title: "Confusing assignment (=) with equality (==)",
          badCode: "player_name == \"Alex\"",
          goodCode: "player_name = \"Alex\"",
          explanation: "A single '=' means 'store this value into the variable'. Two '==' means 'check if these two things are equal'."
        },
        {
          title: "Starting variable names with numbers",
          badCode: "1st_place = \"Gold\"",
          goodCode: "first_place = \"Gold\"",
          explanation: "Python syntax prohibits variable names starting with digits. Use letters or underscores."
        }
      ],
      seedsForLater: {
        concept: "Variable Scope",
        sproutsIn: "Phase 5: Functions & Reusable Blocks",
        teaser: "Right now variables live globally in your script. Soon, you will learn how functions keep private local variables inside their own boundaries!"
      },
      recap: [
        "Variables are named labels attached to values in computer memory.",
        "Use '=' to store a value into a variable name.",
        "Use snake_case (lowercase with underscores) for clean, standard Python naming."
      ],
      glossaryTerms: ["variable", "assignment", "syntax", "keyword"],
      concept: `### Variables: Boxes with Names

Programs need to remember data, such as usernames, player health, configuration settings, or prices. In Python, we do this using **variables**.

---

#### 1. What is a Variable?
A variable is a labeled tag attached to a value in your computer's memory.

\`\`\`python
# Creating variables
player_name = "Jordan"
score = 250
is_active = True

print("Player:", player_name)
print("Score:", score)
\`\`\`

---

#### 2. Rules for Naming Variables in Python
1. **Lowercase with underscores (snake_case)**: \`user_age\`, \`game_over_status\`.
2. **Cannot start with a digit**: \`player1\` is legal; \`1player\` is illegal!
3. **No spaces or hyphens**: \`user-name\` will cause a SyntaxError (Python thinks you want to subtract!).
4. **Cannot use reserved keywords**: You cannot name a variable \`if\`, \`def\`, or \`print\`.`,
      practiceCode: `character_name = "Maya"
gold_coins = 45
current_health = 100

print("Hero:", character_name)
print("Gold in pouch:", gold_coins)
print("Health:", current_health)`,
      quizQuestion: "What happens if you name a variable user-score = 50 with a hyphen?",
      quizOptions: [
        "SyntaxError: cannot assign to expression (Python thinks you want to subtract score from user)",
        "It stores user-score normally",
        "It converts the hyphen to an underscore automatically",
        "It divides the score by 2"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-2",
      title: "Lesson 1.2: Data Types: What Kind of Thing Is It?",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Master the 4 fundamental primitive data types: integers (int), decimals (float), text (str), and Booleans (bool).",
      hook: "If you walk into a kitchen, you don't pour orange juice into the toaster or put bread in a coffee mug. Kitchen appliances are designed for specific types of food. In programming, Python treats different types of data with specific rules.",
      plainEnglish: "Every value in Python belongs to a data type. The type tells Python what operations make sense for that value (e.g. you can multiply numbers, but you cannot divide words).",
      codeExample: `# The 4 Core Primitive Data Types
age = 21                  # int (integer, whole number)
height_meters = 1.78     # float (decimal number)
username = "CodeMaster"  # str (string, text)
is_verified = True       # bool (Boolean, True or False)

print(type(age))
print(type(height_meters))
print(type(username))
print(type(is_verified))`,
      whatJustHappened: [
        "age is an int because it has no decimal point.",
        "height_meters is a float because of the decimal .78.",
        "username is a str because it is wrapped in quotes.",
        "is_verified is a bool because it is capitalized True.",
        "The built-in type() tool inspects and returns the category of any value."
      ],
      deeperDive: "Python is dynamically typed. That means you do not have to write 'int age = 21' like in C++ or Java. Python figures out the type automatically the moment you assign the value!",
      yourTurn: {
        challenge: "Create one variable for each of the 4 types (int, float, str, bool) and print their types.",
        starterCode: `# 1. Whole number (int):
# 2. Decimal (float):
# 3. Text (str):
# 4. True/False (bool):
`,
        solutionCode: `items = 5
price = 19.99
title = "Python Guide"
in_stock = True

print(type(items))
print(type(price))
print(type(title))
print(type(in_stock))`,
        hints: [
          "Remember: Booleans must have a capital 'T' or 'F' (True / False)."
        ]
      },
      quickChecks: [
        {
          question: "What data type is the value \"42\" (with quotes)?",
          options: [
            "str (string/text)",
            "int (integer)",
            "float (decimal)",
            "bool (Boolean)"
          ],
          correctIndex: 0,
          explanation: "Because it is wrapped in quotes, Python treats \"42\" as text (str), not as a mathematical number."
        }
      ],
      commonMistakes: [
        {
          title: "Writing true or false with a lowercase letter",
          badCode: "is_active = true",
          goodCode: "is_active = True",
          explanation: "In Python, Booleans must be capitalized: True and False. Lowercase 'true' causes a NameError."
        }
      ],
      seedsForLater: {
        concept: "Collections (Lists and Dictionaries)",
        sproutsIn: "Phase 3 and Phase 4",
        teaser: "These 4 types hold a single value. In Phase 3 and 4, we will meet compound data types that hold hundreds of values in a single container!"
      },
      recap: [
        "The 4 primitive types are int (whole number), float (decimal), str (text), and bool (True/False).",
        "Use type(x) to inspect the data type of any variable.",
        "Anything inside quotes is a string, even if it contains digits."
      ],
      glossaryTerms: ["data-type", "integer", "float", "string", "boolean"],
      concept: `### Data Types: What Kind of Thing Is It?

In Python, every piece of data has a classification called its **data type**. The data type defines what operations are valid on that data.

---

#### 1. The 4 Fundamental Types
1. **Integer (\`int\`)**: Whole numbers without decimals (\`-5\`, \`0\`, \`42\`).
2. **Float (\`float\`)**: Numbers with decimal fractions (\`3.14\`, \`-0.001\`, \`2.0\`).
3. **String (\`str\`)**: Sequences of characters wrapped in quotes (\`"Python"\`, \`'Hello'\`).
4. **Boolean (\`bool\`)**: Logical truth values (\`True\`, \`False\`).

\`\`\`python
# Inspecting types with type()
count = 10
temperature = 98.6
status = "Nominal"
is_ready = True

print(type(count))        # <class 'int'>
print(type(temperature))  # <class 'float'>
print(type(status))       # <class 'str'>
print(type(is_ready))     # <class 'bool'>
\`\`\``,
      practiceCode: `year = 2026
pi_approx = 3.14159
language = "Python"
is_fun = True

print(year, "is type:", type(year))
print(pi_approx, "is type:", type(pi_approx))
print(language, "is type:", type(language))
print(is_fun, "is type:", type(is_fun))`,
      quizQuestion: "Which of the following is a float?",
      quizOptions: [
        "7.0",
        "7",
        "\"7.0\"",
        "True"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-3",
      title: "Lesson 1.3: Numbers and Math",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Arithmetic operations, PEMDAS order of operations, standard division (/) vs floor division (//), and the remainder operator (%).",
      hook: "Computers were originally invented as glorified giant calculators to compute artillery trajectory tables. Python performs millions of calculations per second, making it the premier language for science and financial modeling.",
      plainEnglish: "Python uses standard math symbols for addition (+), subtraction (-), and multiplication (*). But it provides two kinds of division: regular (/) and floor (//), plus remainder (%).",
      codeExample: `# Math Operations in Python
a = 14
b = 4

print("Addition (+):", a + b)           # 18
print("Subtraction (-):", a - b)        # 10
print("Multiplication (*):", a * b)     # 56
print("Regular Division (/):", a / b)   # 3.5 (always float)
print("Floor Division (//):", a // b)   # 3 (chops off decimals)
print("Remainder (%):", a % b)          # 2 (14 divided by 4 leaves 2)
print("Exponentiation (**):", 2 ** 3)   # 8 (2 cubed)`,
      whatJustHappened: [
        "Regular division (/) always returns a float (3.5), even if the answer is whole (4 / 2 is 2.0).",
        "Floor division (//) discards the decimal fraction, rounding down to the nearest integer.",
        "The modulo operator (%) calculates the leftover remainder after integer division.",
        "Two asterisks (**) raise a number to a power (2 ** 3 = 8)."
      ],
      deeperDive: "Python follows PEMDAS (Parentheses, Exponents, Multiplication & Division, Addition & Subtraction). When in doubt, use parentheses `( )` to make your intended calculation order crystal clear.",
      yourTurn: {
        challenge: "You have 100 cookies to distribute evenly among 6 children. Use // to find cookies per child and % to find the leftover cookies.",
        starterCode: `total_cookies = 100
children = 6

# Calculate cookies_per_child using //:
# Calculate leftovers using %:
`,
        solutionCode: `total_cookies = 100
children = 6

cookies_per_child = total_cookies // children
leftovers = total_cookies % children

print("Cookies per child:", cookies_per_child)
print("Leftover cookies:", leftovers)`,
        hints: [
          "Use total_cookies // children for whole cookies.",
          "Use total_cookies % children for the remainder."
        ]
      },
      quickChecks: [
        {
          question: "What is the result of 17 // 5 in Python?",
          options: [
            "3",
            "3.4",
            "2",
            "3.0"
          ],
          correctIndex: 0,
          explanation: "17 // 5 performs floor division: 5 goes into 17 three times with remainder 2, so the floor result is 3."
        }
      ],
      commonMistakes: [
        {
          title: "Using ^ for exponents instead of **",
          badCode: "square = 5 ^ 2  # This is bitwise XOR in Python!",
          goodCode: "square = 5 ** 2 # 25",
          explanation: "In Python, the caret symbol (^) is the bitwise XOR operator, not exponentiation. Always use ** for powers."
        }
      ],
      seedsForLater: {
        concept: "Even / Odd Check",
        sproutsIn: "Phase 2: Making Decisions (Lesson 2.1)",
        teaser: "Did you know `number % 2 == 0` tells you instantly whether any number is even? We will use this in Phase 2 for decision logic!"
      },
      recap: [
        "Python supports +, -, *, /, //, %, and **.",
        "Regular division (/) always returns a float.",
        "Floor division (//) gives the quotient; modulo (%) gives the remainder."
      ],
      glossaryTerms: ["operator", "expression", "integer", "float"],
      concept: `### Numbers and Math

Python is a world-class calculation engine. From simple budget tallies to orbital physics, math in Python uses intuitive operators.

---

#### 1. Arithmetic Operators
| Operator | Purpose | Example | Result |
| :--- | :--- | :--- | :--- |
| \`+\` | Addition | \`10 + 5\` | \`15\` |
| \`-\` | Subtraction | \`10 - 5\` | \`5\` |
| \`*\` | Multiplication | \`10 * 5\` | \`50\` |
| \`/\` | Regular Division | \`10 / 4\` | \`2.5\` |
| \`//\` | Floor Division | \`10 // 4\` | \`2\` |
| \`%\` | Modulo (Remainder) | \`10 % 4\` | \`2\` |
| \`**\` | Exponent / Power | \`2 ** 4\` | \`16\` |

---

#### 2. Order of Operations (PEMDAS)
Python calculates expressions in order:
1. **P**arentheses: \`( )\`
2. **E**xponents: \`**\`
3. **M**ultiplication & **D**ivision: \`*\`, \`/\`, \`//\`, \`%\`
4. **A**ddition & **S**ubtraction: \`+\`, \`-\`

\`\`\`python
result = 10 + 2 * 5     # Multiplies first: 10 + 10 = 20
result_fixed = (10 + 2) * 5  # Parentheses first: 12 * 5 = 60
print(result, result_fixed)
\`\`\``,
      practiceCode: `price = 24.00
discount = 4.00
tax_rate = 0.08

subtotal = price - discount
tax = subtotal * tax_rate
final_total = subtotal + tax

print("Subtotal:", subtotal)
print("Tax:", tax)
print("Final Total:", final_total)`,
      quizQuestion: "What is the value of 2 + 3 * 4 in Python?",
      quizOptions: [
        "14 (multiplication happens before addition)",
        "20",
        "24",
        "10"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-4",
      title: "Lesson 1.4: Strings: Working with Text",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Working with text strings, combining strings with (+), escaping quotes, and calculating length with len().",
      hook: "Computers don't just crunch numbers; they communicate with humans through text. Every tweet, message, chat prompt, and article in the world is stored as a string of characters.",
      plainEnglish: "A string (str) is an ordered sequence of characters surrounded by quotes. You can use single quotes ('hello') or double quotes (\"hello\").",
      codeExample: `# Working with Strings
greeting = "Hello"
target = "World"
full_message = greeting + " " + target + "!"

print(full_message)
print("Length of message:", len(full_message))
print("First character:", full_message[0])`,
      whatJustHappened: [
        "Line 4: Used '+' to concatenate (glue) strings together.",
        "Line 7: Used len() to count the total characters in the string (including spaces and punctuation).",
        "Line 8: Accessed the first character using index 0 (Python starts counting at 0!)."
      ],
      deeperDive: "What if your text contains an apostrophe? For example: 'It's raining'. If you wrap it in single quotes, Python gets confused by the middle apostrophe! Solution: Use double quotes: \"It's raining\", or escape it with a backslash: 'It\\'s raining'.",
      yourTurn: {
        challenge: "Combine your first_name and last_name with a space in between, and print the total number of characters in your full name.",
        starterCode: `first_name = "Alan"
last_name = "Turing"
# Combine them into full_name:
# Print full_name and len(full_name):
`,
        solutionCode: `first_name = "Alan"
last_name = "Turing"
full_name = first_name + " " + last_name
print("Full Name:", full_name)
print("Character count:", len(full_name))`,
        hints: [
          "Remember to add a space string ' ' between the names."
        ]
      },
      quickChecks: [
        {
          question: "What does len(\"Python!\") return?",
          options: [
            "7",
            "6",
            "8",
            "Error"
          ],
          correctIndex: 0,
          explanation: "\"Python!\" has 6 letters plus 1 exclamation mark = 7 characters total."
        }
      ],
      commonMistakes: [
        {
          title: "Trying to concatenate a string and a number directly with +",
          badCode: "age = 25\nprint(\"My age is \" + age)",
          goodCode: "age = 25\nprint(\"My age is \" + str(age))",
          explanation: "In Python, '+' only joins two strings. To join a number, convert it with str(age) or use an f-string."
        }
      ],
      seedsForLater: {
        concept: "Slicing and Indexing",
        sproutsIn: "Phase 4: Collections & Mappings",
        teaser: "We just peeked at full_message[0] to grab the first letter. Soon, you will slice entire substrings like text[0:5]!"
      },
      recap: [
        "Strings are sequences of text wrapped in matching single or double quotes.",
        "Use '+' to concatenate (join) strings together.",
        "Use len(text) to measure the total number of characters."
      ],
      glossaryTerms: ["string", "concatenation", "index", "escape-character"],
      concept: `### Strings: Working with Text

Text in Python is represented as a **string** (\`str\`), an ordered sequence of characters.

---

#### 1. Defining Strings
\`\`\`python
# Both single and double quotes are valid
quote1 = "The journey of a thousand miles begins with one step."
quote2 = 'Clean code always looks like it was written by someone who cares.'

# Escaping interior quotes
book = "Douglas Adams wrote \\"The Hitchhiker's Guide to the Galaxy\\""
\`\`\`

---

#### 2. String Concatenation and Length
\`\`\`python
first = "Guido"
last = "van Rossum"
full = first + " " + last
print("Full Name:", full)
print("Total length:", len(full))  # counts spaces too!
\`\`\``,
      practiceCode: `sentence = "Python programming is accessible and powerful."
print("Sentence:", sentence)
print("Total characters:", len(sentence))
print("First letter:", sentence[0])
print("Last letter:", sentence[-1])`,
      quizQuestion: "What is the index of the first character of any string in Python?",
      quizOptions: [
        "0 (zero-indexed)",
        "1",
        "-1",
        "It depends on the string length"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-5",
      title: "Lesson 1.5: String Methods",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Using built-in methods: .upper(), .lower(), .title(), .strip(), .replace(), and understanding string immutability.",
      hook: "Imagine having a personal proofreader standing beside your desk. Every time you write an email, they automatically fix the casing, trim accidental extra spaces, and replace typos. That proofreader is built right into Python strings!",
      plainEnglish: "A method is a function attached to a specific data type. You call it using dot notation (text.upper()). In Python, strings are immutable, meaning methods return a brand-new string rather than altering the original in place.",
      codeExample: `# String Transformation Methods
raw_input = "   welcome to PYTHON PRO   "

cleaned = raw_input.strip()            # Trims leading/trailing whitespace
screaming = cleaned.upper()            # ALL UPPERCASE
whispering = cleaned.lower()          # all lowercase
book_title = cleaned.title()          # Title Case Each Word
swapped = cleaned.replace("PYTHON", "CODING")

print("Original:", repr(raw_input))
print("Cleaned: ", cleaned)
print("Title:   ", book_title)
print("Swapped: ", swapped)`,
      whatJustHappened: [
        ".strip() removed the leading and trailing space padding.",
        ".upper() converted all letters to capital form.",
        ".lower() converted all letters to lowercase form.",
        ".title() capitalized the first letter of each word.",
        ".replace() swapped the old word with the new word.",
        "The original raw_input variable remained completely unchanged in memory because strings are immutable!"
      ],
      deeperDive: "Why are strings immutable? Immutability makes programs safer and faster. Because Python knows a string can never be mutated behind its back, it can optimize memory caching and prevent spooky bugs across different parts of your program.",
      yourTurn: {
        challenge: "Clean the dirty string below: strip the extra whitespace, capitalize it in Title Case, and replace 'ROBOT' with 'STUDENT'.",
        starterCode: `dirty = "   hello robot   "
# Clean it below:
`,
        solutionCode: `dirty = "   hello robot   "
cleaned = dirty.strip().title().replace("Robot", "Student")
print(cleaned)`,
        hints: [
          "You can chain methods: dirty.strip().title()",
          "Be mindful of casing when using .replace()!"
        ]
      },
      quickChecks: [
        {
          question: "If text = \"hello\", what does text.upper() do to the original variable 'text'?",
          options: [
            "Leaves 'text' unchanged and returns a new string \"HELLO\"",
            "Modifies 'text' directly in place to uppercase",
            "Deletes the variable from memory",
            "Raises a TypeError"
          ],
          correctIndex: 0,
          explanation: "Strings are immutable! String methods always return a new string, leaving the original variable unchanged unless you reassign it."
        }
      ],
      commonMistakes: [
        {
          title: "Expecting .strip() to modify the variable in place",
          badCode: "name = \"  Alex  \"\nname.strip()\nprint(name)  # Still has spaces!",
          goodCode: "name = \"  Alex  \"\nname = name.strip()\nprint(name)  # Cleaned!",
          explanation: "Because strings are immutable, you must assign the result back: name = name.strip()."
        }
      ],
      seedsForLater: {
        concept: "List Mutability",
        sproutsIn: "Phase 3: Repeating Things (Lesson 3.3)",
        teaser: "Strings are immutable (cannot be changed in place). Soon in Phase 3, you will meet Lists, which ARE mutable and can be changed in place!"
      },
      recap: [
        "Methods are called with dot notation on objects (e.g. text.upper()).",
        ".strip() trims whitespace; .replace(a, b) swaps text.",
        "Strings are immutable: methods always return a new string."
      ],
      glossaryTerms: ["method", "immutable", "string"],
      concept: `### String Methods

Python strings come equipped with built-in utility functions called **methods**. Methods are invoked using dot notation: \`variable.method_name()\`.

---

#### 1. Common String Methods
- \`.strip()\`: Strips whitespace from the beginning and end of the string.
- \`.upper()\`: Converts all characters to uppercase.
- \`.lower()\`: Converts all characters to lowercase.
- \`.title()\`: Capitalizes the first letter of each word.
- \`.replace(old, new)\`: Replaces occurrences of a substring with another.
- \`.count(sub)\`: Counts how many times a substring appears.

\`\`\`python
user_input = "  alexander graham bell  "
clean = user_input.strip().title()
print(clean)  # "Alexander Graham Bell"
\`\`\`

---

#### 2. String Immutability
Strings cannot be altered in place. Calling \`text.upper()\` does **not** change \`text\`. It calculates a new string that you can store in a variable or print directly.`,
      practiceCode: `announcement = "   breaking: python is awesome   "
cleaned = announcement.strip()
print("Screaming:", cleaned.upper())
print("Headline: ", cleaned.title())
print("Replaced: ", cleaned.replace("awesome", "incredible"))`,
      quizQuestion: "What is the output of \"apple\".replace(\"p\", \"b\")?",
      quizOptions: [
        "\"abble\"",
        "\"abple\"",
        "\"bpple\"",
        "\"apple\""
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-6",
      title: "Lesson 1.6: f-strings: Mixing Text and Variables",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Master modern formatted string literals (f-strings) to seamlessly embed variables and calculations into text.",
      hook: "Remember trying to glue text and numbers together with '+' and getting that ugly TypeError? Before 2016, Python coders had to write clumsy % operators or .format() chains. Then Python introduced f-strings, and everyone fell in love.",
      plainEnglish: "An f-string is a string prefixed with the letter 'f' before the opening quote. Inside, any variable or math expression inside curly braces { } is evaluated automatically.",
      codeExample: `# Modern Python f-strings
name = "Amara"
score = 95
max_score = 100

# Embed variables and expressions directly!
report = f"Student {name} scored {score}/{max_score} ({score / max_score * 100:.1f}%)"
print(report)`,
      whatJustHappened: [
        "The string starts with f before the quotes: f\"...\".",
        "Inside {name}, Python substitutes 'Amara'.",
        "Inside {score / max_score * 100:.1f}, Python calculates the percentage and formats it to 1 decimal place!"
      ],
      deeperDive: "The ':.1f' format specifier instructs Python to format the floating-point number with exactly 1 digit after the decimal point. You can also format currency: f'${cost:.2f}'.",
      yourTurn: {
        challenge: "Write an f-string that prints an item receipt: item, quantity, unit_price, and calculated total (quantity * unit_price).",
        starterCode: `item = "Notebook"
quantity = 3
unit_price = 4.50
# Create your receipt f-string below:
`,
        solutionCode: `item = "Notebook"
quantity = 3
unit_price = 4.50
total = quantity * unit_price
print(f"Purchased {quantity}x {item} @ \${unit_price:.2f} each. Total: \${total:.2f}")`,
        hints: [
          "Start the string with f\"...",
          "Put math or variables inside curly braces: {quantity * unit_price}"
        ]
      },
      quickChecks: [
        {
          question: "Which of the following is a valid Python f-string?",
          options: [
            "f\"Hello {name}, your score is {score}\"",
            "\"Hello {name}, your score is {score}\"f",
            "format(\"Hello {name}\")",
            "f[Hello {name}]"
          ],
          correctIndex: 0,
          explanation: "f-strings must have the lowercase or uppercase 'f' immediately before the opening quotation mark."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting the 'f' prefix before the opening quote",
          badCode: "name = \"Kai\"\nprint(\"Hello {name}\") # Prints literal '{name}'!",
          goodCode: "name = \"Kai\"\nprint(f\"Hello {name}\") # Prints 'Hello Kai'",
          explanation: "Without the 'f' prefix, Python treats {name} as plain literal text, not as an active placeholder."
        }
      ],
      seedsForLater: {
        concept: "Template Engines and Web Views",
        sproutsIn: "Phase 6: Files & Persistence",
        teaser: "f-strings format single lines of text. In Phase 6, you will use these principles to generate full HTML reports and CSV data sheets!"
      },
      recap: [
        "Prefix strings with 'f' to activate formatted string evaluation.",
        "Put any valid variable or expression inside curly braces { }.",
        "Use :.2f inside curly braces to cleanly format decimals."
      ],
      glossaryTerms: ["f-string", "string", "expression"],
      concept: `### f-strings: Mixing Text and Variables Beautifully

Introduced in Python 3.6, **f-strings** (formatted string literals) are the gold standard for producing dynamic text.

---

#### 1. Why f-strings Outshine Concatenation
Old way (error-prone type casting):
\`\`\`python
# Cumbersome and brittle
age = 30
msg = "I am " + str(age) + " years old."
\`\`\`

New way (clean, readable, elegant):
\`\`\`python
age = 30
msg = f"I am {age} years old."
\`\`\`

---

#### 2. Evaluating Expressions Inside Curlys
You can perform math or call methods directly inside the curly braces \`{ }\`:
\`\`\`python
user = "maya"
items = 4
price = 12.50

print(f"Receipt for {user.upper()}:")
print(f"Total: \${items * price:.2f}")
\`\`\``,
      practiceCode: `city = "San Francisco"
temperature_c = 18.0
temperature_f = (temperature_c * 9/5) + 32

print(f"Weather Report for {city}:")
print(f"Temperature: {temperature_c:.1f} °C / {temperature_f:.1f} °F")`,
      quizQuestion: "What happens if you omit the 'f' in front of \"Total is {total}\"?",
      quizOptions: [
        "It literally prints \"Total is {total}\" without replacing the variable",
        "It raises a SyntaxError",
        "It asks the user to enter total",
        "It replaces {total} with zero"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-7",
      title: "Lesson 1.7: Booleans: True or False",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Relational comparison operators: ==, !=, <, >, <=, >= and boolean truth evaluations.",
      hook: "Every decision in your life comes down to a true or false test: Is it raining? (True/False). Is my bank balance greater than the coffee price? (True/False). In computing, everything ultimately boils down to 1s and 0s: True and False.",
      plainEnglish: "A Boolean (bool) is a data type that can only be True or False. You create Booleans using comparison operators that test relationships between values.",
      codeExample: `# Comparison Operators Outputting Booleans
user_age = 19
required_age = 18

print("Equal (==):", user_age == required_age)         # False
print("Not equal (!=):", user_age != required_age)     # True
print("Greater than (>):", user_age > required_age)     # True
print("Less than (<):", user_age < required_age)        # False
print("Greater or equal (>=):", user_age >= required_age) # True`,
      whatJustHappened: [
        "== tests if two values are equal.",
        "!= tests if two values are NOT equal.",
        "> and < test greater than and less than.",
        ">= and <= test greater-than-or-equal and less-than-or-equal.",
        "Every single comparison produces a pure Boolean (True or False)."
      ],
      deeperDive: "Never confuse = with ==! A single '=' is an assignment command (store this in memory). A double '==' is a question (are these two things equal?).",
      yourTurn: {
        challenge: "Write comparisons to check: 1. Is 50 greater than 20? 2. Is 'cat' equal to 'dog'? 3. Is 100 != 100?",
        starterCode: `# Write the 3 comparisons below:
`,
        solutionCode: `print(50 > 20)       # True
print("cat" == "dog") # False
print(100 != 100)     # False`,
        hints: [
          "Use > for greater than, == for equality, and != for not-equal."
        ]
      },
      quickChecks: [
        {
          question: "What does the expression 10 >= 10 evaluate to?",
          options: [
            "True",
            "False",
            "10",
            "Error"
          ],
          correctIndex: 0,
          explanation: ">= means 'greater than OR equal to'. Since 10 is equal to 10, the result is True."
        }
      ],
      commonMistakes: [
        {
          title: "Using single = when checking equality",
          badCode: "is_equal = (5 = 5)",
          goodCode: "is_equal = (5 == 5)",
          explanation: "A single '=' is assignment; '==' is comparison."
        }
      ],
      seedsForLater: {
        concept: "The if Statement",
        sproutsIn: "Phase 2: Making Decisions (Lesson 2.1)",
        teaser: "Booleans are the fuel for decision making! In Phase 2, `if` statements will inspect Booleans to decide which code runs."
      },
      recap: [
        "Booleans have only two possible values: True or False.",
        "Comparison operators include ==, !=, <, >, <=, >=.",
        "Always use double == to check equality."
      ],
      glossaryTerms: ["boolean", "operator", "conditional"],
      concept: `### Booleans: True or False

Booleans are named after English mathematician George Boole. They represent the foundational binary logic that powers computer processors: **True** or **False**.

---

#### 1. Comparison Operators
| Operator | Meaning | Example | Evaluates To |
| :--- | :--- | :--- | :--- |
| \`==\` | Equal to | \`5 == 5\` | \`True\` |
| \`!=\` | Not equal to | \`5 != 3\` | \`True\` |
| \`>\` | Greater than | \`8 > 10\` | \`False\` |
| \`<\` | Less than | \`4 < 9\` | \`True\` |
| \`>=\` | Greater than or equal | \`10 >= 10\` | \`True\` |
| \`<=\` | Less than or equal | \`7 <= 5\` | \`False\` |

\`\`\`python
passcode = "secret123"
user_attempt = "wrongPass"

is_correct = (user_attempt == passcode)
print("Access Granted:", is_correct)  # False
\`\`\``,
      practiceCode: `speed = 75
speed_limit = 65

is_speeding = speed > speed_limit
is_exact_limit = speed == speed_limit

print("Is the driver speeding?", is_speeding)
print("Is driver at exact limit?", is_exact_limit)`,
      quizQuestion: "What is the result of \"apple\" == \"Apple\" in Python?",
      quizOptions: [
        "False (because string comparisons are case-sensitive)",
        "True",
        "Error",
        "None"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-8",
      title: "Lesson 1.8: Type Conversion: Changing Types",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Explicit type casting using int(), float(), and str() to transform data between types safely.",
      hook: "Imagine receiving a package with the number '42' stamped in ink on the side. Is it an address? A weight? A price? To a computer, the text \"42\" is just two ink shapes; it cannot be used in math equations until you explicitly convert it into a real number.",
      plainEnglish: "Type conversion (or type casting) is taking a value of one data type and transforming it into another using built-in functions: int(), float(), and str().",
      codeExample: `# Converting between types
text_num = "42"
real_int = int(text_num)       # Converted to integer 42
real_float = float(text_num)   # Converted to float 42.0
back_to_text = str(100)        # Converted to text "100"

print("Math with converted int:", real_int + 8)      # 50
print("Float representation:", real_float)           # 42.0
print("String concatenation:", back_to_text + " pts") # "100 pts"`,
      whatJustHappened: [
        "int(\"42\") parsed the string digits and created the integer 42.",
        "float(\"42\") created the floating-point decimal 42.0.",
        "str(100) transformed the number 100 into text so it can be combined with other strings."
      ],
      deeperDive: "What happens if you try to convert non-digits, like int(\"hello\")? Python halts with a ValueError! Python can only convert strings that actually look like valid numbers.",
      yourTurn: {
        challenge: "Convert the string price_str = \"19.99\" into a float, add 5.00 for shipping, and print the total.",
        starterCode: `price_str = "19.99"
shipping = 5.00
# Convert price_str to a float and calculate total:
`,
        solutionCode: `price_str = "19.99"
shipping = 5.00
price = float(price_str)
total = price + shipping
print(f"Total: \${total:.2f}")`,
        hints: [
          "Use float(price_str) to convert a decimal string."
        ]
      },
      quickChecks: [
        {
          question: "What is the result of int(7.89)?",
          options: [
            "7 (it truncates/chops off decimals, does not round)",
            "8",
            "7.9",
            "Error"
          ],
          correctIndex: 0,
          explanation: "int() truncates towards zero; it simply discards the decimal fraction (.89) leaving 7."
        }
      ],
      commonMistakes: [
        {
          title: "Calling int() on a string with decimals directly",
          badCode: "val = int(\"19.99\")  # ValueError!",
          goodCode: "val = int(float(\"19.99\")) # 19",
          explanation: "int() cannot parse a decimal point inside a string directly. Convert to float first: float(\"19.99\")."
        }
      ],
      seedsForLater: {
        concept: "User Input Type Casting",
        sproutsIn: "Phase 1: Lesson 1.9 (The Next Lesson!)",
        teaser: "In the very next lesson, user input always arrives as text. You will use int() and float() to convert user responses into numbers!"
      },
      recap: [
        "Use int() to convert to integers, float() for decimals, and str() for text.",
        "int() chops off decimals without rounding.",
        "Converting non-numeric strings to numbers triggers a ValueError."
      ],
      glossaryTerms: ["type-casting", "integer", "float", "string"],
      concept: `### Type Conversion: Changing Types

In Python, types do not automatically morph into each other. If you have text containing digits, you must explicitly convert it using **type casting**.

---

#### 1. Conversion Functions
- \`int(x)\`: Converts \`x\` to an integer. If \`x\` is a float, the decimal is truncated.
- \`float(x)\`: Converts \`x\` to a floating-point number.
- \`str(x)\`: Converts \`x\` to its text string representation.
- \`bool(x)\`: Converts \`x\` to \`True\` or \`False\` (\`0\` and empty strings become \`False\`).

\`\`\`python
# Safe conversion
raw_score = "85"
numeric_score = int(raw_score)
print(numeric_score + 10)  # 95
\`\`\``,
      practiceCode: `price_input = "29.95"
discount_input = "5"

price = float(price_input)
discount = int(discount_input)
final_price = price - discount

print(f"Original: \${price:.2f}")
print(f"Discount: -\${discount:.2f}")
print(f"Total:    \${final_price:.2f}")`,
      quizQuestion: "What error occurs if you run int(\"banana\")?",
      quizOptions: [
        "ValueError: invalid literal for int() with base 10: 'banana'",
        "TypeError",
        "NameError",
        "ZeroDivisionError"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-9",
      title: "Lesson 1.9: Getting Input from Users",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Making programs interactive using input() and converting string responses into numerical values.",
      hook: "A program that only prints pre-written text is like a movie you can only watch. An interactive program is like a video game where your choices control the action! The input() tool turns your program into an interactive experience.",
      plainEnglish: "The input() function pauses your program, prompts the user to type on the keyboard, and returns whatever they typed as a string.",
      codeExample: `# Interactive Programs with input()
user_name = input("Enter your hero name: ")
age_str = input("Enter your hero level: ")
hero_level = int(age_str)  # Remember: input always returns text!

print(f"Welcome, {user_name}! You are Level {hero_level}.")
print(f"Next level reached at {hero_level + 1}!")`,
      whatJustHappened: [
        "Line 2: input() showed the prompt and waited for the user to type.",
        "Line 3: Stored the user's typed level as text.",
        "Line 4: Converted the level string into an integer with int() so math can be performed.",
        "Lines 6-7: Printed personalized messages using f-strings."
      ],
      deeperDive: "THE #1 RULE OF INPUT: input() *always* returns a string! Even if the user types 42, Python sees the string \"42\". If you forget to convert it with int(), trying to do math will crash or produce unexpected results.",
      yourTurn: {
        challenge: "Ask the user for their favorite food and their rating (out of 10), then print a review summary.",
        starterCode: `# Ask for food and rating below:
`,
        solutionCode: `food = input("What is your favorite food? ")
rating = int(input("Rate it from 1 to 10: "))
print(f"You rated {food} a {rating}/10!")`,
        hints: [
          "Wrap input in int() if you want a number: int(input(\"...\"))"
        ]
      },
      quickChecks: [
        {
          question: "What is the return type of input(\"Enter a number: \") if the user types 100?",
          options: [
            "str (string text \"100\")",
            "int (integer 100)",
            "float (100.0)",
            "bool"
          ],
          correctIndex: 0,
          explanation: "input() ALWAYS returns a string, no matter what characters the user types."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting to convert input when doing math",
          badCode: "birth_year = input(\"Birth year: \")\nage = 2026 - birth_year  # TypeError!",
          goodCode: "birth_year = int(input(\"Birth year: \"))\nage = 2026 - birth_year",
          explanation: "You cannot subtract a string from a number! Convert input with int() first."
        }
      ],
      seedsForLater: {
        concept: "Input Validation Loops",
        sproutsIn: "Phase 3: Repeating Things (Lesson 3.1)",
        teaser: "What if the user types letters when you asked for a number? In Phase 3, loops will re-prompt them until they provide a valid number!"
      },
      recap: [
        "input(\"Prompt: \") pauses the program and waits for keyboard input.",
        "input() ALWAYS returns a string.",
        "Wrap input in int() or float() when you need numerical input."
      ],
      glossaryTerms: ["argument", "string", "type-casting", "output"],
      concept: `### Getting Input from Users

Up to this point, our programs have operated on hardcoded values. The \`input()\` function transforms programs into dynamic, interactive applications.

---

#### 1. How input() Works
\`\`\`python
name = input("What is your name? ")
print(f"Pleased to meet you, {name}!")
\`\`\`

---

#### 2. The Universal Rule of input()
**input() ALWAYS returns a string.**
If you ask for someone's age:
\`\`\`python
# [BUG] age is a string like "25"!
age = input("Enter age: ")
# next_year = age + 1  <- TypeError: can only concatenate str to str

# [FIX] Convert with int()
age = int(input("Enter age: "))
next_year = age + 1
print(f"Next year you will be {next_year}.")
\`\`\``,
      practiceCode: `item = input("What item are you purchasing? ")
cost = float(input(f"Enter the price of {item}: "))
quantity = int(input("How many are you buying? "))

total = cost * quantity
print(f"\\nReceipt: {quantity}x {item} = \${total:.2f}")`,
      quizQuestion: "If a user inputs 5 and you do user_input * 3 without int(), what prints?",
      quizOptions: [
        "\"555\" (string repetition)",
        "15",
        "Error",
        "5"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-10",
      title: "Lesson 1.10: Printing Like a Pro",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Customizing print with sep and end keyword parameters, newline (\\n), and tab (\\t) escape characters.",
      hook: "Most beginners think print() is just for dumping text. But professional developers use print() to build aligned data tables, progress bars that stay on one line, and structured log feeds.",
      plainEnglish: "By default, print() separates items with a space and ends every line with a newline. You can customize both using the sep and end parameters.",
      codeExample: `# Professional Print Customization
# 1. Custom separator with sep
print("2026", "10", "07", sep="-")           # 2026-10-07
print("Alpha", "Beta", "Gamma", sep=" -> ")   # Alpha -> Beta -> Gamma

# 2. Custom ending with end (stay on the same line)
print("Connecting", end="... ")
print("Authenticating", end="... ")
print("Success!")

# 3. Escape characters: \\n (newline) and \\t (tab)
print("\\nPlayer\\tScore\\tStatus")
print("Maya\\t980\\tActive")
print("Liam\\t840\\tIdle")`,
      whatJustHappened: [
        "sep=\"-\" replaced the default space separator with dashes.",
        "end=\"... \" prevented print() from dropping to the next line.",
        "\\n inserted an extra blank line; \\t aligned tabular columns evenly."
      ],
      deeperDive: "Using end=\"\" is how programmers create interactive loading spinners and progress meters that update in place in terminal applications!",
      yourTurn: {
        challenge: "Print 3 cities separated by ' | ' using the sep parameter, then print 'Done' on the same line using end.",
        starterCode: `# Write your print statements below:
`,
        solutionCode: `print("Tokyo", "London", "New York", sep=" | ", end=" -- ")
print("Done")`,
        hints: [
          "Pass sep=' | ' inside print().",
          "Pass end=' -- ' to stay on the same line."
        ]
      },
      quickChecks: [
        {
          question: "What does the 'sep' parameter in print() control?",
          options: [
            "The character placed between multiple items in print()",
            "The font size of the output",
            "The color of the terminal text",
            "The language translation"
          ],
          correctIndex: 0,
          explanation: "sep (separator) defines the string placed between arguments passed to print()."
        }
      ],
      commonMistakes: [
        {
          title: "Writing sep as a positional argument without quotes",
          badCode: "print(\"A\", \"B\", sep)",
          goodCode: "print(\"A\", \"B\", sep=\"-\")",
          explanation: "sep is a keyword parameter; specify it as sep=\"...\" with a value."
        }
      ],
      seedsForLater: {
        concept: "CSV Files and Delimiters",
        sproutsIn: "Phase 6: Files & Persistence",
        teaser: "Notice how sep=',' separates data with commas? In Phase 6, this exact principle will let you export data to Microsoft Excel CSV spreadsheets!"
      },
      recap: [
        "sep controls the separator between items (defaults to space).",
        "end controls the character at the end of the line (defaults to newline \\n).",
        "Use \\t for column tabs and \\n for line breaks."
      ],
      glossaryTerms: ["delimiter", "newline", "escape-character", "print"],
      concept: `### Printing Like a Pro

The \`print()\` function has powerful optional arguments that allow fine-grained control over terminal formatting.

---

#### 1. The Separator (\`sep\`)
When you pass multiple arguments to \`print()\`, Python joins them with a single space. You can override this:
\`\`\`python
print("red", "green", "blue", sep=", ")
# Outputs: red, green, blue

print("192", "168", "1", "1", sep=".")
# Outputs: 192.168.1.1
\`\`\`

---

#### 2. The Line Ending (\`end\`)
By default, \`print()\` automatically appends a newline (\`\\n\`). Override this to keep the cursor on the same line:
\`\`\`python
print("Processing data", end="... ")
print("Complete!")
# Outputs: Processing data... Complete!
\`\`\``,
      practiceCode: `print("SYSTEM CHECK", end=": ")
print("CPU OK", "RAM OK", "DISK OK", sep=" | ")
print("-" * 35)
print("USER\\tROLE\\tPERMISSION")
print("admin\\troot\\tall")
print("guest\\tanon\\tread")`,
      quizQuestion: "What is the default value of end in print()?",
      quizOptions: [
        "\"\\n\" (newline)",
        "\" \" (single space)",
        "\"\" (empty string)",
        "\"\\t\" (tab)"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-11",
      title: "Lesson 1.11: Project: Profile Card",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Capstone Project 1: Build an interactive User Profile Generator using inputs, types, math, and f-strings.",
      hook: "You have learned variables, the 4 primitive types, math operations, strings, methods, f-strings, type conversion, and input. Now you will assemble them into a real command-line application: an interactive User Profile Card Generator!",
      plainEnglish: "This project collects user profile details (name, birth year, hourly rate, hours worked), calculates age and gross pay, and renders a clean, professional profile card.",
      codeExample: `# Project: Interactive Profile Card Generator
name = "Jordan Blake"
birth_year = 2000
hourly_rate = 32.50
hours_worked = 40

current_year = 2026
age = current_year - birth_year
gross_pay = hourly_rate * hours_worked

card_width = 38
border = "+" + ("=" * (card_width - 2)) + "+"

print(border)
print(f"| {name.upper():^{card_width - 4}} |")
print(border)
print(f"| Age:           {age:<20} |")
print(f"| Birth Year:    {birth_year:<20} |")
print(f"| Hourly Rate:   \${hourly_rate:<19.2f} |")
print(f"| Hours Worked:  {hours_worked:<20} |")
print(border)
print(f"| Weekly Gross:  \${gross_pay:<19.2f} |")
print(border)`,
      whatJustHappened: [
        "Lines 2-5: Defined profile variables across text, integers, and floats.",
        "Lines 7-9: Computed age and gross weekly pay using arithmetic.",
        "Lines 11-21: Rendered an aligned, formatted terminal card using f-strings and borders."
      ],
      deeperDive: "Notice the syntax `{name.upper():^{card_width - 4}}`! The `^` symbol centers the text inside the box. `<` aligns left, and `>` aligns right. Python's format language gives you complete layout precision.",
      yourTurn: {
        challenge: "Add a new field to the profile card: 'Role' (e.g. 'Software Engineer') and display it inside the card.",
        starterCode: `name = "Maya Lin"
role = "Data Scientist"
# Add role to the card output below:
`,
        solutionCode: `name = "Maya Lin"
role = "Data Scientist"
print("+" + ("-" * 32) + "+")
print(f"| Name: {name:<24} |")
print(f"| Role: {role:<24} |")
print("+" + ("-" * 32) + "+")`,
        hints: [
          "Format your line like: print(f\"| Role: {role:<24} |\")"
        ]
      },
      quickChecks: [
        {
          question: "Which component of Python allows calculating gross_pay = hourly_rate * hours_worked directly?",
          options: [
            "Arithmetic expressions on numeric variables",
            "String concatenation",
            "The print function",
            "The input function"
          ],
          correctIndex: 0,
          explanation: "The multiplication operator (*) calculates product between float and integer variables."
        }
      ],
      commonMistakes: [
        {
          title: "Formatting floats without decimal precision",
          badCode: "print(f\"Pay: ${gross_pay}\")  # Outputs $1300.0 instead of $1300.00",
          goodCode: "print(f\"Pay: ${gross_pay:.2f}\") # Outputs $1300.00",
          explanation: "Always use :.2f for currency to ensure standard 2 decimal places are shown."
        }
      ],
      seedsForLater: {
        concept: "Dictionary Schemas",
        sproutsIn: "Phase 4: Collections & Mappings",
        teaser: "Right now we store profile fields in separate variables. In Phase 4, dictionaries will package all user fields into a single structured object!"
      },
      recap: [
        "You built a complete, interactive profile card application.",
        "You combined variables, types, math, string methods, and formatting.",
        "You applied alignment specifiers (<, ^, >) for clean terminal layout."
      ],
      glossaryTerms: ["program", "variable", "f-string", "float", "integer"],
      concept: `### Project: Interactive Profile Card

This project brings together everything you have mastered in Phase 1:
1. **Variables** with snake_case naming.
2. **Primitive Data Types**: int, float, str, bool.
3. **Arithmetic Calculations**: age and weekly gross pay.
4. **f-string formatting**: currency precision \`:.2f\` and column alignment.

\`\`\`python
# Profile Card Generator
name = "Jordan Blake"
birth_year = 2000
hourly_rate = 32.50
hours_worked = 40

age = 2026 - birth_year
gross_pay = hourly_rate * hours_worked

print("=" * 35)
print(f"PROFILE: {name.upper()}")
print("=" * 35)
print(f"Age:          {age} years")
print(f"Hourly Rate:  \${hourly_rate:.2f}")
print(f"Weekly Gross: \${gross_pay:.2f}")
print("=" * 35)
\`\`\``,
      practiceCode: `name = "Taylor Smith"
role = "Game Developer"
experience_years = 4
projects_completed = 12

print("*" * 35)
print(f"DEVELOPER ID: {name.upper()}")
print(f"ROLE:         {role}")
print(f"EXPERIENCE:   {experience_years} years")
print(f"PROJECTS:     {projects_completed} shipped")
print("*" * 35)`,
      quizQuestion: "What format specifier displays a float with exactly two decimal places?",
      quizOptions: [
        ":.2f",
        ":2d",
        ":.2s",
        ":float2"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-1-12",
      title: "Lesson 1.12: Phase 1 Review & Challenge",
      phaseId: "phase-1",
      phaseTitle: "Phase 1: Storing Information",
      description: "Comprehensive review of Phase 1 concepts with an interactive self-assessment and challenge.",
      hook: "You have just conquered the foundational grammar of Python! Before stepping into conditional decision-making in Phase 2, let's put your skills through a rapid-fire review challenge to cement your mastery.",
      plainEnglish: "Phase 1 covered how information is stored, typed, converted, and formatted in memory. Mastering these basics guarantees you will never be confused by variable errors.",
      codeExample: `# Phase 1 Grand Review
# 1. Variables and types
title = "Python Mastery"
phase = 1
completion_ratio = 1.0
is_ready_for_phase_2 = True

# 2. String manipulation and f-strings
summary = f"Completed {title} Phase {phase} ({completion_ratio * 100:.0f}%)"
print("=" * len(summary))
print(summary)
print("=" * len(summary))
print("Ready to advance:", is_ready_for_phase_2)`,
      whatJustHappened: [
        "Verified all 4 primitive types in a single concise program.",
        "Dynamically sized the border to match the exact length of the summary string with len()!",
        "Formatted percentage calculation inside the f-string."
      ],
      deeperDive: "Notice line 10: `len(summary)`. By passing the length of the string to `\"=\" * len(summary)`, your border automatically adjusts to whatever text is inside it! No manual counting required.",
      yourTurn: {
        challenge: "Create a summary banner for yourself with your name, lessons completed (12), and a dynamically sized border.",
        starterCode: `name = "Your Name"
lessons = 12
# Create summary and dynamic border:
`,
        solutionCode: `name = "Alex"
lessons = 12
banner = f"Student {name} completed {lessons}/12 Phase 1 Lessons!"
border = "=" * len(banner)
print(border)
print(banner)
print(border)`,
        hints: [
          "Use border = '=' * len(banner)"
        ]
      },
      quickChecks: [
        {
          question: "Which of the following creates a dynamically sized border that matches any message length?",
          options: [
            "\"=\" * len(message)",
            "\"=\" * 50",
            "len(\"=\") * message",
            "message * \"=\""
          ],
          correctIndex: 0,
          explanation: "\"=\" * len(message) repeats the character exactly as many times as the message has characters."
        }
      ],
      commonMistakes: [
        {
          title: "Attempting len() on an integer directly",
          badCode: "count = 12345\nprint(len(count))  # TypeError: object of type 'int' has no len()",
          goodCode: "count = 12345\nprint(len(str(count))) # 5",
          explanation: "Numbers do not have a length! Convert the number to a string first: len(str(count))."
        }
      ],
      seedsForLater: {
        concept: "Phase 2 Preview: Conditional Branching",
        sproutsIn: "Phase 2: Making Decisions",
        teaser: "In Phase 2, your programs will gain a brain! You will learn if, elif, and else to make code take different actions based on conditions."
      },
      recap: [
        "Variables store data in memory using snake_case names.",
        "The 4 primitive types are int, float, str, and bool.",
        "f-strings embed expressions and formatting with effortless elegance."
      ],
      glossaryTerms: ["variable", "data-type", "f-string", "boolean", "integer"],
      concept: `### Phase 1 Review & Challenge

Congratulations on completing **Phase 1: Storing Information**! 

You now possess complete fluency with:
- Declaring and updating variables.
- Working with integers, floats, strings, and Booleans.
- Arithmetic operators, PEMDAS, floor division, and modulo.
- String methods (.upper, .lower, .strip, .replace) and immutability.
- Modern f-strings and formatting specifiers.
- Safe type casting with int(), float(), and str().
- Interactive user input via input().
- Advanced print controls with sep, end, and escape sequences.

Next stop: **Phase 2: Making Decisions (Conditional Controls)**!`,
      practiceCode: `student = "Python Learner"
phase_1_score = 100
status = "READY FOR PHASE 2"

badge = f"*** {student.upper()}: {phase_1_score}% ({status}) ***"
print("*" * len(badge))
print(badge)
print("*" * len(badge))`,
      quizQuestion: "What is the best way to get the number of digits in the integer 98765?",
      quizOptions: [
        "len(str(98765))",
        "len(98765)",
        "digits(98765)",
        "count(98765)"
      ],
      quizAnswerIndex: 0
    }
  ]
};
