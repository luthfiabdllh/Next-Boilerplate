import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ForgotPasswordPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.auth.forgotPassword.title,
    description: dict.auth.forgotPassword.subtitle,
  };
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            N
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dict.auth.forgotPassword.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {dict.auth.forgotPassword.subtitle}
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="sr-only">Forgot password form</CardTitle>
            <CardDescription className="sr-only">
              Enter your email to request a password reset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm lang={lang} dict={dict.auth.forgotPassword} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
