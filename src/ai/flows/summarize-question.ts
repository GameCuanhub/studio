
'use server';

/**
 * @fileOverview Summarizes a question from a file or text box.
 *
 * - summarizeQuestion - A function that summarizes the question.
 * - SummarizeQuestionInput - The input type for the summarizeQuestion function.
 * - SummarizeQuestionOutput - The return type for the summarizeQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeQuestionInputSchema = z.object({
  question: z
    .string()
    .describe('The question to be summarized, from file upload or text box.'),
});
export type SummarizeQuestionInput = z.infer<typeof SummarizeQuestionInputSchema>;

const SummarizeQuestionOutputSchema = z.object({
  summary: z.string().describe('A summarized version of the question in Indonesian.'),
});
export type SummarizeQuestionOutput = z.infer<typeof SummarizeQuestionOutputSchema>;

export async function summarizeQuestion(input: SummarizeQuestionInput): Promise<SummarizeQuestionOutput> {
  return summarizeQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeQuestionPrompt',
  input: {schema: SummarizeQuestionInputSchema},
  output: {schema: SummarizeQuestionOutputSchema},
  prompt: `Anda adalah seorang ahli dalam merangkum pertanyaan. Buatlah ringkasan singkat dalam Bahasa Indonesia yang menangkap inti dari apa yang ditanyakan.\n\nPertanyaan: {{{question}}}`,
});

const summarizeQuestionFlow = ai.defineFlow(
  {
    name: 'summarizeQuestionFlow',
    inputSchema: SummarizeQuestionInputSchema,
    outputSchema: SummarizeQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
