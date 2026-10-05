import { describe, it, expect } from 'vitest';
import { usersKeys } from '@/features/users/api/query-keys';

describe('usersKeys', () => {
  it('generates correct key hierarchies', () => {
    expect(usersKeys.all).toEqual(['users']);
    expect(usersKeys.lists()).toEqual(['users', 'list']);
    expect(usersKeys.list({ page: 2, limit: 10 })).toEqual([
      'users',
      'list',
      { page: 2, limit: 10 },
    ]);
    expect(usersKeys.details()).toEqual(['users', 'detail']);
    expect(usersKeys.detail('usr_123')).toEqual(['users', 'detail', 'usr_123']);
  });
});
