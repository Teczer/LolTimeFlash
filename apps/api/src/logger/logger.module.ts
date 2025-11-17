import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger.service';

@Global() // Rend le logger disponible partout sans avoir à l'importer
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
