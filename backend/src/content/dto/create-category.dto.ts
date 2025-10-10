import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {

  @IsString()
  slug: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category_images?: string[] = []; // multiple images

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  promo_images?: string; // multiple promo images

  @IsNumber()
  category_id: number;
}
