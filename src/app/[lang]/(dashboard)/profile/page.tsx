import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { getDictionary, type Locale } from '@/lib/i18n';
import { ProfileForm } from '@/features/auth/components/profile-form';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { User } from '@/features/auth/types';

interface ProfilePageProps {
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
    title: dict.profile.title,
    description: dict.profile.subtitle,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { lang } = await params;
  const [dict, session] = await Promise.all([
    getDictionary(lang as Locale),
    verifySession(),
  ]);

  const user: User = {
    id: session?.userId ?? 'usr_current',
    email: session?.email ?? '',
    name: typeof session?.name === 'string' ? session.name : 'User',
    role: (session?.role as 'admin' | 'moderator' | 'user') ?? 'user',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{dict.profile.title}</h1>
        <p className="text-muted-foreground mt-1">{dict.profile.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>{dict.profile.personalInfoTitle}</CardTitle>
            <CardDescription>{dict.profile.personalInfoDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} dict={dict.profile} />
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>{dict.profile.changePasswordTitle}</CardTitle>
            <CardDescription>{dict.profile.changePasswordDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm dict={dict.profile} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
