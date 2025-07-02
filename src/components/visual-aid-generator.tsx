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
import { handleVisualAid } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { GenerateVisualAidOutput } from "@/ai/flows/visual-aid-design"
import Image from "next/image"

const formSchema = z.object({
  description: z.string().min(1, "Description is required."),
})

export function VisualAidGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GenerateVisualAidOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    const response = await handleVisualAid(values)
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
        <CardTitle className="font-headline">Visual Aid Design</CardTitle>
        <CardDescription>Generate simple drawings or charts that are easy to replicate on a blackboard.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Visual Aid</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., A simple diagram of the water cycle with labels for evaporation, condensation, and precipitation." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Aid
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
            <h3 className="font-bold mb-4 font-headline text-lg text-center">Generated Visual Aid:</h3>
            <div className="flex justify-center">
              <Image 
                src={result.drawing} 
                alt="Generated visual aid" 
                width={400} 
                height={400}
                className="rounded-md border-2 border-border bg-white"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
