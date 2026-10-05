import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeCustomizerContent } from '@/components/shared/theme-customizer';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'System preferences and application configuration',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure application preferences, theme appearance, and project defaults.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance & Themes Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Appearance & Themes</CardTitle>
            <CardDescription>
              Customize color palettes (TweakCN presets), theme mode, and border radius in real time.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-xl">
            <ThemeCustomizerContent />
          </CardContent>
        </Card>

        {/* Template Guidelines Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Configuration Blueprint</CardTitle>
            <CardDescription>
              Custom settings and defaults for future projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Use this section as a blueprint to add project-specific configurations (e.g. organization billing, webhook endpoints, API keys, email notification preferences, and team roles).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
