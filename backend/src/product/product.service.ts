import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  async createProduct(createProductDto: CreateProductDto) {
    // 1️ Validate category
    const category = await this.db.category.findUnique({
      where: { category_id: createProductDto.category_id },
    });
    if (!category)
      throw new NotFoundException(
        `Category with ID ${createProductDto.category_id} not found`,
      );

    // 2️ Validate collection
    const collection = await this.db.collection.findUnique({
      where: { collection_id: createProductDto.collection_id },
    });
    if (!collection)
      throw new NotFoundException(
        `Collection with ID ${createProductDto.collection_id} not found`,
      );

    // 3️ Create the product WITHOUT SKU first
    const product = await this.db.product.create({
      data: {
        ...createProductDto,
      },
    });

    function shortCode(str: string, length = 4) {
      const noVowels = str.replace(/[aeiouAEIOU\s]/g, '');
      return noVowels.substring(0, length).toUpperCase();
    }

    // 4️ Generate SKU: CategoryName-CollectionName-ProductName-ProductID
    const sku = `${shortCode(category.name, 3)}-${shortCode(collection.name, 3)}-${shortCode(product.name, 3)}-${product.product_id}`;

    // 5️ Update product with SKU
    const updatedProduct = await this.db.product.update({
      where: { product_id: product.product_id },
      data: { sku },
    });

    return { message: 'Product created successfully', product: updatedProduct };
  }

  async getProducts() {
    const products = await this.db.product.findMany({
      include: {
        category: true,
        collection: true,
      },
    });
    if (products.length === 0) {
      throw new NotFoundException('No products found');
    }
    return { products };
  }

  async findOne(id: number) {
    const product = await this.db.product.findUnique({
      where: { product_id: id },
      include: {
        category: true,
        collection: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { product };
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.db.product.update({
      where: { product_id: id },
      data: { ...updateProductDto },
    });
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return { updatedProduct };
  }

  async deleteProduct(id: number) {
    const deletedProduct = await this.db.product.delete({
      where: { product_id: id },
    });
    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }
    return { deletedProduct };
  }

  async getProductsByCategory(categorySlug: string) {
    // Find the category by slug (name in lowercase)
    const category = await this.db.category.findFirst({
      where: {
        name: {
          equals: categorySlug,
          mode: 'insensitive', // Case-insensitive match
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category '${categorySlug}' not found`);
    }

    // Get all products for this category
    const products = await this.db.product.findMany({
      where: {
        category_id: category.category_id,
      },
      include: {
        category: true,
        collection: true,
      },
      orderBy: {
        created_at: 'desc', // Most recent first
      },
    });

    return { products, category };
  }
}
