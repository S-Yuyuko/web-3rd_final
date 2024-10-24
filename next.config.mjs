/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true, // Strict mode for React
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Add the port if your local server runs on a specific port
        pathname: '/uploads/**', // Allow paths to match images under this folder
      },
      {
        protocol: 'https',
        hostname: 'wuwarren.com',
        port: '443',
        pathname: '/uploads/**', // Adjust to match your images path
      },
    ],
  },
};

export default nextConfig;
