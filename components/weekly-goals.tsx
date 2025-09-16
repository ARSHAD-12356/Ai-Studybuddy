"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Target, BookOpen } from "lucide-react"

const weeklyGoals = [
  {
    id: "1",
    title: "Study 25 hours",
    description: "Complete your weekly study time goal",
    current: 24.5,
    target: 25,
    unit: "hours",
    icon: Clock,
    completed: false,
  },
  {
    id: "2",
    title: "Master 50 flashcards",
    description: "Review and master flashcards across all subjects",
    current: 50,
    target: 50,
    unit: "cards",
    icon: Target,
    completed: true,
  },
  {
    id: "3",
    title: "Upload 3 documents",
    description: "Add new study materials to your library",
    current: 2,
    target: 3,
    unit: "documents",
    icon: BookOpen,
    completed: false,
  },
  {
    id: "4",
    title: "Take 5 quizzes",
    description: "Test your knowledge with practice quizzes",
    current: 8,
    target: 5,
    unit: "quizzes",
    icon: CheckCircle,
    completed: true,
  },
]

export function WeeklyGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
        <CardDescription>Track your progress towards this week's learning objectives</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyGoals.map((goal) => {
            const progressPercentage = Math.min((goal.current / goal.target) * 100, 100)
            const Icon = goal.icon

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${goal.completed ? "bg-green-100 text-green-600" : "bg-muted"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {goal.current}/{goal.target} {goal.unit}
                    </div>
                    {goal.completed && <CheckCircle className="w-4 h-4 text-green-500 ml-auto mt-1" />}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
