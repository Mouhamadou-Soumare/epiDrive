/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, /@mapbox\/node-pre-gyp/];
    }

    return config;
  },
};

export default nextConfig;
