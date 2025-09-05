"use client"

import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/ui/codeblock"
import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"

interface MessageProps {
  content: string
  role: "user" | "assistant"
  className?: string
}

interface BotMessageProps {
  message: string
  className?: string
}

const markdownComponents: Components = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "")
    const isInline = !match

    if (isInline) {
      return (
        <code className={cn("rounded bg-muted px-1 py-0.5 text-sm", className)} {...props}>
          {children}
        </code>
      )
    }

    return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />
  },
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  h1: ({ children }) => <h1 className="mb-2 text-xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 text-lg font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-base font-medium">{children}</h3>,
  blockquote: ({ children }) => <blockquote className="border-l-4 border-muted pl-4 italic">{children}</blockquote>,
}

export function Message({ content, role, className }: MessageProps) {
  return (
    <div className={cn("flex w-full gap-4 p-4", role === "user" ? "justify-end" : "justify-start", className)}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

export function BotMessage({ message, className }: BotMessageProps) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown components={markdownComponents}>{message}</ReactMarkdown>
    </div>
  )
}

export function AIMessageText({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  )
}
