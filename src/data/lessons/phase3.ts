import { LessonModule } from "../../types";

export const PHASE_3_MODULE: LessonModule = {
  id: "phase-3",
  title: "Phase 3: Repeating Things",
  description: "While loops, loop controls (break, continue), list foundations, for loops, and accumulator patterns.",
  lessons: [
    {
      id: "l-3-1",
      title: "Lesson 3.1: While Loops and Loop Control",
      phaseId: "phase-3",
      phaseTitle: "Phase 3: Repeating Things",
      description: "Automate repetitive tasks with while loops, indefinite iteration, and infinite loop prevention.",
      hook: "Imagine you are washing dishes. You don't say: 'Wash dish 1. Wash dish 2. Wash dish 3.' You say: 'While there are still dishes in the sink, keep washing.' When the sink is empty, you stop. That is a while loop.",
      plainEnglish: "A while loop repeatedly executes an indented block of code as long as its condition remains True. The moment the condition becomes False, the loop stops.",
      codeExample: `# The while Loop in Action
countdown = 5

print("Starting launch countdown...")

while countdown > 0:
    print("T-minus:", countdown)
    countdown = countdown - 1  # Crucial: update loop variable!

print("Liftoff! All engines burning.")`,
      whatJustHappened: [
        "Line 2: countdown starts at 5.",
        "Line 6: 5 > 0 is True, so prints 'T-minus: 5', then decrements countdown to 4.",
        "Repeats for 4, 3, 2, 1.",
        "When countdown becomes 0: 0 > 0 is False! Python exits the loop.",
        "Line 9: Prints 'Liftoff!'."
      ],
      deeperDive: "THE DANGER OF INFINITE LOOPS: If you forget line 7 (`countdown = countdown - 1`), countdown stays 5 forever. 5 > 0 is always True, and the program runs forever until your computer runs out of memory! Always ensure your loop has progress toward its stopping condition.",
      yourTurn: {
        challenge: "Write a while loop that starts at count = 1 and prints numbers up to 4, then stops.",
        starterCode: `count = 1
# Write your while loop below:
`,
        solutionCode: `count = 1
while count <= 4:
    print("Number:", count)
    count += 1`,
        hints: [
          "Use while count <= 4:",
          "Don't forget count += 1 inside the loop!"
        ]
      },
      quickChecks: [
        {
          question: "What causes an infinite loop?",
          options: [
            "A loop condition that never becomes False",
            "Printing too many words",
            "Dividing by two",
            "Using numbers greater than 1000"
          ],
          correctIndex: 0,
          explanation: "An infinite loop occurs when the loop condition always remains True and never reaches an exit state."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting to update the loop counter",
          badCode: "i = 1\nwhile i <= 5:\n    print(i) # Never increments i! Infinite loop!",
          goodCode: "i = 1\nwhile i <= 5:\n    print(i)\n    i += 1",
          explanation: "Always make sure variables in the condition are modified inside the loop body."
        }
      ],
      seedsForLater: {
        concept: "break and continue",
        sproutsIn: "Phase 3: Lesson 3.2 (The Next Lesson!)",
        teaser: "Need to stop a loop immediately from the inside? In Lesson 3.2, you will learn the 'break' statement!"
      },
      recap: [
        "while condition: repeats as long as condition evaluates to True.",
        "Always update the loop variable to prevent infinite loops.",
        "Use count += 1 as shorthand for count = count + 1."
      ],
      glossaryTerms: ["loop", "infinite-loop", "iteration", "boolean"],
      concept: `### While Loops and Loop Control

Computers excel at doing repetitive tasks thousands of times without getting tired or making accidental mistakes. The **while loop** is Python's primary tool for indefinite repetition.

---

#### 1. Syntax of while
\`\`\`python
while condition:
    # Executes repeatedly until condition becomes False
    do_work()
    update_progress()
\`\`\`

---

#### 2. The Loop Variable
Every while loop generally relies on:
1. **Initialization**: Set initial variable value before loop (\`x = 0\`).
2. **Condition**: Check if loop should continue (\`x < 5\`).
3. **Update**: Change the variable inside the loop (\`x += 1\`).`,
      practiceCode: `battery = 100
discharge_rate = 25

while battery > 0:
    print(f"Battery level: {battery}% (Operational)")
    battery -= discharge_rate

print("Battery depleted. System shut down.")`,
      quizQuestion: "How many times does this loop run: x = 0; while x < 3: x += 1?",
      quizOptions: [
        "3 times (x goes 0 -> 1 -> 2 -> 3)",
        "0 times",
        "4 times",
        "Infinite times"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-3-2",
      title: "Lesson 3.2: Loop Controls: break and continue",
      phaseId: "phase-3",
      phaseTitle: "Phase 3: Repeating Things",
      description: "Fine-tune loop behavior using break to exit early and continue to skip to the next iteration.",
      hook: "Imagine reading through a stack of job resumes. If you find the perfect candidate on resume #4, do you keep reading all 100? No! You stop immediately (break). If resume #2 is completely blank, you skip it and move straight to resume #3 (continue).",
      plainEnglish: "The break statement terminates a loop immediately. The continue statement skips the rest of the current iteration and jumps straight to the next cycle.",
      codeExample: `# Demonstrating break and continue
print("=== DEMONSTRATING BREAK ===")
num = 1
while num <= 10:
    if num == 4:
        print("Hit emergency stop at:", num)
        break  # Exits the loop right now!
    print("Processing:", num)
    num += 1

print("\\n=== DEMONSTRATING CONTINUE ===")
val = 0
while val < 5:
    val += 1
    if val == 3:
        print("Skipping 3!")
        continue  # Skips print below, restarts at top of loop
    print("Value:", val)`,
      whatJustHappened: [
        "When num hit 4, break stopped the loop cold. Numbers 5 through 10 never ran.",
        "When val hit 3, continue skipped 'Value: 3' and jumped to val = 4.",
        "Loop control statements give you precision power inside repetition."
      ],
      deeperDive: "A common professional pattern is `while True:` combined with an internal `if ...: break`. This creates clean interactive menus that run until the user explicitly chooses 'quit'.",
      yourTurn: {
        challenge: "Write a loop from 1 to 6 that skips number 2 using continue and stops at 5 using break.",
        starterCode: `n = 0
while n < 10:
    n += 1
    # Add continue for n == 2:
    # Add break for n == 5:
    print("Running:", n)
`,
        solutionCode: `n = 0
while n < 10:
    n += 1
    if n == 2:
        continue
    if n == 5:
        break
    print("Running:", n)`,
        hints: [
          "Check if n == 2 before printing.",
          "Check if n == 5 to break."
        ]
      },
      quickChecks: [
        {
          question: "What does the break statement do when executed inside a loop?",
          options: [
            "Exits the loop immediately and jumps to code following the loop",
            "Pauses the computer for 5 seconds",
            "Skips to the next cycle of the loop",
            "Deletes the loop variable"
          ],
          correctIndex: 0,
          explanation: "break terminates loop execution entirely and hands control to the line following the loop block."
        }
      ],
      commonMistakes: [
        {
          title: "Putting continue before updating loop counter in while loop",
          badCode: "i = 0\nwhile i < 5:\n    if i == 2: continue # i is still 2! Infinite loop!\n    i += 1",
          goodCode: "i = 0\nwhile i < 5:\n    i += 1\n    if i == 2: continue",
          explanation: "If you call continue before incrementing your counter, your loop gets stuck at that number forever."
        }
      ],
      seedsForLater: {
        concept: "List Search Algorithms",
        sproutsIn: "Phase 8: Search & Computer Science Algorithms",
        teaser: "In Phase 8, you will use break in linear search algorithms the exact moment a target value is found!"
      },
      recap: [
        "break immediately halts and exits the loop.",
        "continue skips the remainder of the current cycle and starts the next.",
        "Use while True with an internal break to build interactive menu prompts."
      ],
      glossaryTerms: ["loop", "iteration", "keyword"],
      concept: `### Loop Controls: break and continue

Normally, loops run until their test condition is met. But real-world logic often requires interrupting a loop early or skipping specific items.

---

#### 1. break: The Emergency Exit
\`\`\`python
target = 7
count = 1

while True:
    if count == target:
        print(f"Target {target} located! Terminating search.")
        break
    count += 1
\`\`\`

---

#### 2. continue: The Next-Lap Skip
\`\`\`python
# Skip even numbers
n = 0
while n < 6:
    n += 1
    if n % 2 == 0:
        continue  # skip the print below
    print("Odd number:", n)
\`\`\``,
      practiceCode: `attempt = 1
max_attempts = 5
secret_pin = 4321

while attempt <= max_attempts:
    simulated_input = 4321 if attempt == 3 else 1111
    if simulated_input == secret_pin:
        print(f"Success on attempt {attempt}! Access granted.")
        break
    print(f"Attempt {attempt} failed.")
    attempt += 1`,
      quizQuestion: "What is printed by: for i in [1, 2, 3]: if i == 2: break; print(i)?",
      quizOptions: [
        "1",
        "1 and 2",
        "1 and 3",
        "Nothing"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-3-3",
      title: "Lesson 3.3: Introduction to Lists",
      phaseId: "phase-3",
      phaseTitle: "Phase 3: Repeating Things",
      description: "Sequential collections: list creation with square brackets, zero-indexing, .append(), and len().",
      hook: "What if you needed to track the names of all 30 students in a classroom? Creating 30 separate variables: student1, student2, student3... would be a nightmare! A list lets you store all 30 students neatly inside a single variable.",
      plainEnglish: "A list is an ordered, mutable collection of items enclosed in square brackets [ ] separated by commas. You can read items using their index numbers starting at 0.",
      codeExample: `# Working with Lists
planets = ["Mercury", "Venus", "Earth", "Mars"]

print("Original list:", planets)
print("First planet (index 0):", planets[0])
print("Last planet (index -1):", planets[-1])
print("Total planets count:", len(planets))

# Adding a new planet to the end of the list
planets.append("Jupiter")
print("After append:", planets)`,
      whatJustHappened: [
        "Created a list of 4 strings using [ ].",
        "planets[0] grabbed the first element ('Mercury').",
        "planets[-1] grabbed the last element ('Mars').",
        ".append(\"Jupiter\") modified the list in place, growing it to 5 planets!"
      ],
      deeperDive: "Lists are mutable! Unlike strings (which cannot be changed in place), lists can have items added (.append), removed (.remove), or swapped (`planets[0] = 'Sol'`) without creating a new list.",
      yourTurn: {
        challenge: "Create a list called languages with 'Python' and 'JavaScript'. Append 'Rust' to it, and print the updated list.",
        starterCode: `# Create languages list below:
`,
        solutionCode: `languages = ["Python", "JavaScript"]
languages.append("Rust")
print(languages)`,
        hints: [
          "Use square brackets: languages = ['Python', 'JavaScript']",
          "Use languages.append('Rust')"
        ]
      },
      quickChecks: [
        {
          question: "What is the index of the first item in any Python list?",
          options: [
            "0",
            "1",
            "-1",
            "It varies by list type"
          ],
          correctIndex: 0,
          explanation: "Python uses 0-based indexing: the first item is always at index 0."
        }
      ],
      commonMistakes: [
        {
          title: "IndexError: list index out of range",
          badCode: "colors = ['red', 'blue']\nprint(colors[2]) # Error! Valid indices are 0 and 1",
          goodCode: "colors = ['red', 'blue']\nprint(colors[1]) # 'blue'",
          explanation: "A list of 2 items only has indices 0 and 1. Requesting index 2 triggers an IndexError."
        }
      ],
      seedsForLater: {
        concept: "The for Loop",
        sproutsIn: "Phase 3: Lesson 3.4 (The Next Lesson!)",
        teaser: "How do you inspect every item in a list one by one? In the next lesson, the 'for' loop will glide through lists automatically!"
      },
      recap: [
        "Lists store multiple items in order using square brackets [ ].",
        "List indices start at 0; negative index -1 accesses the last item.",
        ".append(item) adds an element to the end of the list."
      ],
      glossaryTerms: ["list", "index", "mutable", "sequence"],
      concept: `### Introduction to Lists

A **list** is Python's most versatile container data type. It holds an ordered sequence of elements.

---

#### 1. Creating and Accessing Lists
\`\`\`python
inventory = ["sword", "shield", "healing_potion"]

# 0-indexed access
print(inventory[0])  # "sword"
print(inventory[1])  # "shield"

# Negative indexing (counts from end)
print(inventory[-1]) # "healing_potion"
\`\`\`

---

#### 2. Modifying Lists (Mutability)
Lists are mutable. You can change their contents in place:
\`\`\`python
# Modify element
inventory[0] = "crystal_blade"

# Append new element
inventory.append("magic_map")
print(inventory)
\`\`\``,
      practiceCode: `tasks = ["Write code", "Test edge cases", "Deploy app"]
print("Initial tasks:", tasks)

tasks.append("Celebrate release")
print("Updated tasks:", tasks)
print("Total tasks:", len(tasks))
print("First task:", tasks[0])`,
      quizQuestion: "What happens if my_list has 3 items and you ask for my_list[3]?",
      quizOptions: [
        "IndexError: list index out of range",
        "It returns None",
        "It returns the 3rd item",
        "It creates a new blank item"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-3-4",
      title: "Lesson 3.4: For Loops and range()",
      phaseId: "phase-3",
      phaseTitle: "Phase 3: Repeating Things",
      description: "Iterating through lists and sequences effortlessly using the for loop and range() generator.",
      hook: "Imagine being handed a basket of 10 fresh apples and told to polish each one. You pick up an apple, polish it, place it down, and reach for the next until the basket is empty. The for loop is your automatic apple polish engine.",
      plainEnglish: "A for loop iterates over each item in a collection or sequence, running its indented block once for every single item.",
      codeExample: `# The for Loop with Lists and range()
# 1. Iterating through a list
animals = ["wolf", "eagle", "dolphin"]
for creature in animals:
    print(f"Creature spotted: {creature.title()}")

# 2. Using range(start, stop)
print("\\nCounting with range(1, 5):")
for step in range(1, 5):
    print("Step:", step)`,
      whatJustHappened: [
        "In the first loop, creature took the value 'wolf', then 'eagle', then 'dolphin'.",
        "In the second loop, range(1, 5) generated numbers 1, 2, 3, 4 (stop value 5 is excluded!).",
        "No manual counter increment (i += 1) needed; Python handles iteration automatically!"
      ],
      deeperDive: "range(stop) starts at 0 by default. range(3) gives 0, 1, 2. range(start, stop, step) can count by twos: range(0, 10, 2) produces 0, 2, 4, 6, 8. It never includes the stop number!",
      yourTurn: {
        challenge: "Use a for loop with range(1, 6) to print the square of each number (e.g. 1 squared is 1, 2 squared is 4...).",
        starterCode: `# Write your for loop with range() below:
`,
        solutionCode: `for n in range(1, 6):
    print(f"{n} squared is {n ** 2}")`,
        hints: [
          "Use for n in range(1, 6):",
          "Calculate square with n ** 2"
        ]
      },
      quickChecks: [
        {
          question: "Which numbers are produced by range(2, 6)?",
          options: [
            "2, 3, 4, 5 (up to but not including 6)",
            "2, 3, 4, 5, 6",
            "1, 2, 3, 4, 5",
            "2, 4, 6"
          ],
          correctIndex: 0,
          explanation: "In Python range(start, stop), the stop number is always exclusive (not included)."
        }
      ],
      commonMistakes: [
        {
          title: "Expecting range(1, 5) to include 5",
          badCode: "# Expecting range(1, 5) to include 5",
          goodCode: "for i in range(1, 6): # To include 5, go to 6",
          explanation: "The stop value in range() is exclusive. To include 5, set the stop to 6."
        }
      ],
      seedsForLater: {
        concept: "List Comprehensions",
        sproutsIn: "Phase 4: Collections & Mappings (Lesson 4.1)",
        teaser: "In Phase 4, you will learn how to turn a 4-line for loop into an elegant 1-line list comprehension: `[x ** 2 for x in numbers]`!"
      },
      recap: [
        "for item in collection: iterates across every element in order.",
        "range(start, stop) generates numbers up to, but not including, stop.",
        "range(start, stop, step) allows custom step increments."
      ],
      glossaryTerms: ["loop", "iteration", "list", "sequence"],
      concept: `### For Loops and range()

While \`while\` loops are ideal when you don't know how many times something will repeat, **for loops** are the master of definite iteration over collections.

---

#### 1. Iterating Over a List
\`\`\`python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I enjoy eating {fruit}s.")
\`\`\`

---

#### 2. The range() Generator
\`\`\`python
# range(stop): 0 to stop-1
for i in range(3):
    print(i)  # 0, 1, 2

# range(start, stop): start to stop-1
for i in range(5, 8):
    print(i)  # 5, 6, 7

# range(start, stop, step):
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
\`\`\``,
      practiceCode: `temperatures_c = [15, 20, 25, 30]

print("Celsius to Fahrenheit conversions:")
for c in temperatures_c:
    f = (c * 9/5) + 32
    print(f"{c}°C = {f:.1f}°F")`,
      quizQuestion: "What is the output of: for x in range(3): print(x, end=\" \")?",
      quizOptions: [
        "0 1 2 ",
        "1 2 3 ",
        "0 1 2 3 ",
        "3 "
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-3-5",
      title: "Lesson 3.5: Looping Patterns (Count, Sum, Filter)",
      phaseId: "phase-3",
      phaseTitle: "Phase 3: Repeating Things",
      description: "Master the 3 essential loop algorithms: counting matches, summing totals, and filtering subsets.",
      hook: "Every data analysis algorithm in the world—from calculating your credit card monthly statement to counting how many likes a video received—is built on three simple looping patterns: Counting, Summing, and Filtering.",
      plainEnglish: "An accumulator pattern uses a variable defined outside the loop (like total = 0 or count = 0) and updates it inside the loop as items are processed.",
      codeExample: `# The 3 Essential Looping Patterns
test_scores = [88, 92, 54, 78, 95, 62, 85]

# 1. Summing: Accumulating a total
total = 0
for score in test_scores:
    total += score

average = total / len(test_scores)
print(f"Total: {total} | Class Average: {average:.1f}")

# 2. Counting: How many passed (>= 70)?
passing_count = 0
for score in test_scores:
    if score >= 70:
        passing_count += 1
print("Students passed:", passing_count)

# 3. Filtering: Collect high honors (>= 90)
honors = []
for score in test_scores:
    if score >= 90:
        honors.append(score)
print("Honors scores:", honors)`,
      whatJustHappened: [
        "Initialized total = 0 outside the loop, then accumulated each score.",
        "Initialized passing_count = 0, incremented only when score >= 70.",
        "Initialized an empty list honors = [], appended matching high scores."
      ],
      deeperDive: "Python also has built-in helpers like `sum(test_scores)` and `max(test_scores)`. But understanding how the accumulator loop works under the hood is what makes you a true computer scientist.",
      yourTurn: {
        challenge: "Given prices = [12.50, 4.00, 25.00, 8.50], calculate the sum of items that cost more than $10.",
        starterCode: `prices = [12.50, 4.00, 25.00, 8.50]
expensive_total = 0.0
# Add prices > 10 to expensive_total:
`,
        solutionCode: `prices = [12.50, 4.00, 25.00, 8.50]
expensive_total = 0.0
for p in prices:
    if p > 10.0:
        expensive_total += p
print(f"Expensive total: \${expensive_total:.2f}")`,
        hints: [
          "Use if p > 10.0: expensive_total += p"
        ]
      },
      quickChecks: [
        {
          question: "Where must an accumulator variable (like total = 0) be initialized?",
          options: [
            "Outside the loop before the loop starts",
            "Inside the loop on the first indented line",
            "At the bottom of the loop",
            "Inside an if statement"
          ],
          correctIndex: 0,
          explanation: "If you initialize total = 0 inside the loop, it resets back to 0 on every single iteration!"
        }
      ],
      commonMistakes: [
        {
          title: "Resetting the accumulator inside the loop",
          badCode: "for x in [1, 2, 3]:\n    total = 0 # Resets on every lap!\n    total += x",
          goodCode: "total = 0 # Initialized outside!\nfor x in [1, 2, 3]:\n    total += x",
          explanation: "Always place accumulator variables outside the loop header."
        }
      ],
      seedsForLater: {
        concept: "The sum(), min(), max() Built-ins",
        sproutsIn: "Phase 4: Collections & Mappings",
        teaser: "Python has built-in shortcuts like sum() and len(). In Phase 4, you will learn when to use built-ins and when to write custom loop patterns!"
      },
      recap: [
        "Summing pattern: total = 0; total += item.",
        "Counting pattern: count = 0; if match: count += 1.",
        "Filtering pattern: matches = []; if match: matches.append(item)."
      ],
      glossaryTerms: ["loop", "iteration", "list", "algorithm"],
      concept: `### Looping Patterns (Count, Sum, Filter)

Nearly every data analysis workflow reduces to three fundamental loop archetypes:

---

#### 1. The Sum Pattern
\`\`\`python
numbers = [10, 20, 30]
total = 0
for n in numbers:
    total += n
print("Sum:", total)
\`\`\`

---

#### 2. The Count Pattern
\`\`\`python
count = 0
for n in numbers:
    if n > 15:
        count += 1
print("Count > 15:", count)
\`\`\`

---

#### 3. The Filter Pattern
\`\`\`python
filtered = []
for n in numbers:
    if n % 2 == 0:
        filtered.append(n)
print("Even numbers:", filtered)
\`\`\``,
      practiceCode: `cart = [19.99, 4.50, 99.00, 12.00, 6.75]

total_spend = 0.0
items_over_ten = 0

for price in cart:
    total_spend += price
    if price > 10.0:
        items_over_ten += 1

print(f"Total Cart: \${total_spend:.2f}")
print(f"Items exceeding \$10: {items_over_ten}")`,
      quizQuestion: "What is the result of running an accumulator initialized as count = 0 inside the loop body?",
      quizOptions: [
        "It overwrites the count on every cycle and only reflects the final item",
        "It accumulates normally",
        "It raises a SyntaxError",
        "It doubles the count"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-3-6",
      title: "Lesson 3.6: Project: Interactive To-Do List Application",
      phaseId: "phase-3",
      phaseTitle: "Phase 3: Repeating Things",
      description: "Capstone Project 3: Build a console task manager with menu loops, list appending, numbered task displays, and exit controls.",
      hook: "Every productivity app in the world—from Todoist to Apple Reminders—starts with the same core data structure: a list! Let's combine while loops, lists, user input, and formatted prints to create a functioning interactive task manager.",
      plainEnglish: "This project uses a while True menu loop. Users can view all active tasks, add new tasks to the list using .append(), or exit the program cleanly using break.",
      codeExample: `# Phase 3 Capstone: Console To-Do Manager
tasks = ["Review Python Phase 0", "Master Variables in Phase 1", "Practice Loops"]

print("=" * 35)
print("    PYTHON TO-DO TASK MANAGER")
print("=" * 35)

# Displaying numbered list with index + 1
for i in range(len(tasks)):
    print(f"[{i + 1}] {tasks[i]}")

print("-" * 35)
print(f"Total active tasks: {len(tasks)}")`,
      whatJustHappened: [
        "Stored tasks inside a Python list.",
        "Used `for i in range(len(tasks)):` to print each task with human-friendly numbering (starting at 1 instead of 0).",
        "Displayed clean summary metrics using len()."
      ],
      deeperDive: "Python has a built-in helper called `enumerate(tasks)` that gives you both the index and the item at the same time: `for i, task in enumerate(tasks, start=1):`. It is the most pythonic way to print numbered lists!",
      yourTurn: {
        challenge: "Add a new task 'Build Capstone Project' to the tasks list and print the updated numbered list.",
        starterCode: `tasks = ["Study", "Code"]
# Append new task and print numbered list:
`,
        solutionCode: `tasks = ["Study", "Code"]
tasks.append("Build Capstone Project")
for i in range(len(tasks)):
    print(f"{i + 1}. {tasks[i]}")`,
        hints: [
          "Use tasks.append('Build Capstone Project')",
          "Use for i in range(len(tasks)):"
        ]
      },
      quickChecks: [
        {
          question: "Why do we write i + 1 when printing numbered tasks for humans?",
          options: [
            "Because Python lists start at index 0, but humans count starting at 1",
            "Because index 0 is reserved for computer memory",
            "Because range() skips the first item",
            "Because 0 cannot be printed"
          ],
          correctIndex: 0,
          explanation: "Humans expect numbered lists to start at 1, so adding 1 to the 0-based index bridges the gap."
        }
      ],
      commonMistakes: [
        {
          title: "Printing i instead of i + 1",
          badCode: "for i in range(len(tasks)):\n    print(f'[{i}] {tasks[i]}') # Starts at [0]",
          goodCode: "for i in range(len(tasks)):\n    print(f'[{i + 1}] {tasks[i]}')",
          explanation: "Presenting 0-indexed items to non-technical human users looks awkward. Always use i + 1."
        }
      ],
      seedsForLater: {
        concept: "Dictionary Objects for Tasks",
        sproutsIn: "Phase 4: Collections & Mappings",
        teaser: "Right now our tasks are plain strings. In Phase 4, tasks will become rich dictionaries with priority, due date, and completion status!"
      },
      recap: [
        "You built an interactive task manager using lists and loops.",
        "You used range(len(tasks)) to render formatted, human-friendly numbers.",
        "You completed Phase 3 of Python: Zero to Pro!"
      ],
      glossaryTerms: ["list", "loop", "index", "program"],
      concept: `### Project: Interactive To-Do List Application

Congratulations on completing **Phase 3: Repeating Things**!

In this project, we synthesized:
1. **List management**: creating collections and appending items with \`.append()\`.
2. **Iteration**: traversing items with \`for\` loops and \`range(len(items))\`.
3. **Human-friendly formatting**: converting 0-based computer indices into 1-based numbered lists.
4. **Summary metrics**: tracking item volume with \`len()\`.

\`\`\`python
tasks = ["Review Phase 1", "Practice Loops", "Build To-Do App"]

print("ACTIVE TASKS:")
for idx in range(len(tasks)):
    print(f"{idx + 1}. {tasks[idx]}")
print(f"Total: {len(tasks)} items")
\`\`\``,
      practiceCode: `todo_list = ["Morning run", "Read Python chapter", "Write sample code"]
todo_list.append("Commit code to Git")

print("TODAY'S SCHEDULE:")
print("-" * 25)
for i in range(len(todo_list)):
    print(f"[{i + 1}] {todo_list[i]}")
print("-" * 25)
print(f"Remaining tasks: {len(todo_list)}")`,
      quizQuestion: "What is the length of a list created as items = [] after items.append(\"A\")?",
      quizOptions: [
        "1",
        "0",
        "2",
        "Error"
      ],
      quizAnswerIndex: 0
    }
  ]
};
