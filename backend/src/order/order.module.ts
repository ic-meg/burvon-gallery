import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { WebhookController } from './webhook.controller';
import { OrderService } from './order.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [OrderController, WebhookController],
  providers: [OrderService, DatabaseService],
  exports: [OrderService],
})
export class OrderModule {}