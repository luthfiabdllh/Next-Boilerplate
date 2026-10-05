'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUserSchema, type CreateUserDTO, type UserEntity } from '../types';
import { useCreateUser, useUpdateUser } from '../api/use-mutations';
import type { Dictionary } from '@/lib/dictionaries/en';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserEntity | null;
  dict: Dictionary['users'];
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  dict,
}: UserFormDialogProps) {
  const isEditing = Boolean(user);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserDTO>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    },
  });

  React.useEffect(() => {
    if (open) {
      if (user) {
        reset({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        });
      } else {
        reset({
          name: '',
          email: '',
          role: 'user',
          status: 'active',
        });
      }
    }
  }, [open, user, reset]);

  const onSubmit = async (data: CreateUserDTO) => {
    try {
      if (isEditing && user) {
        await updateUserMutation.mutateAsync({ ...data, id: user.id });
        toast.success(dict.toasts.updated);
      } else {
        await createUserMutation.mutateAsync(data);
        toast.success(dict.toasts.created);
      }
      onOpenChange(false);
    } catch {
      // Handled in mutation onError
    }
  };

  const isPending = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? dict.dialog.editTitle : dict.dialog.createTitle}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? dict.dialog.editDescription : dict.dialog.createDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="user-name">{dict.dialog.nameLabel}</Label>
            <Input
              id="user-name"
              disabled={isPending}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'user-name-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p id="user-name-error" className="text-destructive text-xs" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="user-email">{dict.dialog.emailLabel}</Label>
            <Input
              id="user-email"
              type="email"
              disabled={isPending}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'user-email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="user-email-error" className="text-destructive text-xs" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div className="space-y-1.5">
            <Label htmlFor="user-role">{dict.dialog.roleLabel}</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{dict.roles.admin}</SelectItem>
                    <SelectItem value="moderator">{dict.roles.moderator}</SelectItem>
                    <SelectItem value="user">{dict.roles.user}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Status Field */}
          <div className="space-y-1.5">
            <Label htmlFor="user-status">{dict.dialog.statusLabel}</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger id="user-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{dict.statuses.active}</SelectItem>
                    <SelectItem value="inactive">{dict.statuses.inactive}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? dict.dialog.submitEdit : dict.dialog.submitCreate}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
