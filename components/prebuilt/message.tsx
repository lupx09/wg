"use client"

import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface MessageProps {
  content: string
  role?: "user" | "assistant"
  className?: string
}

export function AIMessageText({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("flex gap-3 p-4", className)}>
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  )
}

export function UserMessage({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("flex gap-3 p-4", className)}>
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  )
}
