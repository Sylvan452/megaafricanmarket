import { z } from 'zod';
import { privateProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { getPayloadClient } from '../get-payload';
import { stripe } from '../lib/stripe';
import type Stripe from 'stripe';
import { Product } from '@/payload-types';
import { getDeliverDistForLocation } from '../lib/utils';

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            product: z.string(),
            // product: z.object({}).required(),
            quantity: z.number().optional(),
          }),
        ),
        //
        totalAmount: z.number(),
        needsShipping: z.boolean(),
        shippingDeets: z
          .object({
            name: z.string().optional(),
            phone: z.string().optional(),
            country: z.string().optional(),
            city: z.string().optional(),
            address: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('\n\nstarted');
      const { user } = ctx;
      const { items, totalAmount, needsShipping, shippingDeets } = input;
      console.log('\n\nstarted2');

      if (items.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No items provided',
        });
      }

      console.log('\n\nstarted3');

      const payload = await getPayloadClient();

      try {
        // Fetch products and filter by valid priceId
        const { docs: products } = await payload.find({
          collection: 'products',
          where: {
            id: { in: items.map(({ product }) => product) },
          },
        });

        if (!products.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No products found for provided IDs',
          });
        }

        const filteredProducts = products.filter(
          (prod) => prod.priceId && typeof prod.priceId === 'string',
        );
        if (filteredProducts.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'None of the products have a valid priceId',
          });
        }

        // Create order with user ID, product IDs, and total amount
        console.log('\n\nfiltered producst', filteredProducts);
        const filterdProductsMap: Record<string, Product> = {};

        const filteredProductsIdsSet = new Set(
          filteredProducts.map((p) => {
            filterdProductsMap[p.id] = p;
            return p.id;
          }),
        );
        const filteredItems = items.filter((item) =>
          filteredProductsIdsSet.has(item.product),
        );
        const order = await payload.create({
          collection: 'orders',
          data: {
            _isPaid: false,
            items: filteredItems as {
              product: string | Product;
              quantity?: number | null;
              id?: string | null;
            }[],
            //  filteredProducts.map((prod) => prod.id),
            // user: user.id,
            orderedBy: user.id,
            // price_SHIPPING: '',
            //
            totalAmount,
            // ...(needsShipping
            //   ? { deliveryMethod: 'ship' }
            //   : { deliveryMethod: 'pickup' }),
            deliveryMethod: (needsShipping ? 'ship' : 'pickup') as
              | 'ship'
              | 'pickup',
            ...(needsShipping ? { deliveryDetails: shippingDeets } : {}),
          },
        });

        // Construct line items for Stripe checkout
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
          filteredItems.map(({ product, quantity }) => {
            return {
              price: filterdProductsMap[product].priceId as string,
              quantity,
              adjustable_quantity: {
                enabled: true,
              },
            };
          });

        // filteredProducts.map((product) => ({
        //   price: product.priceId as string,
        //   quantity: 1,
        //   adjustable_quantity: {
        //     enabled: true,
        //   },
        // }));

        if (needsShipping) {
          const shippingPriceId = process.env.SHIPPING_PRICE_ID;
          if (shippingPriceId) {
            try {
              // Validate the shipping price ID
              console.log('retrieving');
              try {
                const price = await stripe.prices.retrieve(shippingPriceId);
                console.log('price retrieved', price);
              } catch (err) {
                console.log('error while rereiving price', err);
              }
              line_items.push({
                price: shippingPriceId,
                quantity: (await (async () => {
                  try {
                    const dist = await getDeliverDistForLocation(
                      shippingDeets?.address!,
                      shippingDeets?.city!,
                      shippingDeets?.country!,
                    );
                    console.log('dist calculated', dist);
                    if (dist && dist - 5 > 0) return Math.round(dist - 5);
                  } catch (err) {
                    console.log(
                      'err occurede while calculating distance\n',
                      err,
                    );
                  }
                  return 0;
                })()!) as number,
                // quantity: 1,
                adjustable_quantity: {
                  enabled: false,
                },
              });
            } catch (error) {
              console.warn(
                `Invalid shipping price ID: ${shippingPriceId}. Skipping shipping fee.`,
              );
            }
          } else {
            console.warn(
              'Shipping price ID not set in environment; skipping shipping fee.',
            );
          }
        }

        // Add transaction fee to line items
        const transactionFeePriceId = process.env.TRANSACTION_FEE_ID;
        if (!transactionFeePriceId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Transaction fee price ID not set in environment',
          });
        }
        line_items.push({
          price: transactionFeePriceId,
          quantity: 1,
          adjustable_quantity: {
            enabled: false,
          },
        });

        // Create Stripe checkout session
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ['card'],
          mode: 'payment',
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        console.log('stripeSession', stripeSession);

        return { url: stripeSession.url };
      } catch (err) {
        console.error('Error creating Stripe session:', err);
        if (err instanceof TRPCError) {
          throw err; // Re-throw TRPCErrors to preserve their details
        } else if (err instanceof Error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create payment session: ${err.message}`,
            cause: err,
          });
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create payment session',
          });
        }
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();
      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: { equals: orderId },
        },
      });

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),
});
