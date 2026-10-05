"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Globe, Sun, Moon, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomSidebarTrigger } from "@/components/layouts/custom-sidebar-trigger";
import { AppBreadcrumbs } from "@/components/layouts/app-breadcrumbs";
import { NavUser } from "@/components/layouts/nav-user";
import { ThemeCustomizer } from "@/components/shared/theme-customizer";
import { useLogout } from "@/features/auth/api/use-mutations";
import type { Dictionary } from "@/lib/dictionaries/en";

interface AppHeaderProps {
  lang: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  logoutLabel?: string;
  dict?: Dictionary;
}

export function AppHeader({
  lang,
  userName = "User",
  userEmail,
  userRole,
  logoutLabel = "Sign out",
  dict,
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const logoutMutation = useLogout();

  const switchLanguage = (newLang: "en" | "id") => {
    if (newLang === lang) return;
    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/") || `/${newLang}`;
    router.push(newPath);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      id="dashboard-header"
      className="mb-4 flex items-center justify-between gap-2 border-b border-border/40 pb-3"
      aria-label="Dashboard header"
    >
      {/* Left side: Sidebar trigger & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs dict={dict?.dashboard?.navigation} />
      </div>

      {/* Right side: Actions, Theme, Language & User */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 uppercase font-medium text-xs h-8 px-2"
              aria-label="Switch language"
            >
              <Globe className="size-3.5" />
              <span>{lang}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs">
            <DropdownMenuItem onClick={() => switchLanguage("en")}>
              English {lang === "en" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchLanguage("id")}>
              Bahasa Indonesia {lang === "id" && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Light/Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-4" aria-hidden="true" />
          ) : (
            <Moon className="size-4" aria-hidden="true" />
          )}
        </Button>

        {/* TweakCN Theme Customizer Trigger */}
        <ThemeCustomizer triggerVariant="icon" />

        {/* Notifications Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        {/* Quick Logout Button (ensures Playwright e2e test compatibility) */}
        <Button
          id="logout-button"
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          aria-label={logoutLabel}
          title={logoutLabel}
        >
          <LogOut className="size-4" aria-hidden="true" />
        </Button>

        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />

        {/* NavUser Dropdown */}
        <NavUser
          lang={lang}
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          logoutLabel={logoutLabel}
        />
      </div>
    </header>
  );
}
