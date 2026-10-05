import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '@/features/auth/types';

describe('loginSchema (Zod v4)', () => {
  describe('valid inputs', () => {
    it('accepts a valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'SecureP@ss1',
      });
      expect(result.success).toBe(true);
    });

    it('accepts password at minimum length (8 chars)', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: '12345678',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('rejects an invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'ValidPass1',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('email');
    });

    it('rejects an empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'ValidPass1',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('email');
    });

    it('rejects a password shorter than 8 characters', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '1234567',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('password');
    });

    it('rejects an empty password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('password');
    });

    it('rejects when both fields are missing', () => {
      const result = loginSchema.safeParse({});
      expect(result.success).toBe(false);
      expect(result.error?.issues.length).toBeGreaterThanOrEqual(2);
    });

    it('rejects a password longer than 128 characters', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'A'.repeat(129),
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('password');
    });
  });

  describe('error messages', () => {
    it('returns the correct error message for invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-valid',
        password: 'ValidPass1',
      });
      expect(result.success).toBe(false);
      const emailIssue = result.error?.issues.find((i) =>
        i.path.includes('email')
      );
      expect(emailIssue?.message).toBe('Please enter a valid email address.');
    });

    it('returns the correct error message for short password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      const passIssue = result.error?.issues.find((i) =>
        i.path.includes('password')
      );
      expect(passIssue?.message).toBe('Password must be at least 8 characters.');
    });
  });
});

describe('registerSchema (Zod v4)', () => {
  it('accepts valid registration input', () => {
    const result = registerSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched password and confirmPassword', () => {
    const result = registerSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('confirmPassword');
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'invalid-email' });
    expect(result.success).toBe(false);
  });
});

describe('profile & password schemas', () => {
  it('validates updateProfileSchema', () => {
    expect(updateProfileSchema.safeParse({ name: 'Bob', email: 'bob@example.com' }).success).toBe(true);
    expect(updateProfileSchema.safeParse({ name: '', email: 'bob@example.com' }).success).toBe(false);
  });

  it('validates changePasswordSchema', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'oldpass123',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123',
      }).success
    ).toBe(true);

    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'oldpass123',
        newPassword: 'newpass123',
        confirmPassword: 'mismatchpass',
      }).success
    ).toBe(false);
  });
});
