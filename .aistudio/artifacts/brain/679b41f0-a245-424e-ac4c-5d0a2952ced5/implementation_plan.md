# PySlide Lab: Modular Curriculum Engine & Minimal Lesson Reader

A beginner-friendly Python learning curriculum structured after the clear, modular W3Schools format, guiding students from their first line of code up to functions and reusable blocks.

---

## 1. W3Schools Lesson Format

Every lesson follows a clean, scannable, and practical structure:
1. **Clear Heading & Purpose**: Short, plain-English explanation without repetitive filler.
2. **Syntax Breakdown Table**: Clear breakdown of every keyword, parenthesis, and quotation mark (rendered with `remarkGfm` tables).
3. **Worked Code Example & Direct Output**: Clean code box with live "Run" and "Copy" buttons.
4. **Try It Yourself »**: Concrete, beginner-friendly challenge with sensible starter code in an embedded Pyodide runner.
5. **Test Yourself / Exercises**: Fill-in-the-blank (`____("Hello")`) and clean multiple-choice questions with a "Submit Answer »" button.
6. **Common Mistakes**: Contextually relevant typos and errors for what was taught in that exact lesson (no cognitive leaps!).
7. **Lesson Recap**: 3 concise bullet takeaways.

---

## 2. Curriculum Scope (Ending at Functions & Reusable Blocks)

1. **Module 1: Python Basics & Syntax (4 lessons)**
   - Python Introduction
   - The `print()` Function
   - Numbers & Basic Math
   - Python Comments
2. **Module 2: Variables & Data Types (4 lessons)**
   - Python Variables
   - Variable Naming Rules
   - Python Data Types (`str`, `int`, `float`, `bool`)
   - Type Casting (`int()`, `float()`, `str()`)
3. **Module 3: Operators & Booleans (3 lessons)**
   - Comparison Operators (`==`, `!=`, `>`, `<`, `>=`, `<=`)
   - Logical Operators (`and`, `or`, `not`)
   - F-Strings (Formatted Strings)
4. **Module 4: Conditions & Decisions (If...Else) (2 lessons)**
   - The `if` Statement & Indentation
   - The `else` and `elif` Statements
5. **Module 5: Loops (Repeating Things) (3 lessons)**
   - The `while` Loop & Counters
   - The `for` Loop & `range()`
   - `break` and `continue`
6. **Module 6: Collections (Lists & Dictionaries) (4 lessons)**
   - Python Lists & Indexing
   - List Methods (`append()`, `len()`, `remove()`)
   - Looping Through Lists
   - Python Dictionaries (`key: value`)
7. **Module 7: Functions & Reusable Blocks (Final Module - 4 lessons)**
   - Creating & Calling Functions (`def`)
   - Function Parameters & Arguments
   - The `return` Statement
   - Variable Scope & Course Recap

---

## 3. Validation & Build Health

- `npm run validate:curriculum`: 7 modules, 24 lessons, 30 practice questions, 110 active concepts — **100% valid**.
- `npm run lint` / `tsc --noEmit`: **0 errors**.
- Build: **Compiled successfully**.
