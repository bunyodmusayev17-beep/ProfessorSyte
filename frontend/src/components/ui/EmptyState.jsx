import { AlertTriangle, Inbox } from 'lucide-react';

import { cn } from '@/lib/cn';

import { Button } from './Button';
import { Card } from './Card';

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <Card className={cn('flex flex-col items-center gap-2 px-6 py-12 text-center', className)}>
      <div className="bg-raised text-subtle mb-1 flex size-11 items-center justify-center rounded-full">
        <Icon size={20} />
      </div>
      <h3 className="text-fg text-sm font-semibold">{title}</h3>
      {description && <p className="text-muted max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </Card>
  );
}

/** Shown wherever a query fails, with a retry button wired to React Query. */
export function ErrorState({ title = 'Could not load', message, onRetry, className }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={message}
      className={className}
      action={
        onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}
