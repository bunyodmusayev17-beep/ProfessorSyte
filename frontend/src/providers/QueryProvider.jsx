import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { createQueryClient } from '@/lib/queryClient';

export function QueryProvider({ children }) {
  // One client per app instance, created lazily so StrictMode's double render
  // doesn't throw away a populated cache.
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
