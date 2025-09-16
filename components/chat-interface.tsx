"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, FileText, Sparkles, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  relatedDocument?: string
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  documentCount: number
}

const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Biology Chapter 12 Discussion",
    lastMessage: "Can you explain photosynthesis in simple terms?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    documentCount: 1,
  },
  {
    id: "2",
    title: "Math Formulas Help",
    lastMessage: "What's the quadratic formula used for?",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    documentCount: 2,
  },
  {
    id: "3",
    title: "History Notes Review",
    lastMessage: "Tell me about World War II causes",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    documentCount: 1,
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm your AI study assistant powered by Google Gemini. I can help you understand your uploaded documents, create study materials, answer questions, and provide explanations. What would you like to learn about today?",
    sender: "ai",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string>("1")
  const [selectedDocument, setSelectedDocument] = useState<{ id: string; name: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const storedDoc = localStorage.getItem("selectedDocument")
    if (storedDoc) {
      try {
        const doc = JSON.parse(storedDoc)
        setSelectedDocument(doc)
      } catch (error) {
        console.error("Error parsing selected document:", error)
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      // Call the real AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          documentContext: selectedDocument?.name ? `Document: ${selectedDocument.name}` : null,
          chatHistory: messages.slice(-10), // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI response")
      }

      const data = await response.json()
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        relatedDocument: selectedDocument?.name,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error getting AI response:", error)
      
      // Show appropriate error message to user based on the error
      let errorMessage = "Sorry, I'm having trouble responding right now. Please try again in a moment."
      
      if (error instanceof Error) {
        if (error.message.includes("busy") || error.message.includes("overloaded")) {
          errorMessage = "I'm currently experiencing high demand. Please try again in a few seconds."
        } else if (error.message.includes("unavailable")) {
          errorMessage = "AI service is temporarily down. Please try again shortly."
        }
      }
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="flex h-full max-h-screen overflow-hidden">
      {/* Chat Sessions Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat Sessions</h2>
            <Button size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-2 space-y-2">
            {mockChatSessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-accent",
                  selectedSession === session.id && "bg-accent border-primary",
                )}
                onClick={() => setSelectedSession(session.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">{session.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {session.documentCount} docs
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{session.lastMessage}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatRelativeTime(session.timestamp)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-4">
              <h1 className="text-xl font-semibold truncate">
                {selectedDocument ? `Chat about ${selectedDocument.name}` : "AI Study Chat"}
              </h1>
              <p className="text-sm text-muted-foreground truncate">Ask questions about your uploaded documents</p>
            </div>
            <Badge variant="outline" className="flex items-center flex-shrink-0">
              <FileText className="w-3 h-3 mr-1" />
              {selectedDocument ? "1 document active" : "No document selected"}
            </Badge>
          </div>
          {selectedDocument && (
            <div className="mt-2 p-2 bg-muted rounded-lg">
              <div className="flex items-center text-sm">
                <FileText className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                <span className="font-medium truncate">Active Document: {selectedDocument.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 min-h-0">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3",
                  message.sender === "user" && "flex-row-reverse space-x-reverse",
                )}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className={cn(message.sender === "ai" ? "bg-primary text-primary-foreground" : "bg-secondary")}
                  >
                    {message.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("flex flex-col space-y-1 max-w-[70%]", message.sender === "user" && "items-end")}>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.sender === "ai" ? "bg-card border border-border" : "bg-primary text-primary-foreground",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatTime(message.timestamp)}</span>
                    {message.relatedDocument && (
                      <>
                        <span>•</span>
                        <div className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          <span>{message.relatedDocument}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card border border-border rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  selectedDocument
                    ? `Ask a question about ${selectedDocument.name}...`
                    : "Ask a question about your documents..."
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI can make mistakes. Verify important information with your source materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
