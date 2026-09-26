import { AlertTriangle, Inbox } from 'lucide-react';

import { cn } from '@/lib/cn';

import { Button } from './Button';
import { Card } from './Card';

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <Card
      className={cn(
        'animate-reveal flex flex-col items-center gap-2 overflow-hidden px-6 py-14 text-center',
        className
      )}
    >
      <span aria-hidden className="bg-grid mask-fade absolute inset-0 -z-10 opacity-60" />
      <div className="relative mb-2">
        <span className="bg-primary/20 animate-ping-slow absolute inset-0 rounded-2xl" />
        <div className="border-primary/30 bg-raised text-primary-light relative flex size-14 items-center justify-center rounded-2xl border">
          <Icon size={24} />
        </div>
      </div>
      <h3 className="text-fg text-base font-semibold">{title}</h3>
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
