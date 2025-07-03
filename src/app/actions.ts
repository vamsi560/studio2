'use server'

import { generateLocalContent, type GenerateLocalContentOutput } from '@/ai/flows/generate-local-content'
import { generateDifferentiatedWorksheets, type GenerateDifferentiatedWorksheetsOutput } from '@/ai/flows/differentiated-material-generation'
import { instantKnowledgeExplanation, type InstantKnowledgeExplanationOutput } from '@/ai/flows/instant-knowledge-explanations'
import { generateVisualAid, type GenerateVisualAidOutput } from '@/ai/flows/visual-aid-design'
import { generateStory, type GenerateStoryOutput } from '@/ai/flows/story-weaver'
import { generateAssessment, type GenerateAssessmentOutput } from '@/ai/flows/assessment-generator'
import { z } from 'zod'

const fileToDataUri = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return `data:${file.type};base64,${buffer.toString('base64')}`
}

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
}

export const handleLocalContent = async (values: { language: string, topic: string, gradeLevel: string, additionalContext?: string }): Promise<ActionResponse<GenerateLocalContentOutput>> => {
  try {
    const result = await generateLocalContent(values)
    return { success: true, data: result }
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return { success: false, error: `Failed to generate content: ${errorMessage}` }
  }
}

export const handleDifferentiatedWorksheets = async (formData: FormData): Promise<ActionResponse<GenerateDifferentiatedWorksheetsOutput>> => {
  try {
    const photo = formData.get('photo') as File | null;
    const gradeLevels = formData.get('gradeLevels') as string | null;

    if (!photo || photo.size === 0) {
      return { success: false, error: 'A photo of the textbook page is required.' };
    }
    if (!gradeLevels) {
      return { success: false, error: 'Grade levels are required.' };
    }

    const photoDataUri = await fileToDataUri(photo);
    const result = await generateDifferentiatedWorksheets({
      photoDataUri,
      gradeLevels,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return { success: false, error: `Failed to generate worksheets: ${errorMessage}` };
  }
};

export const handleKnowledgeExplanation = async (values: { question: string, localLanguage: string }): Promise<ActionResponse<InstantKnowledgeExplanationOutput>> => {
  try {
    const result = await instantKnowledgeExplanation(values)
    return { success: true, data: result }
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return { success: false, error: `Failed to generate explanation: ${errorMessage}` }
  }
}

export const handleVisualAid = async (values: { description: string }): Promise<ActionResponse<GenerateVisualAidOutput>> => {
  try {
    const result = await generateVisualAid(values)
    return { success: true, data: result }
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return { success: false, error: `Failed to generate visual aid: ${errorMessage}` }
  }
}

export const handleStoryWeaver = async (values: { topic: string, characters: string, moral?: string, language: string }): Promise<ActionResponse<GenerateStoryOutput>> => {
  try {
    const result = await generateStory(values)
    return { success: true, data: result }
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return { success: false, error: `Failed to generate story: ${errorMessage}` }
  }
}

export const handleAssessmentGeneration = async (values: { topic: string, numQuestions: number, questionTypes: string, gradeLevel: string }): Promise<ActionResponse<GenerateAssessmentOutput>> => {
  try {
    const result = await generateAssessment(values)
    return { success: true, data: result }
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return { success: false, error: `Failed to generate assessment: ${errorMessage}` }
  }
}
