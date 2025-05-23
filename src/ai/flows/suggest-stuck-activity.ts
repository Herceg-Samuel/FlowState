
'use server';
/**
 * @fileOverview AI-powered tool to suggest activities when a user is feeling stuck in their writing.
 *
 * - suggestStuckActivity - A function that provides an activity suggestion.
 * - SuggestStuckActivityInput - The input type for the function.
 * - SuggestStuckActivityOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { SuggestStuckActivityInput, SuggestStuckActivityOutput } from '@/lib/types';

const SuggestStuckActivityInputSchema = z.object({
  currentText: z.string().describe("The user's current writing progress."),
  problemDescription: z.string().optional().describe('Optional: A brief description from the user about what they are stuck on (e.g., "character motivation", "plot next step", "dialogue feels flat").'),
});

const SuggestStuckActivityOutputSchema = z.object({
  activitySuggestion: z.string().describe('A specific, actionable activity suggestion to help the user get unstuck (e.g., "Try mind-mapping your character\'s goals," or "Write a short scene from a different character\'s perspective.").'),
  rationale: z.string().optional().describe('A brief explanation of why this activity might help with the described problem or general writer\'s block.'),
  estimatedTime: z.string().optional().describe('An estimated time commitment for the activity (e.g., "5-10 minutes", "15 minutes").'),
});

export type { SuggestStuckActivityInput, SuggestStuckActivityOutput };

export async function suggestStuckActivity(input: SuggestStuckActivityInput): Promise<SuggestStuckActivityOutput> {
  return suggestStuckActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStuckActivityPrompt',
  input: { schema: SuggestStuckActivityInputSchema },
  output: { schema: SuggestStuckActivityOutputSchema },
  prompt: `You are an AI writing coach. The user is feeling stuck with their writing.
  Current text snippet (may be empty if they haven't started or deleted everything):
  "{{{currentText}}}"

  {{#if problemDescription}}
  User's description of the problem: "{{problemDescription}}"
  Suggest a brief, actionable activity (5-15 minutes) tailored to this problem.
  {{else}}
  The user hasn't specified the problem. Suggest a general activity to overcome writer's block or refresh creativity.
  {{/if}}

  Examples of suggestions:
  - Problem: "Plot next step" -> Activity: "Take 5 minutes to brainstorm three completely unexpected things that could happen next. Don't filter, just list."
  - Problem: "Character motivation" -> Activity: "In 100 words, write from your character's perspective about what they want most right now and why."
  - General: -> Activity: "Switch sensory details. If you're focused on sight, try describing the sounds or smells of the scene for 5 minutes."

  Provide the activity suggestion, an optional rationale, and an estimated time. Output in the specified JSON format.
`,
});

const suggestStuckActivityFlow = ai.defineFlow(
  {
    name: 'suggestStuckActivityFlow',
    inputSchema: SuggestStuckActivityInputSchema,
    outputSchema: SuggestStuckActivityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        return {
            activitySuggestion: "Try free-writing for 5 minutes on a completely unrelated topic to clear your head, then come back to your main piece.",
            rationale: "Sometimes a mental reset can help break through a block.",
            estimatedTime: "5-10 minutes"
        };
    }
    return output;
  }
);
