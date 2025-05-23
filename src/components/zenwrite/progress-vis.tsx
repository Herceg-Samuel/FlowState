
'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListChecks, Target, Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';
import type { AppStats } from '@/lib/types';
import { LEVEL_XP_THRESHOLDS } from '@/app/page'; // Import thresholds

interface ProgressVisProps {
  appStats: AppStats;
  wordGoal: number;
  timeGoal: number; // in minutes
}

export function ProgressVis({
  appStats,
  wordGoal,
  timeGoal,    // in minutes
}: ProgressVisProps) {
  const { wordCount, writingTimeToday, pomodorosCompletedThisSession, xp, level } = appStats;

  const wordProgress = wordGoal > 0 ? Math.min((wordCount / wordGoal) * 100, 100) : 0;
  const timeGoalInSeconds = timeGoal * 60;
  const timeProgress = timeGoalInSeconds > 0 ? Math.min((writingTimeToday / timeGoalInSeconds) * 100, 100) : 0;

  // Calculate XP progress for current level
  const xpForCurrentLevelStart = level > 1 ? LEVEL_XP_THRESHOLDS[level - 1] : 0;
  const xpForNextLevel = LEVEL_XP_THRESHOLDS[level] ?? Infinity; // XP needed to reach (level + 1)
  
  const xpInCurrentLevel = xp - xpForCurrentLevelStart;
  const xpNeededForThisLevelSpan = xpForNextLevel - xpForCurrentLevelStart;
  const levelXpProgress = xpNeededForThisLevelSpan > 0 ? Math.min((xpInCurrentLevel / xpNeededForThisLevelSpan) * 100, 100) : 0;


  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><ListChecks className="mr-2 h-5 w-5" />Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <div className="flex items-center mb-1">
                    <Star className="mr-2 h-4 w-4 text-yellow-500" /> 
                    <span className="text-sm font-medium">Level: </span>
                    <span className="text-sm text-yellow-400 font-semibold ml-1">{level}</span>
                </div>
            </div>
             <div>
                <div className="flex items-center mb-1">
                <TrendingUp className="mr-2 h-4 w-4 text-green-500" /> 
                <span className="text-sm font-medium">XP: </span>
                <span className="text-sm text-green-400 font-semibold ml-1">{xp.toLocaleString()}</span>
                </div>
            </div>
        </div>
        
        {level < LEVEL_XP_THRESHOLDS.length && xpForNextLevel !== Infinity && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="level-xp-progress" className="flex items-center text-sm font-medium">
                <Star className="mr-2 h-4 w-4 text-primary" /> XP to Next Level ({level + 1})
              </Label>
              <span className="text-xs text-muted-foreground">
                {xpInCurrentLevel.toLocaleString()} / {xpNeededForThisLevelSpan.toLocaleString()} XP
              </span>
            </div>
            <Progress id="level-xp-progress" value={levelXpProgress} className="w-full h-3" aria-label={`XP progress to next level: ${levelXpProgress.toFixed(0)}%`} />
          </div>
        )}


        {wordGoal > 0 && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="word-progress" className="flex items-center text-sm font-medium">
                <Target className="mr-2 h-4 w-4 text-primary" /> Word Goal
              </Label>
              <span className="text-sm text-muted-foreground">
                {wordCount} / {wordGoal} words
              </span>
            </div>
            <Progress id="word-progress" value={wordProgress} className="w-full h-3" aria-label={`Word goal progress: ${wordProgress.toFixed(0)}%`} />
          </div>
        )}

        {timeGoal > 0 && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="time-progress" className="flex items-center text-sm font-medium">
                <Clock className="mr-2 h-4 w-4 text-primary" /> Time Goal
              </Label>
              <span className="text-sm text-muted-foreground">
                {Math.floor(writingTimeToday / 60)} / {timeGoal} min
              </span>
            </div>
            <Progress id="time-progress" value={timeProgress} className="w-full h-3" aria-label={`Time goal progress: ${timeProgress.toFixed(0)}%`} />
          </div>
        )}
        
        <div>
            <div className="flex items-center mb-1">
              <CheckCircle className="mr-2 h-4 w-4 text-accent" /> 
              <span className="text-sm font-medium">Pomodoros This Session: </span>
              <span className="text-sm text-accent font-semibold ml-1">{pomodorosCompletedThisSession}</span>
            </div>
        </div>

        {(wordGoal === 0 && timeGoal === 0 && (level >= LEVEL_XP_THRESHOLDS.length || xpForNextLevel === Infinity)) && (
          <CardDescription className="text-center">Set goals or keep writing to see your progress visualized here!</CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

// Small Label component, as ShadCN Label is for form items mainly.
const Label = ({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
);
