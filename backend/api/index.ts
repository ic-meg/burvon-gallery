import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import serverless from 'serverless-http';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = { runtime: 'nodejs20.x' };

const server = express();

server.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

let cachedHandler: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    await app.init();
    console.log('NestJS app initialized successfully');
    
    return serverless(server);
  } catch (error) {
    console.error('Failed to bootstrap app:', error);
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(req, res);
}