// trpc/productsRouter.ts
import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { Product } from '../../../payload-types'; // Adjust the path if necessary

const t = initTRPC.create();
const router = t.router;
const procedure = t.procedure;

// Mock function to fetch products from your database
const fetchProducts = async (): Promise<Product[]> => {
  // Replace this with actual database fetching logic
  return [
    {
      id: '1',
      name: 'Product 1',
      category: 'seafood',
      price: 10,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ranking: 0,
    },
    {
      id: '2',
      name: 'Product 2',
      category: 'fresh_produce',
      price: 20,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ranking: 0,
    },
  ];
};

export const productsRouter = router({
  getProducts: procedure
    .input(
      z.object({
        category: z.string().optional(),
        sort: z.enum(['asc', 'desc']).optional(),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { category, sort, query } = input;
      let products = await fetchProducts();

      if (category) {
        products = products.filter(
          (product: Product) => product.category === category,
        );
      }

      if (query) {
        products = products.filter((product: Product) =>
          product.name.toLowerCase().includes(query.toLowerCase()),
        );
      }

      if (sort) {
        products = products.sort((a: Product, b: Product) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (sort === 'asc') {
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          } else {
            return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
          }
        });
      }

      return products;
    }),
});
