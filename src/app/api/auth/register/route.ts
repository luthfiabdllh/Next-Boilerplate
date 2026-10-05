import { type NextRequest } from 'next/server';
import { registerSchema } from '@/features/auth/types';
import { apiSuccess, apiError } from '@/lib/api-response';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return apiError(firstIssue?.message ?? 'Invalid registration data', 422, 422);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const backendResponse = await fetch(`${BACKEND_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          password: result.data.password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return apiSuccess(data, undefined, 201);
      }
    } catch {
      clearTimeout(timeoutId);
      // Fallback for template mock mode
    }

    // Template mock registration response
    const mockUser = {
      id: `usr_${Date.now()}`,
      name: result.data.name,
      email: result.data.email,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    return apiSuccess({ user: mockUser }, undefined, 201);
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : 'Internal Server Error',
      500,
      500
    );
  }
}
