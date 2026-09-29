import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/DESCUBRAOBRASIL",
  assetPrefix: "/DESCUBRAOBRASIL/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/DESCUBRAOBRASIL",
    NEXT_PUBLIC_SITE_URL: "https://gabrielmenezesc.github.io/DESCUBRAOBRASIL",
  },
};

export default nextConfig;
