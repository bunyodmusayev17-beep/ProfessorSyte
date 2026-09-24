import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Eye,
  Lock,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ReactionType } from '@/constants';
import { CategoryIcon } from '@/features/categories/CategoryIcon';
import { CommentSection } from '@/features/engagement/CommentSection';
import { ProductLinkList } from '@/features/videos/ProductLinkList';
import { VideoPlayer } from '@/features/videos/VideoPlayer';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useFavorite, useMarkAsWatched, useMyProgress, useReaction } from '@/hooks/useEngagement';
import { useVideo } from '@/hooks/useVideos';
import { getErrorMessage } from '@/lib/apiError';
import { cn } from '@/lib/cn';
import { formatCount, formatDate } from '@/lib/format';

/** How long the video must stay open before it counts as watched. */
const WATCHED_AFTER_MS = 5000;

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="aspect-video" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-40" />
    </div>
  );
}

export default function VideoDetailPage() {
  const { videoId } = useParams();
  const { isAuthenticated } = useAuth();

  const videoQuery = useVideo(videoId);
  const video = videoQuery.data;

  const { data: categories = [] } = useCategories();
  const category = categories.find((item) => String(item.categoryId) === String(video?.categoryId));

  const reaction = useReaction(videoId, {
    likeCount: video?.likeCount ?? 0,
    dislikeCount: video?.dislikeCount ?? 0,
  });
  const favorite = useFavorite(videoId);
  const markAsWatched = useMarkAsWatched();
  const { data: progress = [] } = useMyProgress();

  const isWatched = progress.some(
    (entry) => String(entry.videoId) === String(videoId) && entry.isCompleted
  );

  // Mark as watched once, a few seconds in. The ref keeps StrictMode's double
  // effect run (and any re-render) from firing a second request.
  const hasMarkedRef = useRef(false);
  useEffect(() => {
    hasMarkedRef.current = false;
  }, [videoId]);

  useEffect(() => {
    if (!isAuthenticated || isWatched || hasMarkedRef.current) return undefined;

    const timer = setTimeout(() => {
      hasMarkedRef.current = true;
      // Non-critical: a failure here shouldn't interrupt watching.
      markAsWatched.mutate(videoId);
    }, WATCHED_AFTER_MS);

    return () => clearTimeout(timer);
    // `markAsWatched` is a stable mutation object; re-running on it would reset the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWatched, videoId]);

  async function handleToggleFavorite() {
    try {
      await favorite.toggle();
      toast.success(favorite.isFavorited ? 'Removed from saved' : 'Saved');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (videoQuery.isPending) return <DetailSkeleton />;

  if (videoQuery.error) {
    return (
      <ErrorState
        title="Could not open this video"
        message={getErrorMessage(videoQuery.error)}
        onRetry={videoQuery.refetch}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="min-w-0 space-y-4 lg:col-span-2">
        <VideoPlayer youtubeUrl={video.youtubeUrl} title={video.title} />

        <div className="flex flex-wrap items-center gap-2">
          {video.isExclusive && (
            <Badge tone="solidWarning">
              <Lock size={11} />
              Exclusive
            </Badge>
          )}
          <Badge tone="neutral">
            <Eye size={11} />
            {formatCount(video.viewCount)} views
          </Badge>
          <Badge tone="neutral">{formatDate(video.createdAt)}</Badge>
          {isWatched && (
            <Badge tone="success">
              <CheckCircle2 size={11} />
              Watched
            </Badge>
          )}
        </div>

        <h1 className="text-fg text-xl font-semibold sm:text-2xl">{video.title}</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => reaction.react(ReactionType.Like)}
            disabled={!isAuthenticated || reaction.isReacting}
            aria-pressed={reaction.myReaction === ReactionType.Like}
            className={cn(
              reaction.myReaction === ReactionType.Like && 'border-primary text-primary-light'
            )}
          >
            <ThumbsUp size={16} />
            {formatCount(video.likeCount)}
          </Button>

          <Button
            variant="secondary"
            onClick={() => reaction.react(ReactionType.Dislike)}
            disabled={!isAuthenticated || reaction.isReacting}
            aria-pressed={reaction.myReaction === ReactionType.Dislike}
            className={cn(
              reaction.myReaction === ReactionType.Dislike && 'border-danger text-danger'
            )}
          >
            <ThumbsDown size={16} />
            {formatCount(video.dislikeCount)}
          </Button>

          <Button
            variant="secondary"
            onClick={handleToggleFavorite}
            disabled={!isAuthenticated || favorite.isPending}
            aria-pressed={favorite.isFavorited}
            className={cn(favorite.isFavorited && 'border-accent text-accent')}
          >
            {favorite.isFavorited ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {favorite.isFavorited ? 'Saved' : 'Save'}
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="text-subtle text-xs">
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>{' '}
            to like, save and comment.
          </p>
        )}

        {video.description && (
          <Card>
            <CardBody>
              <p className="text-muted text-sm whitespace-pre-line">{video.description}</p>
            </CardBody>
          </Card>
        )}

        <ProductLinkList productLinks={video.productLinks} />

        <CommentSection videoId={videoId} />
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader title="Category" />
          <CardBody>
            <Link
              to={`/videos?categoryId=${video.categoryId}`}
              className="hover:bg-raised -m-1 flex items-center gap-2.5 rounded-lg p-1 transition-colors"
            >
              <span className="bg-primary/15 text-primary-light flex size-9 shrink-0 items-center justify-center rounded-lg">
                <CategoryIcon iconUrl={category?.iconUrl} size={18} />
              </span>
              <span className="min-w-0">
                <span className="text-fg block truncate text-sm font-medium">
                  {video.categoryName || 'Uncategorised'}
                </span>
                {category && (
                  <span className="text-subtle block text-xs">
                    {formatCount(category.videoCount)} videos
                  </span>
                )}
              </span>
            </Link>
          </CardBody>
        </Card>
      </aside>
    </div>
  );
}
