import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AchievementsInterface } from "@/components/achievements-interface"

export default function AchievementsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AchievementsInterface />
        </main>
      </div>
    </div>
  )
}
