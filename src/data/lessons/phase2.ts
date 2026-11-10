import { LessonModule } from "../../types";

export const PHASE_2_MODULE: LessonModule = {
  id: "phase-2",
  title: "Phase 2: Making Decisions",
  description: "Conditional control flow: if, else, elif, nested conditions, and logical operators (and, or, not).",
  lessons: [
    {
      id: "l-2-1",
      title: "Lesson 2.1: The if Statement",
      phaseId: "phase-2",
      phaseTitle: "Phase 2: Making Decisions",
      description: "Learn how the if statement introduces decision-making, colon syntax, and 4-space indentation.",
      hook: "Every day you make conditional decisions: 'If it is cold outside, I will wear a jacket.' You don't put on a heavy winter jacket in the middle of summer. Computers need this exact ability to make decisions based on changing conditions.",
      plainEnglish: "An if statement checks a condition. If the condition evaluates to True, Python executes the indented block of code directly underneath it. If False, Python skips that block entirely.",
      codeExample: `# The if Statement
temperature = 85

print("Checking weather conditions...")

if temperature > 80:
    print("Warning: It is hot outside!")
    print("Remember to drink plenty of water.")

print("Weather check finished.")`,
      whatJustHappened: [
        "Line 2: temperature is set to 85.",
        "Line 4: Prints the check status.",
        "Line 6: Python evaluates 'temperature > 80' (85 > 80 is True).",
        "Lines 7-8: Because it is True, Python executes the indented block.",
        "Line 10: Continues with the unindented code."
      ],
      deeperDive: "Notice the 4 spaces at the start of lines 7 and 8! In languages like C++ or JavaScript, curly braces { } group code. Python uses indentation! This forces Python code to always look neat and readable.",
      yourTurn: {
        challenge: "Write an if statement that checks if player_score is greater than 1000. If it is, print 'New High Score!'.",
        starterCode: `player_score = 1250
# Write your if statement below:
`,
        solutionCode: `player_score = 1250
if player_score > 1000:
    print("New High Score!")`,
        hints: [
          "Don't forget the colon ':' at the end of the if line.",
          "Indent the print line by 4 spaces."
        ]
      },
      quickChecks: [
        {
          question: "What must appear at the end of the line containing an if statement?",
          options: [
            "A colon (:)",
            "A semicolon (;)",
            "A period (.)",
            "An open curly brace ({)"
          ],
          correctIndex: 0,
          explanation: "In Python, header statements like if, else, elif, for, and def must always end with a colon (:)."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting the colon at the end of the if line",
          badCode: "if score > 100\n    print(\"Win\")",
          goodCode: "if score > 100:\n    print(\"Win\")",
          explanation: "Forgetting the colon triggers a SyntaxError: expected ':'."
        },
        {
          title: "Inconsistent indentation",
          badCode: "if score > 100:\n  print(\"A\")\n    print(\"B\")",
          goodCode: "if score > 100:\n    print(\"A\")\n    print(\"B\")",
          explanation: "All lines inside the same block must have identical 4-space indentation."
        }
      ],
      seedsForLater: {
        concept: "The else Branch",
        sproutsIn: "Phase 2: Lesson 2.2 (The Next Lesson!)",
        teaser: "What if the condition is False? Right now Python skips it. In the next lesson, 'else' will give Python an alternative path!"
      },
      recap: [
        "if condition: evaluates whether an expression is True.",
        "Always place a colon (:) at the end of the if line.",
        "Indent lines inside the block by 4 spaces."
      ],
      glossaryTerms: ["conditional", "syntax", "boolean"],
      concept: `### The if Statement

Up to this point, programs followed a single straight path from top to bottom. The \`if\` statement is Python's primary tool for **branching**: allowing code to take different paths depending on data.

---

#### 1. Syntax of the if Statement
\`\`\`python
if condition:
    # Code here only runs if condition is True
    statement_one
    statement_two
\`\`\`

---

#### 2. The Golden Rules of Python Blocks
1. **The Colon (\`:\`)**: Every \`if\` line must end with a colon. It signals to Python that an indented block begins on the next line.
2. **Four-Space Indentation**: Use 4 spaces (or press the Tab key) for every line inside the block.
3. **Exiting the Block**: To return to normal execution, simply remove the indentation.`,
      practiceCode: `battery_percent = 15

print("Checking power level...")
if battery_percent < 20:
    print("Low Battery Warning!")
    print("Please connect charger.")

print("System running.")`,
      quizQuestion: "What happens if condition is False in an if statement without an else branch?",
      quizOptions: [
        "Python skips the indented block and continues with the next unindented line",
        "Python stops the entire program with an error",
        "Python prints False to the screen",
        "Python runs the block anyway"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-2-2",
      title: "Lesson 2.2: else — When the Condition Is False",
      phaseId: "phase-2",
      phaseTitle: "Phase 2: Making Decisions",
      description: "Handling the alternative branch using else when the initial condition is False.",
      hook: "Imagine approaching an automatic gate. If you scan a valid security badge, the gate opens. But what happens if your badge is expired? The gate doesn't just stand there doing nothing; a red light flashes and says 'Access Denied'. That fallback action is the else branch.",
      plainEnglish: "The else keyword defines what code runs when the if condition evaluates to False. It serves as your program's safety net or fallback plan.",
      codeExample: `# The if-else Branching Structure
user_age = 16
voting_age = 18

if user_age >= voting_age:
    print("Eligible to vote in elections.")
else:
    years_left = voting_age - user_age
    print("Not eligible yet.")
    print(f"You will be eligible in {years_left} years.")`,
      whatJustHappened: [
        "Line 5: Evaluates user_age >= voting_age (16 >= 18 is False).",
        "Line 6: Python skips the if block completely.",
        "Line 7: Python hits the else branch.",
        "Lines 8-10: Executes the fallback instructions."
      ],
      deeperDive: "An else statement can never stand alone; it must always be paired directly with an if. And like the if statement, else must always end with a colon (:).",
      yourTurn: {
        challenge: "Write an if-else statement checking if password == 'secret'. If matching, print 'Access granted'. Otherwise print 'Access denied'.",
        starterCode: `password = "admin123"
# Write your if-else structure below:
`,
        solutionCode: `password = "admin123"
if password == "secret":
    print("Access granted")
else:
    print("Access denied")`,
        hints: [
          "Remember: if password == 'secret':",
          "Followed by else:"
        ]
      },
      quickChecks: [
        {
          question: "Can an else statement have its own condition, like else x > 5:?",
          options: [
            "No, else never takes a condition; it handles everything else",
            "Yes, else always requires a condition",
            "Only if x is an integer",
            "Yes, if followed by an exclamation mark"
          ],
          correctIndex: 0,
          explanation: "else handles all cases where the prior condition was False. It does not accept its own condition (that is what elif is for!)."
        }
      ],
      commonMistakes: [
        {
          title: "Putting a condition on an else statement",
          badCode: "else score < 50:\n    print(\"Retake\")",
          goodCode: "else:\n    print(\"Retake\")",
          explanation: "else does not accept a condition. If you need a specific condition, use elif."
        }
      ],
      seedsForLater: {
        concept: "The elif Cascade",
        sproutsIn: "Phase 2: Lesson 2.3",
        teaser: "What if you have three or more possibilities (like Grades A, B, C, D, and F)? In Lesson 2.3, elif lets you test multiple branches in order!"
      },
      recap: [
        "else runs when the preceding if condition evaluates to False.",
        "else never takes a condition; it ends with a colon (:).",
        "Exactly ONE of the two branches will run; never both."
      ],
      glossaryTerms: ["conditional", "boolean", "syntax"],
      concept: `### else — When the Condition Is False

While an \`if\` statement gives code an optional detour, an \`if-else\` statement creates a true fork in the road.

---

#### 1. The Either-Or Fork
Exactly one branch will execute:
\`\`\`python
temperature = 65

if temperature >= 70:
    print("Wear a t-shirt.")
else:
    print("Bring a jacket.")
\`\`\`

---

#### 2. Key Rules for else
- Must be attached to an \`if\`.
- Aligned to the exact same indentation column as its matching \`if\`.
- Does not take a condition (no \`else condition:\`).
- Always ends with a colon (\`:\`).`,
      practiceCode: `account_balance = 45.00
purchase_amount = 60.00

if account_balance >= purchase_amount:
    account_balance -= purchase_amount
    print(f"Purchase approved! Remaining balance: \${account_balance:.2f}")
else:
    shortfall = purchase_amount - account_balance
    print(f"Declined: Insufficient funds. Short by \${shortfall:.2f}")`,
      quizQuestion: "In an if-else block, can both the if and else code blocks run during the same execution?",
      quizOptions: [
        "No, exactly one branch executes based on truth value",
        "Yes, if the number is even",
        "Yes, if there are no errors",
        "It depends on the operating system"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-2-3",
      title: "Lesson 2.3: elif — Handling Multiple Cases",
      phaseId: "phase-2",
      phaseTitle: "Phase 2: Making Decisions",
      description: "Cascading decisions with elif (short for else if) for grade scoring, traffic lights, and multi-tier logic.",
      hook: "A traffic light doesn't just have Red and Green; it has Yellow too! A school grading system doesn't just have Pass and Fail; it has A, B, C, D, and F. Real life is full of multiple tiers, not just two choices.",
      plainEnglish: "elif is short for 'else if'. It lets you test a chain of conditions in order. The first condition that evaluates to True runs its block, and Python skips all remaining branches.",
      codeExample: `# Multi-tier grading with elif
score = 84

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score} -> Final Grade: {grade}")`,
      whatJustHappened: [
        "Line 4: 84 >= 90 is False, so moves to first elif.",
        "Line 6: 84 >= 80 is True! grade is set to 'B'.",
        "Lines 8-13: Python immediately skips all remaining elif and else branches!",
        "Line 15: Prints 'Final Grade: B'."
      ],
      deeperDive: "Order matters immensely in an elif chain! Python evaluates from top to bottom. If you put `elif score >= 60` at the very top, an 84 would match the 60 check first and get a D! Always arrange cascading ranges from strictest to broadest.",
      yourTurn: {
        challenge: "Write a traffic light check for light_color ('red', 'yellow', 'green'): print 'Stop', 'Caution', or 'Go'.",
        starterCode: `light_color = "yellow"
# Write your if-elif-else logic below:
`,
        solutionCode: `light_color = "yellow"
if light_color == "red":
    print("Stop")
elif light_color == "yellow":
    print("Caution")
elif light_color == "green":
    print("Go")
else:
    print("Invalid signal")`,
        hints: [
          "Use == to compare strings: light_color == 'red'"
        ]
      },
      quickChecks: [
        {
          question: "When Python finds a condition that evaluates to True in an elif chain, what does it do next?",
          options: [
            "Runs that block and skips the rest of the chain",
            "Continues checking every remaining elif branch anyway",
            "Restarts from the top of the program",
            "Raises an error"
          ],
          correctIndex: 0,
          explanation: "Python exits the entire if-elif-else construct immediately after executing the first matching True branch."
        }
      ],
      commonMistakes: [
        {
          title: "Using multiple separate 'if' statements instead of 'elif'",
          badCode: "if score >= 80:\n    grade = 'B'\nif score >= 70: # Re-checks and overwrites!\n    grade = 'C'",
          goodCode: "if score >= 80:\n    grade = 'B'\nelif score >= 70:\n    grade = 'C'",
          explanation: "Separate if statements all execute independently. elif ensures only one branch runs."
        }
      ],
      seedsForLater: {
        concept: "Dictionary Dispatch Tables",
        sproutsIn: "Phase 4: Collections & Mappings",
        teaser: "Long elif chains with 20 conditions can get tedious. In Phase 4, you will learn how dictionaries can look up actions in a single line!"
      },
      recap: [
        "elif (else if) allows testing multiple alternative conditions.",
        "Branches evaluate top-to-bottom; the first True branch wins.",
        "An optional else at the bottom acts as the catch-all default."
      ],
      glossaryTerms: ["conditional", "boolean", "syntax"],
      concept: `### elif — Handling Multiple Cases

When decisions have more than two possible outcomes, we chain conditions using \`elif\` (short for **else if**).

---

#### 1. Structure of an if-elif-else Chain
\`\`\`python
speed = 78

if speed > 85:
    status = "Reckless Driving"
elif speed > 65:
    status = "Speeding"
elif speed > 45:
    status = "Normal Speed"
else:
    status = "Too Slow"

print("Status:", status)
\`\`\`

---

#### 2. Short-Circuit Evaluation
The instant Python finds a condition that evaluates to \`True\`, it executes that single block and **completely bypasses** the rest of the chain.`,
      practiceCode: `time_hours = 14  # 2:00 PM in 24-hour clock

if time_hours < 12:
    greeting = "Good morning"
elif time_hours < 17:
    greeting = "Good afternoon"
elif time_hours < 21:
    greeting = "Good evening"
else:
    greeting = "Good night"

print(f"{greeting}! Current hour: {time_hours}:00")`,
      quizQuestion: "What happens if all if and elif conditions evaluate to False, and an else is present?",
      quizOptions: [
        "The else block executes",
        "Nothing executes",
        "Python crashes",
        "The first if executes anyway"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-2-4",
      title: "Lesson 2.4: Nested Decisions",
      phaseId: "phase-2",
      phaseTitle: "Phase 2: Making Decisions",
      description: "Placing if statements inside other if statements to check multi-level criteria.",
      hook: "To board an airplane, you first pass airport security (Requirement 1). Only after you clear security do you walk to the boarding gate to scan your specific boarding pass (Requirement 2). You can't board without clearing both hurdles in order.",
      plainEnglish: "A nested if statement is an if statement placed inside the indented body of another if statement. The inner check only runs if the outer check passed.",
      codeExample: `# Nested Decision Structure
has_ticket = True
age = 15

if has_ticket:
    print("Ticket confirmed! Checking age restrictions...")
    if age >= 18:
        print("Admitted to adult attraction.")
    else:
        print("Admitted to youth attraction (under 18).")
else:
    print("Please purchase a ticket at the kiosk first.")`,
      whatJustHappened: [
        "Outer if checks has_ticket (True).",
        "Python enters the outer block and prints confirmation.",
        "Inner if checks age >= 18 (15 >= 18 is False).",
        "Inner else runs: 'Admitted to youth attraction'."
      ],
      deeperDive: "Each level of nesting adds 4 more spaces of indentation (8 spaces for level 2, 12 spaces for level 3). In software engineering, too much nesting is called 'Pyramid of Doom'. If you find yourself nesting 4 levels deep, logical operators (and/or) can flatten your code!",
      yourTurn: {
        challenge: "Create a login check: outer if checks username == 'admin', inner if checks pin == 1234. If both pass, print 'Welcome Admin!'.",
        starterCode: `username = "admin"
pin = 1234
# Write nested if check below:
`,
        solutionCode: `username = "admin"
pin = 1234
if username == "admin":
    if pin == 1234:
        print("Welcome Admin!")
    else:
        print("Incorrect PIN")
else:
    print("Unknown user")`,
        hints: [
          "Indent the inner if statement by 4 spaces inside the outer if block."
        ]
      },
      quickChecks: [
        {
          question: "How many spaces should code inside a second-level nested if block be indented?",
          options: [
            "8 spaces (4 spaces for outer, +4 spaces for inner)",
            "4 spaces",
            "2 spaces",
            "16 spaces"
          ],
          correctIndex: 0,
          explanation: "Each indentation level in Python adds 4 spaces: Level 1 = 4 spaces, Level 2 = 8 spaces."
        }
      ],
      commonMistakes: [
        {
          title: "Mismatched indentation on inner else",
          badCode: "if outer:\n    if inner:\n        print('A')\nelse: # Paired with outer, not inner!\n    print('B')",
          goodCode: "if outer:\n    if inner:\n        print('A')\n    else: # Correctly indented with inner\n        print('B')",
          explanation: "Ensure else is aligned vertically with the exact if statement it belongs to."
        }
      ],
      seedsForLater: {
        concept: "Logical Operators (and, or)",
        sproutsIn: "Phase 2: Lesson 2.5 (The Next Lesson!)",
        teaser: "Instead of nesting two if statements, you can combine them on one line using the 'and' operator!"
      },
      recap: [
        "Nested if statements sit inside other if statements.",
        "Inner checks only run if outer conditions evaluated to True.",
        "Add 4 spaces of indentation for each level of nesting."
      ],
      glossaryTerms: ["conditional", "syntax"],
      concept: `### Nested Decisions

When a decision depends on prior decisions, we place one conditional block inside another. This is known as **nesting**.

---

#### 1. Indentation Architecture
\`\`\`python
is_member = True
cart_total = 120.00

if is_member:
    print("Club member verified.")
    if cart_total > 100.00:
        print("Qualifies for 20% discount!")
    else:
        print("Qualifies for 10% discount.")
else:
    print("Standard pricing applied.")
\`\`\`

---

#### 2. Readability Note
While nesting is powerful, deep nesting (more than 3 levels) makes code harder to read. In the next lesson, we will see how logical operators (\`and\`, \`or\`) allow flattening complex conditions.`,
      practiceCode: `account_active = True
security_clearance = 3

if account_active:
    print("Account verified.")
    if security_clearance >= 4:
        print("Access Level: Top Secret")
    elif security_clearance >= 2:
        print("Access Level: Restricted")
    else:
        print("Access Level: Public only")
else:
    print("Account suspended.")`,
      quizQuestion: "What happens if the outer if condition is False in a nested structure?",
      quizOptions: [
        "The inner if condition is never evaluated at all",
        "The inner if condition runs anyway",
        "Python raises an IndentationError",
        "The inner else runs"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-2-5",
      title: "Lesson 2.5: Logical Operators (and, or, not)",
      phaseId: "phase-2",
      phaseTitle: "Phase 2: Making Decisions",
      description: "Combining multiple conditions with and, or, and reversing truth with not.",
      hook: "To get a driver's license, you must pass the written test AND pass the road test (both must be True). To get into a movie discount, you can be a student OR a senior (either one being True is enough). This is Boolean algebra in action.",
      plainEnglish: "Logical operators combine multiple conditions into a single statement: 'and' requires both conditions to be True; 'or' requires at least one condition to be True; 'not' flips True to False and vice versa.",
      codeExample: `# Logical Operators
age = 22
has_license = True
has_insurance = False

# and: BOTH must be True
can_rent_car = (age >= 21) and has_license
print("Can rent car (age >= 21 and license):", can_rent_car)

# or: AT LEAST ONE must be True
needs_bus_pass = (not has_license) or (not has_insurance)
print("Needs bus pass:", needs_bus_pass)

# not: Inverts truth
is_raining = False
print("Go to beach:", not is_raining)`,
      whatJustHappened: [
        "(age >= 21) is True, and has_license is True -> True and True = True.",
        "has_insurance is False -> not has_insurance is True -> True or False = True.",
        "not is_raining flipped False to True."
      ],
      deeperDive: "Python uses 'short-circuit evaluation':\n- In `A and B`, if A is False, Python doesn't even look at B (it's already impossible for both to be True).\n- In `A or B`, if A is True, Python doesn't look at B (it's already guaranteed to be True)!",
      yourTurn: {
        challenge: "Write an if statement: if temperature > 65 AND is_raining == False, print 'Perfect park weather!'.",
        starterCode: `temperature = 72
is_raining = False
# Write your if statement with 'and':
`,
        solutionCode: `temperature = 72
is_raining = False
if temperature > 65 and not is_raining:
    print("Perfect park weather!")`,
        hints: [
          "You can write: if temperature > 65 and is_raining == False:",
          "Or more pythonically: if temperature > 65 and not is_raining:"
        ]
      },
      quickChecks: [
        {
          question: "What is the result of True and False?",
          options: [
            "False",
            "True",
            "None",
            "Error"
          ],
          correctIndex: 0,
          explanation: "'and' requires BOTH sides to be True. Since one side is False, the result is False."
        }
      ],
      commonMistakes: [
        {
          title: "Writing x == 5 or 6 instead of x == 5 or x == 6",
          badCode: "if x == 5 or 6: # 6 is always truthy, so this is ALWAYS True!",
          goodCode: "if x == 5 or x == 6:",
          explanation: "Each side of 'or' must be a complete comparison: x == 5 or x == 6."
        }
      ],
      seedsForLater: {
        concept: "While Loop Exit Conditions",
        sproutsIn: "Phase 3: Repeating Things (Lesson 3.1)",
        teaser: "In Phase 3, you will use logical operators like `while lives > 0 and not game_over:` to control interactive game loops!"
      },
      recap: [
        "'and' requires all conditions to be True.",
        "'or' requires at least one condition to be True.",
        "'not' inverts the truth value of a condition."
      ],
      glossaryTerms: ["boolean", "operator", "conditional"],
      concept: `### Logical Operators (and, or, not)

Logical operators allow you to combine multiple boolean comparisons into clean, expressive compound statements.

---

#### 1. Truth Tables
| Condition A | Condition B | A and B | A or B |
| :--- | :--- | :--- | :--- |
| \`True\` | \`True\` | \`True\` | \`True\` |
| \`True\` | \`False\` | \`False\` | \`True\` |
| \`False\` | \`True\` | \`False\` | \`True\` |
| \`False\` | \`False\` | \`False\` | \`False\` |

The \`not\` operator simply inverts: \`not True\` is \`False\`; \`not False\` is \`True\`.

---

#### 2. Pythonic Idioms
Instead of writing:
\`\`\`python
if is_logged_in == False:  # Clunky
\`\`\`
Python developers write:
\`\`\`python
if not is_logged_in:      # Clean and idiomatic
\`\`\``,
      practiceCode: `credits_completed = 124
gpa = 3.6
fees_paid = True

can_graduate = (credits_completed >= 120) and (gpa >= 2.0) and fees_paid

if can_graduate:
    print("Approved for Graduation Ceremony!")
else:
    print("Requirements not yet satisfied.")`,
      quizQuestion: "What is the result of True or False?",
      quizOptions: [
        "True",
        "False",
        "None",
        "Error"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-2-6",
      title: "Lesson 2.6: Project: Smart Tip & Bill Split Calculator",
      phaseId: "phase-2",
      phaseTitle: "Phase 2: Making Decisions",
      description: "Capstone Project 2: Build an intelligent restaurant bill splitter that calculates custom tip rates based on service quality.",
      hook: "You are at dinner with 4 friends. The bill arrives, and someone asks: 'What percentage should we tip? How much does each person owe?' Let's build a smart calculator in Python that assesses service quality, adds the tip, and splits the bill evenly!",
      plainEnglish: "This project uses conditional branching (if-elif-else) to select tip percentages (e.g. 20% for excellent, 15% for good, 10% for poor), adds local sales tax, and divides the total by party size.",
      codeExample: `# Phase 2 Capstone: Smart Bill Splitter
subtotal = 120.00
service_quality = "excellent"  # options: excellent, good, fair, poor
party_size = 4
tax_rate = 0.085

# 1. Determine tip percentage based on service quality
if service_quality == "excellent":
    tip_rate = 0.20
elif service_quality == "good":
    tip_rate = 0.18
elif service_quality == "fair":
    tip_rate = 0.15
else:
    tip_rate = 0.10

tax_amount = subtotal * tax_rate
tip_amount = subtotal * tip_rate
grand_total = subtotal + tax_amount + tip_amount
cost_per_person = grand_total / party_size

print("=" * 36)
print(f"| BILL SPLIT SUMMARY ({service_quality.upper()}) |")
print("=" * 36)
print(f"| Subtotal:         \${subtotal:<16.2f} |")
print(f"| Tax (8.5%):       \${tax_amount:<16.2f} |")
print(f"| Tip ({tip_rate * 100:.0f}%):        \${tip_amount:<16.2f} |")
print("-" * 36)
print(f"| Grand Total:      \${grand_total:<16.2f} |")
print(f"| Cost per Person:  \${cost_per_person:<16.2f} |")
print("=" * 36)`,
      whatJustHappened: [
        "Used if-elif-else to match 'excellent' service quality to a 20% tip rate.",
        "Calculated tax, tip, and grand total using arithmetic expressions.",
        "Divided the grand total by the party size (4) to get cost per person ($39.15).",
        "Rendered a clear receipt summary with f-string precision."
      ],
      deeperDive: "What if party_size is 0? Dividing by 0 causes a ZeroDivisionError! A professional program checks `if party_size <= 0:` first to protect against invalid division.",
      yourTurn: {
        challenge: "Add a condition: if grand_total > 200, apply a $10 loyalty discount before splitting.",
        starterCode: `# Modify grand_total if > 200:
`,
        solutionCode: `if grand_total > 200:
    grand_total -= 10.00
    print("Loyalty discount applied: -$10.00")
cost_per_person = grand_total / party_size`,
        hints: [
          "Use if grand_total > 200: grand_total -= 10.00"
        ]
      },
      quickChecks: [
        {
          question: "Why is if-elif-else ideal for selecting tip rates based on service quality?",
          options: [
            "Because service rating falls into mutually exclusive categories",
            "Because elif only works with restaurants",
            "Because numbers cannot be divided without elif",
            "Because Python requires an if statement for every math calculation"
          ],
          correctIndex: 0,
          explanation: "The service quality rating represents mutually exclusive categories where only one tip rate should apply."
        }
      ],
      commonMistakes: [
        {
          title: "Dividing by zero when party size is 0",
          badCode: "per_person = total / party_size # Crashes if party_size == 0",
          goodCode: "if party_size > 0:\n    per_person = total / party_size",
          explanation: "Always validate that the divisor is greater than zero before performing division."
        }
      ],
      seedsForLater: {
        concept: "Functions with Return Values",
        sproutsIn: "Phase 5: Functions & Reusable Blocks",
        teaser: "In Phase 5, you will wrap this entire bill splitter into a reusable function: `split_bill(subtotal, service, party_size)`!"
      },
      recap: [
        "You built a real-world financial decision application.",
        "You combined if, elif, and else to model human business logic.",
        "You protected calculation logic and formatted currency output."
      ],
      glossaryTerms: ["conditional", "operator", "float", "expression"],
      concept: `### Project: Smart Tip & Bill Split Calculator

Congratulations on completing **Phase 2: Making Decisions**!

In this project, we synthesized:
1. Mutually exclusive conditional branching (\`if-elif-else\`).
2. Floating-point arithmetic calculations.
3. String casing normalization (\`.upper()\`).
4. Currency formatting precision with \`:.2f\`.

\`\`\`python
subtotal = 85.00
service = "good"
party = 3

if service == "excellent":
    tip = 0.20
elif service == "good":
    tip = 0.18
else:
    tip = 0.15

total = subtotal * (1 + tip + 0.08)
each = total / party
print(f"Total: \${total:.2f} | Each: \${each:.2f}")
\`\`\``,
      practiceCode: `bill = 95.50
quality = "good"
friends = 3

if quality == "excellent":
    tip_pct = 0.20
elif quality == "good":
    tip_pct = 0.18
else:
    tip_pct = 0.15

tip_total = bill * tip_pct
final_bill = bill + tip_total
each_pays = final_bill / friends

print(f"Bill: \${bill:.2f} | Tip: \${tip_total:.2f} | Total: \${final_bill:.2f}")
print(f"Each person pays: \${each_pays:.2f}")`,
      quizQuestion: "What is the best way to handle unknown service quality in an if-elif chain?",
      quizOptions: [
        "Include an else branch that supplies a safe default tip rate",
        "Crash the program",
        "Set tip to -100%",
        "Ignore the bill"
      ],
      quizAnswerIndex: 0
    }
  ]
};
