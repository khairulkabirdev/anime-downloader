/** @type {import('next').NextConfig} */
const nextConfig = {
    
        distDir: 'out',
        webpack: (config) => {
          config.resolve.fallback = { fs: false };
      
          return config;
        },
      
}

module.exports = nextConfig
