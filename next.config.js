const nextConfig = {
  
  output: 'export',


  webpack: (config, { isServer }) => {
    // Disable 'fs' module for client-side builds
    config.module.rules.push({
      test: /\/node_modules\/cloudscraper\/lib\/brotli.js/,
      loader: 'null-loader',
    });
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }

    return config;
  },
};

module.exports = nextConfig;