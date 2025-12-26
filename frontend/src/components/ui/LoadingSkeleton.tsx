import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'text' | 'chat';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div className={cn('grid gap-4', className)}>
        {items.map((i) => (
          <div key={i} className="p-6 rounded-xl border bg-card">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {items.map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chat') {
    return (
      <div className={cn('space-y-4', className)}>
        {items.map((i) => (
          <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
            <div className={cn('max-w-[80%] space-y-2', i % 2 === 0 ? '' : 'items-end')}>
              <Skeleton className={cn('h-20 rounded-2xl', i % 2 === 0 ? 'w-64' : 'w-48')} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}