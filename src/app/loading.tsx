import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-amber-500/20" />
        <Loader2 className="h-8 w-8 animate-spin text-amber-500 relative z-10" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading content...
      </p>
    </div>
  );
}
