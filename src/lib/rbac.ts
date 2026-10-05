/**
 * Role-Based Access Control (RBAC) System
 *
 * Defines application roles, granular permissions, and authorization helpers.
 * Used across Server Components, Route Handlers, and Client Components.
 */

export const ROLES = ['admin', 'moderator', 'user'] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  'users:read',
  'users:create',
  'users:update',
  'users:delete',
  'settings:manage',
  'reports:view',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Role to permissions mapping matrix.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'settings:manage',
    'reports:view',
  ],
  moderator: ['users:read', 'users:update', 'reports:view'],
  user: [],
};

/**
 * Check if a role possesses a specific permission.
 */
export function hasPermission(
  role: Role | string | undefined | null,
  permission: Permission
): boolean {
  if (!role || !isValidRole(role)) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Check if a user's role matches any of the allowed roles.
 */
export function hasAnyRole(
  userRole: Role | string | undefined | null,
  allowedRoles: readonly Role[]
): boolean {
  if (!userRole || !isValidRole(userRole)) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Type guard for Role.
 */
export function isValidRole(role: unknown): role is Role {
  return typeof role === 'string' && ROLES.includes(role as Role);
}
