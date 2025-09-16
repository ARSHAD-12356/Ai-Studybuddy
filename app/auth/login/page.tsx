// TODO: Commented out for development - remove authentication temporarily
// import { LoginForm } from "@/components/auth/login-form"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-balance">Development Mode</h1>
          <p className="text-muted-foreground text-pretty">
            Login page temporarily disabled for development
          </p>
          <div className="mt-4">
            <Link 
              href="/" 
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/*
Original login page - uncomment when ready to use authentication

import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">StudyAI</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-balance">Welcome back</h1>
            <p className="text-muted-foreground text-pretty">Sign in to continue your learning journey</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
*/
