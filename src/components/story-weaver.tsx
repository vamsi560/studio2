'use client'

import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { handleStoryWeaver, handleTextToSpeech } from "@/app/actions"
import { Loader2, Volume2 } from "lucide-react"
import type { GenerateStoryOutput } from "@/ai/flows/story-weaver"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  characters: z.string().min(1, "Characters are required."),
  moral: z.string().optional(),
  language: z.string().min(1, "Language is required."),
})

export function StoryWeaver() {
  const [isLoading, setIsLoading] = useState(false)
  const [isTtsLoading, setIsTtsLoading] = useState(false)
  const [result, setResult] = useState<GenerateStoryOutput | null>(null)
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "", characters: "", moral: "", language: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    setAudioSrc(null)
    const response = await handleStoryWeaver(values)
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

  async function onListen() {
    if (!result?.story) return;
    setIsTtsLoading(true)
    setAudioSrc(null)
    const response = await handleTextToSpeech({ text: result.story })
    setIsTtsLoading(false)
    if (response.success && response.data) {
      setAudioSrc(response.data.audioDataUri)
    } else {
        toast({
            variant: "destructive",
            title: "Audio Error",
            description: response.error,
        })
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Storybook Illustrator</CardTitle>
        <CardDescription>Weave and illustrate magical stories from a few simple ideas.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Lost Treasure, A Journey to the Stars" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="characters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Characters</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A curious rabbit and a wise old owl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moral"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moral of the Story (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Honesty is the best policy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., English, Hindi, Spanish" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Generating Storybook...' : 'Weave Story'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {isLoading && (
         <CardContent>
            <div className="flex justify-center items-center p-8 flex-col gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is writing and illustrating... this may take a moment.</p>
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
            <div className="mt-6 p-4 border rounded-md bg-muted/20 space-y-4">
                {result.illustrations && result.illustrations.length > 0 && (
                    <div>
                         <h3 className="font-bold font-headline text-lg mb-4 text-center">Storybook Illustrations</h3>
                        <Carousel className="w-full max-w-md mx-auto">
                            <CarouselContent>
                                {result.illustrations.map((src, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-0">
                                            <Image
                                                src={src}
                                                alt={`Illustration ${index + 1}`}
                                                width={500}
                                                height={500}
                                                className="rounded-lg object-cover"
                                                data-ai-hint="storybook illustration"
                                            />
                                        </CardContent>
                                    </Card>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                )}

              <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold font-headline text-lg">Your Story:</h3>
                 <Button onClick={onListen} disabled={isTtsLoading || !result.story} variant="ghost" size="sm">
                     {isTtsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Volume2 className="mr-2 h-4 w-4" />}
                     Listen
                 </Button>
              </div>
              {audioSrc && (
                <div className="mb-4">
                    <audio controls className="w-full">
                        <source src={audioSrc} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
              )}
              <p className="whitespace-pre-wrap font-body text-foreground/90">{result.story}</p>
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
