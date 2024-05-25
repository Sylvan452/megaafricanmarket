import { z } from 'zod';
import { privateProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { getPayloadClient } from '../get-payload';
import { stripe } from '../lib/stripe';
import type Stripe from 'stripe';

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No product IDs provided' });
      }

      const payload = await getPayloadClient();

      try {
        // Fetch products and filter by valid priceId
        const { docs: products } = await payload.find({
          collection: 'products',
          where: {
            id: { in: productIds },
          },
        });

        if (!products.length) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No products found for provided IDs' });
        }

        const filteredProducts = products.filter((prod) => Boolean(prod.priceId));
        if (filteredProducts.length === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'None of the products have a valid priceId' });
        }

        // Create order with user ID and product IDs
        const order = await payload.create({
          collection: 'orders',
          data: {
            _isPaid: false,
            products: filteredProducts.map((prod) => prod.id),
            user: user.id,
            orderedBy: user.id,
            price_SHIPPING: '',
          },
        });

        // Construct line items for Stripe checkout
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = filteredProducts.map((product) => ({
          price: "price_1PIwsWL49CdCQGXa5KDkbj8Y",
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
          },
        }));

        const includeShipping = process.env.INCLUDE_SHIPPING === 'true'; // Optional configuration
        if (includeShipping) {
          const shippingPriceId = process.env.SHIPPING_PRICE_ID;
          if (!shippingPriceId) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Shipping price ID not set in environment' });
          }
          line_items.push({
            price: "price_1PJcdeL49CdCQGXasXyI8sqE",
            quantity: 1,
            adjustable_quantity: {
              enabled: false,
            },
          });
        }

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

        return { url: stripeSession.url };
      } catch (err) {
        console.error('Error creating Stripe session:', err);
        if (err instanceof TRPCError) {
          throw err; // Re-throw TRPCErrors to preserve their details
        } else if (err instanceof Error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `Failed to create payment session: ${err.message}`, cause: err });
        } else {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create payment session' });
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
