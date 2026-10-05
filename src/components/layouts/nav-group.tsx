"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/use-permissions";
import type { SidebarNavGroup } from "@/components/layouts/nav-config";

export function NavGroup({ label, items, roles }: SidebarNavGroup) {
  const { hasRole } = usePermissions();

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
        {visibleItems.map((item) => (
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
              {item.subItems && item.subItems.length > 0 ? (
                <>
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
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems
                        .filter((sub) => !sub.roles || hasRole(sub.roles))
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
                </>
              ) : (
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
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
