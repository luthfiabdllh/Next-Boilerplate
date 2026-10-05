'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, User, Settings } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { usePermissions } from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
import type { Dictionary } from '@/lib/dictionaries/en';
import type { Role } from '@/lib/rbac';

interface DashboardSidebarProps {
  lang: string;
  dict: Dictionary['dashboard']['navigation'];
}

interface NavItem {
  key: keyof Dictionary['dashboard']['navigation'];
  icon: typeof LayoutDashboard;
  href: string;
  roles?: readonly Role[];
}

const navItems: NavItem[] = [
  { key: 'dashboard', icon: LayoutDashboard, href: 'dashboard' },
  { key: 'users', icon: Users, href: 'users', roles: ['admin', 'moderator'] },
  { key: 'profile', icon: User, href: 'profile' },
  { key: 'settings', icon: Settings, href: 'settings' },
];

export function DashboardSidebar({ lang, dict }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen } = useUIStore();
  const { hasRole } = usePermissions();

  return (
    <aside
      id="dashboard-sidebar"
      aria-label="Dashboard navigation sidebar"
      className={cn(
        'bg-card border-border flex flex-col border-r transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
          N
        </div>
        {isSidebarOpen && (
          <span className="ml-3 font-semibold truncate">Enterprise App</span>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 space-y-1 p-3">
        {navItems.map(({ key, icon: Icon, href, roles }) => {
          if (roles && !hasRole(roles)) {
            return null;
          }

          const fullPath = `/${lang}/${href}`;
          const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);

          return (
            <Link
              key={key}
              href={fullPath}
              aria-label={dict[key]}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon size={18} aria-hidden="true" className="shrink-0" />
              {isSidebarOpen && <span className="truncate">{dict[key]}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
