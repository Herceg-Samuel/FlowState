
'use client';

import { Button } from '@/components/ui/button';
import { Maximize, Minimize, Feather, Star, TrendingUp, Menu } from 'lucide-react';
import type { AppStats } from '@/lib/types';

interface AppHeaderProps {
  isFullScreen: boolean;
  onFullScreenToggle: () => void;
  appStats: AppStats;
  showMobileMenuButton?: boolean; 
  onMobileMenuToggle?: () => void; 
}

export function AppHeader({ isFullScreen, onFullScreenToggle, appStats, showMobileMenuButton, onMobileMenuToggle }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center">
        {showMobileMenuButton && onMobileMenuToggle && (
          <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="mr-2 md:hidden" aria-label="Toggle tools menu">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Feather className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold ml-2">FlowState</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Star className="h-4 w-4 mr-1 text-yellow-500" /> Lvl: {appStats.level}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4 mr-1 text-green-500" /> XP: {appStats.xp.toLocaleString()}
        </div>
        <Button variant="ghost" size="icon" onClick={onFullScreenToggle} aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}>
          {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
