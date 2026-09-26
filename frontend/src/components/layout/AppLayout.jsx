import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Spinner } from '@/components/ui/Spinner';

import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/** Fixed, slowly drifting colour fields behind the whole app. */
function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span className="animate-drift bg-primary/[0.13] absolute -top-40 right-[-10%] size-[38rem] rounded-full blur-[120px]" />
      <span
        className="animate-drift bg-accent/[0.11] absolute bottom-[-20%] left-[10%] size-[34rem] rounded-full blur-[120px]"
        style={{ animationDelay: '-7s' }}
      />
      <span
        className="animate-drift bg-cyan/[0.06] absolute top-1/3 left-1/2 size-[26rem] rounded-full blur-[120px]"
        style={{ animationDelay: '-3s' }}
      />
      <span className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)] opacity-40" />
    </div>
  );
}

/** Shell shared by every page inside the app (everything except auth screens). */
export function AppLayout() {
  const { pathname } = useLocation();
  // Admin tabs share one layout; keying on the section keeps them from re-fading.
  const transitionKey = pathname.startsWith('/admin') ? '/admin' : pathname;

  return (
    <div className="relative isolate flex min-h-screen">
      <AmbientBackground />
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main id="main" className="flex-1 px-4 py-6 md:px-8 md:py-10">
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <Spinner className="text-primary size-7" />
              </div>
            }
          >
            <div key={transitionKey} className="animate-fade">
              <Outlet />
            </div>
          </Suspense>
        </main>

        <Footer />
      </div>

      <MobileNav />
    </div>
  );
}
