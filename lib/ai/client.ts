export class AIClient {
  private accessToken: string
  private baseUrl: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
    this.baseUrl = process.env.FASTAPI_URL || ""
  }

  async callLLM(messages: any[], model = "default") {
    const response = await fetch(`${this.baseUrl}/api/llm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ messages, model }),
    })

    if (!response.ok) {
      throw new Error("LLM request failed")
    }

    return response.json()
  }

  async textToSpeech(text: string, voice = "default") {
    const response = await fetch(`${this.baseUrl}/api/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ text, voice }),
    })

    if (!response.ok) {
      throw new Error("TTS request failed")
    }

    return response.arrayBuffer()
  }

  async speechToText(audioBlob: Blob) {
    const formData = new FormData()
    formData.append("audio", audioBlob)

    const response = await fetch(`${this.baseUrl}/api/stt`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("STT request failed")
    }

    return response.json()
  }

  getModel(type: "llm" | "tts" | "stt") {
    // Return a model interface that works with AI SDK
    return {
      type,
      call: async (prompt: string) => {
        switch (type) {
          case "llm":
            return this.callLLM([{ role: "user", content: prompt }])
          case "tts":
            return this.textToSpeech(prompt)
          case "stt":
            // STT would need audio input, this is just for interface consistency
            throw new Error("STT requires audio input")
          default:
            throw new Error("Unknown model type")
        }
      },
    }
  }
}

export function createAIClient(accessToken: string) {
  return new AIClient(accessToken)
}
