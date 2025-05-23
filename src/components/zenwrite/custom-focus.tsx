'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock } from 'lucide-react';
import type { FormEvent } from 'react';

interface CustomFocusProps {
  wordGoal: number;
  timeGoal: number; // in minutes
  onSetWordGoal: (goal: number) => void;
  onSetTimeGoal: (goal: number) => void;
  disabled?: boolean;
}

export function CustomFocus({
  wordGoal,
  timeGoal,
  onSetWordGoal,
  onSetTimeGoal,
  disabled,
}: CustomFocusProps) {
  const handleWordGoalSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal = parseInt(formData.get('wordGoal') as string, 10);
    if (!isNaN(goal) && goal >= 0) {
      onSetWordGoal(goal);
    }
  };

  const handleTimeGoalSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal = parseInt(formData.get('timeGoal') as string, 10);
    if (!isNaN(goal) && goal >= 0) {
      onSetTimeGoal(goal);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><Target className="mr-2 h-5 w-5" />Set Your Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleWordGoalSubmit} className="space-y-2">
          <Label htmlFor="word-goal">Word Count Goal</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="word-goal"
              name="wordGoal"
              type="number"
              defaultValue={wordGoal > 0 ? wordGoal : ''}
              min="0"
              placeholder="e.g., 500"
              disabled={disabled}
              className="flex-grow"
            />
            <Button type="submit" variant="outline" size="sm" disabled={disabled}>Set</Button>
          </div>
        </form>
        <form onSubmit={handleTimeGoalSubmit} className="space-y-2">
          <Label htmlFor="time-goal">Time Limit Goal (minutes)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="time-goal"
              name="timeGoal"
              type="number"
              defaultValue={timeGoal > 0 ? timeGoal : ''}
              min="0"
              placeholder="e.g., 60"
              disabled={disabled}
              className="flex-grow"
            />
            <Button type="submit" variant="outline" size="sm" disabled={disabled}>Set</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
