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
import { useToast } from "@/hooks/use-toast"
import { handleDifferentiatedWorksheets } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { GenerateDifferentiatedWorksheetsOutput } from "@/ai/flows/differentiated-material-generation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

const formSchema = z.object({
  photo: z.instanceof(File).refine(file => file.size > 0, "A photo is required."),
  gradeLevels: z.string().min(1, "Grade levels are required."),
})

export function WorksheetGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GenerateDifferentiatedWorksheetsOutput | null>(null)
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { gradeLevels: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('photo', values.photo)
    formData.append('gradeLevels', values.gradeLevels)

    const response = await handleDifferentiatedWorksheets(formData)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      setPreview(URL.createObjectURL(file));
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Differentiated Worksheets</CardTitle>
        <CardDescription>Upload a textbook photo to generate worksheets for multiple grade levels.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Textbook Page Photo</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {preview && (
              <div className="flex justify-center p-2 border rounded-md bg-secondary">
                <Image src={preview} alt="Image preview" width={200} height={250} className="rounded-md object-contain" />
              </div>
            )}

            <FormField
              control={form.control}
              name="gradeLevels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Levels</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3rd, 4th, 5th" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Worksheets
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
      {result && result.worksheets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        <CardContent>
          <div className="mt-6 space-y-4">
            <h3 className="font-bold font-headline text-lg">Generated Worksheets:</h3>
            <Accordion type="single" collapsible className="w-full">
              {result.worksheets.map((ws, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="bg-secondary rounded-md mb-2 px-4 border">
                  <AccordionTrigger className="font-headline text-base">Grade Level: {ws.gradeLevel}</AccordionTrigger>
                  <AccordionContent>
                      <div className="whitespace-pre-wrap font-body text-foreground/90">{ws.worksheetContent}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
