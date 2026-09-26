import { cn } from '@/lib/cn';

import { Card } from './Card';

/** Loading placeholder with a light sweeping across it. */
export function Skeleton({ className }) {
  return (
    <div className={cn('bg-raised/80 relative overflow-hidden rounded-md', className)}>
      <span
        aria-hidden
        className="animate-sheen absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
      />
    </div>
  );
}

/** Matches the shape of <VideoCard> so the grid doesn't jump when data lands. */
export function VideoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  );
}

/** Matches <CategoryCard>: cover image on top, icon and label below. */
export function CategoryCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </Card>
  );
}

export function SkeletonGrid({ count = 8, className, children }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{children}</div>
      ))}
    </div>
  );
}

export function RowsSkeleton({ count = 5 }) {
  return (
    <Card className="divide-line divide-y">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center justify-between gap-4 px-4 py-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </Card>
  );
}
