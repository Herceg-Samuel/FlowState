
'use client';

import React, { useState, useEffect } from 'react';
import type { PomodoroState, PomodoroConfig, FocusSettingsState, GenerateWritingExerciseInput, GenerateWritingExerciseOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription }  from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Brain, Wand2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { generateWritingExercise } from '@/ai/flows/generate-writing-exercise'; // Assuming this will be created
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription as SmallAlertDescription } from '@/components/ui/alert'; // Renamed to avoid conflict

interface WriteodoroProps {
  pomodoroState: PomodoroState;
  pomodoroConfig: PomodoroConfig;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  disabled?: boolean;
  focusSettings: FocusSettingsState;
  currentText: string;
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
  focusSettings,
  currentText,
}: WriteodoroProps) {
  const { isRunning, timeLeft, currentInterval } = pomodoroState;
  const [exercise, setExercise] = useState<GenerateWritingExerciseOutput | null>(null);
  const [isLoadingExercise, setIsLoadingExercise] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    const fetchExercise = async () => {
      if (focusSettings.enableContentAwareBreaks && focusSettings.enableAiWritingExercises && (currentInterval === 'shortBreak' || currentInterval === 'longBreak')) {
        setIsLoadingExercise(true);
        setExercise(null);
        try {
          // Basic topic extraction (can be improved)
          const topic = currentText.split(/\s+/).slice(0, 20).join(' ') || undefined;
          const input: GenerateWritingExerciseInput = { currentTopic: topic, textLength: currentText.length };
          const result = await generateWritingExercise(input);
          setExercise(result);
        } catch (err) {
          console.error("Failed to fetch writing exercise", err);
          toast({
            title: "AI Exercise Error",
            description: "Could not fetch a writing exercise for your break.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingExercise(false);
        }
      } else {
        setExercise(null); // Clear exercise if not a break or not enabled
      }
    };

    fetchExercise();
  }, [currentInterval, focusSettings.enableContentAwareBreaks, focusSettings.enableAiWritingExercises, currentText, toast]);


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
        
        {isLoadingExercise && (currentInterval === 'shortBreak' || currentInterval === 'longBreak') && (
          <div className="flex items-center justify-center text-sm text-muted-foreground my-3">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching break exercise...
          </div>
        )}

        {exercise && (currentInterval === 'shortBreak' || currentInterval === 'longBreak') && (
          <Alert variant="default" className="text-left my-3">
             <Wand2 className="h-4 w-4" />
            <AlertTitle className="font-semibold">Creative Break Exercise:</AlertTitle>
            <SmallAlertDescription>
              {exercise.exercisePrompt}
              {exercise.category && <span className="block text-xs text-primary mt-1">Category: {exercise.category}</span>}
            </SmallAlertDescription>
          </Alert>
        )}

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
