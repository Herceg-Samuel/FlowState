'use server';
/**
 * @fileOverview AI-powered analysis tool to assess writing pace and style.
 *
 * - analyzeWritingPace - A function that handles the writing pace analysis process.
 * - AnalyzeWritingPaceInput - The input type for the analyzeWritingPace function.
 * - AnalyzeWritingPaceOutput - The return type for the analyzeWritingPace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWritingPaceInputSchema = z.object({
  text: z.string().describe('The text to analyze.'),
});
export type AnalyzeWritingPaceInput = z.infer<typeof AnalyzeWritingPaceInputSchema>;

const AnalyzeWritingPaceOutputSchema = z.object({
  paceAnalysis: z.string().describe('Analysis of the writing pace.'),
  styleAnalysis: z.string().describe('Analysis of the writing style.'),
  writingBlocks: z.string().describe('Identified writing blocks.'),
  suggestedResources: z.string().describe('Suggested resources to improve writing.'),
});
export type AnalyzeWritingPaceOutput = z.infer<typeof AnalyzeWritingPaceOutputSchema>;

export async function analyzeWritingPace(input: AnalyzeWritingPaceInput): Promise<AnalyzeWritingPaceOutput> {
  return analyzeWritingPaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWritingPacePrompt',
  input: {schema: AnalyzeWritingPaceInputSchema},
  output: {schema: AnalyzeWritingPaceOutputSchema},
  prompt: `You are an AI writing assistant that analyzes writing pace and style, identifies potential writing blocks, and suggests resources to improve writing.\n\nAnalyze the following text:\n\n{{{text}}}\n\nProvide an analysis of the writing pace, writing style, identified writing blocks, and suggested resources to improve writing.`,
});

const analyzeWritingPaceFlow = ai.defineFlow(
  {
    name: 'analyzeWritingPaceFlow',
    inputSchema: AnalyzeWritingPaceInputSchema,
    outputSchema: AnalyzeWritingPaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
