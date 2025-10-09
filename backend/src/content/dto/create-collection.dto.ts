import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {

  @IsString()
  slug: string;
  
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  collection_image: string[] = [];

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  promo_images: string[] = [];

  @IsInt()
  category_id: number;


}
