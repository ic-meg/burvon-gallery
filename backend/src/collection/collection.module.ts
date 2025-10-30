import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { DatabaseService } from '../database/database.service';
@Module({
  controllers: [CollectionController],
  providers: [CollectionService, DatabaseService],
})
export class CollectionModule {}
