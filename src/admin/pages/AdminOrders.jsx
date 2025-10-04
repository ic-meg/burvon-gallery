import React, { useState, useMemo } from "react";
import AdminHeader from "../../components/admin/AdminHeader";

import {
NextIConBlack,
PrevIConBlack,  
DropDownIconBlack,
DropUpIconBlack 
} from '../../assets/index.js'

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dateSort, setDateSort] = useState('newest'); // Added date sort state
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const itemsPerPage = 5;

  // Sample orders data with more variety (added Shipped status)
  const allOrders = [
    {
      id: "#38940123",
      customer: "Giuliani Calais",
      amount: "₱ 1,180.00",
      status: "Pending",
      date: "Sep 20, 2025"
    },
    {
      id: "#38940124",
      customer: "John Doe",
      amount: "₱ 2,500.00",
      status: "Processing",
      date: "Sep 19, 2025"
    },
    {
      id: "#38940125",
      customer: "Jane Smith",
      amount: "₱ 3,200.00",
      status: "Shipped",
      date: "Sep 18, 2025"
    },
    {
      id: "#38940126",
      customer: "Mike Johnson",
      amount: "₱ 1,800.00",
      status: "Return/Refund",
      date: "Sep 17, 2025"
    },
    {
      id: "#38940127",
      customer: "Sarah Wilson",
      amount: "₱ 2,100.00",
      status: "Cancellation",
      date: "Sep 16, 2025"
    },
    {
      id: "#38940128",
      customer: "Tom Brown",
      amount: "₱ 1,500.00",
      status: "Pending",
      date: "Sep 15, 2025"
    },
    {
      id: "#38940129",
      customer: "Lisa Davis",
      amount: "₱ 2,800.00",
      status: "Shipped",
      date: "Sep 14, 2025"
    },
    {
      id: "#38940130",
      customer: "David Lee",
      amount: "₱ 3,500.00",
      status: "Completed",
      date: "Sep 13, 2025"
    }
  ];

  // Filter and sort orders based on active tab, search query, and date sort
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Filter by status (tab)
    if (activeTab !== 'all') {
      const statusMap = {
        'pending': 'Pending',
        'processing': 'Processing', 
        'shipped': 'Shipped',
        'completed': 'Completed',
        'return': 'Return/Refund',
        'cancellation': 'Cancellation'
      };
      filtered = filtered.filter(order => order.status === statusMap[activeTab]);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.amount.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateSort === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return filtered;
  }, [activeTab, searchQuery, dateSort]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowSortDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate counts for each tab
  const getTabCounts = () => {
    return {
      all: allOrders.length,
      pending: allOrders.filter(o => o.status === 'Pending').length,
      processing: allOrders.filter(o => o.status === 'Processing').length,
      shipped: allOrders.filter(o => o.status === 'Shipped').length,
      completed: allOrders.filter(o => o.status === 'Completed').length,
      return: allOrders.filter(o => o.status === 'Return/Refund').length,
      cancellation: allOrders.filter(o => o.status === 'Cancellation').length,
    };
  };

  const tabCounts = getTabCounts();

  // Tab configuration with dynamic counts (added shipped tab)
  const tabs = [
    { id: 'all', label: 'ALL ORDERS', count: tabCounts.all },
    { id: 'pending', label: 'PENDING', count: tabCounts.pending },
    { id: 'processing', label: 'PROCESSING', count: tabCounts.processing },
    { id: 'shipped', label: 'SHIPPED', count: tabCounts.shipped },
    { id: 'completed', label: 'COMPLETED', count: tabCounts.completed },
    { id: 'return', label: 'RETURN/REFUND', count: tabCounts.return },
    { id: 'cancellation', label: 'CANCELLATION', count: tabCounts.cancellation }
  ];

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when tab, search, or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedOrders([]);
  }, [activeTab, searchQuery, dateSort]);

  // Handle select all functionality
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle individual order selection
  const handleOrderSelect = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Handle accept order functionality
  const handleAcceptOrder = () => {
    console.log('Accepting orders:', selectedOrders);
  };

  // Handle print waybill functionality
  const handlePrintWaybill = () => {
    console.log('Printing waybills for orders:', selectedOrders);
  };

  // Handle mark as shipped functionality
  const handleMarkAsShipped = () => {
    console.log('Marking orders as shipped:', selectedOrders);
  };

  // Handle mark as delivered functionality
  const handleMarkAsDelivered = () => {
    console.log('Marking orders as delivered:', selectedOrders);
  };

  // Get status badge styling (added shipped status)
  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-gray-100 text-gray-800 border border-gray-300',
      'Processing': 'bg-blue-100 text-blue-800 border border-blue-300',
      'Shipped': 'bg-purple-100 text-purple-800 border border-purple-300',
      'Completed': 'bg-green-100 text-green-800 border border-green-300',
      'Return/Refund': 'bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs',
      'Cancellation': 'bg-red-100 text-red-800 border border-red-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium avant ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">
              ORDERS MANAGEMENT
            </h1>
            
            {/* Search Bar and Date Sort */}
            <div className="flex items-center space-x-4">
              {/* Date Sort Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-36"
                >
                  <span>{dateSort === "newest" ? "Newest First" : "Oldest First"}</span>
                  <img
                    src={showSortDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setDateSort("newest");
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm avant hover:bg-gray-50 transition-colors rounded-t-lg ${
                        dateSort === "newest" ? "bg-gray-100 font-medium" : ""
                      }`}
                      type="button"
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => {
                        setDateSort("oldest");
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm avant hover:bg-gray-50 transition-colors rounded-b-lg ${
                        dateSort === "oldest" ? "bg-gray-100 font-medium" : ""
                      }`}
                      type="button"
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Orders"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Status Tabs with horizontal line and conditional buttons */}
          <div className="relative mb-6">
            {/* Long horizontal line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
            
            {/* Tabs and Buttons Container */}
            <div className="flex justify-between items-end">
              {/* Tabs */}
              <div className="flex space-x-8 relative">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 pb-3 relative transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'text-black'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="avant font-medium text-sm">{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs avant ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                    
                    {/* Active tab indicator line */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Conditional Buttons for Pending Tab */}
              {activeTab === 'pending' && (
                <div className="flex items-center space-x-4 pb-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-4 py-2 transition-colors avant text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                    />
                    <span>SELECT ALL</span>
                  </button>
                  <button
                    onClick={handleAcceptOrder}
                    disabled={selectedOrders.length === 0}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm"
                  >
                    ACCEPT ORDER
                  </button>
                </div>
              )}

              {/* Conditional Buttons for Processing Tab */}
              {activeTab === 'processing' && (
                <div className="flex items-end pb-3">
                  <div className="flex flex-col items-end">
                    <button
                      onClick={handlePrintWaybill}
                      disabled={selectedOrders.length === 0}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm whitespace-nowrap mb-2"
                    >
                      PRINT WAYBILL
                    </button>
                    <div className="flex flex-row items-center space-x-4">
                      <button
                        onClick={handleSelectAll}
                        className="flex items-center space-x-2 px-4 py-2 transition-colors avant text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                        />
                        <span>SELECT ALL</span>
                      </button>
                      <button
                        onClick={handleMarkAsShipped}
                        disabled={selectedOrders.length === 0}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm whitespace-nowrap"
                      >
                        MARK AS SHIPPED
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Buttons for Shipped Tab */}
              {activeTab === 'shipped' && (
                <div className="flex items-center space-x-4 pb-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-4 py-2 transition-colors avant text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                    />
                    <span>SELECT ALL</span>
                  </button>
                  <button
                    onClick={handleMarkAsDelivered}
                    disabled={selectedOrders.length === 0}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avant text-sm font-medium"
                  >
                    MARK AS DELIVERED
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border-2 border-[#000000] rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4">
              <div className={`grid gap-4 text-sm font-medium text-[#000000] avantbold uppercase ${
                (activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') ? 'grid-cols-7' : 'grid-cols-6'
              }`}>
                {(activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') && <div>SELECT</div>}
                <div>ORDER ID</div>
                <div>CUSTOMER</div>
                <div>AMOUNT</div>
                <div>STATUS</div>
                <div>ORDER DATE</div>
                <div>ACTIONS</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className={`grid gap-4 items-center ${
                      (activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') ? 'grid-cols-7' : 'grid-cols-6'
                    }`}>
                      {/* Checkbox for Pending, Processing, and Shipped Tabs */}
                      {(activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') && (
                        <div>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleOrderSelect(order.id)}
                            className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                          />
                        </div>
                      )}

                      {/* Order ID */}
                      <div className="font-medium text-black avant">
                        {order.id}
                      </div>

                      {/* Customer */}
                      <div className="text-gray-900 avant">
                        {order.customer}
                      </div>

                      {/* Amount */}
                      <div className="font-medium text-black avant">
                        {order.amount}
                      </div>

                      {/* Status */}
                      <div>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Order Date */}
                      <div className="text-gray-900 avant">
                        {order.date}
                      </div>

                      {/* Actions */}
                      <div>
                        <button className="px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avantbold text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 avant">
                  No orders found matching your criteria.
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 w-full">
              <div
                className="inline-flex items-stretch border border-black rounded-full overflow-hidden bg-white"
                style={{ height: 44 }}
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="flex items-center justify-center border-r border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    width: 44,
                    height: 44,
                    borderTopLeftRadius: 22,
                    borderBottomLeftRadius: 22,
                  }}
                >
                  <img src={PrevIConBlack} alt="Prev" className="w-5 h-5" />
                </button>
                <div
                  className="flex items-center justify-center text-black avantbold font-bold text-base select-none whitespace-nowrap px-6"
                  style={{
                    letterSpacing: 2,
                    height: 44,
                  }}
                >
                  {currentPage} OF {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  className="flex items-center justify-center border-l border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    width: 44,
                    height: 44,
                    borderTopRightRadius: 22,
                    borderBottomRightRadius: 22,
                  }}
                >
                  <img src={NextIConBlack} alt="Next" className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
