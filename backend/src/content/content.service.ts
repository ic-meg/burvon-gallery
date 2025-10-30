import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HomepageCreateDto } from './dto/create-homepage.dto';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ContentService {
  constructor(private readonly db: DatabaseService) {}

  // ------------------- Homepage -------------------

  async createHomepage(dto: HomepageCreateDto) {
    const homepage = await this.db.homepageContent.create({ data: dto });
    return { message: 'Homepage content created successfully', homepage };
  }

  async getHomepage() {
    const content = await this.db.homepageContent.findFirst();
    if (!content) {
      return { message: 'No homepage content found', data: null };
    }
    return content;
  }

  async updateHomepage(id: number, dto: UpdateHomepageDto) {
    const existing = await this.db.homepageContent.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Homepage content not found');

    return this.db.homepageContent.update({
      where: { id },
      data: { ...dto, updated_at: new Date() },
    });
  }

  async upsertHomepage(dto: any) {
    // Check if any homepage content exists
    const existing = await this.db.homepageContent.findFirst();
    
    if (existing) {
      // Update existing content
      return this.db.homepageContent.update({
        where: { id: existing.id },
        data: { ...dto, updated_at: new Date() },
      });
    } else {
      // Create new content
      return this.db.homepageContent.create({ data: dto });
    }
  }

  async removeHomepage(id: number) {
    const existing = await this.db.homepageContent.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Homepage content not found');

    await this.db.homepageContent.delete({ where: { id } });
    return { message: `Homepage content ID ${id} deleted successfully.` };
  }

  // ------------------- Category -------------------

  async createCategory(dto: CreateCategoryDto) {
    const category = await this.db.categoryContent.create({ data: dto });
    if(!category) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category created successfully', category };
  }

  async getCategory(slug: string) {
    const category = await this.db.categoryContent.findUnique({
      where: { slug },
    });
    if (!category) throw new NotFoundException(`Category with name ${slug} not found`);
    return category;
  }

  async updateCategory(slug: string, dto: UpdateCategoryDto) {
    const existing = await this.db.categoryContent.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException(`Category with name ${slug} not found`);

    const updated = await this.db.categoryContent.update({
      where: { slug },
      data: { ...dto, updated_at: new Date() },
    });
    return { message: `Category with name ${slug} updated successfully.`, updated };
  }

  async upsertCategory(slug: string, dto: CreateCategoryDto) {
    try {
      // Check if category content exists
      const existing = await this.db.categoryContent.findUnique({ where: { slug } });
      
      if (existing) {
        // Update existing content
        const updated = await this.db.categoryContent.update({
          where: { slug },
          data: { ...dto, updated_at: new Date() },
        });
        return { message: `Category content updated successfully`, category: updated };
      } else {
        // Create new content
        const created = await this.db.categoryContent.create({
          data: { ...dto, slug },
        });
        return { message: `Category content created successfully`, category: created };
      }
    } catch (error) {
      throw error;
    }
  }

  async removeCategory(slug: string) {
    const existing = await this.db.categoryContent.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException(`Category with name ${slug} not found`);

    await this.db.categoryContent.delete({ where: { slug } });
    return { message: `Category with name ${slug} deleted successfully.` };
  }

  // ------------------- Collection -------------------

  async createCollection(dto: CreateCollectionDto) {
    const collection = await this.db.collectionContent.create({
      data: {
        ...dto,
        promo_images: dto.promo_images ? JSON.stringify(dto.promo_images) : undefined,
        collection_image: dto.collection_image ? JSON.stringify(dto.collection_image) : undefined,
      },
    });
    return { message: 'Collection created successfully', collection };  
  }

  async getCollection(slug: string) {
    const collection = await this.db.collectionContent.findUnique({
      where: { slug },
    });
    if (!collection) throw new NotFoundException(`Collection with name ${slug} not found`);
    return collection;
  }

  async updateCollection(slug: string, dto: UpdateCollectionDto) {
    const existing = await this.db.collectionContent.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException(`Collection with name ${slug} not found`);

    const updated = await this.db.collectionContent.update({
      where: { slug },
      data: {
        ...dto,
        updated_at: new Date(),
        promo_images: dto.promo_images ? JSON.stringify(dto.promo_images) : undefined,
        collection_image: dto.collection_image ? JSON.stringify(dto.collection_image) : undefined,
      },
     
    });
    return { message: `Collection with name ${slug} updated successfully.`, updated };
  }

  async removeCollection(slug: string) {
    const existing = await this.db.collectionContent.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException(`Collection with name ${slug} not found`);

    await this.db.collectionContent.delete({ where: { slug } });
    return { message: `Collection with  ${slug} deleted successfully.` };
  }
}
