"use client"

import type React from "react"
import type { Model } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import type { Message } from "ai/react"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { toast } from "sonner"
import { ChatMessages } from "./chat-messages"
import { ChatPanel } from "./chat-panel"
import type { EndpointsContext } from "@/components/agent"
import { useActions } from "@/lib/client-utils"
import { LocalContext } from "@/lib/shared-types"

interface ChatSection {
  id: string
  userMessage: Message
  assistantMessages: Message[]
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result as string
      resolve(base64String.split(",")[1])
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

export function Chat({
  id,
  savedMessages = [],
  query,
}: {
  id: string
  savedMessages?: Message[]
  query?: string
  models?: Model[]
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null!)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const actions = useActions<typeof EndpointsContext>()
  const [messages, setMessages] = useState<Message[]>(savedMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<[role: string, content: string][]>([])
  const [selectedFile, setSelectedFile] = useState<File>()
  const [data, setData] = useState<any>(undefined)

  const sections = useMemo<ChatSection[]>(() => {
    const result: ChatSection[] = []
    let currentSection: ChatSection | null = null
    for (const message of messages) {
      if (message.role === "user") {
        if (currentSection) result.push(currentSection)
        currentSection = { id: message.id, userMessage: message, assistantMessages: [] }
      } else if (currentSection && message.role === "assistant") {
        currentSection.assistantMessages.push(message)
      }
    }
    if (currentSection) result.push(currentSection)
    return result
  }, [messages])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const threshold = 50
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold)
    }
    container.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (sections.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === "user") {
        requestAnimationFrame(() => {
          document.getElementById(`section-${lastMessage.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      }
    }
  }, [sections.length])

  useEffect(() => {
    if (JSON.stringify(savedMessages) !== JSON.stringify(messages)) {
      setMessages(savedMessages)
      const convertedHistory: [role: string, content: string][] = []
      for (const msg of savedMessages) {
        convertedHistory.push([msg.role === "user" ? "human" : "ai", msg.content])
      }
      setHistory(convertedHistory)
    }
  }, [id])

  const append = useCallback(
    async (message: { role: string; content: string }) => {
      console.log("[v0] Sending new message...")
      console.log("[v0] chatSessionId:", id)
      console.log("[v0] savedMessages:", savedMessages)

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user" as const,
        content: message.content,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        let base64File: string | undefined
        const fileExtension = selectedFile?.type.split("/")[1]
        if (selectedFile) {
          base64File = await convertFileToBase64(selectedFile)
        }

        const element = await actions.agent({
          input: message.content,
          chat_history: history,
          file: base64File && fileExtension ? { base64: base64File, extension: fileExtension } : undefined,
        })

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant" as const,
          content: "", // Will fill later
        }

        setMessages((prev) => [...prev, assistantMessage])
        setData(element)
        ;(async () => {
          try {
            const lastEvent = await element.lastEvent
            let finalContent = ""

            if (Array.isArray(lastEvent)) {
              if (lastEvent[0]?.result) {
                finalContent = lastEvent[0].result
                setHistory((prev) => [...prev, ["human", message.content], ["ai", finalContent]])
              } else {
                setHistory((prev) => [...prev, ["human", message.content]])
              }
            } else if (lastEvent?.result) {
              finalContent = lastEvent.result
              setHistory((prev) => [...prev, ["human", message.content], ["ai", finalContent]])
            }

            if (finalContent) {
              setMessages((prev) =>
                prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: finalContent } : msg)),
              )
            }

            console.log("[v0] Message sent successfully")
          } catch (error) {
            console.error("[v0] Error processing response:", error)
          }
        })()

        setSelectedFile(undefined)
        window.history.replaceState({}, "", `/chat/${id}`)
        window.dispatchEvent(new CustomEvent("chat-history-updated"))
      } catch (error) {
        toast.error(`Error in chat: ${(error as Error).message}`)
      } finally {
        setIsLoading(false)
      }
    },
    [actions, history, selectedFile, id, savedMessages],
  )

  const onQuerySelect = useCallback(
    (query: string) => {
      append({ role: "user", content: query })
    },
    [append],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const stop = useCallback(() => setIsLoading(false), [])

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (input.trim()) {
        append({ role: "user", content: input.trim() })
        setInput("")
      }
    },
    [input, append],
  )

  const handleUpdateMessage = useCallback(
    async (messageId: string, newContent: string): Promise<void> => {
      setMessages((currentMessages) =>
        currentMessages.map((msg) => (msg.id === messageId ? { ...msg, content: newContent } : msg)),
      )

      try {
        const messageIndex = messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex === -1) return

        const messagesUpToEdited = messages.slice(0, messageIndex + 1)
        setMessages(messagesUpToEdited)

        const newHistory = history.slice(0, Math.floor(messageIndex / 2) + 1)
        setHistory(newHistory)

        await append({ role: "user", content: newContent })
      } catch (error) {
        console.error("Failed to reload after message update:", error)
        toast.error(`Failed to reload conversation: ${(error as Error).message}`)
      }
    },
    [messages, history, append],
  )

  const handleReload = useCallback(
    async (messageId: string): Promise<string | null | undefined> => {
      try {
        const messageIndex = messages.findIndex((m) => m.id === messageId)
        if (messageIndex !== -1) {
          const userMessageIndex = messages.slice(0, messageIndex).findLastIndex((m) => m.role === "user")
          if (userMessageIndex !== -1) {
            const trimmedMessages = messages.slice(0, userMessageIndex + 1)
            setMessages(trimmedMessages)

            const newHistory = history.slice(0, Math.floor(userMessageIndex / 2) + 1)
            setHistory(newHistory)

            const lastUserMessage = trimmedMessages[userMessageIndex]
            if (lastUserMessage) {
              await append({ role: "user", content: lastUserMessage.content })
              return lastUserMessage.content
            }
          }
        }
        return null
      } catch (error) {
        console.error("Failed to reload:", error)
        return null
      }
    },
    [messages, history, append],
  )

  return (
    <div
      className={cn(
        "relative flex h-full min-w-0 flex-1 flex-col",
        messages.length === 0 ? "items-center justify-center" : "",
      )}
      data-testid="full-chat"
    >
      <LocalContext.Provider value={append}>
        <ChatMessages
          sections={sections}
          data={data}
          onQuerySelect={onQuerySelect}
          isLoading={isLoading}
          chatId={id}
          addToolResult={() => {}}
          scrollContainerRef={scrollContainerRef}
          onUpdateMessage={handleUpdateMessage}
          reload={handleReload}
        />
        <ChatPanel
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
          stop={stop}
          query={query}
          append={append}
          showScrollToBottomButton={!isAtBottom}
          scrollContainerRef={scrollContainerRef}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          models={[]}
        />
      </LocalContext.Provider>
    </div>
  )
}
