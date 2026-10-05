import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layouts/app-header";
import { AppSidebar } from "@/components/layouts/app-sidebar";

interface AppShellProps {
  children: ReactNode;
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export function AppShell({
  children,
  userName = "User",
  userEmail,
  userRole,
}: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        userName={userName}
        userRole={userRole}
      />
      <SidebarInset className="min-h-screen p-4 md:p-6 flex flex-col bg-background">
        <AppHeader
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
        />
        <main
          id="main-content"
          className="flex flex-1 flex-col gap-4 overflow-y-auto"
          aria-label="Dashboard main content"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
