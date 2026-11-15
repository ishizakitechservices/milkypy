import React from "react";
import { LessonSection as LessonSectionType } from "../../data/curriculum/schema";
import { LessonSection } from "./LessonSection";

interface CurriculumSectionRendererProps {
  section: LessonSectionType;
  onPracticeCorrect?: (id: string) => void;
  lessonContext?: any;
  onOpenAiAssist?: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick?: (code: string) => void;
}

export const CurriculumSectionRenderer: React.FC<CurriculumSectionRendererProps> = ({
  section,
  onPracticeCorrect,
  lessonContext,
  onOpenAiAssist,
  onPracticeClick,
}) => {
  return (
    <LessonSection
      section={section}
      onPracticeCorrect={onPracticeCorrect}
      lessonContext={lessonContext}
      onOpenAiAssist={onOpenAiAssist}
      onPracticeClick={onPracticeClick}
    />
  );
};
