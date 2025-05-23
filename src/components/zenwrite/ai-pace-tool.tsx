'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2, Loader2 } from 'lucide-react';
import { analyzeWritingPace, type AnalyzeWritingPaceOutput, type AnalyzeWritingPaceInput } from '@/ai/flows/analyze-writing-pace';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AiPaceToolProps {
  currentText: string;
  disabled?: boolean;
}

export function AiPaceTool({ currentText, disabled }: AiPaceToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWritingPaceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!currentText.trim()) {
      toast({
        title: 'Text Required',
        description: 'Please write some text before analyzing.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setIsDialogOpen(true); // Open dialog when analysis starts

    try {
      const input: AnalyzeWritingPaceInput = { text: currentText };
      const result = await analyzeWritingPace(input);
      setAnalysisResult(result);
    } catch (err) {
      console.error('AI Pace Analysis Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze your writing pace. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><Wand2 className="mr-2 h-5 w-5" />AI Pace Analyzer</CardTitle>
        <CardDescription>Get insights into your writing style and pace.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAnalyze} disabled={isLoading || disabled} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Analyze My Writing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Writing Analysis</DialogTitle>
              <DialogDescription>
                Here's what our AI thinks about your writing.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Analyzing your text...</p>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {analysisResult && (
                <div className="space-y-6 py-4">
                  <AnalysisSection title="Pace Analysis" content={analysisResult.paceAnalysis} />
                  <AnalysisSection title="Style Analysis" content={analysisResult.styleAnalysis} />
                  <AnalysisSection title="Potential Writing Blocks" content={analysisResult.writingBlocks} />
                  <AnalysisSection title="Suggested Resources" content={analysisResult.suggestedResources} />
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
