import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  // GitHub Pages部署配置
  basePath: process.env.NODE_ENV === 'production' ? '/USAlocation' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/USAlocation/' : '',
};

export default nextConfig;
