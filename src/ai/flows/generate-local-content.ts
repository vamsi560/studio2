// This file is machine-generated - edit with care!
'use server';
/**
 * @fileOverview A hyper-local content generation AI agent.
 *
 * - generateLocalContent - A function that handles the content generation process.
 * - GenerateLocalContentInput - The input type for the generateLocalContent function.
 * - GenerateLocalContentOutput - The return type for the generateLocalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocalContentInputSchema = z.object({
  language: z.string().describe('The local language to generate content in.'),
  topic: z.string().describe('The topic of the content to generate.'),
  gradeLevel: z.string().describe('The grade level the content is for.'),
  additionalContext: z.string().optional().describe('Any additional context or instructions for content generation.'),
});
export type GenerateLocalContentInput = z.infer<typeof GenerateLocalContentInputSchema>;

const GenerateLocalContentOutputSchema = z.object({
  content: z.string().describe('The generated hyper-local content.'),
});
export type GenerateLocalContentOutput = z.infer<typeof GenerateLocalContentOutputSchema>;

export async function generateLocalContent(input: GenerateLocalContentInput): Promise<GenerateLocalContentOutput> {
  return generateLocalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocalContentPrompt',
  input: {schema: GenerateLocalContentInputSchema},
  output: {schema: GenerateLocalContentOutputSchema},
  prompt: `You are an expert in generating hyper-local content for teachers in India.

You will generate content in the specified language, on the given topic, and appropriate for the specified grade level.

Language: {{{language}}}
Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Additional Context: {{{additionalContext}}}

Content:`, 
});

const generateLocalContentFlow = ai.defineFlow(
  {
    name: 'generateLocalContentFlow',
    inputSchema: GenerateLocalContentInputSchema,
    outputSchema: GenerateLocalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
