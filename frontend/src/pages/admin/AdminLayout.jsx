import { NavLink, Outlet } from 'react-router-dom';

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
  return (
    <>
      <PageHeader title="Admin panel" description="Manage content and users" />

      <div className="border-line no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto border-b px-4 md:mx-0 md:px-0">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                '-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'border-primary text-primary'
                  : 'text-muted hover:text-fg border-transparent'
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </>
  );
}
