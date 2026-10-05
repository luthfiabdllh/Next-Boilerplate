'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useUIStore } from '@/store/ui.store';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { colorPreset, radius } = useUIStore();

  React.useEffect(() => {
    // Apply data-theme attribute for TweakCN color preset
    const root = document.documentElement;
    if (colorPreset && colorPreset !== 'modern-minimal') {
      root.setAttribute('data-theme', colorPreset);
    } else {
      root.removeAttribute('data-theme');
    }

    // Apply custom border radius
    if (radius !== undefined) {
      root.style.setProperty('--radius', `${radius}rem`);
    }
  }, [colorPreset, radius]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
