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

export function ForgotPasswordForm() {
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
      toast.success('Password reset instructions sent');
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
        <p className="text-muted-foreground text-sm">
          If an account exists with this email, you will receive password reset instructions shortly.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
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
        <Label htmlFor="forgot-email">Email address</Label>
        <div className="relative">
          <Input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
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
            Sending link...
          </>
        ) : (
          'Send reset link'
        )}
      </Button>

      <div className="text-center text-sm">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
