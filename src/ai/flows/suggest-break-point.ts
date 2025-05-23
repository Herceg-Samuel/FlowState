
'use server';
/**
 * @fileOverview AI-powered tool to suggest natural break points in writing.
 *
 * - suggestBreakPoint - A function that analyzes text and suggests if it's a good point for a break.
 * - SuggestBreakPointInput - The input type for the suggestBreakPoint function.
 * - SuggestBreakPointOutput - The return type for the suggestBreakPoint function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { SuggestBreakPointInput, SuggestBreakPointOutput } from '@/lib/types'; // Using types from lib

const SuggestBreakPointInputSchema = z.object({
  text: z.string().describe('The current body of text written by the user.'),
});

const SuggestBreakPointOutputSchema = z.object({
  isGoodBreakPoint: z.boolean().describe('True if the AI deems it a natural or effective break point, false otherwise.'),
  reason: z.string().describe('A brief explanation for the suggestion (e.g., "You just finished a paragraph," or "This section seems complete.").'),
  suggestedAction: z.string().optional().describe('A minor suggested action if any (e.g., "Consider re-reading this last sentence before pausing.").'),
});

// Exporting the types for external use if needed, though already defined in lib/types
export type { SuggestBreakPointInput, SuggestBreakPointOutput };

export async function suggestBreakPoint(input: SuggestBreakPointInput): Promise<SuggestBreakPointOutput> {
  return suggestBreakPointFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBreakPointPrompt',
  input: { schema: SuggestBreakPointInputSchema },
  output: { schema: SuggestBreakPointOutputSchema },
  prompt: `You are an AI writing assistant. Your task is to analyze the provided text and determine if it's a natural or effective point for the user to take a break.
Consider factors like paragraph completion, section breaks, shifts in topic, or if the user seems to be concluding a thought.

Provided text:
{{{text}}}

Based on this text, is this a good point for a break? Provide a reason for your assessment and an optional minor suggested action.
If the text is very short or seems mid-thought, it's probably not a good break point.
If the user has just completed a paragraph or a significant thought, it might be a good break point.
Output in the specified JSON format.
`,
});

const suggestBreakPointFlow = ai.defineFlow(
  {
    name: 'suggestBreakPointFlow',
    inputSchema: SuggestBreakPointInputSchema,
    outputSchema: SuggestBreakPointOutputSchema,
  },
  async (input) => {
    // For very short texts, it's usually not a good break point.
    if (input.text.trim().split(/\s+/).length < 20) {
        return {
            isGoodBreakPoint: false,
            reason: "The text is quite short. It might be better to write a bit more before pausing.",
        };
    }
    
    const { output } = await prompt(input);
    if (!output) {
        // Fallback or error handling if prompt fails to produce structured output
        return {
            isGoodBreakPoint: false,
            reason: "Could not determine a suitable break point at this time. Try writing a bit more.",
        };
    }
    return output;
  }
);
