/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    serverActions: {
      bodySizeLimit: '2000mb',
    },
  },
};

export default nextConfig;
