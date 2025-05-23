'use client';

import type { PomodoroState, PomodoroConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WriteodoroProps {
  pomodoroState: PomodoroState;
  pomodoroConfig: PomodoroConfig;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function Writeodoro({
  pomodoroState,
  pomodoroConfig,
  onStart,
  onPause,
  onReset,
  onSkip,
  disabled,
}: WriteodoroProps) {
  const { isRunning, timeLeft, currentInterval } = pomodoroState;

  const getIntervalDuration = () => {
    switch (currentInterval) {
      case 'work':
        return pomodoroConfig.workDuration;
      case 'shortBreak':
        return pomodoroConfig.shortBreakDuration;
      case 'longBreak':
        return pomodoroConfig.longBreakDuration;
      default:
        return pomodoroConfig.workDuration;
    }
  };
  
  const progressPercentage = ((getIntervalDuration() - timeLeft) / getIntervalDuration()) * 100;

  const intervalText = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  }[currentInterval];

  const IntervalIcon = currentInterval === 'work' ? Brain : Coffee;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <IntervalIcon className="mr-2 h-5 w-5 text-primary" /> Write-odoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="text-5xl font-mono text-foreground mb-2" role="timer" aria-live="assertive">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-muted-foreground mb-4">{intervalText}</div>
        <Progress value={progressPercentage} className="w-full h-2 mb-4" aria-label={`Timer progress: ${progressPercentage.toFixed(0)}%`} />
        <div className="flex justify-center space-x-2">
          {!isRunning ? (
            <Button onClick={onStart} disabled={disabled} aria-label="Start timer">
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
          ) : (
            <Button onClick={onPause} disabled={disabled} aria-label="Pause timer">
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          )}
          <Button onClick={onReset} variant="outline" disabled={disabled} aria-label="Reset timer">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
           <Button onClick={onSkip} variant="outline" size="sm" disabled={disabled} aria-label="Skip current interval">
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
