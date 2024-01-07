/** @type {import('next').NextConfig} */
const nextConfig = {
     output: 'export',
        distDir: 'out',
        webpack: (config) => {
          config.resolve.fallback = { fs: false };
      
          return config;
        },
      
}

module.exports = nextConfig
