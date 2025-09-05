"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Play, RotateCcw, Zap, Target, Star } from "lucide-react"

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
  const [gameState, setGameState] = useState<"waiting" | "playing" | "result">("waiting")
  const [currentWord, setCurrentWord] = useState<(typeof WORDS)[0] | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [userGuess, setUserGuess] = useState("")
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [streak, setStreak] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp()
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
    setGameState("playing")
    setTimeLeft(15)
    setUserGuess("")
    setShowAnswer(false)
    setIsCorrect(null)
    setRound((prev) => prev + 1)
  }

  const handleTimeUp = () => {
    if (userGuess.trim()) {
      checkAnswer()
    } else {
      setIsCorrect(false)
      setStreak(0)
    }
    setShowAnswer(true)
    setGameState("result")
  }

  const checkAnswer = () => {
    if (!currentWord || !userGuess.trim()) {
      setIsCorrect(false)
      setStreak(0)
      return
    }

    const correct =
      userGuess.toLowerCase().includes(currentWord.meaning.toLowerCase().split(" ")[0]) ||
      currentWord.meaning.toLowerCase().includes(userGuess.toLowerCase()) ||
      userGuess
        .toLowerCase()
        .split(" ")
        .some((word) => currentWord.meaning.toLowerCase().includes(word) && word.length > 3)

    setIsCorrect(correct)

    if (correct) {
      const points = timeLeft > 10 ? 15 : timeLeft > 5 ? 10 : 5
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }
  }

  const submitGuess = () => {
    if (!currentWord || !userGuess.trim()) return
    checkAnswer()
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
    setStreak(0)
    setCurrentWord(null)
  }

  const getTimerColor = () => {
    if (timeLeft > 10) return "text-primary"
    if (timeLeft > 5) return "text-yellow-500"
    return "text-destructive"
  }

  const getTimerSize = () => {
    if (timeLeft <= 3) return "text-8xl animate-pulse"
    if (timeLeft <= 5) return "text-7xl"
    return "text-6xl"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-accent/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-secondary/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-6 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WordWise
            </h1>
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center animate-pulse-glow">
              <Target className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground text-xl font-medium">Guess the meaning while time ticks!</p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="default" className="px-6 py-3 text-lg font-bold bg-primary hover:bg-primary/90">
              <Trophy className="w-5 h-5 mr-2" />
              {score} pts
            </Badge>
            <Badge variant="secondary" className="px-6 py-3 text-lg font-bold">
              Round {round}
            </Badge>
            {streak > 0 && (
              <Badge
                variant="outline"
                className="px-6 py-3 text-lg font-bold border-accent text-accent animate-bounce-in"
              >
                <Star className="w-4 h-4 mr-2" />
                {streak} streak!
              </Badge>
            )}
          </div>
        </div>

        <Card className="border-4 border-primary/20 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {gameState === "waiting" && (
              <div className="text-center space-y-8 animate-bounce-in">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Ready for the Challenge?</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    You'll see a word and have <span className="font-bold text-primary">15 seconds</span> to type its
                    meaning!
                    <br />
                    <span className="text-sm">💡 Type while the timer counts down for bonus points!</span>
                  </p>
                </div>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="px-12 py-6 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Playing!
                </Button>
              </div>
            )}

            {gameState === "playing" && currentWord && (
              <div className="space-y-8 animate-bounce-in">
                <div className="text-center space-y-6">
                  <div
                    className={`${getTimerSize()} font-black ${getTimerColor()} transition-all duration-300 flex items-center justify-center gap-4`}
                  >
                    <Clock className={`${timeLeft <= 5 ? "w-16 h-16" : "w-12 h-12"} transition-all duration-300`} />
                    <span className={timeLeft <= 3 ? "animate-shake" : ""}>{timeLeft}</span>
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border-2 border-primary/20">
                    <h2 className="text-5xl font-black text-foreground tracking-wider mb-4 animate-pulse">
                      {currentWord.word}
                    </h2>
                    <p className="text-accent font-semibold text-lg">What does this word mean?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Type the meaning here... (keep typing!)"
                    className="text-lg p-6 text-center border-2 border-primary/30 focus:border-primary bg-white/90 backdrop-blur-sm font-medium"
                    onKeyPress={(e) => e.key === "Enter" && submitGuess()}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={submitGuess}
                      className="flex-1 py-4 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-200"
                      disabled={!userGuess.trim()}
                    >
                      Submit Now! (+{timeLeft > 10 ? 15 : timeLeft > 5 ? 10 : 5} pts)
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    💡 Submit early for bonus points or wait for time to run out!
                  </p>
                </div>
              </div>
            )}

            {gameState === "result" && currentWord && (
              <div className="space-y-6 animate-bounce-in">
                <div className="text-center space-y-6">
                  <div className={`text-6xl mb-4 ${isCorrect ? "animate-bounce" : "animate-shake"}`}>
                    {isCorrect ? "🎉" : "😅"}
                  </div>

                  <h2 className="text-4xl font-bold text-foreground">{currentWord.word}</h2>

                  <div
                    className={`p-6 rounded-2xl border-2 ${isCorrect ? "bg-primary/10 border-primary/30" : "bg-muted border-border"}`}
                  >
                    <p className="text-lg font-semibold text-foreground mb-2">Correct meaning:</p>
                    <p className="text-muted-foreground text-lg leading-relaxed">{currentWord.meaning}</p>
                  </div>

                  {userGuess && (
                    <div className="p-4 bg-card rounded-xl border border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Your guess:</p>
                      <p className="text-foreground font-medium">"{userGuess}"</p>
                      <p className={`text-sm mt-2 font-bold ${isCorrect ? "text-primary" : "text-muted-foreground"}`}>
                        {isCorrect ? "✅ Great job!" : "❌ Keep trying!"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={nextRound}
                    className="flex-1 py-4 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-200"
                  >
                    Next Word →
                  </Button>
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="px-8 py-4 border-2 border-primary/30 hover:bg-primary/10 transform hover:scale-105 transition-all duration-200 bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-y-3 bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
          <div className="flex justify-center gap-8 text-sm font-medium">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full"></span>
              Early submit: +15 pts
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              Mid submit: +10 pts
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-destructive rounded-full"></span>
              Late submit: +5 pts
            </span>
          </div>
          <p className="text-xs text-muted-foreground">🔥 Build streaks for bonus badges!</p>
        </div>
      </div>
    </div>
  )
}
