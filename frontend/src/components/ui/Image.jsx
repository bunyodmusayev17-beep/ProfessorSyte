import { ImageOff } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/cn';

/**
 * <img> with a graceful fallback: thumbnails come from YouTube, category covers
 * and project photos from the backend's wwwroot, and any of them can be missing
 * or 404. Falls back to the brand gradient rather than a broken-image glyph.
 */
export function Image({ src, alt, className, fallback, wrapperClassName, ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);

  // A new src deserves a fresh attempt: comparing against the src that failed
  // resets on change during render, with no effect and no extra pass.
  const hasFailed = !src || failedSrc === src;

  if (hasFailed) {
    return (
      <div
        className={cn(
          'text-subtle bg-media flex h-full w-full items-center justify-center',
          wrapperClassName
        )}
        role="img"
        aria-label={alt}
      >
        {fallback ?? <ImageOff size={22} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cn('h-full w-full object-cover', className)}
      {...props}
    />
  );
}
