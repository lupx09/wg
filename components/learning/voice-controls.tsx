"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Volume2 } from "lucide-react"

interface Props {
  isVoiceMode: boolean
  onToggleVoice: () => void
  accessToken: string
}

export function VoiceControls({ isVoiceMode, onToggleVoice, accessToken }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Recording error:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch("/api/ai/speech-to-text", {
        method: "POST",
        body: formData,
      })

      const { text } = await response.json()
      // Handle the transcribed text
      console.log("Transcribed:", text)
    } catch (error) {
      console.error("Speech processing error:", error)
    }
  }

  const speakText = async (text: string) => {
    try {
      setIsPlaying(true)
      const response = await fetch("/api/ai/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const audioBuffer = await response.arrayBuffer()
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })
      const audioUrl = URL.createObjectURL(audioBlob)

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error("TTS error:", error)
      setIsPlaying(false)
    }
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Voice Controls</h3>

      <div className="space-y-2">
        <Button onClick={onToggleVoice} variant={isVoiceMode ? "default" : "outline"} className="w-full">
          {isVoiceMode ? "Voice Mode On" : "Voice Mode Off"}
        </Button>

        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "outline"}
          className="w-full"
          disabled={!isVoiceMode}
        >
          {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>

        <Button
          onClick={() => speakText("This is a test of text to speech")}
          variant="outline"
          className="w-full"
          disabled={isPlaying}
        >
          <Volume2 className="w-4 h-4 mr-2" />
          {isPlaying ? "Playing..." : "Test TTS"}
        </Button>
      </div>
    </Card>
  )
}
