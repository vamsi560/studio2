'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { handleStepByStepSolver } from "@/app/actions"
import { Loader2, AlertCircle } from "lucide-react"
import type { StepByStepSolverOutput } from "@/ai/flows/step-by-step-solver"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

const formSchema = z.object({
  problem: z.string().min(10, "Please enter a detailed problem."),
})

export function StepByStepSolver() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<StepByStepSolverOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { problem: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    const response = await handleStepByStepSolver(values)
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
        <CardTitle className="font-headline">Step-by-Step Problem Solver</CardTitle>
        <CardDescription>Get detailed, step-by-step solutions for complex problems in Math, Physics, and Chemistry.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Description</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="e.g., A train travels at 60 km/h for 0.52 h, at 30 km/h for the next 0.24 h, and then at 70 km/h for the next 0.71 h. What is its average speed?" 
                        {...field}
                        rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Solve Problem
            </Button>
          </CardFooter>
        </form>
      </Form>
      {isLoading && (
         <CardContent>
            <div className="flex justify-center items-center p-8 flex-col gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is working on the solution...</p>
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
              <div>
                  <h3 className="font-bold font-headline text-xl text-center mb-4">Solution Breakdown</h3>
                  <div className="p-3 mb-4 text-sm rounded-md bg-background border border-primary/20">
                    <p><span className="font-semibold">Method:</span> {result.summary}</p>
                  </div>
              </div>

              <div className="space-y-4">
                {result.steps.map((step, index) => (
                    <div key={index} className="p-4 border rounded-md bg-background flex gap-4 items-start">
                        <Badge variant="secondary" className="mt-1 text-base">{step.stepNumber}</Badge>
                        <div className="flex-1 space-y-2">
                            <p className="font-body text-foreground/90 leading-relaxed">{step.explanation}</p>
                            {step.calculation && (
                                <div className="p-3 rounded-md bg-muted/50 font-mono text-sm border-l-4 border-primary">
                                    {step.calculation}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
              </div>

              <Separator />

               <div className="text-center p-4 rounded-md bg-gradient-to-r from-primary/20 to-accent/20">
                <h4 className="font-headline text-lg mb-1">Final Answer</h4>
                <p className="font-bold text-xl text-primary">{result.finalAnswer}</p>
              </div>
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
