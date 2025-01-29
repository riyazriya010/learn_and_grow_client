import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['learnandgrow.s3.us-east-1.amazonaws.com'], // Add your S3 bucket domain here
  },
};

export default nextConfig;
