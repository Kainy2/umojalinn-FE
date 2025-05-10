import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umoja-dev-s3.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "umoja-prod-bucket.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
