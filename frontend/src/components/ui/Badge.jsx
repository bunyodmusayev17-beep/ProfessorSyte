import { cn } from '@/lib/cn';

const TONES = {
  neutral: 'bg-raised text-muted border-line',
  primary: 'bg-primary/15 text-primary-light border-primary/30',
  accent: 'bg-accent/15 text-accent border-accent/30',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
  solidWarning: 'bg-warning border-warning text-bg',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        TONES[tone] ?? TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
