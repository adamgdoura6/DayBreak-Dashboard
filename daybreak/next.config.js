/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true,
    },
    images: {
      domains: ['i.scdn.co'], // For Spotify album covers
    }
  };
  
  module.exports = nextConfig;