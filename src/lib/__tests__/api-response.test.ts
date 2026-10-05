import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { apiSuccess, apiError, formatApiError } from '@/lib/api-response';

describe('apiSuccess', () => {
  it('creates success response with data', async () => {
    const res = apiSuccess({ id: '123' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      success: true,
      data: { id: '123' },
    });
  });

  it('creates success response with pagination meta', async () => {
    const meta = { page: 1, limit: 10, total: 50, totalPages: 5 };
    const res = apiSuccess(['item1'], meta, 201);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({
      success: true,
      data: ['item1'],
      meta,
    });
  });
});

describe('apiError', () => {
  it('creates standard error response', async () => {
    const res = apiError('Unauthorized', 401, 401);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: {
        code: 401,
        message: 'Unauthorized',
      },
    });
  });

  it('creates error response with details', async () => {
    const res = apiError('Validation failed', 'VALIDATION_ERR', 422, { field: 'email' });
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: {
        code: 'VALIDATION_ERR',
        message: 'Validation failed',
        details: { field: 'email' },
      },
    });
  });
});

describe('formatApiError', () => {
  it('formats Error instance', () => {
    expect(formatApiError(new Error('Test error message'))).toBe('Test error message');
  });

  it('formats string error', () => {
    expect(formatApiError('Something went wrong')).toBe('Something went wrong');
  });

  it('formats unknown error with fallback', () => {
    expect(formatApiError(null, 'Custom fallback')).toBe('Custom fallback');
    expect(formatApiError(12345)).toBe('An unexpected error occurred. Please try again.');
  });

  it('formats AxiosError with nested API error payload', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { error: { message: 'Invalid credentials' } },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    );
    expect(formatApiError(error)).toBe('Invalid credentials');
  });

  it('formats AxiosError with top-level message', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { message: 'Direct message from server' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    );
    expect(formatApiError(error)).toBe('Direct message from server');
  });

  it('formats AxiosError with error message fallback', () => {
    const error = new AxiosError('Network Error');
    expect(formatApiError(error)).toBe('Network Error');
  });
});
