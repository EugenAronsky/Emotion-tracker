import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true, // игнорировать ошибки ESLint при сборке
  },
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
  },
};

export default nextConfig;
