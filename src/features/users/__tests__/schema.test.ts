import { describe, it, expect } from 'vitest';
import {
  createUserSchema,
  updateUserSchema,
  userFilterSchema,
} from '@/features/users/types';

describe('Users Schemas', () => {
  describe('createUserSchema', () => {
    it('validates a valid user payload', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
      });
      expect(result.success).toBe(true);
    });

    it('rejects short name or invalid email', () => {
      expect(
        createUserSchema.safeParse({
          name: 'J',
          email: 'invalid',
          role: 'user',
        }).success
      ).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('requires an id and allows partial fields', () => {
      const result = updateUserSchema.safeParse({
        id: 'usr_1',
        name: 'Updated Name',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('userFilterSchema', () => {
    it('parses defaults correctly', () => {
      const result = userFilterSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
        expect(result.data.role).toBe('all');
        expect(result.data.status).toBe('all');
      }
    });

    it('coerces string numbers for page and limit', () => {
      const result = userFilterSchema.safeParse({
        page: '2',
        limit: '25',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(25);
      }
    });
  });
});
