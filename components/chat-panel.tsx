"use client"

import type React from "react"

import type { Model } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { ArrowUp, ChevronDown, MessageCirclePlus, Square, Paperclip } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Textarea from "react-textarea-autosize"
import { useArtifact } from "./artifact/artifact-context"
import { EmptyScreen } from "./empty-screen"
import { AudioModeToggle } from "./audio-mode-toggle"
import { Button } from "./ui/button"
import { IconLogo } from "./ui/icons"

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: any) => void
  models?: Model[]
  showScrollToBottomButton: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement>
  selectedFile?: File
  setSelectedFile?: (file: File | undefined) => void
}

export function ChatPanel({
  input = "",
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append,
  models,
  showScrollToBottomButton,
  scrollContainerRef,
  selectedFile,
  setSelectedFile,
}: ChatPanelProps) {
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false)
  const [enterDisabled, setEnterDisabled] = useState(false)
  const { close: closeArtifact } = useArtifact()

  const [localInput, setLocalInput] = useState(input || "")

  useEffect(() => {
    setLocalInput(input || "")
  }, [input])

  const handleCompositionStart = () => setIsComposing(true)

  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => {
      setEnterDisabled(false)
    }, 300)
  }

  const handleNewChat = () => {
    setMessages([])
    closeArtifact()
    router.push("/")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && setSelectedFile) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    if (setSelectedFile) {
      setSelectedFile(undefined)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChangeWithFallback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setLocalInput(value)

    try {
      if (handleInputChange && typeof handleInputChange === "function") {
        handleInputChange(e)
      }
    } catch (error) {
      console.warn("handleInputChange failed:", error)
    }

    setShowEmptyScreen(value.length === 0)
  }

  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      append({
        role: "user",
        content: query,
      })
      isFirstRender.current = false
    }
  }, [query])

  const handleScrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  return (
    <div
      className={cn(
        "w-full bg-background group/form-container shrink-0",
        messages.length > 0 ? "sticky bottom-0 px-4 sm:px-6 pb-4 sm:pb-6 mt-4" : "px-4 sm:px-8 mt-8",
      )}
    >
      {messages.length === 0 && (
        <div className="mb-6 sm:mb-10 flex flex-col items-center gap-3 sm:gap-4">
          <IconLogo className="size-10 sm:size-12 text-muted-foreground" />
          <p className="text-center text-xl sm:text-2xl lg:text-3xl font-semibold px-2 sm:px-4">
            How can I help you today?
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className={cn("w-full mx-auto relative", "max-w-full sm:max-w-2xl lg:max-w-3xl")}>
        {showScrollToBottomButton && messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -top-8 sm:-top-10 right-2 sm:right-4 z-20 size-8 rounded-full shadow-md bg-background/80 backdrop-blur-sm"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </Button>
        )}

        {selectedFile && (
          <div className="mb-3 p-3 bg-muted rounded-lg flex items-center justify-between">
            <span className="text-sm text-muted-foreground truncate">File: {selectedFile.name}</span>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="h-6 px-2 ml-2">
              ×
            </Button>
          </div>
        )}

        <div className="relative flex flex-col w-full gap-2 bg-muted rounded-2xl sm:rounded-3xl border border-input">
          <Textarea
            ref={inputRef}
            name="input"
            rows={2}
            maxRows={5}
            tabIndex={0}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Ask a question..."
            spellCheck={false}
            value={localInput}
            disabled={isLoading}
            className="resize-none w-full min-h-12 bg-transparent border-0 p-3 sm:p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            onChange={handleInputChangeWithFallback}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isComposing && !enterDisabled) {
                if (!localInput || localInput.trim().length === 0) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                const textarea = e.target as HTMLTextAreaElement
                textarea.form?.requestSubmit()
              }
            }}
            onFocus={() => setShowEmptyScreen(true)}
            onBlur={() => setShowEmptyScreen(false)}
          />

          <div className="flex items-center justify-between p-2 sm:p-3 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <AudioModeToggle />
              {setSelectedFile && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 rounded-full size-8 sm:size-10 bg-transparent hover:bg-accent"
                    disabled={isLoading}
                  >
                    <Paperclip className="size-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNewChat}
                  className="shrink-0 rounded-full group size-8 sm:size-10 bg-transparent hover:bg-accent"
                  type="button"
                  disabled={isLoading}
                >
                  <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-all" />
                </Button>
              )}
              <Button
                type={isLoading ? "button" : "submit"}
                size={"icon"}
                variant={"outline"}
                className={cn(
                  isLoading && "animate-pulse",
                  "rounded-full size-8 sm:size-10 bg-transparent hover:bg-accent",
                )}
                disabled={(!localInput || localInput.length === 0) && !isLoading}
                onClick={isLoading ? stop : undefined}
              >
                {isLoading ? <Square size={16} /> : <ArrowUp size={16} />}
              </Button>
            </div>
          </div>
        </div>

        {messages.length === 0 && (
          <EmptyScreen
            submitMessage={(message) => {
              setLocalInput(message)

              if (handleInputChange && typeof handleInputChange === "function") {
                try {
                  const fakeEvent = {
                    target: { value: message },
                    preventDefault: () => {},
                  } as React.ChangeEvent<HTMLTextAreaElement>

                  handleInputChange(fakeEvent)
                } catch (error) {
                  console.warn("handleInputChange failed in EmptyScreen:", error)
                }
              }

              setTimeout(() => {
                const form = inputRef.current?.form
                if (form) {
                  form.requestSubmit()
                }
              }, 0)
            }}
            className={cn(showEmptyScreen ? "visible" : "invisible")}
          />
        )}
      </form>
    </div>
  )
}
