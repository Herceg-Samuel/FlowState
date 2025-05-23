
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
import { TypographySettings } from '@/components/zenwrite/TypographySettings'; // Corrected Import Path
import type { Badge, AppStats, PomodoroState, PomodoroConfig, FocusSettingsState, TypographySettingsState } from '@/lib/types';
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

const INITIAL_TYPOGRAPHY_SETTINGS: TypographySettingsState = {
  fontFamily: 'var(--font-geist-sans)', // Default to Geist Sans
  fontSize: 16, // Default font size in px
};

const XP_FOR_WORD = 0.1; // 1 XP per 10 words
const XP_FOR_POMODORO_COMPLETION = 50;
const XP_FOR_AI_TOOL_USE = 20;
// Total XP needed to reach level (index + 1). Level 1 = 0 XP, Level 2 = 100 XP total, etc.
export const LEVEL_XP_THRESHOLDS = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000, 7500, 10000];


export default function ZenWritePage() {
  const [text, setText] = useState('');
  const [wordGoal, setWordGoal] = useState(0);
  const [timeGoal, setTimeGoal] = useState(0); // in minutes

  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    isRunning: false,
    timeLeft: DEFAULT_POMODORO_CONFIG.workDuration,
    currentInterval: 'work',
    cycleCount: 0,
  });

  const [badges, setBadges] = useState<Badge[]>(() => BADGES_CONFIG.map(b => ({...b, achieved: false})));
  
  const [appStats, setAppStats] = useState<AppStats>({
    wordCount: 0,
    pomodorosCompletedThisSession: 0,
    totalPomodorosCompleted: 0,
    writingTimeToday: 0,
    zenSessions: 0,
    currentStreak: 0,
    xp: 0,
    level: 1,
  });

  const [focusSettings, setFocusSettings] = useState<FocusSettingsState>(INITIAL_FOCUS_SETTINGS);
  const [typographySettings, setTypographySettings] = useState<TypographySettingsState>(INITIAL_TYPOGRAPHY_SETTINGS);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const writingSessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousWordCountRef = useRef(0);

  const handleNextInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let nextInterval: PomodoroState['currentInterval'] = 'work';
    let nextTimeLeft = DEFAULT_POMODORO_CONFIG.workDuration;
    let newCycleCount = pomodoroState.cycleCount;

    setAppStats(prevStats => {
      let updatedPomodorosCompletedThisSession = prevStats.pomodorosCompletedThisSession;
      let updatedTotalPomodorosCompleted = prevStats.totalPomodorosCompleted;
      let updatedXp = prevStats.xp;

      if (pomodoroState.currentInterval === 'work') {
        newCycleCount++;
        updatedPomodorosCompletedThisSession++;
        updatedTotalPomodorosCompleted++;
        updatedXp += XP_FOR_POMODORO_COMPLETION; 

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
      
      return {
        ...prevStats,
        pomodorosCompletedThisSession: updatedPomodorosCompletedThisSession,
        totalPomodorosCompleted: updatedTotalPomodorosCompleted,
        xp: updatedXp,
      };
    });

    setPomodoroState(prev => ({
        ...prev,
        isRunning: true,
        timeLeft: nextTimeLeft,
        currentInterval: nextInterval,
        cycleCount: newCycleCount,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomodoroState.currentInterval, pomodoroState.cycleCount, toast, DEFAULT_POMODORO_CONFIG]);


  // Update word count and award XP for writing
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const newWordCount = words.length;
    const wordsWritten = newWordCount - previousWordCountRef.current;
    let xpEarned = 0;
    if (wordsWritten > 0) {
      xpEarned = Math.floor(wordsWritten * XP_FOR_WORD);
    }
    
    setAppStats(prev => ({ 
      ...prev, 
      wordCount: newWordCount,
      xp: prev.xp + xpEarned 
    }));
    previousWordCountRef.current = newWordCount;
  }, [text]);

  // Level up logic
  useEffect(() => {
    const currentLevel = appStats.level;
    if (currentLevel > 0 && currentLevel < LEVEL_XP_THRESHOLDS.length) {
      const xpNeededForNextLevel = LEVEL_XP_THRESHOLDS[currentLevel]; 
      if (appStats.xp >= xpNeededForNextLevel) {
        const newLevel = currentLevel + 1;
        setAppStats(prev => ({ ...prev, level: newLevel }));
        toast({
          title: 'Level Up! 🎉',
          description: `Congratulations! You've reached Level ${newLevel}!`,
          duration: 5000,
        });
      }
    }
  }, [appStats.xp, appStats.level, toast]);


  // Update writing time today
  useEffect(() => {
    if (pomodoroState.isRunning && pomodoroState.currentInterval === 'work') {
      if (writingSessionTimerRef.current) clearInterval(writingSessionTimerRef.current);
      writingSessionTimerRef.current = setInterval(() => {
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
          duration: 5000,
        });
        return { ...badge, achieved: true };
      }
      return badge;
    });
    if (JSON.stringify(newBadges) !== JSON.stringify(badges)) {
      setBadges(newBadges);
    }
  }, [appStats, badges, toast]); 

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
  }, [pomodoroState.isRunning, pomodoroState.timeLeft, handleNextInterval]);

  const awardXpForAiTool = useCallback(() => {
    setAppStats(prev => ({ ...prev, xp: prev.xp + XP_FOR_AI_TOOL_USE }));
  }, []);

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

  const handleTypographyChange = (newSettings: Partial<TypographySettingsState>) => {
    setTypographySettings(prev => ({ ...prev, ...newSettings }));
  };


  // Dynamic Lighting Effect
  useEffect(() => {
    if (!focusSettings.enableDynamicLighting) {
      document.documentElement.classList.remove('theme-day', 'theme-dusk');
      return;
    }

    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) { 
      document.documentElement.classList.add('theme-day');
      document.documentElement.classList.remove('theme-dusk');
    } else if (hour >= 18 && hour < 21) { 
      document.documentElement.classList.add('theme-dusk');
      document.documentElement.classList.remove('theme-day');
    } else { 
      document.documentElement.classList.remove('theme-day', 'theme-dusk');
    }
  }, [focusSettings.enableDynamicLighting]);


  const isWritingDisabled = pomodoroState.isRunning && pomodoroState.currentInterval !== 'work';
  const isDeepWorkActive = focusSettings.enableDeepWorkMode && pomodoroState.isRunning && pomodoroState.currentInterval === 'work';
  const showSidebar = !isFullScreen && !isDeepWorkActive;

  return (
    <div className={cn('flex flex-col min-h-screen transition-all duration-300', isFullScreen ? 'bg-background' : 'bg-background')}>
      {!isFullScreen && <AppHeader isFullScreen={isFullScreen} onFullScreenToggle={toggleFullScreen} appStats={appStats} />}
      
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
              onSuccessfulAiAction={awardXpForAiTool}
            />
            <TypographySettings settings={typographySettings} onSettingsChange={handleTypographyChange} />
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
            typographySettings={typographySettings}
          />
        </main>
      </div>

      {!isFullScreen && (
        <footer className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <ProgressVis
            appStats={appStats}
            wordGoal={wordGoal}
            timeGoal={timeGoal}
          />
          <BadgeSystem badges={badges} />
           <p className="text-center text-xs text-muted-foreground mt-8">ZenWrite - Your focused writing companion.</p>
        </footer>
      )}
    </div>
  );
}
