"use client"

import { Mic, MicOff } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface AudioModeToggleProps {
  className?: string
}

export function AudioModeToggle({ className }: AudioModeToggleProps) {
  const [isAudioMode, setIsAudioMode] = useState(false)

  const toggleAudioMode = () => {
    setIsAudioMode(!isAudioMode)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleAudioMode}
      className={cn(
        "h-7 px-2 text-xs font-medium rounded-full transition-all duration-200",
        isAudioMode
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className,
      )}
      type="button"
    >
      {isAudioMode ? <Mic className="w-3 h-3 mr-1.5" /> : <MicOff className="w-3 h-3 mr-1.5" />}
      <span className="hidden xs:inline">Audio</span>
      <span className="xs:hidden">Audio</span>
    </Button>
  )
}
