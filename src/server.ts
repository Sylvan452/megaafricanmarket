import express from 'express';
import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import { inferAsyncReturnType } from '@trpc/server';
import bodyParser from 'body-parser';
import { IncomingMessage } from 'http';
import { stripeWebhookHandler } from './webhooks';
import nextBuild from 'next/dist/build';
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import { redirect } from 'next/dist/server/api-utils';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const corsOptions = {
  origin: [
    /\.megaafricanmarket\.com$/,
    'https://megaafricanmarket.com',
    'http://megaafricanmarket.com',
    'https://www.megaafricanmarket.com',
    'http://www.megaafricanmarket.com',
    'https://megaafricanmarket-production-b5f4.up.railway.app',
    'http://megaafricanmarket-production-b5f4.up.railway.app',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use((req, res, next) => {
  console.log(
    'requesting from',
    req.hostname,
    'and ENV is',
    process.env.NODE_ENV,
  );
  if (
    process.env.NODE_ENV === 'production' &&
    !req.hostname.includes('www.megaafricanmarket.com')
  ) {
    console.log('redirecting to main host');
    return res.redirect('https://www.megaafricanmarket.com');
  }

  next();
});
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

export type WebhookRequest = IncomingMessage & {
  rawBody: Buffer;
};
const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post('/api/webhooks/stripe', webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info('Next.js is building for production');
      //@ts-expect-error
      await nextBuild(path.join(__dirname, '../'));

      process.exit();
    });
    return;
  }

  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Add new endpoint for fetching orders
  app.get('/api/orders', async (req, res) => {
    console.log('orders req received');
    const userId = req.query.user;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    console.log('orders user', userId);

    try {
      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          user: {
            equals: userId,
          },
        },
        sort: '-createdAt',
      });

      if (orders.length === 0) {
        return res.status(404).json({ error: 'No orders found for this user' });
      }

      console.log('orders found', orders);
      // Disable caching
      // res.set(
      //   'Cache-Control',
      //   'no-store, no-cache, must-revalidate, proxy-revalidate',
      // );
      // res.set('Pragma', 'no-cache');
      // res.set('Expires', '0');
      // res.set('Surrogate-Control', 'no-store');

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  app.get('/api/search-products', async (req, res) => {
    try {
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          or: [
            {
              name: {
                like: req.query.query,
              },
            },
            {
              category: {
                like: req.query.query,
              },
            },
            // {
            //   brand: {
            //     like: queryOpts.brand,
            //   },
            // },
          ],
        },
        depth: 0,
        // limit: 10,
      });

      // Disable caching
      res.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.set('Surrogate-Control', 'no-store');

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  app.get('/api/location/search', async (req, res) => {
    const searchParam = new URLSearchParams();
    searchParam.append('text', `${req.query?.text}`);
    console.log('sending req with', searchParam.toString());
    let resp;
    try {
      resp = await axios({
        method: 'get',
        // url: `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0&${searchParam.toString()}&boundary.country=${countryCode}`,
        url: `https://api.openrouteservice.org/geocode/${
          req?.query?.mode || 'autocomplete'
        }?api_key=5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0&${searchParam.toString()}&boundary.country=CA,CAN,US,USA`,
        headers: {
          Accept:
            'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          Authorization:
            '5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0',
        },
      });
    } catch (err) {
      console.log('error occurred while searching', err);
      return res.send([]);
    }
    // console.log("found search", resp?.data)
    console.log('found search for', searchParam.toString());
    return res.send(resp?.data);
  });
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info('Next.js started');

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${
          process.env.NEXT_PUBLIC_SERVER_URL ||
          'https://www.megaafricanmarket.com'
        }`,
      );
    });
  });
};

start();
