"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudyChart } from "@/components/study-chart"
import { SubjectProgress } from "@/components/subject-progress"
import { WeeklyGoals } from "@/components/weekly-goals"
import { StudyStreak } from "@/components/study-streak"
import { TrendingUp, Clock, Target, BookOpen, Brain, Zap, ChevronUp } from "lucide-react"

const studyStats = {
  totalStudyTime: 24.5, // hours this week
  averageSessionTime: 45, // minutes
  documentsStudied: 12,
  flashcardsCompleted: 156,
  quizzesTaken: 8,
  averageQuizScore: 87,
  studyStreak: 7, // days
  weeklyGoal: 25, // hours
}

const recentActivity = [
  {
    id: "1",
    type: "flashcards",
    subject: "Biology",
    title: "Photosynthesis Review",
    score: 92,
    time: "2 hours ago",
    duration: 15,
  },
  {
    id: "2",
    type: "quiz",
    subject: "Mathematics",
    title: "Quadratic Equations Quiz",
    score: 85,
    time: "4 hours ago",
    duration: 20,
  },
  {
    id: "3",
    type: "chat",
    subject: "History",
    title: "World War II Discussion",
    score: null,
    time: "1 day ago",
    duration: 30,
  },
  {
    id: "4",
    type: "flashcards",
    subject: "Chemistry",
    title: "Periodic Table Elements",
    score: 78,
    time: "2 days ago",
    duration: 25,
  },
]

const weeklyProgress = [
  { day: "Mon", studyTime: 3.5, goal: 3.5 },
  { day: "Tue", studyTime: 4.2, goal: 3.5 },
  { day: "Wed", studyTime: 2.8, goal: 3.5 },
  { day: "Thu", studyTime: 4.1, goal: 3.5 },
  { day: "Fri", studyTime: 3.9, goal: 3.5 },
  { day: "Sat", studyTime: 3.0, goal: 3.5 },
  { day: "Sun", studyTime: 3.0, goal: 3.5 },
]

export function ProgressDashboard() {
  const weeklyProgressPercentage = (studyStats.totalStudyTime / studyStats.weeklyGoal) * 100

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "flashcards":
        return <BookOpen className="w-4 h-4" />
      case "quiz":
        return <Brain className="w-4 h-4" />
      case "chat":
        return <Zap className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "flashcards":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "quiz":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "chat":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Progress Dashboard</h1>
        <p className="text-muted-foreground text-pretty">
          Track your learning journey and see how you're improving over time.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.totalStudyTime}h</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +2.3h from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.studyStreak} days</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="w-3 h-3 mr-1 text-green-500" />
              Personal best!
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.averageQuizScore}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="w-3 h-3 mr-1 text-green-500" />
              +5% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards Mastered</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.flashcardsCompleted}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +23 this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Weekly Study Goal
          </CardTitle>
          <CardDescription>
            You're {weeklyProgressPercentage > 100 ? "ahead of" : "on track with"} your weekly goal of{" "}
            {studyStats.weeklyGoal} hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {studyStats.totalStudyTime}h / {studyStats.weeklyGoal}h
              </span>
            </div>
            <Progress value={Math.min(weeklyProgressPercentage, 100)} className="h-3" />
          </div>
          <div className="text-sm text-muted-foreground">
            {weeklyProgressPercentage >= 100
              ? `Congratulations! You've exceeded your goal by ${(studyStats.totalStudyTime - studyStats.weeklyGoal).toFixed(1)} hours.`
              : `${(studyStats.weeklyGoal - studyStats.totalStudyTime).toFixed(1)} hours remaining to reach your goal.`}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudyChart />
            <StudyStreak />
          </div>
          <WeeklyGoals />
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <SubjectProgress />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Study Activity</CardTitle>
              <CardDescription>Your latest study sessions and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{activity.title}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{activity.subject}</span>
                          <span>•</span>
                          <span>{activity.duration} min</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    {activity.score && (
                      <Badge variant="outline" className="text-sm">
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
