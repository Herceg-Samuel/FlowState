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
