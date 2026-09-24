import { cn } from '@/lib/cn';

export function PageHeader({ title, description, action, className }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        <h1 className="text-fg truncate text-xl font-semibold sm:text-2xl">{title}</h1>
        {description && <p className="text-muted mt-1 text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
