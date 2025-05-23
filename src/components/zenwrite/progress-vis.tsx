'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListChecks, Target, Clock, CheckCircle } from 'lucide-react';

interface ProgressVisProps {
  wordCount: number;
  wordGoal: number;
  timeElapsed: number; // in seconds
  timeGoal: number; // in minutes
  pomodorosCompletedThisSession: number;
}

export function ProgressVis({
  wordCount,
  wordGoal,
  timeElapsed, // in seconds
  timeGoal,    // in minutes
  pomodorosCompletedThisSession
}: ProgressVisProps) {
  const wordProgress = wordGoal > 0 ? Math.min((wordCount / wordGoal) * 100, 100) : 0;
  const timeGoalInSeconds = timeGoal * 60;
  const timeProgress = timeGoalInSeconds > 0 ? Math.min((timeElapsed / timeGoalInSeconds) * 100, 100) : 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><ListChecks className="mr-2 h-5 w-5" />Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
                {Math.floor(timeElapsed / 60)} / {timeGoal} min
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

        {(wordGoal === 0 && timeGoal === 0) && (
          <CardDescription className="text-center">Set goals to see your progress visualized here!</CardDescription>
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
