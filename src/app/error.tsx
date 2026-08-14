'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertCircle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-[500px] mx-auto">
          We experienced an unexpected error while loading this page. Our team has been notified.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default" className="bg-amber-500 hover:bg-amber-600 text-black">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="border-white/10">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
