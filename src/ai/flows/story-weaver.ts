'use server';
/**
 * @fileOverview An AI agent that weaves engaging stories for children and illustrates them.
 *
 * - generateStory - A function that handles the story and illustration generation process.
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
  illustrations: z.array(z.string()).describe("A list of data URIs for the generated illustrations. The data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return storyWeaverFlow(input);
}

const illustrationPromptSchema = z.object({
  sceneDescriptions: z.array(z.string()).min(3).max(4).describe('A list of 3 or 4 detailed scene descriptions suitable for generating illustrations for the story.')
})

const storyAndIllustrationPromptsPrompt = ai.definePrompt({
    name: 'storyAndIllustrationPromptsPrompt',
    input: {schema: GenerateStoryInputSchema},
    output: {schema: z.object({
        story: z.string().describe('The generated story.'),
        illustrationPrompts: illustrationPromptSchema,
    })},
    prompt: `You are a master storyteller and illustrator for children.
    
    First, create a wonderful story based on the following details. The story should be captivating, easy to understand, and culturally appropriate. Ensure the story has a clear beginning, middle, and end.
    
    Topic: {{{topic}}}
    Characters: {{{characters}}}
    {{#if moral}}
    Moral of the story: {{{moral}}}
    {{/if}}
    Language: {{{language}}}

    Second, after writing the story, create a list of 3-4 detailed scene descriptions from the story. These descriptions should be perfect prompts for an AI image generator to create illustrations for the story. The prompts should describe the visual elements of a key scene.
    `,
});


const storyWeaverFlow = ai.defineFlow(
  {
    name: 'storyWeaverFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    // Step 1: Generate story and illustration prompts
    const { output: storyData } = await storyAndIllustrationPromptsPrompt(input);
    
    if (!storyData || !storyData.story || !storyData.illustrationPrompts) {
      throw new Error("Failed to generate story and prompts.");
    }
    
    const { story, illustrationPrompts } = storyData;

    // Step 2: Generate illustrations for each prompt in parallel
    const illustrationPromises = illustrationPrompts.sceneDescriptions.map(prompt => {
      return ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Children's storybook illustration, cute and colorful style. Scene: ${prompt}`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
    });

    const illustrationResults = await Promise.all(illustrationPromises);

    const illustrations = illustrationResults.map(result => {
        if (!result.media) {
            // Handle cases where an image might not be generated
            return 'https://placehold.co/400x400.png'; // Fallback placeholder
        }
        return result.media.url;
    });

    return {
      story,
      illustrations,
    };
  }
);
