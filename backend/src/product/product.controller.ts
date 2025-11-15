import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.getProducts();
  }

  @Get('id/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Get('search')
  search(@Query('q') query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.productService.searchProducts(query.trim());
  }

  @Get('top-picks/category/:slug')
  getTopPicksByCategory(@Param('slug') slug: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 8;
    return this.productService.getTopPicksByCategory(slug, limitNum);
  }

  @Get('top-picks/collection/:id')
  getTopPicksByCollection(@Param('id', ParseIntPipe) collectionId: number, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 8;
    return this.productService.getTopPicksByCollection(collectionId, limitNum);
  }

  @Get('category/:slug')
  findByCategory(@Param('slug') slug: string) {
    return this.productService.getProductsByCategory(slug);
  }

  @Get('collection/:id')
  findByCollection(@Param('id', ParseIntPipe) collectionId: number) {
    return this.productService.getProductsByCollection(collectionId);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }
  
  
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
