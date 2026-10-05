'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  Paintbrush,
  Sun,
  Moon,
  Laptop,
  Check,
  Copy,
  RotateCcw,
} from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUIStore } from '@/store/ui.store';
import {
  THEME_PRESETS,
  THEME_PRESET_KEYS,
  THEME_RADII,
  generateThemeCss,
  type ThemePresetKey,
} from '@/lib/theme';
import { cn } from '@/lib/utils';

export function ThemeCustomizerContent() {
  const { theme, setTheme } = useTheme();
  const { colorPreset, setColorPreset, radius, setRadius } = useUIStore();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleCopyCss = async () => {
    const cssCode = generateThemeCss(colorPreset, radius);
    try {
      await navigator.clipboard.writeText(cssCode);
      toast.success('CSS code copied to clipboard! Paste it into globals.css.');
    } catch {
      toast.error('Failed to copy CSS code.');
    }
  };

  const handleReset = () => {
    setTheme('system');
    setColorPreset('modern-minimal');
    setRadius(0.5);
    toast.success('Theme reset to defaults.');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 1. Theme Mode (Light / Dark / System) */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mode
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { mode: 'light', label: 'Light', icon: Sun },
            { mode: 'dark', label: 'Dark', icon: Moon },
            { mode: 'system', label: 'System', icon: Laptop },
          ].map(({ mode, label, icon: Icon }) => (
            <Button
              key={mode}
              variant={theme === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme(mode)}
              className="gap-2"
              aria-label={`Set ${label} mode`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* 2. Color Presets (TweakCN) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Color Palette
          </Label>
          <span className="text-xs text-muted-foreground font-mono">
            {THEME_PRESETS[colorPreset]?.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {THEME_PRESET_KEYS.map((key) => {
            const preset = THEME_PRESETS[key];
            const isSelected = colorPreset === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setColorPreset(key as ThemePresetKey)}
                aria-label={`Select ${preset.label} theme`}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg border p-2 text-left text-xs font-medium transition-all hover:bg-accent',
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-accent/50'
                    : 'border-border'
                )}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full shadow-xs"
                  style={{ backgroundColor: preset.swatch }}
                >
                  {isSelected && <Check size={11} className="text-white" />}
                </span>
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Border Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Radius
          </Label>
          <span className="text-xs text-muted-foreground font-mono">{radius}rem</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {THEME_RADII.map((r) => (
            <Button
              key={r}
              variant={radius === r ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRadius(r)}
              aria-label={`Set radius ${r}rem`}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* 4. CSS Snippet & Copy Action */}
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Export Theme CSS
          </Label>
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopyCss}
            className="gap-1 text-xs"
            aria-label="Copy CSS code"
          >
            <Copy size={12} />
            <span>Copy CSS</span>
          </Button>
        </div>
        <pre className="bg-muted text-muted-foreground p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-36 leading-relaxed select-all">
          {generateThemeCss(colorPreset, radius)}
        </pre>
      </div>

      {/* Reset */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={13} />
          <span>Reset to Defaults</span>
        </Button>
      </div>
    </div>
  );
}

interface ThemeCustomizerProps {
  triggerVariant?: 'icon' | 'button';
}

export function ThemeCustomizer({ triggerVariant = 'icon' }: ThemeCustomizerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {triggerVariant === 'icon' ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open Theme Customizer"
            title="Customize Theme"
          >
            <Paintbrush size={18} aria-hidden="true" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <Paintbrush size={14} />
            <span>Customize Theme</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Theme Customizer</SheetTitle>
          <SheetDescription>
            Tweak color presets, mode, and border radius in real-time. Export CSS when ready.
          </SheetDescription>
        </SheetHeader>
        <div className="p-6 pt-4">
          <ThemeCustomizerContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
