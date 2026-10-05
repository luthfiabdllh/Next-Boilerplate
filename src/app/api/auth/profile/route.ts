import { type NextRequest } from 'next/server';
import { verifySession } from '@/lib/verify-session';
import { updateProfileSchema } from '@/features/auth/types';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET() {
  const session = await verifySession();

  if (!session) {
    return apiError('Unauthorized', 401, 401);
  }

  return apiSuccess({
    id: session.userId,
    email: session.email,
    name: typeof session.name === 'string' ? session.name : 'User',
    role: session.role ?? 'user',
  });
}

export async function PATCH(request: NextRequest) {
  const session = await verifySession();

  if (!session) {
    return apiError('Unauthorized', 401, 401);
  }

  try {
    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return apiError(firstIssue?.message ?? 'Validation failed', 422, 422);
    }

    return apiSuccess({
      id: session.userId,
      email: result.data.email,
      name: result.data.name,
      role: session.role ?? 'user',
    });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : 'Internal Server Error',
      500,
      500
    );
  }
}
