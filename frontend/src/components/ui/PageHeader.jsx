import { cn } from '@/lib/cn';

export function PageHeader({ title, description, eyebrow, action, className }) {
  return (
    <div
      className={cn(
        'animate-reveal mb-8 flex flex-wrap items-end justify-between gap-4',
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-primary-light mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase">
            <span className="bg-brand h-px w-6" />
            {eyebrow}
          </p>
        )}
        <h1 className="text-fg truncate text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="text-muted mt-1.5 text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
