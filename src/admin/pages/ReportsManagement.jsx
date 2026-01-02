import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import { reportsApi } from "../../api/reportApi";
import { exportReportToExcel, exportAllReportsToExcel } from "../../utils/excelExport";

import {
  NextIConBlack,
  PrevIConBlack,  
  DropDownIconBlack,
  DropUpIconBlack,
} from '../../assets/index.js';

const ReportsManagement = ({ hasAccess = true, canEdit = true, isCSR = false, isClerk = false, isManager = false }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportsData, setReportsData] = useState({});
  const [summaryData, setSummaryData] = useState({});

  // Sales Report specific filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [groupBy, setGroupBy] = useState('daily');
  const [orderStatus, setOrderStatus] = useState('all');
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);
  const [showOrderStatusDropdown, setShowOrderStatusDropdown] = useState(false);

  // Top Products Report filters
  const [topProductsLimit, setTopProductsLimit] = useState('10');
  const [showTopProductsDropdown, setShowTopProductsDropdown] = useState(false);
  const [topProductsDateFrom, setTopProductsDateFrom] = useState('');
  const [topProductsDateTo, setTopProductsDateTo] = useState('');

  // Low Stock Report filters
  const [stockThreshold, setStockThreshold] = useState('10');

  const itemsPerPage = 10;

  // Tab state
  const [activeTab, setActiveTab] = useState('sales');

  const reportTabs = [
    { id: 'sales', label: 'Sales Report' },
    { id: 'inventory', label: 'Inventory Report' },
    { id: 'lowstock', label: 'Low Stock Report' },
    { id: 'topproducts', label: 'Top Products Report' }
  ];

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && reportTabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Sales Report filter options
  const groupByOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const orderStatusOptions = [

    { value: 'paid', label: 'Paid' },
    { value: 'completed', label: 'Completed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  // Top Products Report filter options
  const topProductsOptions = [
    { value: '5', label: 'Top 5' },
    { value: '10', label: 'Top 10' },
    { value: 'all', label: 'All' }
  ];

  const pageOptions = [
    { key: 'Dashboard', label: 'Dashboard' },
    { key: 'Order Management', label: 'Order Management' },
    { key: 'Product Management', label: 'Product Management' },
    { key: 'Collections Management', label: 'Collections Management' },
    { key: 'Live Chat', label: 'Live Chat' },
    { key: 'Content Management', label: 'Content Management' },
    { key: 'User Management', label: 'User Management' },
    { key: 'Reports', label: 'Reports' }
  ];

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const filters = { dateFrom, dateTo, groupBy, orderStatus };
      const response = await reportsApi.getSalesReport(filters);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      const data = response.data;
      if (data && data.success) {
        setReportsData(prev => ({ ...prev, sales: data.data }));
        setSummaryData(prev => ({ ...prev, sales: data.summary }));
      } else {
        setError(data?.message || 'Failed to fetch sales report');
      }
    } catch (err) {
      setError('Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryReport = async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getInventoryReport();
      
      if (response.error) {
        setError(response.error);
        return;
      }

      const data = response.data;
      if (data && data.success) {
        setReportsData(prev => ({ ...prev, inventory: data.data }));
      } else {
        setError(data?.message || 'Failed to fetch inventory report');
      }
    } catch (err) {
      setError('Failed to fetch inventory report');
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockReport = async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getLowStockReport(parseInt(stockThreshold));
      
      if (response.error) {
        setError(response.error);
        return;
      }

      const data = response.data;
      if (data && data.success) {
        setReportsData(prev => ({ ...prev, lowstock: data.data }));
      } else {
        setError(data?.message || 'Failed to fetch low stock report');
      }
    } catch (err) {
      setError('Failed to fetch low stock report');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProductsReport = async () => {
    try {
      setLoading(true);
      const filters = { 
        dateFrom: topProductsDateFrom, 
        dateTo: topProductsDateTo, 
        limit: topProductsLimit 
      };
      const response = await reportsApi.getTopProductsReport(filters);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      const data = response.data;
      if (data && data.success) {
        setReportsData(prev => ({ ...prev, topproducts: data.data }));
      } else {
        setError(data?.message || 'Failed to fetch top products report');
      }
    } catch (err) {
      setError('Failed to fetch top products report');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when tab changes or filters change
  useEffect(() => {
    const fetchData = () => {
      setError(null);
      switch (activeTab) {
        case 'sales':
          fetchSalesReport();
          break;
        case 'inventory':
          fetchInventoryReport();
          break;
        case 'lowstock':
          fetchLowStockReport();
          break;
        case 'topproducts':
          fetchTopProductsReport();
          break;
        default:
          break;
      }
    };

    fetchData();
  }, [activeTab]);

  // Trigger refetch when filters change
  useEffect(() => {
    if (activeTab === 'sales') {
      const timeoutId = setTimeout(() => {
        fetchSalesReport();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [dateFrom, dateTo, groupBy, orderStatus]);

  useEffect(() => {
    if (activeTab === 'lowstock') {
      const timeoutId = setTimeout(() => {
        fetchLowStockReport();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [stockThreshold]);

  useEffect(() => {
    if (activeTab === 'topproducts') {
      const timeoutId = setTimeout(() => {
        fetchTopProductsReport();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [topProductsDateFrom, topProductsDateTo, topProductsLimit]);

  // Filter and pagination logic
  const filteredReports = useMemo(() => {
    const currentData = reportsData[activeTab] || [];
    
    return currentData.filter(item => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      
      switch (activeTab) {
        case 'sales':
          return item.customer?.toLowerCase().includes(searchLower) ||
                 item.orderId?.toString().includes(searchLower) ||
                 item.paymentMethod?.toLowerCase().includes(searchLower);
        case 'inventory':
        case 'lowstock':
          return item.productName?.toLowerCase().includes(searchLower) ||
                 item.category?.toLowerCase().includes(searchLower);
        case 'topproducts':
          return item.productName?.toLowerCase().includes(searchLower) ||
                 item.category?.toLowerCase().includes(searchLower);
        default:
          return true;
      }
    });
  }, [activeTab, searchQuery, reportsData]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setShowStatusDropdown(false);
    setCurrentPage(1);
  };

  const handleGroupByFilter = (value) => {
    setGroupBy(value);
    setShowGroupByDropdown(false);
    setCurrentPage(1);
  };

  const handleOrderStatusFilter = (status) => {
    setOrderStatus(status);
    setShowOrderStatusDropdown(false);
    setCurrentPage(1);
  };

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
    setCurrentPage(1);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
    setCurrentPage(1);
  };

  // Export functionality
  const handleExportCurrent = () => {
    const currentData = filteredReports; // Use filtered data (what user currently sees)
    
    if (!currentData || currentData.length === 0) {
      alert('No data available to export');
      return;
    }

    // Prepare filters object for filename
    const filters = {
      dateFrom,
      dateTo,
      groupBy,
      orderStatus,
      threshold: stockThreshold,
      limit: topProductsLimit
    };

    // Export current tab data
    const success = exportReportToExcel(activeTab, currentData, filters);
    
    if (success) {
      // Show success message briefly
      const originalText = document.querySelector('.export-btn-text')?.textContent;
      const btn = document.querySelector('.export-btn-text');
      if (btn) {
        btn.textContent = 'Exported!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    }
  };

  const handleExportAll = () => {
    const allData = {};
    let hasData = false;

    // Collect all available report data
    if (reportsData.sales && reportsData.sales.length > 0) {
      allData.sales = reportsData.sales;
      hasData = true;
    }
    if (reportsData.inventory && reportsData.inventory.length > 0) {
      allData.inventory = reportsData.inventory;
      hasData = true;
    }
    if (reportsData.lowstock && reportsData.lowstock.length > 0) {
      allData.lowstock = reportsData.lowstock;
      hasData = true;
    }
    if (reportsData.topproducts && reportsData.topproducts.length > 0) {
      allData.topproducts = reportsData.topproducts;
      hasData = true;
    }

    if (!hasData) {
      alert('No report data available to export');
      return;
    }

    const success = exportAllReportsToExcel(allData);
    
    if (success) {
      // Show success message briefly
      const originalText = document.querySelector('.export-all-btn-text')?.textContent;
      const btn = document.querySelector('.export-all-btn-text');
      if (btn) {
        btn.textContent = 'Exported!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    }
  };

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      
      <div className="px-8 pt-24">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
          </div>
        )}

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
          <div>
            <h1 className="text-5xl bebas text-black">REPORTS MANAGEMENT</h1>
          </div>
          
          {/* Search and Filters - Top Right */}
          <div className="w-full xl:w-auto">
            {/* Sales Report Specific Filters */}
            {activeTab === 'sales' && (
              <div className="flex flex-wrap gap-3 items-end">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  />
                </div>

                {/* Date Range */}
                <div className="flex gap-2">
                  <div>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={handleDateFromChange}
                      className="w-36 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={handleDateToChange}
                      className="w-36 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black bg-white"
                    />
                  </div>
                </div>

                {/* Group By Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowGroupByDropdown(!showGroupByDropdown)}
                    className="flex items-center justify-between w-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black bg-white"
                  >
                    <span className="truncate">{groupByOptions.find(option => option.value === groupBy)?.label}</span>
                    <img 
                      src={showGroupByDropdown ? DropUpIconBlack : DropDownIconBlack} 
                      alt="dropdown" 
                      className="w-4 h-4 ml-2 flex-shrink-0" 
                    />
                  </button>
                  
                  {showGroupByDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-20">
                      {groupByOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleGroupByFilter(option.value)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 avant text-sm text-black first:rounded-t-lg last:rounded-b-lg"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top Products Report Filters */}
            {activeTab === 'topproducts' && (
              <div className="flex flex-wrap gap-3 items-end">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  />
                </div>

                {/* Date Range */}
                <div className="flex gap-2">
                  <div>
                    <input
                      type="date"
                      value={topProductsDateFrom}
                      onChange={(e) => setTopProductsDateFrom(e.target.value)}
                      className="w-36 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={topProductsDateTo}
                      onChange={(e) => setTopProductsDateTo(e.target.value)}
                      className="w-36 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black bg-white"
                    />
                  </div>
                </div>

                {/* Top Products Limit */}
                <div className="relative">
                  <button
                    onClick={() => setShowTopProductsDropdown(!showTopProductsDropdown)}
                    className="flex items-center justify-between w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black bg-white"
                  >
                    <span className="truncate">{topProductsOptions.find(option => option.value === topProductsLimit)?.label}</span>
                    <img 
                      src={showTopProductsDropdown ? DropUpIconBlack : DropDownIconBlack} 
                      alt="dropdown" 
                      className="w-4 h-4 ml-2 flex-shrink-0" 
                    />
                  </button>
                  
                  {showTopProductsDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-20">
                      {topProductsOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setTopProductsLimit(option.value);
                            setShowTopProductsDropdown(false);
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 avant text-sm text-black first:rounded-t-lg last:rounded-b-lg"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Low Stock Report Filters */}
            {activeTab === 'lowstock' && (
              <div className="flex flex-wrap gap-3 items-end">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  />
                </div>

                {/* Stock Threshold */}
                <div className="flex items-center gap-2">
                  <span className="avant text-sm text-gray-600">Stock ≤</span>
                  <input
                    type="number"
                    value={stockThreshold}
                    onChange={(e) => setStockThreshold(e.target.value)}
                    min="1"
                    max="50"
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black bg-white"
                  />
                </div>
              </div>
            )}

            {/* General filters for other tabs */}
            {!['sales', 'topproducts', 'lowstock'].includes(activeTab) && (
              <div className="flex gap-3 items-end">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  />
                </div>
                

              </div>
            )}
          </div>
        </div>

        {/* Tabs and Export Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 mb-6 gap-4">
          <div className="flex space-x-8 overflow-x-auto">
            {reportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-black text-black avantbold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 avant'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportCurrent}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg bg-white text-black hover:bg-black hover:text-white transition-colors avant text-sm font-medium whitespace-nowrap"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline export-btn-text">Export Current</span>
              <span className="sm:hidden export-btn-text">Export</span>
            </button>
            
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2 border-2 border-green-600 rounded-lg bg-green-600 text-white hover:bg-green-700 hover:border-green-700 transition-colors avant text-sm font-medium whitespace-nowrap"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M7 7h10a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
              <span className="hidden lg:inline export-all-btn-text">Export All Reports</span>
              <span className="lg:hidden export-all-btn-text">All</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 avant">Loading reports...</div>
            </div>
          ) : currentReports.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 avant">No data available for {reportTabs.find(tab => tab.id === activeTab)?.label}</div>
            </div>
          ) : (
            <>
              {/* Sales Report Table */}
              {activeTab === 'sales' && (
                <>
                  {/* Table Header */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-7 gap-4 p-4">
                      <div className="avantbold text-black text-sm">DATE</div>
                      <div className="avantbold text-black text-sm">ORDER/S</div>
                      <div className="avantbold text-black text-sm">CUSTOMER/S</div>
                      <div className="avantbold text-black text-sm">ITEMS SOLD</div>
                      <div className="avantbold text-black text-sm">TOTAL AMOUNT</div>
      
                    </div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {currentReports.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-7 gap-4 p-4">
                          <div className="avant text-sm text-black">{item.date}</div>
                          <div className="avant text-sm text-black">{item.orderId}</div>
                          <div className="avant text-sm text-black">{item.customer}</div>
                          <div className="avant text-sm text-black">{item.itemsSold}</div>
                          <div className="avant text-sm text-black">₱{Number(item.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>

                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Inventory Report Table */}
              {activeTab === 'inventory' && (
                <>
                  {/* Table Header */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-6 gap-4 p-4">
                      <div className="avantbold text-black text-sm">PRODUCT NAME</div>
                      <div className="avantbold text-black text-sm">CATEGORY</div>
                      <div className="avantbold text-black text-sm">PRICE</div>
                      <div className="avantbold text-black text-sm">STOCK</div>
                      <div className="avantbold text-black text-sm">STATUS</div>
                      <div className="avantbold text-black text-sm">LAST UPDATED</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {currentReports.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-6 gap-4 p-4">
                          <div className="avant text-sm text-black">{item.productName}</div>
                          <div className="avant text-sm text-black">{item.category}</div>
                          <div className="avant text-sm text-black">₱{Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                          <div className="avant text-sm text-black">{item.stock}</div>
                          <div className="avant text-sm text-black">
                            <span className={`px-2 py-1 rounded text-xs avantbold ${
                              item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                              item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="avant text-sm text-black">{item.lastUpdated}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Low Stock Report Table */}
              {activeTab === 'lowstock' && (
                <>
                  {/* Table Header */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div className="avantbold text-black text-sm">PRODUCT NAME</div>
                      <div className="avantbold text-black text-sm">CURRENT STOCK</div>
                      <div className="avantbold text-black text-sm">REORDER LEVEL</div>
                      <div className="avantbold text-black text-sm">STATUS</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {currentReports.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-4 gap-4 p-4">
                          <div className="avant text-sm text-black">{item.productName}</div>
                          <div className="avant text-sm text-black">
                            <span className="text-red-600 avantbold">{item.currentStock}</span>
                          </div>
                          <div className="avant text-sm text-black">{item.reorderLevel}</div>
                          <div className="avant text-sm text-black">
                            <span className="px-2 py-1 rounded text-xs avantbold bg-red-100 text-red-800">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Top Products Report Table */}
              {activeTab === 'topproducts' && (
                <>
                  {/* Table Header */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div className="avantbold text-black text-sm">PRODUCT NAME</div>
                      <div className="avantbold text-black text-sm">CATEGORY</div>
                      <div className="avantbold text-black text-sm">UNITS SOLD</div>
                      <div className="avantbold text-black text-sm">TOTAL REVENUE</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {currentReports.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-4 gap-4 p-4">
                          <div className="avant text-sm text-black">{item.productName}</div>
                          <div className="avant text-sm text-black">{item.category}</div>
                          <div className="avant text-sm text-black">
                            <span className="avantbold text-blue-600">{item.unitsSold}</span>
                          </div>
                          <div className="avant text-sm text-black">
                            <span className="avantbold text-green-600">₱{Number(item.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Other Report Tables - Generic Layout */}
              {!['sales', 'inventory', 'lowstock', 'topproducts'].includes(activeTab) && (
                <>
                  {/* Table Header */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div className="avantbold text-black text-sm">COLUMN 1</div>
                      <div className="avantbold text-black text-sm">COLUMN 2</div>
                      <div className="avantbold text-black text-sm">COLUMN 3</div>
                      <div className="avantbold text-black text-sm">COLUMN 4</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {currentReports.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-4 gap-4 p-4">
                          <div className="avant text-sm text-black">Data 1</div>
                          <div className="avant text-sm text-black">Data 2</div>
                          <div className="avant text-sm text-black">Data 3</div>
                          <div className="avant text-sm text-black">Data 4</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Sales Report Summary Statistics */}
        {/* Sales Report Summary Statistics */}
        {activeTab === 'sales' && !loading && currentReports.length > 0 && summaryData.sales && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-2xl avantbold text-black">{summaryData.sales.totalOrders}</div>
              <div className="text-sm avant text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-2xl avantbold text-black">₱{Number(summaryData.sales.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-sm avant text-gray-600">Total Revenue</div>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-2xl avantbold text-black">₱{Number(summaryData.sales.averageOrderValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-sm avant text-gray-600">Average Order Value</div>
            </div>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm avant text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length} results
            </div>
            
            <div className="flex items-center border-2 border-black rounded-lg overflow-hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center border-r border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ width: '44px', height: '44px' }}
              >
                <img src={PrevIConBlack} alt="previous" className="w-5 h-5" />
              </button>
              
              <div className="flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center transition ${
                      currentPage === page
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    } ${page < totalPages ? 'border-r border-black' : ''}`}
                    style={{ width: '44px', height: '44px' }}
                  >
                    <span className="avant text-sm font-medium">{page}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center border-l border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ width: '44px', height: '44px' }}
              >
                <img src={NextIConBlack} alt="next" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManagement;
