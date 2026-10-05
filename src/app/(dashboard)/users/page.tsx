import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { UserTable } from '@/features/users/components/user-table';
import { hasAnyRole, type Role } from '@/lib/rbac';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage users and roles',
};

export default async function UsersPage() {
  const session = await verifySession();

  const userRole = (session?.role as Role) ?? 'user';
  const isAuthorized = hasAnyRole(userRole, ['admin', 'moderator']);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <div className="bg-destructive/10 text-destructive mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          You do not have the required permissions to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">Manage system users, access roles, and account statuses.</p>
      </div>

      <UserTable />
    </div>
  );
}
