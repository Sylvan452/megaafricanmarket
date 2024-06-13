import { authRouter } from './auth-router';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { QueryValidator } from '../lib/validators/query-validator';
import { getPayloadClient } from '../get-payload';
import { paymentRouter } from './payment-router';
import { is } from 'date-fns/locale';

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
        isSearch: z.boolean().default(false).optional(),
        page: z.number().min(1).max(1000),
      }),
    )
    .query(async ({ input }) => {
      const { query, cursor, isSearch, page: pageInput } = input;
      const { sort, limit, page, ...queryOpts } = query;

      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<
        string,
        { equals: string } | { like: string }
      > = {};
      // const parssedQueryOpts: Record<
      //   string,
      //   { equals: string }
      // > = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: String(value),
        };
      });
      // if (isSearch) {
      //   parsedQueryOpts = {

      //   }
      //   parsedQueryOpts.or: []
      //   if (parsedQueryOpts.name)
      //     parsedQueryOpts.name = {
      //       like: queryOpts.name!,
      //     };
      //   if (parsedQueryOpts.category)
      //     parsedQueryOpts.category = {
      //       like: queryOpts.category!,
      //     };
      //   if (parsedQueryOpts.brand)
      //     parsedQueryOpts.brand = {
      //       like: queryOpts.brand!,
      //     };
      // })
      // const page = cursor || 1;
      console.log("cursor, page", cursor, page)

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'products',
        where: {
          ...(isSearch
            ? {
                or: [
                  {
                    name: {
                      like: queryOpts.name,
                    },
                  },
                  {
                    category: {
                      like: queryOpts.category,
                    },
                  },
                  // {
                  //   brand: {
                  //     like: queryOpts.brand,
                  //   },
                  // },
                ],
              }
            : parsedQueryOpts),
        },
        sort,
        depth: 1,
        limit,
        page: page || pageInput || 1,
      });

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

export type AppRouter = typeof appRouter;
