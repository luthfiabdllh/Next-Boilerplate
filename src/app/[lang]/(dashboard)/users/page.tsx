import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { getDictionary, type Locale } from '@/lib/i18n';
import { UserTable } from '@/features/users/components/user-table';
import { hasAnyRole, type Role } from '@/lib/rbac';
import { ShieldAlert } from 'lucide-react';

interface UsersPageProps {
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
    title: dict.users.title,
    description: dict.users.subtitle,
  };
}

export default async function UsersPage({ params }: UsersPageProps) {
  const { lang } = await params;
  const [dict, session] = await Promise.all([
    getDictionary(lang as Locale),
    verifySession(),
  ]);

  const userRole = (session?.role as Role) ?? 'user';
  const isAuthorized = hasAnyRole(userRole, ['admin', 'moderator']);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <div className="bg-destructive/10 text-destructive mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-2xl font-bold">{dict.rbac.accessDenied}</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {dict.rbac.unauthorizedRoleMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{dict.users.title}</h1>
        <p className="text-muted-foreground mt-1">{dict.users.subtitle}</p>
      </div>

      <UserTable dict={dict.users} />
    </div>
  );
}
