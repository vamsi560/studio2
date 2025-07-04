'use server';
/**
 * @fileOverview An AI agent that solves complex problems step-by-step.
 *
 * - solveProblemStepByStep - A function that handles the problem-solving process.
 * - StepByStepSolverInput - The input type for the solveProblemStepByStep function.
 * - StepByStepSolverOutput - The return type for the solveProblemStepByStep function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StepByStepSolverInputSchema = z.object({
  problem: z.string().describe('The problem to be solved, e.g., a math word problem, a physics question, or a chemistry equation.'),
});
export type StepByStepSolverInput = z.infer<typeof StepByStepSolverInputSchema>;

const StepSchema = z.object({
    stepNumber: z.number().describe("The sequential number of the step."),
    explanation: z.string().describe("The reasoning and logic behind this step, explaining the concepts or formulas used."),
    calculation: z.string().optional().describe("The mathematical calculation or formula application for this step, if any."),
});

const StepByStepSolverOutputSchema = z.object({
  steps: z.array(StepSchema).describe("The detailed, sequential steps to solve the problem."),
  finalAnswer: z.string().describe("The final, conclusive answer to the problem."),
  summary: z.string().describe("A one-sentence summary of the overall method used to solve the problem."),
});
export type StepByStepSolverOutput = z.infer<typeof StepByStepSolverOutputSchema>;

export async function solveProblemStepByStep(input: StepByStepSolverInput): Promise<StepByStepSolverOutput> {
  return stepByStepSolverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stepByStepSolverPrompt',
  input: {schema: StepByStepSolverInputSchema},
  output: {schema: StepByStepSolverOutputSchema},
  prompt: `You are an expert STEM tutor for students in grades 9-12. Your task is to solve the given problem by providing a clear, step-by-step explanation.

  **Problem:**
  {{{problem}}}
  
  **Instructions:**
  1.  Do not just give the final answer. Break down the solution into logical, sequential steps.
  2.  For each step, provide a clear explanation of the concept, principle, or formula being used. Explain *why* you are taking this step.
  3.  After the explanation, show the corresponding calculation or formula application for that step.
  4.  After all steps are complete, provide a concise summary of the overall method used.
  5.  Finally, state the final answer clearly and with the correct units, if applicable.
  6.  Format your entire response precisely according to the JSON schema.
  `,
});

const stepByStepSolverFlow = ai.defineFlow(
  {
    name: 'stepByStepSolverFlow',
    inputSchema: StepByStepSolverInputSchema,
    outputSchema: StepByStepSolverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
