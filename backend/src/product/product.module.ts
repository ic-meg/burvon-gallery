import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, DatabaseService]
})
export class ProductModule {}
