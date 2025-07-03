'use server';
/**
 * @fileOverview An AI agent that grades student answer sheets.
 *
 * - paperGrader - A function that handles the paper grading process.
 * - PaperGraderInput - The input type for the paperGrader function.
 * - PaperGraderOutput - The return type for the paperGrader function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PaperGraderInputSchema = z.object({
  answerSheetImageUri: z
    .string()
    .describe(
      "A photo of the student's answer sheet, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  answerKey: z.string().optional().describe('The answer key for the test. This contains the questions and correct answers.'),
  topic: z.string().optional().describe('The topic or subject of the test, used for AI grading when no answer key is provided.'),
}).refine(data => data.answerKey || data.topic, {
    message: "Either an answer key or a topic must be provided.",
});
export type PaperGraderInput = z.infer<typeof PaperGraderInputSchema>;

const PaperGraderOutputSchema = z.object({
    gradedResults: z.array(
        z.object({
            questionNumber: z.number().describe('The number of the question.'),
            studentAnswer: z.string().describe("The student's answer as extracted from the image."),
            correctAnswer: z.string().describe('The correct answer from the answer key or as determined by the AI.'),
            isCorrect: z.boolean().describe('Whether the student answer is correct.'),
            reasoning: z.string().optional().describe('A brief explanation for why an answer is marked incorrect.'),
        })
    ).describe("The list of graded questions."),
    summary: z.string().describe("A brief one or two sentence summary of the student's performance."),
    score: z.string().describe('The final score as a string, e.g., "8/10".')
});
export type PaperGraderOutput = z.infer<typeof PaperGraderOutputSchema>;

export async function paperGrader(input: PaperGraderInput): Promise<PaperGraderOutput> {
  return paperGraderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paperGraderPrompt',
  input: {schema: PaperGraderInputSchema},
  output: {schema: PaperGraderOutputSchema},
  prompt: `You are an expert and diligent AI teaching assistant. Your task is to grade a student's test paper.

You will be given an image of the student's answer sheet.
Image of the answer sheet: {{media url=answerSheetImageUri}}.

{{#if answerKey}}
**Instructions (Using Answer Key):**
1.  Carefully analyze the image of the answer sheet.
2.  Read the student's answers for each question number.
3.  Compare the student's answers to the provided answer key below.
4.  For each question, determine if the student's answer is correct. Be flexible with minor spelling or phrasing differences as long as the core concept is correct.
5.  If an answer is incorrect, provide a very brief, helpful reason.
6.  Calculate the final score (number of correct answers / total number of questions).
7.  Provide a short, encouraging summary of the student's performance.
8.  Format your entire response according to the JSON schema.

**Answer Key:**
---
{{{answerKey}}}
---
{{else}}
**Instructions (AI-Assisted Grading):**
1.  The topic of this test is: **{{{topic}}}**.
2.  **There is no answer key provided.** You must act as a subject matter expert for the given topic.
3.  Carefully analyze the image of the answer sheet and identify each question and the student's corresponding answer.
4.  For each question, first determine the correct answer based on your expert knowledge of the topic.
5.  Then, compare the student's answer to the correct answer you determined. Be flexible with minor spelling or phrasing differences as long as the core concept is correct.
6.  If the student's answer is incorrect, provide a brief, helpful explanation for why it's wrong.
7.  Calculate the final score (number of correct answers / total number of questions).
8.  Provide a short, encouraging summary of the student's performance.
9.  Format your entire response according to the JSON schema, filling in the \`correctAnswer\` field with the answer you determined to be correct.
{{/if}}
`,
});

const paperGraderFlow = ai.defineFlow(
  {
    name: 'paperGraderFlow',
    inputSchema: PaperGraderInputSchema,
    outputSchema: PaperGraderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
