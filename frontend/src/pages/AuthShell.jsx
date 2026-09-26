import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Brand } from '@/components/layout/Brand';
import { HeroVisual } from '@/features/home/HeroVisual';

const PERKS = [
  'Step-by-step video lessons',
  'Exact gear list for every build',
  'Track what you have watched',
];

/** Split-screen auth layout: animated showcase on the left, the form on the right. */
export function AuthShell({ title, subtitle, error, children, footer }) {
  return (
    <div className="bg-bg relative isolate flex min-h-screen">
      {/* Showcase panel (desktop only) */}
      <aside className="bg-hero border-line relative hidden w-[46%] flex-col justify-between overflow-hidden border-r p-10 lg:flex xl:p-14">
        <span aria-hidden className="bg-grid mask-fade absolute inset-0 -z-10 opacity-70" />
        <span
          aria-hidden
          className="animate-drift bg-primary/25 absolute -top-24 -right-16 -z-10 size-80 rounded-full blur-3xl"
        />
        <span
          aria-hidden
          className="animate-drift bg-accent/20 absolute -bottom-28 -left-10 -z-10 size-72 rounded-full blur-3xl"
          style={{ animationDelay: '-7s' }}
        />

        <Brand className="animate-reveal" />

        <div
          className="animate-scale-in mx-auto w-full max-w-sm py-8"
          style={{ animationDelay: '150ms' }}
        >
          <HeroVisual />
        </div>

        <div className="animate-reveal" style={{ animationDelay: '300ms' }}>
          <h2 className="text-fg text-3xl leading-tight font-bold">
            Learn by <span className="text-gradient">building</span>.
          </h2>
          <ul className="mt-5 space-y-2.5">
            {PERKS.map((perk) => (
              <li key={perk} className="text-muted flex items-center gap-2.5 text-sm">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10">
        <span
          aria-hidden
          className="animate-drift bg-primary/15 absolute top-1/4 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full blur-3xl lg:hidden"
        />

        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Brand />
          </div>

          <div className="animate-reveal">
            <h1 className="text-fg text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted mt-2 mb-8 text-sm">{subtitle}</p>}
          </div>

          {error && (
            <div
              role="alert"
              className="animate-scale-in border-danger/40 bg-danger/10 text-danger mb-5 flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="animate-reveal" style={{ animationDelay: '100ms' }}>
            {children}
          </div>

          {footer && (
            <p
              className="animate-reveal text-muted mt-8 text-center text-sm"
              style={{ animationDelay: '200ms' }}
            >
              {footer}
            </p>
          )}

          <p className="mt-8 text-center text-xs">
            <Link
              to="/"
              className="text-subtle hover:text-fg group inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
