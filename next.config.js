/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    basePath: isProd ? '/website' : '',
    images: {
      unoptimized: true,
    },  
    distDir: 'dist',
  };
module.exports = nextConfig;