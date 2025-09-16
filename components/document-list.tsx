"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, BookOpen, MoreVertical, Download, Trash2, ArrowRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"

interface Document {
  id: string
  name: string
  uploadDate: string
  size: number
  status: string
  flashcards: number
  chatSessions: number
  type?: string
}

export function DocumentList() {
  const router = useRouter()
  const { incrementStat } = useUser()
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    const loadDocuments = () => {
      const uploadedDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]")
      const mockDocuments = [
        {
          id: "1",
          name: "Biology Chapter 12.pdf",
          uploadDate: "2 hours ago",
          size: 2400000,
          status: "completed",
          flashcards: 15,
          chatSessions: 3,
        },
        {
          id: "2",
          name: "Math Formulas.pdf",
          uploadDate: "1 day ago",
          size: 1800000,
          status: "completed",
          flashcards: 22,
          chatSessions: 1,
        },
      ]

      // Combine uploaded documents with mock documents
      const allDocs = [
        ...uploadedDocs.map((doc: any) => ({
          ...doc,
          uploadDate: doc.uploadDate ? new Date(doc.uploadDate).toLocaleString() : "Just now",
        })),
        ...mockDocuments,
      ]

      setDocuments(allDocs)
    }

    loadDocuments()

    const handleDocumentsUpdate = () => {
      loadDocuments()
    }

    window.addEventListener("documentsUpdated", handleDocumentsUpdate)

    return () => {
      window.removeEventListener("documentsUpdated", handleDocumentsUpdate)
    }
  }, [])

  const handleProceedToChat = (docId: string, docName: string) => {
    // Create a new chat session ID for this specific document
    const chatSessionId = `chat_${docId}_${Date.now()}`

    // Store the selected document with new session info
    localStorage.setItem(
      "selectedDocument",
      JSON.stringify({
        id: docId,
        name: docName,
        chatSessionId: chatSessionId,
        timestamp: new Date().toISOString(),
      }),
    )

    // Create a new chat session in localStorage
    const existingChats = JSON.parse(localStorage.getItem("chatSessions") || "[]")
    const newChatSession = {
      id: chatSessionId,
      documentId: docId,
      documentName: docName,
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your AI study assistant. I can help you understand your uploaded document "${docName}", create study materials, and answer questions. What would you like to learn about today?`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    }

    existingChats.unshift(newChatSession)
    localStorage.setItem("chatSessions", JSON.stringify(existingChats))

    // Update user stats
    incrementStat("totalStudySessions")

    router.push(`/chat?session=${chatSessionId}`)
  }

  const handleViewFlashcards = (docId: string) => {
    localStorage.setItem("selectedDocumentForFlashcards", docId)
    router.push("/flashcards")
  }

  const handleDeleteDocument = (docId: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== docId)
    setDocuments(updatedDocs)

    // Update localStorage
    const uploadedDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]")
    const filteredUploadedDocs = uploadedDocs.filter((doc: any) => doc.id !== docId)
    localStorage.setItem("uploadedDocuments", JSON.stringify(filteredUploadedDocs))

    window.dispatchEvent(new CustomEvent("documentsUpdated"))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full max-w-none">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Manage your uploaded study materials and access AI-generated content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet. Upload some files to get started!</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-lg space-y-3">
                  {/* File Info Section */}
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium text-sm leading-tight">{doc.name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.uploadDate}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.size)}</span>
                        <Badge variant={doc.status === "completed" ? "default" : "secondary"} className="text-xs">
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Section */}
                  {doc.status === "completed" && (
                    <div className="flex flex-col gap-3">
                      {/* Primary Action Button */}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleProceedToChat(doc.id, doc.name)}
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Proceed to AI Chat
                      </Button>

                      {/* Secondary Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProceedToChat(doc.id, doc.name)}
                          className="flex-1"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Chat ({doc.chatSessions})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFlashcards(doc.id)}
                          className="flex-1"
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Cards ({doc.flashcards})
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDocument(doc.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
