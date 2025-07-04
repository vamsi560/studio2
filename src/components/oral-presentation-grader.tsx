'use client'

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { handleOralPresentationGrader } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { OralPresentationGraderOutput } from "@/ai/flows/oral-presentation-grader"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"

const formSchema = z.object({
  presentationVideo: z.instanceof(File).refine(file => file.size > 0, "A video of the presentation is required."),
  topic: z.string().min(1, "The topic of the presentation is required."),
});


export function OralPresentationGrader() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<OralPresentationGraderOutput | null>(null)
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('presentationVideo', values.presentationVideo)
    formData.append('topic', values.topic)

    const response = await handleOralPresentationGrader(formData)
    setIsLoading(false)
    if (response.success && response.data) {
      setResult(response.data)
    } else {
      toast({
        variant: "destructive",
        title: "Error Grading Presentation",
        description: response.error,
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('presentationVideo', file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      form.clearErrors('presentationVideo');
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Oral Presentation Grader</CardTitle>
        <CardDescription>Upload a student's presentation video to receive a detailed analysis and grade.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="presentationVideo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student's Presentation Video</FormLabel>
                   <FormControl>
                    <Input 
                      type="file" 
                      accept="video/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="file:text-primary file:font-semibold"
                    />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />

            {preview && (
              <div className="flex justify-center p-2 border rounded-md bg-secondary">
                 <video src={preview} controls className="max-w-full rounded-md max-h-64" />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Presentation Topic</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., The life cycle of a butterfly" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Grade Presentation
            </Button>
          </CardFooter>
        </form>
      </Form>
      {isLoading && (
         <CardContent>
            <div className="flex justify-center items-center p-8 flex-col gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is analyzing the video... this may take some time.</p>
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
            <div className="text-center space-y-2">
                <h3 className="font-bold font-headline text-xl">Presentation Report</h3>
                <Badge className="text-lg">Final Score: {result.score}</Badge>
                <p className="font-body text-foreground/90">{result.summary}</p>
            </div>
             <div className="space-y-4">
                <div className="p-4 border rounded-md bg-background">
                    <h4 className="font-headline text-lg mb-2">Analysis</h4>
                    <ul className="space-y-3">
                        <li><strong className="font-medium">Clarity:</strong> {result.analysis.clarity}</li>
                        <li><strong className="font-medium">Accuracy:</strong> {result.analysis.accuracy}</li>
                        <li><strong className="font-medium">Relevance:</strong> {result.analysis.relevance}</li>
                        <li><strong className="font-medium">Engagement:</strong> {result.analysis.engagement}</li>
                    </ul>
                </div>
                 <div className="p-4 border rounded-md bg-background">
                    <h4 className="font-headline text-lg mb-2">Transcript</h4>
                    <p className="whitespace-pre-wrap font-mono text-sm text-foreground/80 bg-secondary p-3 rounded-md">{result.transcript}</p>
                </div>
              </div>
          </div>
        </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
