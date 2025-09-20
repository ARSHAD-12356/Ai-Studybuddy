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

      // Only use real uploaded documents, no mock data
      const allDocs = uploadedDocs.map((doc: any) => ({
        ...doc,
        uploadDate: doc.uploadDate ? new Date(doc.uploadDate).toLocaleString() : "Just now",
      }))

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
    // Check if chat session already exists for this document
    const existingChats = JSON.parse(localStorage.getItem("chatSessions") || "[]")
    const existingSession = existingChats.find((session: any) => session.documentId === docId)
    
    let chatSessionId: string
    
    if (existingSession) {
      // Use existing session
      chatSessionId = existingSession.id
    } else {
      // Create a new chat session only if it doesn't exist
      chatSessionId = `chat_${docId}_${Date.now()}`
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
    }

    // Store the selected document with session info (existing or new)
    localStorage.setItem(
      "selectedDocument",
      JSON.stringify({
        id: docId,
        name: docName,
        chatSessionId: chatSessionId,
        timestamp: new Date().toISOString(),
      }),
    )

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

    // Update localStorage - remove document
    const uploadedDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]")
    const filteredUploadedDocs = uploadedDocs.filter((doc: any) => doc.id !== docId)
    localStorage.setItem("uploadedDocuments", JSON.stringify(filteredUploadedDocs))

    // Also delete the corresponding chat session
    const existingChats = JSON.parse(localStorage.getItem("chatSessions") || "[]")
    const filteredChats = existingChats.filter((session: any) => session.documentId !== docId)
    localStorage.setItem("chatSessions", JSON.stringify(filteredChats))

    // Clear selected document if it's the one being deleted
    const selectedDoc = localStorage.getItem("selectedDocument")
    if (selectedDoc) {
      try {
        const parsedDoc = JSON.parse(selectedDoc)
        if (parsedDoc.id === docId) {
          localStorage.removeItem("selectedDocument")
        }
      } catch (error) {
        console.error("Error parsing selected document:", error)
      }
    }

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
                  {doc.status === "completed" ? (
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
                  ) : (
                    // Show delete button for uploading/processing files
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
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
