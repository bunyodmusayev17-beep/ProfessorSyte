import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Lock, Eye } from "lucide-react";

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/videos/${video.videoId}`}
      className="card overflow-hidden hover:shadow-sm transition-shadow flex flex-col"
    >
      <div className="relative aspect-video bg-ink/5">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {video.isExclusive && (
          <span className="absolute top-2 right-2 bg-warning text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock size={12} />
            Exclusive
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <h3 className="font-medium text-ink text-sm line-clamp-2">{video.title}</h3>
        {video.categoryName && (
          <span className="text-xs text-primary">{video.categoryName}</span>
        )}
        <div className="mt-auto flex items-center gap-3 text-xs text-muted pt-1">
          <span className="flex items-center gap-1">
            <Eye size={13} /> {video.viewCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp size={13} /> {video.likeCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown size={13} /> {video.dislikeCount ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
