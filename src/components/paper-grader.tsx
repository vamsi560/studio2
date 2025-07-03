'use client'

import { useState, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { handlePaperGrader } from "@/app/actions"
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import type { PaperGraderOutput } from "@/ai/flows/paper-grader"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

const formSchema = z.object({
  answerSheetImage: z.instanceof(File).refine(file => file.size > 0, "An image of the answer sheet is required."),
  gradingMode: z.enum(['key', 'ai'], { required_error: "You must select a grading mode." }),
  answerKey: z.string().optional(),
  topic: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.gradingMode === 'key' && (!data.answerKey || data.answerKey.length < 10)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "An answer key of at least 10 characters is required.",
            path: ['answerKey']
        });
    }
    if (data.gradingMode === 'ai' && (!data.topic || data.topic.length < 1)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A topic is required for AI-assisted grading.",
            path: ['topic']
        });
    }
});


export function PaperGrader() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PaperGraderOutput | null>(null)
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { gradingMode: 'key', answerKey: "", topic: "" },
  })

  const gradingMode = form.watch("gradingMode");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('answerSheetImage', values.answerSheetImage)
    if (values.gradingMode === 'key' && values.answerKey) {
        formData.append('answerKey', values.answerKey)
    }
    if (values.gradingMode === 'ai' && values.topic) {
        formData.append('topic', values.topic)
    }

    const response = await handlePaperGrader(formData)
    setIsLoading(false)
    if (response.success && response.data) {
      setResult(response.data)
    } else {
      toast({
        variant: "destructive",
        title: "Error Grading Paper",
        description: response.error,
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('answerSheetImage', file);
      setPreview(URL.createObjectURL(file));
      form.clearErrors('answerSheetImage');
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">AI Paper Grader</CardTitle>
        <CardDescription>Upload a student's answer sheet, provide an answer key or a topic, and get an automated grading report.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="answerSheetImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student's Answer Sheet</FormLabel>
                   <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
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
                <Image src={preview} alt="Answer sheet preview" width={200} height={250} className="rounded-md object-contain" />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="gradingMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Grading Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="key" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Use Answer Key
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="ai" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          AI-Assisted Grading (No Key)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {gradingMode === 'key' && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3}}>
                    <FormField
                    control={form.control}
                    name="answerKey"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Answer Key</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Paste the answer key here. You can copy it from the Assessment Generator. For best results, include question numbers." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </motion.div>
            )}

            {gradingMode === 'ai' && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3}}>
                    <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Test Topic / Subject</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., The Indian Freedom Struggle, Photosynthesis, Algebra Basics" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </motion.div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Grade Paper
            </Button>
          </CardFooter>
        </form>
      </Form>
      {isLoading && (
         <CardContent>
            <div className="flex justify-center items-center p-8 flex-col gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is grading the paper... this may take a moment.</p>
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
                <h3 className="font-bold font-headline text-xl">Grading Report</h3>
                <Badge className="text-lg">Final Score: {result.score}</Badge>
                <p className="font-body text-foreground/90">{result.summary}</p>
            </div>
             <div className="space-y-4">
                {result.gradedResults.map((q, index) => (
                    <div key={index} className="p-4 border rounded-md bg-background flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            {q.isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-foreground/90">Question {q.questionNumber}</p>
                            <div className="text-sm mt-2 space-y-2">
                                <p><span className="font-medium">Student's Answer:</span> {q.studentAnswer}</p>
                                <p><span className="font-medium">Correct Answer:</span> {q.correctAnswer}</p>
                                {!q.isCorrect && q.reasoning && (
                                     <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/10 text-destructive/90">
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                                        <p><span className="font-medium">Reasoning:</span> {q.reasoning}</p>
                                     </div>
                                )}
                            </div>
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
