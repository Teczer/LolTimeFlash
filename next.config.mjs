/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ih1.redbubble.net",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "cdnb.artstation.com",
      },
      {
        hostname: "ddragon.leagueoflegends.com",
      },
    ],
  },
};
export default nextConfig;
