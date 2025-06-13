import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

declare const process: {
  env: Record<string, string | undefined>;
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Trust proxy (for production deployment)
  app.set('trust proxy', 1);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Infinure Backend is running on: http://localhost:${port}/api`);
  console.log(`📝 Health check available at: http://localhost:${port}/api/health`);
}

bootstrap();
