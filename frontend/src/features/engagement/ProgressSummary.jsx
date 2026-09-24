import { Bookmark, CheckCircle2, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMyFavorites, useMyProgress } from '@/hooks/useEngagement';
import { useVideos } from '@/hooks/useVideos';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';

function StatTile({ icon: Icon, label, value, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary/15 text-primary-light',
    success: 'bg-success/15 text-success',
    accent: 'bg-accent/15 text-accent',
  };

  return (
    <Card className="flex items-center gap-3 p-4">
      <span
        className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', tones[tone])}
      >
        <Icon size={19} />
      </span>
      <span className="min-w-0">
        <span className="text-fg block text-xl font-semibold">{value}</span>
        <span className="text-subtle block truncate text-xs">{label}</span>
      </span>
    </Card>
  );
}

/**
 * "Overall progress" from the reference design. The backend has no aggregate
 * endpoint, so this is derived: watched videos vs. the total video count.
 */
export function ProgressSummary() {
  const videosQuery = useVideos();
  const progressQuery = useMyProgress();
  const favoritesQuery = useMyFavorites();

  const isPending = videosQuery.isPending || progressQuery.isPending || favoritesQuery.isPending;

  const { watchedCount, totalCount, percent } = useMemo(() => {
    const total = videosQuery.data?.length ?? 0;
    const watched = (progressQuery.data ?? []).filter((entry) => entry.isCompleted).length;
    return {
      watchedCount: watched,
      totalCount: total,
      // Cap at 100 in case a watched video was later deleted.
      percent: total === 0 ? 0 : Math.min(100, Math.round((watched / total) * 100)),
    };
  }, [videosQuery.data, progressQuery.data]);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[74px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-4 sm:col-span-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-subtle flex items-center gap-1.5 text-xs">
            <TrendingUp size={14} />
            Overall progress
          </span>
          <span className="text-fg text-sm font-semibold">{percent}%</span>
        </div>

        <div
          className="bg-raised h-2 overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall progress"
        >
          <div
            className="bg-success h-full rounded-full transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-subtle mt-2 text-xs">
          {formatCount(watchedCount)} of {formatCount(totalCount)} videos watched
        </p>
      </Card>

      <StatTile
        icon={CheckCircle2}
        tone="success"
        label="Videos watched"
        value={formatCount(watchedCount)}
      />
      <StatTile
        icon={Bookmark}
        tone="accent"
        label="Saved videos"
        value={formatCount(favoritesQuery.data?.length ?? 0)}
      />
    </div>
  );
}
