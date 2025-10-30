import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService, DatabaseService]
})
export class WishlistModule {}
