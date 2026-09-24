import { LogIn } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

import { getVisibleNavItems } from './navigation';

const LOGIN_ITEM = { to: '/login', shortLabel: 'Sign in', icon: LogIn };

export function MobileNav() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Show every tab the user is entitled to: 4 for guests and ordinary users,
  // 5 for admins (the Admin tab must not be dropped — there is no sidebar here
  // to reach it from). Five still fits at 375px.
  const visible = getVisibleNavItems({ isAuthenticated, isAdmin });
  const items = isAuthenticated ? visible : [...visible, LOGIN_ITEM];

  return (
    <nav
      aria-label="Main navigation"
      className="border-line bg-sidebar pb-safe fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t md:hidden"
    >
      {items.map(({ to, shortLabel, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 py-2.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-primary' : 'text-subtle'
            )
          }
        >
          <Icon size={20} className="shrink-0" />
          <span className="max-w-full truncate">{shortLabel}</span>
        </NavLink>
      ))}
    </nav>
  );
}
