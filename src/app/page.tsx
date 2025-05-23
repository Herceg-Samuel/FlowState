
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppHeader } from '@/components/zenwrite/app-header';
import { ZenMode } from '@/components/zenwrite/zen-mode';
import { CustomFocus } from '@/components/zenwrite/custom-focus';
import { Writeodoro } from '@/components/zenwrite/writeodoro';
import { ProgressVis } from '@/components/zenwrite/progress-vis';
import { BadgeSystem } from '@/components/zenwrite/badge-system';
import { AiPaceTool } from '@/components/zenwrite/ai-pace-tool';
import { FocusSettings } from '@/components/zenwrite/focus-settings';
import type { Badge, AppStats, PomodoroState, PomodoroConfig, FocusSettingsState } from '@/lib/types';
import { BADGES_CONFIG } from '@/lib/badge-config';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  cyclesPerLongBreak: 4,
};

const INITIAL_FOCUS_SETTINGS: FocusSettingsState = {
  enableParagraphFocus: false,
  enableDynamicLighting: true,
  enableDeepWorkMode: false,
  enableContentAwareBreaks: true,
  enableAiWritingExercises: true,
};

export default function ZenWritePage() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [timeElapsedToday, setTimeElapsedToday] = useState(0);

  const [wordGoal, setWordGoal] = useState(0);
  const [timeGoal, setTimeGoal] = useState(0); // in minutes

  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    isRunning: false,
    timeLeft: DEFAULT_POMODORO_CONFIG.workDuration,
    currentInterval: 'work',
    cycleCount: 0,
  });
  const [pomodorosCompletedThisSession, setPomodorosCompletedThisSession] = useState(0);
  const [totalPomodorosCompleted, setTotalPomodorosCompleted] = useState(0);

  const [badges, setBadges] = useState<Badge[]>(() => BADGES_CONFIG.map(b => ({...b, achieved: false})));
  const [appStats, setAppStats] = useState<AppStats>({
    wordCount: 0,
    pomodorosCompletedThisSession: 0,
    totalPomodorosCompleted: 0,
    writingTimeToday: 0,
    zenSessions: 0,
    currentStreak: 0,
  });

  const [focusSettings, setFocusSettings] = useState<FocusSettingsState>(INITIAL_FOCUS_SETTINGS);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const writingSessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update word count
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setAppStats(prev => ({ ...prev, wordCount: words.length }));
  }, [text]);

  // Update writing time today
  useEffect(() => {
    if (pomodoroState.isRunning && pomodoroState.currentInterval === 'work') {
      if (writingSessionTimerRef.current) clearInterval(writingSessionTimerRef.current);
      writingSessionTimerRef.current = setInterval(() => {
        setTimeElapsedToday(prev => prev + 1);
        setAppStats(prev => ({ ...prev, writingTimeToday: prev.writingTimeToday + 1 }));
      }, 1000);
    } else {
      if (writingSessionTimerRef.current) clearInterval(writingSessionTimerRef.current);
    }
    return () => {
      if (writingSessionTimerRef.current) clearInterval(writingSessionTimerRef.current);
    };
  }, [pomodoroState.isRunning, pomodoroState.currentInterval]);

  // Check for badge achievements
  useEffect(() => {
    const newBadges = badges.map(badge => {
      if (!badge.achieved && badge.criteria(appStats)) {
        toast({
          title: 'Achievement Unlocked! ✨',
          description: `You earned the "${badge.name}" badge!`,
        });
        return { ...badge, achieved: true };
      }
      return badge;
    });
    setBadges(newBadges);
  }, [appStats, toast]);

  // Pomodoro timer logic
  useEffect(() => {
    if (pomodoroState.isRunning && pomodoroState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setPomodoroState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoroState.isRunning && pomodoroState.timeLeft === 0) {
      handleNextInterval();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pomodoroState.isRunning, pomodoroState.timeLeft]);

  const handleNextInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let nextInterval: PomodoroState['currentInterval'] = 'work';
    let nextTimeLeft = DEFAULT_POMODORO_CONFIG.workDuration;
    let newCycleCount = pomodoroState.cycleCount;
    let newPomodorosCompletedThisSession = pomodorosCompletedThisSession;
    let newTotalPomodorosCompleted = totalPomodorosCompleted;

    if (pomodoroState.currentInterval === 'work') {
      newCycleCount++;
      newPomodorosCompletedThisSession++;
      newTotalPomodorosCompleted++;
      setPomodorosCompletedThisSession(newPomodorosCompletedThisSession);
      setTotalPomodorosCompleted(newTotalPomodorosCompleted);
      setAppStats(prev => ({
        ...prev, 
        pomodorosCompletedThisSession: newPomodorosCompletedThisSession,
        totalPomodorosCompleted: newTotalPomodorosCompleted
      }));

      if (newCycleCount % DEFAULT_POMODORO_CONFIG.cyclesPerLongBreak === 0) {
        nextInterval = 'longBreak';
        nextTimeLeft = DEFAULT_POMODORO_CONFIG.longBreakDuration;
        toast({ title: "Long Break Time!", description: `Great job! Take a ${DEFAULT_POMODORO_CONFIG.longBreakDuration / 60}-minute break.`, duration: 5000});
      } else {
        nextInterval = 'shortBreak';
        nextTimeLeft = DEFAULT_POMODORO_CONFIG.shortBreakDuration;
        toast({ title: "Short Break!", description: `Nice focus! Enjoy a ${DEFAULT_POMODORO_CONFIG.shortBreakDuration / 60}-minute break.`, duration: 5000});
      }
    } else { 
      nextInterval = 'work';
      nextTimeLeft = DEFAULT_POMODORO_CONFIG.workDuration;
      toast({ title: "Back to Work!", description: "Time to focus and write!", duration: 5000});
    }

    setPomodoroState({
      isRunning: true, 
      timeLeft: nextTimeLeft,
      currentInterval: nextInterval,
      cycleCount: newCycleCount,
    });
  }, [pomodoroState, toast, pomodorosCompletedThisSession, totalPomodorosCompleted]);

  const handlePomodoroStart = () => setPomodoroState(prev => ({ ...prev, isRunning: true }));
  const handlePomodoroPause = () => setPomodoroState(prev => ({ ...prev, isRunning: false }));
  const handlePomodoroReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPomodoroState({
      isRunning: false,
      timeLeft: DEFAULT_POMODORO_CONFIG.workDuration,
      currentInterval: 'work',
      cycleCount: 0,
    });
  };
  const handlePomodoroSkip = () => handleNextInterval();

  const handleSetWordGoal = (goal: number) => setWordGoal(goal);
  const handleSetTimeGoal = (goal: number) => setTimeGoal(goal);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setAppStats(prev => ({...prev, zenSessions: prev.zenSessions + 1}));
    }
  };

  const handleSettingsChange = (newSettings: Partial<FocusSettingsState>) => {
    setFocusSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Dynamic Lighting Effect
  useEffect(() => {
    if (!focusSettings.enableDynamicLighting) {
      document.documentElement.classList.remove('theme-day', 'theme-dusk');
      // Assumes default is 'dark' or relies on base :root styles
      return;
    }

    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) { // Daytime
      document.documentElement.classList.add('theme-day');
      document.documentElement.classList.remove('theme-dusk');
    } else if (hour >= 18 && hour < 21) { // Dusk
      document.documentElement.classList.add('theme-dusk');
      document.documentElement.classList.remove('theme-day');
    } else { // Night
      document.documentElement.classList.remove('theme-day', 'theme-dusk');
    }
  }, [focusSettings.enableDynamicLighting]);


  const isWritingDisabled = pomodoroState.isRunning && pomodoroState.currentInterval !== 'work';
  const isDeepWorkActive = focusSettings.enableDeepWorkMode && pomodoroState.isRunning && pomodoroState.currentInterval === 'work';
  const showSidebar = !isFullScreen && !isDeepWorkActive;

  return (
    <div className={cn('flex flex-col min-h-screen transition-all duration-300', isFullScreen ? 'bg-background' : 'bg-background')}>
      {!isFullScreen && <AppHeader isFullScreen={isFullScreen} onFullScreenToggle={toggleFullScreen} />}
      
      <div 
        className={cn(
            'flex-grow w-full max-w-7xl mx-auto transition-all duration-300', 
            isFullScreen ? 'p-0' : 'p-4 md:p-6 grid md:grid-cols-12 gap-6'
        )}
      >
        {showSidebar && (
          <aside className="md:col-span-4 lg:col-span-3 space-y-6 flex flex-col">
            <CustomFocus
              wordGoal={wordGoal}
              timeGoal={timeGoal}
              onSetWordGoal={handleSetWordGoal}
              onSetTimeGoal={handleSetTimeGoal}
              disabled={pomodoroState.isRunning}
            />
            <Writeodoro
              pomodoroState={pomodoroState}
              pomodoroConfig={DEFAULT_POMODORO_CONFIG}
              onStart={handlePomodoroStart}
              onPause={handlePomodoroPause}
              onReset={handlePomodoroReset}
              onSkip={handlePomodoroSkip}
              focusSettings={focusSettings}
              currentText={text}
            />
            <AiPaceTool 
              currentText={text} 
              disabled={pomodoroState.isRunning && pomodoroState.currentInterval !== 'work'}
              focusSettings={focusSettings}
            />
            <FocusSettings settings={focusSettings} onSettingsChange={handleSettingsChange} />
          </aside>
        )}

        <main className={cn(
            'flex flex-col',
            isFullScreen ? 'col-span-12 h-full p-2 md:p-8' : (showSidebar ? 'md:col-span-8 lg:col-span-9' : 'col-span-12'),
          )}
        >
          <ZenMode 
            text={text} 
            onTextChange={setText} 
            isFullScreen={isFullScreen} 
            disabled={isWritingDisabled}
            isTextFocusMode={focusSettings.enableParagraphFocus}
          />
        </main>
      </div>

      {!isFullScreen && (
        <footer className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <ProgressVis
            wordCount={wordCount}
            wordGoal={wordGoal}
            timeElapsed={timeElapsedToday}
            timeGoal={timeGoal}
            pomodorosCompletedThisSession={pomodorosCompletedThisSession}
          />
          <BadgeSystem badges={badges} />
           <p className="text-center text-xs text-muted-foreground mt-8">ZenWrite - Your focused writing companion.</p>
        </footer>
      )}
    </div>
  );
}
