import { Home, SearchX } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="bg-raised text-subtle mb-4 flex size-14 items-center justify-center rounded-full">
        <SearchX size={24} />
      </span>

      <p className="text-primary text-sm font-semibold">404</p>
      <h1 className="text-fg mt-1 text-xl font-semibold">Page not found</h1>
      <p className="text-muted mt-2 max-w-sm text-sm">
        The page you were looking for may have been removed or moved somewhere else.
      </p>

      <Button to="/" className="mt-6">
        <Home size={16} />
        Back to home
      </Button>
    </div>
  );
}
