"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessages } from "./chat-messages"
import { VoiceControls } from "./voice-controls"
import { ProgressTracker } from "./progress-tracker"
import { GenerativeContent } from "./generative-content"

interface Props {
  topic: any
  userId: string
  accessToken: string
}

export function LearningInterface({ topic, userId, accessToken }: Props) {
  const [isVoiceMode, setIsVoiceMode] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/chat",
    body: { topic: topic.name },
  })

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Learning Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">{topic.name}</h1>
            <GenerativeContent topic={topic} messages={messages} />
          </Card>

          <Card className="p-6">
            <ChatMessages messages={messages} isLoading={isLoading} />

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question about this topic..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                Send
              </Button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <VoiceControls
            isVoiceMode={isVoiceMode}
            onToggleVoice={() => setIsVoiceMode(!isVoiceMode)}
            accessToken={accessToken}
          />

          <ProgressTracker userId={userId} topicId={topic.id} />
        </div>
      </div>
    </div>
  )
}
