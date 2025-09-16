"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FlashcardViewer } from "@/components/flashcard-viewer"
import { QuizMode } from "@/components/quiz-mode"
import { BookOpen, Brain, Target, Clock, Play, RotateCcw, CheckCircle } from "lucide-react"

interface FlashcardSet {
  id: string
  title: string
  description: string
  cardCount: number
  masteredCount: number
  difficulty: "Easy" | "Medium" | "Hard"
  subject: string
  lastStudied: string
  estimatedTime: string
}

const mockFlashcardSets: FlashcardSet[] = [
  {
    id: "1",
    title: "Biology Chapter 12 - Photosynthesis",
    description: "Key concepts and processes in photosynthesis",
    cardCount: 15,
    masteredCount: 12,
    difficulty: "Medium",
    subject: "Biology",
    lastStudied: "2 hours ago",
    estimatedTime: "8 min",
  },
  {
    id: "2",
    title: "Math Formulas - Quadratic Equations",
    description: "Essential formulas and problem-solving techniques",
    cardCount: 22,
    masteredCount: 8,
    difficulty: "Hard",
    subject: "Mathematics",
    lastStudied: "1 day ago",
    estimatedTime: "12 min",
  },
  {
    id: "3",
    title: "History - World War II Causes",
    description: "Major events and factors leading to WWII",
    cardCount: 8,
    masteredCount: 8,
    difficulty: "Easy",
    subject: "History",
    lastStudied: "3 days ago",
    estimatedTime: "5 min",
  },
  {
    id: "4",
    title: "Chemistry - Periodic Table",
    description: "Elements, properties, and periodic trends",
    cardCount: 30,
    masteredCount: 15,
    difficulty: "Medium",
    subject: "Chemistry",
    lastStudied: "1 week ago",
    estimatedTime: "15 min",
  },
]

export function FlashcardInterface() {
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
  const [studyMode, setStudyMode] = useState<"flashcards" | "quiz" | null>(null)

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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (selectedSet && studyMode) {
    if (studyMode === "flashcards") {
      return <FlashcardViewer flashcardSet={selectedSet} onBack={() => setSelectedSet(null)} />
    }
    if (studyMode === "quiz") {
      return <QuizMode flashcardSet={selectedSet} onBack={() => setSelectedSet(null)} />
    }
  }

  if (selectedSet) {
    const progressPercentage = (selectedSet.masteredCount / selectedSet.cardCount) * 100

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedSet(null)}>
            ← Back to Sets
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{selectedSet.title}</CardTitle>
                  <CardDescription className="text-base">{selectedSet.description}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(selectedSet.difficulty)}>{selectedSet.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedSet.cardCount}</div>
                  <div className="text-sm text-muted-foreground">Total Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedSet.masteredCount}</div>
                  <div className="text-sm text-muted-foreground">Mastered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedSet.cardCount - selectedSet.masteredCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedSet.estimatedTime}</div>
                  <div className="text-sm text-muted-foreground">Est. Time</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={() => setStudyMode("flashcards")}
                >
                  <BookOpen className="w-6 h-6" />
                  <span>Study Flashcards</span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={() => setStudyMode("quiz")}
                >
                  <Brain className="w-6 h-6" />
                  <span>Take Quiz</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Flashcards & Quizzes</h1>
        <p className="text-muted-foreground text-pretty">
          Study with AI-generated flashcards and test your knowledge with interactive quizzes.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sets</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFlashcardSets.length}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Mastered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockFlashcardSets.reduce((acc, set) => acc + set.masteredCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Personal best!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Studied</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Flashcard Sets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Flashcard Sets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFlashcardSets.map((set) => {
            const progressPercentage = (set.masteredCount / set.cardCount) * 100
            return (
              <Card key={set.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{set.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {set.subject}
                      </Badge>
                    </div>
                    <Badge className={getDifficultyColor(set.difficulty)}>{set.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{set.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {set.masteredCount}/{set.cardCount} cards
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last studied: {set.lastStudied}</span>
                    <span>{set.estimatedTime} remaining</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1" onClick={() => setSelectedSet(set)}>
                      <Play className="w-4 h-4 mr-2" />
                      Study
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
