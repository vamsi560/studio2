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
import { handleKnowledgeExplanation } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { InstantKnowledgeExplanationOutput } from "@/ai/flows/instant-knowledge-explanations"

const formSchema = z.object({
  question: z.string().min(1, "Question is required."),
  localLanguage: z.string().min(1, "Language is required."),
})

export function KnowledgeBase() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<InstantKnowledgeExplanationOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "", localLanguage: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    const response = await handleKnowledgeExplanation(values)
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
        <CardTitle className="font-headline">Instant Knowledge Base</CardTitle>
        <CardDescription>Get simple explanations for complex questions, with analogies.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student's Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Why is the sky blue?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="localLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local Language for Explanation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hindi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Explanation
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
        <CardContent>
          <div className="mt-6 p-4 border rounded-md bg-white dark:bg-muted/20">
            <h3 className="font-bold mb-2 font-headline text-lg">Explanation:</h3>
            <p className="whitespace-pre-wrap font-body text-foreground/90">{result.explanation}</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
