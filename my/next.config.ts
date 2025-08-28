/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  reactStrictMode: true,
  swcMinify: true, // Оптимизация с SWC
  experimental: {
    optimizeFonts: true,
  },
};

export default nextConfig;
