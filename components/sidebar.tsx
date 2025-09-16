import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Upload, BarChart3, Trophy, User, Home, Settings } from "lucide-react"
import Link from "next/link"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Upload Documents", href: "/upload", icon: Upload },
  { name: "AI Chat", href: "/chat", icon: MessageSquare },
  { name: "Flashcards", href: "/flashcards", icon: BookOpen },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Achievements", href: "/achievements", icon: Trophy },
]

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-sidebar-foreground">AI Study Buddy</span>
            <span className="text-xs text-muted-foreground">developed by Code4U</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <User className="w-5 h-5 mr-3" />
            Profile
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
