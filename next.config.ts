import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umoja-dev-s3.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
