import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@node-rs/argon2'],
//   experimental: {
//     authInterrupts: true,
//   }, // enable for forbidden() in auth-utils for authenticated users lacking permission
};

export default nextConfig;
