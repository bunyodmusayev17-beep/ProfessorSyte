import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Brand } from '@/components/layout/Brand';

/** Centred card used by the login and register screens. */
export function AuthShell({ title, subtitle, error, children, footer }) {
  return (
    <div className="bg-hero flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Brand className="text-lg" iconSize={20} />
        </div>

        <div className="border-line bg-surface rounded-card shadow-card border p-6 sm:p-8">
          <h1 className="text-fg text-xl font-semibold">{title}</h1>
          {subtitle && <p className="text-muted mt-1 mb-6 text-sm">{subtitle}</p>}

          {error && (
            <div
              role="alert"
              className="border-danger/40 bg-danger/10 text-danger mb-5 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {children}

          {footer && <p className="text-muted mt-6 text-center text-sm">{footer}</p>}
        </div>

        <p className="text-subtle mt-6 text-center text-xs">
          <Link to="/" className="hover:text-muted transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
