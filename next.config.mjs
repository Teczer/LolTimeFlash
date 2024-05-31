/** @type {import('next').NextConfig} */
const nextConfig = {
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
