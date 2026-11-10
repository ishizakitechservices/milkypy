import { LessonModule } from "../../types";

export const MRCET_UNIT_1_MODULE: LessonModule = {
  id: "mrcet-unit-1",
  title: "Unit I: Data, Expressions & Statements (MRCET R17A0554)",
  description: "Introduction to Python, PVM, data types (int, float, bool, str, list), variables, multiple assignments, operator precedence, execution flow, parameters and arguments.",
  mrcetUnit: "UNIT I",
  lessons: [
    {
      id: "l-mrcet-1-1",
      title: "Unit 1.1: Python Architecture, PVM & Script vs. Interactive Mode",
      phaseId: "mrcet-unit-1",
      phaseTitle: "Unit I: Data, Expressions & Statements (MRCET R17A0554)",
      mrcetUnit: "UNIT I",
      mrcetTopic: "Introduction to Python and installation, interactive vs script mode",
      description: "Understand Python's execution architecture: compiler to bytecode (.pyc), the Python Virtual Machine (PVM), and running code via Interactive REPL vs. Script mode.",
      hook: "Unlike pure C/C++ which compiles directly into machine-dependent machine code, or pure interpreters that read source text line-by-line, Python is a hybrid! Python compiles your source code into portable Bytecode (.pyc) and feeds it to the Python Virtual Machine (PVM).",
      plainEnglish: "Python offers two primary execution modes: 1) Interactive Mode (REPL '>>>') where code evaluates line-by-line immediately, and 2) Script Mode where instructions are saved in a .py file and run from top to bottom.",
      codeExample: `# MRCET Unit I: Python Execution Architecture
import sys
import platform

print("=== MRCET B.Tech Python Runtime Information ===")
print("Python Implementation:", platform.python_implementation())  # CPython
print("Python Version:       ", platform.python_version())
print("Operating Platform:   ", sys.platform)
print("Bytecode Order:       ", sys.byteorder)

# Script Mode demonstration: Sequential execution
script_name = "demo_script.py"
print(f"\\nExecuting in Script Mode from: {script_name}")
print("1. Source Code (.py) -> 2. Compiler -> 3. Bytecode (.pyc) -> 4. PVM Engine")`,
      whatJustHappened: [
        "platform.python_implementation() identified the CPython reference interpreter.",
        "CPython compiles Python code (.py) into Bytecode instructions (.pyc).",
        "The Python Virtual Machine (PVM) executes the bytecode instructions within memory.",
        "Script Mode executes all statements sequentially from top to bottom."
      ],
      deeperDive: "In interactive mode (terminal prompt `>>>`), expressions are evaluated immediately and printed without needing `print()`. In script mode, only explicit `print()` calls produce visible output. The PVM translates bytecode into native OS CPU instructions on the fly.",
      yourTurn: {
        challenge: "Print the current Python version and sys.platform using the sys module.",
        starterCode: `import sys
# Print platform and version info:
`,
        solutionCode: `import sys
print("Platform:", sys.platform)
print("Version info:", sys.version_info.major, sys.version_info.minor)`,
        hints: ["Use sys.platform and sys.version_info"]
      },
      quickChecks: [
        {
          question: "What intermediate format does the CPython compiler produce before execution by the PVM?",
          options: [
            "Bytecode (.pyc)",
            "x86 Machine Code (.exe)",
            "Assembly Language (.asm)",
            "Raw HTML"
          ],
          correctIndex: 0,
          explanation: "Python source code is compiled into platform-independent Bytecode (.pyc files) which the PVM then executes."
        }
      ],
      commonMistakes: [
        {
          title: "Expecting expressions to print automatically in Script Mode",
          badCode: "x = 10\nx * 2  # In a script, this evaluates silently and displays nothing!",
          goodCode: "x = 10\nprint(x * 2) # Explicit print required in script files",
          explanation: "Unlike the interactive REPL which automatically displays expression values, scripts require print()."
        }
      ],
      recap: [
        "CPython compiles .py source code into bytecode (.pyc).",
        "The Python Virtual Machine (PVM) is the runtime engine that executes bytecode.",
        "Interactive mode is ideal for quick testing; Script mode is used for complete applications."
      ],
      glossaryTerms: ["syntax", "core", "program"],
      concept: `### Unit I: Python Architecture & Execution Modes

According to the MRCET B.Tech Python Programming (R17A0554) lecture notes:

#### 1. Interactive Mode vs Script Mode
* **Interactive Mode**: Invoked by running \`python\` in terminal without arguments. Displays the primary prompt \`>>>\`. Best for rapid prototyping and debugging snippets.
* **Script Mode**: Source code is saved with the \`.py\` extension and invoked as \`python scriptname.py\`. Code executes from top to bottom.

#### 2. Python Virtual Machine (PVM)
Python is an interpreted, high-level, dynamically typed language.
1. **Source code (\`.py\`)** is compiled into **Bytecode (\`.pyc\`)**.
2. **Bytecode** is loaded into the **Python Virtual Machine (PVM)**.
3. The PVM is a software loop that reads bytecode instructions and translates them to native machine code for the host CPU.

\`\`\`python
# Example: Verification of Bytecode Compilation
import dis
def compute(x, y):
    return x + y * 2

dis.dis(compute)
\`\`\``,
      practiceCode: `# Inspecting execution modes
print("Interactive vs Script Mode in MRCET Curriculum")
a = 15
b = 25
total = a + b
print(f"Calculated sum of {a} and {b} is: {total}")`,
      quizQuestion: "What software component directly executes Python bytecode?",
      quizOptions: [
        "Python Virtual Machine (PVM)",
        "GCC Compiler",
        "Web Browser",
        "Linux Kernel directly"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-1-2",
      title: "Unit 1.2: Core Data Types & Multiple Variable Assignments",
      phaseId: "mrcet-unit-1",
      phaseTitle: "Unit I: Data, Expressions & Statements (MRCET R17A0554)",
      mrcetUnit: "UNIT I",
      mrcetTopic: "Data types: Int, float, Boolean, string, and list; variables, multiple assignments",
      description: "Explore Python's fundamental data types, dynamic typing, multiple assignments (a = b = c = 1, a, b = 1, 2), and type verification via type().",
      hook: "In C or Java, you must write 'int score = 100;' and you can never store text into that variable. Python is dynamically typed: variables are merely reference tags attached to objects in memory, allowing elegant multiple assignments in a single line!",
      plainEnglish: "Python has five primary scalar and container data types tested in Unit I: int, float, bool, str, and list. Variables hold references to objects.",
      codeExample: `# MRCET Unit I: Data Types and Variable Assignments
# 1. Fundamental Types
roll_number = 501          # int
gpa = 8.65                 # float
is_enrolled = True         # bool
college = "MRCET Hyderabad"# str
courses = ["Python", "OS"] # list

print("Types in Memory:")
print("roll_number:", type(roll_number))
print("gpa:        ", type(gpa))
print("is_enrolled:", type(is_enrolled))
print("college:    ", type(college))
print("courses:    ", type(courses))

# 2. Multiple Assignments (Official MRCET Lecture Notes Syntax)
# Chained Assignment: Multiple variables assigned to the same value
a = b = c = 100
print(f"\\nChained assignment: a={a}, b={b}, c={c}")

# Unpacking Assignment: Multiple variables assigned to distinct values
x, y, z = 1, 2.5, "MRCET"
print(f"Simultaneous assignment: x={x}, y={y}, z={z}")`,
      whatJustHappened: [
        "type() inspected the internal class type of each variable.",
        "a = b = c = 100 bound three distinct labels to the exact same integer object 100.",
        "x, y, z = 1, 2.5, 'MRCET' unpacked multiple expressions into variables simultaneously."
      ],
      deeperDive: "In Python, variables do not have types; values have types! A variable is merely an entry in the local namespace pointing to a heap-allocated PyObject. Python handles garbage collection automatically using reference counting and a cyclic garbage collector.",
      yourTurn: {
        challenge: "Use simultaneous assignment to assign name='Rohan', semester=6, and cgpa=8.9 in one line.",
        starterCode: `# Simultaneous assignment:
name, semester, cgpa = 

print(name, semester, cgpa)
`,
        solutionCode: `name, semester, cgpa = "Rohan", 6, 8.9
print(name, semester, cgpa)`,
        hints: ["name, semester, cgpa = 'Rohan', 6, 8.9"]
      },
      quickChecks: [
        {
          question: "What is the result of executing: a = b = 50; a += 10; print(b)?",
          options: [
            "50",
            "60",
            "None",
            "Error"
          ],
          correctIndex: 0,
          explanation: "Integers are immutable. a += 10 creates a new integer object 60 and points 'a' to it, leaving 'b' pointing to 50."
        }
      ],
      commonMistakes: [
        {
          title: "Mismatched values count in multiple assignment",
          badCode: "a, b = 1, 2, 3 # ValueError: too many values to unpack",
          goodCode: "a, b, c = 1, 2, 3 # Equal count on both sides",
          explanation: "The number of variable targets on the left must match the number of expressions on the right."
        }
      ],
      recap: [
        "Core types: int, float, bool, str, list.",
        "Dynamic typing means variables take the type of whatever value is assigned.",
        "a = b = c = 1 assigns one value to multiple names.",
        "a, b = 1, 2 assigns multiple values simultaneously."
      ],
      glossaryTerms: ["data-type", "variable", "mutable", "immutable"],
      concept: `### Unit 1.2: Core Data Types & Assignment Semantics

MRCET B.Tech Section 1 requires fluency with the core data types:

| Data Type | Example | Description | Mutability |
| :--- | :--- | :--- | :--- |
| **int** | \`42\`, \`-7\` | Arbitrary precision integers | Immutable |
| **float** | \`3.14159\`, \`1e-4\` | IEEE 754 floating point numbers | Immutable |
| **bool** | \`True\`, \`False\` | Boolean truth values (subclass of int) | Immutable |
| **str** | \`"MRCET"\` | Unicode text sequences | Immutable |
| **list** | \`[1, "two", 3.0]\` | Heterogeneous ordered sequences | Mutable |

\`\`\`python
# Multiple Assignment Idioms
p = q = r = 0               # Initializing multiple counters
reg_no, branch = "19A554", "CSE" # Parallel unpacking
\`\`\``,
      practiceCode: `# Dynamic retyping demonstration
val = 100
print("Initial type:", type(val))
val = "Now I am a string"
print("Updated type:", type(val))`,
      quizQuestion: "Which of the following data types in Python is MUTABLE?",
      quizOptions: ["list", "int", "str", "bool"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-1-3",
      title: "Unit 1.3: Expressions, Statements & Operator Precedence",
      phaseId: "mrcet-unit-1",
      phaseTitle: "Unit I: Data, Expressions & Statements (MRCET R17A0554)",
      mrcetUnit: "UNIT I",
      mrcetTopic: "Expressions, statements, precedence of operators, comments",
      description: "Master the distinction between expressions and statements, arithmetic and logical operators, and the official operator precedence hierarchy.",
      hook: "What does 5 + 3 * 2 equal? Is it 16 or 11? In math and programming, rules of operator precedence guarantee that every computer on Earth computes the exact same answer (11)! Understanding precedence saves you from critical calculation bugs.",
      plainEnglish: "An expression evaluates to a value (e.g. 5 * 2). A statement performs an action (e.g. assignment or print). When multiple operators occur, Python evaluates them based on Operator Precedence.",
      codeExample: `# MRCET Unit I: Operator Precedence & Evaluation
# Precedence Order:
# 1. Parentheses: ()
# 2. Exponentiation: ** (Right-to-Left associative!)
# 3. Multiplication/Division/Modulus: *, /, //, %
# 4. Addition/Subtraction: +, -
# 5. Comparison: <, <=, >, >=, ==, !=
# 6. Logical NOT, AND, OR

calc1 = 10 + 2 * 3 ** 2
# Step 1: 3 ** 2 = 9
# Step 2: 2 * 9 = 18
# Step 3: 10 + 18 = 28
print("10 + 2 * 3 ** 2 =", calc1)

# Right-to-Left associativity for Exponentiation:
calc2 = 2 ** 3 ** 2  # Evaluates as 2 ** (3 ** 2) = 2 ** 9 = 512, NOT (2 ** 3) ** 2 = 64!
print("2 ** 3 ** 2     =", calc2)

# Floor division and modulus
dividend = 27
divisor = 4
quotient = dividend // divisor # 6
remainder = dividend % divisor  # 3
print(f"{dividend} // {divisor} = {quotient}")
print(f"{dividend} % {divisor}  = {remainder}")`,
      whatJustHappened: [
        "Exponentiation (**) took highest priority over multiplication (*) and addition (+).",
        "Demonstrated right-to-left associativity of exponentiation (2 ** 3 ** 2 = 512).",
        "Demonstrated integer floor division (//) and modulus remainder (%)."
      ],
      deeperDive: "An expression evaluates to a single value and can be placed on the right-hand side of an assignment. A statement represents a complete command or instruction (e.g., `if`, `while`, `def`, `import`). You cannot use a statement where an expression is expected (e.g., `print(x = 5)` raises a SyntaxError).",
      yourTurn: {
        challenge: "Calculate the expression (15 + 5) * 2 ** 3 // 4 and print the result.",
        starterCode: `# Compute expression:
result = 
print("Result:", result)
`,
        solutionCode: `result = (15 + 5) * 2 ** 3 // 4
print("Result:", result)`,
        hints: ["(15 + 5) = 20, 2**3 = 8, 20 * 8 = 160, 160 // 4 = 40"]
      },
      quickChecks: [
        {
          question: "How does Python evaluate 2 ** 1 ** 3?",
          options: [
            "2 (because 1 ** 3 is 1, and 2 ** 1 is 2)",
            "8",
            "6",
            "1"
          ],
          correctIndex: 0,
          explanation: "Exponentiation is right-to-left associative: 1 ** 3 evaluates first to 1, then 2 ** 1 evaluates to 2."
        }
      ],
      commonMistakes: [
        {
          title: "Confusing single slash (/) with double slash (//)",
          badCode: "val = 10 / 2 # val is float 5.0!",
          goodCode: "val = 10 // 2 # val is integer 5",
          explanation: "Single slash (/) always returns a float in Python 3; double slash (//) performs integer floor division."
        }
      ],
      recap: [
        "Parentheses () always override standard precedence.",
        "Exponentiation (**) is right-associative (right to left).",
        "/ produces floats; // produces integer floor quotients.",
        "% computes the division remainder."
      ],
      glossaryTerms: ["expression", "syntax", "core"],
      concept: `### Unit 1.3: Operator Precedence Table (MRCET Lecture Notes)

| Operator | Description | Associativity |
| :--- | :--- | :--- |
| \`()\` | Parentheses (grouping) | Left to right |
| \`**\` | Exponentiation (power) | **Right to left** |
| \`+x\`, \`-x\`, \`~x\` | Unary plus, minus, bitwise NOT | Right to left |
| \`*\`, \`/\`, \`//\`, \`%\` | Multiplication, division, floor, modulo | Left to right |
| \`+\`, \`-\` | Addition, subtraction | Left to right |
| \`<<\`, \`>>\` | Bitwise shifts | Left to right |
| \`&\`, \`^\`, \`|\` | Bitwise AND, XOR, OR | Left to right |
| \`==\`, \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\`, \`is\`, \`in\` | Comparisons & identity | Left to right |
| \`not\` | Logical NOT | Right to left |
| \`and\` | Logical AND | Left to right |
| \`or\` | Logical OR | Left to right |

\`\`\`python
# Rule of Thumb: Always use parentheses for clarity
clean_calc = (a + b) * (c - d)
\`\`\``,
      practiceCode: `# Precedence evaluation
val1 = 4 + 5 * 2
val2 = (4 + 5) * 2
print(f"Without parentheses: {val1}")
print(f"With parentheses:    {val2}")`,
      quizQuestion: "What is the value of 3 + 4 * 2?",
      quizOptions: ["11", "14", "24", "10"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-1-4",
      title: "Unit 1.4: Modules, Functions & Flow of Execution",
      phaseId: "mrcet-unit-1",
      phaseTitle: "Unit I: Data, Expressions & Statements (MRCET R17A0554)",
      mrcetUnit: "UNIT I",
      mrcetTopic: "Modules, functions--- function and its use, flow of execution, parameters and arguments",
      description: "Understand importing standard modules (math, sys), defining reusable functions, the step-by-step Flow of Execution, and passing parameters and arguments.",
      hook: "Imagine reading a mystery novel. You read line 1, then line 2, but on line 3 the detective travels across town (a function call), solves a riddle, and returns back to where he started before continuing to line 4! That is exactly how Python's Flow of Execution navigates functions.",
      plainEnglish: "Flow of execution is the order statements run: top to bottom, jumping into a function when invoked, and returning to the exact line after the call when finished.",
      codeExample: `# MRCET Unit I: Flow of Execution & Functions
import math

print("Step 1: Program starts at line 4.")

def calculate_circle_metrics(radius):
    """Calculates circumference and area of a circle."""
    print("  -> Step 3: Inside function calculate_circle_metrics()")
    circumference = 2 * math.pi * radius
    area = math.pi * (radius ** 2)
    return circumference, area

print("Step 2: Function defined in memory. Now calling it...")
circ, ar = calculate_circle_metrics(5.0)

print("Step 4: Back in main flow. Printing results:")
print(f"Radius: 5.0 | Circumference: {circ:.2f} | Area: {ar:.2f}")
print("Step 5: Program execution completes.")`,
      whatJustHappened: [
        "Imported math module to access math.pi.",
        "Step 1 ran at the global level.",
        "Step 2 prepared the function call, causing the execution pointer to jump inside calculate_circle_metrics().",
        "Step 3 executed inside the function frame, then return jumped back to Step 4."
      ],
      deeperDive: "Parameters are the variable names in the function header (radius). Arguments are the values passed during invocation (5.0). Python evaluates arguments before passing them into the function. If an error occurs inside a function, the traceback lists every stack frame in the execution flow.",
      yourTurn: {
        challenge: "Write a function hypotenuse(a, b) using math.sqrt(a**2 + b**2) and print hypotenuse(3, 4).",
        starterCode: `import math
def hypotenuse(a, b):
    # Calculate and return hypotenuse:
    pass

print("Hypotenuse:", hypotenuse(3, 4))
`,
        solutionCode: `import math
def hypotenuse(a, b):
    return math.sqrt(a**2 + b**2)

print("Hypotenuse:", hypotenuse(3, 4))`,
        hints: ["Use math.sqrt(a**2 + b**2)"]
      },
      quickChecks: [
        {
          question: "When Python encounters a 'def' statement, what does it do immediately?",
          options: [
            "It creates the function object in memory without executing the lines inside",
            "It immediately runs all the code inside the function",
            "It prints the function to the console",
            "It compiles the function to C"
          ],
          correctIndex: 0,
          explanation: "A 'def' statement defines the function and registers its name in the namespace; execution only occurs when invoked."
        }
      ],
      commonMistakes: [
        {
          title: "Calling a function before its def statement",
          badCode: "greet() # NameError: name 'greet' is not defined\\ndef greet(): print('Hi')",
          goodCode: "def greet(): print('Hi')\\ngreet() # Defined first, then called",
          explanation: "In Python scripts, functions must be defined before they are called because execution is top-to-bottom."
        }
      ],
      recap: [
        "import loads pre-written library modules.",
        "Execution flows sequentially until a function call jumps to the function body.",
        "return hands the result back and resumes execution at the call site.",
        "Parameters define inputs; arguments provide concrete values."
      ],
      glossaryTerms: ["function", "parameter", "argument", "scope"],
      concept: `### Unit 1.4: Flow of Execution in Functions

According to the MRCET B.Tech Syllabus:
1. **Flow of Execution**: Statements are executed one after another in order from the top of the script. Function definitions create new functions, but code inside the body is skipped until the function is invoked.
2. **Parameters vs Arguments**:
   * **Parameter**: Variable in the function signature: \`def func(param):\`
   * **Argument**: Value supplied in the call: \`func(argument)\`
3. **Fruitful Functions vs Void**: Functions with a \`return\` statement are fruitful; functions without a \`return\` return \`None\` implicitly.

\`\`\`python
# Execution Tracing
def f1():
    print("In f1")

def f2():
    print("In f2 start")
    f1()
    print("In f2 end")

f2()
# Output order: In f2 start -> In f1 -> In f2 end
\`\`\``,
      practiceCode: `# Tracing call flow
def square(n):
    return n * n

def sum_of_squares(x, y):
    return square(x) + square(y)

print("Sum of squares 3 and 4:", sum_of_squares(3, 4))`,
      quizQuestion: "What is the return value of a function that does not contain a return statement?",
      quizOptions: ["None", "0", "False", "Empty string"],
      quizAnswerIndex: 0
    }
  ]
};

export { MRCET_UNIT_2_MODULE, MRCET_UNIT_3_MODULE } from "./mrcetUnitsPart2";
export { MRCET_UNIT_4_MODULE, MRCET_UNIT_5_MODULE } from "./mrcetUnitsPart3";
import { MRCET_UNIT_2_MODULE, MRCET_UNIT_3_MODULE } from "./mrcetUnitsPart2";
import { MRCET_UNIT_4_MODULE, MRCET_UNIT_5_MODULE } from "./mrcetUnitsPart3";

export const MRCET_ALL_UNITS: LessonModule[] = [
  MRCET_UNIT_1_MODULE,
  MRCET_UNIT_2_MODULE,
  MRCET_UNIT_3_MODULE,
  MRCET_UNIT_4_MODULE,
  MRCET_UNIT_5_MODULE,
];

