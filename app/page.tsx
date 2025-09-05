"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Play, RotateCcw } from "lucide-react"

const WORDS = [
  { word: "SERENDIPITY", meaning: "The occurrence of events by chance in a happy way" },
  { word: "EPHEMERAL", meaning: "Lasting for a very short time" },
  { word: "UBIQUITOUS", meaning: "Present, appearing, or found everywhere" },
  { word: "MELLIFLUOUS", meaning: "Sweet or musical; pleasant to hear" },
  { word: "PERSPICACIOUS", meaning: "Having keen insight; mentally sharp" },
  { word: "SURREPTITIOUS", meaning: "Done secretly or stealthily" },
  { word: "MAGNANIMOUS", meaning: "Generous in forgiving; noble in spirit" },
  { word: "CACOPHONY", meaning: "A harsh, discordant mixture of sounds" },
  { word: "QUINTESSENTIAL", meaning: "Representing the most perfect example of a quality" },
  { word: "INEFFABLE", meaning: "Too great to be expressed in words" },
]

export default function WordGame() {
  const [gameState, setGameState] = useState<"waiting" | "showing" | "guessing" | "result">("waiting")
  const [currentWord, setCurrentWord] = useState<(typeof WORDS)[0] | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [userGuess, setUserGuess] = useState("")
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "showing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("guessing")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, timeLeft])

  const startGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setCurrentWord(randomWord)
    setGameState("showing")
    setTimeLeft(15)
    setUserGuess("")
    setShowAnswer(false)
    setRound((prev) => prev + 1)
  }

  const submitGuess = () => {
    if (!currentWord || !userGuess.trim()) return

    const isCorrect =
      userGuess.toLowerCase().includes(currentWord.meaning.toLowerCase().split(" ")[0]) ||
      currentWord.meaning.toLowerCase().includes(userGuess.toLowerCase())

    if (isCorrect) {
      setScore((prev) => prev + 10)
    }

    setShowAnswer(true)
    setGameState("result")
  }

  const nextRound = () => {
    startGame()
  }

  const resetGame = () => {
    setGameState("waiting")
    setScore(0)
    setRound(0)
    setCurrentWord(null)
  }

  const getTimerColor = () => {
    if (timeLeft > 10) return "text-accent"
    if (timeLeft > 5) return "text-yellow-500"
    return "text-destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">WordWise</h1>
          <p className="text-muted-foreground text-lg">Test your vocabulary knowledge!</p>

          {/* Score Display */}
          <div className="flex justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Trophy className="w-4 h-4 mr-2" />
              Score: {score}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              Round: {round}
            </Badge>
          </div>
        </div>

        {/* Game Area */}
        <Card className="border-2 border-border shadow-2xl">
          <CardContent className="p-8">
            {gameState === "waiting" && (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">Ready to Play?</h2>
                  <p className="text-muted-foreground">You'll see a word for 15 seconds. Then guess its meaning!</p>
                </div>
                <Button onClick={startGame} size="lg" className="px-8 py-4 text-lg font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </div>
            )}

            {gameState === "showing" && currentWord && (
              <div className="text-center space-y-8">
                <div className={`text-6xl font-black ${getTimerColor()} transition-colors duration-300`}>
                  <Clock className="w-12 h-12 mx-auto mb-4" />
                  {timeLeft}
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-foreground tracking-wider animate-pulse">
                    {currentWord.word}
                  </h2>
                  <p className="text-muted-foreground text-lg">Memorize this word! You'll need to guess its meaning.</p>
                </div>
              </div>
            )}

            {gameState === "guessing" && currentWord && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">What does this word mean?</h2>
                  <div className="text-4xl font-black text-muted-foreground tracking-wider">{currentWord.word}</div>
                </div>

                <div className="space-y-4">
                  <Input
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Type your guess here..."
                    className="text-lg p-4 text-center"
                    onKeyPress={(e) => e.key === "Enter" && submitGuess()}
                    autoFocus
                  />
                  <Button
                    onClick={submitGuess}
                    className="w-full py-4 text-lg font-semibold"
                    disabled={!userGuess.trim()}
                  >
                    Submit Guess
                  </Button>
                </div>
              </div>
            )}

            {gameState === "result" && currentWord && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">{currentWord.word}</h2>

                  {showAnswer && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-lg font-medium text-foreground">Correct meaning:</p>
                        <p className="text-muted-foreground mt-2">{currentWord.meaning}</p>
                      </div>

                      {userGuess && (
                        <div className="p-4 bg-card rounded-lg border">
                          <p className="text-sm font-medium text-muted-foreground">Your guess:</p>
                          <p className="text-foreground mt-1">"{userGuess}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button onClick={nextRound} className="flex-1 py-4 text-lg font-semibold">
                    Next Word
                  </Button>
                  <Button onClick={resetGame} variant="outline" className="px-6 py-4 bg-transparent">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>💡 Tip: Look for key words in the meaning that match your guess</p>
          <p>🎯 Score 10 points for each correct answer</p>
        </div>
      </div>
    </div>
  )
}
