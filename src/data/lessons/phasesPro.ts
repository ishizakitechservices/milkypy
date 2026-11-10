import { LessonModule } from "../../types";

export const PHASE_6_MODULE: LessonModule = {
  id: "phase-6",
  title: "Phase 6: Files & Persistence",
  description: "Reading and writing files, context managers (with open), structured JSON and CSV records, and modern pathlib navigation.",
  lessons: [
    {
      id: "l-6-1",
      title: "Lesson 6.1: Reading and Writing Files",
      phaseId: "phase-6",
      phaseTitle: "Phase 6: Files & Persistence",
      description: "Learn how programs save and read persistent text files using the 'with open' context manager.",
      hook: "When your computer loses power, whatever was stored in RAM memory vanishes. To keep user profiles, save games, or financial ledgers permanently, data must be written to disk storage.",
      plainEnglish: "Python interacts with files using the open() function. The 'with' keyword ensures Python automatically closes the file the instant you finish, preventing memory leaks.",
      codeExample: `# File Persistence Simulation
log_data = "2026-10-07: System initialized\\n2026-10-07: User logged in"

# In standard Python, file I/O is written as:
# with open("system.log", "w") as f:
#     f.write(log_data)

print("Simulating File Write:")
print("-" * 30)
print(log_data)
print("-" * 30)
print("File successfully persisted to storage.")`,
      whatJustHappened: [
        "'w' mode opens a file for writing (overwriting previous contents).",
        "'r' mode opens a file for reading.",
        "'a' mode appends new lines to the end of an existing file.",
        "The with statement guarantees the file closes cleanly even if an error occurs."
      ],
      deeperDive: "Always prefer `with open(...)` over `f = open(...); f.close()`. If your script crashes before reaching f.close(), the file could remain locked by the operating system!",
      yourTurn: {
        challenge: "Simulate writing an entry 'High Score: 9500' to a game save file.",
        starterCode: `# Simulate save file write:
`,
        solutionCode: `save_data = "Player: Alex\\nHigh Score: 9500"
print("Writing save file...")
print(save_data)
print("Save complete.")`,
        hints: ["Format your string with newlines \\n"]
      },
      quickChecks: [
        {
          question: "Why is the with statement recommended when working with files in Python?",
          options: [
            "It automatically closes the file when the block finishes, preventing leaks",
            "It makes text files 10x smaller",
            "It encrypts the hard drive",
            "It only works with numbers"
          ],
          correctIndex: 0,
          explanation: "Context managers (with open) automatically release system file descriptors safely upon block completion."
        }
      ],
      commonMistakes: [
        {
          title: "Using 'w' mode when you wanted to append",
          badCode: "with open('log.txt', 'w') as f: # Overwrites the entire existing file!",
          goodCode: "with open('log.txt', 'a') as f: # Safely adds to the end",
          explanation: "Mode 'w' wipes the file clean on opening. Use 'a' to append without data loss."
        }
      ],
      seedsForLater: {
        concept: "Database Persistence & SQLite",
        sproutsIn: "Phase 7: Object-Oriented Architecture",
        teaser: "Plain text files work for simple saves. In future phases, you will use structured schemas and databases!"
      },
      recap: [
        "Disk storage keeps data across power cycles and restarts.",
        "open(filename, mode) opens files in read ('r'), write ('w'), or append ('a') modes.",
        "The 'with' statement guarantees proper cleanup and closes files automatically."
      ],
      glossaryTerms: ["file", "io", "string"],
      concept: `### Reading and Writing Files

Programs that only keep data in memory lose everything the moment the process terminates. Persistent programs write their state out to permanent storage.`,
      practiceCode: `notes = ["Buy groceries", "Schedule meeting", "Review code"]
formatted = "\\n".join(f"- {n}" for n in notes)
print("NOTEBOOK CONTENT:")
print(formatted)`,
      quizQuestion: "What file mode appends to the end of an existing file?",
      quizOptions: ["'a' (append)", "'w' (write)", "'r' (read)", "'x' (exclusive)"],
      quizAnswerIndex: 0
    },
    {
      id: "l-6-2",
      title: "Lesson 6.2: Structured Storage with JSON",
      phaseId: "phase-6",
      phaseTitle: "Phase 6: Files & Persistence",
      description: "Serializing dictionaries and lists to JSON text and parsing JSON back into Python objects.",
      hook: "How does a Python backend server send data to a web browser running JavaScript? They don't speak the same language! They communicate through JSON (JavaScript Object Notation), the universal lingua franca of the web.",
      plainEnglish: "The built-in json module converts Python dictionaries and lists into text strings (json.dumps) and converts JSON text back into Python objects (json.loads).",
      codeExample: `# JSON Serialization and Deserialization
import json

player_profile = {
    "name": "Kiran",
    "level": 14,
    "inventory": ["sword", "compass", "ruby"],
    "is_vip": True
}

# 1. Convert Python object to JSON text string (dumps = dump string)
json_text = json.dumps(player_profile, indent=2)
print("JSON TEXT FORMAT:")
print(json_text)

# 2. Parse JSON text back into a real Python dictionary (loads = load string)
restored = json.loads(json_text)
print("\\nRestored Python dictionary lookup:")
print("Player:", restored["name"], "| Items count:", len(restored["inventory"]))`,
      whatJustHappened: [
        "json.dumps converted the dictionary into a formatted JSON string with 2-space indentation.",
        "json.loads converted the JSON string back into a live Python dictionary.",
        "Booleans (True) became lowercase true in JSON; Python lists became JSON arrays."
      ],
      deeperDive: "JSON only supports fundamental data types: strings, numbers, Booleans, lists, and dictionaries. It cannot store Python functions or custom class objects directly without custom encoders.",
      yourTurn: {
        challenge: "Serialize config = {'theme': 'dark', 'volume': 80} into JSON and print the string.",
        starterCode: `import json
config = {"theme": "dark", "volume": 80}
# Serialize to JSON below:
`,
        solutionCode: `import json
config = {"theme": "dark", "volume": 80}
json_output = json.dumps(config)
print(json_output)`,
        hints: ["Use json.dumps(config)"]
      },
      quickChecks: [
        {
          question: "What function converts a Python dictionary into a JSON string?",
          options: ["json.dumps()", "json.loads()", "json.parse()", "json.write()"],
          correctIndex: 0,
          explanation: "json.dumps() (dump string) serializes a Python object into JSON text."
        }
      ],
      commonMistakes: [
        {
          title: "Confusing json.dumps() with json.loads()",
          badCode: "data = json.dumps(json_string) # Dumps is for Python -> JSON text",
          goodCode: "data = json.loads(json_string) # Loads is for JSON text -> Python",
          explanation: "dumps converts TO string; loads parses FROM string."
        }
      ],
      seedsForLater: {
        concept: "REST APIs and Web Requests",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "Every web API in modern development returns JSON. You will consume real API responses using json.loads()!"
      },
      recap: [
        "JSON is the universal text format for structured web data.",
        "json.dumps(obj) converts Python objects to JSON text.",
        "json.loads(text) parses JSON text into Python dictionaries/lists."
      ],
      glossaryTerms: ["dictionary", "list", "string"],
      concept: `### Structured Storage with JSON

JSON (JavaScript Object Notation) is the dominant data exchange format across the web.`,
      practiceCode: `import json
user = {"id": 401, "admin": False, "tags": ["beta", "tester"]}
serialized = json.dumps(user)
print("Payload:", serialized)`,
      quizQuestion: "What does json.loads(\"{\\\"count\\\": 5}\") return in Python?",
      quizOptions: ["A Python dictionary {'count': 5}", "A string", "None", "An integer 5"],
      quizAnswerIndex: 0
    },
    {
      id: "l-6-3",
      title: "Lesson 6.3: Tabular Data with the CSV Module",
      phaseId: "phase-6",
      phaseTitle: "Phase 6: Files & Persistence",
      description: "Reading, parsing, and writing Comma-Separated Values (CSV) spreadsheets using Python's built-in csv module.",
      hook: "Open any Excel spreadsheet, Google Sheet, or database export: almost all tabular business reports are stored as plain text CSV files. Python makes processing millions of rows effortless.",
      plainEnglish: "A CSV file is just text where commas separate columns and newlines separate rows. The built-in csv module handles tricky cases like text containing commas, quotes, and header rows.",
      codeExample: `# Parsing and Analyzing CSV Data
import csv
import io

csv_content = """Name,Role,Score
Alice,Engineer,94
Bob,Designer,88
Charlie,Data Scientist,96
Diana,Product Manager,91"""

# Parse with csv.DictReader
f = io.StringIO(csv_content.strip())
reader = csv.DictReader(f)

print("EMPLOYEE DIRECTORY & SCORES:")
print("-" * 35)
total_score = 0
count = 0

for row in reader:
    name = row["Name"]
    role = row["Role"]
    score = int(row["Score"])
    total_score += score
    count += 1
    print(f"{name:<10} | {role:<16} | {score}")

avg_score = total_score / count
print("-" * 35)
print(f"Team Average Score: {avg_score:.1f}")`,
      whatJustHappened: [
        "csv.DictReader automatically reads the first row as dictionary keys.",
        "Each subsequent row becomes a dictionary mapping column headers to cell values.",
        "Values in CSV files are parsed as strings, so numeric conversions like int(row['Score']) are required."
      ],
      deeperDive: "When writing CSV files, always specify newline='' in open() (e.g., `open('out.csv', 'w', newline='', encoding='utf-8')`). This prevents Python from adding duplicate carriage return characters on Windows systems.",
      yourTurn: {
        challenge: "Use csv.DictReader to calculate the total price of items from a CSV string with Item and Price columns.",
        starterCode: `import csv, io
raw_csv = """Item,Price
Keyboard,75
Mouse,30
Monitor,220"""

# Calculate total price below:
`,
        solutionCode: `import csv, io
raw_csv = """Item,Price
Keyboard,75
Mouse,30
Monitor,220"""

f = io.StringIO(raw_csv.strip())
reader = csv.DictReader(f)
total = sum(int(row["Price"]) for row in reader)
print("Total price:", total)`,
        hints: ["Convert row['Price'] to int() in a loop and sum them up."]
      },
      quickChecks: [
        {
          question: "What is the primary advantage of csv.DictReader over standard csv.reader?",
          options: [
            "It maps each row to a dictionary using header names, making column access clearer",
            "It automatically converts all strings to numbers",
            "It encrypts the CSV data",
            "It only works with 3 rows"
          ],
          correctIndex: 0,
          explanation: "DictReader maps column headers to dictionary keys so you access row['Name'] rather than fragile numeric indices like row[0]."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting that CSV cell values are always read as strings",
          badCode: "total += row['Price'] # TypeError: cannot add string to integer!",
          goodCode: "total += int(row['Price']) # Explicitly cast to int or float",
          explanation: "All fields read from a CSV file are strings by default and must be converted to numeric types."
        }
      ],
      seedsForLater: {
        concept: "Data Analysis with Pandas",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "Pandas uses the exact same CSV principles you just learned to analyze millions of rows with single commands like pd.read_csv()!"
      },
      recap: [
        "CSV files store spreadsheet data as comma-separated plain text.",
        "csv.DictReader reads rows as friendly dictionaries keyed by header names.",
        "All values from CSV files are read as strings and must be cast to numbers when calculating."
      ],
      glossaryTerms: ["file", "dictionary", "loop", "string"],
      concept: `### Tabular Data with the CSV Module

Comma-Separated Values (CSV) is the universal file format for exporting and importing spreadsheet and database data.`,
      practiceCode: `import csv, io
data = """Fruit,Quantity
Apple,15
Banana,30
Orange,20"""
f = io.StringIO(data.strip())
for row in csv.DictReader(f):
    print(f"Stock: {row['Quantity']} {row['Fruit']}s")`,
      quizQuestion: "What data type does row['Column'] return when reading with csv.DictReader?",
      quizOptions: ["str (string)", "int (integer)", "float (floating point)", "list (array)"],
      quizAnswerIndex: 0
    },
    {
      id: "l-6-4",
      title: "Lesson 6.4: Modern File Paths with Pathlib",
      phaseId: "phase-6",
      phaseTitle: "Phase 6: Files & Persistence",
      description: "Working with cross-platform filesystem paths, extensions, suffixes, and directories using modern pathlib.Path.",
      hook: "Windows uses backslashes (C:\\\\Users\\\\Bob) while Mac and Linux use forward slashes (/home/bob). If you concatenate path strings manually with slashes, your script will crash on someone else's computer. The pathlib module solves this forever.",
      plainEnglish: "pathlib treats file paths as smart objects instead of dumb strings. The forward-slash operator / lets you join directories safely across all operating systems.",
      codeExample: `# Modern Path Manipulation with pathlib
from pathlib import Path

# Create a Path object representing a file in a subfolder
project_path = Path("workspace") / "projects" / "game.py"

print("Full Virtual Path:", project_path)
print("Filename with ext: ", project_path.name)
print("File Extension:    ", project_path.suffix)
print("Base Name (Stem):  ", project_path.stem)
print("Parent Directory:  ", project_path.parent)

# Path properties and transformations
backup_path = project_path.with_suffix(".bak")
print("Backup File Target:", backup_path)

# Check extension safety
is_python_file = project_path.suffix == ".py"
print("Is Python source file?", is_python_file)`,
      whatJustHappened: [
        "Path('workspace') / 'projects' safely combined folder names regardless of operating system.",
        "project_path.name gave 'game.py', while project_path.stem gave 'game'.",
        "project_path.suffix retrieved the file extension '.py'.",
        "with_suffix('.bak') produced a new Path object with a changed extension without string surgery."
      ],
      deeperDive: "Path objects can also read and write text directly in one line! For example, `Path('info.txt').write_text('Hello')` and `text = Path('info.txt').read_text()` eliminate boilerplate open/close loops for small files.",
      yourTurn: {
        challenge: "Given file_path = Path('reports/quarterly_sales.csv'), print its stem and its suffix.",
        starterCode: `from pathlib import Path
file_path = Path("reports/quarterly_sales.csv")
# Print stem and suffix below:
`,
        solutionCode: `from pathlib import Path
file_path = Path("reports/quarterly_sales.csv")
print("Stem:", file_path.stem)
print("Suffix:", file_path.suffix)`,
        hints: ["Use file_path.stem for the base name and file_path.suffix for the extension."]
      },
      quickChecks: [
        {
          question: "How do you combine folder names into a path using pathlib in Python?",
          options: [
            "Using the slash operator / like Path('dir') / 'file.txt'",
            "Using plus strings with hardcoded backslashes only",
            "Using path.combine_everything()",
            "Paths cannot be joined in Python"
          ],
          correctIndex: 0,
          explanation: "pathlib overloads the / operator so you can cleanly write Path('folder') / 'subfolder' / 'file.txt'."
        }
      ],
      commonMistakes: [
        {
          title: "Hardcoding Windows backslashes in path strings",
          badCode: "path = 'folder\\\\sub\\\\file.txt' # Fails on Linux/Mac/Docker servers!",
          goodCode: "path = Path('folder') / 'sub' / 'file.txt' # 100% portable everywhere",
          explanation: "Always use pathlib.Path to ensure code works on Windows, macOS, and Linux servers."
        }
      ],
      seedsForLater: {
        concept: "Package Discovery and Asset Loading",
        sproutsIn: "Phase 8: Modules & Packages",
        teaser: "Large Python applications find their templates, sound effects, and config files using pathlib anchors!"
      },
      recap: [
        "pathlib treats filesystem paths as smart, portable objects.",
        "The / operator safely joins path segments across Windows, macOS, and Linux.",
        "Inspect paths using .name, .stem, .suffix, and .parent."
      ],
      glossaryTerms: ["file", "string", "operator"],
      concept: `### Modern File Paths with Pathlib

Python 3's pathlib module replaces legacy string manipulation with safe, object-oriented path handling.`,
      practiceCode: `from pathlib import Path
doc = Path("documents") / "contracts" / "nda_v2.docx"
print("Document Base Name:", doc.stem)
print("Document Extension:", doc.suffix)
print("Parent Folder:     ", doc.parent)`,
      quizQuestion: "What does Path('photo.png').stem evaluate to?",
      quizOptions: ["'photo'", "'.png'", "'photo.png'", "'png'"],
      quizAnswerIndex: 0
    }
  ]
};

export const PHASE_7_MODULE: LessonModule = {
  id: "phase-7",
  title: "Phase 7: Object-Oriented Programming (OOP)",
  description: "Classes, instances, constructors (__init__), instance methods (self), encapsulation, inheritance, and dunder methods.",
  lessons: [
    {
      id: "l-7-1",
      title: "Lesson 7.1: Classes, Instances, and Objects",
      phaseId: "phase-7",
      phaseTitle: "Phase 7: Object-Oriented Programming",
      description: "Understand classes as blueprints and instances as concrete objects created from that blueprint.",
      hook: "If an architect designs an architectural blueprint for a house, can you sleep inside the paper blueprint? No! The blueprint is the class. The physical brick-and-mortar house constructed in the neighborhood is the instance (the object).",
      plainEnglish: "A class is a blueprint that defines data fields (attributes) and behaviors (methods). An instance is a real object created in memory from that blueprint.",
      codeExample: `# Class Blueprint and Object Instances
class BankAccount:
    def __init__(self, owner, starting_balance=0.0):
        self.owner = owner
        self.balance = starting_balance

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            print(f"Deposited \${amount:.2f}. New balance: \${self.balance:.2f}")

    def withdraw(self, amount):
        if 0 < amount <= self.balance:
            self.balance -= amount
            print(f"Withdrew \${amount:.2f}. Remaining balance: \${self.balance:.2f}")
        else:
            print("Withdrawal denied: Insufficient funds.")

# Creating two distinct instances
acc1 = BankAccount("Amina", 250.00)
acc2 = BankAccount("Marcus", 100.00)

acc1.deposit(50.00)
acc2.withdraw(25.00)`,
      whatJustHappened: [
        "class BankAccount defined the template.",
        "__init__ initialized individual instance state (owner, balance).",
        "acc1 and acc2 maintain their own independent memory balances."
      ],
      deeperDive: "What is 'self'? 'self' represents the specific instance being operated on. When you call acc1.deposit(50), Python secretly passes acc1 as the first argument: BankAccount.deposit(acc1, 50).",
      yourTurn: {
        challenge: "Create a Book class with title and author attributes and a print_info() method.",
        starterCode: `# Create Book class below:
`,
        solutionCode: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def print_info(self):
        print(f"'{self.title}' by {self.author}")

b = Book("Dune", "Frank Herbert")
b.print_info()`,
        hints: ["Define def __init__(self, title, author): self.title = title; self.author = author"]
      },
      quickChecks: [
        {
          question: "What does the self parameter represent inside a Python class method?",
          options: [
            "The specific instance of the object being operated on",
            "The Python compiler",
            "A global variable",
            "The parent operating system"
          ],
          correctIndex: 0,
          explanation: "self is a reference to the current instance whose method is being executed."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting self as the first parameter in method definitions",
          badCode: "def deposit(amount): # Missing self!",
          goodCode: "def deposit(self, amount):",
          explanation: "Instance methods must always accept self as their very first parameter."
        }
      ],
      seedsForLater: {
        concept: "Inheritance and Polymorphism",
        sproutsIn: "Phase 7: Lesson 7.3",
        teaser: "In Lesson 7.3, you will learn how specialized classes (like SavingsAccount) inherit all abilities of BankAccount automatically!"
      },
      recap: [
        "A class is a blueprint; an instance is an actual object in memory.",
        "__init__ is the constructor method called when an object is created.",
        "self represents the specific object instance."
      ],
      glossaryTerms: ["method", "function", "variable", "scope"],
      concept: `### Classes, Instances, and Objects

Object-Oriented Programming (OOP) models software around real-world entities that bundle state and behavior together.`,
      practiceCode: `class Car:
    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.odometer = 0

    def drive(self, miles):
        self.odometer += miles
        print(f"Drove {miles} miles. Odometer: {self.odometer}")

my_car = Car("Honda", "Civic")
my_car.drive(120)`,
      quizQuestion: "What special method is automatically called when a new instance is created?",
      quizOptions: ["__init__", "__start__", "__new__", "__create__"],
      quizAnswerIndex: 0
    },
    {
      id: "l-7-2",
      title: "Lesson 7.2: Methods, State & Encapsulation",
      phaseId: "phase-7",
      phaseTitle: "Phase 7: Object-Oriented Programming",
      description: "Instance methods, modifying internal state, protecting attributes with leading underscores, and property getters/setters.",
      hook: "Imagine an automated thermostat. If anyone could change the internal wiring directly without checks, the heating unit might overheat and catch fire. Instead, the thermostat gives you buttons (methods) that enforce safe minimum and maximum temperature boundaries.",
      plainEnglish: "Encapsulation bundles data and the functions that manipulate that data together, keeping internal state protected from invalid modifications.",
      codeExample: `# Encapsulation and Data Protection
class Thermostat:
    def __init__(self, room_name: str, target_temp: int = 70):
        self.room_name = room_name
        self._temperature = target_temp  # Convention: leading underscore indicates internal state

    def set_temperature(self, new_temp: int):
        """Method guards against dangerous or invalid values."""
        if 50 <= new_temp <= 85:
            self._temperature = new_temp
            print(f"[{self.room_name}] Temperature set to {self._temperature}°F")
        else:
            print(f"Error: {new_temp}°F is outside safe comfort limits (50-85°F)!")

    def get_temperature(self) -> int:
        return self._temperature

t = Thermostat("Living Room", 68)
t.set_temperature(72)
t.set_temperature(110)  # Blocked by validation logic!
print(f"Current verified reading: {t.get_temperature()}°F")`,
      whatJustHappened: [
        "The attribute self._temperature is marked with a leading underscore as internal.",
        "The set_temperature method validates that input falls within safe boundaries (50-85°F).",
        "Attempts to set invalid temperatures (like 110°F) are gracefully blocked."
      ],
      deeperDive: "In Python, the `@property` decorator lets you define getter and setter methods that can still be accessed cleanly like regular attributes: `t.temperature = 72` triggers the validator behind the scenes!",
      yourTurn: {
        challenge: "Create a Player class with a health attribute initialized to 100. Add take_damage(amount) that prevents health from dropping below 0.",
        starterCode: `class Player:
    def __init__(self, name):
        self.name = name
        self.health = 100

    # Add take_damage method below:
`,
        solutionCode: `class Player:
    def __init__(self, name):
        self.name = name
        self.health = 100

    def take_damage(self, amount):
        self.health = max(0, self.health - amount)
        print(f"{self.name} took {amount} dmg. Health: {self.health}")

hero = Player("Kiran")
hero.take_damage(120)`,
        hints: ["Use self.health = max(0, self.health - amount) to prevent health going negative."]
      },
      quickChecks: [
        {
          question: "What does a leading underscore (like _balance) indicate by convention in Python?",
          options: [
            "The attribute is internal and should only be accessed through public methods",
            "The variable is deleted from memory",
            "The attribute is an encrypted password",
            "The variable is static"
          ],
          correctIndex: 0,
          explanation: "In Python, a single leading underscore signals to other developers that an attribute is an internal implementation detail."
        }
      ],
      commonMistakes: [
        {
          title: "Directly modifying internal state without calling setter methods",
          badCode: "t._temperature = 999 # Bypasses all validation checks!",
          goodCode: "t.set_temperature(72) # Safe and validated",
          explanation: "Always use class methods to mutate state so business logic and safety checks are enforced."
        }
      ],
      seedsForLater: {
        concept: "API Design and Clean Architecture",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "Professional Python libraries protect their internals so users can safely upgrade without breaking their apps!"
      },
      recap: [
        "Encapsulation protects object state from invalid mutations.",
        "Methods act as guardians that enforce business rules and validate inputs.",
        "A leading underscore signifies internal attributes by Python convention."
      ],
      glossaryTerms: ["method", "variable", "scope"],
      concept: `### Methods, State & Encapsulation

Encapsulation ensures that an object's internal variables can only be modified through controlled, validated member methods.`,
      practiceCode: `class Counter:
    def __init__(self):
        self._count = 0

    def increment(self):
        self._count += 1

    def value(self):
        return self._count

c = Counter()
c.increment()
c.increment()
print("Final Count:", c.value())`,
      quizQuestion: "What is the primary benefit of encapsulation in OOP?",
      quizOptions: [
        "It protects internal data by routing all changes through validated methods",
        "It makes programs run without using RAM",
        "It eliminates the need for functions",
        "It converts Python to C++"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-7-3",
      title: "Lesson 7.3: Inheritance & Method Overriding with super()",
      phaseId: "phase-7",
      phaseTitle: "Phase 7: Object-Oriented Programming",
      description: "Reusing code across class hierarchies, creating child classes that inherit from parents, and extending behavior with super().",
      hook: "A Motorcycle and an Electric Truck are both Vehicles. They both have wheels, VIN numbers, and speedometers. But an Electric Truck has a battery capacity, while a Motorcycle does not. Inheritance allows subclasses to inherit common attributes while adding specialized features.",
      plainEnglish: "Inheritance lets a child class inherit all methods and variables from a parent class. The super() function calls the parent constructor so you don't repeat common setup code.",
      codeExample: `# Inheritance and super()
class Employee:
    def __init__(self, name: str, salary: float):
        self.name = name
        self.salary = salary

    def get_details(self) -> str:
        return f"{self.name} earns \${self.salary:,.2f}/year"

# Subclass inherits from Employee
class Manager(Employee):
    def __init__(self, name: str, salary: float, team_size: int):
        # super() invokes the parent class __init__
        super().__init__(name, salary)
        self.team_size = team_size

    # Method Overriding: specialize parent behavior
    def get_details(self) -> str:
        parent_info = super().get_details()
        return f"{parent_info} | Manages a team of {self.team_size} members"

emp = Employee("Devin", 85000.0)
mgr = Manager("Sophia", 125000.0, 6)

print(emp.get_details())
print(mgr.get_details())`,
      whatJustHappened: [
        "class Manager(Employee) makes Manager inherit all attributes and methods of Employee.",
        "super().__init__(name, salary) passed name and salary to Employee to initialize shared fields.",
        "Manager added its own specialized attribute (team_size).",
        "get_details was overridden in Manager to include team size details."
      ],
      deeperDive: "Polymorphism means 'many forms'. If you have a list of employees containing both standard Employees and Managers, you can loop over them and call .get_details() on all of them seamlessly!",
      yourTurn: {
        challenge: "Create a Vehicle parent class with brand. Create a Car child class that inherits from Vehicle and adds doors. Print the car's brand and doors.",
        starterCode: `class Vehicle:
    def __init__(self, brand):
        self.brand = brand

# Create Car(Vehicle) below:
`,
        solutionCode: `class Vehicle:
    def __init__(self, brand):
        self.brand = brand

class Car(Vehicle):
    def __init__(self, brand, doors):
        super().__init__(brand)
        self.doors = doors

c = Car("Tesla", 4)
print(f"{c.brand} with {c.doors} doors")`,
        hints: ["Use class Car(Vehicle): def __init__(self, brand, doors): super().__init__(brand); self.doors = doors"]
      },
      quickChecks: [
        {
          question: "What does super().__init__(...) do inside a child class constructor?",
          options: [
            "Calls the parent class constructor to initialize inherited fields",
            "Destroys the parent class",
            "Creates a static global variable",
            "Restarts the Python program"
          ],
          correctIndex: 0,
          explanation: "super() accesses methods in the parent superclass, delegating standard setup without repeating code."
        }
      ],
      commonMistakes: [
        {
          title: "Forgetting to call super().__init__() in a subclass constructor",
          badCode: "class Dog(Animal):\n    def __init__(self, breed):\n        self.breed = breed # Missing parent attributes!",
          goodCode: "class Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed",
          explanation: "Without super().__init__(), inherited parent attributes are never created."
        }
      ],
      seedsForLater: {
        concept: "Custom Exceptions and Framework Models",
        sproutsIn: "Phase 9: Defensive Programming",
        teaser: "In Phase 9, you will create custom error classes by inheriting from Python's built-in Exception class!"
      },
      recap: [
        "Inheritance allows child classes to reuse code from parent classes.",
        "super() calls parent implementations cleanly.",
        "Child classes can override parent methods to provide specialized behavior."
      ],
      glossaryTerms: ["method", "function", "variable"],
      concept: `### Inheritance and super()

Inheritance is an OOP mechanism where specialized classes derive attributes and behaviors from generalized parent classes.`,
      practiceCode: `class Shape:
    def __init__(self, color):
        self.color = color

class Circle(Shape):
    def __init__(self, color, radius):
        super().__init__(color)
        self.radius = radius

c = Circle("blue", 5.0)
print(f"A {c.color} circle with radius {c.radius}")`,
      quizQuestion: "What syntax establishes that class Cat inherits from class Animal?",
      quizOptions: ["class Cat(Animal):", "class Cat extends Animal:", "class Cat inherit Animal:", "class Cat: Animal"],
      quizAnswerIndex: 0
    },
    {
      id: "l-7-4",
      title: "Lesson 7.4: Special Dunder Methods (__str__, __len__, __eq__)",
      phaseId: "phase-7",
      phaseTitle: "Phase 7: Object-Oriented Programming",
      description: "Supercharging custom classes to integrate with Python's built-in functions: print(), len(), and comparison operators.",
      hook: "Have you ever printed a custom Python object and seen `<__main__.Book object at 0x7f9...>`? That ugly hexadecimal address is Python's default representation. With dunder (double-underscore) methods, you teach Python how to format, measure, and compare your custom objects natively!",
      plainEnglish: "Dunder methods (like __str__, __len__, and __eq__) are special hooks that Python automatically invokes when you call functions like print(), len(), or operators like == on your objects.",
      codeExample: `# Magic Dunder Methods
class Playlist:
    def __init__(self, name: str):
        self.name = name
        self.songs = []

    def add_song(self, title: str):
        self.songs.append(title)

    # Invoked when print(playlist) or str(playlist) is called
    def __str__(self) -> str:
        return f"Playlist '{self.name}' ({len(self.songs)} songs)"

    # Invoked when len(playlist) is called
    def __len__(self) -> int:
        return len(self.songs)

    # Invoked when playlist1 == playlist2 is checked
    def __eq__(self, other) -> bool:
        if isinstance(other, Playlist):
            return self.songs == other.songs
        return False

p1 = Playlist("Study Beats")
p1.add_song("Lofi Chill")
p1.add_song("Coffee Shop Piano")

print("Object print representation:", p1)
print("Length via built-in len():", len(p1))`,
      whatJustHappened: [
        "__str__ returned a clean human-readable string when print(p1) was executed.",
        "__len__ allowed built-in len(p1) to query song count directly.",
        "__eq__ taught Python how to compare two distinct playlist instances based on their contents."
      ],
      deeperDive: "Difference between `__str__` and `__repr__`: `__str__` is intended for end-user readability (what people see), whereas `__repr__` is intended for developers and debugging (an unambiguous code-like representation).",
      yourTurn: {
        challenge: "Create a Team class with name and members list. Implement __len__ to return the number of members.",
        starterCode: `class Team:
    def __init__(self, name):
        self.name = name
        self.members = []

    def add_member(self, member):
        self.members.append(member)

    # Add __len__ below:
`,
        solutionCode: `class Team:
    def __init__(self, name):
        self.name = name
        self.members = []

    def add_member(self, member):
        self.members.append(member)

    def __len__(self):
        return len(self.members)

t = Team("Alpha")
t.add_member("Alex")
t.add_member("Jordan")
print("Team size:", len(t))`,
        hints: ["Define def __len__(self): return len(self.members)"]
      },
      quickChecks: [
        {
          question: "Which dunder method is called when you run print(my_object)?",
          options: ["__str__", "__print__", "__display__", "__format__"],
          correctIndex: 0,
          explanation: "__str__ is the standard hook Python invokes whenever an object is converted to a string or printed."
        }
      ],
      commonMistakes: [
        {
          title: "Returning a non-string from __str__",
          badCode: "def __str__(self):\n    return self.score # TypeError if score is an integer!",
          goodCode: "def __str__(self):\n    return f'Score: {self.score}' # Always returns a string",
          explanation: "__str__ must strictly return a string data type."
        }
      ],
      seedsForLater: {
        concept: "Custom Data Structures & Operator Overloading",
        sproutsIn: "Phase 8: Computer Science Algorithms",
        teaser: "By implementing __lt__ (less than), you allow your custom objects to be sorted automatically using Python's .sort()!"
      },
      recap: [
        "Dunder methods (double-underscore) connect custom objects with Python built-ins.",
        "__str__ produces clean human-facing string representations.",
        "__len__ enables len() calls, and __eq__ enables == comparison."
      ],
      glossaryTerms: ["method", "function", "string"],
      concept: `### Special Dunder Methods

Python's data model uses double-underscore methods to let custom classes seamlessly hook into built-in operators and functions.`,
      practiceCode: `class Box:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def __str__(self):
        return f"Box({self.width}x{self.height})"

b = Box(10, 20)
print("My box is:", b)`,
      quizQuestion: "What must the __len__ dunder method return?",
      quizOptions: ["A non-negative integer", "A string", "A boolean", "A float"],
      quizAnswerIndex: 0
    }
  ]
};

export const PHASE_8_MODULE: LessonModule = {
  id: "phase-8",
  title: "Phase 8: Search & Computer Science Algorithms",
  description: "Algorithmic thinking, Big-O complexity intuition, linear vs binary search, sorting algorithms, and standard library tools.",
  lessons: [
    {
      id: "l-8-1",
      title: "Lesson 8.1: Linear Search vs Binary Search",
      phaseId: "phase-8",
      phaseTitle: "Phase 8: Search & Computer Science Algorithms",
      description: "Compare brute-force linear search O(n) against divide-and-conquer binary search O(log n).",
      hook: "Imagine searching for a word in a 1,000-page dictionary. Do you start at page 1 and read every single word in order until page 800? No! You open to the middle, see if your word comes before or after, and cut the problem in half every single flip. That is Binary Search.",
      plainEnglish: "Linear search checks items one by one in order. Binary search works on sorted data by repeatedly dividing the search range in half, finding items in a 1,000,000 item list in just 20 comparisons!",
      codeExample: `# Linear Search vs Binary Search
def linear_search(items, target):
    """Scan sequentially one-by-one: O(n) complexity."""
    steps = 0
    for i, item in enumerate(items):
        steps += 1
        if item == target:
            return i, steps
    return -1, steps

def binary_search(sorted_items, target):
    """Divide and conquer on sorted list: O(log n) complexity."""
    low = 0
    high = len(sorted_items) - 1
    steps = 0
    
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if sorted_items[mid] == target:
            return mid, steps
        elif sorted_items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps

sorted_data = list(range(1, 101)) # 1 to 100
target = 88

_, lin_steps = linear_search(sorted_data, target)
idx, bin_steps = binary_search(sorted_data, target)

print(f"Target {target} located at index {idx}:")
print(f"Linear Search required: {lin_steps} comparisons")
print(f"Binary Search required: {bin_steps} comparisons!")`,
      whatJustHappened: [
        "Linear search had to inspect 88 elements one by one.",
        "Binary search located the target in just 6 comparisons by cutting the search window in half each step!",
        "Demonstrates the power of algorithmic efficiency in computer science."
      ],
      deeperDive: "Big-O notation describes how execution time scales as data size (n) grows. Linear search is O(n); Binary search is O(log n). For 1 billion items, linear search takes 1 billion steps; binary search takes only 30 steps!",
      yourTurn: {
        challenge: "How many maximum steps would binary search take on a sorted list of 16 items? (Calculate: 16 -> 8 -> 4 -> 2 -> 1).",
        starterCode: `# Calculate steps:
`,
        solutionCode: `steps = 4 # 2^4 = 16
print("Max steps for 16 items:", steps)`,
        hints: ["Each step halves the list: 16 -> 8 -> 4 -> 2 -> 1 (4 steps)"]
      },
      quickChecks: [
        {
          question: "What is the crucial prerequisite for using binary search on a list?",
          options: [
            "The list must already be sorted in order",
            "The list must only contain positive integers",
            "The list must have an even number of items",
            "The list must be created with a tuple"
          ],
          correctIndex: 0,
          explanation: "Binary search depends on sorted order so it can reliably eliminate half the search space at each comparison."
        }
      ],
      commonMistakes: [
        {
          title: "Attempting binary search on an unsorted list",
          badCode: "data = [50, 10, 80, 20]\n# binary search will fail randomly!",
          goodCode: "data.sort()\n# Now binary search is safe and guaranteed",
          explanation: "Binary search requires sorted data. Always sort the list first."
        }
      ],
      seedsForLater: {
        concept: "Tree and Graph Structures",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "Binary search introduces divide-and-conquer, the foundation of modern search engines and databases!"
      },
      recap: [
        "Linear search takes O(n) steps in the worst case.",
        "Binary search takes O(log n) steps by halving the search window.",
        "Binary search strictly requires sorted data."
      ],
      glossaryTerms: ["algorithm", "list", "index", "loop"],
      concept: `### Linear Search vs Binary Search

Algorithmic efficiency is what separates junior programmers from senior software engineers.`,
      practiceCode: `def find_item(data, val):
    for i, item in enumerate(data):
        if item == val:
            return i
    return -1

names = ["Alpha", "Bravo", "Charlie", "Delta"]
print("Charlie index:", find_item(names, "Charlie"))`,
      quizQuestion: "What is the Big-O time complexity of Binary Search?",
      quizOptions: ["O(log n)", "O(n)", "O(n^2)", "O(1)"],
      quizAnswerIndex: 0
    },
    {
      id: "l-8-2",
      title: "Lesson 8.2: Sorting Algorithms: Bubble Sort to Timsort",
      phaseId: "phase-8",
      phaseTitle: "Phase 8: Search & Computer Science Algorithms",
      description: "Understand how sorting works under the hood: compare simple Bubble Sort O(n^2) with Python's hybrid Timsort O(n log n).",
      hook: "If you have a hand of playing cards, how do you arrange them in order? You might scan through and swap adjacent cards until everything is in place. That is the intuition behind sorting algorithms, one of the most studied problems in computer science history.",
      plainEnglish: "Sorting rearranges elements into ascending or descending order. Simple algorithms like Bubble Sort repeatedly swap adjacent out-of-order elements. Python's built-in sorted() uses Timsort, a lightning-fast hybrid algorithm.",
      codeExample: `# Understanding Sorting: Bubble Sort Implementation
def bubble_sort(items):
    arr = items.copy()
    n = len(arr)
    comparisons = 0
    swaps = 0

    for i in range(n):
        for j in range(0, n - i - 1):
            comparisons += 1
            if arr[j] > arr[j + 1]:
                # Swap adjacent elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1

    return arr, comparisons, swaps

sample_data = [64, 34, 25, 12, 22, 11, 90]
sorted_list, comps, num_swaps = bubble_sort(sample_data)

print("Original List:", sample_data)
print("Sorted Result:", sorted_list)
print(f"Stats: {comps} comparisons, {num_swaps} swaps")`,
      whatJustHappened: [
        "Bubble Sort compared adjacent elements pair by pair, swapping whenever an element was greater than its neighbor.",
        "With each outer pass, the largest remaining element 'bubbled up' to the end of the list.",
        "On 7 items, it executed 21 comparisons."
      ],
      deeperDive: "Bubble sort has an average time complexity of O(n^2). For 100,000 items, O(n^2) requires 10,000,000,000 operations! Python's built-in sorted() uses Timsort (O(n log n)), which handles 100,000 items in just ~1,700,000 operations.",
      yourTurn: {
        challenge: "Use Python's built-in sorted() with a custom key lambda to sort words by their length: ['elephant', 'cat', 'giraffe', 'ox'].",
        starterCode: `words = ["elephant", "cat", "giraffe", "ox"]
# Sort by length below:
`,
        solutionCode: `words = ["elephant", "cat", "giraffe", "ox"]
by_length = sorted(words, key=len)
print(by_length)`,
        hints: ["Use sorted(words, key=len)"]
      },
      quickChecks: [
        {
          question: "What is the Big-O worst-case time complexity of Bubble Sort?",
          options: ["O(n^2)", "O(1)", "O(log n)", "O(n log n)"],
          correctIndex: 0,
          explanation: "Nested loops comparing all pairs give Bubble Sort a quadratic O(n^2) time complexity."
        }
      ],
      commonMistakes: [
        {
          title: "Writing custom sorting loops when Python's built-in sorted() is already optimal",
          badCode: "# Writing 20 lines of slow Bubble Sort for production data",
          goodCode: "data.sort() # Uses highly optimized C-level Timsort",
          explanation: "Always use Python's built-in .sort() or sorted() in production. Understanding algorithms teaches intuition, but built-ins are fastest."
        }
      ],
      seedsForLater: {
        concept: "Algorithmic Optimization & Profiling",
        sproutsIn: "Phase 9: Defensive & Performant Code",
        teaser: "Choosing the right algorithm is often the difference between a system that runs in 1 second vs 10 hours!"
      },
      recap: [
        "Sorting reorganizes elements into monotonic order.",
        "Bubble Sort operates in O(n^2) by swapping adjacent elements.",
        "Python's built-in sorted() runs in O(n log n) using Timsort."
      ],
      glossaryTerms: ["algorithm", "list", "loop"],
      concept: `### Sorting Algorithms

Sorting is fundamental to computing. Once data is sorted, searching it with Binary Search becomes logarithmically fast.`,
      practiceCode: `scores = [88, 42, 99, 71, 95]
scores.sort(reverse=True)
print("Leaderboard Top 3:", scores[:3])`,
      quizQuestion: "What built-in algorithm powers Python's sorted() and list.sort()?",
      quizOptions: ["Timsort", "Bubble Sort", "Bogo Sort", "Selection Sort"],
      quizAnswerIndex: 0
    },
    {
      id: "l-8-3",
      title: "Lesson 8.3: Essential Standard Library Tools",
      phaseId: "phase-8",
      phaseTitle: "Phase 8: Search & Computer Science Algorithms",
      description: "Harnessing Python's batteries-included modules: math, random, datetime, and collections (Counter, defaultdict).",
      hook: "Python's guiding philosophy is 'Batteries Included'. You don't need to download external packages to calculate geometry formulas, pick random winners, measure timestamps, or tally frequencies. Python provides them out of the box.",
      plainEnglish: "The standard library is a collection of high-performance modules that ship directly with every Python installation. You access them using the import keyword.",
      codeExample: `# Standard Library Highlights: collections & math
import math
import random
from collections import Counter

# 1. Math module
print("Square root of 144:", math.isqrt(144))
print("Ceiling of 4.2:", math.ceil(4.2))

# 2. Random choices
fruits = ["apple", "banana", "cherry", "dragonfruit"]
print("Random pick:", random.choice(fruits))

# 3. Collections Counter: frequency analysis in 1 line
votes = ["red", "blue", "red", "green", "blue", "blue", "red", "blue"]
vote_counts = Counter(votes)

print("\\nVOTING TALLY (Counter):")
for option, count in vote_counts.most_common():
    print(f"- {option.capitalize():<6}: {count} votes")`,
      whatJustHappened: [
        "math.isqrt and math.ceil performed exact mathematical transformations.",
        "random.choice picked a pseudo-random item from a sequence.",
        "Counter(votes) automatically tallied the frequency of every element.",
        "vote_counts.most_common() returned the items sorted by frequency."
      ],
      deeperDive: "Another gem in collections is `defaultdict`. If you query a key that doesn't exist yet, a `defaultdict` automatically initializes it (e.g. to 0 or an empty list) instead of raising a KeyError!",
      yourTurn: {
        challenge: "Use Counter to find the most frequent letter in the word 'mississippi'.",
        starterCode: `from collections import Counter
word = "mississippi"
# Find most common letter below:
`,
        solutionCode: `from collections import Counter
word = "mississippi"
counts = Counter(word)
top_letter, top_count = counts.most_common(1)[0]
print(f"Most common: '{top_letter}' ({top_count} times)")`,
        hints: ["Use Counter('mississippi').most_common(1)"]
      },
      quickChecks: [
        {
          question: "What does collections.Counter do when passed an iterable sequence?",
          options: [
            "Tallies the frequency count of each unique element into a dictionary-like structure",
            "Deletes all duplicates",
            "Sorts the numbers in descending order",
            "Converts strings into floats"
          ],
          correctIndex: 0,
          explanation: "Counter is a dictionary subclass that counts occurrences of hashable objects."
        }
      ],
      commonMistakes: [
        {
          title: "Manually writing 10-line counting loops instead of using Counter",
          badCode: "counts = {}\nfor x in items:\n    if x in counts: counts[x] += 1\n    else: counts[x] = 1",
          goodCode: "from collections import Counter\ncounts = Counter(items)",
          explanation: "Counter is standard, expressive, and heavily optimized in C."
        }
      ],
      seedsForLater: {
        concept: "Data Science Pipelines",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "Frequency analysis with Counter is the first step in natural language processing and text mining!"
      },
      recap: [
        "Python's standard library provides robust tools out of the box without pip install.",
        "math handles mathematical computations like ceil, floor, and sqrt.",
        "random generates random numbers and choices.",
        "collections provides specialized containers like Counter and defaultdict."
      ],
      glossaryTerms: ["module", "dictionary", "function"],
      concept: `### Essential Standard Library Tools

The Python standard library contains hundreds of pre-built, tested modules covering math, dates, hashing, networking, and data structures.`,
      practiceCode: `from collections import Counter
text = "to be or not to be that is the question"
words = text.split()
counts = Counter(words)
print("Top word:", counts.most_common(1))`,
      quizQuestion: "Which module provides the Counter class in Python?",
      quizOptions: ["collections", "math", "statistics", "itertools"],
      quizAnswerIndex: 0
    }
  ]
};

export const PHASE_9_MODULE: LessonModule = {
  id: "phase-9",
  title: "Phase 9: Error Handling & Defensive Code",
  description: "Graceful error management: try, except, finally, multiple error branches, custom exception classes, and defensive programming.",
  lessons: [
    {
      id: "l-9-1",
      title: "Lesson 9.1: The try-except Block",
      phaseId: "phase-9",
      phaseTitle: "Phase 9: Error Handling & Defensive Code",
      description: "Intercept and handle runtime errors gracefully without crashing the application.",
      hook: "Imagine a banking app that completely crashed and shut down your smartphone every time someone typed a typo into an account number. Users would be furious! Professional apps catch errors and provide friendly recovery prompts.",
      plainEnglish: "A try-except block tests a block of code for errors. If an error occurs inside try, Python jumps immediately to except instead of crashing the program.",
      codeExample: `# Graceful Error Handling
raw_input = "not_a_number"

try:
    number = int(raw_input)
    result = 100 / number
    print("Calculated result:", result)
except ValueError:
    print("Input Error: Please provide valid numerical digits.")
except ZeroDivisionError:
    print("Math Error: Division by zero is not allowed.")
finally:
    print("Operation check complete.")`,
      whatJustHappened: [
        "int('not_a_number') would normally crash the program with ValueError.",
        "The except ValueError block caught the error and printed a friendly explanation.",
        "The program remained alive and execution continued seamlessly."
      ],
      deeperDive: "Always catch specific errors (e.g. `except ValueError:`) rather than bare `except:`. A bare `except:` can accidentally silence syntax bugs or keyboard interrupts that you needed to see!",
      yourTurn: {
        challenge: "Wrap a division operation in try-except to catch ZeroDivisionError gracefully.",
        starterCode: `# Wrap division below:
`,
        solutionCode: `try:
    res = 50 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")`,
        hints: ["Use try: res = 50 / 0 except ZeroDivisionError:"]
      },
      quickChecks: [
        {
          question: "What block in a try-except structure is guaranteed to run whether an error occurred or not?",
          options: ["finally", "except", "try", "catch"],
          correctIndex: 0,
          explanation: "The finally block always runs at the end regardless of whether an exception occurred or was handled."
        }
      ],
      commonMistakes: [
        {
          title: "Using bare except without specifying error type",
          badCode: "except: # Silences all errors, including system halts!",
          goodCode: "except ValueError:",
          explanation: "Always name the specific error class you expect to handle."
        }
      ],
      seedsForLater: {
        concept: "Production Resilience",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "In Phase 10, you will combine defensive error handling to build rock-solid terminal and web applications!"
      },
      recap: [
        "try wraps risky code; except catches specific errors.",
        "Catches errors gracefully, keeping programs running.",
        "finally always executes for cleanup."
      ],
      glossaryTerms: ["traceback", "syntax", "bug", "debugging"],
      concept: `### The try-except Block

Defensive programming ensures applications survive unexpected user behavior and network dropouts.`,
      practiceCode: `def safe_convert(val):
    try:
        return float(val)
    except ValueError:
        return 0.0

print("Safe conversion 1:", safe_convert("45.5"))
print("Safe conversion 2:", safe_convert("invalid"))`,
      quizQuestion: "What happens if code inside try succeeds without any error?",
      quizOptions: [
        "The except block is completely skipped",
        "The except block runs anyway",
        "The program halts",
        "Python prints an error"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-9-2",
      title: "Lesson 9.2: Complete Exception Flow: else and finally",
      phaseId: "phase-9",
      phaseTitle: "Phase 9: Error Handling & Defensive Code",
      description: "Mastering the complete try-except-else-finally pipeline for clean separation of concerns and guaranteed cleanup.",
      hook: "What happens if a database connection opens inside a try block, but an unexpected error strikes halfway through? If you don't close the connection in a finally block, the database locks up and stops serving users permanently.",
      plainEnglish: "The full exception handling structure has 4 clauses: try (risky code), except (error recovery), else (runs ONLY if NO errors happened), and finally (runs ALWAYS, no matter what).",
      codeExample: `# Complete 4-Stage Exception Handling Pipeline
def parse_age_and_calculate_discount(raw_val: str):
    print(f"\\nProcessing input: '{raw_val}'")
    discount = 0.0

    try:
        age = int(raw_val)
        if age < 0:
            raise ValueError("Age cannot be negative.")
    except ValueError as err:
        print(f"  [EXCEPT] Caught invalid age input: {err}")
    else:
        # Runs ONLY when try succeeded without exceptions
        print(f"  [ELSE] Successfully verified age: {age}")
        discount = 0.20 if age >= 65 else 0.0
    finally:
        # Runs ALWAYS (great for closing database sockets, files, etc.)
        print("  [FINALLY] Audit logging completed.")

    return discount

parse_age_and_calculate_discount("70")
parse_age_and_calculate_discount("twenty")`,
      whatJustHappened: [
        "When '70' was processed, try succeeded -> else ran to calculate discount -> finally ran to complete audit.",
        "When 'twenty' was processed, try raised ValueError -> except caught it -> else was skipped -> finally ran regardless."
      ],
      deeperDive: "Using the `else` block keeps the `try` block small and focused. Only put the specific line that might raise an exception in `try`; put code that depends on its success in `else`!",
      yourTurn: {
        challenge: "Write a try-except-else block that converts a string to an integer in try, and prints 'Square:' followed by number squared in else.",
        starterCode: `val = "9"
# Write try-except-else below:
`,
        solutionCode: `val = "9"
try:
    num = int(val)
except ValueError:
    print("Invalid number")
else:
    print("Square:", num ** 2)`,
        hints: ["Put num = int(val) in try, and print('Square:', num ** 2) in else."]
      },
      quickChecks: [
        {
          question: "When does the else block execute in a try-except-else-finally statement?",
          options: [
            "Only when the try block executes successfully without raising any exceptions",
            "Only when an exception is caught",
            "Every single time",
            "Never in Python"
          ],
          correctIndex: 0,
          explanation: "The else block executes only if the code in try completed without raising any exception."
        }
      ],
      commonMistakes: [
        {
          title: "Putting all subsequent code inside the try block",
          badCode: "try:\n    num = int(x)\n    process_1(num)\n    process_2(num)\n    send_email(num) # Hard to tell which function caused an error!",
          goodCode: "try:\n    num = int(x)\nexcept ValueError:\n    handle_error()\nelse:\n    process_1(num)\n    process_2(num)",
          explanation: "Keep the try block as tight as possible around the risky operation; put dependent logic in else."
        }
      ],
      seedsForLater: {
        concept: "Resource Management & Transactions",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "Transaction rollbacks in financial software depend on finally blocks to restore clean states after errors!"
      },
      recap: [
        "try runs code that might raise an exception.",
        "except catches and handles specific error types.",
        "else runs only when try finishes without errors.",
        "finally always executes, making it ideal for resource cleanup."
      ],
      glossaryTerms: ["traceback", "debugging", "variable"],
      concept: `### Complete Exception Flow: else and finally

Structured exception handling provides fine-grained control over error handling, success callbacks, and resource deallocation.`,
      practiceCode: `try:
    x = 10 / 2
except ZeroDivisionError:
    print("Error")
else:
    print("Division succeeded:", x)
finally:
    print("Pipeline finished")`,
      quizQuestion: "What is the primary use case for the finally clause?",
      quizOptions: [
        "Guaranteed cleanup operations like closing files or releasing locks",
        "Writing comments",
        "Speeding up loop execution",
        "Catching errors"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-9-3",
      title: "Lesson 9.3: Raising Custom Exceptions",
      phaseId: "phase-9",
      phaseTitle: "Phase 9: Error Handling & Defensive Code",
      description: "Signaling errors explicitly using the raise keyword and subclassing Exception to create domain-specific error types.",
      hook: "When you try to transfer money from an ATM and your balance is too low, the ATM shouldn't crash with an obscure internal Python error. It raises an InsufficientFundsError. Creating custom exceptions gives your software clear, descriptive error handling.",
      plainEnglish: "You can trigger errors intentionally using the raise keyword. You can also create custom exception types by creating a class that inherits from Python's built-in Exception class.",
      codeExample: `# Custom Domain-Specific Exceptions
class BankingError(Exception):
    """Base exception for all banking issues."""
    pass

class InsufficientFundsError(BankingError):
    """Raised when an account withdrawal exceeds available balance."""
    def __init__(self, balance: float, requested: float):
        self.balance = balance
        self.requested = requested
        super().__init__(
            f"Cannot withdraw \${requested:.2f}. Available balance is only \${balance:.2f}."
        )

def process_withdrawal(current_balance: float, amount: float) -> float:
    if amount <= 0:
        raise ValueError("Withdrawal amount must be strictly positive.")
    if amount > current_balance:
        raise InsufficientFundsError(current_balance, amount)
    return current_balance - amount

try:
    new_bal = process_withdrawal(50.00, 120.00)
    print("New balance:", new_bal)
except InsufficientFundsError as e:
    print("Transaction Blocked:", e)`,
      whatJustHappened: [
        "class InsufficientFundsError(BankingError) created a specialized domain exception.",
        "process_withdrawal used the raise keyword to abort invalid transactions.",
        "The except block caught InsufficientFundsError specifically, allowing clear user messaging."
      ],
      deeperDive: "By creating a base exception (like BankingError) and subclassing specific errors from it, callers can either catch the specific error (`except InsufficientFundsError:`) or catch all banking errors together (`except BankingError:`)!",
      yourTurn: {
        challenge: "Create an InvalidAgeError that inherits from Exception. Write a verify_age(age) function that raises InvalidAgeError if age < 18.",
        starterCode: `# Create InvalidAgeError and verify_age below:
`,
        solutionCode: `class InvalidAgeError(Exception):
    pass

def verify_age(age):
    if age < 18:
        raise InvalidAgeError("Must be at least 18.")
    return True

try:
    verify_age(15)
except InvalidAgeError as e:
    print("Caught:", e)`,
        hints: ["class InvalidAgeError(Exception): pass, then raise InvalidAgeError('message')"]
      },
      quickChecks: [
        {
          question: "How do you trigger an exception intentionally in Python?",
          options: [
            "Using the raise keyword",
            "Using the throw keyword",
            "Using return Error()",
            "Using break"
          ],
          correctIndex: 0,
          explanation: "In Python, exceptions are signaled using the raise keyword (unlike JavaScript or Java which use throw)."
        }
      ],
      commonMistakes: [
        {
          title: "Inheriting custom exceptions from BaseException instead of Exception",
          badCode: "class MyError(BaseException): # Blocks KeyboardInterrupt and system exits!",
          goodCode: "class MyError(Exception): # Proper standard practice",
          explanation: "Always inherit custom exceptions from Exception, never BaseException."
        }
      ],
      seedsForLater: {
        concept: "Enterprise API Error Standards",
        sproutsIn: "Phase 10: Capstone Projects",
        teaser: "Frameworks like FastAPI and Flask translate custom Python exceptions directly into HTTP 400 and 422 error responses!"
      },
      recap: [
        "Use raise to trigger exceptions when preconditions are violated.",
        "Create custom exceptions by inheriting from the Exception class.",
        "Custom exceptions make error handling domain-specific, informative, and clean."
      ],
      glossaryTerms: ["syntax", "traceback", "debugging"],
      concept: `### Raising Custom Exceptions

Custom exceptions allow developers to represent domain-specific business rule violations as first-class Python error types.`,
      practiceCode: `class NegativeNumberError(Exception):
    pass

def square_root(x):
    if x < 0:
        raise NegativeNumberError("No negative inputs allowed.")
    return x ** 0.5

try:
    print(square_root(-4))
except NegativeNumberError as e:
    print("Validation failed:", e)`,
      quizQuestion: "Which built-in class should custom user exceptions inherit from?",
      quizOptions: ["Exception", "BaseException", "Error", "Object"],
      quizAnswerIndex: 0
    }
  ]
};

export const PHASE_10_MODULE: LessonModule = {
  id: "phase-10",
  title: "Phase 10: Building Real Projects",
  description: "Capstone integration: putting all phases together to build production-grade personal finance, catalog inventory, and RPG game engines.",
  lessons: [
    {
      id: "l-10-1",
      title: "Lesson 10.1: Capstone 1: Personal Finance & Budget Tracker",
      phaseId: "phase-10",
      phaseTitle: "Phase 10: Building Real Projects",
      description: "Full synthesis: variables, data structures, functions, OOP, and persistence combined into a personal finance dashboard.",
      hook: "You started from 'What Even Is Code?' knowing zero programming syntax. Now, you stand equipped with the entire arsenal of a professional Python developer: variables, logic, loops, collections, modular functions, object-oriented architecture, algorithms, and error resilience. Let's build your master capstone!",
      plainEnglish: "This master project synthesizes all phases into a full FinancialLedger engine that tracks categorized expenses, calculates percentage allocations, and generates a formatted executive financial report.",
      codeExample: `# Phase 10 Capstone: Personal Finance Tracker
class ExpenseTracker:
    def __init__(self, monthly_budget: float):
        self.budget = monthly_budget
        self.expenses = []

    def add_expense(self, category: str, amount: float):
        if amount <= 0:
            raise ValueError("Amount must be positive.")
        self.expenses.append({"category": category, "amount": amount})

    def get_total_spend(self) -> float:
        return sum(e["amount"] for e in self.expenses)

    def generate_report(self):
        total = self.get_total_spend()
        remaining = self.budget - total
        utilization = (total / self.budget) * 100 if self.budget > 0 else 0

        print("=" * 42)
        print("     EXECUTIVE FINANCIAL REPORT")
        print("=" * 42)
        print(f"| Monthly Budget:    \${self.budget:<18.2f} |")
        print(f"| Total Expenses:    \${total:<18.2f} |")
        print(f"| Remaining Surplus: \${remaining:<18.2f} |")
        print(f"| Budget Utilization: {utilization:<17.1f}% |")
        print("-" * 42)
        for i, exp in enumerate(self.expenses, 1):
            print(f"| {i}. {exp['category']:<16} \${exp['amount']:<16.2f} |")
        print("=" * 42)

# Instantiate and execute
tracker = ExpenseTracker(3000.00)
tracker.add_expense("Rent", 1400.00)
tracker.add_expense("Groceries", 450.00)
tracker.add_expense("Utilities", 185.50)
tracker.add_expense("Transportation", 120.00)

tracker.generate_report()`,
      whatJustHappened: [
        "OOP Encapsulation: ExpenseTracker packages state and operations.",
        "Error Validation: Raises ValueError on non-positive amounts.",
        "Functional Analytics: Calculates utilization percentages and surplus balances.",
        "Tabular Output: Formats data into a professional terminal executive report."
      ],
      deeperDive: "Congratulations on reaching the capstone tier! Notice how clean the code reads: methods have single responsibilities, errors are caught early, and formatting strings align numbers into clean tables.",
      yourTurn: {
        challenge: "Add an expense 'Streaming Services' for $45.00 and re-run the executive report.",
        starterCode: `# Add expense to tracker:
`,
        solutionCode: `tracker.add_expense("Streaming", 45.00)
print("Updated total:", tracker.get_total_spend())`,
        hints: ["tracker.add_expense('Streaming', 45.00)"]
      },
      quickChecks: [
        {
          question: "What core architectural pattern does ExpenseTracker demonstrate?",
          options: [
            "Object-Oriented Encapsulation of state and behaviors",
            "Linear brute force",
            "Bare recursion",
            "Global variable modification"
          ],
          correctIndex: 0,
          explanation: "ExpenseTracker encapsulates private data (budget, expenses) alongside public methods (add_expense, generate_report)."
        }
      ],
      commonMistakes: [
        {
          title: "Writing all project code as one giant 500-line script",
          badCode: "# 500 lines of unorganized sequential code",
          goodCode: "# Modular classes and functions with clear single responsibilities",
          explanation: "Break programs down into cohesive classes and helper functions for maintainability."
        }
      ],
      seedsForLater: {
        concept: "Full-Stack Development & AI Engineering",
        sproutsIn: "Your Software Engineering Career!",
        teaser: "You are now equipped with production Python fundamentals. Go build extraordinary things!"
      },
      recap: [
        "You mastered the complete Python Zero to Pro curriculum!",
        "You built real projects across all 11 phases without relying on emojis.",
        "You understand computer science algorithms, OOP, collections, and error handling."
      ],
      glossaryTerms: ["program", "algorithm", "function", "variable", "dictionary", "list"],
      concept: `### Capstone: Personal Finance & Budget Tracker

The culmination of your Python journey: from literal sequential instructions to object-oriented financial analytics.`,
      practiceCode: `print("=" * 35)
print("  PYTHON ZERO -> PRO COMPLETE!")
print("=" * 35)
print("Mastery unlocked:")
print("- Phase 0 to 10 Curriculum")
print("- Algorithms & OOP")
print("- Pure Craftsmanship")
print("=" * 35)`,
      quizQuestion: "What is the single most important habit of a great programmer?",
      quizOptions: [
        "Writing clean, readable code and breaking complex problems into simple steps",
        "Memorizing every single syntax rule",
        "Typing faster than 100 words per minute",
        "Never using functions"
      ],
      quizAnswerIndex: 0
    },
    {
      id: "l-10-2",
      title: "Lesson 10.2: Capstone 2: Store Inventory & Catalog System",
      phaseId: "phase-10",
      phaseTitle: "Phase 10: Building Real Projects",
      description: "Build an inventory management system featuring product objects, stock adjustments, low-stock alerts, and valuation metrics.",
      hook: "Every e-commerce company in the world—from Amazon to your neighborhood bookstore—runs on an inventory management system. Let's build a real retail stock system from scratch using OOP, dictionaries, and error validation.",
      plainEnglish: "An inventory system tracks products, quantities, and prices. In this project, we create a Product class and an InventoryManager class that supports adding stock, processing sales, and flagging items that need restocking.",
      codeExample: `# Phase 10 Capstone: Store Inventory Management System
class Product:
    def __init__(self, sku: str, name: str, unit_price: float, stock: int):
        self.sku = sku
        self.name = name
        self.unit_price = unit_price
        self.stock = stock

    def total_value(self) -> float:
        return self.unit_price * self.stock

class InventoryCatalog:
    def __init__(self, store_name: str):
        self.store_name = store_name
        self.products = {}

    def add_product(self, product: Product):
        self.products[product.sku] = product

    def record_sale(self, sku: str, quantity: int) -> float:
        if sku not in self.products:
            raise KeyError(f"Product with SKU '{sku}' not found.")
        prod = self.products[sku]
        if quantity > prod.stock:
            raise ValueError(f"Insufficient stock for {prod.name}: requested {quantity}, only {prod.stock} available.")
        
        prod.stock -= quantity
        revenue = quantity * prod.unit_price
        print(f"Sold {quantity}x '{prod.name}' for \${revenue:.2f}. Remaining stock: {prod.stock}")
        return revenue

    def display_inventory(self):
        total_catalog_value = sum(p.total_value() for p in self.products.values())
        print("=" * 50)
        print(f"     {self.store_name.upper()} INVENTORY REPORT")
        print("=" * 50)
        for prod in self.products.values():
            status = "LOW STOCK!" if prod.stock < 5 else "OK"
            print(f"[{prod.sku}] {prod.name:<18} | Stock: {prod.stock:>3} ({status:<9}) | Unit: \${prod.unit_price:.2f}")
        print("-" * 50)
        print(f"Total Warehouse Valuation: \${total_catalog_value:,.2f}")
        print("=" * 50)

# Run Inventory Simulation
shop = InventoryCatalog("CyberTech Hardware")
shop.add_product(Product("SKU-101", "Mechanical Keyboard", 89.99, 12))
shop.add_product(Product("SKU-102", "Ultra-Wide Monitor", 349.99, 4))
shop.add_product(Product("SKU-103", "Ergonomic Mouse", 49.99, 25))

shop.record_sale("SKU-101", 3)
shop.display_inventory()`,
      whatJustHappened: [
        "Product encapsulates individual item attributes and methods.",
        "InventoryCatalog stores products in a dictionary keyed by SKU for O(1) instant lookup.",
        "record_sale validates both product existence and stock availability defensively.",
        "display_inventory flags low-stock warnings and calculates total warehouse valuation."
      ],
      deeperDive: "Using a dictionary (`self.products[sku] = product`) gives O(1) lookup speed. If the store grew to 1,000,000 products, finding a product by SKU would still take under 1 microsecond!",
      yourTurn: {
        challenge: "Add a restock(sku, quantity) method to InventoryCatalog that increases the stock of a product.",
        starterCode: `# Add restock method and test:
`,
        solutionCode: `def restock(catalog, sku, amount):
    if sku in catalog.products:
        catalog.products[sku].stock += amount
        print("Restocked:", catalog.products[sku].name, "New stock:", catalog.products[sku].stock)

restock(shop, "SKU-102", 10)`,
        hints: ["Access catalog.products[sku].stock and add amount to it."]
      },
      quickChecks: [
        {
          question: "Why is a dictionary keyed by SKU preferred over a list for storing products?",
          options: [
            "Dictionary lookups take O(1) instant time, whereas scanning a list takes O(n) linear time",
            "Dictionaries use zero RAM",
            "Lists cannot hold objects",
            "SKUs can only be stored in dictionaries"
          ],
          correctIndex: 0,
          explanation: "Dictionary lookups by key execute in constant O(1) time regardless of catalog size."
        }
      ],
      commonMistakes: [
        {
          title: "Selling more items than exist in stock",
          badCode: "prod.stock -= quantity # Negative stock numbers in the database!",
          goodCode: "if quantity > prod.stock: raise ValueError('Insufficient stock')",
          explanation: "Always check preconditions defensively before deducting inventory."
        }
      ],
      seedsForLater: {
        concept: "Databases and SQL Transactions",
        sproutsIn: "Advanced Backend Engineering",
        teaser: "Relational databases use ACID transactions to enforce the exact inventory constraints you just coded!"
      },
      recap: [
        "Inventories model items using Product classes and catalog managers.",
        "Keyed dictionary storage provides instantaneous O(1) item retrieval.",
        "Defensive programming prevents negative stock levels."
      ],
      glossaryTerms: ["dictionary", "method", "variable", "loop"],
      concept: `### Capstone: Store Inventory Management System

Real-world commercial applications manage items by pairing object modeling with high-speed key-value lookups.`,
      practiceCode: `class Item:
    def __init__(self, name, qty):
        self.name = name
        self.qty = qty

catalog = {"A": Item("Hammer", 5), "B": Item("Nails", 100)}
print("Item A stock:", catalog["A"].qty)`,
      quizQuestion: "What is the Big-O lookup time for finding an item by SKU in a dictionary?",
      quizOptions: ["O(1)", "O(n)", "O(n^2)", "O(log n)"],
      quizAnswerIndex: 0
    },
    {
      id: "l-10-3",
      title: "Lesson 10.3: Capstone 3: Dungeon Explorer RPG Engine",
      phaseId: "phase-10",
      phaseTitle: "Phase 10: Building Real Projects",
      description: "Build an interactive turn-based role-playing game featuring character combat stats, monster encounters, and dice calculations.",
      hook: "Before 3D graphics cards existed, the world's most immersive games—like Zork, Rogue, and NetHack—were text-based adventure engines running purely in the terminal. Today, game physics and backend simulation servers run on the exact same principles.",
      plainEnglish: "In this project, we create Character, Monster, and BattleEngine classes that calculate attacks, defend with armor, manage health pools, and simulate turn-based tactical combat.",
      codeExample: `# Phase 10 Capstone: Turn-Based RPG Engine
import random

class Fighter:
    def __init__(self, name: str, hp: int, attack_power: int, defense: int):
        self.name = name
        self.max_hp = hp
        self.hp = hp
        self.attack_power = attack_power
        self.defense = defense

    def is_alive(self) -> bool:
        return self.hp > 0

    def take_damage(self, raw_damage: int) -> int:
        actual_damage = max(1, raw_damage - self.defense)
        self.hp = max(0, self.hp - actual_damage)
        return actual_damage

    def attack(self, target: 'Fighter') -> int:
        # Damage variance: attack_power +/- 20%
        roll = random.randint(self.attack_power - 2, self.attack_power + 2)
        dmg = target.take_damage(roll)
        return dmg

def simulate_battle(hero: Fighter, monster: Fighter):
    print("=" * 45)
    print(f"  ENCOUNTER: {hero.name} VS {monster.name}!")
    print("=" * 45)
    round_num = 1

    while hero.is_alive() and monster.is_alive():
        print(f"\\n--- Round {round_num} ---")
        # Hero attacks
        dmg = hero.attack(monster)
        print(f"{hero.name} strikes {monster.name} for {dmg} dmg! ({monster.name} HP: {monster.hp})")

        if not monster.is_alive():
            print(f"\\nVictory! {monster.name} was defeated in round {round_num}!")
            break

        # Monster retaliates
        dmg = monster.attack(hero)
        print(f"{monster.name} retaliates against {hero.name} for {dmg} dmg! ({hero.name} HP: {hero.hp})")

        if not hero.is_alive():
            print(f"\\nDefeat! {hero.name} has fallen in battle...")
            break

        round_num += 1

hero = Fighter("Valerius the Knight", hp=40, attack_power=8, defense=3)
goblin = Fighter("Cave Troll", hp=30, attack_power=7, defense=2)

simulate_battle(hero, goblin)`,
      whatJustHappened: [
        "Fighter class encapsulates character state (HP, attack power, defense).",
        "simulate_battle coordinates turn-based combat using a while loop that checks is_alive().",
        "take_damage calculates net damage using armor mitigation and avoids negative health.",
        "random.randint adds unpredictable combat dice rolling."
      ],
      deeperDive: "Game engines use state machines. The battle loop checks preconditions (`hero.is_alive() and monster.is_alive()`), processes actions, updates game state, and evaluates victory conditions deterministically.",
      yourTurn: {
        challenge: "Add a heal(amount) method to Fighter that restores health up to self.max_hp.",
        starterCode: `# Add heal method to Fighter:
`,
        solutionCode: `def heal(self, amount):
    self.hp = min(self.max_hp, self.hp + amount)
    print(f"{self.name} healed for {amount}. Current HP: {self.hp}")`,
        hints: ["Use self.hp = min(self.max_hp, self.hp + amount)"]
      },
      quickChecks: [
        {
          question: "How does the while loop determine when the combat encounter is over?",
          options: [
            "When either hero.is_alive() or monster.is_alive() returns False",
            "After exactly 10 rounds",
            "When a syntax error occurs",
            "Randomly"
          ],
          correctIndex: 0,
          explanation: "The condition while hero.is_alive() and monster.is_alive() terminates the moment either combatant reaches 0 HP."
        }
      ],
      commonMistakes: [
        {
          title: "Allowing health to heal past max_hp or drop below 0",
          badCode: "self.hp -= dmg # HP can become -50!\nself.hp += heal # HP can exceed maximum!",
          goodCode: "self.hp = max(0, self.hp - dmg)\nself.hp = min(self.max_hp, self.hp + heal)",
          explanation: "Always clamp numerical game attributes with max() and min() boundaries."
        }
      ],
      seedsForLater: {
        concept: "Game Architecture & Simulation Systems",
        sproutsIn: "Advanced Software Architecture",
        teaser: "Turn-based engines are the blueprint for financial simulations, queuing models, and game development!"
      },
      recap: [
        "Classes model game entities with health pools and abilities.",
        "Turn-based loops simulate encounters with state progression.",
        "Clamping functions (min, max) ensure game attributes respect physical boundaries."
      ],
      glossaryTerms: ["loop", "function", "variable", "method"],
      concept: `### Capstone: Dungeon Explorer RPG Engine

Game loops combine OOP modeling, random state perturbations, and rule validation into dynamic interactive simulations.`,
      practiceCode: `class Actor:
    def __init__(self, hp):
        self.hp = hp

a = Actor(25)
a.hp = max(0, a.hp - 10)
print("Remaining HP:", a.hp)`,
      quizQuestion: "What Python function clamps an updated health value so it cannot drop below 0?",
      quizOptions: ["max(0, new_health)", "min(0, new_health)", "clamp(new_health)", "abs(new_health)"],
      quizAnswerIndex: 0
    }
  ]
};
