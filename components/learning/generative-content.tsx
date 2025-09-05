"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  topic: any
  messages: any[]
}

export function GenerativeContent({ topic, messages }: Props) {
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateContent()
  }, [topic, messages])

  const generateContent = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.name,
          context: messages.slice(-3), // Last 3 messages for context
        }),
      })

      const content = await response.json()
      setGeneratedContent(content)
    } catch (error) {
      console.error("Content generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {generatedContent && (
        <>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: generatedContent.explanation }} />
          </div>

          {generatedContent.visualizations && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedContent.visualizations.map((viz: any, index: number) => (
                <Card key={index} className="p-4">
                  <h3 className="font-semibold mb-2">{viz.title}</h3>
                  <div className="aspect-video bg-muted rounded flex items-center justify-center">
                    {viz.type === "chart" ? <div>Chart: {viz.data}</div> : <div>Diagram: {viz.description}</div>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
