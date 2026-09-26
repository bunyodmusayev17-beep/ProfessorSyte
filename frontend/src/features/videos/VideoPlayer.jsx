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
    <div className="animate-scale-in relative">
      {/* Ambient glow bleeding out from behind the player. */}
      <span
        aria-hidden
        className="bg-brand animate-gradient absolute -inset-3 -z-10 rounded-[1.5rem] bg-[length:200%_200%] opacity-25 blur-2xl"
      />
      <div className="rounded-card aspect-video overflow-hidden border border-white/10 bg-black shadow-2xl">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
