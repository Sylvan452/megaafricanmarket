// @ts-nocheck
// lib/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../app/api/trpc/appRouter'; // Adjust the path as necessary

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

export { trpc };
