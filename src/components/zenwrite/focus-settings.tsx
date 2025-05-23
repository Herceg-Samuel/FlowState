
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, Zap, Lightbulb, Coffee, ShieldAlert } from 'lucide-react';
import type { FocusSettingsState } from '@/lib/types';

interface FocusSettingsProps {
  settings: FocusSettingsState;
  onSettingsChange: (newSettings: Partial<FocusSettingsState>) => void;
}

export function FocusSettings({ settings, onSettingsChange }: FocusSettingsProps) {
  const handleToggle = (key: keyof FocusSettingsState, checked: boolean) => {
    onSettingsChange({ [key]: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Zap className="mr-2 h-5 w-5" /> Focus &amp; AI Tools
        </CardTitle>
        <CardDescription>Customize your writing environment and AI assistance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-md font-medium text-primary">Focus Enhancements</h4>
          <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
            <Label htmlFor="paragraph-focus-switch" className="flex flex-col space-y-1">
              <span className="font-medium flex items-center"><Eye className="mr-2 h-4 w-4" /> Text Focus Mode</span>
              <span className="text-xs font-normal leading-snug text-muted-foreground">
                Enhances readability of the writing area. (Simple visual cue)
              </span>
            </Label>
            <Switch
              id="paragraph-focus-switch"
              checked={settings.enableParagraphFocus}
              onCheckedChange={(checked) => handleToggle('enableParagraphFocus', checked)}
              aria-label="Toggle paragraph focus mode"
            />
          </div>
          <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
            <Label htmlFor="dynamic-lighting-switch" className="flex flex-col space-y-1">
              <span className="font-medium flex items-center"><Lightbulb className="mr-2 h-4 w-4" /> Dynamic Lighting</span>
              <span className="text-xs font-normal leading-snug text-muted-foreground">
                Adjusts app appearance based on time of day.
              </span>
            </Label>
            <Switch
              id="dynamic-lighting-switch"
              checked={settings.enableDynamicLighting}
              onCheckedChange={(checked) => handleToggle('enableDynamicLighting', checked)}
              aria-label="Toggle dynamic lighting"
            />
          </div>
          <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
            <Label htmlFor="deep-work-switch" className="flex flex-col space-y-1">
              <span className="font-medium flex items-center"><ShieldAlert className="mr-2 h-4 w-4" /> Deep Work Mode</span>
              <span className="text-xs font-normal leading-snug text-muted-foreground">
                Minimizes in-app distractions during Pomodoro work.
              </span>
            </Label>
            <Switch
              id="deep-work-switch"
              checked={settings.enableDeepWorkMode}
              onCheckedChange={(checked) => handleToggle('enableDeepWorkMode', checked)}
              aria-label="Toggle deep work mode"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-md font-medium text-primary">AI-Powered Breaks &amp; Assistance</h4>
           <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
            <Label htmlFor="content-aware-breaks-switch" className="flex flex-col space-y-1">
              <span className="font-medium flex items-center"><Coffee className="mr-2 h-4 w-4" /> Content-Aware Breaks</span>
              <span className="text-xs font-normal leading-snug text-muted-foreground">
                Enables AI suggestions for breaks and exercises.
              </span>
            </Label>
            <Switch
              id="content-aware-breaks-switch"
              checked={settings.enableContentAwareBreaks}
              onCheckedChange={(checked) => handleToggle('enableContentAwareBreaks', checked)}
              aria-label="Toggle content-aware breaks"
            />
          </div>
          {settings.enableContentAwareBreaks && (
            <div className="pl-4 space-y-2">
              <div className="flex items-center justify-between space-x-2 p-2 rounded-md border border-dashed">
                <Label htmlFor="ai-exercises-switch" className="flex flex-col space-y-1">
                  <span className="font-medium">AI Writing Exercises</span>
                  <span className="text-xs font-normal leading-snug text-muted-foreground">
                    Get writing exercises during Pomodoro breaks.
                  </span>
                </Label>
                <Switch
                  id="ai-exercises-switch"
                  checked={settings.enableAiWritingExercises}
                  onCheckedChange={(checked) => handleToggle('enableAiWritingExercises', checked)}
                  aria-label="Toggle AI writing exercises"
                  disabled={!settings.enableContentAwareBreaks}
                />
              </div>
               <p className="text-xs text-muted-foreground pt-1">
                More AI tools like "Suggest Break Point" and "Help I'm Stuck" are available in the AI Pace Analyzer panel.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
