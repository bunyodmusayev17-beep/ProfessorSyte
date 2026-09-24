import { Link } from 'react-router-dom';

import { cn } from '@/lib/cn';

import { Spinner } from './Spinner';

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-raised text-fg border border-line hover:bg-secondary',
  ghost: 'text-muted hover:bg-raised hover:text-fg',
  accent: 'bg-accent text-white hover:bg-violet-600',
  danger: 'bg-danger text-white hover:bg-red-600',
  outlineDanger: 'bg-transparent text-danger border border-danger/40 hover:bg-danger/10',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9 text-sm',
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
    'inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap',
    'transition-colors disabled:cursor-not-allowed disabled:opacity-50',
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
