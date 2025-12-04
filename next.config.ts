import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    // `domains` is deprecated; prefer `remotePatterns` to whitelist hostnames.
    // See: https://nextjs.org/docs/messages/deprecated-images-domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude @tensorflow/tfjs-node from bundling on server-side
      config.externals = config.externals || [];
      config.externals.push('@tensorflow/tfjs-node');
    }
    return config;
  },
}

export default nextConfig