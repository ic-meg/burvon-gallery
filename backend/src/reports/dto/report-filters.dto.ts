import { IsOptional, IsString, IsDateString, IsNumberString, IsIn } from 'class-validator';

export class SalesReportDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsIn(['daily', 'monthly', 'yearly'])
  groupBy?: 'daily' | 'monthly' | 'yearly';

  @IsOptional()
  @IsIn(['all', 'paid', 'completed', 'refunded'])
  orderStatus?: 'all' | 'paid' | 'completed' | 'refunded';
}

export class TopProductsReportDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class LowStockReportDto {
  @IsOptional()
  @IsNumberString()
  threshold?: string;
}
