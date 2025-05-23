
'use server';
/**
 * @fileOverview AI-powered tool to improve user's writing.
 *
 * - improveWriting - A function that takes text and returns an improved version and suggestions.
 * - ImproveWritingInput - The input type for the improveWriting function.
 * - ImproveWritingOutput - The return type for the improveWriting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveWritingInputSchema = z.object({
  text: z.string().describe('The text to improve.'),
});
export type ImproveWritingInput = z.infer<typeof ImproveWritingInputSchema>;

const ImproveWritingOutputSchema = z.object({
  originalText: z.string().describe('The original text provided by the user.'),
  improvedText: z.string().describe('The AI-improved version of the text.'),
  suggestions: z.array(z.string()).optional().describe('A list of specific suggestions or comments on the changes made.'),
});
export type ImproveWritingOutput = z.infer<typeof ImproveWritingOutputSchema>;

export async function improveWriting(input: ImproveWritingInput): Promise<ImproveWritingOutput> {
  return improveWritingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveWritingPrompt',
  input: {schema: ImproveWritingInputSchema},
  output: {schema: ImproveWritingOutputSchema},
  prompt: `You are an expert writing editor. Your task is to meticulously review and improve the provided text.
Preserve the original meaning, intent, and overall tone of the writing as much as possible.

Focus on enhancing:
- Clarity and conciseness: Make the writing easier to understand and remove unnecessary words.
- Grammar and punctuation: Correct any errors.
- Sentence structure and flow: Improve readability and coherence.
- Word choice: Replace weak or vague words with stronger, more precise alternatives. Avoid overly complex jargon unless appropriate for the context.
- Overall impact and engagement.

User's text:
{{{text}}}

Provide the following in your response:
1.  'originalText': The original text submitted by the user.
2.  'improvedText': The revised version of the text.
3.  'suggestions': An optional list of brief, actionable suggestions (e.g., "Replaced passive voice in the second paragraph for better impact," or "Simplified complex sentence for clarity."). If no specific suggestions are necessary beyond the improved text itself, this can be omitted or an empty array.

Output in the specified JSON format.
`,
});

const improveWritingFlow = ai.defineFlow(
  {
    name: 'improveWritingFlow',
    inputSchema: ImproveWritingInputSchema,
    outputSchema: ImproveWritingOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        console.warn('improveWritingFlow: LLM did not return valid output. Returning fallback.');
        return {
          originalText: input.text,
          improvedText: "Error: Could not improve text at this time. The AI model did not provide a valid response.",
          suggestions: ["The AI model encountered an issue or the text was too short/complex to process effectively at this moment. Please try again later or with a different piece of text."]
        };
      }
      // Ensure originalText is part of the output, as per schema
      return { ...output, originalText: input.text };
    } catch (error) {
      console.error('improveWritingFlow: Error calling prompt:', error);
      return {
        originalText: input.text,
        improvedText: "Apologies, I couldn't process the improvement request right now. There might have been a connection issue or an internal error.",
        suggestions: ["Please check your internet connection and try again. If the problem persists, the AI service might be temporarily unavailable."]
      };
    }
  }
);
