import { Bookmark, CheckCircle2, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCountUp } from '@/hooks/useCountUp';
import { useMyFavorites, useMyProgress } from '@/hooks/useEngagement';
import { useInView } from '@/hooks/useInView';
import { useVideos } from '@/hooks/useVideos';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';

const RING_RADIUS = 34;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function StatTile({ icon: Icon, label, value, tone = 'primary', start }) {
  const count = useCountUp(value, { start });
  const tones = {
    primary: 'from-primary/30 text-primary-light',
    success: 'from-success/30 text-success',
    accent: 'from-accent/30 text-accent',
  };

  return (
    <Card className="group flex items-center gap-4 p-5 transition-transform duration-500 hover:-translate-y-1">
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br to-transparent transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6',
          tones[tone]
        )}
      >
        <Icon size={21} />
      </span>
      <span className="min-w-0">
        <span className="font-display text-fg block text-3xl font-bold">{formatCount(count)}</span>
        <span className="text-subtle block truncate text-xs">{label}</span>
      </span>
    </Card>
  );
}

/**
 * "Overall progress". The backend has no aggregate endpoint, so this is
 * derived: watched videos vs. the total video count.
 */
export function ProgressSummary() {
  const videosQuery = useVideos();
  const progressQuery = useMyProgress();
  const favoritesQuery = useMyFavorites();
  const [ref, inView] = useInView();

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

  const shownPercent = useCountUp(percent, { start: inView && !isPending });

  // One stable element carries the ref, so the observer survives the swap from
  // skeleton to content.
  return (
    <div ref={ref}>
      {isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-[104px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-4 p-5">
            <div
              className="relative size-20 shrink-0"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall progress"
            >
              <svg viewBox="0 0 80 80" className="size-full -rotate-90">
                <defs>
                  <linearGradient id="progress-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#10b981" />
                    <stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle
                  cx="40"
                  cy="40"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="var(--color-raised)"
                  strokeWidth="7"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="url(#progress-ring)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={RING_LENGTH}
                  strokeDashoffset={RING_LENGTH * (1 - (inView ? percent : 0) / 100)}
                  className="drop-shadow-[0_0_6px_rgb(16_185_129_/_0.6)] transition-[stroke-dashoffset] duration-[1400ms] ease-(--ease-out-soft)"
                />
              </svg>
              <span className="font-display text-fg absolute inset-0 flex items-center justify-center text-lg font-bold">
                {shownPercent}%
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-subtle flex items-center gap-1.5 text-xs">
                <TrendingUp size={14} className="text-success" />
                Overall progress
              </p>
              <p className="text-fg mt-1 text-sm font-medium">
                {formatCount(watchedCount)} of {formatCount(totalCount)} videos
              </p>
            </div>
          </Card>

          <StatTile
            icon={CheckCircle2}
            tone="success"
            label="Videos watched"
            value={watchedCount}
            start={inView}
          />
          <StatTile
            icon={Bookmark}
            tone="accent"
            label="Saved videos"
            value={favoritesQuery.data?.length ?? 0}
            start={inView}
          />
        </div>
      )}
    </div>
  );
}
