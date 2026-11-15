import React from "react";
import { LessonSection as LessonSectionType } from "../../data/curriculum/schema";
import styles from "./LessonSection.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, BookOpen, Code, CheckCircle2, XCircle, Terminal, Compass } from "lucide-react";
import { CurriculumInlineEditor } from "./CurriculumInlineEditor";
import { CurriculumPracticeCard } from "./CurriculumPracticeCard";
import { CopyCodeButton } from "../CopyCodeButton";

interface LessonSectionProps {
  section: LessonSectionType;
  onPracticeCorrect?: (id: string) => void;
  lessonContext?: any;
  onOpenAiAssist?: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick?: (code: string) => void;
}

export const LessonSection: React.FC<LessonSectionProps> = ({
  section,
  onPracticeCorrect,
  lessonContext,
  onOpenAiAssist,
  onPracticeClick,
}) => {
  const markdownComponents = React.useMemo(
    () => ({
      pre: ({ children }: any) => {
        const child = React.Children.toArray(children)[0] as React.ReactElement<any> | undefined;
        const className = child?.props?.className || "";
        const langMatch = /language-(\w+)/.exec(className);
        const lang = langMatch ? langMatch[1] : "python";
        const rawCode = String(child?.props?.children || "").replace(/\n$/, "");

        return (
          <div className={styles.markdownCodeWrapper}>
            <div className={styles.markdownCodeHeader}>
              <span className={styles.markdownCodeLang}>
                {lang === "python" || lang === "py" ? "Python" : lang}
              </span>
              <div className="flex items-center gap-2">
                {onPracticeClick && (lang === "python" || lang === "py") && rawCode.trim() && (
                  <button
                    type="button"
                    onClick={() => onPracticeClick(rawCode)}
                    className="text-[11px] font-sans font-semibold text-blue-600 dark:text-[#8BBEFF] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Open code in Playground"
                  >
                    <Code className="w-3 h-3" />
                    <span>Try in Playground</span>
                  </button>
                )}
                {rawCode.trim() && <CopyCodeButton code={rawCode} compact />}
              </div>
            </div>
            <pre className={styles.markdownCodePre}>
              <code>{rawCode}</code>
            </pre>
          </div>
        );
      },
      code: ({ node, inline, className, children, ...props }: any) => {
        // Block <code> inside <pre> is handled by pre renderer above
        return (
          <code className={styles.inlineCode} {...props}>
            {children}
          </code>
        );
      },
    }),
    [onPracticeClick]
  );

  switch (section.type) {
    // ----------------------------------------------------
    // 1. Syntax Section
    // ----------------------------------------------------
    case "syntax": {
      const syntaxCode = section.syntax || section.code || "";
      const components = section.components || [];

      return (
        <div className={styles.sectionContainer}>
          {section.title && <h2 className={styles.sectionHeading}>{section.title}</h2>}
          <div className={styles.syntaxCard}>
            <div className={styles.syntaxHeader}>
              <span className={styles.syntaxTitle}>
                <Code className="w-3.5 h-3.5" />
                <span>Syntax</span>
              </span>
              <div className="flex items-center gap-2">
                <span className={styles.syntaxLangLabel}>Python</span>
                {syntaxCode && <CopyCodeButton code={syntaxCode} compact />}
              </div>
            </div>

            {syntaxCode && (
              <pre className={styles.syntaxCodeBlock}>{syntaxCode}</pre>
            )}

            {section.description && (
              <p className={styles.syntaxDescription}>{section.description}</p>
            )}

            {components.length > 0 && (
              <div className={styles.componentTableWrapper}>
                <table className={styles.componentTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "28%" }}>Component</th>
                      <th>Purpose & Description</th>
                      {components.some((c) => c.example) && <th style={{ width: "28%" }}>Example</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {components.map((c, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className={styles.componentBadge}>{c.component}</span>
                          {c.required !== undefined && (
                            <span className="ml-1.5 text-[10px] text-slate-400 font-sans">
                              {c.required ? "(required)" : "(optional)"}
                            </span>
                          )}
                        </td>
                        <td>{c.purpose}</td>
                        {components.some((item) => item.example) && (
                          <td className="font-mono text-xs text-blue-600 dark:text-blue-400">
                            {c.example ? <code>{c.example}</code> : "—"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.notes && (
              <div className={styles.syntaxNotes}>{section.notes}</div>
            )}
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 2. Example Section
    // ----------------------------------------------------
    case "example": {
      const stepWalkthrough: string[] = section.stepByStep || section.walkthrough || [];
      const descriptionText = section.description || section.explanation;

      return (
        <div className={styles.sectionContainer}>
          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <span className={styles.exampleTitle}>
                <Terminal className="w-3.5 h-3.5 text-emerald-500 inline-block mr-1" />
                <span>{section.title || "Example"}</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {section.code && <CopyCodeButton code={section.code} compact />}
                {onPracticeClick && section.code && (
                  <button
                    type="button"
                    onClick={() => onPracticeClick(section.code)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-sans font-semibold text-blue-700 dark:text-[#8BBEFF] bg-blue-50/80 dark:bg-[#8BBEFF]/10 border border-blue-200 dark:border-[#8BBEFF]/30 hover:bg-blue-100 dark:hover:bg-[#8BBEFF]/20 transition-colors cursor-pointer"
                    title="Open this example in Playground"
                  >
                    <Code className="w-3 h-3" />
                    <span>Try in Playground</span>
                  </button>
                )}
              </div>
            </div>

            {descriptionText && (
              <p className={styles.exampleDescription}>{descriptionText}</p>
            )}

            <pre className={styles.exampleCodeBlock}>{section.code}</pre>

            {section.expectedOutput && (
              <div className={styles.outputBox}>
                <span className={styles.outputLabel}>Expected Output:</span>
                <pre className="whitespace-pre-wrap">{section.expectedOutput}</pre>
              </div>
            )}

            {stepWalkthrough.length > 0 && (
              <div className={styles.walkthroughContainer}>
                <span className={styles.walkthroughTitle}>Step-by-step Walkthrough:</span>
                <ol className={styles.walkthroughList}>
                  {stepWalkthrough.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 3. Common Mistakes Section (Avoid vs Better)
    // ----------------------------------------------------
    case "common-mistakes": {
      return (
        <div className={styles.sectionContainer}>
          <div className={styles.mistakesCard}>
            <div className={styles.mistakesHeader}>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{section.title || "Common Mistakes to Avoid"}</span>
            </div>

            <div className={styles.mistakesBody}>
              {section.mistakes.map((m, idx) => {
                const mistakeTitle = m.mistake || m.title || "Common Pitfall";
                const badCode = m.incorrectCode || m.badCode || "";
                const goodCode = m.correctedCode || m.goodCode || "";
                const explanationText = m.correction || m.whyItHappens || m.explanation;

                return (
                  <div key={idx} className={styles.mistakeItem}>
                    <div className={styles.mistakeItemTitle}>{mistakeTitle}</div>
                    {(badCode || goodCode) && (
                      <div className={styles.codeCompareGrid}>
                        {badCode && (
                          <div className={styles.avoidBox}>
                            <div className={styles.compareLabelRow}>
                              <span className={styles.compareLabel}>
                                <XCircle className="w-3.5 h-3.5 text-rose-500 inline mr-1 -mt-0.5" />
                                Avoid
                              </span>
                              <CopyCodeButton code={badCode} compact />
                            </div>
                            <pre className="whitespace-pre-wrap">{badCode}</pre>
                          </div>
                        )}
                        {goodCode && (
                          <div className={styles.betterBox}>
                            <div className={styles.compareLabelRow}>
                              <span className={styles.compareLabel}>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline mr-1 -mt-0.5" />
                                Better
                              </span>
                              <div className="flex items-center gap-1.5">
                                {onPracticeClick && (
                                  <button
                                    type="button"
                                    onClick={() => onPracticeClick(goodCode)}
                                    className="text-[11px] font-sans font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
                                    title="Open corrected snippet in Playground"
                                  >
                                    Try
                                  </button>
                                )}
                                <CopyCodeButton code={goodCode} compact />
                              </div>
                            </div>
                            <pre className="whitespace-pre-wrap">{goodCode}</pre>
                          </div>
                        )}
                      </div>
                    )}
                    {explanationText && (
                      <p className={styles.mistakeExplanation}>{explanationText}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 4. In-depth Concept / Explanation
    // ----------------------------------------------------
    case "explanation": {
      return (
        <div className={styles.sectionContainer}>
          {section.title && <h2 className={styles.sectionHeading}>{section.title}</h2>}
          <div className={styles.proseBlock}>
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {section.content}
            </Markdown>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 5. Try It Yourself Activity
    // ----------------------------------------------------
    case "editor-activity": {
      const instructionsString = Array.isArray(section.instructions)
        ? section.instructions.join("\n")
        : section.instructions;

      return (
        <div className={styles.sectionContainer}>
          <CurriculumInlineEditor
            starterCode={section.starterCode}
            instructions={instructionsString}
            solutionCode={section.solutionCode}
            expectedOutput={section.expectedOutput}
            hints={section.hints}
            lessonContext={lessonContext}
            onOpenAiAssist={onOpenAiAssist}
            onPracticeClick={onPracticeClick}
          />
        </div>
      );
    }

    // ----------------------------------------------------
    // 6. Test Yourself Practice Card
    // ----------------------------------------------------
    case "practice": {
      return (
        <div className={styles.sectionContainer}>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {section.title || "Test Yourself With Exercises"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {section.instructions || "Answer the questions to test what you've learned."}
          </p>
          <div className="space-y-3">
            {section.questions.map((q) => (
              <CurriculumPracticeCard
                key={q.id}
                question={q}
                onAnswerCorrect={onPracticeCorrect}
              />
            ))}
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 7. Technical Terms
    // ----------------------------------------------------
    case "terms": {
      return (
        <div className={styles.sectionContainer}>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{section.title || "Key Terms"}</span>
            </div>
            <dl className="space-y-2.5">
              {section.terms.map((t, idx) => (
                <div key={idx} className="border-b last:border-b-0 border-slate-100 dark:border-slate-800/80 pb-2.5 last:pb-0">
                  <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.term}</dt>
                  <dd className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{t.definition}</dd>
                  {t.example && (
                    <dd className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-0.5">e.g. {t.example}</dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 8. Recap Section
    // ----------------------------------------------------
    case "recap": {
      const takeawaysList = section.takeaways || section.keyPoints || [];
      return (
        <div className={styles.sectionContainer}>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {section.title || "Lesson Recap"}
            </h4>
            {takeawaysList.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                {takeawaysList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
            {section.takeaway && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic">
                {section.takeaway}
              </p>
            )}
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 9. Deeper Dive Section
    // ----------------------------------------------------
    case "deeper-dive": {
      return (
        <div className={styles.sectionContainer}>
          <div className="p-4 sm:p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{section.title || "Deeper Dive"}</span>
            </div>
            <div className={styles.proseBlock}>
              <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {section.content}
              </Markdown>
            </div>
            {section.challenge && (
              <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-indigo-200/80 dark:border-indigo-800/50 text-xs text-slate-700 dark:text-slate-200">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">Challenge: </span>
                {section.challenge}
              </div>
            )}
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // 10. Future Preview Section
    // ----------------------------------------------------
    case "future-preview": {
      return (
        <div className={styles.sectionContainer}>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#252933] bg-slate-50/70 dark:bg-[#15171E] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-[#8BBEFF] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>{section.title || "Coming Up Next"}</span>
            </div>
            {(section.teaser || section.content) && (
              <p className="text-xs text-slate-600 dark:text-[#BFC4CE] leading-relaxed">
                {section.teaser || section.content}
              </p>
            )}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
