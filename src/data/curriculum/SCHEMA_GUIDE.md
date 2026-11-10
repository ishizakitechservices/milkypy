# PySlide Lab Curriculum Schema & Format Guide

This document defines the exact JSON specification expected by the PySlide Lab curriculum engine.

## File Location & Naming
- **Directory**: `src/data/curriculum/modules/`
- **File Name**: `module-*.json` or any descriptive name like `module-01-syntax.json`, `module-02-variables.json`.
- **Automatic Discovery**: Any JSON file placed in `src/data/curriculum/modules/` is automatically picked up by Vite and rendered into the curriculum sidebar and reader.
- **Ordering**: The `"order"` integer in each module dictates its position in the course.

---

## 1. Module Structure (Top-Level)

Each JSON file must contain one module object with the following fields:

```json
{
  "id": "module-01-intro",
  "title": "Module 1: Getting Started with Python",
  "order": 1,
  "description": "Learn the basics of Python syntax, output, and expressions.",
  "category": "standard",
  "lessons": [ ... ]
}
```

### Module Fields:
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Unique identifier (e.g., `"mod-python-basics"`) |
| `title` | `string` | **Yes** | Display title for the module in sidebar and header |
| `order` | `number` | **Yes** | Positive integer determining module sequence (1, 2, 3...) |
| `description` | `string` | **Yes** | Summary of topics covered in this module |
| `category` | `"standard"` \| `"mrcet-syllabus"` | No (defaults to `"standard"`) | Module track/category |
| `lessons` | `Array<Lesson>` | **Yes** | List of lesson objects belonging to this module |

---

## 2. Lesson Structure

Each item in the `"lessons"` array must have:

```json
{
  "id": "lesson-01-print",
  "title": "The print() Function & Standard Output",
  "order": 1,
  "estimatedMinutes": 10,
  "learningObjectives": [
    "Understand the purpose of standard output",
    "Call print() with string arguments"
  ],
  "prerequisites": [],
  "conceptsIntroduced": [
    "print_function",
    "string_literals"
  ],
  "conceptsReservedForLater": [
    "variables",
    "f_strings"
  ],
  "sections": [ ... ]
}
```

### Lesson Fields:
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Unique lesson ID across the whole course |
| `title` | `string` | **Yes** | Human-readable lesson title |
| `order` | `number` | **Yes** | Sequence number within this module (1, 2, 3...) |
| `estimatedMinutes` | `number` | No | Estimated time to complete in minutes |
| `learningObjectives` | `string[]` | **Yes** | Array of bulleted learning outcomes |
| `prerequisites` | `string[]` | **Yes** | Concepts student must know before this lesson |
| `conceptsIntroduced` | `string[]` | **Yes** | Concepts introduced and explained in this lesson |
| `conceptsReservedForLater` | `string[]` | No | Concepts student might wonder about that are taught later |
| `sections` | `Array<Section>` | **Yes** | Ordered array of typed content sections (at least 1) |

---

## 3. Section Types

The curriculum renderer renders sections sequentially. You can combine any of the following 8 section types in whatever order makes pedagogical sense:

### 3.1. `explanation`
Plain English explanation with Markdown support.
```json
{
  "type": "explanation",
  "title": "Understanding Python Output",
  "content": "The `print()` function sends text or calculated values to standard output..."
}
```

### 3.2. `terms`
Technical terms and plain-English definitions defined right where introduced.
```json
{
  "type": "terms",
  "title": "Technical Terms",
  "terms": [
    {
      "term": "Function",
      "definition": "A reusable block of code that carries out an action when called.",
      "pointOfIntroduction": "Used to call built-in operations like print()."
    }
  ]
}
```

### 3.3. `example`
Worked code example with expected output and step-by-step line walkthrough.
```json
{
  "type": "example",
  "title": "Example: Basic Print Output",
  "code": "print(\"Hello world!\")\nprint(40 + 2)",
  "description": "Prints a string literal followed by an arithmetic evaluation.",
  "expectedOutput": "Hello world!\n42",
  "lineWalkthrough": [
    {
      "line": 1,
      "code": "print(\"Hello world!\")",
      "explanation": "Outputs the string literal to standard output."
    },
    {
      "line": 2,
      "code": "print(40 + 2)",
      "explanation": "Evaluates the expression 40 + 2 and prints 42."
    }
  ]
}
```

### 3.4. `editor-activity`
Interactive, runnable Python code editor powered by in-browser WebAssembly.
```json
{
  "type": "editor-activity",
  "title": "Try It Yourself",
  "instructions": "Print your favorite hobby using print().",
  "starterCode": "# Write your code below:\nprint(\"My hobby is coding!\")\n",
  "solutionCode": "print(\"My hobby is coding!\")",
  "expectedOutput": "My hobby is coding!",
  "hints": [
    "Wrap your sentence in double quotation marks."
  ]
}
```

### 3.5. `practice`
Practice questions with hints, answer validation, and explanations. Supports three question types:
- `multiple-choice`
- `predict-output`
- `code-fix`

```json
{
  "type": "practice",
  "title": "Knowledge Check",
  "questions": [
    {
      "id": "q1-syntax",
      "type": "multiple-choice",
      "question": "Which keyword prints to the console in Python?",
      "options": ["echo", "print", "display", "write"],
      "correctIndex": 1,
      "hint": "It is an all-lowercase English verb.",
      "explanation": "print() is the standard Python built-in."
    },
    {
      "id": "q2-predict",
      "type": "predict-output",
      "question": "What will this snippet output?",
      "codeSnippet": "print(3 * 3)",
      "expectedOutput": "9",
      "hint": "The asterisk (*) denotes multiplication.",
      "explanation": "3 multiplied by 3 yields 9."
    },
    {
      "id": "q3-fix",
      "type": "code-fix",
      "question": "Fix the missing parenthesis.",
      "taskInstructions": "Add the closing parenthesis to make the code execute without error.",
      "brokenCode": "print(\"Fixed!\"",
      "solutionCode": "print(\"Fixed!\")",
      "hints": ["Check that both ( and ) are present."],
      "explanation": "Every opening parenthesis must be closed."
    }
  ]
}
```

### 3.6. `common-mistakes`
Shows anti-patterns, why they fail, and the proper fix.
```json
{
  "type": "common-mistakes",
  "title": "Common Pitfalls",
  "mistakes": [
    {
      "title": "Capitalizing print",
      "badCode": "Print(\"Hello\")",
      "goodCode": "print(\"Hello\")",
      "explanation": "Python is case-sensitive. Print raises a NameError."
    }
  ]
}
```

### 3.7. `recap`
Key takeaways bullet points shown at the end of the lesson.
```json
{
  "type": "recap",
  "title": "Lesson Wrap-Up",
  "takeaways": [
    "print() sends characters to standard output.",
    "Parentheses and matching quotation marks are strictly required."
  ]
}
```

### 3.8. `deeper-dive`
Optional expandable advanced explanation for curious students without cluttering the main flow.
```json
{
  "type": "deeper-dive",
  "title": "How Python Executes Code Internally",
  "content": "Python compiles source code into bytecode (.pyc) before interpreting it inside the CPython virtual machine."
}
```

---

## 4. Prerequisite Concept Tracking

The curriculum engine verifies that concepts are taught in logical order.
- In each lesson, specify `"conceptsIntroduced": ["my_concept"]`.
- In downstream lessons that depend on it, specify `"prerequisites": ["my_concept"]`.
- If a lesson requires a prerequisite that was never introduced or was introduced in a later lesson, `npm run validate:curriculum` will flag an error.
