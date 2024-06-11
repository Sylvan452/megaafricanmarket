import express from 'express';
import { WebhookRequest } from './server';
import { stripe } from './lib/stripe';
import type Stripe from 'stripe';
import { getPayloadClient } from './get-payload';
import { Product } from './payload-types';
import { Resend } from 'resend';
import { ReceiptEmailHtml } from './components/emails/ReceiptEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
// console.log

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  console.log('STRIPE WEBHOOK RECEIVED');
  // console.log();
  // console.log(req.body);
  console.log();
  console.log(JSON.stringify(req.body, null, 2));
  console.log();
  console.log(req.headers);
  console.log();

  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers['stripe-signature'] || '';

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${
          err instanceof Error ? err.message : 'Unknown Error'
        }`,
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const payload = await getPayloadClient();
  if (event.type === 'checkout.session.completed') {
    if (!session?.metadata?.userId || !session?.metadata?.orderId) {
      return res.status(400).send(`Webhook Error: No user present in metadata`);
    }

    const completedUpdate = await payload.update({
      collection: 'orders',
      data: {
        paymentIntent: event.data.object.payment_intent as string,
        // _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });
    console.log('checkout completed update', completedUpdate);

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users;

    if (!user) return res.status(404).json({ error: 'No such user exists.' });

    const { docs: orders } = await payload.find({
      collection: 'orders',
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    const [order] = orders;

    if (!order) return res.status(404).json({ error: 'No such order exists.' });

    // console.log('\n\nitems', order.items);
    // for (const product of order.products) {
    //   // const productDoc =

    //   await payload.update({
    //     collection: 'orders',
    //     data: {
    //       ranking: true,
    //     },
    //     where: {
    //       id: {
    //         equals: order.products,
    //       },
    //     },
    //   })
    // }

    // send receipt
    try {
      const data = await resend.emails.send({
        from: 'Mega African Market <info@megaafricanmarket.com>',
        to: [user.email],
        subject: 'Thanks for your order! This is your receipt.',
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          items: order.items as { product: Product; quantity?: number }[],
        }),
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  if (event.type === 'charge.updated') {
    const isPaidUpdate = await payload.update({
      collection: 'orders',
      data: {
        _isPaid: event.data.object.paid,
      },
      where: {
        paymentIntent: { equals: event.data.object.payment_intent as string },
      },
    });

    console.log('paid update', isPaidUpdate);
  }

  return res.status(200).send();
};
