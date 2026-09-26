import { Link } from 'react-router-dom';

import { cn } from '@/lib/cn';

import { Spinner } from './Spinner';

const VARIANTS = {
  primary:
    'btn-shine bg-brand bg-[length:200%_100%] bg-left text-white shadow-[0_6px_24px_-8px_rgb(59_130_246_/_0.7)] hover:bg-right hover:shadow-glow',
  secondary:
    'bg-raised/70 text-fg border border-line hover:border-primary/40 hover:bg-raised backdrop-blur',
  ghost: 'text-muted hover:bg-raised/80 hover:text-fg',
  accent: 'btn-shine bg-accent text-white hover:bg-violet-600',
  danger:
    'bg-danger text-white hover:bg-red-600 hover:shadow-[0_8px_24px_-8px_rgb(239_68_68_/_0.6)]',
  outlineDanger: 'bg-transparent text-danger border border-danger/40 hover:bg-danger/10',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
  icon: 'h-9 w-9 text-sm rounded-lg',
};

/**
 * One button for the whole app. Renders a `<Link>` when `to` is given and an
 * `<a>` when `href` is, so navigation and actions look identical.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className,
  children,
  to,
  href,
  type = 'button',
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center font-medium whitespace-nowrap select-none',
    'transition-all duration-300 ease-(--ease-out-soft) active:scale-[0.97]',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {isLoading && <Spinner className="size-4" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
}
