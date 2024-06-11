/** @type {import('next').NextConfig} */
import myWebpackConfig from './webpack.config.js';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        pathname: '**',
        port: '3000',
        protocol: 'http',
      },
    ],
  },
  // webpack: (
  //   config,
  //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  // ) => {
  //   // Important: return the modified config
  //   return { ...config, ...myWebpackConfig };
  // },
};

export default nextConfig;
