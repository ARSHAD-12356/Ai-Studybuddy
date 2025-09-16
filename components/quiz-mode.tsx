"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Clock, Trophy, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface FlashcardSet {
  id: string
  title: string
  cardCount: number
}

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "What is the primary purpose of photosynthesis?",
    options: [
      "To produce oxygen for animals",
      "To convert light energy into chemical energy",
      "To break down glucose",
      "To absorb carbon dioxide",
    ],
    correctAnswer: 1,
    explanation:
      "The primary purpose of photosynthesis is to convert light energy into chemical energy (glucose) that plants can use for growth and metabolism.",
    difficulty: "Easy",
  },
  {
    id: "2",
    question: "In which part of the plant cell does photosynthesis occur?",
    options: ["Nucleus", "Mitochondria", "Chloroplasts", "Ribosomes"],
    correctAnswer: 2,
    explanation:
      "Photosynthesis occurs in the chloroplasts, which contain chlorophyll and other pigments necessary for capturing light energy.",
    difficulty: "Medium",
  },
  {
    id: "3",
    question: "What are the two main stages of photosynthesis?",
    options: [
      "Glycolysis and Krebs cycle",
      "Light reactions and Calvin cycle",
      "Transcription and translation",
      "Mitosis and meiosis",
    ],
    correctAnswer: 1,
    explanation:
      "The two main stages are the light reactions (which capture light energy) and the Calvin cycle (which uses that energy to produce glucose).",
    difficulty: "Hard",
  },
]

interface QuizModeProps {
  flashcardSet: FlashcardSet
  onBack: () => void
}

export function QuizMode({ flashcardSet, onBack }: QuizModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mockQuizQuestions.length).fill(null))
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const question = mockQuizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockQuizQuestions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1)
    }

    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers(new Array(mockQuizQuestions.length).fill(null))
    setQuizCompleted(false)
    setTimeElapsed(0)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (quizCompleted) {
    const scorePercentage = (score / mockQuizQuestions.length) * 100

    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Quiz Complete!</h1>
          <p className="text-muted-foreground">Great job on completing the {flashcardSet.title} quiz.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={cn("text-6xl font-bold", getScoreColor(scorePercentage))}>
                {score}/{mockQuizQuestions.length}
              </div>
              <p className="text-xl text-muted-foreground">{Math.round(scorePercentage)}% Correct</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{mockQuizQuestions.length - score}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{Math.round(timeElapsed / 60)}m</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={restartQuiz}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Sets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Sets
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{flashcardSet.title} Quiz</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {mockQuizQuestions.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-balance">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "w-full text-left justify-start h-auto p-4 text-wrap",
                  selectedAnswer === index && !showResult && "border-primary bg-primary/5",
                  showResult && index === question.correctAnswer && "border-green-500 bg-green-50 text-green-700",
                  showResult &&
                    selectedAnswer === index &&
                    index !== question.correctAnswer &&
                    "border-red-500 bg-red-50 text-red-700",
                )}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                      selectedAnswer === index && !showResult && "border-primary bg-primary text-primary-foreground",
                      showResult && index === question.correctAnswer && "border-green-500 bg-green-500 text-white",
                      showResult &&
                        selectedAnswer === index &&
                        index !== question.correctAnswer &&
                        "border-red-500 bg-red-500 text-white",
                    )}
                  >
                    {showResult && index === question.correctAnswer ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : showResult && selectedAnswer === index && index !== question.correctAnswer ? (
                      <X className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="text-pretty">{option}</span>
                </div>
              </Button>
            ))}
          </div>

          {showResult && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Explanation</h4>
                <p className="text-sm text-muted-foreground text-pretty">{question.explanation}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
            </div>
            <div>
              {!showResult ? (
                <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestion < mockQuizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
