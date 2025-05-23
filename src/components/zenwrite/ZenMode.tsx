
'use client';

import type { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { TypographySettingsState } from '@/lib/types';
import { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Type, TextQuote } from 'lucide-react'; // TextQuote might be used if we add labels

interface ZenModeProps {
  text: string;
  onTextChange: (text: string) => void;
  isFullScreen: boolean;
  disabled?: boolean;
  isTextFocusMode?: boolean;
  typographySettings: TypographySettingsState;
  onTypographyChange: (newSettings: Partial<TypographySettingsState>) => void; // Added prop
  autoFocus?: boolean;
}

// Constants moved from TypographySettings.tsx
const FONT_OPTIONS = [
  { value: 'var(--font-geist-sans)', label: 'Geist Sans (Default)' },
  { value: 'var(--font-geist-mono)', label: 'Geist Mono' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Georgia, serif', label: 'Georgia' },
];

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 30;
const FONT_SIZE_STEP = 1;

export function ZenMode({
  text,
  onTextChange,
  isFullScreen,
  disabled,
  isTextFocusMode,
  typographySettings,
  onTypographyChange, // Destructure new prop
  autoFocus = false,
}: ZenModeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current && !disabled) {
      const activeElement = document.activeElement;
      const isDialogInputFocused = activeElement?.closest('[role="dialog"]') && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT');
      
      if (!isDialogInputFocused) {
         textareaRef.current.focus();
      }
    }
  }, [autoFocus, disabled, text]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value);
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    onTypographyChange({ fontFamily });
  };

  const handleFontSizeChange = (value: number[]) => {
    onTypographyChange({ fontSize: value[0] });
  };

  const writingAreaStyle = {
    fontFamily: typographySettings.fontFamily,
    fontSize: `${typographySettings.fontSize}px`,
    lineHeight: typographySettings.fontSize ? `${Math.round(typographySettings.fontSize * 1.6)}px` : undefined,
  };

  return (
    <div className={cn(
        'flex-grow flex flex-col p-2 rounded-lg shadow-inner bg-card',
        isFullScreen ? 'h-full' : 'h-[calc(100vh-250px)] md:h-auto',
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
          isFullScreen ? 'min-h-full text-xl' : 'min-h-[200px]', // Adjusted min-h for controls
          isTextFocusMode && 'tracking-wide'
        )}
        style={writingAreaStyle}
        disabled={disabled}
        aria-label="Writing area"
      />
      {/* Typography Controls Bar */}
      {!isFullScreen && (
        <div className="flex items-center gap-4 p-3 border-t border-border bg-background/50 rounded-b-lg">
          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
            <TextQuote className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Select
              value={typographySettings.fontFamily}
              onValueChange={handleFontFamilyChange}
              disabled={disabled}
            >
              <SelectTrigger 
                className="h-8 text-xs truncate" 
                aria-label="Select font family"
              >
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }} className="text-xs">
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-1">
             <Type className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Slider
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
              step={FONT_SIZE_STEP}
              value={[typographySettings.fontSize]}
              onValueChange={handleFontSizeChange}
              className="w-full"
              aria-label={`Font size: ${typographySettings.fontSize}px`}
              disabled={disabled}
            />
            <span className="text-xs text-muted-foreground w-8 text-right">{typographySettings.fontSize}px</span>
          </div>
        </div>
      )}
    </div>
  );
}
