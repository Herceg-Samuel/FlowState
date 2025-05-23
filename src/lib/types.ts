
import type { LucideIcon } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  criteria: (stats: AppStats) => boolean;
  achieved?: boolean;
  bgColor?: string;
  iconColor?: string;
}

export interface AppStats {
  wordCount: number;
  pomodorosCompletedThisSession: number;
  totalPomodorosCompleted: number;
  writingTimeToday: number; // in seconds
  zenSessions: number;
  currentStreak: number; // days
  // Optional: add if specific logic for "words in current session" is needed for badges
  // currentSessionWordCount: number;
}

export interface PomodoroState {
  isRunning: boolean;
  timeLeft: number;
  currentInterval: 'work' | 'shortBreak' | 'longBreak';
  cycleCount: number; // Number of work intervals completed in the current set of 4
}

export type PomodoroConfig = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesPerLongBreak: number;
};

export interface FocusSettingsState {
  enableParagraphFocus: boolean;
  enableDynamicLighting: boolean;
  enableDeepWorkMode: boolean;
  enableContentAwareBreaks: boolean;
  enableAiWritingExercises: boolean;
}

// AI Flow Types
export interface SuggestBreakPointInput {
  text: string;
}
export interface SuggestBreakPointOutput {
  isGoodBreakPoint: boolean;
  reason: string;
  suggestedAction?: string; // e.g., "Consider wrapping up this section."
}

export interface GenerateWritingExerciseInput {
  currentTopic?: string; // Optional: to tailor exercise
  textLength?: number; // Optional: word count of current text
}
export interface GenerateWritingExerciseOutput {
  exercisePrompt: string;
  category?: string; // e.g., "Creativity Booster", "Plot Untangler"
}

export interface SuggestStuckActivityInput {
  currentText: string;
  problemDescription?: string; // Optional: user describes what they are stuck on
}
export interface SuggestStuckActivityOutput {
  activitySuggestion: string;
  rationale?: string; // Why this activity might help
  estimatedTime?: string; // e.g., "5-10 minutes"
}

export interface ImproveWritingInput {
  text: string;
}
export interface ImproveWritingOutput {
  originalText: string;
  improvedText: string;
  suggestions?: string[];
}
