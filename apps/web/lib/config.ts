const config = {
  socketPort: process.env.NEXT_PUBLIC_SOCKET_PORT || 'http://localhost:8888',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888',
}

export default config
