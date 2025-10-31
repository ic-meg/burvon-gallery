import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';  

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  contentManagement: any;
  private connectionAttempted = false;

  async onModuleInit() {
    if (this.connectionAttempted) return;
    this.connectionAttempted = true;

    try {
      
    
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timeout')), 15000)
      );

      await Promise.race([this.$connect(), timeoutPromise]);
    } catch (error) {
      console.error(' Database connection warning:', error);
     
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
}
