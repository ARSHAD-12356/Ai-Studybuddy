"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, Medal, Trophy, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardUser {
  id: string
  name: string
  points: number
  level: number
  rank: number
  previousRank: number
  studyStreak: number
  avatar: string
  isCurrentUser?: boolean
}

const leaderboardData: LeaderboardUser[] = [
  {
    id: "1",
    name: "Sarah Chen",
    points: 1250,
    level: 15,
    rank: 1,
    previousRank: 2,
    studyStreak: 23,
    avatar: "SC",
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    points: 1180,
    level: 14,
    rank: 2,
    previousRank: 1,
    studyStreak: 18,
    avatar: "AR",
  },
  {
    id: "3",
    name: "Emma Thompson",
    points: 1095,
    level: 13,
    rank: 3,
    previousRank: 4,
    studyStreak: 15,
    avatar: "ET",
  },
  {
    id: "4",
    name: "Michael Kim",
    points: 980,
    level: 12,
    rank: 4,
    previousRank: 3,
    studyStreak: 12,
    avatar: "MK",
  },
  {
    id: "5",
    name: "Lisa Wang",
    points: 875,
    level: 11,
    rank: 5,
    previousRank: 6,
    studyStreak: 9,
    avatar: "LW",
  },
  {
    id: "6",
    name: "David Brown",
    points: 820,
    level: 10,
    rank: 6,
    previousRank: 5,
    studyStreak: 7,
    avatar: "DB",
  },
  {
    id: "7",
    name: "Jennifer Lee",
    points: 765,
    level: 9,
    rank: 7,
    previousRank: 8,
    studyStreak: 14,
    avatar: "JL",
  },
  {
    id: "8",
    name: "Ryan Martinez",
    points: 720,
    level: 9,
    rank: 8,
    previousRank: 7,
    studyStreak: 6,
    avatar: "RM",
  },
  {
    id: "9",
    name: "Sophie Wilson",
    points: 680,
    level: 8,
    rank: 9,
    previousRank: 10,
    studyStreak: 11,
    avatar: "SW",
  },
  {
    id: "10",
    name: "James Taylor",
    points: 645,
    level: 8,
    rank: 10,
    previousRank: 9,
    studyStreak: 5,
    avatar: "JT",
  },
  {
    id: "current",
    name: "John Doe",
    points: 485,
    level: 8,
    rank: 12,
    previousRank: 15,
    studyStreak: 7,
    avatar: "JD",
    isCurrentUser: true,
  },
]

const timeframes = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "all", label: "All Time" },
]

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current
    if (change > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-3 h-3 mr-1" />
          <span className="text-xs">+{change}</span>
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="w-3 h-3 mr-1" />
          <span className="text-xs">{change}</span>
        </div>
      )
    }
    return <span className="text-xs text-muted-foreground">-</span>
  }

  const topThree = leaderboardData.slice(0, 3)
  const restOfLeaderboard = leaderboardData.slice(3)
  const currentUser = leaderboardData.find((user) => user.isCurrentUser)

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>This week's leading learners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end space-x-4">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-gray-200">{topThree[1]?.avatar}</AvatarFallback>
                </Avatar>
              </div>
              <div className="bg-gray-200 rounded-t-lg p-4 h-20 flex flex-col justify-end">
                <Medal className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <div className="font-semibold text-sm">{topThree[1]?.name}</div>
                <div className="text-xs text-muted-foreground">{topThree[1]?.points} pts</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Avatar className="w-18 h-18">
                  <AvatarFallback className="bg-yellow-200">{topThree[0]?.avatar}</AvatarFallback>
                </Avatar>
              </div>
              <div className="bg-yellow-200 rounded-t-lg p-4 h-24 flex flex-col justify-end">
                <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
                <div className="font-bold">{topThree[0]?.name}</div>
                <div className="text-sm text-muted-foreground">{topThree[0]?.points} pts</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-amber-200">{topThree[2]?.avatar}</AvatarFallback>
                </Avatar>
              </div>
              <div className="bg-amber-200 rounded-t-lg p-4 h-16 flex flex-col justify-end">
                <Trophy className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="font-semibold text-sm">{topThree[2]?.name}</div>
                <div className="text-xs text-muted-foreground">{topThree[2]?.points} pts</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
          <CardDescription>See how you rank against other learners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboardData.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  user.isCurrentUser ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50",
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 flex justify-center">{getRankIcon(user.rank)}</div>
                  <Avatar>
                    <AvatarFallback
                      className={cn(user.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}
                    >
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center">
                      {user.name}
                      {user.isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Level {user.level}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <div className="font-semibold">{user.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                  <div>
                    <div className="font-medium">{user.studyStreak}</div>
                    <div className="text-xs text-muted-foreground">day streak</div>
                  </div>
                  <div className="w-12">{getRankChange(user.rank, user.previousRank)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Position (if not in top 10) */}
      {currentUser && currentUser.rank > 10 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center space-x-4">
                <div className="w-8 flex justify-center">
                  <span className="text-lg font-bold text-primary">#{currentUser.rank}</span>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{currentUser.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentUser.name} (You)</div>
                  <div className="text-sm text-muted-foreground">Level {currentUser.level}</div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-right">
                <div>
                  <div className="font-semibold">{currentUser.points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
                <div>
                  <div className="font-medium">{currentUser.studyStreak}</div>
                  <div className="text-xs text-muted-foreground">day streak</div>
                </div>
                <div className="w-12">{getRankChange(currentUser.rank, currentUser.previousRank)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
