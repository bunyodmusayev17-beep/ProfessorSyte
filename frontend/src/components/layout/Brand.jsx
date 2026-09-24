import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/cn';
import { env } from '@/lib/env';

export function Brand({ className, iconSize = 18, showName = true }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2', className)} aria-label={env.appName}>
      <span className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
        <Zap size={iconSize} className="text-white" strokeWidth={2.5} />
      </span>
      {showName && <span className="text-fg truncate font-semibold">{env.appName}</span>}
    </Link>
  );
}
