import { cn } from '@/lib/cn';

export function Card({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn('border-line bg-surface rounded-card shadow-card border', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div
      className={cn('border-line flex items-start justify-between gap-3 border-b p-4', className)}
    >
      <div className="min-w-0">
        <h2 className="text-fg text-sm font-semibold">{title}</h2>
        {description && <p className="text-muted mt-0.5 text-xs">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
