export const THEME_PRESET_KEYS = [
  'modern-minimal',
  'amethyst-haze',
  'ocean-breeze',
  'emerald-forest',
  'sunset-rose',
  'catppuccin',
] as const;

export type ThemePresetKey = (typeof THEME_PRESET_KEYS)[number];

export interface ThemePreset {
  key: ThemePresetKey;
  label: string;
  swatch: string; // Hex color for visual swatch
  light: {
    primary: string;
    primaryForeground: string;
    ring: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
    ring: string;
  };
}

export const THEME_PRESETS: Record<ThemePresetKey, ThemePreset> = {
  'modern-minimal': {
    key: 'modern-minimal',
    label: 'Modern Minimal',
    swatch: '#18181b',
    light: {
      primary: '222.2 47.4% 11.2%',
      primaryForeground: '210 40% 98%',
      ring: '222.2 84% 4.9%',
    },
    dark: {
      primary: '210 40% 98%',
      primaryForeground: '222.2 47.4% 11.2%',
      ring: '212.8 26.8% 83.9%',
    },
  },
  'amethyst-haze': {
    key: 'amethyst-haze',
    label: 'Amethyst Haze',
    swatch: '#8b5cf6',
    light: {
      primary: '262.1 83.3% 57.8%',
      primaryForeground: '210 40% 98%',
      ring: '262.1 83.3% 57.8%',
    },
    dark: {
      primary: '263.4 70% 50.4%',
      primaryForeground: '210 40% 98%',
      ring: '263.4 70% 50.4%',
    },
  },
  'ocean-breeze': {
    key: 'ocean-breeze',
    label: 'Ocean Breeze',
    swatch: '#3b82f6',
    light: {
      primary: '221.2 83.2% 53.3%',
      primaryForeground: '210 40% 98%',
      ring: '221.2 83.2% 53.3%',
    },
    dark: {
      primary: '217.2 91.2% 59.8%',
      primaryForeground: '222.2 47.4% 11.2%',
      ring: '224.3 76.3% 48%',
    },
  },
  'emerald-forest': {
    key: 'emerald-forest',
    label: 'Emerald Forest',
    swatch: '#10b981',
    light: {
      primary: '142.1 76.2% 36.3%',
      primaryForeground: '355.7 100% 97.3%',
      ring: '142.1 76.2% 36.3%',
    },
    dark: {
      primary: '142.1 70.6% 45.3%',
      primaryForeground: '144.9 80.4% 10%',
      ring: '142.4 71.8% 29.2%',
    },
  },
  'sunset-rose': {
    key: 'sunset-rose',
    label: 'Sunset Rose',
    swatch: '#f43f5e',
    light: {
      primary: '346.8 77.2% 49.8%',
      primaryForeground: '355.7 100% 97.3%',
      ring: '346.8 77.2% 49.8%',
    },
    dark: {
      primary: '346.8 77.2% 49.8%',
      primaryForeground: '355.7 100% 97.3%',
      ring: '346.8 77.2% 49.8%',
    },
  },
  catppuccin: {
    key: 'catppuccin',
    label: 'Catppuccin Pastel',
    swatch: '#cba6f7',
    light: {
      primary: '267 83% 60%',
      primaryForeground: '0 0% 100%',
      ring: '267 83% 60%',
    },
    dark: {
      primary: '267 83% 76%',
      primaryForeground: '240 21% 15%',
      ring: '267 83% 76%',
    },
  },
};

export const THEME_RADII = [0.3, 0.5, 0.75, 1.0] as const;
export type ThemeRadius = (typeof THEME_RADII)[number];

/**
 * Generate CSS variable block for exporting/copying into globals.css.
 */
export function generateThemeCss(
  presetKey: ThemePresetKey,
  radius: number = 0.5
): string {
  const preset = THEME_PRESETS[presetKey];
  return `/* TweakCN Theme: ${preset.label} */
:root {
  --primary: ${preset.light.primary};
  --primary-foreground: ${preset.light.primaryForeground};
  --ring: ${preset.light.ring};
  --radius: ${radius}rem;
}

.dark {
  --primary: ${preset.dark.primary};
  --primary-foreground: ${preset.dark.primaryForeground};
  --ring: ${preset.dark.ring};
}`;
}
