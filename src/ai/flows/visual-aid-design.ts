'use server';

/**
 * @fileOverview Visual aid design AI agent.
 *
 * - generateVisualAid - A function that generates visual aids from textual descriptions.
 * - GenerateVisualAidInput - The input type for the generateVisualAid function.
 * - GenerateVisualAidOutput - The return type for the generateVisualAid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualAidInputSchema = z.object({
  description: z.string().describe('A description of the visual aid to generate.'),
});
export type GenerateVisualAidInput = z.infer<typeof GenerateVisualAidInputSchema>;

const GenerateVisualAidOutputSchema = z.object({
  drawing: z.string().describe(
    'A data URI of a simple line drawing or chart that can be easily replicated on a blackboard. The data URI must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
  ),
});
export type GenerateVisualAidOutput = z.infer<typeof GenerateVisualAidOutputSchema>;

export async function generateVisualAid(input: GenerateVisualAidInput): Promise<GenerateVisualAidOutput> {
  return generateVisualAidFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualAidDesignPrompt',
  input: {schema: GenerateVisualAidInputSchema},
  output: {schema: GenerateVisualAidOutputSchema},
  prompt: `You are an AI assistant designed to generate simple line drawings or charts based on textual descriptions.

You will generate a visual aid that can be easily replicated on a blackboard to visually explain concepts and make learning more engaging for students.

Description: {{{description}}}

Output the drawing as a data URI with MIME type and Base64 encoding. Use a PNG image format.`,    config: {
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
      ],
    },
});

const generateVisualAidFlow = ai.defineFlow(
  {
    name: 'generateVisualAidFlow',
    inputSchema: GenerateVisualAidInputSchema,
    outputSchema: GenerateVisualAidOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {
          text: `Generate a simple line drawing or chart based on the following description: ${input.description}. The drawing should be suitable for replication on a blackboard.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {drawing: media!.url};
  }
);
