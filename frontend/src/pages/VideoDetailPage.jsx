import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Eye,
  Lock,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

/** Toggle button whose icon does a little spring "pop" each time it's clicked. */
function ActionButton({ isActive, activeClassName, onClick, children, icon: Icon, ...props }) {
  const [popKey, setPopKey] = useState(0);

  return (
    <Button
      variant="secondary"
      onClick={() => {
        setPopKey((key) => key + 1);
        onClick();
      }}
      aria-pressed={isActive}
      className={cn('rounded-full px-5', isActive && activeClassName)}
      {...props}
    >
      <Icon
        key={popKey}
        size={16}
        className={cn(popKey > 0 && 'animate-pop', isActive && 'fill-current')}
      />
      {children}
    </Button>
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
    <>
      <nav
        aria-label="Breadcrumb"
        className="animate-reveal text-subtle mb-5 flex items-center gap-1.5 text-xs"
      >
        <Link to="/videos" className="hover:text-fg flex items-center gap-1 transition-colors">
          <ArrowLeft size={13} />
          Videos
        </Link>
        <ChevronRight size={12} />
        <Link
          to={`/videos?categoryId=${video.categoryId}`}
          className="hover:text-fg truncate transition-colors"
        >
          {video.categoryName || 'Uncategorised'}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <VideoPlayer youtubeUrl={video.youtubeUrl} title={video.title} />

          <div className="animate-reveal space-y-4" style={{ animationDelay: '120ms' }}>
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
              <Badge tone="neutral">
                <Calendar size={11} />
                {formatDate(video.createdAt)}
              </Badge>
              {isWatched && (
                <Badge tone="success" className="animate-scale-in">
                  <CheckCircle2 size={11} />
                  Watched
                </Badge>
              )}
            </div>

            <h1 className="text-fg text-2xl leading-tight font-bold sm:text-3xl">{video.title}</h1>

            <div className="flex flex-wrap items-center gap-2">
              <ActionButton
                icon={ThumbsUp}
                onClick={() => reaction.react(ReactionType.Like)}
                disabled={!isAuthenticated || reaction.isReacting}
                isActive={reaction.myReaction === ReactionType.Like}
                activeClassName="border-primary/60 bg-primary/15 text-primary-light"
              >
                {formatCount(video.likeCount)}
              </ActionButton>

              <ActionButton
                icon={ThumbsDown}
                onClick={() => reaction.react(ReactionType.Dislike)}
                disabled={!isAuthenticated || reaction.isReacting}
                isActive={reaction.myReaction === ReactionType.Dislike}
                activeClassName="border-danger/60 bg-danger/15 text-danger"
              >
                {formatCount(video.dislikeCount)}
              </ActionButton>

              <ActionButton
                icon={favorite.isFavorited ? BookmarkCheck : Bookmark}
                onClick={handleToggleFavorite}
                disabled={!isAuthenticated || favorite.isPending}
                isActive={favorite.isFavorited}
                activeClassName="border-accent/60 bg-accent/15 text-accent"
              >
                {favorite.isFavorited ? 'Saved' : 'Save'}
              </ActionButton>
            </div>

            {!isAuthenticated && (
              <p className="text-subtle text-xs">
                <Link to="/login" className="text-primary-light font-medium hover:underline">
                  Sign in
                </Link>{' '}
                to like, save and comment.
              </p>
            )}
          </div>

          {video.description && (
            <Card className="animate-reveal" style={{ animationDelay: '200ms' }}>
              <CardBody className="p-5">
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
                  {video.description}
                </p>
              </CardBody>
            </Card>
          )}

          <div className="lg:hidden">
            <ProductLinkList productLinks={video.productLinks} />
          </div>

          <CommentSection videoId={videoId} />
        </div>

        <aside
          className="animate-reveal space-y-4 lg:sticky lg:top-24 lg:self-start"
          style={{ animationDelay: '160ms' }}
        >
          <Card className="overflow-hidden">
            <CardHeader title="Category" />
            <CardBody>
              <Link
                to={`/videos?categoryId=${video.categoryId}`}
                className="hover:bg-raised/60 group -m-1.5 flex items-center gap-3 rounded-xl p-1.5 transition-colors"
              >
                <span className="bg-brand shadow-glow flex size-11 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <CategoryIcon iconUrl={category?.iconUrl} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-fg block truncate text-sm font-semibold">
                    {video.categoryName || 'Uncategorised'}
                  </span>
                  {category && (
                    <span className="text-subtle block text-xs">
                      {formatCount(category.videoCount)} videos
                    </span>
                  )}
                </span>
                <ChevronRight
                  size={16}
                  className="text-subtle transition-transform group-hover:translate-x-1"
                />
              </Link>
            </CardBody>
          </Card>

          <div className="hidden lg:block">
            <ProductLinkList productLinks={video.productLinks} />
          </div>
        </aside>
      </div>
    </>
  );
}
