
'use server';
/**
 * @fileOverview AI-powered tool to generate brief writing exercises or "quests".
 *
 * - generateWritingExercise - A function that creates a writing exercise/quest, optionally based on a topic.
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
  exercisePrompt: z.string().describe('A concise and engaging writing exercise prompt or quest for the user.'),
  category: z.string().optional().describe('A category for the exercise, e.g., "Creativity Booster", "Character Sketch", "World Building", "Plot Untangler", "Mini Quest".'),
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
  Sometimes, frame these as mini "writing quests" or "challenges" to make them more engaging.
  
  {{#if currentTopic}}
  The user is currently writing about: "{{currentTopic}}". Try to make the exercise somewhat relevant if possible, but keep it light, fun, and brief.
  {{else}}
  Generate a general creative writing exercise or a fun mini-quest.
  {{/if}}

  The exercise/quest should be something the user can do in 5-10 minutes.
  Examples:
  - "Describe the smell of an old, forgotten book."
  - "Quest: Write a 3-sentence story about a character who finds a mysterious key."
  - "Challenge: If your main character had a secret pet, what would it be and why? Describe it in two sentences."
  - "Imagine a color no one has ever seen. Describe it."
  - "Mini-Quest: Invent a fantastical creature and write its one-sentence origin story."

  Provide the exercise prompt and an optional category (e.g., "Creativity Booster", "Mini Quest"). Output in the specified JSON format.
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
        console.warn('generateWritingExerciseFlow: LLM did not return valid output, using fallback.');
        return {
            exercisePrompt: "Take a moment to jot down three interesting words you've encountered today. Try to use them in a sentence later!",
            category: "Vocabulary Builder"
        };
      }
      return output;
    } catch (error) {
      console.error('generateWritingExerciseFlow: Error calling prompt:', error);
      return {
          exercisePrompt: "Apologies, I couldn't generate an exercise right now. How about sketching a character from your story?",
          category: "Creative Block"
      };
    }
  }
);
