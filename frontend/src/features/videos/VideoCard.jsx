import { Eye, Lock, Play, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { useSpotlight } from '@/hooks/useSpotlight';
import { formatCount } from '@/lib/format';
import { getYoutubeThumbnailUrl } from '@/lib/youtube';

export function VideoCard({ video, ...props }) {
  const onMouseMove = useSpotlight();
  // The admin's uploaded thumbnail wins; otherwise derive one from the URL.
  const thumbnail = video.thumbnailUrl || getYoutubeThumbnailUrl(video.youtubeUrl);

  return (
    <Card
      as={Link}
      to={`/videos/${video.videoId}`}
      onMouseMove={onMouseMove}
      className="group spotlight ring-gradient hover:shadow-card-hover flex flex-col overflow-hidden transition-all duration-500 ease-(--ease-out-soft) hover:-translate-y-1.5"
      {...props}
    >
      <div className="bg-media relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt={video.title}
          className="transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-110"
          fallback={<Play size={28} />}
        />

        {/* Cinematic fade + play button on hover. */}
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="relative flex size-14 scale-50 items-center justify-center opacity-0 transition-all duration-500 ease-(--ease-spring) group-hover:scale-100 group-hover:opacity-100">
            <span className="bg-primary/50 animate-ping-slow absolute inset-0 rounded-full" />
            <span className="bg-brand shadow-glow relative flex size-14 items-center justify-center rounded-full">
              <Play size={22} className="ml-0.5 fill-white text-white" />
            </span>
          </span>
        </span>

        {video.categoryName && (
          <span className="absolute top-2.5 left-2.5">
            <Badge className="border-white/10 bg-black/55 text-white backdrop-blur-md">
              {video.categoryName}
            </Badge>
          </span>
        )}

        {video.isExclusive && (
          <span className="absolute top-2.5 right-2.5">
            <Badge tone="solidWarning">
              <Lock size={11} />
              Exclusive
            </Badge>
          </span>
        )}
      </div>

      <div className="relative z-[3] flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-fg group-hover:text-primary-light line-clamp-2 text-[15px] leading-snug font-semibold transition-colors">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-muted line-clamp-2 text-xs leading-relaxed">{video.description}</p>
        )}

        <div className="border-line mt-auto flex items-center justify-between gap-2 border-t pt-3 text-xs">
          <span className="text-subtle flex items-center gap-1">
            <Eye size={13} aria-hidden />
            {formatCount(video.viewCount)}
            <span className="sr-only">views</span>
          </span>
          <span className="text-subtle group-hover:text-primary-light flex items-center gap-1 transition-colors">
            <ThumbsUp size={13} aria-hidden />
            {formatCount(video.likeCount)}
            <span className="sr-only">likes</span>
          </span>
        </div>
      </div>
    </Card>
  );
}
