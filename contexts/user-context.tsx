"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface UserStats {
  studyStreak: number
  flashcardsMastered: number
  studyTime: number // in minutes
  achievementScore: number
  documentsUploaded: number
  totalStudySessions: number
}

interface User {
  id: string
  name: string
  email: string
  profilePicture?: string
  joinDate: string
  stats: UserStats
}

interface UserContextType {
  user: User | null
  updateUser: (updates: Partial<User>) => void
  updateStats: (updates: Partial<UserStats>) => void
  getFirstName: () => string
  getInitials: () => string
  incrementStat: (stat: keyof UserStats, amount?: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Initialize user data from localStorage or create new user
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        // Ensure stats exist with default values
        const defaultStats: UserStats = {
          studyStreak: 0,
          flashcardsMastered: 0,
          studyTime: 0,
          achievementScore: 0,
          documentsUploaded: 0,
          totalStudySessions: 0,
        }
        setUser({
          ...parsedUser,
          stats: { ...defaultStats, ...parsedUser.stats },
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
        createDefaultUser()
      }
    } else {
      createDefaultUser()
    }
  }, [])

  const createDefaultUser = () => {
    const defaultUser: User = {
      id: "user_" + Date.now(),
      name: "Md Arshad Raza", // Default name as mentioned in requirements
      email: "arshad@example.com",
      joinDate: new Date().toISOString(),
      stats: {
        studyStreak: 0,
        flashcardsMastered: 0,
        studyTime: 0,
        achievementScore: 0,
        documentsUploaded: 0,
        totalStudySessions: 0,
      },
    }
    setUser(defaultUser)
    localStorage.setItem("user", JSON.stringify(defaultUser))
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const updateStats = (updates: Partial<UserStats>) => {
    if (!user) return
    const updatedStats = { ...user.stats, ...updates }
    const updatedUser = { ...user, stats: updatedStats }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const incrementStat = (stat: keyof UserStats, amount = 1) => {
    if (!user) return
    const currentValue = user.stats[stat]
    const newValue = typeof currentValue === "number" ? currentValue + amount : amount
    updateStats({ [stat]: newValue })
  }

  const getFirstName = () => {
    if (!user) return "User"
    return user.name.split(" ")[0]
  }

  const getInitials = () => {
    if (!user) return "U"
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        updateStats,
        getFirstName,
        getInitials,
        incrementStat,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
