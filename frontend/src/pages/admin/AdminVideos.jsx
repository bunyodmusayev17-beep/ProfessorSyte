import { Eye, ImageIcon, Lock, Pencil, PlayCircle, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Image } from '@/components/ui/Image';
import { ConfirmDialog } from '@/components/ui/Modal';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { VideoFormModal } from '@/features/videos/VideoFormModal';
import { useCategories } from '@/hooks/useCategories';
import { useDeleteVideo, useVideos } from '@/hooks/useVideos';
import { getErrorMessage } from '@/lib/apiError';
import { formatCount, formatDate } from '@/lib/format';

export default function AdminVideos() {
  const videosQuery = useVideos();
  const { data: categories = [] } = useCategories();
  const deleteVideo = useDeleteVideo();

  const [editing, setEditing] = useState(null); // null = closed, {} = create
  const [pendingDelete, setPendingDelete] = useState(null);

  async function handleDelete() {
    try {
      await deleteVideo.mutateAsync(pendingDelete.videoId);
      toast.success('Video deleted');
      setPendingDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const videos = videosQuery.data ?? [];
  const hasCategories = categories.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!hasCategories && !videosQuery.isPending && (
          <p className="text-warning text-xs">
            Create at least one category before adding a video.
          </p>
        )}
        <Button className="ml-auto" onClick={() => setEditing({})} disabled={!hasCategories}>
          <Plus size={16} />
          Add video
        </Button>
      </div>

      {videosQuery.isPending ? (
        <RowsSkeleton count={5} />
      ) : videosQuery.error ? (
        <ErrorState message={getErrorMessage(videosQuery.error)} onRetry={videosQuery.refetch} />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={PlayCircle}
          title="No videos yet"
          description={
            hasCategories
              ? 'Add the first video with its link and a card image.'
              : 'Add a category first, then you can add videos.'
          }
          action={
            hasCategories && (
              <Button onClick={() => setEditing({})}>
                <Plus size={16} />
                Add video
              </Button>
            )
          }
        />
      ) : (
        <Card className="divide-line divide-y">
          {videos.map((video) => (
            <div key={video.videoId} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
              <div className="border-line bg-media aspect-video w-20 shrink-0 overflow-hidden rounded-lg border sm:w-28">
                <Image src={video.thumbnailUrl} alt="" fallback={<PlayCircle size={18} />} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-fg line-clamp-2 text-sm font-medium">{video.title}</p>

                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {video.categoryName && (
                    <span className="text-primary-light text-xs">{video.categoryName}</span>
                  )}
                  {video.isExclusive && (
                    <Badge tone="warning">
                      <Lock size={10} />
                      Exclusive
                    </Badge>
                  )}
                  {video.hasCustomThumbnail && (
                    <Badge tone="accent">
                      <ImageIcon size={10} />
                      Custom image
                    </Badge>
                  )}
                </div>

                <p className="text-subtle mt-1 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {formatCount(video.viewCount)}
                  </span>
                  <span>{formatDate(video.createdAt)}</span>
                </p>
              </div>

              <div className="flex shrink-0 gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${video.title}`}
                  onClick={() => setEditing(video)}
                >
                  <Pencil size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${video.title}`}
                  className="hover:text-danger"
                  onClick={() => setPendingDelete(video)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Mounted only while open, so the form always starts from fresh state. */}
      {editing && (
        <VideoFormModal onClose={() => setEditing(null)} video={editing.videoId ? editing : null} />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        isLoading={deleteVideo.isPending}
        title="Delete video"
        message={`"${pendingDelete?.title}" will be deleted, along with its comments and reactions.`}
      />
    </div>
  );
}
