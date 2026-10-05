import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.dashboard.navigation.settings,
    description: 'System preferences and application configuration',
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dict.dashboard.navigation.settings}
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure application preferences, localization, and notifications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Preferences</CardTitle>
          <CardDescription>
            Custom settings and defaults for future projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Use this page as a blueprint for project-specific configurations (e.g. billing, team management, webhook settings, notification preferences).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
