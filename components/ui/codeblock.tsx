// "use client"

// import { Button } from "@/components/ui/button"
// import { Check, Copy } from "lucide-react"
// import { useState } from "react"

// interface CodeBlockProps {
//   language?: string
//   value: string
// }

// export function CodeBlock({ language, value }: CodeBlockProps) {
//   const [copied, setCopied] = useState(false)

//   const copyToClipboard = async () => {
//     await navigator.clipboard.writeText(value)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   return (
//     <div className="relative">
//       <div className="flex items-center justify-between rounded-t-lg bg-muted px-4 py-2">
//         <span className="text-sm font-medium text-muted-foreground">{language || "code"}</span>
//         <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 w-6 p-0">
//           {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
//         </Button>
//       </div>
//       <pre className="overflow-x-auto rounded-b-lg bg-muted p-4">
//         <code className="text-sm">{value}</code>
//       </pre>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  language: string
  value: string
  className?: string
}

export function CodeBlock({ language, value, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className={cn("relative group", className)}>
      <div className="flex items-center justify-between rounded-t-lg bg-muted px-4 py-2 text-sm">
        <span className="text-muted-foreground">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-b-lg bg-muted/50 p-4">
        <code className={cn("text-sm", `language-${language}`)}>{value}</code>
      </pre>
    </div>
  )
}
