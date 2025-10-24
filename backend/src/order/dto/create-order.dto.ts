import { IsString, IsEmail, IsOptional, IsArray, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum ShippingMethod {
  Standard = 'Standard',
  Express = 'Express',
  Overnight = 'Overnight'
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export class CreateOrderItemDto {
  @IsNumber()
  product_id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  size?: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  street_address: string;

  @IsString()
  barangay: string;

  @IsString()
  city_municipality: string;

  @IsString()
  province_region: string;

  @IsString()
  postal_code: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsEnum(ShippingMethod)
  shipping_method: ShippingMethod;

  @IsString()
  payment_method: string;

  @IsNumber()
  total_price: number;

  @IsOptional()
  @IsNumber()
  shipping_cost?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsString()
  checkout_session_id: string;
}
