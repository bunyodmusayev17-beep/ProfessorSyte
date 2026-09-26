import { Home, PlayCircle } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden py-16 text-center md:py-24">
      <span aria-hidden className="bg-grid mask-fade absolute inset-0 -z-10 opacity-70" />

      <div className="animate-float relative">
        <span className="bg-brand absolute inset-0 opacity-40 blur-3xl" />
        <p className="font-display text-gradient relative text-[7rem] leading-none font-bold tracking-tighter md:text-[10rem]">
          404
        </p>
      </div>

      <h1
        className="animate-reveal text-fg mt-4 text-2xl font-bold"
        style={{ animationDelay: '100ms' }}
      >
        This circuit is open
      </h1>
      <p
        className="animate-reveal text-muted mt-2 max-w-sm text-sm"
        style={{ animationDelay: '180ms' }}
      >
        The page you were looking for may have been removed or moved somewhere else.
      </p>

      <div
        className="animate-reveal mt-8 flex flex-wrap justify-center gap-3"
        style={{ animationDelay: '260ms' }}
      >
        <Button to="/">
          <Home size={16} />
          Back to home
        </Button>
        <Button to="/videos" variant="secondary">
          <PlayCircle size={16} />
          Browse videos
        </Button>
      </div>
    </div>
  );
}
