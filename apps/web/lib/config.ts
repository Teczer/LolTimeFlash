const config = {
  socketPort: process.env.NEXT_PUBLIC_SOCKET_PORT,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
}

export default config
