'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { usersKeys } from './query-keys';
import type { ApiResponse, PaginationMeta } from '@/lib/api-response';
import type { UserEntity, UserFilterDTO } from '../types';

export interface UsersListResult {
  items: UserEntity[];
  meta: PaginationMeta;
}

export function useUsers(filters: Partial<UserFilterDTO> = {}) {
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.set('page', String(filters.page));
  if (filters.limit) queryParams.set('limit', String(filters.limit));
  if (filters.search) queryParams.set('search', filters.search);
  if (filters.role && filters.role !== 'all') queryParams.set('role', filters.role);
  if (filters.status && filters.status !== 'all') queryParams.set('status', filters.status);
  if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.set('sortOrder', filters.sortOrder);

  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: async (): Promise<UsersListResult> => {
      const qs = queryParams.toString();
      const url = `/users${qs ? `?${qs}` : ''}`;
      const { data } = await apiClient.get<ApiResponse<UserEntity[]>>(url);

      return {
        items: data.data ?? [],
        meta: data.meta ?? {
          page: 1,
          limit: 10,
          total: data.data?.length ?? 0,
          totalPages: 1,
        },
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async (): Promise<UserEntity | null> => {
      try {
        const { data } = await apiClient.get<ApiResponse<UserEntity>>(`/users/${id}`);
        return data.data ?? null;
      } catch {
        return null;
      }
    },
    enabled: Boolean(id),
  });
}
