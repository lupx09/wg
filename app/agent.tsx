// import { exposeEndpoints } from "@/lib/server-utils"
// import "server-only"
// import { GitHub, GithubLoading } from "@/components/prebuilt/github"
// // import { InvoiceLoading, Invoice } from "@/components/prebuilt/invoice"
// // import { CurrentWeatherLoading, CurrentWeather } from "@/components/prebuilt/weather"
// import { createStreamableUI, createStreamableValue } from "ai/rsc"
// import { AIMessage } from "@/ai/message"
// import type { JSX } from "react"

// const API_URL = "http://localhost:8000/chat"

// type ToolComponent = {
//   loading: (props?: any) => JSX.Element
//   final: (props?: any) => JSX.Element
// }

// type ToolComponentMap = {
//   [tool: string]: ToolComponent
// }

// const TOOL_COMPONENT_MAP: ToolComponentMap = {
//   "github-repo": {
//     loading: (props?: any) => <GithubLoading {...props} />,
//     final: (props?: any) => <GitHub {...props} />,
//   },
//   // "invoice-parser": {
//   //   loading: (props?: any) => <InvoiceLoading {...props} />,
//   //   final: (props?: any) => <Invoice {...props} />,
//   // },
//   // "weather-data": {
//   //   loading: (props?: any) => <CurrentWeatherLoading {...props} />,
//   //   final: (props?: any) => <CurrentWeather {...props} />,
//   // },
// }

// async function agent(inputs: {
//   input: string
//   chat_history: [role: string, content: string][]
//   file?: {
//     base64: string
//     extension: string
//   }
// }) {
//   "use server"
//   const ui = createStreamableUI()

//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         input: [
//           ...inputs.chat_history.map(([role, content]) => ({
//             type: role,
//             content,
//           })),
//           {
//             type: "human",
//             content: inputs.input,
//           },
//         ],
//         ...(inputs.file && { file: inputs.file }),
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const data = await response.json()

//     if (data.tool_calls && data.tool_calls.length > 0) {
//       const toolCall = data.tool_calls[0]
//       const toolComponent = TOOL_COMPONENT_MAP[toolCall.type]

//       if (toolComponent) {
//         // Append a loading component to the UI stream
//         ui.append(toolComponent.loading())

//         // Simulate tool execution result
//         // In a real-world app, this would involve a function that
//         // executes the tool and returns the result from the backend.
//         // Then, it should call ui.update() or ui.done() with the final component.
//         setTimeout(() => {
//           ui.done(toolComponent.final(data.tool_result || {}))
//         }, 1000)
//       }
//     } else {
//       // Regular text response
//       const textStream = createStreamableValue()
//       ui.append(<AIMessage value={textStream.value} />)
//       textStream.append(data.content || "Hello! I'm your AI assistant.")
//       textStream.done()
//     }
//   } catch (error) {
//     console.error("Error calling Python backend:", error)
//     const textStream = createStreamableValue()
//     ui.append(<AIMessage value={textStream.value} />)
//     textStream.append("Sorry, I'm having trouble connecting to the backend. Please try again.")
//     textStream.done()
//   }

//   // Ensure ui.done() is called to close the stream.
//   // This is a common error that can cause the stream to hang.
//   if (ui.isOpen) {
//     ui.done()
//   }

//   return { ui: ui.value, lastEvent: Promise.resolve({}) }
// }

// export const EndpointsContext = exposeEndpoints({ agent })



import { exposeEndpoints } from "@/lib/server-utils"
import "server-only"
import { GitHub, GithubLoading } from "@/components/prebuilt/github"
// import { InvoiceLoading, Invoice } from "@/components/prebuilt/invoice"
// import { CurrentWeatherLoading, CurrentWeather } from "@/components/prebuilt/weather"
import { createStreamableUI, createStreamableValue } from "@ai-sdk/rsc"
import { AIMessage } from "@/ai/message"
import type { JSX } from "react"

const API_URL = "http://localhost:8000/chat"

type ToolComponent = {
  loading: (props?: any) => JSX.Element
  final: (props?: any) => JSX.Element
}

type ToolComponentMap = {
  [tool: string]: ToolComponent
}

const TOOL_COMPONENT_MAP: ToolComponentMap = {
  "github-repo": {
    loading: (props?: any) => <GithubLoading {...props} />,
    final: (props?: any) => <GitHub {...props} />,
  },
  // "invoice-parser": {
  //   loading: (props?: any) => <InvoiceLoading {...props} />,
  //   final: (props?: any) => <Invoice {...props} />,
  // },
  // "weather-data": {
  //   loading: (props?: any) => <CurrentWeatherLoading {...props} />,
  //   final: (props?: any) => <CurrentWeather {...props} />,
  // },
}

async function agent(inputs: {
  input: string
  chat_history: [role: string, content: string][]
  file?: {
    base64: string
    extension: string
  }
}) {
  "use server"
  const ui = createStreamableUI()

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [
          ...inputs.chat_history.map(([role, content]) => ({
            type: role,
            content,
          })),
          {
            type: "human",
            content: inputs.input,
          },
        ],
        ...(inputs.file && { file: inputs.file }),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.tool_calls && data.tool_calls.length > 0) {
      const toolCall = data.tool_calls[0]
      const toolComponent = TOOL_COMPONENT_MAP[toolCall.type]

      if (toolComponent) {
        // Append a loading component to the UI stream
        ui.append(toolComponent.loading())

        // Simulate tool execution result
        // In a real-world app, this would involve a function that
        // executes the tool and returns the result from the backend.
        // Then, it should call ui.update() or ui.done() with the final component.
        setTimeout(() => {
          ui.done(toolComponent.final(data.tool_result || {}))
        }, 1000)
      }
    } else {
      // Regular text response
      const textStream = createStreamableValue()
      ui.append(<AIMessage value={textStream.value} />)
      textStream.append(data.content || "Hello! I'm your AI assistant.")
      textStream.done()
    }
  } catch (error) {
    console.error("Error calling Python backend:", error)
    const textStream = createStreamableValue()
    ui.append(<AIMessage value={textStream.value} />)
    textStream.append("Sorry, I'm having trouble connecting to the backend. Please try again.")
    textStream.done()
  }

  // The ui.done() call is already handled in the appropriate branches above
  // No need for additional ui.done() call here since each branch handles it properly

  return { ui: ui.value, lastEvent: Promise.resolve({}) }
}

export const EndpointsContext = exposeEndpoints({ agent })
