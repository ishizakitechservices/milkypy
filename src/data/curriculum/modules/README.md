# Curriculum Modules Directory

Place your curriculum module JSON files in this directory.

## How to add modules:
1. Create or drag your JSON files here (e.g. `module-01.json`, `module-02-variables.json`, etc.).
2. Follow the schema defined in `src/data/curriculum/schema.ts` (or reference `src/data/curriculum/template-module.json`).
3. The app automatically discovers all `*.json` files in this folder at build/run time using Vite's glob import:
   ```ts
   import.meta.glob("./modules/*.json", { eager: true })
   ```
4. Modules are sorted strictly by their `"order"` property (e.g. `1`, `2`, `3`...).
5. Validate your curriculum at any time by running:
   ```bash
   npm run validate:curriculum
   ```
