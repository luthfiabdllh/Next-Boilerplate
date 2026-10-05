'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for the [lang] segment.
 * Catches runtime errors in Server and Client Components.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service (e.g. Sentry, Datadog)
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <div className="bg-destructive/10 text-destructive flex h-14 w-14 items-center justify-center rounded-2xl">
        <AlertTriangle size={28} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-md text-sm">
          An unexpected error occurred. You can retry the operation or return to safety.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-muted text-destructive mt-3 max-w-lg rounded-lg border p-3 text-left font-mono text-xs overflow-x-auto">
            {error.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-2">
        <Button
          onClick={reset}
          className="gap-2"
          aria-label="Try to recover from error"
        >
          <RefreshCw size={14} />
          <span>Try again</span>
        </Button>
      </div>
    </div>
  );
}
