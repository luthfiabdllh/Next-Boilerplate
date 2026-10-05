'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { updateProfileSchema, type UpdateProfileDTO, type User } from '../types';
import { useUpdateProfile } from '../api/use-mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileDTO>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (data: UpdateProfileDTO) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success('Profile updated successfully');
    } catch {
      // Handled in mutation onError
    }
  };

  const isPending = isSubmitting || updateProfileMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role Display */}
      <div className="space-y-1.5">
        <Label>Role</Label>
        <div>
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-1.5">
        <Label htmlFor="profile-name">Full Name</Label>
        <Input
          id="profile-name"
          type="text"
          disabled={isPending}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'profile-name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="profile-name-error" className="text-destructive text-xs" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <Label htmlFor="profile-email">Email Address</Label>
        <Input
          id="profile-email"
          type="email"
          disabled={isPending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'profile-email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="profile-email-error" className="text-destructive text-xs" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending || !isDirty}
        className="mt-2"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
}
