import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/service-requests", destination: "/services", permanent: true },
      { source: "/service-requests/:id", destination: "/services/:id", permanent: true },
      { source: "/my-jobs", destination: "/jobs", permanent: true },
    ];
  },
};

export default nextConfig;
