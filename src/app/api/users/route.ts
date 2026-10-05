import { type NextRequest } from 'next/server';
import { verifySession } from '@/lib/verify-session';
import { createUserSchema, userFilterSchema } from '@/features/users/types';
import { apiSuccess, apiError } from '@/lib/api-response';
import { mockUsersDatabase } from './data';

export async function GET(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return apiError('Unauthorized', 401, 401);
  }

  const { searchParams } = new URL(request.url);
  const parsed = userFilterSchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    role: searchParams.get('role') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    sortBy: searchParams.get('sortBy') ?? undefined,
    sortOrder: searchParams.get('sortOrder') ?? undefined,
  });

  const filters = parsed.success
    ? parsed.data
    : {
        page: 1,
        limit: 10,
        search: '',
        role: 'all' as const,
        status: 'all' as const,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      };

  let items = [...mockUsersDatabase];

  // Search filter
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  // Role filter
  if (filters.role && filters.role !== 'all') {
    items = items.filter((u) => u.role === filters.role);
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    items = items.filter((u) => u.status === filters.status);
  }

  // Sorting
  items.sort((a, b) => {
    const aVal = a[filters.sortBy as keyof typeof a] ?? '';
    const bVal = b[filters.sortBy as keyof typeof b] ?? '';
    if (filters.sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const total = items.length;
  const totalPages = Math.ceil(total / filters.limit) || 1;
  const start = (filters.page - 1) * filters.limit;
  const paginatedItems = items.slice(start, start + filters.limit);

  return apiSuccess(paginatedItems, {
    page: filters.page,
    limit: filters.limit,
    total,
    totalPages,
  });
}

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return apiError('Unauthorized', 401, 401);
  }

  try {
    const body = await request.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return apiError(firstIssue?.message ?? 'Validation failed', 422, 422);
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: result.data.name,
      email: result.data.email,
      role: result.data.role,
      status: result.data.status,
      createdAt: new Date().toISOString(),
    };

    mockUsersDatabase.unshift(newUser);

    return apiSuccess(newUser, undefined, 201);
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : 'Internal Server Error',
      500,
      500
    );
  }
}
