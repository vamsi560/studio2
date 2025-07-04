'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { handleOralPresentationGrader } from "@/app/actions"
import { Loader2, Mic, StopCircle, AlertCircle } from "lucide-react"
import type { OralPresentationGraderOutput } from "@/ai/flows/oral-presentation-grader"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"

export function LivePracticeCoach() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OralPresentationGraderOutput | null>(null)
  const [topic, setTopic] = useState("")
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  
  const { toast } = useToast()

  const stopMediaTracks = useCallback((stream: MediaStream) => {
    stream.getTracks().forEach(track => track.stop())
  }, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (hasCameraPermission === true) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setHasCameraPermission(true)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = async () => {
          setIsProcessing(true)
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
          recordedChunksRef.current = []
          
          const file = new File([blob], "presentation.webm", { type: 'video/webm' })
          
          if (!topic) {
              toast({
                  variant: "destructive",
                  title: "Topic Required",
                  description: "Please enter a topic before starting a recording.",
              });
              setIsProcessing(false);
              return;
          }

          const formData = new FormData()
          formData.append('presentationVideo', file)
          formData.append('topic', topic)

          const response = await handleOralPresentationGrader(formData)
          setIsProcessing(false)
          if (response.success && response.data) {
            setResult(response.data)
          } else {
            toast({
              variant: "destructive",
              title: "Error Grading Presentation",
              description: response.error,
            })
          }
          if (videoRef.current?.srcObject) {
            stopMediaTracks(videoRef.current.srcObject as MediaStream);
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setHasCameraPermission(false)
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to use this feature.',
        })
      }
    }
    
    getCameraPermission();

    return () => {
      if (videoRef.current?.srcObject) {
        stopMediaTracks(videoRef.current.srcObject as MediaStream);
      }
    }
  }, [hasCameraPermission, stopMediaTracks, topic, toast]);

  const handleStartRecording = () => {
    if (!topic) {
        toast({
            variant: "destructive",
            title: "Topic Required",
            description: "Please enter a topic before starting your practice session.",
        })
        return;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      recordedChunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setResult(null)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Live Practice Coach</CardTitle>
        <CardDescription>Practice your presentation or reading skills live and get instant AI feedback.</CardDescription>
      </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="topic">Practice Topic</Label>
                <Input 
                    id="topic" 
                    placeholder="e.g., The life cycle of a butterfly" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isRecording || isProcessing}
                />
            </div>
            
            <div className="w-full aspect-video bg-secondary rounded-md flex items-center justify-center relative overflow-hidden">
                <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center p-4">
                        <Alert variant="destructive" className="max-w-sm">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser settings to use this feature. You may need to refresh the page.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <div className="flex justify-center w-full">
                {!isRecording ? (
                    <Button onClick={handleStartRecording} disabled={!hasCameraPermission || isProcessing} size="lg">
                        <Mic className="mr-2" />
                        Start Recording
                    </Button>
                ) : (
                    <Button onClick={handleStopRecording} variant="destructive" size="lg">
                        <StopCircle className="mr-2" />
                        Stop Recording
                    </Button>
                )}
            </div>
        </CardFooter>

      {(isProcessing) && (
         <CardContent>
            <div className="flex justify-center items-center p-8 flex-col gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is analyzing your performance...</p>
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
                <h3 className="font-bold font-headline text-xl">Practice Report</h3>
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
                    <p className="whitespace-pre-wrap font-mono text-sm text-foreground/80 bg-secondary p-3 rounded-md max-h-48 overflow-y-auto">{result.transcript}</p>
                </div>
              </div>
          </div>
        </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
