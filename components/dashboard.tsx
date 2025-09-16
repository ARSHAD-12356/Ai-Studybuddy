"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, BookOpen, Trophy, Clock, Target, Zap, TrendingUp, Brain, Star, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"

export function Dashboard() {
  const router = useRouter()
  const { user, getFirstName } = useUser()

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}.${Math.round((remainingMinutes / 60) * 10)}h` : `${hours}h`
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-balance text-foreground">Welcome back, {getFirstName()}!</h1>
        <p className="text-muted-foreground text-pretty">
          Ready to continue your learning journey? Here's what's waiting for you today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Chat</CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-500 hover:bg-blue-600" size="sm" onClick={() => router.push("/chat")}>
              Start Learning
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full bg-green-50 hover:bg-green-100 text-green-700"
              size="sm"
              onClick={() => router.push("/flashcards")}
            >
              Study Flashcards
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full border-purple-200 hover:bg-purple-50 bg-transparent"
              size="sm"
              onClick={() => router.push("/progress")}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50 bg-transparent" size="sm">
              View Rewards
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Study Streak</CardTitle>
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {user?.stats.studyStreak || 0} days
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {user?.stats.studyStreak > 0 ? "🔥 Keep it up!" : "Start your streak!"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Flashcards Mastered
            </CardTitle>
            <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {user?.stats.flashcardsMastered || 0}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {user?.stats.flashcardsMastered > 0 ? "Great progress!" : "Start practicing!"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Study Time</CardTitle>
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatStudyTime(user?.stats.studyTime || 0)}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Total time</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Achievement Score
            </CardTitle>
            <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {user?.stats.achievementScore || 0}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              {user?.stats.achievementScore > 1000 ? "Expert Level" : "Getting Started"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Recent Study Sessions
            </CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { subject: "Biology Chapter 12", time: "2 hours ago", progress: 85, score: "92%" },
              { subject: "Math Formulas", time: "1 day ago", progress: 60, score: "78%" },
              { subject: "History Notes", time: "3 days ago", progress: 100, score: "95%" },
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{session.subject}</p>
                  <p className="text-xs text-muted-foreground">{session.time}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-medium text-green-600">{session.score}</p>
                  <Progress value={session.progress} className="w-20 h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Weekly Learning Goals
            </CardTitle>
            <CardDescription>Track your progress towards weekly objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { goal: "Complete 50 flashcards", current: 35, target: 50, color: "bg-blue-500" },
              { goal: "Study 5 hours", current: 4.2, target: 5, color: "bg-green-500" },
              { goal: "Upload 3 documents", current: 2, target: 3, color: "bg-purple-500" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.goal}</span>
                  <span className="text-muted-foreground">
                    {item.current}/{item.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                    style={{ width: `${(item.current / item.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {user?.stats.studyStreak > 0 ? "You're doing great! 🎉" : "Ready to start your journey? 🚀"}
              </h3>
              <p className="text-muted-foreground">
                {user?.stats.studyStreak > 0
                  ? `You've maintained a ${user.stats.studyStreak}-day study streak. Keep up the excellent work!`
                  : "Upload your first document and start building your study streak today!"}
              </p>
            </div>
            <Award className="h-12 w-12 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
