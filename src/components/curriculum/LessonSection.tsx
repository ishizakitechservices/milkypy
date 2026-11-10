import React from "react";
import { LessonSection as LessonSectionType } from "../../data/curriculum/schema";
import styles from "./LessonSection.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, BookOpen, Code } from "lucide-react";
import { CurriculumInlineEditor } from "./CurriculumInlineEditor";
import { CurriculumPracticeCard } from "./CurriculumPracticeCard";

interface LessonSectionProps {
  section: LessonSectionType;
  onPracticeCorrect?: (id: string) => void;
}

export const LessonSection: React.FC<LessonSectionProps> = ({
  section,
  onPracticeCorrect,
}) => {
  switch (section.type) {
    // ----------------------------------------------------
    // 1. W3Schools-Style Syntax Section
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
              <span className={styles.syntaxBadge}>Python</span>
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
    // 2. W3Schools-Style Example Section
    // ----------------------------------------------------
    case "example": {
      const stepWalkthrough: string[] = section.stepByStep || section.walkthrough || [];
      const descriptionText = section.description || section.explanation;

      return (
        <div className={styles.sectionContainer}>
          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <span className={styles.exampleTitle}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1" />
                <span>{section.title || "Example"}</span>
              </span>
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
                            <span className={styles.compareLabel}>❌ Avoid:</span>
                            <pre className="whitespace-pre-wrap">{badCode}</pre>
                          </div>
                        )}
                        {goodCode && (
                          <div className={styles.betterBox}>
                            <span className={styles.compareLabel}>✅ Better:</span>
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
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, inline, ...props }: any) => (
                  <code className={styles.inlineCode} {...props} />
                ),
              }}
            >
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

    default:
      return null;
  }
};
