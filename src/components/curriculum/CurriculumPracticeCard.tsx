import React, { useState } from "react";
import { PracticeQuestion } from "../../data/curriculum/schema";
import { Check, X, Lightbulb, Play, RotateCcw } from "lucide-react";
import { runPythonCode } from "../../lib/pyodideRunner";

interface CurriculumPracticeCardProps {
  question: PracticeQuestion;
  onAnswerCorrect?: (id: string) => void;
}

export const CurriculumPracticeCard: React.FC<CurriculumPracticeCardProps> = ({
  question,
  onAnswerCorrect,
}) => {
  const qAny = question as any;

  // State for multiple-choice
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasCheckedMc, setHasCheckedMc] = useState<boolean>(false);

  // State for predict-output, short-answer, and code-output
  const [textAnswerInput, setTextAnswerInput] = useState<string>("");
  const [isTextAnswerSubmitted, setIsTextAnswerSubmitted] = useState<boolean>(false);
  const [showAnswerReveal, setShowAnswerReveal] = useState<boolean>(false);

  // State for code-fix
  const [fixCode, setFixCode] = useState<string>(
    question.type === "code-fix" ? qAny.brokenCode || "" : ""
  );
  const [fixResult, setFixResult] = useState<{ stdout: string; stderr: string; isError: boolean } | null>(null);
  const [isFixRunning, setIsFixRunning] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);


  // Hint state
  const [showHint, setShowHint] = useState<boolean>(false);

  const questionTitle = qAny.question || qAny.prompt || "Question";
  const questionHint = qAny.hint || (Array.isArray(qAny.hints) ? qAny.hints.join(" · ") : null);
  const codeSnippet = qAny.codeSnippet;
  const targetAnswer = qAny.correctAnswer || qAny.expectedOutput || "";
  const acceptedAnswers: string[] = qAny.acceptedAnswers || qAny.acceptedOutputs || [];

  // Multiple Choice Handler
  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setHasCheckedMc(true);
    if (question.type === "multiple-choice") {
      const isCorrect = qAny.correctIndex !== undefined
        ? idx === qAny.correctIndex
        : qAny.correctAnswer && qAny.options
        ? qAny.options[idx]?.trim().toLowerCase() === qAny.correctAnswer.trim().toLowerCase()
        : false;
      if (isCorrect && onAnswerCorrect) {
        onAnswerCorrect(question.id);
      }
    }
  };

  // Text Answer Handler
  const handleCheckTextAnswer = () => {
    setIsTextAnswerSubmitted(true);
    const normalize = (s: string) =>
      s.trim().toLowerCase().replace(/\r\n/g, "\n").replace(/[.,!?;:]+$/, "");

    const user = normalize(textAnswerInput);
    const expected = normalize(targetAnswer);
    const acceptedNorm = acceptedAnswers.map(normalize);

    const isCorrect =
      user.length > 0 &&
      (user === expected ||
        acceptedNorm.includes(user) ||
        (expected.length > 10 && (user.includes(expected) || expected.includes(user))));

    if (isCorrect && onAnswerCorrect) {
      onAnswerCorrect(question.id);
    }
  };


  // Code Fix Handler
  const handleRunCodeFix = async () => {
    setIsFixRunning(true);
    try {
      const res = await runPythonCode(fixCode);
      setFixResult({
        stdout: res.stdout,
        stderr: res.stderr,
        isError: res.isError,
      });
      if (!res.isError && onAnswerCorrect) {
        onAnswerCorrect(question.id);
      }
    } catch (e: any) {
      setFixResult({
        stdout: "",
        stderr: e.message || "Execution error",
        isError: true,
      });
    } finally {
      setIsFixRunning(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs my-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
          {questionTitle}
        </h4>

        {questionHint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
            title="Hint"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? "Hide Hint" : "Hint"}</span>
          </button>
        )}
      </div>

      {/* Optional Hint display */}
      {showHint && questionHint && (
        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
          <span className="font-semibold">Hint: </span>
          <span>{questionHint}</span>
        </div>
      )}

      {/* Code Snippet for question */}
      {question.type !== "code-fix" && codeSnippet && (
        <div className="space-y-1.5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>Code snippet:</span>
          </div>
          <pre className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs overflow-x-auto border border-slate-200 dark:border-slate-800 shadow-xs">
            {codeSnippet}
          </pre>
        </div>
      )}

      {/* Multiple-Choice */}
      {question.type === "multiple-choice" && question.options && question.options.length > 0 && (
        <div className="space-y-2 pt-1">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = question.correctIndex !== undefined
              ? idx === question.correctIndex
              : question.correctAnswer
              ? opt.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
              : false;

            let btnClass = "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200";

            if (hasCheckedMc) {
              if (isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium";
              } else if (isSelected) {
                btnClass = "border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200";
              }
            } else if (isSelected) {
              btnClass = "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnClass}`}
              >
                <span>{opt}</span>
                {hasCheckedMc && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                {hasCheckedMc && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-500 shrink-0" />}
              </button>
            );
          })}

          {hasCheckedMc && question.explanation && (
            <div className="p-3 rounded-lg text-xs leading-relaxed bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Explanation: </span>
              <span>{question.explanation}</span>
            </div>
          )}
        </div>
      )}

      {/* Short-Answer / Predict Output / Code Output */}
      {(question.type === "short-answer" || question.type === "code-output" || question.type === "predict-output") && (
        <div className="space-y-2 pt-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={textAnswerInput}
              onChange={(e) => setTextAnswerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheckTextAnswer();
              }}
              placeholder={
                question.type === "code-output" || question.type === "predict-output"
                  ? "Enter output..."
                  : "Type answer..."
              }
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckTextAnswer}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Submit Answer »
              </button>
              <button
                onClick={() => setShowAnswerReveal(!showAnswerReveal)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              >
                {showAnswerReveal ? "Hide" : "Show Answer"}
              </button>
            </div>
          </div>

          {/* Feedback on Check */}
          {isTextAnswerSubmitted && (
            <div
              className={`p-3 rounded-lg text-xs ${
                textAnswerInput.trim().toLowerCase() === targetAnswer.trim().toLowerCase() ||
                acceptedAnswers.map((s) => s.trim().toLowerCase()).includes(textAnswerInput.trim().toLowerCase())
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
              }`}
            >
              <div className="font-medium">
                {textAnswerInput.trim().toLowerCase() === targetAnswer.trim().toLowerCase() ||
                acceptedAnswers.map((s) => s.trim().toLowerCase()).includes(textAnswerInput.trim().toLowerCase())
                  ? "✓ Correct!"
                  : `Answer: "${targetAnswer}"`}
              </div>
              {question.explanation && <p className="mt-1 text-slate-600 dark:text-slate-300">{question.explanation}</p>}
            </div>
          )}

          {/* Model Answer Reveal */}
          {showAnswerReveal && !isTextAnswerSubmitted && (
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Answer: </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{targetAnswer}</span>
              {question.explanation && (
                <p className="mt-1 text-slate-600 dark:text-slate-400">{question.explanation}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Code Fix */}
      {question.type === "code-fix" && (
        <div className="space-y-2 pt-1">
          {question.taskInstructions && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {question.taskInstructions}
            </p>
          )}

          <textarea
            value={fixCode}
            onChange={(e) => setFixCode(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs border border-slate-300 dark:border-slate-800 resize-y focus:outline-hidden"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCodeFix}
                disabled={isFixRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFixRunning ? "Testing..." : "Test Fix"}</span>
              </button>
              <button
                onClick={() => {
                  setFixCode(question.brokenCode || "");
                  setFixResult(null);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {question.solutionCode && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
              >
                {showSolution ? "Hide Solution" : "View Solution"}
              </button>
            )}
          </div>

          {showSolution && question.solutionCode && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-emerald-700 dark:text-emerald-300">
              <pre>{question.solutionCode}</pre>
            </div>
          )}

          {fixResult && (
            <div
              className={`p-3 rounded-lg text-xs font-mono border ${
                !fixResult.isError
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900/60"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-900/60"
              }`}
            >
              <div className="font-sans font-semibold mb-1">
                {!fixResult.isError ? "✓ Success! Fix worked cleanly." : "Execution Error:"}
              </div>
              {fixResult.stdout && <div>Output: {fixResult.stdout}</div>}
              {fixResult.stderr && <div>{fixResult.stderr}</div>}
              {question.explanation && (
                <div className="font-sans text-[11px] text-slate-600 dark:text-slate-400 mt-1">{question.explanation}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
