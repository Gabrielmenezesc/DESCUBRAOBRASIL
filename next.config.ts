import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: '/DESCUBRAOBRASIL',
  assetPrefix: '/DESCUBRAOBRASIL',
};

export default nextConfig;
