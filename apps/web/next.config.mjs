/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone only when STANDALONE_BUILD=true (Docker builds)
  // Leave empty for local dev to use 'next start' normally
  ...(process.env.STANDALONE_BUILD === 'true' && { output: 'standalone' }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ih1.redbubble.net',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnb.artstation.com',
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/cdn/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.communitydragon.org',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'res-console.cloudinary.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
}
export default nextConfig
