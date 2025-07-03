// src/ai/flows/story-weaver.ts
'use server';
/**
 * @fileOverview An AI agent that weaves engaging stories for children.
 *
 * - generateStory - A function that handles the story generation process.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  topic: z.string().describe('The central topic or theme of the story.'),
  characters: z.string().describe('The main characters of the story, e.g., "A brave lion and a clever mouse".'),
  moral: z.string().optional().describe('An optional moral or lesson the story should teach.'),
  language: z.string().describe('The language the story should be written in.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  story: z.string().describe('The generated story.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return storyWeaverFlow(input);
}

const storyWeaverPrompt = ai.definePrompt({
  name: 'storyWeaverPrompt',
  input: {schema: GenerateStoryInputSchema},
  output: {schema: GenerateStoryOutputSchema},
  prompt: `You are a master storyteller for children, skilled at weaving magical and engaging tales in various languages.

Create a wonderful story based on the following details:

Topic: {{{topic}}}
Characters: {{{characters}}}
{{#if moral}}
Moral of the story: {{{moral}}}
{{/if}}
Language: {{{language}}}

The story should be captivating, easy to understand for children, and culturally appropriate. Ensure the story has a clear beginning, middle, and end.
`,
});

const storyWeaverFlow = ai.defineFlow(
  {
    name: 'storyWeaverFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const {output} = await storyWeaverPrompt(input);
    return output!;
  }
);
