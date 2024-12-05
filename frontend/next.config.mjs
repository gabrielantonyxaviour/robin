/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "noun-api.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
