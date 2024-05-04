/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-daisyui"],
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
