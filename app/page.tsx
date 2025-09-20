import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-0">
            <Dashboard />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
