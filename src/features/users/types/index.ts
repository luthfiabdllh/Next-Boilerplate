import * as z from 'zod';
import { ROLES } from '@/lib/rbac';

export const USER_STATUSES = ['active', 'inactive'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const userEntitySchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.email(),
  role: z.enum(ROLES),
  status: z.enum(USER_STATUSES),
  createdAt: z.string(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters.' }),
  email: z.email({ error: 'Please enter a valid email address.' }),
  role: z.enum(ROLES, { error: 'Please select a valid role.' }),
  status: z.enum(USER_STATUSES, { error: 'Please select a status.' }),
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string(),
});

export const userFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  role: z.enum([...ROLES, 'all']).optional().default('all'),
  status: z.enum([...USER_STATUSES, 'all']).optional().default('all'),
  sortBy: z.enum(['name', 'email', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type UserEntity = z.infer<typeof userEntitySchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserFilterDTO = z.infer<typeof userFilterSchema>;
