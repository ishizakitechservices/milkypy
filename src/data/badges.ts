export interface LearnerBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  category: "starter" | "milestone" | "mastery";
  requiredCount: number;
}

export const LEARNER_BADGES: LearnerBadge[] = [
  {
    id: "first_spark",
    title: "First Code Spark",
    description: "Completed your very first Python lesson! You're officially a coder!",
    icon: "★",
    gradient: "from-amber-400 to-orange-500",
    category: "starter",
    requiredCount: 1,
  },
  {
    id: "curious_coder",
    title: "Curious Coder",
    description: "Completed 3 lessons! Building coding momentum!",
    icon: "◆",
    gradient: "from-blue-400 to-indigo-600",
    category: "milestone",
    requiredCount: 3,
  },
  {
    id: "logic_explorer",
    title: "Logic Explorer",
    description: "Finished 5 lessons! Exploring logic, loops, and conditions!",
    icon: "●",
    gradient: "from-emerald-400 to-teal-600",
    category: "milestone",
    requiredCount: 5,
  },
  {
    id: "python_champion",
    title: "Python Champion",
    description: "Completed 8 lessons! Writing real Python programs with confidence!",
    icon: "▲",
    gradient: "from-purple-500 to-pink-500",
    category: "mastery",
    requiredCount: 8,
  },
  {
    id: "master_builder",
    title: "Master Builder",
    description: "Finished 10+ lessons! Ready to create your own software & games!",
    icon: "✦",
    gradient: "from-violet-600 to-amber-500",
    category: "mastery",
    requiredCount: 10,
  },
];

/**
 * Given a list of completed lesson IDs, return all earned badges
 */
export function getEarnedBadges(completedLessonIds: string[]): LearnerBadge[] {
  const count = completedLessonIds.length;
  return LEARNER_BADGES.filter((badge) => count >= badge.requiredCount);
}

/**
 * Check if the newly completed lesson count just unlocked a new badge
 */
export function getNewlyUnlockedBadge(
  prevCount: number,
  newCount: number
): LearnerBadge | null {
  const newlyUnlocked = LEARNER_BADGES.find(
    (b) => prevCount < b.requiredCount && newCount >= b.requiredCount
  );
  return newlyUnlocked || null;
}
