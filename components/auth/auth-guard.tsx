"use client"

import type React from "react"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Loader2 } from "lucide-react"
// import { authService } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  // TODO: Auth guard disabled for development
  // Remove this when authentication is needed again
  return <>{children}</>
}

/*
Original auth guard code - uncomment when authentication is needed

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
*/
