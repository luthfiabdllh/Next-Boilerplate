"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  User,
  Settings,
  Plus,
  HelpCircle,
  Activity,
  Layers,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/layouts/nav-group";
import { LatestChange } from "@/components/layouts/latest-change";
import type { SidebarNavGroup } from "@/components/layouts/nav-config";
import type { Dictionary } from "@/lib/dictionaries/en";

interface AppSidebarProps {
  lang: string;
  dict: Dictionary["dashboard"]["navigation"];
  userName?: string;
  userRole?: string;
}

export function AppSidebar({ lang, dict }: AppSidebarProps) {
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    const fullPath = `/${lang}/${route}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  const navGroups: SidebarNavGroup[] = [
    {
      label: "Platform",
      items: [
        {
          title: dict.dashboard || "Dashboard",
          path: `/${lang}/dashboard`,
          icon: <LayoutDashboard className="size-4" />,
          isActive: isRouteActive("dashboard"),
        },
      ],
    },
    {
      label: "Management",
      roles: ["admin", "moderator"],
      items: [
        {
          title: dict.users || "Users",
          path: `/${lang}/users`,
          icon: <Users className="size-4" />,
          isActive: isRouteActive("users"),
          roles: ["admin", "moderator"],
          subItems: [
            {
              title: "All Users",
              path: `/${lang}/users`,
              isActive: pathname === `/${lang}/users`,
            },
          ],
        },
      ],
    },
    {
      label: "Preferences",
      items: [
        {
          title: dict.profile || "Profile",
          path: `/${lang}/profile`,
          icon: <User className="size-4" />,
          isActive: isRouteActive("profile"),
        },
        {
          title: dict.settings || "Settings",
          path: `/${lang}/settings`,
          icon: <Settings className="size-4" />,
          isActive: isRouteActive("settings"),
        },
      ],
    },
  ];

  const footerNavLinks = [
    {
      title: "Help & Support",
      path: `/${lang}/settings`,
      icon: <HelpCircle className="size-4" />,
    },
    {
      title: "Platform Status",
      path: `/${lang}/dashboard`,
      icon: <Activity className="size-4" />,
      badge: "Operational",
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* Brand Header */}
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton size="lg" asChild>
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              <Layers className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold text-sm">Enterprise App</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                v1.0.0
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        {/* Quick Action */}
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground font-medium"
              tooltip="New Item"
              asChild
            >
              <Link href={`/${lang}/dashboard`}>
                <Plus className="size-4 shrink-0" />
                <span>Quick Action</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>

        {/* Navigation Groups */}
        {navGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <LatestChange />
        <SidebarMenu className="mt-2">
          {footerNavLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="text-muted-foreground hover:text-foreground"
                size="sm"
                tooltip={item.title}
              >
                <Link href={item.path} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 rounded font-mono group-data-[collapsible=icon]:hidden">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
