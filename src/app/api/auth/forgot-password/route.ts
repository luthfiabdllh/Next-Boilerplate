import { type NextRequest } from 'next/server';
import { forgotPasswordSchema } from '@/features/auth/types';
import { apiSuccess, apiError } from '@/lib/api-response';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return apiError(firstIssue?.message ?? 'Invalid email address', 422, 422);
    }

    try {
      await fetch(`${BACKEND_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: result.data.email }),
      });
    } catch {
      // Mock / fallback
    }

    return apiSuccess({ sent: true, email: result.data.email });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : 'Internal Server Error',
      500,
      500
    );
  }
}
