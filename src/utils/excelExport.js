import * as XLSX from 'xlsx';

/**
 * Export data to Excel file with proper formatting
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the sheet
 * @param {Object} options - Additional options for formatting
 */
export const exportToExcel = (data, filename, sheetName = 'Report', options = {}) => {
  if (!data || data.length === 0) {
    alert('No data available to export');
    return;
  }

  try {
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Apply column width auto-sizing
    const colWidths = [];
    const keys = Object.keys(data[0]);
    
    keys.forEach((key, index) => {
      const maxLength = Math.max(
        key.length, // Header length
        ...data.map(row => String(row[key] || '').length) // Data length
      );
      colWidths[index] = { width: Math.min(Math.max(maxLength + 2, 10), 50) };
    });
    
    worksheet['!cols'] = colWidths;
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate filename with timestamp if not provided
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${timestamp}.xlsx`;
    
    // Write and download file
    XLSX.writeFile(workbook, fullFilename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting to Excel. Please try again.');
    return false;
  }
};


export const exportReportToExcel = (reportType, data, filters = {}) => {
  if (!data || data.length === 0) {
    alert(`No ${reportType} data available to export`);
    return;
  }

  let formattedData = [];
  let filename = '';
  let sheetName = '';

  switch (reportType) {
    case 'sales':
      formattedData = formatSalesData(data);
      filename = 'Sales_Report';
      sheetName = 'Sales Report';
      break;
    
    case 'inventory':
      formattedData = formatInventoryData(data);
      filename = 'Inventory_Report';
      sheetName = 'Inventory Report';
      break;
    
    case 'lowstock':
      formattedData = formatLowStockData(data);
      filename = 'Low_Stock_Report';
      sheetName = 'Low Stock Report';
      break;
    
    case 'topproducts':
      formattedData = formatTopProductsData(data);
      filename = 'Top_Products_Report';
      sheetName = 'Top Products Report';
      break;
    
    default:
      formattedData = data;
      filename = 'Report';
      sheetName = 'Report';
  }

  // Add filter information to filename if available
  if (filters.dateFrom || filters.dateTo || filters.groupBy || filters.threshold) {
    const filterSuffix = [];
    if (filters.groupBy) filterSuffix.push(filters.groupBy);
    if (filters.dateFrom && filters.dateTo) {
      filterSuffix.push(`${filters.dateFrom}_to_${filters.dateTo}`);
    } else if (filters.dateFrom) {
      filterSuffix.push(`from_${filters.dateFrom}`);
    } else if (filters.dateTo) {
      filterSuffix.push(`until_${filters.dateTo}`);
    }
    if (filters.threshold) filterSuffix.push(`threshold_${filters.threshold}`);
    
    if (filterSuffix.length > 0) {
      filename += `_${filterSuffix.join('_')}`;
    }
  }

  return exportToExcel(formattedData, filename, sheetName);
};

/**
 * Format sales data for Excel export
 */
const formatSalesData = (data) => {
  return data.map(item => ({
    'Date': item.date,
    'Order ID': item.orderId,
    'Customer': item.customer,
    'Items Sold': item.itemsSold,
    'Total Amount': typeof item.totalAmount === 'number' 
      ? `₱${item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
      : item.totalAmount
  }));
};

/**
 * Format inventory data for Excel export
 */
const formatInventoryData = (data) => {
  return data.map(item => ({
    'Product Name': item.productName,
    'Category': item.category,
    'Price': typeof item.price === 'number' 
      ? `₱${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
      : item.price,
    'Stock': item.stock,
    'Status': item.status,
    'Last Updated': item.lastUpdated
  }));
};

/**
 * Format low stock data for Excel export
 */
const formatLowStockData = (data) => {
  return data.map(item => ({
    'Product Name': item.productName,
    'Current Stock': item.currentStock,
    'Reorder Level': item.reorderLevel,
    'Status': item.status
  }));
};

/**
 * Format top products data for Excel export
 */
const formatTopProductsData = (data) => {
  return data.map(item => ({
    'Product Name': item.productName,
    'Category': item.category,
    'Units Sold': item.unitsSold,
    'Total Revenue': typeof item.totalRevenue === 'number' 
      ? `₱${item.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
      : item.totalRevenue
  }));
};

/**
 * Export multiple reports to a single Excel file with multiple sheets
 */
export const exportAllReportsToExcel = (reportsData) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Add each report as a separate sheet
    Object.entries(reportsData).forEach(([reportType, data]) => {
      if (data && data.length > 0) {
        let formattedData = [];
        let sheetName = '';
        
        switch (reportType) {
          case 'sales':
            formattedData = formatSalesData(data);
            sheetName = 'Sales';
            break;
          case 'inventory':
            formattedData = formatInventoryData(data);
            sheetName = 'Inventory';
            break;
          case 'lowstock':
            formattedData = formatLowStockData(data);
            sheetName = 'Low Stock';
            break;
          case 'topproducts':
            formattedData = formatTopProductsData(data);
            sheetName = 'Top Products';
            break;
          default:
            formattedData = data;
            sheetName = reportType;
        }
        
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        
        // Auto-size columns
        const colWidths = [];
        if (formattedData.length > 0) {
          const keys = Object.keys(formattedData[0]);
          keys.forEach((key, index) => {
            const maxLength = Math.max(
              key.length,
              ...formattedData.map(row => String(row[key] || '').length)
            );
            colWidths[index] = { width: Math.min(Math.max(maxLength + 2, 10), 50) };
          });
          worksheet['!cols'] = colWidths;
        }
        
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    });
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `All_Reports_${timestamp}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.error('Error exporting all reports:', error);
    alert('Error exporting all reports. Please try again.');
    return false;
  }
};