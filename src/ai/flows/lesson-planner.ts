'use server';
/**
 * @fileOverview An AI agent that generates interactive lesson plans.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  topic: z.string().describe('The main topic of the lesson.'),
  gradeLevel: z.string().describe('The grade level for which the lesson is intended.'),
  duration: z.string().describe('The estimated duration of the lesson (e.g., 45 minutes, 1 hour).'),
  objectives: z.string().describe('A comma-separated list of learning objectives.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.object({
      title: z.string().describe('An engaging title for the lesson plan.'),
      introduction: z.string().describe('A brief, engaging introduction to the topic to capture student interest.'),
      activities: z.array(
        z.object({
          title: z.string().describe('A title for the activity.'),
          description: z.string().describe('A detailed description of the activity.'),
        })
      ).describe('A list of interactive activities to conduct during the lesson.'),
      materials: z.array(z.string()).describe('A list of materials needed for the lesson.'),
      assessmentQuestions: z.array(
        z.object({
            question: z.string().describe('A question to assess student understanding.'),
            type: z.string().describe('The type of question (e.g., "Multiple Choice", "Short Answer").'),
        })
      ).describe('A list of questions to assess learning at the end of the lesson.'),
  })
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return lessonPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lessonPlannerPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert curriculum designer who creates engaging and comprehensive lesson plans for teachers.

  Generate a detailed lesson plan based on the following criteria:
  
  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Duration: {{{duration}}}
  Learning Objectives: {{{objectives}}}
  
  Instructions:
  1. Create a captivating title for the lesson.
  2. Write an introduction that will grab the students' attention.
  3. Design at least two engaging activities. For each activity, provide a clear title and description.
  4. List all necessary materials for the lesson.
  5. Create a few assessment questions (a mix of types like multiple choice or short answer) to check for understanding.
  6. Ensure the content and complexity are appropriate for the specified grade level.
  7. Format the output precisely according to the provided JSON schema.
  `,
});

const lessonPlannerFlow = ai.defineFlow(
  {
    name: 'lessonPlannerFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
