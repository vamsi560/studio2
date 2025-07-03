'use server';
/**
 * @fileOverview An AI agent that generates assessments and quizzes.
 *
 * - generateAssessment - A function that handles the assessment generation process.
 * - GenerateAssessmentInput - The input type for the generateAssessment function.
 * - GenerateAssessmentOutput - The return type for the generateAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssessmentInputSchema = z.object({
  topic: z.string().describe('The topic of the assessment.'),
  numQuestions: z.number().int().positive().describe('The number of questions to generate.'),
  questionTypes: z.string().describe('A comma-separated list of question types (e.g., Multiple Choice, Short Answer, True/False).'),
  gradeLevel: z.string().describe('The grade level for which the assessment is intended.'),
});
export type GenerateAssessmentInput = z.infer<typeof GenerateAssessmentInputSchema>;

const QuestionSchema = z.object({
    type: z.string().describe('The type of the question (e.g., Multiple Choice, Short Answer).'),
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).optional().describe('A list of options for multiple-choice questions.'),
    answer: z.string().describe('The correct answer to the question.'),
});

const GenerateAssessmentOutputSchema = z.object({
  assessment: z.object({
      title: z.string().describe('A title for the generated assessment.'),
      questions: z.array(QuestionSchema).describe('The list of generated questions.'),
  })
});
export type GenerateAssessmentOutput = z.infer<typeof GenerateAssessmentOutputSchema>;

export async function generateAssessment(input: GenerateAssessmentInput): Promise<GenerateAssessmentOutput> {
  return assessmentGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessmentGeneratorPrompt',
  input: {schema: GenerateAssessmentInputSchema},
  output: {schema: GenerateAssessmentOutputSchema},
  prompt: `You are an expert educator who creates high-quality assessments for students.

  Generate an assessment based on the following criteria:
  
  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Number of Questions: {{{numQuestions}}}
  Question Types: {{{questionTypes}}}
  
  Instructions:
  1. Create a suitable title for the assessment.
  2. Generate exactly {{{numQuestions}}} questions.
  3. Distribute the questions among the requested types: {{{questionTypes}}}.
  4. For Multiple Choice questions, provide 4 distinct options and clearly indicate the correct answer.
  5. For Short Answer questions, provide a concise and accurate model answer.
  6. For True/False questions, the answer should be either "True" or "False".
  7. Ensure the difficulty of the questions is appropriate for the specified grade level.
  8. Format the output according to the provided JSON schema.
  `,
});

const assessmentGeneratorFlow = ai.defineFlow(
  {
    name: 'assessmentGeneratorFlow',
    inputSchema: GenerateAssessmentInputSchema,
    outputSchema: GenerateAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
