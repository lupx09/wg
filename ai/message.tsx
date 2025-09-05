// "use client"

// import { AIMessageText } from "@/components/message"
// // import { type StreamableValue, useStreamableValue } from "ai/rsc"
// import { createStreamableUI, createStreamableValue } from "@ai-sdk/rsc"

// export function AIMessage(props: { value: StreamableValue<string> }) {
//   const [data] = useStreamableValue(props.value)

//   if (!data) {
//     return null
//   }
//   return <AIMessageText content={data} />
// }


"use client"

import { AIMessageText } from "@/components/message"
import { type StreamableValue, useStreamableValue } from "@ai-sdk/rsc"

export function AIMessage(props: { value: StreamableValue<string> }) {
  const [data] = useStreamableValue(props.value)

  if (!data) {
    return null
  }
  return <AIMessageText content={data} />
}
