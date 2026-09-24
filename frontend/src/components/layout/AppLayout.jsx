import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Spinner } from '@/components/ui/Spinner';

import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/** Shell shared by every page inside the app (everything except auth screens). */
export function AppLayout() {
  return (
    <div className="bg-bg flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        {/* Bottom padding clears the mobile tab bar. */}
        <main id="main" className="flex-1 px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-8">
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <Spinner className="text-primary size-7" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
