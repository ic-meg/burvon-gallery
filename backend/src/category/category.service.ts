import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private  readonly db: DatabaseService) {}

    async createCategory(dto: CreateCategoryDto) {
        const category = await this.db.category.create({
            data: {
                ...dto,
            },
        });
        return { message: 'Category created successfully', category };
    }

    async getCategory() {
        const findAll = await this.db.category.findMany({
            include: {
                CategoryContent: true,
            },
        });
        if (findAll.length === 0) {
            throw new NotFoundException('No categories found');
        }
        return findAll;
    }

    async findOne(id: number) {
        const categoryFind = await this.db.category.findUnique({
            where: { category_id: id },
            include: {
                CategoryContent: true,
            },
        });
        if(!categoryFind) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return categoryFind;
    }


    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const categoryUpdate = await this.db.category.update({
            where: { category_id: id },
            data: { ...updateCategoryDto },
        });
        if (!categoryUpdate) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return categoryUpdate;
    }


    async remove(id: number) {
        const categoryDelete = await this.db.category.delete({
            where: { category_id: id },
        });
        if (!categoryDelete) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return categoryDelete;
    }
}
