import * as z from 'zod';

// ─── Schemas ────────────────────────────────────────────────────────────────

/**
 * Login request schema.
 * NOTE: Zod v4 uses z.email() as a top-level validator (not .string().email()).
 */
export const loginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters.' })
    .max(128, { error: 'Password is too long.' }),
});

export const loginSchemaId = z.object({
  email: z.email({ error: 'Masukkan alamat email yang valid.' }),
  password: z
    .string()
    .min(8, { error: 'Kata sandi minimal 8 karakter.' })
    .max(128, { error: 'Kata sandi terlalu panjang.' }),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, { error: 'Full name is required.' }),
    email: z.email({ error: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters.' })
      .max(128, { error: 'Password is too long.' }),
    confirmPassword: z.string().min(8, { error: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const registerSchemaId = z
  .object({
    name: z.string().min(2, { error: 'Nama lengkap wajib diisi.' }),
    email: z.email({ error: 'Masukkan alamat email yang valid.' }),
    password: z
      .string()
      .min(8, { error: 'Kata sandi minimal 8 karakter.' })
      .max(128, { error: 'Kata sandi terlalu panjang.' }),
    confirmPassword: z.string().min(8, { error: 'Konfirmasi kata sandi Anda.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }),
});

export const forgotPasswordSchemaId = z.object({
  email: z.email({ error: 'Masukkan alamat email yang valid.' }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters.' }),
  email: z.email({ error: 'Please enter a valid email address.' }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: 'Current password is required.' }),
    newPassword: z
      .string()
      .min(8, { error: 'New password must be at least 8 characters.' })
      .max(128, { error: 'Password is too long.' }),
    confirmPassword: z.string().min(8, { error: 'Please confirm your new password.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match.',
    path: ['confirmPassword'],
  });

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'user', 'moderator']).default('user'),
  createdAt: z.string().datetime().optional(),
});

export const authResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      user: userSchema,
      accessToken: z.string(),
      refreshToken: z.string().optional(),
    })
    .optional(),
  error: z
    .object({
      code: z.union([z.number(), z.string()]),
      message: z.string(),
    })
    .optional(),
});

// ─── TypeScript Types ────────────────────────────────────────────────────────

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
