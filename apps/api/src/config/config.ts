/**
 * Configuration centralisée pour l'API
 * Toutes les variables d'environnement sont gérées ici
 */

interface IApiConfig {
  port: number;
  nodeEnv: string;
  logLevel: string;
  apiUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return (
      process.env.NEXT_PUBLIC_SOCKET_PORT || 'https://lolsocket.mehdihattou.com'
    );
  }

  const port = process.env.API_PORT || '8888';
  return `http://localhost:${port}`;
};

export const config: IApiConfig = {
  port: parseInt(process.env.API_PORT || '8888', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  apiUrl: getApiUrl(),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
};
