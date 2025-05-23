import type { Badge } from '@/lib/types';
import { BookOpen, Brain, Coffee, Edit3, Feather, Award, Zap, Star, Sun, Moon, TrendingUp } from 'lucide-react';

export const BADGES_CONFIG: Badge[] = [
  {
    id: 'first_words',
    name: 'Word Weaver',
    description: 'Wrote your first 100 words. Welcome!',
    icon: Edit3,
    criteria: (stats) => stats.wordCount >= 100,
    bgColor: 'bg-green-500/20',
    iconColor: 'text-green-500'
  },
  {
    id: 'novelist_start',
    name: 'Budding Author',
    description: 'Reached 1,000 words. Keep it up!',
    icon: BookOpen,
    criteria: (stats) => stats.wordCount >= 1000,
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-500'
  },
  {
    id: 'first_pomodoro',
    name: 'Focus Initiate',
    description: 'Completed your first Pomodoro session.',
    icon: Brain,
    criteria: (stats) => stats.pomodorosCompletedThisSession >= 1 || stats.totalPomodorosCompleted >=1,
    bgColor: 'bg-purple-500/20',
    iconColor: 'text-purple-500'
  },
  {
    id: 'pomodoro_master',
    name: 'Pomodoro Pro',
    description: 'Completed 5 Pomodoro sessions in one go.',
    icon: Coffee,
    criteria: (stats) => stats.pomodorosCompletedThisSession >= 5,
    bgColor: 'bg-red-500/20',
    iconColor: 'text-red-500'
  },
  {
    id: 'zen_master',
    name: 'Zen Seeker',
    description: 'Used Zen Mode for a focused session.',
    icon: Feather,
    criteria: (stats) => stats.zenSessions >= 1,
    bgColor: 'bg-sky-500/20',
    iconColor: 'text-sky-500'
  },
  {
    id: 'word_sprint_500',
    name: 'Sprint Star',
    description: 'Wrote 500 words in a single session/Pomodoro.', // Note: requires session word count logic
    icon: Zap,
    criteria: (stats) => false, // Placeholder: stats.currentSessionWordCount >= 500
    bgColor: 'bg-yellow-500/20',
    iconColor: 'text-yellow-500'
  },
  {
    id: 'daily_writer',
    name: 'Daily Dabbler',
    description: 'Wrote something today!',
    icon: Sun,
    criteria: (stats) => stats.writingTimeToday > 0,
    bgColor: 'bg-orange-500/20',
    iconColor: 'text-orange-500'
  },
  {
    id: 'streak_3_days',
    name: 'Consistent Quill',
    description: 'Maintained a 3-day writing streak.',
    icon: TrendingUp,
    criteria: (stats) => stats.currentStreak >= 3,
    bgColor: 'bg-teal-500/20',
    iconColor: 'text-teal-500'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Completed a writing session after midnight.', // Note: requires time-based logic
    icon: Moon,
    criteria: (stats) => false, // Placeholder
    bgColor: 'bg-indigo-500/20',
    iconColor: 'text-indigo-500'
  },
  {
    id: 'goal_getter_words',
    name: 'Target Acquired',
    description: 'Achieved a word count goal.', // Note: requires goal tracking
    icon: Award,
    criteria: (stats) => false, // Placeholder
    bgColor: 'bg-pink-500/20',
    iconColor: 'text-pink-500'
  },
];
