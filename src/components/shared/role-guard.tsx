'use client';

import * as React from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import type { Permission, Role } from '@/lib/rbac';

interface CanProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally render children if the current user has the specified permission.
 */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { can, isLoading } = usePermissions();

  if (isLoading) return null;
  if (!can(permission)) return <>{fallback}</>;

  return <>{children}</>;
}

interface RoleGuardProps {
  roles: Role | readonly Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally render children if the current user has any of the specified roles.
 */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { hasRole, isLoading } = usePermissions();

  if (isLoading) return null;
  if (!hasRole(roles)) return <>{fallback}</>;

  return <>{children}</>;
}
