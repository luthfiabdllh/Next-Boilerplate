import type { ReactNode } from "react";
import type { Role } from "@/lib/rbac";

export type SidebarNavItem = {
  title: string;
  path: string;
  icon?: ReactNode;
  badge?: string;
  roles?: readonly Role[];
  isActive?: boolean;
  subItems?: SidebarNavItem[];
  external?: boolean;
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
  roles?: readonly Role[];
};
