'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

import { forgotPasswordSchema, type ForgotPasswordDTO } from '../types';
import { useForgotPassword } from '../api/use-mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatApiError } from '@/lib/api-response';
import type { Dictionary } from '@/lib/dictionaries/en';

interface ForgotPasswordFormProps {
  lang: string;
  dict: Dictionary['auth']['forgotPassword'];
}

export function ForgotPasswordForm({ lang, dict }: ForgotPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordDTO>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordDTO) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setIsSubmitted(true);
      toast.success(dict.successMessage);
    } catch (err: unknown) {
      toast.error(formatApiError(err));
    }
  };

  const isPending = isSubmitting || forgotPasswordMutation.isPending;

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle size={24} />
        </div>
        <p className="text-muted-foreground text-sm">{dict.successMessage}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/${lang}/login`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {dict.backToLogin}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      id="forgot-password-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      aria-label="Forgot password form"
    >
      <div className="space-y-1.5">
        <Label htmlFor="forgot-email">{dict.emailLabel}</Label>
        <div className="relative">
          <Input
            id="forgot-email"
            type="email"
            placeholder={dict.emailPlaceholder}
            autoComplete="email"
            disabled={isPending}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'forgot-email-error' : undefined}
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
          <p id="forgot-email-error" className="text-destructive text-xs" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        id="forgot-submit"
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

      <div className="text-center text-sm">
        <Link
          href={`/${lang}/login`}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          {dict.backToLogin}
        </Link>
      </div>
    </form>
  );
}
