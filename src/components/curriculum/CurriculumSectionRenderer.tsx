import React from "react";
import { LessonSection as LessonSectionType } from "../../data/curriculum/schema";
import { LessonSection } from "./LessonSection";

interface CurriculumSectionRendererProps {
  section: LessonSectionType;
  onPracticeCorrect?: (id: string) => void;
}

export const CurriculumSectionRenderer: React.FC<CurriculumSectionRendererProps> = ({
  section,
  onPracticeCorrect,
}) => {
  return (
    <LessonSection
      section={section}
      onPracticeCorrect={onPracticeCorrect}
    />
  );
};
