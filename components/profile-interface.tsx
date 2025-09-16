"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Trophy, BookOpen, Target, Camera, Upload } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export function ProfileInterface() {
  const { user, updateUser, getInitials } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "" })
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    if (!user) return
    updateUser({ ...formData, profilePicture: profilePicture || undefined })
    setIsEditing(false)
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePicture(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const stats = [
    { label: "Documents Uploaded", value: user?.stats.documentsUploaded.toString() || "0", icon: BookOpen },
    { label: "Flashcards Created", value: user?.stats.flashcardsMastered.toString() || "0", icon: Target },
    { label: "Study Streak", value: `${user?.stats.studyStreak || 0} days`, icon: Trophy },
    { label: "Total Study Time", value: `${Math.floor((user?.stats.studyTime || 0) / 60)}h`, icon: Calendar },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    {profilePicture ? (
                      <AvatarImage src={profilePicture || "/placeholder.svg"} alt="Profile picture" />
                    ) : (
                      <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-muted-foreground break-all">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    Premium Member
                  </Badge>
                  {isEditing && (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Picture
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <>
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <stat.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">Study Streak Master</p>
                    <p className="text-sm text-muted-foreground">Maintained a 7-day study streak</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">Document Explorer</p>
                    <p className="text-sm text-muted-foreground">Uploaded 10+ documents</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Preferences</CardTitle>
              <CardDescription>Customize your learning experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Daily Study Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified about your study goals</p>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  Configure
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Flashcard Difficulty</p>
                  <p className="text-sm text-muted-foreground">Adjust AI-generated flashcard complexity</p>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  Adjust
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  Toggle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
