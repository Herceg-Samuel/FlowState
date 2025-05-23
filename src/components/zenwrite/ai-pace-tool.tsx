
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDesc, DialogTrigger, DialogFooter } from '@/components/ui/dialog'; // Renamed DialogDescription
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Lightbulb, ThumbsUp, Brain, Sparkles } from 'lucide-react';
import { analyzeWritingPace, type AnalyzeWritingPaceOutput } from '@/ai/flows/analyze-writing-pace';
import { suggestBreakPoint, type SuggestBreakPointOutput } from '@/ai/flows/suggest-break-point';
import { suggestStuckActivity, type SuggestStuckActivityOutput } from '@/ai/flows/suggest-stuck-activity';
import { improveWriting, type ImproveWritingInput, type ImproveWritingOutput } from '@/ai/flows/improve-writing-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { FocusSettingsState } from '@/lib/types';

interface AiPaceToolProps {
  currentText: string;
  disabled?: boolean;
  focusSettings: FocusSettingsState;
  onSuccessfulAiAction: () => void; // Callback to award XP
}

type AiModalContent = 
  | { type: 'paceAnalysis'; data: AnalyzeWritingPaceOutput }
  | { type: 'breakSuggestion'; data: SuggestBreakPointOutput }
  | { type: 'stuckActivity'; data: SuggestStuckActivityOutput }
  | { type: 'improveWriting'; data: ImproveWritingOutput };


export function AiPaceTool({ currentText, disabled, focusSettings, onSuccessfulAiAction }: AiPaceToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState<AiModalContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDialogTitle, setCurrentDialogTitle] = useState('');
  const { toast } = useToast();

  const handleGenericAiAction = async (
    action: () => Promise<any>, 
    title: string, 
    successType: AiModalContent['type']
  ) => {
    if (!currentText.trim() && (successType === 'paceAnalysis' || successType === 'breakSuggestion' || successType === 'improveWriting')) {
      if (successType !== 'stuckActivity') { // Stuck activity can work with empty text
        toast({
            title: 'Text Required',
            description: 'Please write some text before using this AI tool.',
            variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setModalContent(null);
    setCurrentDialogTitle(title);
    setIsDialogOpen(true);

    try {
      const result = await action();
      setModalContent({ type: successType, data: result } as AiModalContent);
      onSuccessfulAiAction(); // Award XP
    } catch (err) {
      console.error(`${title} Error:`, err);
      setError(err instanceof Error ? err.message : `An unknown error occurred during ${title.toLowerCase()}.`);
      toast({
        title: `${title} Failed`,
        description: `Could not perform ${title.toLowerCase()}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzePace = () => {
    handleGenericAiAction(
      async () => analyzeWritingPace({ text: currentText }),
      'Writing Pace Analysis',
      'paceAnalysis'
    );
  };

  const handleSuggestBreak = () => {
    handleGenericAiAction(
      async () => suggestBreakPoint({ text: currentText }),
      'Break Point Suggestion',
      'breakSuggestion'
    );
  };

  const handleStuckActivity = () => {
    handleGenericAiAction(
      async () => suggestStuckActivity({ currentText }), // Can be called with empty currentText
      'Stuck Point Activity',
      'stuckActivity'
    );
  };

  const handleImproveWriting = () => {
    handleGenericAiAction(
      async () => improveWriting({ text: currentText }),
      'Improve My Writing',
      'improveWriting'
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><Wand2 className="mr-2 h-5 w-5" />AI Writing Assistant</CardTitle>
        <CardDescription>Tools to analyze, improve your writing, and earn XP!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleImproveWriting} disabled={isLoading || disabled} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading && currentDialogTitle === 'Improve My Writing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Improve My Writing
        </Button>
        <Button onClick={handleAnalyzePace} disabled={isLoading || disabled} className="w-full">
          {isLoading && currentDialogTitle === 'Writing Pace Analysis' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Analyze Pace & Style
        </Button>
        {focusSettings.enableContentAwareBreaks && (
          <>
            <Button onClick={handleSuggestBreak} disabled={isLoading || disabled} className="w-full" variant="outline">
              {isLoading && currentDialogTitle === 'Break Point Suggestion' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
              Suggest Break Point
            </Button>
            <Button onClick={handleStuckActivity} disabled={isLoading || disabled} className="w-full" variant="outline">
             {isLoading && currentDialogTitle === 'Stuck Point Activity' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Help! I'm Stuck
            </Button>
          </>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{currentDialogTitle || 'AI Analysis'}</DialogTitle>
              <DialogDesc>
                Here's what our AI suggests.
              </DialogDesc>
            </DialogHeader>
            <ScrollArea className="h-[60vh] md:h-[70vh] pr-4">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">AI is thinking...</p>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {modalContent?.type === 'paceAnalysis' && modalContent.data && (
                <div className="space-y-6 py-4">
                  <AnalysisSection title="Pace Analysis" content={modalContent.data.paceAnalysis} />
                  <AnalysisSection title="Style Analysis" content={modalContent.data.styleAnalysis} />
                  <AnalysisSection title="Potential Writing Blocks" content={modalContent.data.writingBlocks} />
                  <AnalysisSection title="Suggested Resources" content={modalContent.data.suggestedResources} />
                </div>
              )}
              {modalContent?.type === 'breakSuggestion' && modalContent.data && (
                 <div className="space-y-4 py-4">
                    <Alert variant={modalContent.data.isGoodBreakPoint ? "default" : "destructive"}>
                      <Lightbulb className="h-4 w-4"/>
                      <AlertTitle>{modalContent.data.isGoodBreakPoint ? "Good Place for a Break!" : "Maybe Keep Going?"}</AlertTitle>
                      <AlertDescription>{modalContent.data.reason}</AlertDescription>
                    </Alert>
                    {modalContent.data.suggestedAction && <p className="text-sm text-muted-foreground">Suggestion: {modalContent.data.suggestedAction}</p>}
                 </div>
              )}
              {modalContent?.type === 'stuckActivity' && modalContent.data && (
                <div className="space-y-4 py-4">
                  <AnalysisSection title="Activity Suggestion" content={modalContent.data.activitySuggestion} />
                  {modalContent.data.rationale && <AnalysisSection title="Rationale" content={modalContent.data.rationale} />}
                  {modalContent.data.estimatedTime && <p className="text-sm text-muted-foreground">Estimated time: {modalContent.data.estimatedTime}</p>}
                </div>
              )}
              {modalContent?.type === 'improveWriting' && modalContent.data && (
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Original Text</h3>
                    <Textarea
                      readOnly
                      value={modalContent.data.originalText}
                      className="h-48 bg-muted/30 resize-none"
                      aria-label="Original text"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Improved Text</h3>
                    <Textarea
                      readOnly
                      value={modalContent.data.improvedText}
                      className="h-48 resize-none"
                      aria-label="Improved text"
                    />
                  </div>
                  {modalContent.data.suggestions && modalContent.data.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">Suggestions</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                        {modalContent.data.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
             <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

interface AnalysisSectionProps {
  title: string;
  content: string;
}

function AnalysisSection({ title, content }: AnalysisSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
}
