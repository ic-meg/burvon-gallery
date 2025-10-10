import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { HomepageCreateDto } from './dto/create-homepage.dto';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

    // ------------------- Homepage -------------------
  @Post()
  create(@Body() createContentDto: HomepageCreateDto) {
    return this.contentService.createHomepage(createContentDto);
  }

  @Post('upsert')
  upsertHomepage(@Body() dto: HomepageCreateDto) {
    return this.contentService.upsertHomepage(dto);
  }

  @Get()
  getHomepage() {
    return this.contentService.getHomepage();
  }

  @Get(':id')
   getHomepageById(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.getHomepage();
    
  }

  @Patch(':id')
  async updateHomepage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomepageDto: UpdateHomepageDto,
  ) {
    return this.contentService.updateHomepage(id, updateHomepageDto);
  }

  @Delete(':id')
  deleteHomepage(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.removeHomepage(id);
  }

  // ------------------- Category -------------------
  @Post('category/:slug')
  upsertCategory(@Param('slug') slug: string, @Body() createCategoryDto: CreateCategoryDto) {
    return this.contentService.upsertCategory(slug, createCategoryDto);
  }

  @Get('category/:slug')
  getCategory(@Param('slug') slug: string) {
    return this.contentService.getCategory(slug);
  }

  @Patch('category/:slug')  
  async updateCategory(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.contentService.updateCategory(slug, updateCategoryDto);
  }

  @Delete('category/:slug')
  deleteCategory(@Param('slug') slug: string) {
    return this.contentService.removeCategory(slug);
  }

  // ------------------- Collection -------------------
  @Post('collection/:slug')
  createCollection(@Param('slug') slug: string, @Body() createCollectionDto: CreateCollectionDto) {
    return this.contentService.createCollection(createCollectionDto);
  }

  @Get('collection/:slug')
  getCollection(@Param('slug') slug: string) {
    return this.contentService.getCollection(slug);
  }

  @Patch('collection/:slug')
  async updateCollection(
    @Param('slug') slug: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.contentService.updateCollection(slug, updateCollectionDto);
  } 

  @Delete('collection/:slug')
  deleteCollection(@Param('slug') slug: string) {
    return this.contentService.removeCollection(slug);  
  }

}