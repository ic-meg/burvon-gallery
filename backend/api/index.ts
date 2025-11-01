import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = { runtime: 'nodejs20.x' };

const server = express();

let cachedHandler: any;
let isBooting = false;

async function bootstrap() {
  if (isBooting) {
  }
  
  try {
    isBooting = true;
    
    const bootstrapTimeout = setTimeout(() => {
      console.error('Bootstrap timeout after 30 seconds');
    }, 30000);

    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      logger: ['error', 'warn'],
    });
    
    app.enableCors({
      origin: [
        'https://burvon-gallery.website',
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.VITE_FRONTEND_URL || 'https://burvon-gallery.website'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    await app.init();
    clearTimeout(bootstrapTimeout);
    
    isBooting = false;
    
    return serverless(server);
  } catch (error) {
    isBooting = false;
    console.error('Failed to bootstrap app:', error);
    throw error;
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    if (!cachedHandler) {
      cachedHandler = await bootstrap();
    }
    return cachedHandler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
  }
}