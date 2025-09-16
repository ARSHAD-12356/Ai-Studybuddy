import { AuthGuard } from "@/components/auth/auth-guard"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SettingsInterface } from "@/components/settings-interface"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <Header />
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-balance">App Settings</h1>
              <p className="text-muted-foreground text-pretty">
                Configure your application preferences and account settings.
              </p>
            </div>
            <SettingsInterface />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
