import React, { useState } from "react";
import {
  FolderCode,
  Copy,
  Check,
  Download,
  FileCode,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Layers,
  ArrowLeft,
  Terminal,
  Play,
  CheckCircle2,
} from "lucide-react";
import singleFileTemplate from "../../data/curriculum/template-single-file.json";
import moduleTemplate from "../../data/curriculum/template-module.json";

interface CurriculumEmptyGuideProps {
  onBack?: () => void;
}

export const CurriculumEmptyGuide: React.FC<CurriculumEmptyGuideProps> = ({ onBack }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"single-file" | "sections" | "questions" | "prereqs">("single-file");
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const singleFileJsonString = JSON.stringify(singleFileTemplate, null, 2);

  const handleCopySingleTemplate = () => {
    navigator.clipboard.writeText(singleFileJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([singleFileJsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculum.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-y-auto transition-colors">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Lessons</span>
            </button>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FolderCode className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Curriculum Format & Authoring Guide
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Add, customize, or replace the entire curriculum by editing or dropping in a single JSON file.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>Target File Path in Codebase:</span>
              </div>
              <code className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 select-all inline-block font-semibold">
                src/data/curriculum/curriculum.json
              </code>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Drop your JSON into this file. It is automatically read and validated on startup.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopySingleTemplate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Template Copied!" : "Copy Clean Template"}</span>
              </button>
              <button
                onClick={handleDownloadSingleFile}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Download curriculum.json template"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Documentation Tabs */}
      <div className="max-w-4xl mx-auto w-full px-6 py-6 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("single-file")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "single-file"
                ? "border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Full Template (curriculum.json)</span>
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "sections"
                ? "border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lesson Section Types</span>
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "questions"
                ? "border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Practice Exercises</span>
          </button>
          <button
            onClick={() => setActiveTab("prereqs")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "prereqs"
                ? "border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Prerequisites & Validation</span>
          </button>
        </div>

        {/* Tab 1: Single File Full Starter Template */}
        {activeTab === "single-file" && (
          <div className="flex flex-col flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                src/data/curriculum/curriculum.json
              </span>
              <button
                onClick={handleCopySingleTemplate}
                className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied to clipboard" : "Copy All JSON"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto select-all leading-relaxed max-h-[500px]">
              {singleFileJsonString}
            </pre>
          </div>
        )}

        {/* Tab 2: Section Types */}
        {activeTab === "sections" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every lesson contains an array of sections. Here are the core W3Schools-style section building blocks:
            </p>

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold">
                  type: "explanation"
                </span>
                <button
                  onClick={() =>
                    handleCopySnippet(
                      JSON.stringify(
                        {
                          type: "explanation",
                          title: "Concept Title",
                          content: "Short explanation.\n\n### Syntax\n\n```python\nprint(\"Hello\")\n```\n\n| Part | Description |\n| :--- | :--- |\n| print | Built-in command |",
                        },
                        null,
                        2
                      ),
                      "exp"
                    )
                  }
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippetId === "exp" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Markdown content supporting headings, syntax tables, bold text, and bullet lists.
              </p>
            </div>

            {/* Syntax */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-semibold">
                  type: "syntax"
                </span>
                <button
                  onClick={() =>
                    handleCopySnippet(
                      JSON.stringify(
                        {
                          type: "syntax",
                          title: "Syntax",
                          syntax: 'print(object, sep=" ", end="\\n")',
                          components: [
                            { component: "print", purpose: "Built-in output function", example: "print" },
                            { component: "object", purpose: "Value or expression to print", example: '"Hello"' },
                            { component: "sep", purpose: "Separator between multiple items", example: '"-"' }
                          ],
                          notes: "Optional notes below component table."
                        },
                        null,
                        2
                      ),
                      "syn"
                    )
                  }
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippetId === "syn" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                W3Schools-style syntax card displaying code syntax and a structured component breakdown table.
              </p>
            </div>

            {/* Example */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold">
                  type: "example"
                </span>
                <button
                  onClick={() =>
                    handleCopySnippet(
                      JSON.stringify(
                        {
                          type: "example",
                          title: "Example: Hello World",
                          code: 'print("Hello, World!")',
                          expectedOutput: "Hello, World!",
                        },
                        null,
                        2
                      ),
                      "ex"
                    )
                  }
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippetId === "ex" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Worked code demonstration with a direct "Run" button and expected console output.
              </p>
            </div>

            {/* Editor Activity */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                  type: "editor-activity"
                </span>
                <button
                  onClick={() =>
                    handleCopySnippet(
                      JSON.stringify(
                        {
                          type: "editor-activity",
                          title: "Try it Yourself",
                          instructions: "Write your solution and click Run Code.",
                          starterCode: 'print("Hello, World!")\n',
                          solutionCode: 'print("Hello, World!")',
                          expectedOutput: "Hello, World!",
                          hints: ["Keep the quotation marks around the text."],
                        },
                        null,
                        2
                      ),
                      "act"
                    )
                  }
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippetId === "act" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Interactive coding sandbox with instructions, starter code, Python execution, and hints.
              </p>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold">
                  type: "common-mistakes"
                </span>
                <button
                  onClick={() =>
                    handleCopySnippet(
                      JSON.stringify(
                        {
                          type: "common-mistakes",
                          title: "Common Mistakes to Avoid",
                          mistakes: [
                            {
                              title: "Capitalizing the print keyword",
                              badCode: 'Print("Hello")',
                              goodCode: 'print("Hello")',
                              explanation: "Python is case-sensitive! Built-in functions must be lowercase.",
                            },
                          ],
                        },
                        null,
                        2
                      ),
                      "mis"
                    )
                  }
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippetId === "mis" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Side-by-side Avoid vs Better code comparison highlighting realistic learner errors.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Questions */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              PySlide Lab supports two straightforward exercise question types for comprehension checks:
            </p>

            {/* Short Answer / Fill in the blank */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-semibold">
                  type: "short-answer" (Fill-in-the-blank)
                </span>
              </div>
              <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 overflow-x-auto">
{`{
  "id": "q-sample-1",
  "type": "short-answer",
  "question": "Insert the missing keyword: ____(\\"Hello\\")",
  "correctAnswer": "print",
  "acceptedAnswers": ["print", "print()"],
  "explanation": "print() displays text on screen."
}`}
              </pre>
            </div>

            {/* Multiple Choice */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold">
                  type: "multiple-choice"
                </span>
              </div>
              <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 overflow-x-auto">
{`{
  "id": "q-sample-2",
  "type": "multiple-choice",
  "question": "What is Python?",
  "options": [
    "A beginner-friendly programming language",
    "A computer chip",
    "A web browser"
  ],
  "correctIndex": 0,
  "explanation": "Python is a high-level programming language."
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Prerequisites */}
        {activeTab === "prereqs" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Automated Validation Engine</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Whenever you add or modify lessons, run the built-in validator to verify that all JSON syntax and prerequisites are valid:
              </p>
              <div className="p-3 bg-slate-900 dark:bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>npm run validate:curriculum</span>
                <span className="text-[10px] text-slate-400 font-sans">CLI command</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The validator checks for valid JSON syntax, unique IDs, and ensures lessons only reference concepts that have already been taught earlier in the sequence.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
