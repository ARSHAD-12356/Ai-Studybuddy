import { AuthGuard } from "@/components/auth/auth-guard"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { UploadArea } from "@/components/upload-area"
import { DocumentList } from "@/components/document-list"

export default function UploadPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 space-y-6 max-w-full">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-balance">Upload Documents</h1>
                <p className="text-muted-foreground text-pretty">
                  Upload your study materials and let AI help you learn more effectively.
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <UploadArea />
                <DocumentList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
