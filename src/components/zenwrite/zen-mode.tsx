
'use client';

import type { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ZenModeProps {
  text: string;
  onTextChange: (text: string) => void;
  isFullScreen: boolean;
  disabled?: boolean;
  isTextFocusMode?: boolean; // New prop
}

export function ZenMode({ text, onTextChange, isFullScreen, disabled, isTextFocusMode }: ZenModeProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value);
  };

  return (
    <div className={cn(
        'flex-grow flex flex-col p-2 rounded-lg shadow-inner bg-card', 
        isFullScreen ? 'h-full' : 'h-[calc(100vh-250px)] md:h-auto',
        isTextFocusMode && 'ring-2 ring-primary ring-offset-2 ring-offset-background' // Visual cue for text focus
      )}
    >
      <Textarea
        placeholder="Begin your masterpiece..."
        value={text}
        onChange={handleChange}
        className={cn(
          'w-full flex-grow resize-none text-lg p-6 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground',
          isFullScreen ? 'min-h-full text-xl' : 'min-h-[300px]',
          isTextFocusMode && 'tracking-wide leading-relaxed' // Example style for focus mode
        )}
        disabled={disabled}
        aria-label="Writing area"
      />
    </div>
  );
}
