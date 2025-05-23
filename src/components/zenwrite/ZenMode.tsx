
'use client';

import type { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { TypographySettingsState } from '@/lib/types'; // Import TypographySettingsState

interface ZenModeProps {
  text: string;
  onTextChange: (text: string) => void;
  isFullScreen: boolean;
  disabled?: boolean;
  isTextFocusMode?: boolean;
  typographySettings: TypographySettingsState; // Add typographySettings prop
}

export function ZenMode({ 
  text, 
  onTextChange, 
  isFullScreen, 
  disabled, 
  isTextFocusMode,
  typographySettings, // Destructure prop
}: ZenModeProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value);
  };

  const writingAreaStyle = {
    fontFamily: typographySettings.fontFamily,
    fontSize: `${typographySettings.fontSize}px`,
    lineHeight: typographySettings.fontSize ? `${Math.round(typographySettings.fontSize * 1.5)}px` : undefined,
  };

  return (
    <div className={cn(
        'flex-grow flex flex-col p-2 rounded-lg shadow-inner bg-card', 
        isFullScreen ? 'h-full' : 'h-[calc(100vh-250px)] md:h-auto',
        isTextFocusMode && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      <Textarea
        placeholder="Begin your masterpiece..."
        value={text}
        onChange={handleChange}
        className={cn(
          'w-full flex-grow resize-none text-lg p-6 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground',
          isFullScreen ? 'min-h-full text-xl' : 'min-h-[300px]',
          isTextFocusMode && 'tracking-wide' // Removed leading-relaxed, will be handled by dynamic line-height
        )}
        style={writingAreaStyle} // Apply dynamic styles
        disabled={disabled}
        aria-label="Writing area"
      />
    </div>
  );
}
