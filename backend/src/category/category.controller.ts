import { Body, Controller, Get, Post, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Get()
    getAll() {
        return this.categoryService.getCategory();
    }

    @Get('id/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findOne(id);
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.categoryService.findBySlug(slug);
    }

    @Patch('id/:category_id')
    update(@Param('category_id', ParseIntPipe) category_id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(category_id, updateCategoryDto);
    }

    @Delete('id/:category_id')
    delete(@Param('category_id', ParseIntPipe) category_id: number) {
        return this.categoryService.remove(category_id);
    }
}
