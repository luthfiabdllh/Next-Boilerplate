import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemePresetKey } from '@/lib/theme';

/**
 * UI State Store — Transient UI state ONLY.
 *
 * STRICT RULE: This store is for UI concerns only.
 * PROHIBITED: Storing API responses, database entities, or auth state here.
 * All server/remote state belongs to TanStack Query.
 */
interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Mode Theme (light | dark | system)
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // TweakCN Color Preset & Radius
  colorPreset: ThemePresetKey;
  setColorPreset: (preset: ThemePresetKey) => void;
  radius: number;
  setRadius: (radius: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      // Theme Mode
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // TweakCN Preset
      colorPreset: 'modern-minimal',
      setColorPreset: (colorPreset) => set({ colorPreset }),

      // Border Radius
      radius: 0.5,
      setRadius: (radius) => set({ radius }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        colorPreset: state.colorPreset,
        radius: state.radius,
      }),
    }
  )
);
