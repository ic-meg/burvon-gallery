import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { SalesReportDto, TopProductsReportDto, LowStockReportDto } from './dto/report-filters.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  async getSalesReport(@Query() query: SalesReportDto) {
    try {
      const result = await this.reportsService.getSalesReport(
        query.dateFrom, 
        query.dateTo, 
        query.groupBy, 
        query.orderStatus
      );
      return {
        success: true,
        data: result.data,
        summary: result.summary,
        message: 'Sales report retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve sales report',
      };
    }
  }

  @Get('inventory')
  async getInventoryReport() {
    try {
      const result = await this.reportsService.getInventoryReport();
      return {
        success: true,
        data: result.data,
        message: 'Inventory report retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve inventory report',
      };
    }
  }

  @Get('low-stock')
  async getLowStockReport(@Query() query: LowStockReportDto) {
    try {
      const thresholdNum = query.threshold ? parseInt(query.threshold, 10) : 10;
      const result = await this.reportsService.getLowStockReport(thresholdNum);
      return {
        success: true,
        data: result.data,
        message: 'Low stock report retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve low stock report',
      };
    }
  }

  @Get('top-products')
  async getTopProductsReport(@Query() query: TopProductsReportDto) {
    try {
      const limitNum = query.limit === 'all' ? -1 : (query.limit ? parseInt(query.limit, 10) : 10);
      const result = await this.reportsService.getTopProductsReport(
        query.dateFrom, 
        query.dateTo, 
        limitNum
      );
      return {
        success: true,
        data: result.data,
        message: 'Top products report retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve top products report',
      };
    }
  }
}
