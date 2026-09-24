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
    <aside className="border-line bg-sidebar sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r md:flex">
      <Brand className="px-5 py-5 text-base" />

      <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-white' : 'text-muted hover:bg-raised hover:text-fg'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <SidebarUser />
    </aside>
  );
}
