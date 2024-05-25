import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './'

export const trpc = createTRPCReact<AppRouter>({})

const trpcUrl = '/api/trpc';

export const trpcClient = createTRPCReact<AppRouter>({});