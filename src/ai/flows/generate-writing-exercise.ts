
'use server';
/**
 * @fileOverview AI-powered tool to generate brief writing exercises.
 *
 * - generateWritingExercise - A function that creates a writing exercise, optionally based on a topic.
 * - GenerateWritingExerciseInput - The input type for the function.
 * - GenerateWritingExerciseOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { GenerateWritingExerciseInput, GenerateWritingExerciseOutput } from '@/lib/types';

const GenerateWritingExerciseInputSchema = z.object({
  currentTopic: z.string().optional().describe('An optional current topic or snippet of the user\'s writing to make the exercise relevant.'),
  textLength: z.number().optional().describe('Optional length of the current text, to gauge context.'),
});

const GenerateWritingExerciseOutputSchema = z.object({
  exercisePrompt: z.string().describe('A concise and engaging writing exercise prompt for the user.'),
  category: z.string().optional().describe('A category for the exercise, e.g., "Creativity Booster", "Character Sketch", "World Building", "Plot Untangler".'),
});

export type { GenerateWritingExerciseInput, GenerateWritingExerciseOutput };

export async function generateWritingExercise(input: GenerateWritingExerciseInput): Promise<GenerateWritingExerciseOutput> {
  return generateWritingExerciseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWritingExercisePrompt',
  input: { schema: GenerateWritingExerciseInputSchema },
  output: { schema: GenerateWritingExerciseOutputSchema },
  prompt: `You are an AI assistant that generates short, creative writing exercises (1-2 sentences) designed to refresh creativity during a break.
  
  {{#if currentTopic}}
  The user is currently writing about: "{{currentTopic}}". Try to make the exercise somewhat relevant if possible, but keep it light and fun.
  {{else}}
  Generate a general creative writing exercise.
  {{/if}}

  The exercise should be something the user can do in 5-10 minutes.
  Examples:
  - "Describe the smell of an old, forgotten book."
  - "Write a 3-sentence story about a character who finds a mysterious key."
  - "If your main character had a secret pet, what would it be and why?"
  - "Imagine a color no one has ever seen. Describe it."

  Provide the exercise prompt and an optional category. Output in the specified JSON format.
`,
});

const generateWritingExerciseFlow = ai.defineFlow(
  {
    name: 'generateWritingExerciseFlow',
    inputSchema: GenerateWritingExerciseInputSchema,
    outputSchema: GenerateWritingExerciseOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        // This case handles when the LLM successfully responds but doesn't provide valid structured output
        console.warn('generateWritingExerciseFlow: LLM did not return valid output, using fallback.');
        return {
            exercisePrompt: "Take a moment to jot down three interesting words you've encountered today. Try to use them in a sentence later!",
            category: "Vocabulary Builder"
        };
      }
      return output;
    } catch (error) {
      // This case handles errors during the prompt execution itself (e.g., API key issues, network errors to LLM)
      console.error('generateWritingExerciseFlow: Error calling prompt:', error);
      return {
          exercisePrompt: "Apologies, I couldn't generate an exercise right now. How about sketching a character from your story?",
          category: "Creative Block"
      };
    }
  }
);

