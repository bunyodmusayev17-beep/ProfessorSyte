import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/cn';
import { env } from '@/lib/env';

export function Brand({ className, iconSize = 18, showName = true }) {
  return (
    <Link
      to="/"
      className={cn('group flex items-center gap-2.5', className)}
      aria-label={env.appName}
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center">
        {/* Soft pulsing halo behind the mark. */}
        <span className="bg-brand absolute inset-0 rounded-xl opacity-60 blur-md transition-opacity duration-500 group-hover:opacity-100" />
        <span className="bg-brand animate-gradient relative flex size-9 items-center justify-center rounded-xl bg-[length:200%_200%] shadow-lg">
          <Zap
            size={iconSize}
            className="fill-white text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            strokeWidth={2.5}
          />
        </span>
      </span>
      {showName && (
        <span className="font-display truncate text-lg font-bold tracking-tight">
          <span className="text-fg">Techno</span>
          <span className="text-gradient">Volt</span>
        </span>
      )}
    </Link>
  );
}
