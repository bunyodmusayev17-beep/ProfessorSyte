import { VideoOff } from 'lucide-react';

import { getYoutubeEmbedUrl } from '@/lib/youtube';

export function VideoPlayer({ youtubeUrl, title }) {
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return (
      <div className="rounded-card border-line text-subtle flex aspect-video flex-col items-center justify-center gap-2 border bg-black text-sm">
        <VideoOff size={24} />
        This video link is not valid
      </div>
    );
  }

  return (
    <div className="rounded-card border-line aspect-video overflow-hidden border bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
