import { LessonModule } from "../../types";

export const MRCET_UNIT_2_MODULE: LessonModule = {
  id: "mrcet-unit-2",
  title: "Unit II: Control Flow & Loops (MRCET R17A0554)",
  description: "Conditionals (Boolean values, if, if-else, chained if-elif-else) and iteration (while, for, break, continue, pass, nested loops, sentinel loops).",
  mrcetUnit: "UNIT II",
  lessons: [
    {
      id: "l-mrcet-2-1",
      title: "Unit 2.1: Boolean Values, Operators & Chained Conditionals",
      phaseId: "mrcet-unit-2",
      phaseTitle: "Unit II: Control Flow & Loops (MRCET R17A0554)",
      mrcetUnit: "UNIT II",
      mrcetTopic: "Conditionals: Boolean values and operators, conditional (if), alternative (if-else), chained conditional (if-elif-else)",
      description: "Master truth values, comparison and logical operators (and, or, not), alternative branching (if-else), and chained multi-way decisions (if-elif-else).",
      hook: "Imagine a railway switch track. The train does not visit both destinations at once; the switch flips based on the signal, sending the train down track A OR track B. In programming, conditional branching is how your software makes intelligent decisions.",
      plainEnglish: "Conditionals evaluate Boolean expressions (True or False) to decide which block of code executes. In Python, blocks are defined strictly by indentation (4 spaces).",
      codeExample: `# MRCET Unit II: Conditionals & Decision Making
# 1. Boolean Expressions & Comparison Operators
internal_marks = 24
external_marks = 58
attendance_pct = 78.5

# 2. Alternative Execution (if-else)
if attendance_pct >= 75.0:
    print("Attendance status: Eligible for final semester exams.")
else:
    print("Attendance status: Condonation required (< 75%).")

# 3. Chained Conditional (if-elif-else)
total_marks = internal_marks + external_marks # 82 out of 100

print(f"\\nEvaluating Grade for Total Marks: {total_marks}")
if total_marks >= 85:
    grade = "O (Outstanding)"
elif total_marks >= 75:
    grade = "A+ (Excellent)"
elif total_marks >= 65:
    grade = "A (Very Good)"
elif total_marks >= 50:
    grade = "B (Good)"
else:
    grade = "F (Fail / Reappear)"

print(f"MRCET Result: Grade {grade}")`,
      whatJustHappened: [
        "Evaluated Boolean comparison attendance_pct >= 75.0.",
        "Demonstrated two-way alternative branching with if-else.",
        "Demonstrated multi-way chained conditional with if-elif-else.",
        "Checked conditions sequentially: once total_marks >= 75 matched, remaining elif blocks were skipped."
      ],
      deeperDive: "Python uses short-circuit evaluation for logical operators: in `A and B`, if A is False, B is never evaluated. In `A or B`, if A is True, B is never evaluated. This is often used to prevent division by zero: `if count != 0 and total / count > 50:`.",
      yourTurn: {
        challenge: "Write a chained conditional that checks if a number 'num' is positive (>0), negative (<0), or zero (==0) and prints the result.",
        starterCode: `num = -15
# Write if-elif-else chain:
`,
        solutionCode: `num = -15
if num > 0:
    print("Positive")
elif num < 0:
    print("Negative")
else:
    print("Zero")`,
        hints: ["if num > 0: ... elif num < 0: ... else: ..."]
      },
      quickChecks: [
        {
          question: "In an if-elif-else chain, what happens after the first True condition executes?",
          options: [
            "All remaining elif and else blocks are skipped",
            "All subsequent conditions are still evaluated",
            "Python restarts the script",
            "An error is raised"
          ],
          correctIndex: 0,
          explanation: "In chained conditionals (if-elif-else), only the first matching branch executes; subsequent branches are completely bypassed."
        }
      ],
      commonMistakes: [
        {
          title: "Using assignment operator (=) instead of equality (==)",
          badCode: "if marks = 100: # SyntaxError: invalid syntax",
          goodCode: "if marks == 100: # Double equals for comparison",
          explanation: "In Python, = is for assignment; == is for equality testing."
        }
      ],
      recap: [
        "Booleans have two values: True and False.",
        "Logical operators: and, or, not.",
        "Indentation determines block nesting.",
        "if-elif-else provides multi-way mutual exclusion."
      ],
      glossaryTerms: ["control-flow", "boolean", "syntax"],
      concept: `### Unit 2.1: Conditionals & Boolean Flow

From the MRCET B.Tech Python Programming (R17A0554) Syllabus:

#### 1. Conditional (if)
\`\`\`python
if condition:
    # Executed only if condition is True
\`\`\`

#### 2. Alternative Execution (if-else)
\`\`\`python
if condition:
    # Branch 1
else:
    # Branch 2
\`\`\`

#### 3. Chained Conditionals (if-elif-else)
Sometimes there are more than two possibilities and we need more than two branches.
\`\`\`python
if choice == 'a':
    draw_a()
elif choice == 'b':
    draw_b()
elif choice == 'c':
    draw_c()
else:
    invalid_choice()
\`\`\``,
      practiceCode: `# Logical operators with short-circuiting
score = 88
passed = score >= 50 and score <= 100
print(f"Valid passing score? {passed}")`,
      quizQuestion: "What does the expression (True and False or True) evaluate to in Python?",
      quizOptions: ["True", "False", "None", "Error"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-2-2",
      title: "Unit 2.2: Iteration: While Loops, For Loops & Sentinel Controls",
      phaseId: "mrcet-unit-2",
      phaseTitle: "Unit II: Control Flow & Loops (MRCET R17A0554)",
      mrcetUnit: "UNIT II",
      mrcetTopic: "Iteration: while, for, break, continue",
      description: "Master repetitive execution using while loops (condition-driven), for loops (sequence-driven with range), sentinel values, and loop else clauses.",
      hook: "Imagine you need to compute exam results for 1,200 engineering students. Would you write the same 10 lines of grading code 1,200 times? Loops allow a computer to perform 10,000 repetitive calculations in milliseconds with zero human fatigue!",
      plainEnglish: "Iteration repeated executes a block of code. A 'while' loop runs as long as a condition stays True; a 'for' loop iterates over a finite sequence like range().",
      codeExample: `# MRCET Unit II: Iteration Patterns
# 1. Condition-Controlled while Loop
print("--- 1. While Loop Countdown ---")
count = 5
while count > 0:
    print(f"Countdown: {count}...")
    count -= 1
print("Blastoff!\\n")

# 2. Sequence-Controlled for Loop with range()
# range(start, stop, step)
print("--- 2. For Loop with range(1, 10, 2) ---")
for num in range(1, 10, 2):
    print(f"Odd number: {num}")

# 3. Sentinel Loop Pattern (Official MRCET Lecture Notes)
# Accumulating numbers until a sentinel value (-1) is encountered
sensor_data = [24.5, 25.1, 23.8, 26.2, -1, 99.9]
total = 0.0
readings_count = 0

print("\\n--- 3. Sentinel Loop Processing ---")
for val in sensor_data:
    if val == -1:  # Sentinel value signaling end of stream
        print("Sentinel value (-1) encountered! Halting calculation.")
        break
    total += val
    readings_count += 1

avg = total / readings_count
print(f"Processed {readings_count} readings. Average: {avg:.2f}")`,
      whatJustHappened: [
        "while loop decremented count until the condition count > 0 became False.",
        "for loop iterated through the sequence generated by range(1, 10, 2).",
        "Sentinel value (-1) was detected, triggering 'break' to immediately exit the loop."
      ],
      deeperDive: "In Python, both `for` and `while` loops support an optional `else:` clause! The `else:` block executes when the loop finishes normally (without encountering a `break`). If a `break` statement halts the loop early, the `else:` block is skipped. This is the idiomatic way to implement search loops.",
      yourTurn: {
        challenge: "Use a for loop and range() to calculate the sum of all integers from 1 to 10 inclusive.",
        starterCode: `# Calculate sum of 1..10:
total_sum = 0

print("Sum:", total_sum)
`,
        solutionCode: `total_sum = 0
for i in range(1, 11):
    total_sum += i
print("Sum:", total_sum)`,
        hints: ["for i in range(1, 11): total_sum += i"]
      },
      quickChecks: [
        {
          question: "What does range(2, 8, 2) produce when iterated over?",
          options: [
            "2, 4, 6",
            "2, 4, 6, 8",
            "2, 3, 4, 5, 6, 7, 8",
            "8, 6, 4, 2"
          ],
          correctIndex: 0,
          explanation: "range(start, stop, step) generates numbers starting at 2, stepping by 2, and strictly stopping before 8 (2, 4, 6)."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting to update the loop counter in a while loop",
          badCode: "i = 0\nwhile i < 5:\n    print(i) # Infinite loop! i never changes",
          goodCode: "i = 0\nwhile i < 5:\n    print(i)\n    i += 1 # Increments toward termination",
          explanation: "A while loop must modify state variables toward the termination condition to prevent infinite loops."
        }
      ],
      recap: [
        "while loops repeat while a condition remains True.",
        "for loops iterate over elements of any sequence or iterable.",
        "range(start, stop, step) generates numeric sequences.",
        "Sentinel values allow dynamic loop termination on data signals."
      ],
      glossaryTerms: ["loop", "iteration", "range", "control-flow"],
      concept: `### Unit 2.2: While & For Iterations

According to the MRCET B.Tech Syllabus:

#### 1. The while Statement
\`\`\`python
while condition:
    # statements
    # state update
\`\`\`

#### 2. The for Statement
\`\`\`python
for variable in sequence:
    # statements
\`\`\`

#### 3. Loop Else Clause (Python Idiom)
\`\`\`python
for item in dataset:
    if item == target:
        print("Found target!")
        break
else:
    print("Target was not found in dataset.")
\`\`\``,
      practiceCode: `# Nested loops: Multiplication table
for r in range(1, 4):
    for c in range(1, 4):
        print(f"{r*c:2}", end=" ")
    print()`,
      quizQuestion: "What is the final value of count in: count = 0; for i in range(4): count += 1?",
      quizOptions: ["4", "3", "5", "0"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-2-3",
      title: "Unit 2.3: Loop Jump Controls: break, continue & pass",
      phaseId: "mrcet-unit-2",
      phaseTitle: "Unit II: Control Flow & Loops (MRCET R17A0554)",
      mrcetUnit: "UNIT II",
      mrcetTopic: "Iteration: while, for, break, continue, pass",
      description: "Understand non-linear loop control: 'break' for immediate termination, 'continue' for skipping to the next iteration, and 'pass' as a syntactical placeholder.",
      hook: "Imagine a conveyor belt inspecting circuit boards in an assembly plant. If a board has minor dust, you blow it clean and continue to the next board ('continue'). But if a board catches fire, you pull the emergency brake immediately and shut down the entire line ('break')!",
      plainEnglish: "break halts the loop completely. continue skips the remainder of the current iteration and jumps to the next one. pass does nothing at all (used as a placeholder where code is syntactically required).",
      codeExample: `# MRCET Unit II: Loop Controls (break, continue, pass)
# 1. break: Immediate Loop Termination
print("--- 1. break Demo ---")
for num in [10, 20, 30, -999, 40, 50]:
    if num == -999:
        print(f"Encountered corrupt value {num}! Terminating loop.")
        break
    print(f"Processed: {num}")

# 2. continue: Skip to Next Iteration
print("\\n--- 2. continue Demo (Printing only evens) ---")
for n in range(1, 8):
    if n % 2 != 0:
        continue  # Skip odd numbers!
    print(f"Even number: {n}")

# 3. pass: Syntactic Null Statement
print("\\n--- 3. pass Demo ---")
def upcoming_mrcet_algorithm():
    pass  # Placeholder: valid Python syntax without body implementation

upcoming_mrcet_algorithm()
print("pass statement executed without error.")`,
      whatJustHappened: [
        "break exited the loop immediately when -999 was encountered.",
        "continue skipped the print statement whenever n was odd, immediately jumping to the next iteration.",
        "pass acted as an empty code placeholder, satisfying Python's indentation syntax requirements."
      ],
      deeperDive: "When `break` executes inside a nested loop, it terminates ONLY the innermost loop that directly encloses it. The outer loop continues executing normally. If you need to break out of multiple nested loops simultaneously, either refactor into a function and use `return`, or use a Boolean flag variable.",
      yourTurn: {
        challenge: "Write a for loop from 1 to 10 that uses continue to skip number 5, printing all other numbers.",
        starterCode: `# Loop 1..10 skipping 5:
for i in range(1, 11):
    # Skip 5:
    
    print(i)
`,
        solutionCode: `for i in range(1, 11):
    if i == 5:
        continue
    print(i)`,
        hints: ["if i == 5: continue"]
      },
      quickChecks: [
        {
          question: "What is the purpose of the 'pass' statement in Python?",
          options: [
            "It acts as a placeholder that does nothing, satisfying syntax requirements",
            "It exits the Python interpreter",
            "It skips to the next iteration of a loop",
            "It sends data over the network"
          ],
          correctIndex: 0,
          explanation: "In Python, pass is a null operation. It is used when a statement is required syntactically but no code needs to run."
        }
      ],
      commonMistakes: [
        {
          title: "Confusing continue with break",
          badCode: "for x in data:\n    if is_invalid(x): break # Stops processing ALL remaining items!",
          goodCode: "for x in data:\n    if is_invalid(x): continue # Skips only this invalid item",
          explanation: "break terminates the entire loop; continue skips only the current iteration."
        }
      ],
      recap: [
        "break terminates the nearest enclosing loop immediately.",
        "continue skips the remaining body and advances to the next iteration.",
        "pass is a no-op placeholder for empty blocks.",
        "break causes loop else: blocks to be skipped."
      ],
      glossaryTerms: ["control-flow", "loop", "syntax"],
      concept: `### Unit 2.3: Break, Continue & Pass Summary

| Keyword | Functionality | Effect on Loop Else |
| :--- | :--- | :--- |
| **break** | Exits the innermost loop immediately | **Bypasses** the \`else:\` block |
| **continue** | Skips current iteration to loop test | Evaluates \`else:\` normally if completed |
| **pass** | No operation (NOP) placeholder | No effect on loop flow |

\`\`\`python
# MRCET Exam Pattern: Finding first Prime using break & else
num = 29
for factor in range(2, int(num**0.5) + 1):
    if num % factor == 0:
        print(f"{num} is composite (divisible by {factor})")
        break
else:
    print(f"{num} is PRIME!")
\`\`\``,
      practiceCode: `# Searching for target with break/else
names = ["Alice", "Bob", "Charlie", "Diana"]
search_target = "Charlie"

for idx, name in enumerate(names):
    if name == search_target:
        print(f"Found {search_target} at index {idx}!")
        break
else:
    print(f"{search_target} was not in roster.")`,
      quizQuestion: "What does 'continue' do when encountered inside a while loop?",
      quizOptions: [
        "Jumps directly to the while loop condition check for the next iteration",
        "Terminates the program completely",
        "Breaks out of the loop",
        "Repeats the previous iteration"
      ],
      quizAnswerIndex: 0
    }
  ]
};

export const MRCET_UNIT_3_MODULE: LessonModule = {
  id: "mrcet-unit-3",
  title: "Unit III: Functions, Strings & Arrays (MRCET R17A0554)",
  description: "Fruitful functions, return values, parameters, local and global scope, function composition, recursion, strings (slices, immutability, methods, string module), and Python arrays.",
  mrcetUnit: "UNIT III",
  lessons: [
    {
      id: "l-mrcet-3-1",
      title: "Unit 3.1: Fruitful Functions, Scope & Function Composition",
      phaseId: "mrcet-unit-3",
      phaseTitle: "Unit III: Functions, Strings & Arrays (MRCET R17A0554)",
      mrcetUnit: "UNIT III",
      mrcetTopic: "Fruitful functions: return values, parameters, local and global scope, function composition",
      description: "Learn fruitful functions that calculate and return values, the LEGB scope rules, global variables, and nesting function calls via function composition.",
      hook: "Imagine a factory machine where raw metal goes in, and a precision gear comes out. That is a fruitful function! If a machine just buzzes loudly without producing an output gear, that is a void function. In computer science, fruitful functions form the building blocks of math and science.",
      plainEnglish: "Fruitful functions return values back to the calling code using the 'return' statement. Variables created inside functions are local; variables created outside are global.",
      codeExample: `# MRCET Unit III: Fruitful Functions & Composition
import math

# 1. Fruitful Function: Computes and returns a float
def calculate_distance(x1, y1, x2, y2):
    """Computes Euclidean distance between two points (x1, y1) and (x2, y2)."""
    dx = x2 - x1
    dy = y2 - y1
    return math.sqrt(dx**2 + dy**2)

d = calculate_distance(0, 0, 3, 4)
print(f"Euclidean distance: {d:.2f}")

# 2. Scope Demonstration (Local vs Global)
college_name = "MRCET Autonomous"  # Global Scope

def display_department():
    dept_code = "CSE-554"          # Local Scope
    print(f"Department: {dept_code} at {college_name}")

display_department()

# 3. Function Composition: f(g(x))
def square(n): return n * n
def add_five(n): return n + 5

# Composing: square(add_five(3)) -> square(8) -> 64
composed = square(add_five(3))
print("Composition square(add_five(3)):", composed)`,
      whatJustHappened: [
        "calculate_distance computed and returned 5.0 using the return keyword.",
        "display_department accessed global college_name while keeping dept_code local.",
        "Demonstrated mathematical function composition by nesting function calls."
      ],
      deeperDive: "Allen B. Downey's 'Think Python' (MRCET official textbook) introduces 'dead code'—code appearing after a return statement inside a function block will never be executed. Always ensure return paths cover all conditional branches.",
      yourTurn: {
        challenge: "Write a fruitful function is_even(n) returning True if n % 2 == 0, else False.",
        starterCode: `def is_even(n):
    # return True if even, else False:
    pass

print(is_even(14))
print(is_even(27))
`,
        solutionCode: `def is_even(n):
    return n % 2 == 0

print(is_even(14))
print(is_even(27))`,
        hints: ["return n % 2 == 0"]
      },
      quickChecks: [
        {
          question: "What is 'dead code' in relation to fruitful functions?",
          options: [
            "Code placed after a return statement that can never be reached or executed",
            "Code written in an obsolete language",
            "A deleted file",
            "Code that has syntax errors"
          ],
          correctIndex: 0,
          explanation: "Once a function executes a return statement, the function immediately terminates; any subsequent statements in that block are unreachable dead code."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting the return keyword in a fruitful function",
          badCode: "def add(a, b):\n    ans = a + b # Missing return!\nx = add(2, 3) # x is None",
          goodCode: "def add(a, b):\n    return a + b\nx = add(2, 3) # x is 5",
          explanation: "Without an explicit return statement, Python functions implicitly return None."
        }
      ],
      recap: [
        "Fruitful functions compute and return values.",
        "Local variables exist only during the function's execution frame.",
        "Global variables are accessible throughout the module.",
        "Function composition nests calls: f(g(x))."
      ],
      glossaryTerms: ["function", "return", "scope", "expression"],
      concept: `### Unit 3.1: Fruitful Functions & Scope Architecture

#### Scope Resolution (LEGB Rule)
When a variable reference is evaluated in Python, the interpreter searches four scopes in order:
1. **L**ocal: Inside the active function.
2. **E**nclosing: Any enclosing/nested functions.
3. **G**lobal: Module-level variables.
4. **B**uilt-in: Python's pre-loaded keywords and built-in functions (\`len\`, \`range\`, \`print\`).

\`\`\`python
# Function Composition Example
def circle_area(radius):
    import math
    return math.pi * radius ** 2

# Passing output of one fruitful function as argument to another
formatted_area = round(circle_area(3.5), 3)
\`\`\``,
      practiceCode: `# Scope demonstration with global modifier
counter = 0

def increment():
    global counter
    counter += 1

increment()
increment()
print("Counter after 2 increments:", counter)`,
      quizQuestion: "Which scope is checked FIRST when Python resolves a variable name inside a function?",
      quizOptions: ["Local scope", "Global scope", "Built-in scope", "Enclosing scope"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-3-2",
      title: "Unit 3.2: Recursion: Call Stack, Factorials & Fibonacci",
      phaseId: "mrcet-unit-3",
      phaseTitle: "Unit III: Functions, Strings & Arrays (MRCET R17A0554)",
      mrcetUnit: "UNIT III",
      mrcetTopic: "Recursion, base cases, call stack, recursive problem decomposition",
      description: "Master recursive problem solving: base cases, recursive steps, the call stack mechanism, and classic implementations for Factorials and Fibonacci numbers.",
      hook: "How does Google Maps find the shortest route through 50,000 intersections? It uses recursive path-finding! A function that breaks a large problem into smaller instances of the same problem is one of the most powerful algorithms in computer science.",
      plainEnglish: "Recursion is when a function calls itself. To avoid infinite loops, every recursive function must have a base case that halts the recursion.",
      codeExample: `# MRCET Unit III: Recursion
# 1. Recursive Factorial: n! = n * (n - 1)!
def factorial(n):
    """Compute n! with base case 0! = 1 and 1! = 1."""
    if n <= 1:
        return 1  # Base case
    return n * factorial(n - 1)  # Recursive step

print("5! =", factorial(5))
print("7! =", factorial(7))

# 2. Recursive Fibonacci: fib(n) = fib(n-1) + fib(n-2)
def fibonacci(n):
    """Return the nth Fibonacci number."""
    if n <= 0:
        return 0  # Base case 1
    elif n == 1:
        return 1  # Base case 2
    return fibonacci(n - 1) + fibonacci(n - 2)

# Generate first 8 terms
fib_terms = [fibonacci(i) for i in range(8)]
print("\\nFirst 8 Fibonacci terms:", fib_terms)`,
      whatJustHappened: [
        "factorial(5) pushed frames onto the call stack down to factorial(1).",
        "The base case triggered, returning 1, and the stack unwound calculating 5 * 4 * 3 * 2 * 1 = 120.",
        "fibonacci(n) computed the classic sequence using two recursive branches."
      ],
      deeperDive: "In Python, each function call allocates a new stack frame in memory. If recursion goes too deep without hitting a base case, Python raises `RecursionError: maximum recursion depth exceeded`. The default stack limit can be inspected with `sys.getrecursionlimit()`.",
      yourTurn: {
        challenge: "Write a recursive function sum_digits(n) that computes the sum of the digits of a number (e.g. 123 -> 1 + 2 + 3 = 6).",
        starterCode: `def sum_digits(n):
    # Base case: if n < 10 return n
    # Recursive: return (n % 10) + sum_digits(n // 10)
    pass

print("Sum digits of 456:", sum_digits(456))
`,
        solutionCode: `def sum_digits(n):
    if n < 10:
        return n
    return (n % 10) + sum_digits(n // 10)

print("Sum digits of 456:", sum_digits(456))`,
        hints: ["Use (n % 10) for last digit, and (n // 10) for remaining digits."]
      },
      quickChecks: [
        {
          question: "What essential condition prevents a recursive function from running infinitely?",
          options: [
            "A Base Case that stops further recursive calls",
            "A while loop",
            "An import statement",
            "A global variable"
          ],
          correctIndex: 0,
          explanation: "Every valid recursive function must define a base case condition that terminates the recursive chain."
        }
      ],
      commonMistakes: [
        {
          title: "Omitting the base case in a recursive function",
          badCode: "def countdown(n):\n    print(n)\n    countdown(n - 1) # RecursionError: maximum depth exceeded!",
          goodCode: "def countdown(n):\n    if n <= 0: return\n    print(n)\n    countdown(n - 1)",
          explanation: "Without a base case, recursion continues indefinitely until Python's call stack limit is breached."
        }
      ],
      recap: [
        "Recursion is a function calling itself.",
        "Requires a base case (termination) and a recursive step.",
        "Call stack manages active frames in Last-In-First-Out (LIFO) order."
      ],
      glossaryTerms: ["recursion", "call-stack", "algorithm"],
      concept: `### Unit 3.2: Recursion Anatomy (MRCET Curriculum)

\`\`\`python
# General Recursive Template:
def recursive_function(state):
    # 1. Base Case
    if is_base_case(state):
        return base_result
    
    # 2. Divide and Conquer (Recursive Step)
    sub_problem = reduce_state(state)
    return combine(state, recursive_function(sub_problem))
\`\`\`

#### Call Stack Unwinding for \`factorial(3)\`:
1. \`factorial(3)\` calls \`factorial(2)\`
2. \`factorial(2)\` calls \`factorial(1)\`
3. \`factorial(1)\` hits base case, returns 1
4. \`factorial(2)\` computes \`2 * 1 = 2\`
5. \`factorial(3)\` computes \`3 * 2 = 6\`
`,
      practiceCode: `# Recursive power computation: x^y
def power(x, y):
    if y == 0:
        return 1
    return x * power(x, y - 1)

print("2^6 =", power(2, 6))`,
      quizQuestion: "What is the return value of factorial(0)?",
      quizOptions: ["1", "0", "-1", "Error"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-3-3",
      title: "Unit 3.3: Strings: Slices, Immutability & string Module",
      phaseId: "mrcet-unit-3",
      phaseTitle: "Unit III: Functions, Strings & Arrays (MRCET R17A0554)",
      mrcetUnit: "UNIT III",
      mrcetTopic: "Strings: string slices, immutability, string functions and methods, string module",
      description: "Master string slicing [start:end:step], string immutability in memory, built-in string methods, and standard constants from the string module.",
      hook: "Did you know that whenever you 'change' a string in Python—like converting it to uppercase—Python NEVER changes the original string? It creates an entirely brand-new string in memory! That is because Python strings are permanently immutable.",
      plainEnglish: "Strings are ordered sequences of characters. They cannot be modified in-place. Methods like .upper() or .replace() compute and return new strings.",
      codeExample: `# MRCET Unit III: Strings Mastery
college = "Malla Reddy College of Engineering & Technology"

# 1. String Slices: s[start:stop:step]
print("Slice [0:11]: ", college[0:11])     # 'Malla Reddy'
print("Step by 2:    ", college[0:20:2])    # Every 2nd character
print("Reversed:     ", college[::-1][:15]) # Reversing the sequence

# 2. String Immutability
# college[0] = 'X' <- TypeError: 'str' object does not support item assignment!
new_str = "K" + college[1:5]
print("New string:   ", new_str)

# 3. String Methods
raw = "   mrcet autonomous campus   "
print("Capitalize:   ", raw.strip().capitalize())
print("Title Case:   ", raw.strip().title())
print("Replace:      ", raw.replace("campus", "CSE department").strip())
print("Find 'mrcet': ", raw.find("mrcet"))

# Split and Join
words = raw.strip().split(" ")
print("Split:        ", words)
joined = "-".join(words)
print("Joined:       ", joined)

# 4. Standard string module
import string
print("\\nASCII Letters:", string.ascii_letters[:26])
print("Digits:       ", string.digits)
print("Punctuation:  ", string.punctuation[:10])`,
      whatJustHappened: [
        "Slices extracted sub-strings with start, stop, and step parameters.",
        "Demonstrated string immutability: modifying creates a new string.",
        "Used built-in methods: .strip(), .capitalize(), .title(), .replace(), .split(), .join().",
        "Inspected string module constants: string.ascii_letters and string.digits."
      ],
      deeperDive: "Because strings are immutable, Python uses 'string interning' for small string literals to optimize memory usage: identical string literals often point to the exact same object in RAM (`a is b` evaluates to True).",
      yourTurn: {
        challenge: "Write a function is_palindrome(text) that ignores casing and checks if text reads the same forward and backward.",
        starterCode: `def is_palindrome(text):
    # Check palindrome:
    pass

print(is_palindrome("Racecar"))
print(is_palindrome("Python"))
`,
        solutionCode: `def is_palindrome(text):
    cleaned = text.lower()
    return cleaned == cleaned[::-1]

print(is_palindrome("Racecar"))
print(is_palindrome("Python"))`,
        hints: ["cleaned = text.lower()", "return cleaned == cleaned[::-1]"]
      },
      quickChecks: [
        {
          question: "What happens if you attempt to assign: s = 'python'; s[0] = 'P'?",
          options: [
            "TypeError: 'str' object does not support item assignment",
            "s becomes 'Python'",
            "s is cleared",
            "A warning is logged"
          ],
          correctIndex: 0,
          explanation: "In Python, strings are immutable. You cannot mutate individual characters in-place."
        }
      ],
      commonMistakes: [
        {
          title: "Expecting string methods to mutate strings in-place",
          badCode: "s = 'mrcet'\ns.upper() # Return value discarded!\nprint(s) # Still 'mrcet'",
          goodCode: "s = 'mrcet'\ns = s.upper() # Reassign return value\nprint(s) # 'MRCET'",
          explanation: "String methods do not modify strings in place; they return newly allocated strings."
        }
      ],
      recap: [
        "Strings are immutable sequences.",
        "Slicing syntax: [start:stop:step]; reverse with [::-1].",
        "string module provides ascii_letters, digits, punctuation."
      ],
      glossaryTerms: ["string", "immutable", "slicing"],
      concept: `### Unit 3.3: String Methods Reference Table

| Method | Description |
| :--- | :--- |
| \`s.lower()\` / \`s.upper()\` | Convert casing |
| \`s.strip()\` | Remove leading and trailing whitespace |
| \`s.split(sep)\` | Split string into a list of words |
| \`sep.join(list)\` | Join list elements with separator |
| \`s.replace(old, new)\` | Replace substring occurrences |
| \`s.find(sub)\` | Return lowest index of substring or -1 |
| \`s.count(sub)\` | Count occurrences of substring |
`,
      practiceCode: `# Counting vowels in string
text = "Malla Reddy College"
vowels = "aeiouAEIOU"
count = sum(1 for ch in text if ch in vowels)
print(f"Total vowels in '{text}': {count}")`,
      quizQuestion: "What is the result of 'abcde'[1:4]?",
      quizOptions: ["'bcd'", "'bcde'", "'abc'", "'cde'"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-3-4",
      title: "Unit 3.4: Python Arrays Module, Type Codes & Methods",
      phaseId: "mrcet-unit-3",
      phaseTitle: "Unit III: Functions, Strings & Arrays (MRCET R17A0554)",
      mrcetUnit: "UNIT III",
      mrcetTopic: "Python arrays, Access the Elements of an Array, array methods",
      description: "Understand Python's standard array module: memory efficiency, type codes ('i', 'f', 'd'), element indexing/slicing, and methods (.append, .insert, .pop, .tolist).",
      hook: "Python lists can hold anything: a string, a number, a dinosaur, and an elephant all in one list! But that flexibility comes at a cost: high memory overhead. When engineering applications need to process 10,000,000 numeric readings, Python's 'array' module stores compact, raw C-level bytes.",
      plainEnglish: "An array from Python's 'array' module is a sequence of values that must all be of the identical data type, denoted by a typecode like 'i' for integers or 'd' for doubles.",
      codeExample: `# MRCET Unit III: Python Array Module
import array

# 1. Creating typed arrays: array(typecode, [initializer])
# 'i' = signed integer (2 or 4 bytes)
# 'f' = float (4 bytes)
# 'd' = double precision float (8 bytes)
int_array = array.array('i', [10, 20, 30, 40, 50])
float_array = array.array('d', [1.25, 3.5, 9.75])

print("Integer Array:     ", int_array)
print("Type Code:         ", int_array.typecode)
print("Bytes per item:    ", int_array.itemsize)

# 2. Accessing Elements (Indexing and Slicing)
print("First element:     ", int_array[0])
print("Last element:      ", int_array[-1])
print("Slice [1:4]:       ", int_array[1:4])

# 3. Array Methods
int_array.append(60)            # Append single item
int_array.insert(1, 15)         # Insert 15 at index 1
int_array.extend([70, 80])      # Extend with iterable
popped_item = int_array.pop()   # Remove and return last element
int_array.remove(30)            # Remove value 30
int_array.reverse()             # Reverse in place

print("\\nModified Array:    ", int_array)
print("Popped item:       ", popped_item)
print("Occurrences of 20: ", int_array.count(20))

# Convert to standard Python list
converted_list = int_array.tolist()
print("Converted to list: ", converted_list)`,
      whatJustHappened: [
        "Created an array of typecode 'i' (signed integers).",
        "Demonstrated indexing and slicing operations identical to lists.",
        "Demonstrated array manipulation methods: .append(), .insert(), .extend(), .pop(), .remove(), .reverse().",
        "Converted the array to a standard list using .tolist()."
      ],
      deeperDive: "If you try to append a value that violates the typecode—such as adding a string or float to an integer array ('i')—Python immediately raises `TypeError`. This guarantees memory safety and homogeneous byte representation.",
      yourTurn: {
        challenge: "Create an array of floats ('f') containing [1.1, 2.2, 3.3], append 4.4, and print the resulting array.",
        starterCode: `import array
# Create float array with typecode 'f':
arr = 

# Append 4.4:

print(arr)
`,
        solutionCode: `import array
arr = array.array('f', [1.1, 2.2, 3.3])
arr.append(4.4)
print(arr)`,
        hints: ["Use array.array('f', [1.1, 2.2, 3.3])", "arr.append(4.4)"]
      },
      quickChecks: [
        {
          question: "Which typecode represents double-precision floating-point numbers in the array module?",
          options: ["'d'", "'i'", "'f'", "'b'"],
          correctIndex: 0,
          explanation: "In Python's array module, 'd' specifies double precision float (8 bytes), while 'f' specifies single precision float (4 bytes)."
        }
      ],
      commonMistakes: [
        {
          title: "Appending an incompatible type to a typed array",
          badCode: "import array\narr = array.array('i', [1, 2])\narr.append('MRCET') # TypeError: an integer is required",
          goodCode: "arr.append(3) # Matches the 'i' typecode",
          explanation: "Arrays require all elements to strictly match the specified typecode."
        }
      ],
      recap: [
        "The array module provides homogeneous, compact numeric sequences.",
        "Type codes ('i', 'f', 'd', 'b') enforce data types in memory.",
        "Provides methods: .append(), .insert(), .pop(), .remove(), .tolist()."
      ],
      glossaryTerms: ["array", "sequence", "memory"],
      concept: `### Unit 3.4: Python Array Typecodes Reference

| Typecode | C Type | Python Type | Typical Size |
| :--- | :--- | :--- | :--- |
| \`'b'\` | signed char | int | 1 byte |
| \`'B'\` | unsigned char | int | 1 byte |
| \`'u'\` | Py_UNICODE | Unicode character | 2 or 4 bytes |
| \`'h'\` | signed short | int | 2 bytes |
| \`'H'\` | unsigned short | int | 2 bytes |
| \`'i'\` | signed int | int | 2 or 4 bytes |
| \`'I'\` | unsigned int | int | 2 or 4 bytes |
| \`'l'\` | signed long | int | 4 or 8 bytes |
| \`'L'\` | unsigned long | int | 4 or 8 bytes |
| \`'f'\` | float | float | 4 bytes |
| \`'d'\` | double | float | 8 bytes |
`,
      practiceCode: `# Array buffer information
import array
arr = array.array('i', [100, 200, 300])
address, length = arr.buffer_info()
print(f"Memory Address: {hex(address)} | Number of elements: {length}")`,
      quizQuestion: "What is the primary architectural benefit of an array.array over a standard Python list?",
      quizOptions: [
        "Memory compactness and homogeneous C-level byte representation",
        "Arrays can store heterogeneous objects like dictionaries and functions",
        "Arrays never run out of memory",
        "Arrays are only for strings"
      ],
      quizAnswerIndex: 0
    }
  ]
};
