"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BarChart3,
  ShoppingCart,
  FileText,
  Users,
  Megaphone,
  Settings,
  Plus,
  Search,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavGroup } from "@/components/layouts/nav-group";
import { LatestChange } from "@/components/layouts/latest-change";
import type { SidebarNavGroup } from "@/components/layouts/nav-config";
import type { Dictionary } from "@/lib/dictionaries/en";

interface AppSidebarProps {
  lang: string;
  dict?: Dictionary["dashboard"]["navigation"];
  userName?: string;
  userRole?: string;
}

export function AppSidebar({ lang }: AppSidebarProps) {
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    const fullPath = `/${lang}/${route}`;
    return pathname === fullPath;
  };

  const navGroups: SidebarNavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          path: `/${lang}/dashboard`,
          icon: <LayoutGrid className="size-4 shrink-0" />,
          isActive: isRouteActive("dashboard"),
        },
        {
          title: "Sales",
          path: `/${lang}/dashboard`,
          icon: <BarChart3 className="size-4 shrink-0" />,
        },
      ],
    },
    {
      label: "Store",
      items: [
        {
          title: "Orders",
          path: `/${lang}/dashboard`,
          icon: <ShoppingCart className="size-4 shrink-0" />,
          subItems: [
            { title: "All orders", path: `/${lang}/dashboard` },
            { title: "Unfulfilled", path: `/${lang}/dashboard` },
            { title: "Returns", path: `/${lang}/dashboard` },
          ],
        },
        {
          title: "Products",
          path: `/${lang}/dashboard`,
          icon: <FileText className="size-4 shrink-0" />,
          subItems: [
            { title: "Catalog", path: `/${lang}/dashboard` },
            { title: "Inventory", path: `/${lang}/dashboard` },
            { title: "Collections", path: `/${lang}/dashboard` },
          ],
        },
        {
          title: "Customers",
          path: `/${lang}/users`,
          icon: <Users className="size-4 shrink-0" />,
          isActive: isRouteActive("users"),
        },
        {
          title: "Marketing",
          path: `/${lang}/dashboard`,
          icon: <Megaphone className="size-4 shrink-0" />,
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          title: "Store settings",
          path: `/${lang}/settings`,
          icon: <Settings className="size-4 shrink-0" />,
          isActive: isRouteActive("settings") || isRouteActive("profile"),
          subItems: [
            { title: "Store profile", path: `/${lang}/profile` },
            { title: "Shipping & delivery", path: `/${lang}/settings` },
            { title: "Payments", path: `/${lang}/settings` },
          ],
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* Brand Header: Efferd */}
      <SidebarHeader className="h-14 justify-center px-2 transition-all duration-300 ease-in-out">
        <SidebarMenuButton
          size="lg"
          asChild
          className="hover:bg-transparent justify-start p-0 transition-all duration-300 ease-in-out"
        >
          <Link
            href={`/${lang}/dashboard`}
            className="flex items-center justify-start gap-2.5 group-data-[collapsible=icon]:gap-0 transition-all duration-300 ease-in-out"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background transition-transform duration-300 ease-in-out hover:scale-105">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="size-1.5 rounded-[1px] bg-background" />
                <span className="size-1.5 rounded-[1px] bg-background" />
                <span className="size-1.5 rounded-[1px] bg-background" />
                <span className="size-1.5 rounded-[1px] bg-background" />
              </div>
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 max-w-28 opacity-100">
              Efferd
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="px-2 transition-all duration-300 ease-in-out">
        {/* Quick Action + Search button row */}
        <SidebarGroup className="p-0 mb-3 group-data-[collapsible=icon]:mb-2 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-start gap-2 px-0 transition-all duration-300 ease-in-out">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex-1 justify-start gap-2 bg-foreground text-background hover:bg-foreground/90 font-medium text-xs h-8 rounded-md group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:min-w-8 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex-none transition-all duration-300 ease-in-out overflow-hidden"
                  asChild
                >
                  <Link href={`/${lang}/dashboard`} className="flex items-center justify-start gap-2">
                    <Plus className="size-4 shrink-0 transition-transform duration-300 ease-in-out" />
                    <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 max-w-28 opacity-100">
                      Add product
                    </span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add product</TooltipContent>
            </Tooltip>
            <Button
              aria-label="Search"
              size="icon"
              variant="outline"
              className="size-8 shrink-0 rounded-md border-border/60 transition-all duration-300 ease-in-out overflow-hidden group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-75 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:pointer-events-none"
            >
              <Search className="size-4 text-muted-foreground transition-transform duration-300 ease-in-out" />
            </Button>
          </div>
        </SidebarGroup>

        {/* Navigation Groups */}
        {navGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2 transition-all duration-300 ease-in-out">
        <LatestChange
          badge="UPDATE"
          title="Smarter shipping quotes"
          description="Real-time rates at checkout now."
          readMoreLabel="Changelog"
          readMoreHref="#"
        />
        <SidebarMenu className="mt-2 group-data-[collapsible=icon]:mt-0 transition-all duration-300 ease-in-out">
          <SidebarMenuItem className="transition-all duration-300 ease-in-out">
            <SidebarMenuButton
              asChild
              tooltip="Seller help"
              className="text-muted-foreground hover:text-foreground text-xs justify-start transition-all duration-300 ease-in-out"
              size="sm"
            >
              <Link
                href={`/${lang}/settings`}
                className="flex items-center justify-start gap-2 group-data-[collapsible=icon]:gap-0 transition-all duration-300 ease-in-out"
              >
                <HelpCircle className="size-4 shrink-0 transition-transform duration-300 ease-in-out" />
                <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 max-w-28 opacity-100">
                  Seller help
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
