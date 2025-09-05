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
  /** Whether to show the scroll to bottom button */
  showScrollToBottomButton: boolean
  /** Reference to the scroll container */
  scrollContainerRef: React.RefObject<HTMLDivElement>
  selectedFile?: File
  setSelectedFile?: (file: File | undefined) => void
}

export function ChatPanel({
  input = "", // Added default empty string to prevent undefined errors
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
  const [isComposing, setIsComposing] = useState(false) // Composition state
  const [enterDisabled, setEnterDisabled] = useState(false) // Disable Enter after composition ends
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

    // Try to call the prop handler, but don't fail if it's not available
    try {
      if (handleInputChange && typeof handleInputChange === "function") {
        handleInputChange(e)
      }
    } catch (error) {
      console.warn("handleInputChange failed:", error)
    }

    setShowEmptyScreen(value.length === 0)
  }

  // if query is not empty, submit the query
  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      append({
        role: "user",
        content: query,
      })
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Scroll to the bottom of the container
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
        messages.length > 0 ? "sticky bottom-0 px-6 xs:px-8 sm:px-4 pb-3 xs:pb-4 mt-6" : "px-8 xs:px-12 sm:px-6 mt-8",
      )}
    >
      {messages.length === 0 && (
        <div className="mb-4 xs:mb-6 sm:mb-10 flex flex-col items-center gap-2 xs:gap-3 sm:gap-4">
          <IconLogo className="size-8 xs:size-10 sm:size-12 text-muted-foreground" />
          <p className="text-center text-xl xs:text-2xl sm:text-3xl font-semibold px-2 xs:px-4">
            How can I help you today?
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "w-full mx-auto relative",
          "max-w-[calc(100vw-64px)] xs:max-w-[calc(100vw-96px)] sm:max-w-2xl lg:max-w-3xl",
        )}
      >
        {/* Scroll to bottom button - only shown when showScrollToBottomButton is true */}
        {showScrollToBottomButton && messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -top-7 xs:-top-8 sm:-top-10 right-1 xs:right-2 sm:right-4 z-20 size-7 xs:size-8 rounded-full shadow-md bg-transparent"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={14} className="xs:size-4" />
          </Button>
        )}

        {selectedFile && (
          <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
            <span className="text-sm text-muted-foreground">File: {selectedFile.name}</span>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="h-6 px-2">
              ×
            </Button>
          </div>
        )}

        <div className="relative flex flex-col w-full gap-1.5 xs:gap-2 bg-muted rounded-2xl xs:rounded-3xl border border-input">
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
            className="resize-none w-full min-h-10 xs:min-h-12 bg-transparent border-0 p-2.5 xs:p-3 sm:p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Bottom menu area */}
          <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 gap-1 xs:gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0 flex-1">
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
                    className="shrink-0 rounded-full size-7 xs:size-8 sm:size-10 bg-transparent"
                    disabled={isLoading}
                  >
                    <Paperclip className="size-3 xs:size-3.5 sm:size-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 shrink-0">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNewChat}
                  className="shrink-0 rounded-full group size-7 xs:size-8 sm:size-10 bg-transparent"
                  type="button"
                  disabled={isLoading}
                >
                  <MessageCirclePlus className="size-3 xs:size-3.5 sm:size-4 group-hover:rotate-12 transition-all" />
                </Button>
              )}
              <Button
                type={isLoading ? "button" : "submit"}
                size={"icon"}
                variant={"outline"}
                className={cn(isLoading && "animate-pulse", "rounded-full size-7 xs:size-8 sm:size-10")}
                disabled={(!localInput || localInput.length === 0) && !isLoading}
                onClick={isLoading ? stop : undefined}
              >
                {isLoading ? (
                  <Square size={14} className="xs:size-4 sm:size-5" />
                ) : (
                  <ArrowUp size={14} className="xs:size-4 sm:size-5" />
                )}
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

              // Submit the form after setting the input
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








// "use client"

// import type React from "react"

// import type { Model } from "@/lib/types/models"
// import { cn } from "@/lib/utils"
// import type { Message } from "ai"
// import { ArrowUp, ChevronDown, MessageCirclePlus, Square } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useEffect, useRef, useState } from "react"
// import Textarea from "react-textarea-autosize"
// import { useArtifact } from "./artifact/artifact-context"
// import { EmptyScreen } from "./empty-screen"
// import { AudioModeToggle } from "./audio-mode-toggle"
// import { Button } from "./ui/button"
// import { IconLogo } from "./ui/icons"

// interface ChatPanelProps {
//   input: string
//   handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
//   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
//   isLoading: boolean
//   messages: Message[]
//   setMessages: (messages: Message[]) => void
//   query?: string
//   stop: () => void
//   append: (message: any) => void
//   models?: Model[]
//   /** Whether to show the scroll to bottom button */
//   showScrollToBottomButton: boolean
//   /** Reference to the scroll container */
//   scrollContainerRef: React.RefObject<HTMLDivElement>
// }

// export function ChatPanel({
//   input = "", // Added default empty string to prevent undefined errors
//   handleInputChange,
//   handleSubmit,
//   isLoading,
//   messages,
//   setMessages,
//   query,
//   stop,
//   append,
//   models,
//   showScrollToBottomButton,
//   scrollContainerRef,
// }: ChatPanelProps) {
//   const [showEmptyScreen, setShowEmptyScreen] = useState(false)
//   const router = useRouter()
//   const inputRef = useRef<HTMLTextAreaElement>(null)
//   const isFirstRender = useRef(true)
//   const [isComposing, setIsComposing] = useState(false) // Composition state
//   const [enterDisabled, setEnterDisabled] = useState(false) // Disable Enter after composition ends
//   const { close: closeArtifact } = useArtifact()

//   const handleCompositionStart = () => setIsComposing(true)

//   const handleCompositionEnd = () => {
//     setIsComposing(false)
//     setEnterDisabled(true)
//     setTimeout(() => {
//       setEnterDisabled(false)
//     }, 300)
//   }

//   const handleNewChat = () => {
//     setMessages([])
//     closeArtifact()
//     router.push("/")
//   }

//   // if query is not empty, submit the query
//   useEffect(() => {
//     if (isFirstRender.current && query && query.trim().length > 0) {
//       append({
//         role: "user",
//         content: query,
//       })
//       isFirstRender.current = false
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [query])

//   // Scroll to the bottom of the container
//   const handleScrollToBottom = () => {
//     const scrollContainer = scrollContainerRef.current
//     if (scrollContainer) {
//       scrollContainer.scrollTo({
//         top: scrollContainer.scrollHeight,
//         behavior: "smooth",
//       })
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "w-full bg-background group/form-container shrink-0",
//         messages.length > 0 ? "sticky bottom-0 px-1.5 xs:px-2 sm:px-4 pb-3 xs:pb-4" : "px-3 xs:px-4 sm:px-6",
//       )}
//     >
//       {messages.length === 0 && (
//         <div className="mb-4 xs:mb-6 sm:mb-10 flex flex-col items-center gap-2 xs:gap-3 sm:gap-4">
//           <IconLogo className="size-8 xs:size-10 sm:size-12 text-muted-foreground" />
//           <p className="text-center text-xl xs:text-2xl sm:text-3xl font-semibold px-2 xs:px-4">
//             How can I help you today?
//           </p>
//         </div>
//       )}
//       <form
//         onSubmit={handleSubmit}
//         className={cn(
//           "w-full mx-auto relative",
//           "max-w-[calc(100vw-12px)] xs:max-w-[calc(100vw-16px)] sm:max-w-2xl lg:max-w-3xl",
//         )}
//       >
//         {/* Scroll to bottom button - only shown when showScrollToBottomButton is true */}
//         {showScrollToBottomButton && messages.length > 0 && (
//           <Button
//             type="button"
//             variant="outline"
//             size="icon"
//             className="absolute -top-7 xs:-top-8 sm:-top-10 right-1 xs:right-2 sm:right-4 z-20 size-7 xs:size-8 rounded-full shadow-md bg-transparent"
//             onClick={handleScrollToBottom}
//             title="Scroll to bottom"
//           >
//             <ChevronDown size={14} className="xs:size-4" />
//           </Button>
//         )}

//         <div className="relative flex flex-col w-full gap-1.5 xs:gap-2 bg-muted rounded-2xl xs:rounded-3xl border border-input">
//           <Textarea
//             ref={inputRef}
//             name="input"
//             rows={2}
//             maxRows={5}
//             tabIndex={0}
//             onCompositionStart={handleCompositionStart}
//             onCompositionEnd={handleCompositionEnd}
//             placeholder="Ask a question..."
//             spellCheck={false}
//             value={input}
//             disabled={isLoading}
//             className="resize-none w-full min-h-10 xs:min-h-12 bg-transparent border-0 p-2.5 xs:p-3 sm:p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//             onChange={(e) => {
//               handleInputChange(e)
//               setShowEmptyScreen(e.target.value.length === 0)
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey && !isComposing && !enterDisabled) {
//                 if (!input || input.trim().length === 0) {
//                   e.preventDefault()
//                   return
//                 }
//                 e.preventDefault()
//                 const textarea = e.target as HTMLTextAreaElement
//                 textarea.form?.requestSubmit()
//               }
//             }}
//             onFocus={() => setShowEmptyScreen(true)}
//             onBlur={() => setShowEmptyScreen(false)}
//           />

//           {/* Bottom menu area */}
//           <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 gap-1 xs:gap-2">
//             <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0 flex-1">
//               <AudioModeToggle />
//             </div>
//             <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 shrink-0">
//               {messages.length > 0 && (
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={handleNewChat}
//                   className="shrink-0 rounded-full group size-7 xs:size-8 sm:size-10 bg-transparent"
//                   type="button"
//                   disabled={isLoading}
//                 >
//                   <MessageCirclePlus className="size-3 xs:size-3.5 sm:size-4 group-hover:rotate-12 transition-all" />
//                 </Button>
//               )}
//               <Button
//                 type={isLoading ? "button" : "submit"}
//                 size={"icon"}
//                 variant={"outline"}
//                 className={cn(isLoading && "animate-pulse", "rounded-full size-7 xs:size-8 sm:size-10")}
//                 disabled={(!input || input.length === 0) && !isLoading}
//                 onClick={isLoading ? stop : undefined}
//               >
//                 {isLoading ? (
//                   <Square size={14} className="xs:size-4 sm:size-5" />
//                 ) : (
//                   <ArrowUp size={14} className="xs:size-4 sm:size-5" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {messages.length === 0 && (
//           <EmptyScreen
//             submitMessage={(message) => {
//               const fakeEvent = {
//                 target: { value: message },
//                 preventDefault: () => {},
//               } as React.ChangeEvent<HTMLTextAreaElement>

//               handleInputChange(fakeEvent)

//               // Submit the form after setting the input
//               setTimeout(() => {
//                 const form = inputRef.current?.form
//                 if (form) {
//                   form.requestSubmit()
//                 }
//               }, 0)
//             }}
//             className={cn(showEmptyScreen ? "visible" : "invisible")}
//           />
//         )}
//       </form>
//     </div>
//   )
// }







// "use client"

// import type React from "react"

// import type { Model } from "@/lib/types/models"
// import { cn } from "@/lib/utils"
// import type { Message } from "ai"
// import { ArrowUp, ChevronDown, MessageCirclePlus, Square } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useEffect, useRef, useState } from "react"
// import Textarea from "react-textarea-autosize"
// import { useArtifact } from "./artifact/artifact-context"
// import { EmptyScreen } from "./empty-screen"
// import { ModelSelector } from "./model-selector"
// import { SearchModeToggle } from "./search-mode-toggle"
// import { Button } from "./ui/button"
// import { IconLogo } from "./ui/icons"

// interface ChatPanelProps {
//   input: string
//   handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
//   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
//   isLoading: boolean
//   messages: Message[]
//   setMessages: (messages: Message[]) => void
//   query?: string
//   stop: () => void
//   append: (message: any) => void
//   models?: Model[]
//   /** Whether to show the scroll to bottom button */
//   showScrollToBottomButton: boolean
//   /** Reference to the scroll container */
//   scrollContainerRef: React.RefObject<HTMLDivElement>
// }

// export function ChatPanel({
//   input,
//   handleInputChange,
//   handleSubmit,
//   isLoading,
//   messages,
//   setMessages,
//   query,
//   stop,
//   append,
//   models,
//   showScrollToBottomButton,
//   scrollContainerRef,
// }: ChatPanelProps) {
//   const [showEmptyScreen, setShowEmptyScreen] = useState(false)
//   const router = useRouter()
//   const inputRef = useRef<HTMLTextAreaElement>(null)
//   const isFirstRender = useRef(true)
//   const [isComposing, setIsComposing] = useState(false) // Composition state
//   const [enterDisabled, setEnterDisabled] = useState(false) // Disable Enter after composition ends
//   const { close: closeArtifact } = useArtifact()

//   const handleCompositionStart = () => setIsComposing(true)

//   const handleCompositionEnd = () => {
//     setIsComposing(false)
//     setEnterDisabled(true)
//     setTimeout(() => {
//       setEnterDisabled(false)
//     }, 300)
//   }

//   const handleNewChat = () => {
//     setMessages([])
//     closeArtifact()
//     router.push("/")
//   }

//   const isToolInvocationInProgress = () => {
//     if (!messages.length) return false

//     const lastMessage = messages[messages.length - 1]
//     if (lastMessage.role !== "assistant" || !lastMessage.parts) return false

//     const parts = lastMessage.parts
//     const lastPart = parts[parts.length - 1]

//     return lastPart?.type === "tool-invocation" && lastPart?.toolInvocation?.state === "call"
//   }

//   // if query is not empty, submit the query
//   useEffect(() => {
//     if (isFirstRender.current && query && query.trim().length > 0) {
//       append({
//         role: "user",
//         content: query,
//       })
//       isFirstRender.current = false
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [query])

//   // Scroll to the bottom of the container
//   const handleScrollToBottom = () => {
//     const scrollContainer = scrollContainerRef.current
//     if (scrollContainer) {
//       scrollContainer.scrollTo({
//         top: scrollContainer.scrollHeight,
//         behavior: "smooth",
//       })
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "w-full bg-background group/form-container shrink-0",
//         messages.length > 0 ? "sticky bottom-0 px-2 sm:px-4 pb-4" : "px-4 sm:px-6",
//       )}
//     >
//       {messages.length === 0 && (
//         <div className="mb-6 sm:mb-10 flex flex-col items-center gap-3 sm:gap-4">
//           <IconLogo className="size-10 sm:size-12 text-muted-foreground" />
//           <p className="text-center text-2xl sm:text-3xl font-semibold px-4">How can I help you today?</p>
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className={cn("max-w-full sm:max-w-2xl lg:max-w-3xl w-full mx-auto relative")}>
//         {/* Scroll to bottom button - only shown when showScrollToBottomButton is true */}
//         {showScrollToBottomButton && messages.length > 0 && (
//           <Button
//             type="button"
//             variant="outline"
//             size="icon"
//             className="absolute -top-8 sm:-top-10 right-2 sm:right-4 z-20 size-8 rounded-full shadow-md bg-transparent"
//             onClick={handleScrollToBottom}
//             title="Scroll to bottom"
//           >
//             <ChevronDown size={16} />
//           </Button>
//         )}

//         <div className="relative flex flex-col w-full gap-2 bg-muted rounded-3xl border border-input">
//           <Textarea
//             ref={inputRef}
//             name="input"
//             rows={2}
//             maxRows={5}
//             tabIndex={0}
//             onCompositionStart={handleCompositionStart}
//             onCompositionEnd={handleCompositionEnd}
//             placeholder="Ask a question..."
//             spellCheck={false}
//             value={input}
//             disabled={isLoading || isToolInvocationInProgress()}
//             className="resize-none w-full min-h-12 sm:min-h-12 bg-transparent border-0 p-3 sm:p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//             onChange={(e) => {
//               handleInputChange(e)
//               setShowEmptyScreen(e.target.value.length === 0)
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey && !isComposing && !enterDisabled) {
//                 if (input.trim().length === 0) {
//                   e.preventDefault()
//                   return
//                 }
//                 e.preventDefault()
//                 const textarea = e.target as HTMLTextAreaElement
//                 textarea.form?.requestSubmit()
//               }
//             }}
//             onFocus={() => setShowEmptyScreen(true)}
//             onBlur={() => setShowEmptyScreen(false)}
//           />

//           {/* Bottom menu area */}
//           <div className="flex items-center justify-between p-2 sm:p-3 gap-2">
//             <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
//               <ModelSelector models={models || []} />
//               <SearchModeToggle />
//             </div>
//             <div className="flex items-center gap-1 sm:gap-2 shrink-0">
//               {messages.length > 0 && (
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={handleNewChat}
//                   className="shrink-0 rounded-full group size-8 sm:size-10 bg-transparent"
//                   type="button"
//                   disabled={isLoading || isToolInvocationInProgress()}
//                 >
//                   <MessageCirclePlus className="size-3 sm:size-4 group-hover:rotate-12 transition-all" />
//                 </Button>
//               )}
//               <Button
//                 type={isLoading ? "button" : "submit"}
//                 size={"icon"}
//                 variant={"outline"}
//                 className={cn(isLoading && "animate-pulse", "rounded-full size-8 sm:size-10")}
//                 disabled={(input.length === 0 && !isLoading) || isToolInvocationInProgress()}
//                 onClick={isLoading ? stop : undefined}
//               >
//                 {isLoading ? <Square size={16} className="sm:size-5" /> : <ArrowUp size={16} className="sm:size-5" />}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {messages.length === 0 && (
//           <EmptyScreen
//             submitMessage={(message) => {
//               handleInputChange({
//                 target: { value: message },
//               } as React.ChangeEvent<HTMLTextAreaElement>)
//             }}
//             className={cn(showEmptyScreen ? "visible" : "invisible")}
//           />
//         )}
//       </form>
//     </div>
//   )
// }



// // 'use client'

// // import { Model } from '@/lib/types/models'
// // import { cn } from '@/lib/utils'
// // import { Message } from 'ai'
// // import { ArrowUp, ChevronDown, MessageCirclePlus, Square } from 'lucide-react'
// // import { useRouter } from 'next/navigation'
// // import { useEffect, useRef, useState } from 'react'
// // import Textarea from 'react-textarea-autosize'
// // import { useArtifact } from './artifact/artifact-context'
// // import { EmptyScreen } from './empty-screen'
// // import { ModelSelector } from './model-selector'
// // import { SearchModeToggle } from './search-mode-toggle'
// // import { Button } from './ui/button'
// // import { IconLogo } from './ui/icons'

// // interface ChatPanelProps {
// //   input: string
// //   handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
// //   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
// //   isLoading: boolean
// //   messages: Message[]
// //   setMessages: (messages: Message[]) => void
// //   query?: string
// //   stop: () => void
// //   append: (message: any) => void
// //   models?: Model[]
// //   /** Whether to show the scroll to bottom button */
// //   showScrollToBottomButton: boolean
// //   /** Reference to the scroll container */
// //   scrollContainerRef: React.RefObject<HTMLDivElement>
// // }

// // export function ChatPanel({
// //   input,
// //   handleInputChange,
// //   handleSubmit,
// //   isLoading,
// //   messages,
// //   setMessages,
// //   query,
// //   stop,
// //   append,
// //   models,
// //   showScrollToBottomButton,
// //   scrollContainerRef
// // }: ChatPanelProps) {
// //   const [showEmptyScreen, setShowEmptyScreen] = useState(false)
// //   const router = useRouter()
// //   const inputRef = useRef<HTMLTextAreaElement>(null)
// //   const isFirstRender = useRef(true)
// //   const [isComposing, setIsComposing] = useState(false) // Composition state
// //   const [enterDisabled, setEnterDisabled] = useState(false) // Disable Enter after composition ends
// //   const { close: closeArtifact } = useArtifact()

// //   const handleCompositionStart = () => setIsComposing(true)

// //   const handleCompositionEnd = () => {
// //     setIsComposing(false)
// //     setEnterDisabled(true)
// //     setTimeout(() => {
// //       setEnterDisabled(false)
// //     }, 300)
// //   }

// //   const handleNewChat = () => {
// //     setMessages([])
// //     closeArtifact()
// //     router.push('/')
// //   }

// //   const isToolInvocationInProgress = () => {
// //     if (!messages.length) return false

// //     const lastMessage = messages[messages.length - 1]
// //     if (lastMessage.role !== 'assistant' || !lastMessage.parts) return false

// //     const parts = lastMessage.parts
// //     const lastPart = parts[parts.length - 1]

// //     return (
// //       lastPart?.type === 'tool-invocation' &&
// //       lastPart?.toolInvocation?.state === 'call'
// //     )
// //   }

// //   // if query is not empty, submit the query
// //   useEffect(() => {
// //     if (isFirstRender.current && query && query.trim().length > 0) {
// //       append({
// //         role: 'user',
// //         content: query
// //       })
// //       isFirstRender.current = false
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [query])

// //   // Scroll to the bottom of the container
// //   const handleScrollToBottom = () => {
// //     const scrollContainer = scrollContainerRef.current
// //     if (scrollContainer) {
// //       scrollContainer.scrollTo({
// //         top: scrollContainer.scrollHeight,
// //         behavior: 'smooth'
// //       })
// //     }
// //   }

// //   return (
// //     <div
// //       className={cn(
// //         'w-full bg-background group/form-container shrink-0',
// //         messages.length > 0 ? 'sticky bottom-0 px-2 pb-4' : 'px-6'
// //       )}
// //     >
// //       {messages.length === 0 && (
// //         <div className="mb-10 flex flex-col items-center gap-4">
// //           <IconLogo className="size-12 text-muted-foreground" />
// //           <p className="text-center text-3xl font-semibold">
// //             How can I help you today?
// //           </p>
// //         </div>
// //       )}
// //       <form
// //         onSubmit={handleSubmit}
// //         className={cn('max-w-3xl w-full mx-auto relative')}
// //       >
// //         {/* Scroll to bottom button - only shown when showScrollToBottomButton is true */}
// //         {showScrollToBottomButton && messages.length > 0 && (
// //           <Button
// //             type="button"
// //             variant="outline"
// //             size="icon"
// //             className="absolute -top-10 right-4 z-20 size-8 rounded-full shadow-md"
// //             onClick={handleScrollToBottom}
// //             title="Scroll to bottom"
// //           >
// //             <ChevronDown size={16} />
// //           </Button>
// //         )}

// //         <div className="relative flex flex-col w-full gap-2 bg-muted rounded-3xl border border-input">
// //           <Textarea
// //             ref={inputRef}
// //             name="input"
// //             rows={2}
// //             maxRows={5}
// //             tabIndex={0}
// //             onCompositionStart={handleCompositionStart}
// //             onCompositionEnd={handleCompositionEnd}
// //             placeholder="Ask a question..."
// //             spellCheck={false}
// //             value={input}
// //             disabled={isLoading || isToolInvocationInProgress()}
// //             className="resize-none w-full min-h-12 bg-transparent border-0 p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
// //             onChange={e => {
// //               handleInputChange(e)
// //               setShowEmptyScreen(e.target.value.length === 0)
// //             }}
// //             onKeyDown={e => {
// //               if (
// //                 e.key === 'Enter' &&
// //                 !e.shiftKey &&
// //                 !isComposing &&
// //                 !enterDisabled
// //               ) {
// //                 if (input.trim().length === 0) {
// //                   e.preventDefault()
// //                   return
// //                 }
// //                 e.preventDefault()
// //                 const textarea = e.target as HTMLTextAreaElement
// //                 textarea.form?.requestSubmit()
// //               }
// //             }}
// //             onFocus={() => setShowEmptyScreen(true)}
// //             onBlur={() => setShowEmptyScreen(false)}
// //           />

// //           {/* Bottom menu area */}
// //           <div className="flex items-center justify-between p-3">
// //             <div className="flex items-center gap-2">
// //               <ModelSelector models={models || []} />
// //               <SearchModeToggle />
// //             </div>
// //             <div className="flex items-center gap-2">
// //               {messages.length > 0 && (
// //                 <Button
// //                   variant="outline"
// //                   size="icon"
// //                   onClick={handleNewChat}
// //                   className="shrink-0 rounded-full group"
// //                   type="button"
// //                   disabled={isLoading || isToolInvocationInProgress()}
// //                 >
// //                   <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-all" />
// //                 </Button>
// //               )}
// //               <Button
// //                 type={isLoading ? 'button' : 'submit'}
// //                 size={'icon'}
// //                 variant={'outline'}
// //                 className={cn(isLoading && 'animate-pulse', 'rounded-full')}
// //                 disabled={
// //                   (input.length === 0 && !isLoading) ||
// //                   isToolInvocationInProgress()
// //                 }
// //                 onClick={isLoading ? stop : undefined}
// //               >
// //                 {isLoading ? <Square size={20} /> : <ArrowUp size={20} />}
// //               </Button>
// //             </div>
// //           </div>
// //         </div>

// //         {messages.length === 0 && (
// //           <EmptyScreen
// //             submitMessage={message => {
// //               handleInputChange({
// //                 target: { value: message }
// //               } as React.ChangeEvent<HTMLTextAreaElement>)
// //             }}
// //             className={cn(showEmptyScreen ? 'visible' : 'invisible')}
// //           />
// //         )}
// //       </form>
// //     </div>
// //   )
// // }
