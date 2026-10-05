'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, LogOut, Globe, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/store/ui.store';
import { useLogout } from '@/features/auth/api/use-mutations';
import { ThemeCustomizer } from '@/components/shared/theme-customizer';

interface DashboardHeaderProps {
  lang: string;
  userName: string;
  logoutLabel: string;
}

export function DashboardHeader({
  lang,
  userName,
  logoutLabel,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();
  const { resolvedTheme, setTheme } = useTheme();
  const logoutMutation = useLogout();

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const switchLanguage = (newLang: 'en' | 'id') => {
    if (newLang === lang) return;
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/') || `/${newLang}`;
    router.push(newPath);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      id="dashboard-header"
      className="bg-background border-border flex h-16 items-center justify-between border-b px-4"
      aria-label="Dashboard header"
    >
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar navigation"
        aria-expanded={useUIStore.getState().isSidebarOpen}
        aria-controls="dashboard-sidebar"
      >
        <Menu size={20} aria-hidden="true" />
      </Button>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 uppercase font-medium text-xs"
              aria-label="Switch language"
            >
              <Globe size={15} />
              <span>{lang}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => switchLanguage('en')}>
              English {lang === 'en' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchLanguage('id')}>
              Bahasa Indonesia {lang === 'id' && '✓'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          )}
        </Button>

        {/* Theme Customizer Drawer Trigger */}
        <ThemeCustomizer triggerVariant="icon" />

        {/* Quick Logout Button */}
        <Button
          id="logout-button"
          variant="ghost"
          size="icon"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          aria-label={logoutLabel}
          title={logoutLabel}
        >
          <LogOut size={18} aria-hidden="true" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1.5 rounded-full"
              aria-label={`User menu for ${userName}`}
            >
              <Avatar aria-hidden="true">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:block max-w-30 truncate">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="truncate">{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${lang}/profile`} className="flex items-center gap-2">
                <User size={15} />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id="logout-button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="text-destructive flex items-center gap-2 cursor-pointer"
              aria-label={logoutLabel}
            >
              <LogOut size={15} />
              <span>{logoutLabel}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
