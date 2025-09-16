"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react"

const subjectData = [
  {
    subject: "Biology",
    totalTime: 8.5,
    documentsStudied: 4,
    flashcardsMastered: 45,
    averageScore: 92,
    progress: 85,
    trend: "up",
    color: "bg-green-500",
  },
  {
    subject: "Mathematics",
    totalTime: 6.2,
    documentsStudied: 3,
    flashcardsMastered: 38,
    averageScore: 78,
    progress: 72,
    trend: "up",
    color: "bg-blue-500",
  },
  {
    subject: "History",
    totalTime: 5.8,
    documentsStudied: 2,
    flashcardsMastered: 28,
    averageScore: 88,
    progress: 65,
    trend: "down",
    color: "bg-purple-500",
  },
  {
    subject: "Chemistry",
    totalTime: 4.0,
    documentsStudied: 3,
    flashcardsMastered: 45,
    averageScore: 82,
    progress: 58,
    trend: "up",
    color: "bg-orange-500",
  },
]

export function SubjectProgress() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjectData.map((subject) => (
          <Card key={subject.subject}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${subject.color} mr-2`} />
                  {subject.subject}
                </CardTitle>
                <Badge variant={subject.trend === "up" ? "default" : "secondary"}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${subject.trend === "down" ? "rotate-180" : ""}`} />
                  {subject.trend === "up" ? "Improving" : "Needs Focus"}
                </Badge>
              </div>
              <CardDescription>Overall progress and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mastery Progress</span>
                  <span>{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    Study Time
                  </div>
                  <div className="font-medium">{subject.totalTime}h</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Target className="w-3 h-3 mr-1" />
                    Avg Score
                  </div>
                  <div className="font-medium">{subject.averageScore}%</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Documents
                  </div>
                  <div className="font-medium">{subject.documentsStudied}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Target className="w-3 h-3 mr-1" />
                    Flashcards
                  </div>
                  <div className="font-medium">{subject.flashcardsMastered}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
