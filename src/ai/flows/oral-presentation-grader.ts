'use server';
/**
 * @fileOverview An AI agent that grades student oral presentations from video.
 *
 * - oralPresentationGrader - A function that handles the presentation grading process.
 * - OralPresentationGraderInput - The input type for the oralPresentationGrader function.
 * - OralPresentationGraderOutput - The return type for the oralPresentationGrader function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OralPresentationGraderInputSchema = z.object({
  presentationVideoUri: z
    .string()
    .describe(
      "A video of the student's presentation, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  topic: z.string().describe('The topic of the presentation, for context.'),
});
export type OralPresentationGraderInput = z.infer<typeof OralPresentationGraderInputSchema>;

const OralPresentationGraderOutputSchema = z.object({
    transcript: z.string().describe("A full transcript of the student's speech from the video."),
    analysis: z.object({
        clarity: z.string().describe("Feedback on the clarity of the student's speech and arguments."),
        accuracy: z.string().describe("Feedback on the factual accuracy of the content presented."),
        relevance: z.string().describe("Feedback on how relevant the presentation was to the given topic."),
        engagement: z.string().describe("Feedback on the student's engagement with the audience (e.g., body language, tone)."),
    }).describe("Detailed analysis of different aspects of the presentation."),
    summary: z.string().describe("A brief one or two sentence summary of the student's performance, highlighting strengths and areas for improvement."),
    score: z.string().describe('The final score as a string, e.g., "8/10".')
});
export type OralPresentationGraderOutput = z.infer<typeof OralPresentationGraderOutputSchema>;

export async function oralPresentationGrader(input: OralPresentationGraderInput): Promise<OralPresentationGraderOutput> {
  // Using a more capable model for video processing
  const model = 'googleai/gemini-1.5-pro-latest';
  const oralPresentationGraderFlowWithModel = ai.defineFlow(
    {
      name: 'oralPresentationGraderFlow',
      inputSchema: OralPresentationGraderInputSchema,
      outputSchema: OralPresentationGraderOutputSchema,
    },
    async input => {
      const prompt = `You are an expert public speaking coach and teacher. Your task is to grade a student's oral presentation based on a provided video.

      The topic of the presentation is: **{{{topic}}}**
      
      You will analyze the following video of the student's presentation: {{media url=presentationVideoUri}}.
      
      Instructions:
      1.  **Transcribe:** First, provide a complete and accurate transcript of the student's speech.
      2.  **Analyze:** Provide constructive feedback on the following aspects:
          - **Clarity:** How clear and understandable were the student's points?
          - **Accuracy:** Was the information presented factually correct and well-researched for the topic?
          - **Relevance:** Did the student stick to the topic?
          - **Engagement:** Analyze body language, tone of voice, and eye contact to assess how well they engaged the viewer.
      3.  **Summarize:** Write a brief, encouraging summary of the student's overall performance.
      4.  **Score:** Provide a score out of 10 based on your analysis.
      5.  Format your entire response precisely according to the JSON schema.`;
      
      const {output} = await ai.generate({
          model,
          prompt,
          input,
          output: {schema: OralPresentationGraderOutputSchema},
      });
      return output!;
    }
  );
  return oralPresentationGraderFlowWithModel(input);
}
