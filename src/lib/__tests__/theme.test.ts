import { describe, it, expect } from 'vitest';
import {
  THEME_PRESETS,
  THEME_PRESET_KEYS,
  THEME_RADII,
  generateThemeCss,
} from '@/lib/theme';

describe('Theme Presets & CSS Generator', () => {
  it('defines all required TweakCN presets', () => {
    expect(THEME_PRESET_KEYS).toEqual([
      'modern-minimal',
      'amethyst-haze',
      'ocean-breeze',
      'emerald-forest',
      'sunset-rose',
      'catppuccin',
    ]);

    for (const key of THEME_PRESET_KEYS) {
      expect(THEME_PRESETS[key]).toBeDefined();
      expect(THEME_PRESETS[key].swatch).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(THEME_PRESETS[key].light.primary).toBeDefined();
      expect(THEME_PRESETS[key].dark.primary).toBeDefined();
    }
  });

  it('defines valid theme radii', () => {
    expect(THEME_RADII).toContain(0.3);
    expect(THEME_RADII).toContain(0.5);
    expect(THEME_RADII).toContain(0.75);
    expect(THEME_RADII).toContain(1.0);
  });

  it('generates correct CSS snippet for a preset', () => {
    const css = generateThemeCss('amethyst-haze', 0.75);
    expect(css).toContain('/* TweakCN Theme: Amethyst Haze */');
    expect(css).toContain('--primary: 262.1 83.3% 57.8%;');
    expect(css).toContain('--radius: 0.75rem;');
    expect(css).toContain('.dark {');
    expect(css).toContain('--primary: 263.4 70% 50.4%;');
  });
});
