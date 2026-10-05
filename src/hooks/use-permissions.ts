'use client';

import { useCurrentUser } from '@/features/auth/api/use-queries';
import { hasPermission, hasAnyRole, type Permission, type Role } from '@/lib/rbac';

/**
 * Hook to evaluate authorization rules in Client Components based on the current user.
 */
export function usePermissions() {
  const { data: user, isLoading } = useCurrentUser();
  const role = user?.role as Role | undefined;

  return {
    user,
    role,
    isLoading,
    can: (permission: Permission) => hasPermission(role, permission),
    hasRole: (roles: Role | readonly Role[]) => {
      const roleList = Array.isArray(roles) ? roles : [roles];
      return hasAnyRole(role, roleList);
    },
  };
}
