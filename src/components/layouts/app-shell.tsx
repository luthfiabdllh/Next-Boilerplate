import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layouts/app-header";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import type { Dictionary } from "@/lib/dictionaries/en";

interface AppShellProps {
  children: ReactNode;
  lang: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  dict: Dictionary;
}

export function AppShell({
  children,
  lang,
  userName = "User",
  userEmail,
  userRole,
  dict,
}: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        lang={lang}
        dict={dict.dashboard.navigation}
        userName={userName}
        userRole={userRole}
      />
      <SidebarInset className="min-h-screen p-4 md:p-6 flex flex-col bg-background">
        <AppHeader
          lang={lang}
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          logoutLabel={dict.auth.logout.button}
          dict={dict}
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
