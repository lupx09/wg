'use client'

import { cn } from '@/lib/utils'
import { ChatRequestOptions, Message } from 'ai'
import { useState } from 'react'
import { RenderMessage } from './render-message'
import { Spinner } from './ui/spinner'

interface ChatSection {
  id: string
  userMessage: Message
  assistantMessages: Message[]
}

interface ChatMessagesProps {
  sections: ChatSection[]
  onQuerySelect: (query: string) => void
  isLoading: boolean
  chatId?: string
  /** Ref for the scroll container */
  scrollContainerRef: React.RefObject<HTMLDivElement>
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
  reload?: (
    messageId: string,
    options?: ChatRequestOptions
  ) => Promise<string | null | undefined>
}

export function ChatMessages({
  sections,
  onQuerySelect,
  isLoading,
  chatId,
  scrollContainerRef,
  onUpdateMessage,
  reload
}: ChatMessagesProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  if (!sections.length) return null

  const allMessages = sections.flatMap(section => [
    section.userMessage,
    ...section.assistantMessages
  ])

  const lastUserIndex =
    allMessages.length -
    1 -
    [...allMessages].reverse().findIndex(msg => msg.role === 'user')

  const showLoading =
    isLoading &&
    sections.length > 0 &&
    sections[sections.length - 1].assistantMessages.length === 0

  const getIsOpen = (id: string) => {
    const baseId = id.endsWith('-related') ? id.slice(0, -8) : id
    const index = allMessages.findIndex(msg => msg.id === baseId)
    return openStates[id] ?? index >= lastUserIndex
  }

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenStates(prev => ({
      ...prev,
      [id]: open
    }))
  }

  return (
    <div
      id="scroll-container"
      ref={scrollContainerRef}
      role="list"
      aria-roledescription="chat messages"
      className={cn(
        'relative size-full pt-14',
        sections.length > 0 ? 'flex-1 overflow-y-auto' : ''
      )}
    >
      <div className="relative mx-auto w-full max-w-3xl px-4">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="chat-section mb-8"
            style={
              sectionIndex === sections.length - 1
                ? { minHeight: 'calc(-228px + 100dvh)' }
                : {}
            }
          >
            <div className="flex flex-col gap-4 mb-4">
              <RenderMessage
                message={section.userMessage}
                messageId={section.userMessage.id}
                getIsOpen={getIsOpen}
                onOpenChange={handleOpenChange}
                onQuerySelect={onQuerySelect}
                chatId={chatId}
                onUpdateMessage={onUpdateMessage}
                reload={reload}
              />
              {showLoading && <Spinner />}
            </div>

            {section.assistantMessages.map(assistantMessage => (
              <div key={assistantMessage.id} className="flex flex-col gap-4">
                <RenderMessage
                  message={assistantMessage}
                  messageId={assistantMessage.id}
                  getIsOpen={getIsOpen}
                  onOpenChange={handleOpenChange}
                  onQuerySelect={onQuerySelect}
                  chatId={chatId}
                  onUpdateMessage={onUpdateMessage}
                  reload={reload}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}


// 'use client'

// import { cn } from '@/lib/utils'
// import { ChatRequestOptions, Message } from 'ai'
// import { useState } from 'react'
// import { RenderMessage } from './render-message'
// import { Spinner } from './ui/spinner'

// interface ChatSection {
//   id: string
//   userMessage: Message
//   assistantMessages: Message[]
// }

// interface ChatMessagesProps {
//   sections: ChatSection[]
//   onQuerySelect: (query: string) => void
//   isLoading: boolean
//   chatId?: string
//   /** Ref for the scroll container */
//   scrollContainerRef: React.RefObject<HTMLDivElement>
//   onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
//   reload?: (
//     messageId: string,
//     options?: ChatRequestOptions
//   ) => Promise<string | null | undefined>
// }

// export function ChatMessages({
//   sections,
//   onQuerySelect,
//   isLoading,
//   chatId,
//   scrollContainerRef,
//   onUpdateMessage,
//   reload
// }: ChatMessagesProps) {
//   const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

//   if (!sections.length) return null

//   const allMessages = sections.flatMap(section => [
//     section.userMessage,
//     ...section.assistantMessages
//   ])

//   const lastUserIndex =
//     allMessages.length -
//     1 -
//     [...allMessages].reverse().findIndex(msg => msg.role === 'user')

//   const showLoading =
//     isLoading &&
//     sections.length > 0 &&
//     sections[sections.length - 1].assistantMessages.length === 0

//   const getIsOpen = (id: string) => {
//     const baseId = id.endsWith('-related') ? id.slice(0, -8) : id
//     const index = allMessages.findIndex(msg => msg.id === baseId)
//     return openStates[id] ?? index >= lastUserIndex
//   }

//   const handleOpenChange = (id: string, open: boolean) => {
//     setOpenStates(prev => ({
//       ...prev,
//       [id]: open
//     }))
//   }

//   return (
//     <div
//       id="scroll-container"
//       ref={scrollContainerRef}
//       role="list"
//       aria-roledescription="chat messages"
//       className={cn(
//         'relative size-full pt-14',
//         sections.length > 0 ? 'flex-1 overflow-y-auto' : ''
//       )}
//     >
//       <div className="relative mx-auto w-full max-w-3xl px-4">
//         {sections.map((section, sectionIndex) => (
//           <div
//             key={section.id}
//             id={`section-${section.id}`}
//             className="chat-section mb-8"
//             style={
//               sectionIndex === sections.length - 1
//                 ? { minHeight: 'calc(-228px + 100dvh)' }
//                 : {}
//             }
//           >
//             <div className="flex flex-col gap-4 mb-4">
//               <RenderMessage
//                 message={section.userMessage}
//                 messageId={section.userMessage.id}
//                 getIsOpen={getIsOpen}
//                 onOpenChange={handleOpenChange}
//                 onQuerySelect={onQuerySelect}
//                 chatId={chatId}
//                 onUpdateMessage={onUpdateMessage}
//                 reload={reload}
//               />
//               {showLoading && <Spinner />}
//             </div>

//             {section.assistantMessages.map(assistantMessage => (
//               <div key={assistantMessage.id} className="flex flex-col gap-4">
//                 <RenderMessage
//                   message={assistantMessage}
//                   messageId={assistantMessage.id}
//                   getIsOpen={getIsOpen}
//                   onOpenChange={handleOpenChange}
//                   onQuerySelect={onQuerySelect}
//                   chatId={chatId}
//                   onUpdateMessage={onUpdateMessage}
//                   reload={reload}
//                 />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
//     >
//       <div className="relative mx-auto w-full max-w-3xl px-4">
//         {sections.map((section, sectionIndex) => (
//           <div
//             key={section.id}
//             id={`section-${section.id}`}
//             className="chat-section mb-8"
//             style={
//               sectionIndex === sections.length - 1
//                 ? { minHeight: 'calc(-228px + 100dvh)' }
//                 : {}
//             }
//           >
//             {/* User message */}
//             <div className="flex flex-col gap-4 mb-4">
//               <RenderMessage
//                 message={section.userMessage}
//                 messageId={section.userMessage.id}
//                 getIsOpen={getIsOpen}
//                 onOpenChange={handleOpenChange}
//                 onQuerySelect={onQuerySelect}
//                 chatId={chatId}
//                 addToolResult={addToolResult}
//                 onUpdateMessage={onUpdateMessage}
//                 reload={reload}
//               />
//               {showLoading && <Spinner />}
//             </div>

//             {/* Assistant messages */}
//             {section.assistantMessages.map(assistantMessage => (
//               <div key={assistantMessage.id} className="flex flex-col gap-4">
//                 <RenderMessage
//                   message={assistantMessage}
//                   messageId={assistantMessage.id}
//                   getIsOpen={getIsOpen}
//                   onOpenChange={handleOpenChange}
//                   onQuerySelect={onQuerySelect}
//                   chatId={chatId}
//                   addToolResult={addToolResult}
//                   onUpdateMessage={onUpdateMessage}
//                   reload={reload}
//                 />
//               </div>
//             ))}
//           </div>
//         ))}

//         {showLoading && lastToolData && (
//           <ToolSection
//             key={manualToolCallId}
//             tool={lastToolData}
//             isOpen={getIsOpen(manualToolCallId)}
//             onOpenChange={open => handleOpenChange(manualToolCallId, open)}
//             addToolResult={addToolResult}
//           />
//         )}
//       </div>
//     </div>
//   )
// }
