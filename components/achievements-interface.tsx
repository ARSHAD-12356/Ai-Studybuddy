"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaderboard } from "@/components/leaderboard"
import { RewardsSystem } from "@/components/rewards-system"
import {
  Trophy,
  Medal,
  Star,
  Zap,
  Target,
  BookOpen,
  Brain,
  Clock,
  Flame,
  Crown,
  Award,
  CheckCircle,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: "study" | "streak" | "mastery" | "social" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedDate?: string
}

const achievements: Achievement[] = [
  {
    id: "first-study",
    title: "First Steps",
    description: "Complete your first study session",
    icon: BookOpen,
    category: "study",
    rarity: "common",
    points: 10,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedDate: "2024-01-15",
  },
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "Study for 7 consecutive days",
    icon: Flame,
    category: "streak",
    rarity: "rare",
    points: 50,
    progress: 7,
    maxProgress: 7,
    unlocked: true,
    unlockedDate: "2024-01-21",
  },
  {
    id: "flashcard-master",
    title: "Flashcard Master",
    description: "Master 100 flashcards",
    icon: Target,
    category: "mastery",
    rarity: "epic",
    points: 100,
    progress: 89,
    maxProgress: 100,
    unlocked: false,
  },
  {
    id: "quiz-ace",
    title: "Quiz Ace",
    description: "Score 90% or higher on 10 quizzes",
    icon: Brain,
    category: "mastery",
    rarity: "rare",
    points: 75,
    progress: 6,
    maxProgress: 10,
    unlocked: false,
  },
  {
    id: "speed-learner",
    title: "Speed Learner",
    description: "Complete 5 study sessions in one day",
    icon: Zap,
    category: "study",
    rarity: "epic",
    points: 80,
    progress: 3,
    maxProgress: 5,
    unlocked: false,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Study after 10 PM for 5 days",
    icon: Clock,
    category: "special",
    rarity: "rare",
    points: 60,
    progress: 2,
    maxProgress: 5,
    unlocked: false,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Study for 100 total hours",
    icon: Crown,
    category: "study",
    rarity: "legendary",
    points: 200,
    progress: 67,
    maxProgress: 100,
    unlocked: false,
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Get 100% on 5 consecutive quizzes",
    icon: Star,
    category: "mastery",
    rarity: "legendary",
    points: 150,
    progress: 0,
    maxProgress: 5,
    unlocked: false,
  },
]

const userStats = {
  totalPoints: 485,
  level: 8,
  nextLevelPoints: 500,
  currentLevelPoints: 400,
  rank: 12,
  totalUsers: 1247,
}

export function AchievementsInterface() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "study":
        return BookOpen
      case "streak":
        return Flame
      case "mastery":
        return Target
      case "social":
        return Trophy
      case "special":
        return Star
      default:
        return Award
    }
  }

  const filteredAchievements = achievements.filter(
    (achievement) => selectedCategory === "all" || achievement.category === selectedCategory,
  )

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const levelProgress =
    ((userStats.totalPoints - userStats.currentLevelPoints) /
      (userStats.nextLevelPoints - userStats.currentLevelPoints)) *
    100

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Achievements & Rewards</h1>
        <p className="text-muted-foreground text-pretty">
          Unlock badges, earn points, and compete with other learners to stay motivated.
        </p>
      </div>

      {/* User Level & Stats */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Level {userStats.level}</h2>
                <p className="text-muted-foreground">
                  {userStats.totalPoints} points • Rank #{userStats.rank} of {userStats.totalUsers}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                {userStats.nextLevelPoints - userStats.totalPoints} points to Level {userStats.level + 1}
              </div>
              <Progress value={levelProgress} className="w-32 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">+45 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unlockedAchievements.length}/{achievements.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{userStats.rank}</div>
            <p className="text-xs text-muted-foreground">Top 1% of learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.level}</div>
            <p className="text-xs text-muted-foreground">Scholar tier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {["study", "streak", "mastery", "social", "special"].map((category) => {
              const Icon = getCategoryIcon(category)
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              )
            })}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const Icon = achievement.icon
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

              return (
                <Card
                  key={achievement.id}
                  className={cn(
                    "relative overflow-hidden transition-all hover:shadow-md",
                    achievement.unlocked ? "border-primary/20 bg-primary/5" : "opacity-75",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "p-3 rounded-lg",
                            achievement.unlocked
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {achievement.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">+{achievement.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>

                    {!achievement.unlocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}
