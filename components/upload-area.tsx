"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, ImageIcon, File, X, CheckCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  uploadDate: string
  flashcards: number
  chatSessions: number
}

export function UploadArea() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] File input changed, files:", e.target.files)
    const files = Array.from(e.target.files || [])
    handleFiles(files)
    // Reset the input value to allow selecting the same file again
    e.target.value = ""
  }, [])

  const handleFiles = (files: File[]) => {
    console.log("[v0] Processing files:", files)

    if (files.length === 0) {
      console.log("[v0] No files to process")
      return
    }

    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading",
      uploadDate: new Date().toISOString(),
      flashcards: Math.floor(Math.random() * 20) + 5,
      chatSessions: 0,
    }))

    console.log("[v0] Created new files:", newFiles)
    setUploadedFiles((prev) => [...prev, ...newFiles])

    newFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10

      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            if (progress < 100) {
              return { ...file, progress }
            } else if (file.status === "uploading") {
              return { ...file, progress: 100, status: "processing" }
            } else if (file.status === "processing") {
              clearInterval(interval)

              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("documentsUpdated"))
                console.log("[v0] File completed:", fileId)
              }, 0)

              return { ...file, status: "completed", progress: 100 }
            }
          }
          return file
        }),
      )
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))

    setTimeout(() => {
      const existingDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]")
      const updatedDocs = existingDocs.filter((doc: any) => doc.id !== fileId)
      localStorage.setItem("uploadedDocuments", JSON.stringify(updatedDocs))
      window.dispatchEvent(new CustomEvent("documentsUpdated"))
    }, 0)
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />
    if (type.includes("image")) return <ImageIcon className="w-5 h-5 text-blue-500" />
    return <File className="w-5 h-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const hasCompletedFiles = uploadedFiles.some((file) => file.status === "completed")

  const handleProceed = () => {
    console.log("[v0] Proceeding to chat with files:", uploadedFiles)
    const completedFiles = uploadedFiles.filter((file) => file.status === "completed")
    localStorage.setItem("currentStudySession", JSON.stringify(completedFiles))
    router.push("/chat")
  }

  const handleUploadClick = () => {
    console.log("[v0] Upload button clicked")
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    } else {
      console.log("[v0] File input not found")
    }
  }

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const existingDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]")
      const newFiles = uploadedFiles.filter((file) => !existingDocs.some((doc: any) => doc.id === file.id))

      if (newFiles.length > 0) {
        const updatedDocs = [...existingDocs, ...newFiles]
        localStorage.setItem("uploadedDocuments", JSON.stringify(updatedDocs))
        console.log("[v0] Saved new files to localStorage:", newFiles)

        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("documentsUpdated"))
        }, 0)
      }
    }
  }, [uploadedFiles])

  return (
    <div className="w-full max-w-none">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Drag and drop your files here or click to browse. Supports PDF, DOCX, TXT, and images.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors relative",
              isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop your files here</p>
              <p className="text-sm text-muted-foreground">or click the button below to browse from your computer</p>
            </div>
            <Button onClick={handleUploadClick} variant="outline" className="mt-4 bg-transparent">
              Browse Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploading Files</h4>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.status === "uploading" && <Progress value={file.progress} className="w-full h-1 mt-1" />}
                      {file.status === "processing" && (
                        <p className="text-xs text-primary mt-1">Processing with AI...</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {hasCompletedFiles && (
                <div className="pt-4 border-t">
                  <Button onClick={handleProceed} className="w-full" size="lg">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Proceed to AI Chat
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
