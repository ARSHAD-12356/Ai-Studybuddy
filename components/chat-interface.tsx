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
import { useSearchParams } from "next/navigation"
import { useSpeech } from "@/hooks/use-speech"
import { SpeechToggle } from "@/components/speech-toggle"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  relatedDocument?: string
}

interface ChatSession {
  id: string
  documentId: string
  documentName: string
  messages: Message[]
  createdAt: string
}

// No mock data - only show real chat sessions from uploaded documents

export function ChatInterface() {
  const searchParams = useSearchParams()
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [selectedDocument, setSelectedDocument] = useState<{ id: string; name: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Speech functionality
  const { speak, isEnabled: speechEnabled } = useSpeech()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const saveMessagesToLocalStorage = (updatedMessages: Message[]) => {
    if (selectedSession) {
      const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
      const updatedSessions = storedSessions.map((session: ChatSession) => {
        if (session.id === selectedSession) {
          return {
            ...session,
            messages: updatedMessages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp.toISOString()
            }))
          }
        }
        return session
      })
      localStorage.setItem("chatSessions", JSON.stringify(updatedSessions))
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat sessions from localStorage
  useEffect(() => {
    const loadChatSessions = () => {
      const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
      
      if (storedSessions.length > 0) {
        // Remove mock sessions (sessions with mock document IDs)
        const realSessions = storedSessions.filter((session: ChatSession) => 
          !session.documentId.startsWith("mock")
        )
        
        // Remove duplicate sessions (keep only the first one for each document)
        const uniqueSessions = realSessions.filter((session: ChatSession, index: number, self: ChatSession[]) => 
          index === self.findIndex((s: ChatSession) => s.documentId === session.documentId)
        )
        
        // Update localStorage with cleaned sessions if mock sessions or duplicates were found
        if (uniqueSessions.length !== storedSessions.length) {
          localStorage.setItem("chatSessions", JSON.stringify(uniqueSessions))
          console.log(`Cleaned up ${storedSessions.length - uniqueSessions.length} mock/duplicate chat sessions`)
        }
        
        setChatSessions(uniqueSessions)
      } else {
        // No real sessions - show empty state
        setChatSessions([])
      }
    }
    
    loadChatSessions()

    // Listen for document updates (when documents are deleted)
    const handleDocumentsUpdate = () => {
      const previousSessions = chatSessions
      loadChatSessions()
      
      // Check if the currently selected session was deleted
      setTimeout(() => {
        const updatedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
        if (selectedSession && !updatedSessions.find((s: ChatSession) => s.id === selectedSession)) {
          // Current session was deleted, select the first available session or clear selection
          if (updatedSessions.length > 0) {
            const firstSession = updatedSessions[0]
            setSelectedSession(firstSession.id)
            setMessages(firstSession.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp || msg.createdAt)
            })))
            setSelectedDocument({
              id: firstSession.documentId,
              name: firstSession.documentName
            })
          } else {
            // No sessions left, clear everything
            setSelectedSession("")
            setMessages([])
            setSelectedDocument(null)
          }
        }
      }, 100)
    }

    window.addEventListener("documentsUpdated", handleDocumentsUpdate)

    return () => {
      window.removeEventListener("documentsUpdated", handleDocumentsUpdate)
    }
  }, [])

  // Handle URL parameters and selected document
  useEffect(() => {
    const sessionId = searchParams.get("session")
    const storedDoc = localStorage.getItem("selectedDocument")
    
    if (storedDoc) {
      try {
        const doc = JSON.parse(storedDoc)
        setSelectedDocument(doc)
        
        // If there's a session ID in the URL, select that session
        if (sessionId) {
          setSelectedSession(sessionId)
          
          // Load messages for the selected session
          const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
          const targetSession = storedSessions.find((s: ChatSession) => s.id === sessionId)
          
          if (targetSession) {
            // Convert stored messages to the correct format
            const formattedMessages = targetSession.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp || msg.createdAt)
            }))
            setMessages(formattedMessages)
          }
        } else if (chatSessions.length > 0) {
          // If no session ID, select the first session
          const firstSession = chatSessions[0]
          setSelectedSession(firstSession.id)
          setMessages(firstSession.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp || msg.createdAt)
          })))
        }
      } catch (error) {
        console.error("Error parsing selected document:", error)
      }
    }
  }, [searchParams, chatSessions])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    saveMessagesToLocalStorage(updatedMessages)
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

      const finalMessages = [...updatedMessages, aiResponse]
      setMessages(finalMessages)
      saveMessagesToLocalStorage(finalMessages)
      
      // Speak the AI response if speech is enabled
      if (speechEnabled && data.response) {
        speak(data.response)
      }
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
      const errorMessages = [...updatedMessages, errorResponse]
      setMessages(errorMessages)
      saveMessagesToLocalStorage(errorMessages)
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
            {chatSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No chat sessions yet</p>
                <p className="text-xs mt-1">Upload documents and start chatting!</p>
              </div>
            ) : (
              chatSessions.map((session) => {
                const lastMessage = session.messages[session.messages.length - 1]
                const sessionDate = new Date(session.createdAt)
                
                return (
                  <Card
                    key={session.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent",
                      selectedSession === session.id && "bg-accent border-primary",
                    )}
                    onClick={() => {
                      setSelectedSession(session.id)
                      setMessages(session.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp || msg.createdAt)
                      })))
                      setSelectedDocument({
                        id: session.documentId,
                        name: session.documentName
                      })
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{session.documentName}</h3>
                          <Badge variant="secondary" className="text-xs">
                            1 doc
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {lastMessage?.content || "New chat session"}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatRelativeTime(sessionDate)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
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
            <div className="flex items-center gap-2">
              <SpeechToggle />
              <Badge variant="outline" className="flex items-center flex-shrink-0">
                <FileText className="w-3 h-3 mr-1" />
                {selectedDocument ? "1 document active" : "No document selected"}
              </Badge>
            </div>
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
