import { LogOut, Search, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

import { Brand } from './Brand';

export function Topbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const urlSearch = searchParams.get('search') ?? '';
  const [query, setQuery] = useState(urlSearch);
  const [syncedSearch, setSyncedSearch] = useState(urlSearch);

  // Adjust state during render when the URL changes from elsewhere (back button,
  // a category link). React re-runs this component immediately, without an extra
  // commit — the documented alternative to a setState-in-effect.
  if (urlSearch !== syncedSearch) {
    setSyncedSearch(urlSearch);
    setQuery(urlSearch);
  }

  function handleSearch(event) {
    event.preventDefault();
    const trimmed = query.trim();
    // Preserve any active category filter instead of resetting the page.
    const next = new URLSearchParams(searchParams);
    if (trimmed) {
      next.set('search', trimmed);
    } else {
      next.delete('search');
    }
    navigate({ pathname: '/videos', search: next.toString() });
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Signed out');
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="border-line bg-sidebar/85 sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-md md:px-8">
      {/* The sidebar is hidden on phones, so the brand moves up here. */}
      <Brand className="shrink-0 md:hidden" showName={false} />

      <form onSubmit={handleSearch} role="search" className="relative min-w-0 flex-1 md:max-w-sm">
        <Search
          className="text-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          size={16}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search videos..."
          aria-label="Search videos"
          className="border-line bg-raised text-fg placeholder:text-subtle focus:border-primary focus:bg-surface w-full rounded-lg border py-2 pr-3 pl-9 text-sm transition-colors focus:outline-none"
        />
      </form>

      {/* ml-auto pins the account actions to the far right, away from the search box. */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {isAuthenticated ? (
          <>
            <span
              className="text-muted hidden max-w-[220px] items-center gap-2 truncate text-sm lg:flex"
              title={user.email}
            >
              {isAdmin ? (
                <ShieldCheck size={16} className="text-primary shrink-0" />
              ) : (
                <UserRound size={16} className="shrink-0" />
              )}
              {user.email}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              aria-label="Sign out"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" to="/login">
              Sign in
            </Button>
            <Button size="sm" to="/register" className="hidden sm:inline-flex">
              Sign up
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
