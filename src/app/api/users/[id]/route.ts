import { type NextRequest } from 'next/server';
import { verifySession } from '@/lib/verify-session';
import { updateUserSchema } from '@/features/users/types';
import { apiSuccess, apiError } from '@/lib/api-response';
import { mockUsersDatabase } from '../data';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const session = await verifySession();
  if (!session) return apiError('Unauthorized', 401, 401);

  const { id } = await params;
  const user = mockUsersDatabase.find((u) => u.id === id);

  if (!user) {
    return apiError('User not found', 404, 404);
  }

  return apiSuccess(user);
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const session = await verifySession();
  if (!session) return apiError('Unauthorized', 401, 401);

  const { id } = await params;
  const index = mockUsersDatabase.findIndex((u) => u.id === id);

  if (index === -1) {
    return apiError('User not found', 404, 404);
  }

  try {
    const body = await request.json();
    const result = updateUserSchema.safeParse({ ...body, id });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return apiError(firstIssue?.message ?? 'Validation failed', 422, 422);
    }

    mockUsersDatabase[index] = {
      ...mockUsersDatabase[index],
      ...result.data,
    };

    return apiSuccess(mockUsersDatabase[index]);
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : 'Internal Server Error',
      500,
      500
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteProps) {
  const session = await verifySession();
  if (!session) return apiError('Unauthorized', 401, 401);

  const { id } = await params;
  const index = mockUsersDatabase.findIndex((u) => u.id === id);

  if (index === -1) {
    return apiError('User not found', 404, 404);
  }

  mockUsersDatabase.splice(index, 1);

  return apiSuccess({ deleted: true });
}
