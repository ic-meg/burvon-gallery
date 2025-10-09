import { IsArray, IsOptional, IsString } from "class-validator";

export class HomepageCreateDto {
  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hero_images?: string[] = [];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  promo_image?: string;
}
