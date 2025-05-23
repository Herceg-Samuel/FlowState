
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Type, TextQuote } from 'lucide-react';
import type { TypographySettingsState } from '@/lib/types';

interface TypographySettingsProps {
  settings: TypographySettingsState;
  onSettingsChange: (newSettings: Partial<TypographySettingsState>) => void;
}

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

export function TypographySettings({ settings, onSettingsChange }: TypographySettingsProps) {
  const handleFontFamilyChange = (fontFamily: string) => {
    onSettingsChange({ fontFamily });
  };

  const handleFontSizeChange = (value: number[]) => {
    onSettingsChange({ fontSize: value[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Type className="mr-2 h-5 w-5" /> Typography
        </CardTitle>
        <CardDescription>Customize the look and feel of your text.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="font-family-select" className="flex items-center">
            <TextQuote className="mr-2 h-4 w-4 text-muted-foreground" /> Font Family
          </Label>
          <Select
            value={settings.fontFamily}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger id="font-family-select" aria-label="Select font family">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="font-size-slider" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><polyline points="4 7 4 4 7 4"></polyline><polyline points="20 7 20 4 17 4"></polyline><polyline points="14 20 14 17 17 17"></polyline><polyline points="10 20 10 17 7 17"></polyline><line x1="4" y1="12" x2="20" y2="12"></line></svg>
               Font Size
            </Label>
            <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
          </div>
          <Slider
            id="font-size-slider"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={FONT_SIZE_STEP}
            value={[settings.fontSize]}
            onValueChange={handleFontSizeChange}
            aria-label={`Font size: ${settings.fontSize}px`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

