'use client'

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LocalContentGenerator } from "@/components/local-content-generator"
import { WorksheetGenerator } from "@/components/worksheet-generator"
import { KnowledgeBase } from "@/components/knowledge-base"
import { VisualAidGenerator } from "@/components/visual-aid-generator"
import { StoryWeaver } from "@/components/story-weaver"
import { AssessmentGenerator } from "@/components/assessment-generator"
import { LessonPlanner } from "@/components/lesson-planner"
import { PaperGrader } from "@/components/paper-grader"
import { OralPresentationGrader } from "@/components/oral-presentation-grader"
import { Bot, FileText, Lightbulb, Image as ImageIcon, Sparkles, FileQuestion, BookOpenCheck, FileCheck2, Video } from "lucide-react"

const features = [
  { value: 'local-content', label: 'Local Content', icon: FileText, component: <LocalContentGenerator /> },
  { value: 'lesson-planner', label: 'Lesson Planner', icon: BookOpenCheck, component: <LessonPlanner /> },
  { value: 'differentiated-materials', label: 'Worksheets', icon: Bot, component: <WorksheetGenerator /> },
  { value: 'knowledge-base', label: 'Knowledge Base', icon: Lightbulb, component: <KnowledgeBase /> },
  { value: 'visual-aids', label: 'Visual Aids', icon: ImageIcon, component: <VisualAidGenerator /> },
  { value: 'story-weaver', label: 'Storybook Illustrator', icon: Sparkles, component: <StoryWeaver /> },
  { value: 'assessment-generator', label: 'Assessments', icon: FileQuestion, component: <AssessmentGenerator /> },
  { value: 'paper-grader', label: 'Paper Grader', icon: FileCheck2, component: <PaperGrader /> },
  { value: 'presentation-grader', label: 'Presentation Grader', icon: Video, component: <OralPresentationGrader /> },
];


export default function DashboardPage() {
  const [activeFeature, setActiveFeature] = useState('local-content');

  const activeComponent = features.find(f => f.value === activeFeature)?.component;

  return (
    <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Your AI Teaching Companion</h2>
        <p className="text-muted-foreground mt-2 font-body">
          Tools to empower teachers in multi-grade classrooms. Create, differentiate, and explain with ease.
        </p>
      </div>

      <div className="w-full">
         <Select onValueChange={setActiveFeature} value={activeFeature}>
          <SelectTrigger className="w-full md:w-72 mx-auto">
            <SelectValue placeholder="Select a feature..." />
          </SelectTrigger>
          <SelectContent>
            {features.map(feature => (
              <SelectItem key={feature.value} value={feature.value}>
                <div className="flex items-center gap-2">
                  <feature.icon className="h-4 w-4" />
                  <span>{feature.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-4 w-full">
        {activeComponent}
      </div>
    </div>
  )
}
