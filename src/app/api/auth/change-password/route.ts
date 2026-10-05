import { type NextRequest } from 'next/server';
import { verifySession } from '@/lib/verify-session';
import { changePasswordSchema } from '@/features/auth/types';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  const session = await verifySession();

  if (!session) {
    return apiError('Unauthorized', 401, 401);
  }

  try {
    const body = await request.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return apiError(firstIssue?.message ?? 'Validation failed', 422, 422);
    }

    return apiSuccess({ success: true });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : 'Internal Server Error',
      500,
      500
    );
  }
}
