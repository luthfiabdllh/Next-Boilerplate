import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  hasAnyRole,
  isValidRole,
  PERMISSIONS,
} from '@/lib/rbac';

describe('RBAC System', () => {
  describe('isValidRole', () => {
    it('returns true for defined roles', () => {
      expect(isValidRole('admin')).toBe(true);
      expect(isValidRole('moderator')).toBe(true);
      expect(isValidRole('user')).toBe(true);
    });

    it('returns false for invalid role strings or values', () => {
      expect(isValidRole('superadmin')).toBe(false);
      expect(isValidRole(null)).toBe(false);
      expect(isValidRole(undefined)).toBe(false);
      expect(isValidRole(123)).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('grants admin all permissions', () => {
      for (const permission of PERMISSIONS) {
        expect(hasPermission('admin', permission)).toBe(true);
      }
    });

    it('grants moderator limited permissions', () => {
      expect(hasPermission('moderator', 'users:read')).toBe(true);
      expect(hasPermission('moderator', 'users:update')).toBe(true);
      expect(hasPermission('moderator', 'users:delete')).toBe(false);
      expect(hasPermission('moderator', 'settings:manage')).toBe(false);
    });

    it('denies user privileged permissions', () => {
      expect(hasPermission('user', 'users:create')).toBe(false);
      expect(hasPermission('user', 'users:delete')).toBe(false);
    });

    it('safely handles null/undefined role', () => {
      expect(hasPermission(null, 'users:read')).toBe(false);
      expect(hasPermission(undefined, 'users:read')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('returns true when user role is in the list', () => {
      expect(hasAnyRole('admin', ['admin', 'moderator'])).toBe(true);
      expect(hasAnyRole('moderator', ['admin', 'moderator'])).toBe(true);
    });

    it('returns false when user role is not in the list', () => {
      expect(hasAnyRole('user', ['admin', 'moderator'])).toBe(false);
    });

    it('safely handles empty or invalid roles', () => {
      expect(hasAnyRole(undefined, ['admin'])).toBe(false);
      expect(hasAnyRole('invalid', ['admin'])).toBe(false);
    });
  });
});
