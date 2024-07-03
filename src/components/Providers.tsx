// @ts-nocheck
// src/components/Providers.tsx
'use client';

import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/trpc/client';
import WishlistProvider from '@/contexts/WishlistContext';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${
          process.env.NEXT_PUBLIC_SERVER_URL ||
          'https://www.megaafricanmarket.com'
        }/api/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
  });

  return (
    <SessionProvider>
      <WishlistProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      </WishlistProvider>
    </SessionProvider>
  );
};

export default Providers;
