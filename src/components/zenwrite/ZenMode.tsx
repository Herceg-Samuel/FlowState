
'use client';

import type { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { TypographySettingsState } from '@/lib/types';
import { useRef, useEffect } from 'react';

interface ZenModeProps {
  text: string;
  onTextChange: (text: string) => void;
  isFullScreen: boolean;
  disabled?: boolean;
  isTextFocusMode?: boolean;
  typographySettings: TypographySettingsState;
  autoFocus?: boolean; 
}

export function ZenMode({ 
  text, 
  onTextChange, 
  isFullScreen, 
  disabled, 
  isTextFocusMode,
  typographySettings,
  autoFocus = false,
}: ZenModeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current && !disabled) {
      // Check if an input field inside a dialog or sheet is currently focused
      const activeElement = document.activeElement;
      const isDialogInputFocused = activeElement?.closest('[role="dialog"]') && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT');
      
      if (!isDialogInputFocused) {
         textareaRef.current.focus();
      }
    }
  }, [autoFocus, disabled, text]); // Added text to re-evaluate focus if text changes (e.g. cleared) and autoFocus is true

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value);
  };

  const writingAreaStyle = {
    fontFamily: typographySettings.fontFamily,
    fontSize: `${typographySettings.fontSize}px`,
    lineHeight: typographySettings.fontSize ? `${Math.round(typographySettings.fontSize * 1.6)}px` : undefined, // Slightly increased line height
  };

  return (
    <div className={cn(
        'flex-grow flex flex-col p-2 rounded-lg shadow-inner bg-card', 
        isFullScreen ? 'h-full' : 'h-[calc(100vh-250px)] md:h-auto', // Ensure it takes up available vertical space on mobile
        isTextFocusMode && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      <Textarea
        ref={textareaRef}
        placeholder="Begin your masterpiece..."
        value={text}
        onChange={handleChange}
        className={cn(
          'w-full flex-grow resize-none text-lg p-6 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground',
          isFullScreen ? 'min-h-full text-xl' : 'min-h-[300px]',
          isTextFocusMode && 'tracking-wide'
        )}
        style={writingAreaStyle}
        disabled={disabled}
        aria-label="Writing area"
      />
    </div>
  );
}
