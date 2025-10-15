import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const category = await this.db.category.findUnique({
      where: { category_id: createProductDto.category_id },
    });
    if (!category)
      throw new NotFoundException(
        `Category with ID ${createProductDto.category_id} not found`,
      );

    const collection = await this.db.collection.findUnique({
      where: { collection_id: createProductDto.collection_id },
    });
    if (!collection)
      throw new NotFoundException(
        `Collection with ID ${createProductDto.collection_id} not found`,
      );

    const { sizeStocks, ...productData } = createProductDto;

    const product = await this.db.product.create({
      data: {
        ...productData,
      },
    });

    function shortCode(str: string, length = 4) {
      const noVowels = str.replace(/[aeiouAEIOU\s]/g, '');
      return noVowels.substring(0, length).toUpperCase();
    }

    function generateSlug(name: string, collectionName: string): string {
      const fullName = `${collectionName}-${name}`;
      return fullName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    //  Generate SKU: CategoryName-CollectionName-ProductName-ProductID
    const sku = `${shortCode(category.name, 3)}-${shortCode(collection.name, 3)}-${shortCode(product.name, 3)}-${product.product_id}`;

    //  Generate slug: CollectionName-ProductName
    const slug = generateSlug(product.name, collection.name);

    //  Update product with SKU and slug
    const updatedProduct = await this.db.product.update({
      where: { product_id: product.product_id },
      data: { sku, slug },
    });

    if (sizeStocks && sizeStocks.length > 0) {
      await this.db.sizeStock.createMany({
        data: sizeStocks.map((sizeStock) => ({
          product_id: product.product_id,
          size: sizeStock.size,
          stock: sizeStock.stock || 0,
        })),
      });
    }

    const productWithSizeStocks = await this.db.product.findUnique({
      where: { product_id: product.product_id },
      include: {
        category: true,
        collection: true,
        sizeStocks: true,
      },
    });

    return {
      message: 'Product created successfully',
      product: productWithSizeStocks,
    };
  }

  async getProducts() {
    const products = await this.db.product.findMany({
      include: {
        category: true,
        collection: true,
        sizeStocks: true,
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
        sizeStocks: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { product };
  }

  async findBySlug(slug: string) {
    const product = await this.db.product.findUnique({
      where: { slug: slug },
      include: {
        category: true,
        collection: true,
        sizeStocks: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { data: product };
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const { sizeStocks, ...productData } = updateProductDto;

    // pag name or collection_id is being updated, reregenerate the slug
    let updatedData: any = { ...productData };
    if (productData.name || productData.collection_id) {
      const currentProduct = await this.db.product.findUnique({
        where: { product_id: id },
        include: { collection: true },
      });

      if (!currentProduct) {
        throw new NotFoundException('Product not found');
      }

      let collectionName = currentProduct.collection?.name;

      if (
        productData.collection_id &&
        productData.collection_id !== currentProduct.collection_id
      ) {
        const newCollection = await this.db.collection.findUnique({
          where: { collection_id: productData.collection_id },
        });
        collectionName = newCollection?.name;
      }

      function generateSlug(name: string, collectionName: string): string {
        const fullName = `${collectionName}-${name}`;
        return fullName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      const productName = productData.name || currentProduct.name;
      if (collectionName) {
        updatedData.slug = generateSlug(productName, collectionName);
      }
    }

    const updatedProduct = await this.db.product.update({
      where: { product_id: id },
      data: updatedData,
    });
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    if (sizeStocks && sizeStocks.length > 0) {
      await this.db.sizeStock.deleteMany({
        where: { product_id: id },
      });

      await this.db.sizeStock.createMany({
        data: sizeStocks.map((sizeStock) => ({
          product_id: id,
          size: sizeStock.size,
          stock: sizeStock.stock || 0,
        })),
      });
    }

    const productWithSizeStocks = await this.db.product.findUnique({
      where: { product_id: id },
      include: {
        category: true,
        collection: true,
        sizeStocks: true,
      },
    });

    return { updatedProduct: productWithSizeStocks };
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
    const categoryName =
      categorySlug.charAt(0).toUpperCase() +
      categorySlug.slice(1).toLowerCase();

    const category = await this.db.category.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: 'insensitive',
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category '${categorySlug}' not found`);
    }

    const products = await this.db.product.findMany({
      where: {
        category_id: category.category_id,
      },
      include: {
        category: true,
        collection: true,
        sizeStocks: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return { products, category };
  }

  async getProductsByCollection(collectionId: number) {
    const collection = await this.db.collection.findUnique({
      where: { collection_id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }

    const products = await this.db.product.findMany({
      where: {
        collection_id: collectionId,
      },
      include: {
        category: true,
        collection: true,
        sizeStocks: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return { products, collection };
  }
}
