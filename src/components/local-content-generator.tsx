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
import { handleLocalContent } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { GenerateLocalContentOutput } from "@/ai/flows/generate-local-content"

const formSchema = z.object({
  language: z.string().min(1, "Language is required."),
  topic: z.string().min(1, "Topic is required."),
  gradeLevel: z.string().min(1, "Grade level is required."),
  additionalContext: z.string().optional(),
})

export function LocalContentGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GenerateLocalContentOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { language: "", topic: "", gradeLevel: "", additionalContext: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    const response = await handleLocalContent(values)
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
        <CardTitle className="font-headline">Hyper-Local Content</CardTitle>
        <CardDescription>Generate culturally relevant content in any local language.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Marathi, Hindi, Tamil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Explain different soil types" {...field} />
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
                    <Input placeholder="e.g., 4th Grade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Context (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Create a story about farmers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Content
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
            <h3 className="font-bold mb-2 font-headline text-lg">Generated Content:</h3>
            <p className="whitespace-pre-wrap font-body text-foreground/90">{result.content}</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
