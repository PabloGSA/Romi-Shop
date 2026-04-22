/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Permite cargar imágenes desde URLs externas
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
