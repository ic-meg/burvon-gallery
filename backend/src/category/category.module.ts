import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, DatabaseService],
})
export class CategoryModule {}
