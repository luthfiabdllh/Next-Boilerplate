"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, User, Settings, Sparkles } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type AppBreadcrumbPage = {
  title: string;
  icon?: ReactNode;
  href?: string;
};

interface AppBreadcrumbsProps {
  page?: AppBreadcrumbPage | null;
}

export function AppBreadcrumbs({ page }: AppBreadcrumbsProps) {
  const pathname = usePathname();

  // If a specific page override was passed, render it
  if (page?.title) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 [&>svg]:size-3.5">
              {page.icon}
              {page.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Derive breadcrumb from pathname segments: /[segment]/[subsegment]
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[0] || "dashboard";
  const subSection = segments[1];

  const getSectionMeta = (sec: string) => {
    switch (sec) {
      case "dashboard":
        return {
          title: "Dashboard",
          icon: <LayoutDashboard className="size-3.5 text-muted-foreground" />,
          href: "/dashboard",
        };
      case "users":
        return {
          title: "Users",
          icon: <Users className="size-3.5 text-muted-foreground" />,
          href: "/users",
        };
      case "profile":
        return {
          title: "Profile",
          icon: <User className="size-3.5 text-muted-foreground" />,
          href: "/profile",
        };
      case "settings":
        return {
          title: "Settings",
          icon: <Settings className="size-3.5 text-muted-foreground" />,
          href: "/settings",
        };
      default:
        return {
          title: sec.charAt(0).toUpperCase() + sec.slice(1),
          icon: <Sparkles className="size-3.5 text-muted-foreground" />,
          href: `/${sec}`,
        };
    }
  };

  const currentMeta = getSectionMeta(section);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {section !== "dashboard" ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                >
                  <LayoutDashboard className="size-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1.5 font-medium text-xs">
                {currentMeta.icon}
                <span>{currentMeta.title}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5 font-medium text-xs">
              {currentMeta.icon}
              <span>{currentMeta.title}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}

        {subSection && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize font-medium text-xs">
                {subSection.replace(/-/g, " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
