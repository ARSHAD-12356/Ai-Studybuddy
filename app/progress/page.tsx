import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ProgressDashboard } from "@/components/progress-dashboard"

export default function ProgressPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <ProgressDashboard />
        </main>
      </div>
    </div>
  )
}
