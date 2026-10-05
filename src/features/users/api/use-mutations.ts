'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { formatApiError, type ApiResponse } from '@/lib/api-response';
import { usersKeys } from './query-keys';
import type { CreateUserDTO, UpdateUserDTO, UserEntity } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserDTO): Promise<UserEntity> => {
      const { data } = await apiClient.post<ApiResponse<UserEntity>>('/users', payload);
      if (!data.data) throw new Error('Failed to create user');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    onError: (error) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserDTO): Promise<UserEntity> => {
      const { id, ...body } = payload;
      const { data } = await apiClient.patch<ApiResponse<UserEntity>>(`/users/${id}`, body);
      if (!data.data) throw new Error('Failed to update user');
      return data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
    },
    onError: (error) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    onError: (error) => {
      toast.error(formatApiError(error));
    },
  });
}
