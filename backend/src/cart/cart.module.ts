import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [CartController],
  providers: [CartService, DatabaseService]
})
export class CartModule {}
