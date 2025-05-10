import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/chats",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
