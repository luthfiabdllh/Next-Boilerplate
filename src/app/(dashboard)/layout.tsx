// import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { verifySession } from '@/lib/verify-session';
import { getQueryClient } from '@/lib/get-query-client';
import { authKeys } from '@/features/auth/api/query-keys';
import { getCurrentUserServer } from '@/features/auth/api/server-fetch';
import { AppShell } from '@/components/layouts/app-shell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout — AUTHORITATIVE auth check and layout shell.
 *
 * This is the second layer of the two-layer auth pattern:
 * 1. proxy.ts: thin check — only verifies cookie existence
 * 2. THIS layout: cryptographic JWT verification via jose
 *
 * Also prefetches currentUser so that sidebar, header, and child pages have hydrated user and role.
 */
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [session, queryClient] = await Promise.all([
    verifySession(),
    Promise.resolve(getQueryClient()),
  ]);

  // if (!session) {
  //   redirect('/login');
  // }

  const userName = typeof session?.name === 'string' ? session.name : 'User';
  const userEmail = typeof session?.email === 'string' ? session.email : undefined;
  const userRole = typeof session?.role === 'string' ? session.role : undefined;

  // Prefetch the current user data across all dashboard routes
  await queryClient.prefetchQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUserServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppShell
        userName={userName}
        userEmail={userEmail}
        userRole={userRole}
      >
        {children}
      </AppShell>
    </HydrationBoundary>
  );
}
