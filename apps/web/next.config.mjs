/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone only when STANDALONE_BUILD=true (Docker builds)
  // Leave empty for local dev to use 'next start' normally
  ...(process.env.STANDALONE_BUILD === 'true' && { output: 'standalone' }),
  images: {
    remotePatterns: [
      {
        hostname: 'ih1.redbubble.net',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: 'cdnb.artstation.com',
      },
      {
        hostname: 'ddragon.leagueoflegends.com',
      },
      {
        hostname: 'raw.communitydragon.org',
      },
      {
        hostname: 'https://res.cloudinary.com',
      },
      {
        hostname: 'https://res-console.cloudinary.com',
      },
      {
        hostname: 'res-console.cloudinary.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}
export default nextConfig
