import { Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

import { Brand } from './Brand';
import { getVisibleNavItems } from './navigation';
import { SidebarUser } from './SidebarUser';

export function Sidebar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const items = getVisibleNavItems({ isAuthenticated, isAdmin });

  return (
    <aside className="border-line glass sticky top-0 z-20 hidden h-screen w-64 shrink-0 flex-col border-r md:flex">
      <Brand className="px-5 py-6" />

      <p className="text-subtle px-6 pb-2 text-[10px] font-semibold tracking-[0.2em] uppercase">
        Menu
      </p>

      <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon, end }, index) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={{ animationDelay: `${index * 60}ms` }}
            className={({ isActive }) =>
              cn(
                'group animate-reveal relative isolate flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'text-white'
                  : 'text-muted hover:text-fg hover:bg-raised/60 hover:translate-x-0.5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <>
                    <span className="from-primary/25 via-accent/15 absolute inset-0 -z-10 rounded-xl bg-gradient-to-r to-transparent" />
                    <span className="bg-brand absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full shadow-[0_0_12px_rgb(96_165_250)]" />
                  </>
                )}
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-brand shadow-glow text-white'
                      : 'bg-raised/60 group-hover:bg-raised group-hover:text-primary-light'
                  )}
                >
                  <Icon size={16} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!isAuthenticated && (
        <div className="border-primary/20 from-primary/15 via-accent/10 relative mx-3 mb-3 overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-4">
          <span className="bg-accent/30 animate-drift absolute -top-8 -right-8 size-24 rounded-full blur-2xl" />
          <Sparkles size={18} className="text-primary-light mb-2" />
          <p className="text-fg text-sm font-semibold">Track your progress</p>
          <p className="text-muted mt-1 text-xs">
            Save videos, leave comments and see how far you&#39;ve come.
          </p>
        </div>
      )}

      <SidebarUser />
    </aside>
  );
}
