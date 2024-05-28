// trpc/appRouter.ts
import { initTRPC } from '@trpc/server';
import { productsRouter } from './productsRouter';

const t = initTRPC.create();
const router = t.router;

export const appRouter = router({
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
