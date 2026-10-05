'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { authKeys } from './query-keys';
import { toast } from 'sonner';
import { formatApiError } from '@/lib/api-response';
import type {
  LoginDTO,
  RegisterDTO,
  ForgotPasswordDTO,
  UpdateProfileDTO,
  ChangePasswordDTO,
  User,
  AuthResponse,
} from '../types';

// ─── Login ────────────────────────────────────────────────────────────────

/**
 * Login mutation — calls the BFF Route Handler which sets the httpOnly cookie.
 * On success, populates the currentUser cache.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginDTO): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (response) => {
      if (response.success && response.data?.user) {
        queryClient.setQueryData<User>(authKeys.currentUser(), response.data.user);
      }
    },
    onError: () => {
      // Error display is handled by the form component via mutation state
    },
  });
};

// ─── Register ─────────────────────────────────────────────────────────────

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterDTO) => {
      const { data } = await apiClient.post('/auth/register', payload);
      return data;
    },
  });
};

// ─── Forgot Password ──────────────────────────────────────────────────────

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordDTO) => {
      const { data } = await apiClient.post('/auth/forgot-password', payload);
      return data;
    },
  });
};

// ─── Profile Update ───────────────────────────────────────────────────────

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfileDTO): Promise<User> => {
      const { data } = await apiClient.patch<{ data: User }>('/auth/profile', payload);
      return data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User>(authKeys.currentUser(), updatedUser);
    },
    onError: (error) => {
      toast.error(formatApiError(error));
    },
  });
};

// ─── Change Password ──────────────────────────────────────────────────────

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordDTO) => {
      const { data } = await apiClient.post('/auth/change-password', payload);
      return data;
    },
    onError: (error) => {
      toast.error(formatApiError(error));
    },
  });
};

// ─── Logout ────────────────────────────────────────────────────────────────

/**
 * Logout mutation — calls the BFF Route Handler which clears httpOnly cookies.
 * On success, invalidates all auth-related cache entries.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.success('You have been signed out.');

      const lang = document.documentElement.lang ?? 'en';
      window.location.href = `/${lang}/login`;
    },
    onError: () => {
      toast.error('Failed to sign out. Please try again.');
    },
  });
};
