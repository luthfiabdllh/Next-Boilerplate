import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
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

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile and account settings.',
};

export default async function ProfilePage() {
  const session = await verifySession();

  const user: User = {
    id: session?.userId ?? 'usr_current',
    email: session?.email ?? '',
    name: typeof session?.name === 'string' ? session.name : 'User',
    role: (session?.role as 'admin' | 'moderator' | 'user') ?? 'user',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal profile and security settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
