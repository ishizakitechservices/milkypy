import { LessonModule } from "../../types";

export const PHASE_4_MODULE: LessonModule = {
  id: "phase-4",
  title: "Phase 4: Collections & Mappings",
  description: "Lists deep dive, slicing, tuples (immutable), sets (unique), dictionaries (key-value), and database schemas.",
  lessons: [
    {
      id: "l-4-1",
      title: "Lesson 4.1: Lists Deep Dive and Slice Syntax",
      phaseId: "phase-4",
      phaseTitle: "Phase 4: Collections & Mappings",
      description: "Master list slicing [start:stop:step], .pop(), .insert(), and .sort().",
      hook: "Imagine cutting a loaf of bread. You don't just want one crumb or the whole loaf; you want the middle 3 slices! List slicing is how Python lets you carve out any sub-section of a collection in a single line.",
      plainEnglish: "Slice syntax [start:stop:step] extracts a sub-list. The stop index is excluded, just like in range().",
      codeExample: `# List Slicing and Advanced Methods
scores = [95, 82, 67, 88, 91, 74, 99]

# Slicing: [start:stop]
top_three = scores[0:3]          # [95, 82, 67]
last_two = scores[-2:]           # [74, 99]
every_other = scores[::2]        # [95, 67, 91, 99]
reversed_scores = scores[::-1]   # Reverses the entire list!

# In-place sorting
scores.sort(reverse=True)

print("Top 3:", top_three)
print("Sorted descending:", scores)`,
      whatJustHappened: [
        "scores[0:3] extracted the first 3 elements.",
        "scores[-2:] grabbed the final 2 elements.",
        "scores[::-1] reversed the list.",
        "scores.sort(reverse=True) sorted the list in descending order in place."
      ],
      deeperDive: "If you omit start, Python starts at 0: `scores[:3]`. If you omit stop, Python goes all the way to the end: `scores[3:]`. `scores[:]` makes a shallow copy of the entire list!",
      yourTurn: {
        challenge: "Extract the first 3 elements from letters = ['a', 'b', 'c', 'd', 'e'] using slice syntax.",
        starterCode: `letters = ["a", "b", "c", "d", "e"]
# Slice first 3 items:
`,
        solutionCode: `letters = ["a", "b", "c", "d", "e"]
subset = letters[:3]
print(subset)`,
        hints: ["Use letters[:3] or letters[0:3]"]
      },
      quickChecks: [
        {
          question: "What does my_list[::-1] do in Python?",
          options: [
            "Reverses the list order",
            "Deletes the first item",
            "Sorts the list",
            "Empties the list"
          ],
          correctIndex: 0,
          explanation: "A step of -1 steps backwards from end to start, reversing the sequence."
        }
      ],
      commonMistakes: [
        {
          title: "Expecting .sort() to return the sorted list",
          badCode: "sorted_list = scores.sort() # sorted_list is None!",
          goodCode: "scores.sort() # Modifies scores in place\n# Or: sorted_list = sorted(scores)",
          explanation: ".sort() modifies the list in place and returns None. Use sorted(x) if you want a new list."
        }
      ],
      seedsForLater: {
        concept: "Tuples: Immutable Lists",
        sproutsIn: "Phase 4: Lesson 4.2",
        teaser: "What if you have data that should NEVER be modified or sorted? In Lesson 4.2, Tuples guarantee protection!"
      },
      recap: [
        "Slicing uses [start:stop:step] with exclusive stop.",
        "[::-1] is the pythonic idiom to reverse sequences.",
        ".sort() sorts in place; sorted() returns a new list."
      ],
      glossaryTerms: ["list", "index", "mutable", "sequence"],
      concept: `### Lists Deep Dive and Slice Syntax

Slicing is one of Python's most powerful language idioms.

\`\`\`python
data = [10, 20, 30, 40, 50]
print(data[1:4])  # [20, 30, 40]
print(data[:2])   # [10, 20]
print(data[3:])   # [40, 50]
\`\`\``,
      practiceCode: `ranks = ["Gold", "Silver", "Bronze", "Iron", "Stone"]
podium = ranks[:3]
print("Podium finishers:", podium)
print("Reversed ranks:", ranks[::-1])`,
      quizQuestion: "What is data[1:3] for data = [0, 10, 20, 30]?",
      quizOptions: ["[10, 20]", "[0, 10]", "[10, 20, 30]", "[20, 30]"],
      quizAnswerIndex: 0
    },
    {
      id: "l-4-2",
      title: "Lesson 4.2: Tuples and Sets",
      phaseId: "phase-4",
      phaseTitle: "Phase 4: Collections & Mappings",
      description: "Immutable tuples (parentheses) for permanent records and sets (curly braces) for unique collections.",
      hook: "Imagine a GPS coordinate: Latitude 47.6062, Longitude -122.3321. You would never want someone accidentally appending a 3rd number to a GPS coordinate! Tuples are frozen lists that cannot be changed once created.",
      plainEnglish: "A tuple ( ) is an ordered, immutable collection. A set { } is an unordered collection of guaranteed unique elements (no duplicates).",
      codeExample: `# Tuples and Sets
# 1. Tuple: Immutable ordered collection
coordinates = (47.6062, -122.3321)
print("Latitude:", coordinates[0])
# coordinates[0] = 50.0  <- TypeError: tuples are immutable!

# 2. Set: Unique items only (deduplication)
user_ids = [101, 102, 101, 103, 102, 104]
unique_ids = set(user_ids)
print("Original IDs:", user_ids)
print("Unique IDs:  ", unique_ids)`,
      whatJustHappened: [
        "coordinates is a tuple in parentheses. Its values are permanently locked in memory.",
        "set(user_ids) instantly eliminated all duplicate values in O(1) time complexity!"
      ],
      deeperDive: "Sets support set theory math: union (`A | B`), intersection (`A & B`), and difference (`A - B`). Checking `if item in my_set:` takes near-instant time, even with 10 million items!",
      yourTurn: {
        challenge: "Convert raw_tags = ['python', 'ai', 'python', 'code', 'ai'] into a set to find unique tags.",
        starterCode: `raw_tags = ["python", "ai", "python", "code", "ai"]
# Convert to set:
`,
        solutionCode: `raw_tags = ["python", "ai", "python", "code", "ai"]
unique_tags = set(raw_tags)
print(unique_tags)`,
        hints: ["Use set(raw_tags)"]
      },
      quickChecks: [
        {
          question: "Can you change an element of a tuple after it has been created?",
          options: [
            "No, tuples are immutable",
            "Yes, using .append()",
            "Yes, using [0] =",
            "Only if it contains numbers"
          ],
          correctIndex: 0,
          explanation: "Tuples are immutable; once instantiated in memory, their elements cannot be reassigned."
        }
      ],
      commonMistakes: [
        {
          title: "Creating a single-item tuple without a trailing comma",
          badCode: "single = (42)  # This is just the integer 42 inside parentheses!",
          goodCode: "single = (42,) # The trailing comma makes it a tuple",
          explanation: "In Python, a 1-item tuple requires a comma: (item,)."
        }
      ],
      seedsForLater: {
        concept: "Tuple Unpacking in Functions",
        sproutsIn: "Phase 5: Functions & Reusable Blocks",
        teaser: "In Phase 5, functions that return multiple values actually return a tuple that unpacks into separate variables!"
      },
      recap: [
        "Tuples are immutable collections defined with parentheses ( ).",
        "Sets are collections of unique elements defined with { }.",
        "set() is the fastest way to deduplicate a list."
      ],
      glossaryTerms: ["immutable", "sequence", "data-structure"],
      concept: `### Tuples and Sets

Python provides multiple specialized container types beyond lists.

---

#### 1. Tuples
\`\`\`python
rgb_color = (255, 128, 0)
# Fast, immutable, safe
\`\`\`

---

#### 2. Sets
\`\`\`python
fruits = {"apple", "banana", "apple"}
print(fruits)  # {'apple', 'banana'} (duplicate removed)
\`\`\``,
      practiceCode: `screen_res = (1920, 1080)
print(f"Width: {screen_res[0]}px, Height: {screen_res[1]}px")

visitors = ["Alice", "Bob", "Charlie", "Alice", "Bob"]
print(f"Total entries: {len(visitors)}")
print(f"Unique visitors: {len(set(visitors))}")`,
      quizQuestion: "What happens if you add an existing element to a set?",
      quizOptions: [
        "Nothing, sets ignore duplicates silently",
        "It raises a DuplicateError",
        "It overwrites the set",
        "It crashes the script"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-4-3",
      title: "Lesson 4.3: Dictionaries and Key-Value Mapping",
      phaseId: "phase-4",
      phaseTitle: "Phase 4: Collections & Mappings",
      description: "Hash maps: creating dictionaries with {key: value}, lookup with brackets and .get(), updating keys.",
      hook: "In a real dictionary, you don't look up a word by asking: 'Give me word #41,200.' You look it up directly by its spelling: 'algorithm'. Python dictionaries work the exact same way!",
      plainEnglish: "A dictionary is a collection of key-value pairs wrapped in curly braces { }. Each unique key maps directly to a specific value.",
      codeExample: `# Working with Dictionaries
student = {
    "name": "Jordan",
    "major": "Computer Science",
    "gpa": 3.85,
    "enrolled": True
}

# Accessing values
print("Student Name:", student["name"])
print("GPA:", student.get("gpa"))

# Safe lookup with default value (avoids KeyError)
print("Scholarship:", student.get("scholarship", "None"))

# Updating and adding pairs
student["gpa"] = 3.92
student["grad_year"] = 2027

print("Updated profile:", student)`,
      whatJustHappened: [
        "student['name'] fetched 'Jordan'.",
        "student.get('scholarship', 'None') safely returned 'None' without crashing because 'scholarship' doesn't exist yet.",
        "student['grad_year'] = 2027 added a brand-new key-value pair."
      ],
      deeperDive: "Dictionaries use hash tables under the hood. Looking up a key in a dictionary of 1,000,000 items takes the exact same near-zero time as looking up a key in a dictionary of 3 items (O(1) time complexity)!",
      yourTurn: {
        challenge: "Create a dictionary called car with 'brand': 'Toyota' and 'year': 2022. Update 'year' to 2024.",
        starterCode: `# Create car dictionary below:
`,
        solutionCode: `car = {"brand": "Toyota", "year": 2022}
car["year"] = 2024
print(car)`,
        hints: [
          "Use curly braces: car = {'brand': 'Toyota', 'year': 2022}",
          "Update with car['year'] = 2024"
        ]
      },
      quickChecks: [
        {
          question: "What is the safest way to look up a key that might not exist in a dictionary?",
          options: [
            "my_dict.get('key', default_value)",
            "my_dict['key']",
            "my_dict.search('key')",
            "my_dict.find('key')"
          ],
          correctIndex: 0,
          explanation: ".get() safely returns a default value if the key does not exist, whereas bracket notation raises a KeyError."
        }
      ],
      commonMistakes: [
        {
          title: "KeyError when using bracket lookup on missing key",
          badCode: "data = {'name': 'Sam'}\nprint(data['age']) # KeyError: 'age'",
          goodCode: "data = {'name': 'Sam'}\nprint(data.get('age', 0)) # Safe: returns 0",
          explanation: "Use .get() when you are not 100% certain a key exists."
        }
      ],
      seedsForLater: {
        concept: "JSON Data Serialization",
        sproutsIn: "Phase 6: Files & Persistence",
        teaser: "Python dictionaries look and behave almost identically to JSON (JavaScript Object Notation), the data language of the modern internet!"
      },
      recap: [
        "Dictionaries store key-value pairs wrapped in { }.",
        "Keys must be immutable (usually strings); values can be anything.",
        "Use .get(key, default) for safe lookups."
      ],
      glossaryTerms: ["dictionary", "mutable", "data-structure"],
      concept: `### Dictionaries and Key-Value Mapping

Dictionaries (\`dict\`) are Python's implementation of hash maps.

\`\`\`python
profile = {"user": "alex", "level": 12}
print(profile["user"])  # "alex"
profile["level"] += 1   # now 13
\`\`\``,
      practiceCode: `config = {
    "server": "us-west-2",
    "port": 8080,
    "ssl": True
}
print(f"Connecting to {config['server']} on port {config['port']}...")`,
      quizQuestion: "What happens if you run my_dict[\"missing_key\"] when that key is not in the dictionary?",
      quizOptions: [
        "KeyError is raised",
        "Returns None",
        "Creates the key with value 0",
        "Returns False"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-4-4",
      title: "Lesson 4.4: Project: Student Grade Manager",
      phaseId: "phase-4",
      phaseTitle: "Phase 4: Collections & Mappings",
      description: "Capstone Project 4: Build a multi-student grade book combining dictionaries, lists, and summary calculations.",
      hook: "Every university campus and school grading portal uses structured student records: a student has a name, ID, and a list of homework scores. Let's build a real Grade Management engine!",
      plainEnglish: "This project manages a collection of student dictionaries. It iterates through each student, calculates their individual grade average, determines letter grades, and finds the class-wide top performer.",
      codeExample: `# Phase 4 Capstone: Student Grade Manager
classroom = [
    {"name": "Liam", "scores": [88, 92, 79]},
    {"name": "Sophia", "scores": [95, 98, 92]},
    {"name": "Noah", "scores": [72, 68, 80]}
]

print("=" * 40)
print("       CLASS GRADE REPORT")
print("=" * 40)

for student in classroom:
    avg = sum(student["scores"]) / len(student["scores"])
    letter = "A" if avg >= 90 else "B" if avg >= 80 else "C"
    print(f"Student: {student['name']:<10} | Avg: {avg:.1f} ({letter})")

print("=" * 40)`,
      whatJustHappened: [
        "Modeled real database records as a list of dictionaries.",
        "Iterated each record with a for loop.",
        "Used sum() and len() to calculate running averages dynamically."
      ],
      deeperDive: "This structure (a list of dictionaries) is the universal format returned by modern SQL databases, NoSQL databases, and REST APIs worldwide.",
      yourTurn: {
        challenge: "Add a 4th student to the classroom list: Emma with scores [100, 94, 96] and calculate her average.",
        starterCode: `# Append Emma to classroom and calculate average:
`,
        solutionCode: `classroom.append({"name": "Emma", "scores": [100, 94, 96]})
emma_avg = sum(classroom[-1]["scores"]) / len(classroom[-1]["scores"])
print(f"Emma average: {emma_avg:.1f}")`,
        hints: ["classroom.append({'name': 'Emma', 'scores': [100, 94, 96]})"]
      },
      quickChecks: [
        {
          question: "Why is a list of dictionaries such a popular pattern in software engineering?",
          options: [
            "It mirrors standard tabular rows and columns where each row is a record",
            "It takes up zero bytes of memory",
            "It only works with numbers",
            "It is required by the computer monitor"
          ],
          correctIndex: 0,
          explanation: "Each dictionary represents a structured record (row), and the outer list represents the table of rows."
        }
      ],
      commonMistakes: [
        {
          title: "Attempting to index a dictionary with a number instead of a key",
          badCode: "student[0] # KeyError: 0!",
          goodCode: "student['name']",
          explanation: "Dictionaries are keyed by names, not numeric indices (unless the key is explicitly an integer)."
        }
      ],
      seedsForLater: {
        concept: "Object-Oriented Programming (Classes)",
        sproutsIn: "Phase 7: Object-Oriented Programming",
        teaser: "In Phase 7, you will transform student dictionaries into Student objects with methods like `student.get_gpa()`!"
      },
      recap: [
        "You built a multi-student grade manager.",
        "You combined lists of dictionaries to model real data tables.",
        "You completed Phase 4 of Python: Zero to Pro!"
      ],
      glossaryTerms: ["dictionary", "list", "algorithm", "program"],
      concept: `### Project: Student Grade Manager

Synthesizing lists, dictionaries, slicing, and accumulation into a cohesive grade management report.`,
      practiceCode: `records = [
    {"item": "Laptop", "price": 1200, "qty": 4},
    {"item": "Monitor", "price": 300, "qty": 8}
]
for r in records:
    val = r["price"] * r["qty"]
    print(f"{r['item']}: \${val}")`,
      quizQuestion: "What is classroom[0][\"name\"] if classroom = [{\"name\": \"Alice\"}]?",
      quizOptions: ["\"Alice\"", "0", "{\"name\": \"Alice\"}", "Error"],
      quizAnswerIndex: 0
    }
  ]
};

export const PHASE_5_MODULE: LessonModule = {
  id: "phase-5",
  title: "Phase 5: Functions & Reusable Blocks",
  description: "Defining functions with def, parameters vs arguments, return values, default arguments, and docstrings.",
  lessons: [
    {
      id: "l-5-1",
      title: "Lesson 5.1: Defining Functions",
      phaseId: "phase-5",
      phaseTitle: "Phase 5: Functions & Reusable Blocks",
      description: "Encapsulate logic into reusable mini-machines with def, parameters, and calling syntax.",
      hook: "Imagine building a house where you had to manufacture every single nail and lightbulb from scratch every time you moved to a new room. You would never finish! In programming, functions are pre-fabricated components you build once and reuse thousands of times.",
      plainEnglish: "A function is a named block of code that only runs when called. You define it with 'def' and invoke it with parentheses ( ).",
      codeExample: `# Defining and Calling Functions
def greet_user(name, title="Student"):
    print(f"Welcome, {title} {name}!")
    print("Your workspace is ready.")

# Calling the function multiple times
greet_user("Alex")
greet_user("Sarah", title="Professor")`,
      whatJustHappened: [
        "def greet_user(...) declared the blueprint.",
        "Calling greet_user('Alex') executed the block with name = 'Alex'.",
        "title='Student' provided a default value when title wasn't specified."
      ],
      deeperDive: "Variables created inside a function are local to that function. Once the function finishes running, those local variables evaporate from memory (local scope)!",
      yourTurn: {
        challenge: "Define a function calculate_area(width, height) that prints width * height.",
        starterCode: `# Define calculate_area below:
`,
        solutionCode: `def calculate_area(width, height):
    print("Area:", width * height)

calculate_area(5, 10)`,
        hints: ["def calculate_area(width, height): print('Area:', width * height)"]
      },
      quickChecks: [
        {
          question: "What keyword is used to define a new function in Python?",
          options: ["def", "function", "fn", "create"],
          correctIndex: 0,
          explanation: "In Python, functions are always defined with 'def' (short for define)."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting parentheses when calling a function",
          badCode: "greet_user # Does nothing! Just mentions the function object",
          goodCode: "greet_user() # Executes the function",
          explanation: "You must include parentheses () to invoke a function."
        }
      ],
      seedsForLater: {
        concept: "The return Statement",
        sproutsIn: "Phase 5: Lesson 5.2 (The Next Lesson!)",
        teaser: "Functions shouldn't just print things; they should hand values back to whoever called them. In Lesson 5.2, you will master 'return'!"
      },
      recap: [
        "def function_name(parameters): defines a function.",
        "Call functions with function_name(arguments).",
        "Default parameters provide fallback values."
      ],
      glossaryTerms: ["function", "parameter", "argument", "scope"],
      concept: `### Defining Functions

Functions allow you to organize code into modular, maintainable, and reusable blocks.

\`\`\`python
def square(x):
    return x * x

print(square(4))  # 16
\`\`\``,
      practiceCode: `def send_alert(message, urgency="INFO"):
    print(f"[{urgency}] {message}")

send_alert("System started")
send_alert("Disk near capacity", urgency="WARNING")`,
      quizQuestion: "What happens if you define a function but never call it?",
      quizOptions: [
        "It is stored in memory but never executes",
        "It runs automatically at the end",
        "It raises a SyntaxError",
        "It deletes other functions"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-5-2",
      title: "Lesson 5.2: Return Values and Tuple Unpacking",
      phaseId: "phase-5",
      phaseTitle: "Phase 5: Functions & Reusable Blocks",
      description: "Returning calculated results back to callers with return, and returning multiple values via tuple unpacking.",
      hook: "When you send a calculator expression: 5 + 5, you don't want the calculator to merely display 10 on a billboard and forget it; you want the calculator to hand you the number 10 so you can use it in your taxes! That is the return statement.",
      plainEnglish: "The return keyword ends function execution and hands a value back to the caller.",
      codeExample: `# Functions with return values
def convert_currency(usd, rate=0.92):
    return usd * rate

def get_min_and_max(numbers):
    return min(numbers), max(numbers)  # Returns a tuple!

euros = convert_currency(100)
print(f"100 USD = {euros:.2f} EUR")

lowest, highest = get_min_and_max([14, 5, 88, 32])
print("Lowest:", lowest, "| Highest:", highest)`,
      whatJustHappened: [
        "convert_currency returned a float that was stored in euros.",
        "get_min_and_max returned two values (a tuple) that unpacked directly into lowest and highest."
      ],
      deeperDive: "If a function reaches the end of its body without a return statement, it secretly returns `None`. `None` is Python's way of saying 'nothing' or 'empty'.",
      yourTurn: {
        challenge: "Write a function add(a, b) that returns the sum of a and b.",
        starterCode: `# Write add function:
`,
        solutionCode: `def add(a, b):
    return a + b

print(add(15, 25))`,
        hints: ["def add(a, b): return a + b"]
      },
      quickChecks: [
        {
          question: "What happens to code placed inside a function directly below a return statement?",
          options: [
            "It is unreachable and will never execute",
            "It runs before the return",
            "It runs twice",
            "It creates an infinite loop"
          ],
          correctIndex: 0,
          explanation: "return immediately exits the function, rendering any subsequent lines inside that block unreachable."
        }
      ],
      commonMistakes: [
        {
          title: "Confusing print() with return",
          badCode: "def add(a, b): print(a + b)\nval = add(2, 3) # val is None!",
          goodCode: "def add(a, b): return a + b\nval = add(2, 3) # val is 5",
          explanation: "print() only displays text to human eyes. return hands the value back to code."
        }
      ],
      seedsForLater: {
        concept: "Object Methods",
        sproutsIn: "Phase 7: Object-Oriented Programming",
        teaser: "Methods in Phase 7 are functions that live inside classes and return object states!"
      },
      recap: [
        "return hands a value back to the caller and exits the function.",
        "You can return multiple values separated by commas.",
        "Functions without a return statement implicitly return None."
      ],
      glossaryTerms: ["return", "function", "expression"],
      concept: `### Return Values and Tuple Unpacking

Functions that compute and return values can be composed together into powerful pipelines.`,
      practiceCode: `def calculate_discount(price, discount_pct):
    savings = price * (discount_pct / 100)
    final_price = price - savings
    return final_price, savings

final, saved = calculate_discount(120.00, 25)
print(f"Final Price: \${final:.2f} (You saved \${saved:.2f})")`,
      quizQuestion: "What is returned by a function that contains no return statement?",
      quizOptions: ["None", "0", "False", "\"\""],
      quizAnswerIndex: 0
    },
    {
      id: "l-5-3",
      title: "Lesson 5.3: Docstrings and Clean Function Design",
      phaseId: "phase-5",
      phaseTitle: "Phase 5: Functions & Reusable Blocks",
      description: "Writing documentation strings (triple quotes), type annotations, and single-responsibility functions.",
      hook: "Have you ever hovered your cursor over a function in VS Code and a helpful tooltip appeared explaining what it does? That tooltip was generated from the developer's docstring!",
      plainEnglish: "A docstring is a triple-quoted string (\"\"\"...\"\"\") placed immediately inside a function header to document what the function does, its parameters, and its return value.",
      codeExample: `# Professional Docstrings and Type Hints
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate Body Mass Index (BMI).
    
    Parameters:
        weight_kg: Weight of individual in kilograms.
        height_m: Height of individual in meters.
        
    Returns:
        The calculated BMI as a floating-point number.
    """
    return weight_kg / (height_m ** 2)

bmi = calculate_bmi(70.0, 1.75)
print(f"Calculated BMI: {bmi:.1f}")`,
      whatJustHappened: [
        "Used triple quotes to document the function.",
        "Included type hints (weight_kg: float) for clean editor auto-complete.",
        "help(calculate_bmi) in standard Python will print this exact manual!"
      ],
      deeperDive: "Single Responsibility Principle (SRP): A good function should do exactly ONE thing, and do it well. If your function is doing math, saving a file, AND printing a report, break it into 3 smaller functions!",
      yourTurn: {
        challenge: "Write a function greet(name) with a clean docstring explaining what it does.",
        starterCode: `# Write greet with docstring:
`,
        solutionCode: `def greet(name: str) -> str:
    """Return a personalized greeting message."""
    return f"Hello, {name}!"

print(greet("Amina"))`,
        hints: ["Place \"\"\"Docstring\"\"\" immediately on line 2 inside def."]
      },
      quickChecks: [
        {
          question: "How are Python docstrings delimited?",
          options: [
            "With triple quotation marks (\"\"\" or ''')",
            "With # symbols on every line",
            "With /* and */",
            "With <doc> and </doc>"
          ],
          correctIndex: 0,
          explanation: "Python docstrings are multi-line strings enclosed in triple double quotes (\"\"\") or triple single quotes (''')."
        }
      ],
      commonMistakes: [
        {
          title: "Placing docstring above the def line",
          badCode: "\"\"\"My Docstring\"\"\"\ndef func(): pass",
          goodCode: "def func():\n    \"\"\"My Docstring\"\"\"\n    pass",
          explanation: "A docstring MUST be the very first statement INSIDE the function body."
        }
      ],
      seedsForLater: {
        concept: "Class Docstrings",
        sproutsIn: "Phase 7: Object-Oriented Programming",
        teaser: "Classes in Phase 7 use docstrings to document entire object architecture!"
      },
      recap: [
        "Docstrings document function purpose, parameters, and returns.",
        "Type hints (x: int -> str) communicate clear expectations.",
        "Design functions to obey the Single Responsibility Principle."
      ],
      glossaryTerms: ["function", "comment", "syntax"],
      concept: `### Docstrings and Clean Function Design

Professional software engineering requires clear documentation.`,
      practiceCode: `def is_even(number: int) -> bool:
    """Check if a number is divisible by 2."""
    return number % 2 == 0

print("Is 14 even?", is_even(14))
print("Is 21 even?", is_even(21))`,
      quizQuestion: "Where must a function docstring be placed?",
      quizOptions: [
        "As the first line inside the indented function body",
        "Above the def line",
        "At the very bottom of the file",
        "Outside the function"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-5-4",
      title: "Lesson 5.4: Project: Dynamic Quiz Application",
      phaseId: "phase-5",
      phaseTitle: "Phase 5: Functions & Reusable Blocks",
      description: "Capstone Project 5: Build a modular quiz game with question functions, score evaluators, and report generators.",
      hook: "You now know variables, decisions, loops, lists, dictionaries, and functions. Let's assemble a complete interactive Quiz Engine with modular functions!",
      plainEnglish: "This project uses clean helper functions: ask_question(), calculate_score(), and render_report() to execute an interactive quiz challenge.",
      codeExample: `# Phase 5 Capstone: Modular Quiz Engine
def evaluate_answer(user_choice, correct_choice):
    """Check if the user answer matches the correct choice."""
    return user_choice.strip().upper() == correct_choice.strip().upper()

def run_quiz(questions):
    """Run interactive question evaluation pipeline."""
    score = 0
    for q in questions:
        print(f"\\nQuestion: {q['prompt']}")
        for opt in q["options"]:
            print(f"  {opt}")
        # Simulated answer for demonstration
        user_pick = q["correct"]
        if evaluate_answer(user_pick, q["correct"]):
            print("Status: Correct!")
            score += 1
        else:
            print("Status: Incorrect.")
    return score

quiz_bank = [
    {
        "prompt": "What keyword defines a function?",
        "options": ["A) def", "B) function", "C) fn"],
        "correct": "A"
    },
    {
        "prompt": "Which symbol is used for floor division?",
        "options": ["A) /", "B) //", "C) %"],
        "correct": "B"
    }
]

total = run_quiz(quiz_bank)
print(f"\\nFinal Score: {total}/{len(quiz_bank)}")`,
      whatJustHappened: [
        "Created small single-responsibility functions.",
        "Used return values to accumulate score metrics.",
        "Decoupled quiz data (quiz_bank) from quiz logic (run_quiz)."
      ],
      deeperDive: "Separating data from logic is the foundational rule of software architecture. If you want to add 100 new questions, you only change quiz_bank; you never touch run_quiz()!",
      yourTurn: {
        challenge: "Add a 3rd question to quiz_bank testing Booleans (True/False).",
        starterCode: `# Add a 3rd question:
`,
        solutionCode: `quiz_bank.append({
    "prompt": "What data type represents True or False?",
    "options": ["A) int", "B) bool", "C) str"],
    "correct": "B"
})
print("Total questions in bank:", len(quiz_bank))`,
        hints: ["Add another dictionary with prompt, options, and correct."]
      },
      quickChecks: [
        {
          question: "What is the primary architectural advantage of decoupling data from logic?",
          options: [
            "You can add or update content without risking bugs in core execution logic",
            "It makes Python run 100x faster",
            "It eliminates the need for functions",
            "It uses less battery"
          ],
          correctIndex: 0,
          explanation: "Separating content from code ensures you can scale datasets safely without altering working algorithms."
        }
      ],
      commonMistakes: [
        {
          title: "Hardcoding questions directly inside the function",
          badCode: "def quiz(): print('Q1...'); print('Q2...')",
          goodCode: "def quiz(question_list): for q in question_list: ...",
          explanation: "Pass data into functions via parameters so they remain reusable."
        }
      ],
      seedsForLater: {
        concept: "Object Oriented Design (Phase 7)",
        sproutsIn: "Phase 7: Object-Oriented Programming",
        teaser: "In Phase 7, you will package questions and quiz state into an interactive QuizGame class!"
      },
      recap: [
        "You built a modular quiz engine using functions.",
        "You separated data structures from algorithm execution.",
        "You completed Phase 5 of Python: Zero to Pro!"
      ],
      glossaryTerms: ["function", "return", "list", "dictionary"],
      concept: `### Project: Dynamic Quiz Application

A synthesis of modular functional decomposition.`,
      practiceCode: `def grade_quiz(score, total):
    pct = (score / total) * 100
    passed = pct >= 70
    return pct, passed

pct, passed = grade_quiz(4, 5)
print(f"Result: {pct:.0f}% | Passed: {passed}")`,
      quizQuestion: "What does evaluate_answer('A', 'a') return if using .upper()?",
      quizOptions: ["True", "False", "Error", "None"],
      quizAnswerIndex: 0
    }
  ]
};
