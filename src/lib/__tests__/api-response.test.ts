import { describe, it, expect } from 'vitest';
import { formatApiError } from '@/lib/api-response';

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
});
