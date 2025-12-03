import { IsOptional, IsString, IsInt, IsArray, IsBoolean, Min, Max } from "class-validator";

export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

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
