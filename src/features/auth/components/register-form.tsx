'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';

import { registerSchema, type RegisterDTO } from '../types';
import { useRegister } from '../api/use-mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatApiError } from '@/lib/api-response';
import type { Dictionary } from '@/lib/dictionaries/en';

interface RegisterFormProps {
  lang: string;
  dict: Dictionary['auth']['register'];
}

export function RegisterForm({ lang, dict }: RegisterFormProps) {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterDTO) => {
    try {
      await registerMutation.mutateAsync(data);
      toast.success(dict.successToast);
      router.push(`/${lang}/login`);
    } catch (err: unknown) {
      toast.error(formatApiError(err, dict.errors.passwordMismatch));
    }
  };

  const isPending = isSubmitting || registerMutation.isPending;

  return (
    <form
      id="register-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      aria-label="Register form"
    >
      {/* Name Field */}
      <div className="space-y-1.5">
        <Label htmlFor="register-name">{dict.nameLabel}</Label>
        <div className="relative">
          <Input
            id="register-name"
            type="text"
            placeholder={dict.namePlaceholder}
            autoComplete="name"
            disabled={isPending}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
            className="pl-9"
            {...register('name')}
          />
          <User
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
        {errors.name && (
          <p id="register-name-error" className="text-destructive text-xs" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <Label htmlFor="register-email">{dict.emailLabel}</Label>
        <div className="relative">
          <Input
            id="register-email"
            type="email"
            placeholder={dict.emailPlaceholder}
            autoComplete="email"
            disabled={isPending}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            className="pl-9"
            {...register('email')}
          />
          <Mail
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
        {errors.email && (
          <p id="register-email-error" className="text-destructive text-xs" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <Label htmlFor="register-password">{dict.passwordLabel}</Label>
        <div className="relative">
          <Input
            id="register-password"
            type="password"
            placeholder={dict.passwordPlaceholder}
            autoComplete="new-password"
            disabled={isPending}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'register-password-error' : undefined}
            className="pl-9"
            {...register('password')}
          />
          <Lock
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
        {errors.password && (
          <p id="register-password-error" className="text-destructive text-xs" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5">
        <Label htmlFor="register-confirm-password">{dict.confirmPasswordLabel}</Label>
        <div className="relative">
          <Input
            id="register-confirm-password"
            type="password"
            placeholder={dict.confirmPasswordPlaceholder}
            autoComplete="new-password"
            disabled={isPending}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
            className="pl-9"
            {...register('confirmPassword')}
          />
          <Lock
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
        {errors.confirmPassword && (
          <p id="register-confirm-password-error" className="text-destructive text-xs" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        id="register-submit"
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            {dict.submittingButton}
          </>
        ) : (
          dict.submitButton
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{dict.hasAccount} </span>
        <Link
          href={`/${lang}/login`}
          className="text-primary hover:underline font-medium"
        >
          {dict.signIn}
        </Link>
      </div>
    </form>
  );
}
