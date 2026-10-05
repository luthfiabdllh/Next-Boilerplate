'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { changePasswordSchema, type ChangePasswordDTO } from '../types';
import { useChangePassword } from '../api/use-mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordDTO>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordDTO) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success('Password updated successfully');
      reset();
    } catch {
      // Handled in mutation onError
    }
  };

  const isPending = isSubmitting || changePasswordMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Password */}
      <div className="space-y-1.5">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          disabled={isPending}
          aria-invalid={Boolean(errors.currentPassword)}
          aria-describedby={errors.currentPassword ? 'curr-pwd-error' : undefined}
          {...register('currentPassword')}
        />
        {errors.currentPassword && (
          <p id="curr-pwd-error" className="text-destructive text-xs" role="alert">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          disabled={isPending}
          aria-invalid={Boolean(errors.newPassword)}
          aria-describedby={errors.newPassword ? 'new-pwd-error' : undefined}
          {...register('newPassword')}
        />
        {errors.newPassword && (
          <p id="new-pwd-error" className="text-destructive text-xs" role="alert">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
        <Input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          disabled={isPending}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? 'confirm-new-pwd-error' : undefined}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p id="confirm-new-pwd-error" className="text-destructive text-xs" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Updating password...
          </>
        ) : (
          'Update Password'
        )}
      </Button>
    </form>
  );
}
