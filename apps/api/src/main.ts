import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until logger is ready
  });

  // Get ConfigService instance
  const configService = app.get(ConfigService);

  // Use Winston logger
  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

  // Enable CORS
  app.enableCors({
    origin: '*', // TODO: Configure properly for production
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('LolTimeFlash API')
    .setDescription('Real-time Flash cooldown tracker for League of Legends')
    .setVersion('1.0.0')
    .addTag('monitoring', 'Health checks and metrics endpoints')
    .addTag('game', 'Socket.IO events (documented separately)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'LolTimeFlash API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Get configuration values
  const port = configService.get<number>('API_PORT') || 8888;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  const logLevel = configService.get<string>('LOG_LEVEL') || 'info';
  const isProduction = nodeEnv === 'production';
  const apiUrl = isProduction
    ? configService.get<string>('NEXT_PUBLIC_SOCKET_PORT') ||
      'https://lolsocket.mehdihattou.com'
    : `http://localhost:${port}`;

  await app.listen(port);

  logger.log(`🚀 API server is running on ${apiUrl}`, 'Bootstrap');
  logger.log(
    `📚 API Documentation available at ${apiUrl}/api/docs`,
    'Bootstrap',
  );
  logger.log(`🔌 Socket.IO is ready for connections`, 'Bootstrap');
  logger.log(
    `📊 Logging configured with Winston (level: ${logLevel})`,
    'Bootstrap',
  );
}
void bootstrap();
