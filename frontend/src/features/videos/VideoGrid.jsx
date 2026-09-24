import { PlayCircle } from 'lucide-react';

import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Stagger } from '@/components/ui/Reveal';
import { SkeletonGrid, VideoCardSkeleton } from '@/components/ui/Skeleton';
import { getErrorMessage } from '@/lib/apiError';

import { VideoCard } from './VideoCard';

const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4';

/** Renders the loading / error / empty / loaded states of a list of videos. */
export function VideoGrid({
  videos = [],
  isPending,
  error,
  onRetry,
  skeletonCount = 8,
  emptyTitle = 'No videos yet',
  emptyDescription = 'Add the first video from the admin panel.',
}) {
  if (isPending) {
    return (
      <SkeletonGrid count={skeletonCount} className={GRID}>
        <VideoCardSkeleton />
      </SkeletonGrid>
    );
  }

  if (error) {
    return <ErrorState message={getErrorMessage(error)} onRetry={onRetry} />;
  }

  if (videos.length === 0) {
    return <EmptyState icon={PlayCircle} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Stagger className={GRID}>
      {videos.map((video) => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </Stagger>
  );
}
