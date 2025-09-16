"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, CheckCircle, AlertCircle, Info, Trophy } from "lucide-react"

interface NotificationPanelProps {
  onClose: () => void
}

const mockNotifications = [
  {
    id: "1",
    type: "achievement",
    title: "Study Streak Achievement!",
    message: "You've maintained a 7-day study streak. Keep it up!",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "Flashcard Review Due",
    message: "You have 15 flashcards ready for review in Biology.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Document Processed",
    message: "Your Chemistry Lab Report has been processed and is ready for AI chat.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Quiz Completed",
    message: "Great job! You scored 85% on your Math quiz.",
    time: "1 day ago",
    read: true,
  },
]

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case "reminder":
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border ${!notification.read ? "bg-muted/50" : "bg-background"}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t">
          <Button variant="ghost" className="w-full text-sm">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
