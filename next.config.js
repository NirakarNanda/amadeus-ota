/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'], // Allowed image domains
    formats: ['image/avif', 'image/webp'], // Preferred formats for optimization
  },
  i18n: {
    locales: ['en', 'es', 'fr'], // Supported locales
    defaultLocale: 'en', // Default locale
  },
  webpack(config, { isServer }) {
    // Custom Webpack configuration
    if (!isServer) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
      // More redirects can be added here
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://external-api.com/:path*',
      },
      // More rewrites can be added here
    ];
  },
  transpilePackages: ['react-speech-recognition'], // Packages to transpile
};

module.exports = nextConfig;
