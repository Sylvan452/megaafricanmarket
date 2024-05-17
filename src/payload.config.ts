import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import dotenv from 'dotenv';
import { RichTextAdapter } from 'payload/types';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Using type assertion to force the type
const editor = slateEditor({}) as unknown as RichTextAdapter<any[], any, any>;

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  collections: [], 
  routes: {
    admin: '/sell',
  },
  admin: {
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
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
