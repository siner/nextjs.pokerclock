/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración específica para Cloudflare Pages
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Optimizaciones para edge runtime
  webpack: (config, { isServer, dev }) => {
    // Configuración para evitar problemas con módulos de Node.js en edge runtime
    if (isServer && !dev) {
      config.externals = config.externals || [];
      config.externals.push({
        async_hooks: "async_hooks",
        fs: "fs",
        path: "path",
        crypto: "crypto",
        stream: "stream",
        util: "util",
        events: "events",
      });
    }

    // Configuración para resolver módulos correctamente
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      util: false,
      events: false,
      async_hooks: false,
    };

    return config;
  },
};

export default nextConfig;
