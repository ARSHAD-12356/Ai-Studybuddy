"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Star, Zap, Crown, Sparkles, Clock, CheckCircle } from "lucide-react"

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: "cosmetic" | "boost" | "unlock" | "special"
  icon: React.ComponentType<{ className?: string }>
  available: boolean
  owned?: boolean
}

interface DailyReward {
  day: number
  reward: string
  points: number
  claimed: boolean
  current?: boolean
}

const rewards: Reward[] = [
  {
    id: "theme-dark",
    title: "Dark Theme",
    description: "Unlock the sleek dark theme for your dashboard",
    cost: 100,
    category: "cosmetic",
    icon: Star,
    available: true,
    owned: false,
  },
  {
    id: "study-boost",
    title: "2x Points Boost",
    description: "Double your points for the next 24 hours",
    cost: 150,
    category: "boost",
    icon: Zap,
    available: true,
    owned: false,
  },
  {
    id: "premium-avatar",
    title: "Premium Avatar Frame",
    description: "Show off with a golden avatar frame",
    cost: 200,
    category: "cosmetic",
    icon: Crown,
    available: true,
    owned: false,
  },
  {
    id: "ai-tutor",
    title: "AI Tutor Sessions",
    description: "Unlock 5 premium AI tutoring sessions",
    cost: 300,
    category: "unlock",
    icon: Sparkles,
    available: true,
    owned: false,
  },
  {
    id: "streak-freeze",
    title: "Streak Freeze",
    description: "Protect your study streak for one missed day",
    cost: 75,
    category: "special",
    icon: Clock,
    available: true,
    owned: false,
  },
  {
    id: "custom-badge",
    title: "Custom Badge",
    description: "Create your own achievement badge",
    cost: 500,
    category: "cosmetic",
    icon: Star,
    available: false,
    owned: false,
  },
]

const dailyRewards: DailyReward[] = [
  { day: 1, reward: "10 Points", points: 10, claimed: true },
  { day: 2, reward: "15 Points", points: 15, claimed: true },
  { day: 3, reward: "20 Points", points: 20, claimed: true },
  { day: 4, reward: "Study Boost", points: 0, claimed: true },
  { day: 5, reward: "30 Points", points: 30, claimed: true },
  { day: 6, reward: "40 Points", points: 40, claimed: true },
  { day: 7, reward: "Premium Theme", points: 0, claimed: false, current: true },
]

const userPoints = 485

export function RewardsSystem() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cosmetic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "boost":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "unlock":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "special":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{userPoints} Points</h3>
                <p className="text-muted-foreground">Available to spend</p>
              </div>
            </div>
            <Button>
              <Gift className="w-4 h-4 mr-2" />
              Claim Daily Reward
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Daily Login Rewards
          </CardTitle>
          <CardDescription>Log in daily to claim increasing rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dailyRewards.map((reward) => (
              <div
                key={reward.day}
                className={`p-3 rounded-lg border text-center transition-all ${
                  reward.current
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : reward.claimed
                      ? "border-green-200 bg-green-50"
                      : "border-border bg-muted/50"
                }`}
              >
                <div className="text-sm font-medium mb-1">Day {reward.day}</div>
                <div className="text-xs text-muted-foreground mb-2">{reward.reward}</div>
                {reward.claimed ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                ) : reward.current ? (
                  <Button size="sm" className="w-full text-xs">
                    Claim
                  </Button>
                ) : (
                  <div className="w-4 h-4 border-2 border-muted rounded-full mx-auto" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Store */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards Store</CardTitle>
          <CardDescription>Spend your points on exciting rewards and upgrades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => {
              const Icon = reward.icon
              const canAfford = userPoints >= reward.cost

              return (
                <Card
                  key={reward.id}
                  className={`transition-all ${
                    !reward.available
                      ? "opacity-50"
                      : reward.owned
                        ? "border-green-200 bg-green-50"
                        : canAfford
                          ? "hover:shadow-md border-primary/20"
                          : "opacity-75"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            reward.owned ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{reward.title}</CardTitle>
                          <Badge className={getCategoryColor(reward.category)}>{reward.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{reward.cost}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                    <Button
                      className="w-full"
                      disabled={!reward.available || reward.owned || !canAfford}
                      variant={reward.owned ? "outline" : "default"}
                    >
                      {reward.owned ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Owned
                        </>
                      ) : !reward.available ? (
                        "Coming Soon"
                      ) : !canAfford ? (
                        `Need ${reward.cost - userPoints} more points`
                      ) : (
                        "Purchase"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Earning Tips */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
          <CardDescription>Maximize your point earning potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Daily Activities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete a study session: 10 points</li>
                <li>• Master a flashcard: 5 points</li>
                <li>• Take a quiz: 15 points</li>
                <li>• Upload a document: 20 points</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Bonus Multipliers</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Study streak (7+ days): 2x points</li>
                <li>• Perfect quiz score: 1.5x points</li>
                <li>• Weekend study: 1.2x points</li>
                <li>• Achievement unlock: Bonus points</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
