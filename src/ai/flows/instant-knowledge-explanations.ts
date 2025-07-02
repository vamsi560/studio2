'use server';
/**
 * @fileOverview An AI agent that provides simple, accurate explanations for complex student questions in the local language, complete with easy-to-understand analogies.
 *
 * - instantKnowledgeExplanation - A function that handles the process of generating explanations.
 * - InstantKnowledgeExplanationInput - The input type for the instantKnowledgeExplanation function.
 * - InstantKnowledgeExplanationOutput - The return type for the instantKnowledgeExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InstantKnowledgeExplanationInputSchema = z.object({
  question: z.string().describe('The complex question from the student.'),
  localLanguage: z.string().describe('The local language to provide the explanation in.'),
});
export type InstantKnowledgeExplanationInput = z.infer<typeof InstantKnowledgeExplanationInputSchema>;

const InstantKnowledgeExplanationOutputSchema = z.object({
  explanation: z.string().describe('The simple and accurate explanation in the local language, complete with easy-to-understand analogies.'),
});
export type InstantKnowledgeExplanationOutput = z.infer<typeof InstantKnowledgeExplanationOutputSchema>;

export async function instantKnowledgeExplanation(
  input: InstantKnowledgeExplanationInput
): Promise<InstantKnowledgeExplanationOutput> {
  return instantKnowledgeExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'instantKnowledgeExplanationPrompt',
  input: {schema: InstantKnowledgeExplanationInputSchema},
  output: {schema: InstantKnowledgeExplanationOutputSchema},
  prompt: `You are an expert teacher specializing in explaining complex topics in simple terms.

You will provide a simple, accurate explanation for the student's question in the local language, complete with easy-to-understand analogies.

Question: {{{question}}}
Local Language: {{{localLanguage}}}`,
});

const instantKnowledgeExplanationFlow = ai.defineFlow(
  {
    name: 'instantKnowledgeExplanationFlow',
    inputSchema: InstantKnowledgeExplanationInputSchema,
    outputSchema: InstantKnowledgeExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
