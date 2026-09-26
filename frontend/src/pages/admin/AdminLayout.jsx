import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/cn';

const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/videos', label: 'Videos' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <PageHeader
        eyebrow="Control room"
        title="Admin panel"
        description="Manage content and users"
      />

      <div className="no-scrollbar border-line bg-surface/60 -mx-4 mb-8 flex w-fit max-w-[calc(100%+2rem)] gap-1 overflow-x-auto rounded-2xl border p-1 backdrop-blur md:mx-0 md:max-w-full">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'shrink-0 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300',
                isActive
                  ? 'bg-brand shadow-glow text-white'
                  : 'text-muted hover:text-fg hover:bg-raised/60'
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div key={pathname} className="animate-fade">
        <Outlet />
      </div>
    </>
  );
}
