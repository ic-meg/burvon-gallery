import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { DatabaseService } from '../database/database.service';
@Module({
  controllers: [ContentController],
  providers: [ContentService, DatabaseService],
})
export class ContentModule {}
