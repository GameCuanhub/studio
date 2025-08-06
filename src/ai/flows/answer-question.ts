'use server';
/**
 * @fileOverview An AI agent that answers questions from students.
 *
 * - answerQuestion - A function that handles the question answering process.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionInputSchema = z.object({
  questionText: z.string().describe('The question text.'),
  uploadedFileUri: z
    .string()
    .optional()
    .describe(
      "An optional file (image/document) data URI that provides context for the question. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  subject: z.string().describe('The subject of the question (e.g., Math, Science, History).'),
  classLevel: z.string().describe('The class level of the question (e.g., SD, SMP, SMA).'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AnswerQuestionInputSchema},
  output: {schema: AnswerQuestionOutputSchema},
  prompt: `You are an AI assistant that helps students answer questions.

  The student is in {{{classLevel}}} and is asking a question about {{{subject}}}.

  Question: {{{questionText}}}

  {{#if uploadedFileUri}}
  Here is some additional context in the form of a file:
  {{media url=uploadedFileUri}}
  {{/if}}

  Please provide a helpful and informative answer to the question.
  `,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
