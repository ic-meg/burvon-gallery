import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SizeStockDto {
  @IsNotEmpty()
  @IsString()
  size: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  stock?: number;
}

export class CreateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  
  @Type(() => Number)
  @IsNumber()
  original_price?: number;


  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  current_price?: number;



  @Type(() => Number)
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeStockDto)
  sizeStocks?: SizeStockDto[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  category_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  collection_id: number;

  @IsOptional()
  @IsString()
  model_3d_path?: string;

  @IsOptional()
  @IsString()
  try_on_image_path?: string;
}
