import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config as appConfig } from './config/config';
import { WinstonLoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until logger is ready
  });

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

  await app.listen(appConfig.port);

  const serverUrl = appConfig.isProduction
    ? appConfig.apiUrl
    : `http://localhost:${appConfig.port}`;

  logger.log(`🚀 API server is running on ${serverUrl}`, 'Bootstrap');
  logger.log(
    `📚 API Documentation available at ${serverUrl}/api/docs`,
    'Bootstrap',
  );
  logger.log(`🔌 Socket.IO is ready for connections`, 'Bootstrap');
  logger.log(
    `📊 Logging configured with Winston (level: ${appConfig.logLevel})`,
    'Bootstrap',
  );
}
void bootstrap();
