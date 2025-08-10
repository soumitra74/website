/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    // basePath: isProd ? '/website' : '',
    // basePath: process.env.DEPLOY_TARGET === 'gh-pages' ? `/${repoName}` : '',
    // assetPrefix: process.env.DEPLOY_TARGET === 'gh-pages' ? `/${repoName}/` : '',
      images: {
      unoptimized: true,
    },  
    distDir: 'dist',
  };
module.exports = nextConfig;