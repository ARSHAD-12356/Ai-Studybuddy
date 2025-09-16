"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Calendar } from "lucide-react"

const streakData = [
  { date: "2024-01-15", studied: true },
  { date: "2024-01-16", studied: true },
  { date: "2024-01-17", studied: true },
  { date: "2024-01-18", studied: true },
  { date: "2024-01-19", studied: true },
  { date: "2024-01-20", studied: true },
  { date: "2024-01-21", studied: true },
  { date: "2024-01-22", studied: false },
  { date: "2024-01-23", studied: false },
  { date: "2024-01-24", studied: false },
  { date: "2024-01-25", studied: false },
  { date: "2024-01-26", studied: false },
  { date: "2024-01-27", studied: false },
  { date: "2024-01-28", studied: false },
]

export function StudyStreak() {
  const currentStreak = 7
  const longestStreak = 12

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          Study Streak
        </CardTitle>
        <CardDescription>Keep your learning momentum going!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-orange-500">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current streak</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold">{longestStreak}</div>
            <div className="text-sm text-muted-foreground">Personal best</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Last 14 days</span>
            <Badge variant="outline">
              <Calendar className="w-3 h-3 mr-1" />
              {streakData.filter((day) => day.studied).length}/14 days
            </Badge>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {streakData.map((day, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-sm ${day.studied ? "bg-orange-500" : "bg-muted"} transition-colors`}
                title={day.date}
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">Study for just 15 minutes today to keep your streak alive!</div>
      </CardContent>
    </Card>
  )
}
