'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { handleLessonPlan } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { GenerateLessonPlanOutput } from "@/ai/flows/lesson-planner"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  gradeLevel: z.string().min(1, "Grade level is required."),
  duration: z.string().min(1, "Duration is required."),
  objectives: z.string().min(1, "Learning objectives are required."),
})

export function LessonPlanner() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GenerateLessonPlanOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "", gradeLevel: "", duration: "45 minutes", objectives: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    const response = await handleLessonPlan(values)
    setIsLoading(false)
    if (response.success && response.data) {
      setResult(response.data)
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      })
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Interactive Lesson Planner</CardTitle>
        <CardDescription>Plan engaging lessons with AI assistance, from introduction to assessment.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Lesson Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Photosynthesis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 7th Grade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 45 minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Learning Objectives</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Define photosynthesis, Identify the reactants and products..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Lesson Plan
            </Button>
          </CardFooter>
        </form>
      </Form>
      {isLoading && (
         <CardContent>
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
         </CardContent>
      )}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardContent>
            <div className="mt-6 p-4 border rounded-md bg-muted/20 space-y-6">
              <h3 className="font-bold mb-4 font-headline text-xl text-center">{result.lessonPlan.title}</h3>
              
              <div>
                <h4 className="font-headline text-lg mb-2">Introduction</h4>
                <p className="font-body text-foreground/90">{result.lessonPlan.introduction}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-headline text-lg mb-2">Activities</h4>
                <div className="space-y-4">
                  {result.lessonPlan.activities.map((activity, index) => (
                    <div key={index} className="p-4 border rounded-md bg-background">
                      <h5 className="font-bold mb-1">{activity.title}</h5>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-headline text-lg mb-2">Materials Needed</h4>
                <ul className="list-disc list-inside pl-4 space-y-1 text-foreground/90">
                    {result.lessonPlan.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                    ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-headline text-lg mb-2">Assessment Questions</h4>
                <div className="space-y-3">
                  {result.lessonPlan.assessmentQuestions.map((q, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">{q.type}</Badge>
                      <p className="flex-1 text-foreground/90">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
