'use server';

/**
 * @fileOverview Generates dynamic example prompts for the user.
 *
 * - generatePrompts - A function that creates contextual prompts.
 * - GeneratePromptsInput - The input type for the generatePrompts function.
 * - GeneratePromptsOutput - The return type for the generatePrompts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ICONS } from '@/lib/constants';

const GeneratePromptsInputSchema = z.object({
  classLevel: z.string().describe('The selected class level (e.g., "SMA Kelas 10").'),
  subject: z.string().describe('The selected subject (e.g., "Fisika").'),
});
export type GeneratePromptsInput = z.infer<typeof GeneratePromptsInputSchema>;

const iconEnum = Object.keys(ICONS) as [string, ...string[]];

const GeneratePromptsOutputSchema = z.object({
  prompts: z.array(
    z.object({
      icon: z.enum(iconEnum).describe('An icon name from the provided list.'),
      title: z.string().describe('A short, catchy title for the prompt (in Indonesian).'),
      prompt: z.string().describe('The full example prompt text (in Indonesian, max 10 words).'),
    })
  ).length(2).describe('An array of exactly two generated prompts.'),
});
export type GeneratePromptsOutput = z.infer<typeof GeneratePromptsOutputSchema>;

export async function generatePrompts(input: GeneratePromptsInput): Promise<GeneratePromptsOutput> {
  return generatePromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromptsPrompt',
  input: { schema: GeneratePromptsInputSchema },
  output: { schema: GeneratePromptsOutputSchema },
  prompt: `You are an expert curriculum developer for the Indonesian education system. Your task is to generate two highly specific and relevant example questions that a student might ask.

  The student is in: {{{classLevel}}}
  The subject is: {{{subject}}}

  Instructions:
  1.  Generate exactly TWO distinct example questions.
  2.  The questions must be appropriate for the student's specific class level and subject matter based on the current Indonesian curriculum. Avoid generic questions.
  3.  **Crucially, the question prompt text must be short and to the point (max 10 words).**
  4.  For each question, provide a short, catchy title in Bahasa Indonesia.
  5.  For each question, select the most appropriate icon from this list: ${iconEnum.join(', ')}.
  6.  The final output must be in the specified JSON format.
  `,
});

const generatePromptsFlow = ai.defineFlow(
  {
    name: 'generatePromptsFlow',
    inputSchema: GeneratePromptsInputSchema,
    outputSchema: GeneratePromptsOutputSchema,
  },
  async (input) => {
    // Add a simple retry mechanism
    for (let i = 0; i < 3; i++) {
        try {
            const { output } = await prompt(input);
            if (output && output.prompts.length === 2) {
                return output;
            }
        } catch (e) {
            console.error(`Attempt ${i+1} failed:`, e)
            if (i === 2) {
                 throw new Error("Failed to generate prompts after multiple attempts.");
            }
        }
    }
    // This part should ideally not be reached
    throw new Error("Failed to generate prompts and exhausted retries.");
  }
);
