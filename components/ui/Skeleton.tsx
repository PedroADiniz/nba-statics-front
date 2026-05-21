import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'animate-pulse rounded-lg bg-bg-hover',
      className,
    )} />
  );
}

export function H2HSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-80" />
      <Skeleton className="h-96" />
    </div>
  );
}
