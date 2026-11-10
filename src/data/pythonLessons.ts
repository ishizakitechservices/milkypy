import { LessonModule } from "../types";
import { PHASE_0_MODULE } from "./lessons/phase0";
import { PHASE_1_MODULE } from "./lessons/phase1";
import { PHASE_2_MODULE } from "./lessons/phase2";
import { PHASE_3_MODULE } from "./lessons/phase3";
import { PHASE_4_MODULE, PHASE_5_MODULE } from "./lessons/phasesAdvanced";
import {
  PHASE_6_MODULE,
  PHASE_7_MODULE,
  PHASE_8_MODULE,
  PHASE_9_MODULE,
  PHASE_10_MODULE,
} from "./lessons/phasesPro";
import {
  MRCET_UNIT_1_MODULE,
  MRCET_UNIT_2_MODULE,
  MRCET_UNIT_3_MODULE,
  MRCET_UNIT_4_MODULE,
  MRCET_UNIT_5_MODULE,
  MRCET_ALL_UNITS,
} from "./lessons/mrcetUnits";

export {
  MRCET_UNIT_1_MODULE,
  MRCET_UNIT_2_MODULE,
  MRCET_UNIT_3_MODULE,
  MRCET_UNIT_4_MODULE,
  MRCET_UNIT_5_MODULE,
  MRCET_ALL_UNITS,
};

export const STANDARD_PHASES: LessonModule[] = [
  PHASE_0_MODULE,
  PHASE_1_MODULE,
  PHASE_2_MODULE,
  PHASE_3_MODULE,
  PHASE_4_MODULE,
  PHASE_5_MODULE,
  PHASE_6_MODULE,
  PHASE_7_MODULE,
  PHASE_8_MODULE,
  PHASE_9_MODULE,
  PHASE_10_MODULE,
];

// Complete Blended Curriculum: Standard Zero-to-Pro progression + Official MRCET B.Tech Syllabus Units
export const PYTHON_MODULES: LessonModule[] = [
  ...STANDARD_PHASES,
  ...MRCET_ALL_UNITS,
];

export function getLessonById(id: string) {
  for (const mod of PYTHON_MODULES) {
    const found = mod.lessons.find((l) => l.id === id);
    if (found) return { lesson: found, module: mod };
  }
  return null;
}
