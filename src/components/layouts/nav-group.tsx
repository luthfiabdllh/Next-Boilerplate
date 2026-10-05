"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/use-permissions";
import type { SidebarNavGroup } from "@/components/layouts/nav-config";

export function NavGroup({ label, items, roles }: SidebarNavGroup) {
  const { hasRole } = usePermissions();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  if (roles && !hasRole(roles)) {
    return null;
  }

  // Filter items visible to the current user's role
  const visibleItems = items.filter((item) => !item.roles || hasRole(item.roles));

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {visibleItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;

          // In collapsed icon mode, show a dropdown menu on click/hover for items with subItems
          if (hasSubItems && isCollapsed) {
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      isActive={
                        item.isActive ||
                        item.subItems?.some((sub) => !!sub.isActive)
                      }
                      tooltip={item.title}
                    >
                      {item.icon}
                      <span className="sr-only">{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="min-w-48 bg-popover border-border shadow-md"
                  >
                    <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground">
                      {item.title}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.subItems
                      ?.filter((sub) => !sub.roles || hasRole(sub.roles))
                      .map((subItem) => (
                        <DropdownMenuItem key={subItem.title} asChild>
                          <Link
                            href={subItem.path}
                            className="flex items-center gap-2 cursor-pointer text-xs"
                          >
                            {subItem.icon}
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          }

          // In expanded mode, show collapsible tree
          if (hasSubItems) {
            return (
              <Collapsible
                asChild
                className="group/collapsible"
                defaultOpen={
                  !!item.isActive ||
                  item.subItems?.some((sub) => !!sub.isActive)
                }
                key={item.title}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.title}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                      <ChevronRight className="ml-auto size-4 transition-all duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-75 group-data-[collapsible=icon]:max-w-0 overflow-hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems
                        ?.filter((sub) => !sub.roles || hasRole(sub.roles))
                        .map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.isActive}
                            >
                              <Link href={subItem.path}>
                                {subItem.icon}
                                <span>{subItem.title}</span>
                                {subItem.badge && (
                                  <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Simple link item without sub-items
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.title}
              >
                <Link href={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
