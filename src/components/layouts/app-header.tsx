"use client";

import { LayoutGrid, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomSidebarTrigger } from "@/components/layouts/custom-sidebar-trigger";
import { NavUser } from "@/components/layouts/nav-user";

interface AppHeaderProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export function AppHeader({
  userName = "User",
  userEmail,
  userRole,
}: AppHeaderProps) {
  return (
    <header
      id="dashboard-header"
      className="mb-6 flex items-center justify-between gap-2"
      aria-label="Dashboard header"
    >
      {/* Left side: Sidebar trigger & Clean Breadcrumbs */}
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LayoutGrid className="size-4 text-muted-foreground" />
          <span>Dashboard</span>
        </div>
      </div>

      {/* Right side: Notifications bell & User Avatar Dropdown */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <NavUser
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
        />
      </div>
    </header>
  );
}
