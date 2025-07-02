// src/ai/flows/differentiated-material-generation.ts
'use server';
/**
 * @fileOverview Differentiates worksheets based on an image of a textbook page for different grade levels.
 *
 * - generateDifferentiatedWorksheets - Generates differentiated worksheets based on an image.
 * - GenerateDifferentiatedWorksheetsInput - The input type for the generateDifferentiatedWorksheets function.
 * - GenerateDifferentiatedWorksheetsOutput - The return type for the generateDifferentiatedWorksheets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDifferentiatedWorksheetsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a textbook page, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  gradeLevels: z.string().describe('Comma separated list of grade levels to generate worksheets for.'),
});

export type GenerateDifferentiatedWorksheetsInput = z.infer<typeof GenerateDifferentiatedWorksheetsInputSchema>;

const GenerateDifferentiatedWorksheetsOutputSchema = z.object({
  worksheets: z.array(
    z.object({
      gradeLevel: z.string().describe('The grade level of the worksheet.'),
      worksheetContent: z.string().describe('The content of the worksheet.'),
    })
  ).
describe('List of worksheets for different grade levels.'),
});

export type GenerateDifferentiatedWorksheetsOutput = z.infer<typeof GenerateDifferentiatedWorksheetsOutputSchema>;

export async function generateDifferentiatedWorksheets(input: GenerateDifferentiatedWorksheetsInput): Promise<GenerateDifferentiatedWorksheetsOutput> {
  return differentiatedWorksheetsFlow(input);
}

const differentiatedWorksheetsPrompt = ai.definePrompt({
  name: 'differentiatedWorksheetsPrompt',
  input: {schema: GenerateDifferentiatedWorksheetsInputSchema},
  output: {schema: GenerateDifferentiatedWorksheetsOutputSchema},
  prompt: `You are an expert teacher specializing in creating differentiated worksheets for different grade levels.

You will use the content of the textbook page to generate worksheets tailored to each grade level specified.

Textbook Page Photo: {{media url=photoDataUri}}
Grade Levels: {{{gradeLevels}}}

Generate differentiated worksheets for each grade level. Each worksheet should be appropriate for the grade level, and should cover the material in the textbook page.

Ensure that the content is formatted as a list of worksheets, with grade level and worksheet content.
`,
});

const differentiatedWorksheetsFlow = ai.defineFlow(
  {
    name: 'differentiatedWorksheetsFlow',
    inputSchema: GenerateDifferentiatedWorksheetsInputSchema,
    outputSchema: GenerateDifferentiatedWorksheetsOutputSchema,
  },
  async input => {
    const {output} = await differentiatedWorksheetsPrompt(input);
    return output!;
  }
);
