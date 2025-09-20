import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { UserProvider } from "@/contexts/user-context"
import { NotesProvider } from "@/contexts/notes-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Study Buddy - Your AI-Powered Study Assistant",
  description:
    "Upload documents, chat with AI, create flashcards, and track your learning progress - developed by Code4U",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <UserProvider>
          <NotesProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </NotesProvider>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
