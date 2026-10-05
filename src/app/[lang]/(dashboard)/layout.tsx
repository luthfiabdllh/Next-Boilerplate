import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { verifySession } from '@/lib/verify-session';
import { getDictionary, type Locale } from '@/lib/i18n';
import { getQueryClient } from '@/lib/get-query-client';
import { authKeys } from '@/features/auth/api/query-keys';
import { getCurrentUserServer } from '@/features/auth/api/server-fetch';
import { DashboardHeader } from '@/components/layouts/dashboard-header';
import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
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
  params,
}: DashboardLayoutProps) {
  const { lang } = await params;
  const [session, dict, queryClient] = await Promise.all([
    verifySession(),
    getDictionary(lang as Locale),
    Promise.resolve(getQueryClient()),
  ]);

  if (!session) {
    redirect(`/${lang}/login`);
  }

  const userName = typeof session?.name === 'string' ? session.name : 'User';

  // Prefetch the current user data across all dashboard routes
  await queryClient.prefetchQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUserServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar lang={lang} dict={dict.dashboard.navigation} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            lang={lang}
            userName={userName}
            logoutLabel={dict.auth.logout.button}
          />
          <main
            id="main-content"
            className="flex-1 overflow-y-auto p-6"
            aria-label="Dashboard main content"
          >
            {children}
          </main>
        </div>
      </div>
    </HydrationBoundary>
  );
}
