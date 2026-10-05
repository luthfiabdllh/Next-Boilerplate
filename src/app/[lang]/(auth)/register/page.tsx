import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { RegisterForm } from '@/features/auth/components/register-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RegisterPageProps {
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
    title: dict.auth.register.title,
    description: dict.auth.register.subtitle,
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            N
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dict.auth.register.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {dict.auth.register.subtitle}
          </p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="sr-only">Register form</CardTitle>
            <CardDescription className="sr-only">
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm lang={lang} dict={dict.auth.register} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
