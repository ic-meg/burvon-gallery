import { IsInt, IsOptional, IsString, IsBoolean, IsArray, Min, Max } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  product_id: number;

  @IsOptional()
  @IsInt()
  order_item_id?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  review_text?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  videos?: string[];

  @IsOptional()
  @IsBoolean()
  show_username?: boolean;
}
