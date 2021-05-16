import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { Logger } from '@nestjs/common';
const logger = new Logger('Backend');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({limit:'50mb'}));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, ()=> logger.log(`Cloud Backend is listening on port ${PORT}`));
}
bootstrap();
