import { LogOut, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

import { Brand } from './Brand';

/** Thin gradient bar across the top of the header showing how far the page is scrolled. */
function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      ref={barRef}
      aria-hidden
      className="bg-brand absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 shadow-[0_0_8px_rgb(96_165_250)]"
    />
  );
}

export function Topbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const inputRef = useRef(null);

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

  // "/" or Ctrl/⌘+K jumps to search from anywhere, like most dev-tool sites.
  useEffect(() => {
    function onKeyDown(event) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      const isShortcut =
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !isTyping);
      if (isShortcut) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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

  const displayName = user?.email?.split('@')[0];

  return (
    <header className="border-line glass sticky top-0 z-20 flex items-center gap-3 border-b px-4 py-3 md:px-8">
      {/* The sidebar is hidden on phones, so the brand moves up here. */}
      <Brand className="shrink-0 md:hidden" showName={false} />

      <form
        onSubmit={handleSearch}
        role="search"
        className="group relative min-w-0 flex-1 md:max-w-md"
      >
        <Search
          className="text-subtle group-focus-within:text-primary-light pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 transition-colors"
          size={16}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search lessons, gear, topics..."
          aria-label="Search videos"
          className={cn(
            'border-line bg-raised/50 text-fg placeholder:text-subtle w-full rounded-xl border py-2.5 pr-14 pl-10 text-sm',
            'hover:border-secondary transition-all duration-300 focus:outline-none',
            'focus:border-primary/60 focus:bg-raised focus:shadow-[0_0_0_4px_rgb(59_130_246_/_0.15)]'
          )}
        />
        <kbd className="border-line bg-surface text-subtle pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded-md border px-1.5 py-0.5 font-sans text-[10px] font-medium sm:block">
          Ctrl K
        </kbd>
      </form>

      {/* ml-auto pins the account actions to the far right, away from the search box. */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {isAuthenticated ? (
          <>
            <span
              className="text-muted hidden max-w-[220px] items-center gap-2 truncate text-sm lg:flex"
              title={user.email}
            >
              Hi, <span className="text-fg font-medium">{displayName}</span>
              <span className="animate-float inline-block origin-bottom-right">👋</span>
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
            <Button variant="ghost" size="sm" to="/login">
              Sign in
            </Button>
            <Button size="sm" to="/register" className="hidden sm:inline-flex">
              Get started
            </Button>
          </>
        )}
      </div>

      <ScrollProgress />
    </header>
  );
}
