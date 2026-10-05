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
  dict?: {
    dashboard?: string;
    users?: string;
    profile?: string;
    settings?: string;
  };
}

export function AppBreadcrumbs({ page, dict }: AppBreadcrumbsProps) {
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

  // Derive breadcrumb from pathname segments: /[lang]/[segment]/[subsegment]
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] || "en";
  const section = segments[1] || "dashboard";
  const subSection = segments[2];

  const getSectionMeta = (sec: string) => {
    switch (sec) {
      case "dashboard":
        return {
          title: dict?.dashboard || "Dashboard",
          icon: <LayoutDashboard className="size-3.5 text-muted-foreground" />,
          href: `/${lang}/dashboard`,
        };
      case "users":
        return {
          title: dict?.users || "Users",
          icon: <Users className="size-3.5 text-muted-foreground" />,
          href: `/${lang}/users`,
        };
      case "profile":
        return {
          title: dict?.profile || "Profile",
          icon: <User className="size-3.5 text-muted-foreground" />,
          href: `/${lang}/profile`,
        };
      case "settings":
        return {
          title: dict?.settings || "Settings",
          icon: <Settings className="size-3.5 text-muted-foreground" />,
          href: `/${lang}/settings`,
        };
      default:
        return {
          title: sec.charAt(0).toUpperCase() + sec.slice(1),
          icon: <Sparkles className="size-3.5 text-muted-foreground" />,
          href: `/${lang}/${sec}`,
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
                  href={`/${lang}/dashboard`}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                >
                  <LayoutDashboard className="size-3.5" />
                  <span className="hidden sm:inline">
                    {dict?.dashboard || "Dashboard"}
                  </span>
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
