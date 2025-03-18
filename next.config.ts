import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
