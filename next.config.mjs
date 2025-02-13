/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" }, 
          { key: "X-Content-Type-Options", value: "nosniff" }, 
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" }, 
          { key: "Access-Control-Allow-Origin", value: "https://epidriveprod.rusu2228.odns.fr/" }, 
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
