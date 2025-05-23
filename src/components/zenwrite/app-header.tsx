'use client';

import { Button } from '@/components/ui/button';
import { Maximize, Minimize, Feather } from 'lucide-react';

interface AppHeaderProps {
  isFullScreen: boolean;
  onFullScreenToggle: () => void;
}

export function AppHeader({ isFullScreen, onFullScreenToggle }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center">
        <Feather className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold ml-2">ZenWrite</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={onFullScreenToggle} aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}>
        {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </Button>
    </header>
  );
}
