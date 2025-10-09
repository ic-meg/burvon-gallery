import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

 
  @IsString()
  description?: string;


  @Type(() => Number)
  @IsNumber()
  original_price?: number;


  @Type(() => Number)
  @IsNumber()
  current_price?: number;


  @Type(() => Number)
  @IsInt()
  stock?: number;


  @IsString()
  size?: string;


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
}
