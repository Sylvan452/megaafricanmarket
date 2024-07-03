import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import dotenv from 'dotenv';
import { RichTextAdapter } from 'payload/types';
import { Users } from './collections/Users';
import { Products } from './collections/Products/Products';
import { Media } from './collections/Media';
import Orders from './collections/Orders';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Using type assertion to force the type
const editor = slateEditor({}) as unknown as RichTextAdapter<any[], any, any>;

export default buildConfig({
  // serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  serverURL:
    process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.megaafricanmarket.com',
  collections: [Users, Products, Media, Orders],
  routes: {
    admin: '/sell',
  },
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- MegaAfricanMarket',
      favicon: '/favicon.ico',
      ogImage: '/thumbnail.jpg',
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor,
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
    transactionOptions: false,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
