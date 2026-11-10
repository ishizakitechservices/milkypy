import { LessonModule } from "../../types";

export const MRCET_UNIT_4_MODULE: LessonModule = {
  id: "mrcet-unit-4",
  title: "Unit IV: Lists, Tuples & Dictionaries (MRCET R17A0554)",
  description: "Lists (operations, slices, methods, mutability, aliasing, cloning, parameters, comprehensions), Tuples (assignment, return values, comprehension), and Dictionaries (operations, methods, comprehension).",
  mrcetUnit: "UNIT IV",
  lessons: [
    {
      id: "l-mrcet-4-1",
      title: "Unit 4.1: List Operations, Mutability, Aliasing & Cloning",
      phaseId: "mrcet-unit-4",
      phaseTitle: "Unit IV: Lists, Tuples & Dictionaries (MRCET R17A0554)",
      mrcetUnit: "UNIT IV",
      mrcetTopic: "Lists: list operations, list slices, list methods, list loop, mutability, aliasing, cloning lists",
      description: "Understand list mutability, the aliasing trap (shared object references in RAM), safe list cloning techniques, and essential list methods.",
      hook: "If you give someone the WiFi password to your router, you both connect to the same router; you didn't create a new internet connection! In Python, writing 'b = a' with a list does not duplicate the list. It creates an alias pointing to the exact same list in RAM.",
      plainEnglish: "Lists are mutable sequences. Aliasing means two variable names reference the identical list in memory. To create an independent duplicate, you must clone the list.",
      codeExample: `# MRCET Unit IV: List Aliasing vs Cloning
# 1. Aliasing Trap
a = [10, 20, 30]
alias_b = a  # alias_b points to the exact same object in RAM!
alias_b.append(99)

print("Original list 'a':      ", a)        # [10, 20, 30, 99]
print("Alias list 'alias_b':   ", alias_b)  # [10, 20, 30, 99]
print("Are they same object?   ", a is alias_b) # True (id matches)

# 2. Cloning Lists (Safe copies)
clone_slice = a[:]          # Slice copy
clone_constructor = list(a) # Constructor copy
import copy
clone_copy = copy.copy(a)   # copy module

clone_slice.append(1000)
print("\\nOriginal remains safe:  ", a)
print("Clone has its own data: ", clone_slice)
print("Are they same object?   ", a is clone_slice) # False!

# 3. List Operations and Methods
courses = ["Data Structures", "Python", "OS"]
courses.insert(1, "DBMS")
courses.extend(["Java", "Web Tech"])
courses.remove("OS")
popped = courses.pop()

print("\\nFinal courses roster:   ", courses)
print("Popped item:            ", popped)`,
      whatJustHappened: [
        "Demonstrated aliasing: modifying alias_b modified 'a' simultaneously.",
        "Demonstrated cloning via a[:], list(a), and copy.copy().",
        "Modifying clone_slice left the original 'a' completely unaffected.",
        "Exercised list methods: .insert(), .extend(), .remove(), and .pop()."
      ],
      deeperDive: "If a list contains nested lists (e.g., `matrix = [[1, 2], [3, 4]]`), shallow cloning (`matrix[:]`) only copies the outer list; the inner sub-lists are still aliased! To create a completely isolated copy of nested structures, use `copy.deepcopy(matrix)`.",
      yourTurn: {
        challenge: "Clone students = ['Alice', 'Bob'] into new_group using slice syntax, then append 'Charlie' to new_group only.",
        starterCode: `students = ["Alice", "Bob"]
# Clone using slice syntax:
new_group = 

# Append Charlie to new_group:

print("Original:", students)
print("New Group:", new_group)
`,
        solutionCode: `students = ["Alice", "Bob"]
new_group = students[:]
new_group.append("Charlie")
print("Original:", students)
print("New Group:", new_group)`,
        hints: ["new_group = students[:]", "new_group.append('Charlie')"]
      },
      quickChecks: [
        {
          question: "What does the expression 'id(a) == id(b)' evaluate to when b is an alias of a?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 0,
          explanation: "Aliases share the exact same memory address, meaning id(a) and id(b) are identical."
        }
      ],
      commonMistakes: [
        {
          title: "Confusing list aliasing with list cloning",
          badCode: "a = [1, 2]\nb = a\nb.clear() # Erases 'a' completely as well!",
          goodCode: "a = [1, 2]\nb = a[:]\nb.clear() # 'a' is preserved safe",
          explanation: "Assignment (=) binds a pointer; slicing ([:]) allocates a fresh list."
        }
      ],
      recap: [
        "b = a creates an alias (shared memory reference).",
        "b = a[:] creates a shallow clone.",
        "copy.deepcopy() is required for nested lists.",
        "List methods mutate lists in place."
      ],
      glossaryTerms: ["list", "mutable", "aliasing", "cloning"],
      concept: `### Unit 4.1: List Reference Architecture

From the MRCET B.Tech Python Programming (R17A0554) Syllabus:

#### Aliasing vs Cloning Comparison Table:
| Operation | Syntax | Memory Address | Independence |
| :--- | :--- | :--- | :--- |
| **Aliasing** | \`b = a\` | \`id(a) == id(b)\` | Shared (Modifying one affects both) |
| **Shallow Clone** | \`b = a[:]\` | \`id(a) != id(b)\` | Independent 1st-level elements |
| **Constructor** | \`b = list(a)\` | \`id(a) != id(b)\` | Independent 1st-level elements |
| **Deep Copy** | \`copy.deepcopy(a)\`| \`id(a) != id(b)\` | Completely recursive independence |
`,
      practiceCode: `# Aliasing verification with id()
x = [10, 20]
y = x
z = x[:]
print(f"id(x): {id(x)}")
print(f"id(y): {id(y)} (Matches x)")
print(f"id(z): {id(z)} (Different memory address)")`,
      quizQuestion: "Which statement correctly creates a clone of list 'records'?",
      quizOptions: ["records_copy = records[:]", "records_copy = records", "records_copy = &records", "records_copy = records.clone()"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-4-2",
      title: "Unit 4.2: List Parameters & List Comprehensions",
      phaseId: "mrcet-unit-4",
      phaseTitle: "Unit IV: Lists, Tuples & Dictionaries (MRCET R17A0554)",
      mrcetUnit: "UNIT IV",
      mrcetTopic: "List parameters, in-place modification, list comprehension",
      description: "Master passing lists into functions as parameters (pass-by-object-reference) and crafting elegant, declarative list comprehensions with filters.",
      hook: "In old procedural languages, filtering a list of 100 students to find those with honors grades took 6 lines of loop boilerplate. In Python, list comprehensions let you write that entire transformation in a single readable line!",
      plainEnglish: "When you pass a list into a function, the function receives a reference to that list and can modify it in place. List comprehensions provide concise syntax to build new lists from existing iterables.",
      codeExample: `# MRCET Unit IV: List Parameters & List Comprehension
# 1. Lists as Function Parameters (Pass-by-Object-Reference)
def apply_grace_marks(marks_list, grace=5):
    """Mutates marks_list in-place by adding grace marks capped at 100."""
    for i in range(len(marks_list)):
        marks_list[i] = min(100, marks_list[i] + grace)

student_scores = [45, 68, 72, 89, 97]
print("Scores before grace marks:", student_scores)
apply_grace_marks(student_scores, grace=4)
print("Scores after in-place edit:", student_scores)

# 2. List Comprehensions: [expression for item in iterable if condition]
# Generating squares of even numbers 1..10
even_squares = [x ** 2 for x in range(1, 11) if x % 2 == 0]
print("\\nEven squares (2^2, 4^2, 6^2, 8^2, 10^2):", even_squares)

# Transforming student names to uppercase
raw_names = ["kavya", "rahul", "ananya", "siddharth"]
formatted_names = [name.capitalize() for name in raw_names]
print("Formatted MRCET Names:", formatted_names)`,
      whatJustHappened: [
        "apply_grace_marks modified the caller's student_scores list in-place.",
        "List comprehension [x**2 for x in range(1, 11) if x % 2 == 0] filtered and mapped numbers concisely.",
        "[name.capitalize() ...] transformed every string in the collection in one line."
      ],
      deeperDive: "List comprehensions are not just syntactic sugar—they are optimized in Python bytecode! A list comprehension runs faster than an explicit `for` loop with `.append()` because the bytecode loop avoids repeated global attribute lookups.",
      yourTurn: {
        challenge: "Use list comprehension to extract only the numbers greater than 50 from nums = [12, 67, 34, 89, 45, 99].",
        starterCode: `nums = [12, 67, 34, 89, 45, 99]
# List comprehension:
over_50 = 

print(over_50)
`,
        solutionCode: `nums = [12, 67, 34, 89, 45, 99]
over_50 = [x for x in nums if x > 50]
print(over_50)`,
        hints: ["Use [x for x in nums if x > 50]"]
      },
      quickChecks: [
        {
          question: "What does the comprehension [x * 2 for x in [1, 2, 3]] evaluate to?",
          options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "[2, 2, 2]", "[1, 4, 9]"],
          correctIndex: 0,
          explanation: "The expression doubles each element x, producing [2, 4, 6]."
        }
      ],
      commonMistakes: [
        {
          title: "Over-complicating list comprehensions with nested logic",
          badCode: "[x for x in [y for y in data if y > 0] if x < 100] # Unreadable!",
          goodCode: "[x for x in data if 0 < x < 100] # Clean single comprehension",
          explanation: "Keep comprehensions concise; if logic spans multiple lines, prefer a standard for loop."
        }
      ],
      recap: [
        "Functions can mutate lists passed as parameters in-place.",
        "List comprehensions follow: [expr for item in iterable if condition].",
        "Comprehensions are faster and more pythonic than manual append loops."
      ],
      glossaryTerms: ["comprehension", "parameter", "list", "sequence"],
      concept: `### Unit 4.2: List Comprehensions Syntax

\`\`\`python
# Standard Syntax:
new_list = [expression for item in iterable if condition]

# Equivalent procedural loop:
new_list = []
for item in iterable:
    if condition:
        new_list.append(expression)
\`\`\`
`,
      practiceCode: `# Filtering words by length
words = ["Python", "MRCET", "AI", "Engineering", "Code"]
long_words = [w for w in words if len(w) > 4]
print("Words with > 4 characters:", long_words)`,
      quizQuestion: "What is returned by [i for i in range(5) if i % 2 == 1]?",
      quizOptions: ["[1, 3]", "[0, 2, 4]", "[1, 2, 3, 4]", "[2, 4]"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-4-3",
      title: "Unit 4.3: Tuples: Assignment, Return Values & Comprehension",
      phaseId: "mrcet-unit-4",
      phaseTitle: "Unit IV: Lists, Tuples & Dictionaries (MRCET R17A0554)",
      mrcetUnit: "UNIT IV",
      mrcetTopic: "Tuples: tuple assignment, tuple as return value, tuple comprehension",
      description: "Understand tuples: immutability, tuple assignment / unpacking, functions returning multiple values, and generator-based tuple comprehension.",
      hook: "Imagine printing a boarding pass with your flight number and seat: (Flight='AI-101', Seat='12B'). You would never want someone changing your seat to 45F mid-flight! Tuples are permanent, immutable sequences that protect critical data from accidental alterations.",
      plainEnglish: "A tuple is an ordered, immutable sequence enclosed in parentheses (). Once created, elements cannot be added, removed, or reassigned.",
      codeExample: `# MRCET Unit IV: Tuples Mastery
# 1. Tuple Assignment (Variable Swapping)
a = "CSE"
b = "ECE"
print(f"Before swap: a={a}, b={b}")
a, b = b, a  # Tuple assignment swaps values atomically!
print(f"After swap:  a={a}, b={b}")

# 2. Tuple as Function Return Value
def analyze_marks(scores):
    """Returns total, average, lowest, and highest as a 4-tuple."""
    return sum(scores), sum(scores)/len(scores), min(scores), max(scores)

total, avg, low, high = analyze_marks([78, 85, 92, 64, 88])
print(f"\\nMarks Analysis -> Total: {total}, Avg: {avg:.1f}, Min: {low}, Max: {high}")

# 3. Tuple Comprehension (via Generator Expression)
# Generator expression inside tuple constructor
cubes_tuple = tuple(x**3 for x in range(1, 6))
print("\\nTuple comprehension:", cubes_tuple)`,
      whatJustHappened: [
        "a, b = b, a performed atomic tuple variable swapping without temporary variables.",
        "analyze_marks returned a tuple of 4 values that unpacked directly into separate variables.",
        "tuple(x**3 for x in range(1, 6)) evaluated a comprehension into an immutable tuple."
      ],
      deeperDive: "Because tuples are immutable, they are hashable (provided their contents are hashable). This means tuples can be used as keys in dictionaries, whereas lists can never be dictionary keys.",
      yourTurn: {
        challenge: "Write a function get_point() that returns coordinates (10, 20) as a tuple, and unpack it into x and y.",
        starterCode: `def get_point():
    # Return 10, 20:
    pass

# Unpack into x, y:

`,
        solutionCode: `def get_point():
    return 10, 20

x, y = get_point()
print(f"x={x}, y={y}")`,
        hints: ["return 10, 20", "x, y = get_point()"]
      },
      quickChecks: [
        {
          question: "Can an element of a tuple be modified after creation (e.g. t[0] = 5)?",
          options: [
            "No, tuples are immutable and raise TypeError",
            "Yes, using .append()",
            "Yes, if it contains numbers",
            "Only on Tuesdays"
          ],
          correctIndex: 0,
          explanation: "Tuples are immutable; their elements cannot be reassigned once instantiated."
        }
      ],
      commonMistakes: [
        {
          title: "Creating a single-element tuple without a trailing comma",
          badCode: "t = (5)  # This is just an integer in parentheses!",
          goodCode: "t = (5,) # The trailing comma makes it a tuple",
          explanation: "In Python, a 1-item tuple requires a comma: (item,)."
        }
      ],
      recap: [
        "Tuples are immutable and defined with parentheses ().",
        "a, b = b, a uses tuple assignment to swap variables.",
        "Functions return multiple values packed as tuples.",
        "Tuples can be dictionary keys because they are hashable."
      ],
      glossaryTerms: ["tuple", "immutable", "assignment"],
      concept: `### Unit 4.3: Tuple Assignment & Operations

\`\`\`python
# Swapping variables without temporary variable:
a, b = b, a

# Unpacking returned tuple:
def get_user():
    return "kavya", "19A0554", 8.8

name, roll, gpa = get_user()
\`\`\`
`,
      practiceCode: `# Tuple immutability test
tup = (10, 20, 30)
print("Tuple length:", len(tup))
print("Index of 20: ", tup.index(20))
print("Count of 10: ", tup.count(10))`,
      quizQuestion: "What is the data type of x in: x = (42,)?",
      quizOptions: ["tuple", "int", "list", "set"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-4-4",
      title: "Unit 4.4: Dictionaries: Operations, Methods & Comprehension",
      phaseId: "mrcet-unit-4",
      phaseTitle: "Unit IV: Lists, Tuples & Dictionaries (MRCET R17A0554)",
      mrcetUnit: "UNIT IV",
      mrcetTopic: "Dictionaries: operations and methods, comprehension",
      description: "Master dictionary operations, hash lookups, essential methods (.keys, .values, .items, .get, .update, .pop), and dictionary comprehensions.",
      hook: "Imagine looking up a phone number in a contact list of 1,000,000 people. If you scan from the first contact to the last, it takes 15 minutes. A dictionary uses a hash function to jump to the contact instantly in 1 microsecond! That is O(1) hash table lookup.",
      plainEnglish: "A dictionary is a collection of key-value pairs wrapped in {}. Keys must be immutable and unique. Values can be of any data type.",
      codeExample: `# MRCET Unit IV: Dictionaries Operations & Methods
student_record = {
    "roll_no": "19A0554",
    "name": "Kiran Kumar",
    "branch": "CSE",
    "semester": 6,
    "cgpa": 8.45
}

# 1. Methods: .keys(), .values(), .items()
print("Keys:   ", list(student_record.keys()))
print("Values: ", list(student_record.values()))

# Safe lookup with default fallback
grade = student_record.get("grade", "Awaiting Evaluation")
print("Grade:  ", grade)

# 2. Iterating with .items()
print("\\n--- Student Details ---")
for key, val in student_record.items():
    print(f"{key.upper()}: {val}")

# 3. Updating and Deleting
student_record.update({"attendance": "84%"})
popped_val = student_record.pop("semester")
print(f"\\nPopped semester: {popped_val}")

# 4. Dictionary Comprehension
# Creating a mapping of numbers to their cubes
cubes_dict = {n: n**3 for n in range(1, 6)}
print("\\nCubes Dictionary:", cubes_dict)

# Inverting a dictionary (swapping keys and values):
codes = {"CSE": "05", "ECE": "04", "EEE": "02"}
inverted_codes = {v: k for k, v in codes.items()}
print("Inverted Codes:", inverted_codes)`,
      whatJustHappened: [
        "student_record.keys() and .values() retrieved dictionary components.",
        "student_record.get('grade', 'Awaiting Evaluation') retrieved values safely without KeyError.",
        "for key, val in student_record.items() unpacked key-value pairs in a loop.",
        "Dictionary comprehension generated cubes_dict and inverted_codes."
      ],
      deeperDive: "In Python 3.7+, dictionaries preserve insertion order. Under the hood, Python uses an open-addressed hash table with quadratic probing, delivering average O(1) time complexity for lookup, insertion, and deletion.",
      yourTurn: {
        challenge: "Use dictionary comprehension to build a dict mapping words = ['cat', 'elephant', 'dog'] to their string lengths.",
        starterCode: `words = ["cat", "elephant", "dog"]
# Dictionary comprehension:
word_lengths = 

print(word_lengths)
`,
        solutionCode: `words = ["cat", "elephant", "dog"]
word_lengths = {w: len(w) for w in words}
print(word_lengths)`,
        hints: ["{w: len(w) for w in words}"]
      },
      quickChecks: [
        {
          question: "Which dictionary method safely returns a default value if the key does not exist?",
          options: [
            ".get(key, default)",
            ".search(key)",
            ".find(key)",
            ".lookup(key)"
          ],
          correctIndex: 0,
          explanation: "dict.get(key, default) returns default if key is not found, avoiding a KeyError exception."
        }
      ],
      commonMistakes: [
        {
          title: "Accessing a non-existent key using bracket notation",
          badCode: "d = {'a': 1}\nprint(d['b']) # KeyError: 'b'!",
          goodCode: "print(d.get('b', 'default')) # Safe fallback without crash",
          explanation: "Use .get() when a key might not be present in the dictionary."
        }
      ],
      recap: [
        "Dictionaries store key: value mappings in curly braces {}.",
        "Keys must be unique and hashable (immutable).",
        ".items() yields (key, value) pairs for iteration.",
        "Dictionary comprehensions build transformed maps concisely."
      ],
      glossaryTerms: ["dictionary", "hash", "key", "comprehension"],
      concept: `### Unit 4.4: Dictionary Methods Reference

| Method | Description |
| :--- | :--- |
| \`d.get(key, default)\` | Safe retrieval |
| \`d.keys()\` | View of dictionary keys |
| \`d.values()\` | View of dictionary values |
| \`d.items()\` | View of \`(key, value)\` pairs |
| \`d.update(other)\` | Merge with another dictionary |
| \`d.pop(key)\` | Remove key and return value |
| \`d.clear()\` | Remove all elements |
`,
      practiceCode: `# Computing character frequency
message = "mrcet autonomous"
freq = {}
for ch in message:
    freq[ch] = freq.get(ch, 0) + 1
print("Character Frequencies:", freq)`,
      quizQuestion: "What is returned by {k: k*2 for k in range(3)}[2]?",
      quizOptions: ["4", "2", "0", "KeyError"],
      quizAnswerIndex: 0
    }
  ]
};

export const MRCET_UNIT_5_MODULE: LessonModule = {
  id: "mrcet-unit-5",
  title: "Unit V: Files, Exceptions, Modules & Packages (MRCET R17A0554)",
  description: "Text files, file I/O, command line arguments (sys.argv, getopt), errors & exception handling (try-except-finally), standard modules (datetime, time, os, calendar, math), and package architecture.",
  mrcetUnit: "UNIT V",
  lessons: [
    {
      id: "l-mrcet-5-1",
      title: "Unit 5.1: Text Files, Reading/Writing & File Positions",
      phaseId: "mrcet-unit-5",
      phaseTitle: "Unit V: Files, Exceptions, Modules & Packages (MRCET R17A0554)",
      mrcetUnit: "UNIT V",
      mrcetTopic: "Files and exception: text files, reading and writing files",
      description: "Master persistent storage: file modes ('r', 'w', 'a'), methods (.read, .readline, .readlines, .write), file pointers (tell, seek), and context managers.",
      hook: "Everything stored in variables vanishes when your computer turns off. To keep medical records, bank accounts, or high scores permanently, programs write to disk storage. Understanding file streams is the doorway to persistent software.",
      plainEnglish: "Python interacts with files using the open() function. The 'with open(...)' context manager guarantees files are closed cleanly, preventing resource leaks.",
      codeExample: `# MRCET Unit V: Text Files & File Operations Simulation
# Standard File Modes in Python:
# 'r' = read (default)
# 'w' = write (truncates/overwrites file)
# 'a' = append (writes to the end of file)
# 'r+' = read and write

# File I/O Simulation
filename = "mrcet_students.txt"
content = "Roll: 19A0554 | Name: Sneha | Branch: CSE\\nRoll: 19A0555 | Name: Arjun | Branch: CSE\\n"

print("=== Simulating File Write ('w' mode) ===")
print(f"Writing {len(content)} characters to '{filename}'...")
# In local Python:
# with open(filename, "w") as f:
#     f.write(content)
print("Write completed successfully.")

print("\\n=== Simulating File Read & Methods ===")
# f.read() -> entire file as string
# f.readline() -> single line
# f.readlines() -> list of lines
lines = content.strip().split("\\n")
print(f"Read {len(lines)} records using simulated readlines():")
for idx, line in enumerate(lines, 1):
    print(f"  Line {idx}: {line}")

# File pointer tracking: tell() and seek()
print("\\n=== File Pointer Operations (tell & seek) ===")
print("f.tell() -> returns current byte offset within the file stream.")
print("f.seek(offset, whence) -> repositions the pointer to offset byte.")
print("  whence: 0 (start of file), 1 (current position), 2 (end of file).")`,
      whatJustHappened: [
        "Reviewed standard file modes: 'r', 'w', 'a', 'r+'.",
        "Demonstrated writing strings and reading lines.",
        "Examined file pointer tracking via f.tell() and f.seek()."
      ],
      deeperDive: "Always use `with open(...) as f:` instead of `f = open(...)`. The `with` statement utilizes Python's context manager protocol (`__enter__` and `__exit__`), guaranteeing that the operating system file descriptor is closed even if an unhandled exception crashes your script inside the block.",
      yourTurn: {
        challenge: "Simulate formatting 3 student names into a multiline string ready for writing with 'w' mode.",
        starterCode: `students = ["Kiran", "Divya", "Prasad"]
# Create formatted multiline string:
file_text = 

print(file_text)
`,
        solutionCode: `students = ["Kiran", "Divya", "Prasad"]
file_text = "\\n".join(students)
print(file_text)`,
        hints: ["Use '\\n'.join(students)"]
      },
      quickChecks: [
        {
          question: "Which file mode appends data to the end of an existing file without deleting its contents?",
          options: ["'a'", "'w'", "'r'", "'x'"],
          correctIndex: 0,
          explanation: "'a' mode (append) positions the stream pointer at the end of the file, preserving existing data."
        }
      ],
      commonMistakes: [
        {
          title: "Opening a file with 'w' mode when you wanted to append",
          badCode: "f = open('log.txt', 'w') # Immediately erases all past log history!",
          goodCode: "f = open('log.txt', 'a') # Preserves existing logs and adds to end",
          explanation: "'w' mode truncates the file to 0 bytes upon opening."
        }
      ],
      recap: [
        "'r' reads, 'w' overwrites, 'a' appends.",
        "with open(...) ensures files are automatically closed.",
        "f.tell() checks stream position; f.seek() moves the pointer.",
        ".read() returns full text; .readlines() returns list of lines."
      ],
      glossaryTerms: ["file", "syntax", "core"],
      concept: `### Unit 5.1: File Handling Reference (MRCET Syllabus)

\`\`\`python
# Idiomatic File Writing
with open("output.txt", "w") as f:
    f.write("Line 1\\n")
    f.writelines(["Line 2\\n", "Line 3\\n"])

# Idiomatic File Reading
with open("output.txt", "r") as f:
    for line in f:
        print(line.strip())
\`\`\`
`,
      practiceCode: `# Simulating file processing
raw_log = "INFO: Server started\\nWARN: High memory\\nINFO: Process complete"
log_lines = [l for l in raw_log.split("\\n") if l.startswith("INFO")]
print("Filtered INFO logs:", log_lines)`,
      quizQuestion: "What does the with statement guarantee when opening files?",
      quizOptions: [
        "The file is automatically closed when the block terminates",
        "The file is compressed",
        "The file is uploaded to the cloud",
        "The file cannot be read"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-5-2",
      title: "Unit 5.2: Command Line Arguments: sys.argv & getopt",
      phaseId: "mrcet-unit-5",
      phaseTitle: "Unit V: Files, Exceptions, Modules & Packages (MRCET R17A0554)",
      mrcetUnit: "UNIT V",
      mrcetTopic: "Command line arguments, sys.argv, getopt module",
      description: "Understand command line arguments in Python: the sys.argv list, argument indexing, and command line flag parsing with getopt.",
      hook: "Have you ever run 'git commit -m \"message\"' or 'python script.py data.csv'? How does the script receive those terminal flags? Python captures all command line arguments into a built-in list called sys.argv!",
      plainEnglish: "sys.argv is a list containing the command line arguments passed to a Python script. sys.argv[0] is always the script name itself.",
      codeExample: `# MRCET Unit V: Command Line Arguments with sys.argv
import sys

print("=== Command Line Arguments (sys.argv) ===")
print("Full sys.argv list:   ", sys.argv)
print("Total argument count: ", len(sys.argv))
print("Script name (argv[0]):", sys.argv[0])

# Simulating parsing command line flags:
# Suppose user invoked: python grader.py --dept CSE --min-score 75
simulated_argv = ["grader.py", "--dept", "CSE", "--min-score", "75"]
print(f"\\nSimulated CLI invocation: {' '.join(simulated_argv)}")

if "--dept" in simulated_argv:
    dept_idx = simulated_argv.index("--dept") + 1
    department = simulated_argv[dept_idx]
    print(f"Parsed Department Flag: {department}")

if "--min-score" in simulated_argv:
    score_idx = simulated_argv.index("--min-score") + 1
    min_score = int(simulated_argv[score_idx])
    print(f"Parsed Minimum Score:   {min_score}")`,
      whatJustHappened: [
        "sys.argv contained the script name at index 0.",
        "len(sys.argv) inspected the number of parameters passed from the terminal.",
        "Demonstrated argument extraction by searching flags in the argv list."
      ],
      deeperDive: "In standard C/UNIX style, the `getopt` module (`import getopt`) parses command line options like `-h` or `--help`. Modern Python also includes `argparse`, but `sys.argv` and `getopt` are the official foundation in the MRCET B.Tech syllabus.",
      yourTurn: {
        challenge: "Write a small snippet that checks if len(sys.argv) > 1 and prints the first argument (sys.argv[1]), else prints 'No argument'.",
        starterCode: `import sys
# Check argv length:
`,
        solutionCode: `import sys
if len(sys.argv) > 1:
    print("Argument 1:", sys.argv[1])
else:
    print("No argument")`,
        hints: ["if len(sys.argv) > 1: print(sys.argv[1]) else: print('No argument')"]
      },
      quickChecks: [
        {
          question: "What is stored at sys.argv[0]?",
          options: [
            "The name of the Python script being executed",
            "The first user argument",
            "The operating system name",
            "The Python version"
          ],
          correctIndex: 0,
          explanation: "In Python, sys.argv[0] always stores the script name (or path) that was called from the command line."
        }
      ],
      commonMistakes: [
        {
          title: "Accessing sys.argv[1] without checking list length",
          badCode: "target_file = sys.argv[1] # IndexError if user passes no arguments!",
          goodCode: "target_file = sys.argv[1] if len(sys.argv) > 1 else 'default.txt'",
          explanation: "Always verify len(sys.argv) before indexing command line arguments."
        }
      ],
      recap: [
        "sys.argv holds terminal arguments as a list of strings.",
        "sys.argv[0] is the script name.",
        "Command line arguments always arrive as strings (convert numbers with int() or float())."
      ],
      glossaryTerms: ["parameter", "argument", "core"],
      concept: `### Unit 5.2: sys.argv Structure

\`\`\`bash
# Terminal invocation:
python calculate.py 10 20
\`\`\`

\`\`\`python
# Inside calculate.py:
import sys
# sys.argv is ['calculate.py', '10', '20']
num1 = int(sys.argv[1]) # 10
num2 = int(sys.argv[2]) # 20
print(num1 + num2)       # 30
\`\`\`
`,
      practiceCode: `# Argument inspection
import sys
print(f"Arguments present: {len(sys.argv)}")
for i, arg in enumerate(sys.argv):
    print(f"  argv[{i}]: {arg}")`,
      quizQuestion: "What data type are the elements in sys.argv?",
      quizOptions: ["strings (str)", "integers (int)", "bytes", "objects"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-5-3",
      title: "Unit 5.3: Errors & Exceptions Handling: try, except, else & finally",
      phaseId: "mrcet-unit-5",
      phaseTitle: "Unit V: Files, Exceptions, Modules & Packages (MRCET R17A0554)",
      mrcetUnit: "UNIT V",
      mrcetTopic: "Errors and exceptions, handling exceptions",
      description: "Understand syntax errors vs runtime exceptions, the try-except-else-finally structure, catching specific exceptions, and raising exceptions with 'raise'.",
      hook: "Imagine a flight navigation computer. If a sensor reports a divide-by-zero error, you cannot let the entire airplane crash! Exception handling is the safety net that catches unexpected errors gracefully and keeps software running smoothly.",
      plainEnglish: "An exception is an error that occurs during program execution. The try block contains risky code, except catches errors, else runs if no error occurred, and finally runs no matter what.",
      codeExample: `# MRCET Unit V: Exception Handling Architecture
def safe_divide(a, b):
    """Demonstrates complete try-except-else-finally execution flow."""
    print(f"\\nAttempting division: {a} / {b}")
    try:
        result = a / b
    except ZeroDivisionError as zde:
        print(f"  [EXCEPT] Caught ZeroDivisionError: {zde}")
        return None
    except TypeError as te:
        print(f"  [EXCEPT] Caught TypeError: {te}")
        return None
    else:
        print(f"  [ELSE] Division succeeded smoothly! Result = {result}")
        return result
    finally:
        print("  [FINALLY] Cleanup executed (this block always runs!)")

# 1. Successful run
safe_divide(20, 4)

# 2. ZeroDivisionError run
safe_divide(15, 0)

# 3. Raising Custom Exceptions
def validate_mrcet_age(age):
    if age < 17:
        raise ValueError("Student must be at least 17 years old to enroll in B.Tech.")
    return True

try:
    validate_mrcet_age(15)
except ValueError as err:
    print(f"\\nCaught custom validation error: {err}")`,
      whatJustHappened: [
        "safe_divide(20, 4) ran the try block and proceeded to the else block.",
        "safe_divide(15, 0) intercepted ZeroDivisionError without crashing the interpreter.",
        "The finally block executed in BOTH cases, demonstrating guaranteed cleanup.",
        "raise ValueError(...) triggered an intentional exception on invalid input."
      ],
      deeperDive: "Python's exception hierarchy descends from `BaseException`. Standard runtime exceptions inherit from `Exception`. Always catch specific exceptions (like `ValueError` or `FileNotFoundError`) rather than a bare `except:`, which can inadvertently intercept keyboard interrupts (Ctrl+C).",
      yourTurn: {
        challenge: "Write a try-except block that tries to convert text = 'abc' to an integer with int(), catching ValueError and printing 'Invalid number'.",
        starterCode: `text = "abc"
# try-except block:
`,
        solutionCode: `text = "abc"
try:
    num = int(text)
except ValueError:
    print("Invalid number")`,
        hints: ["try: num = int(text) except ValueError: print('Invalid number')"]
      },
      quickChecks: [
        {
          question: "When does the 'else' block of a try-except statement execute?",
          options: [
            "Only when NO exception was raised in the try block",
            "Whenever an exception occurs",
            "Always, right before finally",
            "Only on Tuesdays"
          ],
          correctIndex: 0,
          explanation: "In Python, the else block runs only if the code in the try block completed without raising any exceptions."
        }
      ],
      commonMistakes: [
        {
          title: "Using a bare except clause",
          badCode: "try:\n    do_work()\nexcept: # Catches EVERYTHING including SystemExit and Ctrl+C!\n    pass",
          goodCode: "try:\n    do_work()\nexcept Exception as e:\n    print('Error:', e)",
          explanation: "Never use a bare except; specify the exception class you anticipate."
        }
      ],
      recap: [
        "try wraps risky statements.",
        "except catches and handles specific exception classes.",
        "else runs only if no exception occurred.",
        "finally always executes regardless of errors.",
        "raise triggers an explicit exception."
      ],
      glossaryTerms: ["error", "control-flow", "syntax"],
      concept: `### Unit 5.3: Exception Handling Hierarchy

\`\`\`python
try:
    # 1. Code that may raise an exception
    risky_operation()
except SpecificError as e:
    # 2. Handles SpecificError
    handle_error(e)
else:
    # 3. Runs only if NO exception occurred
    celebrate_success()
finally:
    # 4. ALWAYS runs (cleanup / closing files/connections)
    release_resources()
\`\`\`
`,
      practiceCode: `# Catching multiple exception types
def parse_int_element(lst, index):
    try:
        return int(lst[index])
    except IndexError:
        return "Index out of range"
    except ValueError:
        return "Not an integer"

print(parse_int_element(["10", "abc"], 0))
print(parse_int_element(["10", "abc"], 1))
print(parse_int_element(["10", "abc"], 5))`,
      quizQuestion: "Which block in a try-except-finally statement is GUARANTEED to execute?",
      quizOptions: ["finally", "except", "else", "try (if error happens)"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-5-4",
      title: "Unit 5.4: Standard Modules: datetime, time, os, calendar & math",
      phaseId: "mrcet-unit-5",
      phaseTitle: "Unit V: Files, Exceptions, Modules & Packages (MRCET R17A0554)",
      mrcetUnit: "UNIT V",
      mrcetTopic: "Modules (datetime, time, OS , calendar, math module)",
      description: "Explore Python's built-in batteries: math calculations, date and time formatting, OS filesystem interaction, and calendar generators.",
      hook: "Python is famous for its 'Batteries Included' philosophy: you don't need to install external libraries to calculate trigonometry, inspect directories, format calendars, or time operations—they come built right into the Python standard library!",
      plainEnglish: "Standard modules are pre-packaged Python libraries. You access their functionality using the 'import' keyword.",
      codeExample: `# MRCET Unit V: Standard Modules Tour
# 1. math module
import math
print("=== 1. math Module ===")
print("math.pi:     ", round(math.pi, 4))
print("math.sqrt(49):", math.sqrt(49))
print("math.ceil(4.2):", math.ceil(4.2))
print("math.floor(4.8):", math.floor(4.8))

# 2. calendar module (Specific to MRCET Syllabus)
import calendar
print("\\n=== 2. calendar Module ===")
print("Is 2024 a leap year?", calendar.isleap(2024))
print("Is 2025 a leap year?", calendar.isleap(2025))
# Print calendar month for October 2026:
print("\\n" + calendar.month(2026, 10))

# 3. datetime and time modules
import datetime
import time
print("=== 3. datetime & time Modules ===")
now = datetime.datetime.now()
print("Current Timestamp: ", now.strftime("%Y-%m-%d %H:%M:%S"))
print("Current Year:      ", now.year)
print("Unix Epoch Time:   ", round(time.time(), 2))

# 4. os module (Operating System interface)
import os
print("\\n=== 4. os Module ===")
print("Current Working Dir:", os.getcwd())
print("OS Path Separator:  ", repr(os.sep))`,
      whatJustHappened: [
        "math provided mathematical constants (pi) and functions (sqrt, ceil, floor).",
        "calendar formatted and rendered monthly text calendars and checked leap years.",
        "datetime formatted timestamps using strftime().",
        "os inspected the current working directory via os.getcwd()."
      ],
      deeperDive: "To see all functions available inside any imported module, use `dir(module_name)`. To read the full documentation for any function interactively, run `help(module_name.function_name)`.",
      yourTurn: {
        challenge: "Use math.pow(x, y) to calculate 3 to the power 4, and check if calendar.isleap(2028) is True.",
        starterCode: `import math
import calendar

# Compute 3^4 and check if 2028 is leap year:
`,
        solutionCode: `import math
import calendar
print("3^4 =", math.pow(3, 4))
print("Is 2028 leap?", calendar.isleap(2028))`,
        hints: ["math.pow(3, 4)", "calendar.isleap(2028)"]
      },
      quickChecks: [
        {
          question: "Which function in the calendar module tests whether a given year is a leap year?",
          options: [
            "calendar.isleap(year)",
            "calendar.leap_check(year)",
            "calendar.is_leap_year(year)",
            "calendar.test_leap(year)"
          ],
          correctIndex: 0,
          explanation: "calendar.isleap(year) returns True if the year is a leap year, otherwise False."
        }
      ],
      commonMistakes: [
        {
          title: "Importing modules with wildcard (*)",
          badCode: "from math import * # Pollutes local namespace!",
          goodCode: "import math\n# Or: from math import sqrt, pi",
          explanation: "Wildcard imports pollute the namespace and can cause accidental variable shadowing."
        }
      ],
      recap: [
        "math provides arithmetic, trigonometric, and logarithmic utilities.",
        "calendar renders formatted ASCII calendars.",
        "datetime handles date arithmetic and string formatting.",
        "os interacts with the host filesystem and environment."
      ],
      glossaryTerms: ["syntax", "core", "program"],
      concept: `### Unit 5.4: Standard Modules Quick Reference

| Module | Key Functions |
| :--- | :--- |
| **math** | \`sqrt\`, \`ceil\`, \`floor\`, \`pow\`, \`sin\`, \`radians\`, \`pi\`, \`e\` |
| **calendar** | \`month(yr, mo)\`, \`calendar(yr)\`, \`isleap(yr)\`, \`monthrange(yr, mo)\` |
| **datetime** | \`now()\`, \`date(y, m, d)\`, \`strftime(format)\`, \`timedelta\` |
| **time** | \`time()\`, \`sleep(secs)\`, \`ctime()\` |
| **os** | \`getcwd()\`, \`listdir(path)\`, \`mkdir(path)\`, \`path.exists()\` |
`,
      practiceCode: `# Testing math operations
import math
angle = 45 # degrees
rad = math.radians(angle)
print(f"sin({angle}°) = {math.sin(rad):.4f}")
print(f"cos({angle}°) = {math.cos(rad):.4f}")`,
      quizQuestion: "What does math.ceil(7.1) return?",
      quizOptions: ["8", "7", "7.0", "8.0"],
      quizAnswerIndex: 0
    },
    {
      id: "l-mrcet-5-5",
      title: "Unit 5.5: Exploring Packages & the __init__.py Architecture",
      phaseId: "mrcet-unit-5",
      phaseTitle: "Unit V: Files, Exceptions, Modules & Packages (MRCET R17A0554)",
      mrcetUnit: "UNIT V",
      mrcetTopic: "Explore packages, package directory hierarchy, __init__.py",
      description: "Understand Python packages: how packages differ from single modules, the role of __init__.py, package namespaces, and absolute vs relative imports.",
      hook: "A single Python file is a module. But what if you are building an entire banking system with 50 different modules for loans, fraud detection, credit cards, and accounts? A Package is how Python organizes multiple modules into hierarchical directories!",
      plainEnglish: "A package is simply a directory containing Python modules and an __init__.py file. The __init__.py file tells Python to treat the directory as an importable package.",
      codeExample: `# MRCET Unit V: Package Architecture Demonstration
# Package Directory Hierarchy:
#
# college_portal/            <- Root Package Directory
# ├── __init__.py            <- Package Initialization & API exposure
# ├── admissions/            <- Sub-package
# │   ├── __init__.py
# │   └── applicant.py
# ├── examinations/          <- Sub-package
# │   ├── __init__.py
# │   ├── grading.py
# │   └── timetable.py
# └── reports/
#     ├── __init__.py
#     └── transcripts.py

print("=== Python Package Architecture ===")
print("1. Module:  A single .py file (e.g. grading.py)")
print("2. Package: A directory with an __init__.py file containing modules")
print("3. Sub-package: A nested directory also containing __init__.py\\n")

# Role of __init__.py
print("Roles of __init__.py:")
print("  a) Marks the directory as a Python package to the import system.")
print("  b) Executes package initialization code upon import.")
print("  c) Controls what is exported via __all__ = ['module1', 'module2'].")

# Import styles:
print("\\nImport Syntax Styles:")
print("  Absolute Import: from college_portal.examinations import grading")
print("  Relative Import: from .grading import calculate_gpa")`,
      whatJustHappened: [
        "Illustrated the file and folder hierarchy of a Python package.",
        "Explained the critical requirement of __init__.py in package directories.",
        "Compared absolute imports with relative dot-syntax imports."
      ],
      deeperDive: "Starting with Python 3.3 (PEP 420), Python introduced 'Implicit Namespace Packages' which allow packages without an `__init__.py` file. However, in standard software engineering and university syllabi (including MRCET R17A0554), including `__init__.py` is the established best practice because it explicitly defines package boundaries and initialization logic.",
      yourTurn: {
        challenge: "Explain in a comment why __init__.py is placed inside package directories.",
        starterCode: `# Write explanation of __init__.py:
explanation = """

"""
print("Explanation recorded.")
`,
        solutionCode: `explanation = """
__init__.py marks a directory as an importable Python package,
executes package setup code, and defines the public API.
"""
print("Explanation recorded.")`,
        hints: ["Mention marking the directory as a Python package."]
      },
      quickChecks: [
        {
          question: "What special file must be placed in a directory for Python to recognize it as a standard package?",
          options: [
            "__init__.py",
            "main.py",
            "package.json",
            "config.py"
          ],
          correctIndex: 0,
          explanation: "__init__.py informs the Python import engine that the folder should be treated as an importable package."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting __init__.py when deploying packages across systems",
          badCode: "my_pack/\n  math_tools.py # Missing __init__.py may cause import failure in legacy environments",
          goodCode: "my_pack/\n  __init__.py # Guarantees package recognition\n  math_tools.py",
          explanation: "Always include __init__.py to ensure reliable cross-platform package imports."
        }
      ],
      recap: [
        "A module is a .py file; a package is a folder with __init__.py.",
        "__init__.py initializes the package namespace.",
        "Packages prevent module name collisions.",
        "You completed the full MRCET B.Tech Python Programming (R17A0554) Syllabus!"
      ],
      glossaryTerms: ["syntax", "core", "program"],
      concept: `### Unit 5.5: Packages Architecture Summary

#### Package Layout Example:
\`\`\`
sound/                          Top-level package
      __init__.py               Initialize the sound package
      formats/                  Subpackage for file format conversions
              __init__.py
              wavread.py
              wavwrite.py
      effects/                  Subpackage for sound effects
              __init__.py
              echo.py
              surround.py
\`\`\`

#### Import Styles:
* **Absolute Import**: \`from sound.effects import echo\`
* **Relative Import**: \`from . import echo\` (same directory) or \`from ..formats import wavread\` (parent directory)
`,
      practiceCode: `# Simulating package namespace access
package_info = {
    "name": "mrcet_portal",
    "version": "1.0.0",
    "modules": ["auth", "grades", "attendance"]
}
print(f"Package: {package_info['name']} v{package_info['version']}")
print("Submodules available:", ", ".join(package_info["modules"]))`,
      quizQuestion: "What is the primary difference between a Python module and a Python package?",
      quizOptions: [
        "A module is a single .py file; a package is a directory containing an __init__.py and multiple modules",
        "A package cannot contain functions",
        "A module cannot be imported",
        "Packages only run on Windows"
      ],
      quizAnswerIndex: 0
    }
  ]
};
