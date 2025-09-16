"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle, X, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Flashcard {
  id: string
  front: string
  back: string
  options?: string[]
  correctAnswer?: number
  difficulty: "Easy" | "Medium" | "Hard"
  mastered: boolean
}

interface FlashcardSet {
  id: string
  title: string
  cardCount: number
  masteredCount: number
}

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    front: "What is photosynthesis?",
    back: "Photosynthesis is the process by which plants convert light energy, carbon dioxide, and water into glucose and oxygen. It occurs in the chloroplasts and involves two main stages: the light reactions and the Calvin cycle.",
    options: [
      "The process of breaking down glucose for energy",
      "The process by which plants convert light energy into glucose and oxygen",
      "The process of water absorption by plant roots",
      "The process of carbon dioxide release by plants",
    ],
    correctAnswer: 1,
    difficulty: "Medium",
    mastered: true,
  },
  {
    id: "2",
    front: "What is the chemical equation for photosynthesis?",
    back: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nThis shows that six molecules of carbon dioxide and six molecules of water, in the presence of light energy, produce one molecule of glucose and six molecules of oxygen.",
    options: [
      "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy",
      "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
      "CO₂ + H₂O → CH₂O + O₂",
      "6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O",
    ],
    correctAnswer: 1,
    difficulty: "Easy",
    mastered: true,
  },
  {
    id: "3",
    front: "Where do the light reactions of photosynthesis occur?",
    back: "The light reactions occur in the thylakoid membranes of the chloroplasts. Here, chlorophyll and other pigments absorb light energy and convert it into chemical energy in the form of ATP and NADPH.",
    options: [
      "In the stroma of chloroplasts",
      "In the thylakoid membranes of chloroplasts",
      "In the nucleus of plant cells",
      "In the mitochondria",
    ],
    correctAnswer: 1,
    difficulty: "Medium",
    mastered: false,
  },
  {
    id: "4",
    front: "What is the Calvin cycle and where does it take place?",
    back: "The Calvin cycle is the second stage of photosynthesis where CO₂ is converted into glucose. It takes place in the stroma of the chloroplasts and uses the ATP and NADPH produced in the light reactions.",
    options: [
      "Light-dependent reactions in thylakoids",
      "CO₂ fixation process in the stroma",
      "Oxygen production in chloroplasts",
      "Water splitting in photosystem II",
    ],
    correctAnswer: 1,
    difficulty: "Hard",
    mastered: false,
  },
]

interface FlashcardViewerProps {
  flashcardSet: FlashcardSet
  onBack: () => void
}

export function FlashcardViewer({ flashcardSet, onBack }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const currentCard = mockFlashcards[currentIndex]
  const progress = ((currentIndex + 1) / mockFlashcards.length) * 100

  const nextCard = () => {
    if (currentIndex < mockFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setShowAnswer(false)
      setSelectedOption(null)
      setShowResult(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
      setShowAnswer(false)
      setSelectedOption(null)
      setShowResult(false)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    setShowAnswer(!showAnswer)
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    setShowResult(true)
    setTimeout(() => {
      setShowAnswer(true)
    }, 1000)
  }

  const markAsKnown = () => {
    nextCard()
  }

  const markAsUnknown = () => {
    nextCard()
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

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Sets
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{flashcardSet.title}</h1>
          <p className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {mockFlashcards.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getDifficultyColor(currentCard.difficulty)}>{currentCard.difficulty}</Badge>
          {currentCard.mastered && <CheckCircle className="w-5 h-5 text-green-500" />}
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

      {/* Flashcard */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Card className="min-h-[400px] transition-all duration-300">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              {!showAnswer ? (
                <div className="space-y-6 w-full">
                  <div className="flex items-center justify-center mb-4">
                    <Eye className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Question</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-balance">{currentCard.front}</h2>

                  {currentCard.options && (
                    <div className="space-y-3 w-full max-w-lg">
                      {currentCard.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className={cn(
                            "w-full text-left justify-start p-4 h-auto whitespace-normal",
                            selectedOption === index &&
                              showResult &&
                              index === currentCard.correctAnswer &&
                              "bg-green-100 border-green-500 text-green-800",
                            selectedOption === index &&
                              showResult &&
                              index !== currentCard.correctAnswer &&
                              "bg-red-100 border-red-500 text-red-800",
                            showResult &&
                              index === currentCard.correctAnswer &&
                              "bg-green-100 border-green-500 text-green-800",
                          )}
                          onClick={() => !showResult && handleOptionSelect(index)}
                          disabled={showResult}
                        >
                          <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {!currentCard.options && <p className="text-muted-foreground">Click to reveal answer</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <EyeOff className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Answer</span>
                  </div>
                  <div className="text-lg text-pretty whitespace-pre-wrap">{currentCard.back}</div>
                  <p className="text-muted-foreground">Click to flip back</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevCard} disabled={currentIndex === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {!currentCard.options && (
            <Button variant="outline" onClick={flipCard}>
              <RotateCw className="w-4 h-4 mr-2" />
              Flip Card
            </Button>
          )}
        </div>

        <Button variant="outline" onClick={nextCard} disabled={currentIndex === mockFlashcards.length - 1}>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Answer Feedback */}
      {(showAnswer || (showResult && currentCard.options)) && (
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            onClick={markAsUnknown}
          >
            <X className="w-4 h-4 mr-2" />
            Need More Practice
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={markAsKnown}>
            <CheckCircle className="w-4 h-4 mr-2" />I Know This
          </Button>
        </div>
      )}

      {/* Study Tips */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Study Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Try to answer before selecting an option</li>
            <li>• Mark cards honestly - it helps the AI optimize your learning</li>
            <li>• Review difficult cards more frequently</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
