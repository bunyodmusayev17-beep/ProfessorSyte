import { Eye, Lock, PlayCircle, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { formatCount } from '@/lib/format';
import { getYoutubeThumbnailUrl } from '@/lib/youtube';

export function VideoCard({ video, ...props }) {
  // The admin's uploaded thumbnail wins; otherwise derive one from the URL.
  const thumbnail = video.thumbnailUrl || getYoutubeThumbnailUrl(video.youtubeUrl);

  return (
    <Card
      as={Link}
      to={`/videos/${video.videoId}`}
      className="group hover:border-primary/50 hover:shadow-card-hover flex flex-col overflow-hidden transition-all"
      {...props}
    >
      <div className="bg-media relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt={video.title}
          className="transition-transform duration-300 group-hover:scale-[1.04]"
          fallback={<PlayCircle size={28} />}
        />

        {/* Play affordance on hover, matching the reference cards. */}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/35">
          <PlayCircle
            size={38}
            className="scale-90 text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
          />
        </span>

        <span className="absolute top-2 left-2">
          <Badge
            tone="primary"
            className="bg-primary/90 border-transparent text-white backdrop-blur"
          >
            Video
          </Badge>
        </span>

        {video.isExclusive && (
          <span className="absolute top-2 right-2">
            <Badge tone="solidWarning">
              <Lock size={11} />
              Exclusive
            </Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-fg group-hover:text-primary-light line-clamp-2 text-sm font-semibold transition-colors">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-muted line-clamp-2 text-xs">{video.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {video.categoryName ? (
            <span className="text-primary-light truncate text-xs font-medium">
              {video.categoryName}
            </span>
          ) : (
            <span />
          )}

          <span className="text-subtle flex shrink-0 items-center gap-2.5 text-xs">
            <span className="flex items-center gap-1">
              <Eye size={13} aria-hidden />
              {formatCount(video.viewCount)}
              <span className="sr-only">views</span>
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={13} aria-hidden />
              {formatCount(video.likeCount)}
              <span className="sr-only">likes</span>
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
