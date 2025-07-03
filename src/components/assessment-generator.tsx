'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { handleAssessmentGeneration } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { GenerateAssessmentOutput } from "@/ai/flows/assessment-generator"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  numQuestions: z.coerce.number().int().positive("Must be a positive number.").min(1, "At least one question is required."),
  questionTypes: z.string().min(1, "Question types are required."),
  gradeLevel: z.string().min(1, "Grade level is required."),
})

export function AssessmentGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GenerateAssessmentOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "", numQuestions: 5, questionTypes: "Multiple Choice, Short Answer", gradeLevel: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    const response = await handleAssessmentGeneration(values)
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
        <CardTitle className="font-headline">Assessment Generator</CardTitle>
        <CardDescription>Create quizzes and tests for any topic and grade level in minutes.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Solar System, Indian Independence Movement" {...field} />
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
                    <Input placeholder="e.g., 8th Grade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="questionTypes"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Question Types</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Multiple Choice, True/False, Short Answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Assessment
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
            <div className="mt-6 p-4 border rounded-md bg-muted/20">
              <h3 className="font-bold mb-4 font-headline text-xl text-center">{result.assessment.title}</h3>
              <div className="space-y-4">
                {result.assessment.questions.map((q, index) => (
                    <div key={index} className="p-4 border rounded-md bg-background">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-foreground/90">{index + 1}. {q.question}</p>
                            <Badge variant="secondary">{q.type}</Badge>
                        </div>
                        {q.options && (
                            <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                                {q.options.map((opt, i) => (
                                    <li key={i}>{opt}</li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-3 pt-2 border-t border-dashed">
                            <p className="text-sm font-bold text-primary">Answer: <span className="font-normal text-foreground">{q.answer}</span></p>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
