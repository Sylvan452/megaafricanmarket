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
  // console.log(JSON.stringify(req.body, null, 2));
  console.log();
  // console.log(req.headers);
  console.log();

  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers['stripe-signature'] || '';
  // console.log("stript web sec", process.env.STRIPE_WEBHOOK_SECRET)
  // console.log("stript sig", signature)
  // console.log("raw body", body)
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  } catch (err) {
    res.sendStatus(200);
    return console.log(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const payload = await getPayloadClient();
  if (event.type === 'checkout.session.completed') {
    res.sendStatus(200);
    // console.log(JSON.stringify(req.body, null, 2));
    console.log('even type', event.type);
    console.log('payment intent', event.data.object.payment_intent);
    if (!session?.metadata?.userId || !session?.metadata?.orderId) {
      return console.log(`Webhook Error: No user present in metadata`);
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

    // if (completedUpdate.docs?.length && !completedUpdate?.errors?.length) {
    //   res.sendStatus(200);
    // } else res.sendStatus(400);

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users;

    if (!user) return console.log({ error: 'No such user exists.' });

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

    if (!order) return console.log({ error: 'No such order exists.' });

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
    console.log('about to send mail');
    // send receipt
    try {
      const data = await resend.emails.send({
        from: 'Mega African Market <info@megaafricanmarket.com>',
        to: [user.email],
        subject: 'Thanks for your order! This is your receipt.',
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          order,
          orderId: session.metadata.orderId,
          items: order.items as { product: Product; quantity?: number }[],
        }),
      });
      console.log({ data });
      console.log('mail sent', data);
    } catch (error) {
      console.log('err occured while sending mail', error);
      console.log({ error });
    }
    return;
  }

  if (event.type === 'charge.succeeded') {
    // if (event.type === 'charge.updated') {
    res.sendStatus(200);
    // console.log(JSON.stringify(req.body, null, 2));
    console.log('even type', event.type);
    console.log('payment intent', event.data.object.payment_intent);

    markOrderAsPaid(event, payload);
    // const isPaidUpdate = await payload.update({
    //   collection: 'orders',
    //   data: {
    //     _isPaid: event.data.object.paid,
    //   },
    //   where: {
    //     paymentIntent: {equals: event.data.object.payment_intent as string},
    //   },
    // });
    //   console.log("isPaidUpdate.docs?.length", isPaidUpdate.docs?.length, "isPaidUpdate?.errors?.length", isPaidUpdate?.errors?.length)
    // if (isPaidUpdate.docs?.length && !isPaidUpdate?.errors?.length) {
    //   console.log("marked as paid")
    // } else {
    //   console.log("not marked as paid")
    //   setTimeout(() => {

    //   }, 10_000)
    // }
    // console.log('paid update', isPaidUpdate);
    return;
  }

  // if (event.type === 'charge.succeeded') {
  //   // console.log(JSON.stringify(req.body, null, 2));
  //   console.log("even type", event.type);
  //   console.log("payment intent", event.data.object.payment_intent);
  //   console.log("is paid", event.data.object.paid);
  //   const isPaidUpdate = await payload.update({
  //     collection: 'orders',
  //     data: {
  //       _isPaid: event.data.object.paid,
  //     },
  //     where: {
  //       paymentIntent: {equals: event.data.object.payment_intent as string},
  //     },
  //   });
  //   console.log("isPaidUpdate.docs?.length", isPaidUpdate.docs?.length, "isPaidUpdate?.errors?.length", isPaidUpdate?.errors?.length)
  //   if (isPaidUpdate.docs?.length && !isPaidUpdate?.errors?.length) {
  //     console.log("marked as paid")
  //     res.sendStatus(200);
  //   } else {
  //     console.log("not marked as paid")
  //     res.sendStatus(400);
  //   }
  //   console.log('paid update', isPaidUpdate);
  //   return
  // }

  // if (event.type === 'payment_intent.succeeded') {
  //   // console.log(JSON.stringify(req.body, null, 2));
  //   console.log("even type", event.type);
  //   console.log("payment intent", event.data.object.id);
  //   console.log("is paid", event.data.object.paid);
  //   const isPaidUpdate = await payload.update({
  //     collection: 'orders',
  //     data: {
  //       _isPaid: event.data.object.paid,
  //     },
  //     where: {
  //       paymentIntent: {equals: event.data.object.payment_intent as string},
  //     },
  //   });
  //   console.log("isPaidUpdate.docs?.length", isPaidUpdate.docs?.length, "isPaidUpdate?.errors?.length", isPaidUpdate?.errors?.length)
  //   if (isPaidUpdate.docs?.length && !isPaidUpdate?.errors?.length) {
  //     console.log("marked as paid")
  //     res.sendStatus(200);
  //   } else {
  //     console.log("not marked as paid")
  //     res.sendStatus(400);
  //   }
  //   console.log('paid update', isPaidUpdate);
  //   return
  // }

  console.log('even type', event.type, 'ignored');
  res.sendStatus(200);
  return console.log();
};

async function markOrderAsPaid(event: any, payload: any) {
  const isPaidUpdate = await payload.update({
    collection: 'orders',
    data: {
      _isPaid: event.data.object.paid,
    },
    where: {
      paymentIntent: { equals: event.data.object.payment_intent as string },
    },
  });
  console.log(
    'isPaidUpdate.docs?.length',
    isPaidUpdate.docs?.length,
    'isPaidUpdate?.errors?.length',
    isPaidUpdate?.errors?.length,
  );
  if (isPaidUpdate.docs?.length && !isPaidUpdate?.errors?.length) {
    console.log('marked as paid');
  } else {
    console.log('not marked as paid, would retry next 5 seconds');
    setTimeout(() => {
      markOrderAsPaid(event, payload);
    }, 5_000);
  }
  console.log('paid update', isPaidUpdate);
}
