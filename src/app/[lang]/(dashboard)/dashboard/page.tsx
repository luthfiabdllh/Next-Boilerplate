import { verifySession } from '@/lib/verify-session';
import { getDictionary, type Locale } from '@/lib/i18n';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params;
  const [dict, session] = await Promise.all([
    getDictionary(lang as Locale),
    verifySession(),
  ]);

  const userName = typeof session?.name === 'string' ? session.name : 'User';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dict.dashboard.welcome.replace('{name}', userName)}
        </h1>
        <p className="text-muted-foreground mt-1">
          {new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date())}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: '1,280', change: '+12%' },
          { label: 'Active Sessions', value: '342', change: '+4%' },
          { label: 'Requests Today', value: '89.4k', change: '+8%' },
          { label: 'Error Rate', value: '0.02%', change: '-2%' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card text-card-foreground rounded-lg border p-5 shadow-sm"
          >
            <p className="text-muted-foreground text-sm font-medium">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {stat.change} from last period
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
