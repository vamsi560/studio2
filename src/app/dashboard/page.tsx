import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocalContentGenerator } from "@/components/local-content-generator"
import { WorksheetGenerator } from "@/components/worksheet-generator"
import { KnowledgeBase } from "@/components/knowledge-base"
import { VisualAidGenerator } from "@/components/visual-aid-generator"
import { Bot, FileText, Lightbulb, Image as ImageIcon } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline">Your AI Teaching Companion</h2>
        <p className="text-muted-foreground mt-2 font-body">
          Tools to empower teachers in multi-grade classrooms. Create, differentiate, and explain with ease.
        </p>
      </div>
      <Tabs defaultValue="local-content" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="local-content" className="py-2 flex-col h-auto gap-1 text-sm">
            <FileText className="h-5 w-5 mb-1" />
            <span>Local Content</span>
          </TabsTrigger>
          <TabsTrigger value="differentiated-materials" className="py-2 flex-col h-auto gap-1 text-sm">
            <Bot className="h-5 w-5 mb-1" />
            <span>Worksheets</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge-base" className="py-2 flex-col h-auto gap-1 text-sm">
            <Lightbulb className="h-5 w-5 mb-1" />
            <span>Knowledge Base</span>
          </TabsTrigger>
          <TabsTrigger value="visual-aids" className="py-2 flex-col h-auto gap-1 text-sm">
            <ImageIcon className="h-5 w-5 mb-1" />
            <span>Visual Aids</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="local-content">
          <LocalContentGenerator />
        </TabsContent>
        <TabsContent value="differentiated-materials">
          <WorksheetGenerator />
        </TabsContent>
        <TabsContent value="knowledge-base">
          <KnowledgeBase />
        </TabsContent>
        <TabsContent value="visual-aids">
          <VisualAidGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
