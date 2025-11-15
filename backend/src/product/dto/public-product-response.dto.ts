// DTO for public-facing product responses (filters sensitive data)
export class PublicProductResponseDto {
  product_id: number;
  sku: string;
  name: string;
  description: string;
  original_price: string;
  current_price: string | null;
  size: string;
  images: string[];
  created_at: Date;
  category_id: number;
  collection_id: number;
  slug: string;
  category: {
    category_id: number;
    name: string;
    updated_at: Date;
    updated_by: string | null;
  } | null;
  collection: {
    collection_id: number;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
  } | null;

  static fromProduct(product: any): PublicProductResponseDto {
    return {
      product_id: product.product_id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      original_price: product.original_price?.toString() || product.original_price,
      current_price: product.current_price?.toString() || product.current_price,
      size: product.size,
      images: Array.isArray(product.images) ? product.images : [],
      created_at: product.created_at,
      category_id: product.category_id,
      collection_id: product.collection_id,
      slug: product.slug,
      category: product.category ? {
        category_id: product.category.category_id,
        name: product.category.name,
        updated_at: product.category.updated_at,
        updated_by: product.category.updated_by,
      } : null,
      collection: product.collection ? {
        collection_id: product.collection.collection_id,
        name: product.collection.name,
        description: product.collection.description,
        created_at: product.collection.created_at,
        updated_at: product.collection.updated_at,
      } : null,
    };
  }

  static fromProducts(products: any[]): PublicProductResponseDto[] {
    return products.map(product => this.fromProduct(product));
  }
}

