import React, { useState, useMemo } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';

import {
  NextIConBlack,
  PrevIConBlack,  
  DropDownIconBlack,
  DropUpIconBlack,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  AddImage,
  Add3D 
} from '../../assets/index.js';

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedStockLevel, setSelectedStockLevel] = useState('all');
  const [selectedSellingStatus, setSelectedSellingStatus] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [showSellingDropdown, setShowSellingDropdown] = useState(false);
  
  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all'); // all, pending, approved, rejected
  const [newProduct, setNewProduct] = useState({
    name: '',
    collection: '',
    category: '',
    originalPrice: '',
    currentPrice: '',
    stock: '',
    sizes: [],
    images: [null, null, null, null, null],
    description: ''
  });
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: '',
    collection: '',
    category: '',
    originalPrice: '',
    currentPrice: '',
    sizes: [],
    images: [null, null, null, null, null],
    description: ''
  });
  const [stockData, setStockData] = useState({
    totalStock: 0,
    sizes: {
      'Size 3': { stock: 0 },
      'Size 4': { stock: 0 },
      'Size 5': { stock: 0 },
      'Size 6': { stock: 0 },
      'Size 7': { stock: 0 },
      'Size 8': { stock: 0 },
      'Size 9': { stock: 0 }
    },
    general: { stock: 0 }
  });
  const [showModalCollectionDropdown, setShowModalCollectionDropdown] = useState(false);
  const [showModalCategoryDropdown, setShowModalCategoryDropdown] = useState(false);
  const [showEditModalCollectionDropdown, setShowEditModalCollectionDropdown] = useState(false);
  const [showEditModalCategoryDropdown, setShowEditModalCategoryDropdown] = useState(false);
  
  const itemsPerPage = 8;

  // Sample reviews data
  const [productReviews, setProductReviews] = useState({
    1: [
      {
        id: 1,
        customerName: "Maria Santos",
        email: "maria@email.com",
        rating: 5,
        comment: "Amazing quality! The necklace is exactly as described and looks even better in person. Highly recommend!",
        date: "2024-10-01",
        status: "pending" // pending, approved, rejected
      },
      {
        id: 2,
        customerName: "John Doe",
        email: "john@email.com",
        rating: 4,
        comment: "Good quality product. Fast delivery. Would buy again.",
        date: "2024-09-28",
        status: "approved"
      },
      {
        id: 3,
        customerName: "Jane Smith",
        email: "jane@email.com",
        rating: 5,
        comment: "Perfect gift for my sister! She loved it so much.",
        date: "2024-09-25",
        status: "approved"
      },
      {
        id: 4,
        customerName: "Anonymous User",
        email: "test@email.com",
        rating: 1,
        comment: "This is a fake review with inappropriate content.",
        date: "2024-09-20",
        status: "rejected"
      }
    ],
    2: [
      {
        id: 5,
        customerName: "Ana Cruz",
        email: "ana@email.com",
        rating: 5,
        comment: "Beautiful earrings! Very comfortable to wear all day.",
        date: "2024-10-02",
        status: "pending"
      }
    ],
    3: [
      {
        id: 6,
        customerName: "Mark Wilson",
        email: "mark@email.com",
        rating: 4,
        comment: "Nice ring, good value for money. Fits perfectly.",
        date: "2024-09-30",
        status: "approved"
      }
    ]
  });

  // Helper function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowCollectionDropdown(false);
    setShowStockDropdown(false);
    setShowSellingDropdown(false);
  };

  // Collection options for modal
  const modalCollectionOptions = [
    { value: '', label: 'Select Collection' },
    { value: 'love-language', label: 'Love Language Collection' },
    { value: 'classic', label: 'Classic Collection' },
    { value: 'clash', label: 'Clash Collection' },
    { value: 'rebellion', label: 'The Rebellion Collection' }
  ];

  // Category options for modal
  const modalCategoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'rings', label: 'Rings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'earrings', label: 'Earrings' }
  ];

  const sizeOptions = ['Size 3', 'Size 4', 'Size 5', 'Size 6', 'Size 7', 'Size 8', 'Size 9'];

  // Handle review status change
  const handleReviewStatusChange = (reviewId, newStatus) => {
    setProductReviews(prev => ({
      ...prev,
      [selectedProduct.id]: prev[selectedProduct.id].map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    }));
  };

  // Handle reviews modal
  const handleReviewsClick = (product) => {
    setSelectedProduct(product);
    setShowReviewsModal(true);
    setReviewFilter('all');
  };

  // Get filtered reviews
  const getFilteredReviews = () => {
    if (!selectedProduct || !productReviews[selectedProduct.id]) return [];
    
    const reviews = productReviews[selectedProduct.id];
    if (reviewFilter === 'all') return reviews;
    return reviews.filter(review => review.status === reviewFilter);
  };

  // Get review stats
  const getReviewStats = () => {
    if (!selectedProduct || !productReviews[selectedProduct.id]) {
      return { total: 0, pending: 0, approved: 0, rejected: 0, avgRating: 0 };
    }
    
    const reviews = productReviews[selectedProduct.id];
    const approvedReviews = reviews.filter(r => r.status === 'approved');
    const avgRating = approvedReviews.length > 0 
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : 0;
    
    return {
      total: reviews.length,
      pending: reviews.filter(r => r.status === 'pending').length,
      approved: reviews.filter(r => r.status === 'approved').length,
      rejected: reviews.filter(r => r.status === 'rejected').length,
      avgRating: avgRating
    };
  };

  // Get star display
  const getStarDisplay = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  // Handle modal form changes for add product
  const handleProductChange = (field, value) => {
    setNewProduct(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      // Clear sizes if category is not rings
      if (field === 'category' && value !== 'rings') {
        updated.sizes = [];
      }
      return updated;
    });
  };

  // Handle modal form changes for edit product
  const handleEditProductChange = (field, value) => {
    setEditProduct(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      // Clear sizes if category is not rings
      if (field === 'category' && value !== 'rings') {
        updated.sizes = [];
      }
      return updated;
    });
  };

  // Handle size selection for add product
  const handleSizeToggle = (size) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle size selection for edit product
  const handleEditSizeToggle = (size) => {
    setEditProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle image upload for add product
  const handleImageUpload = (index, file) => {
    setNewProduct(prev => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return {
        ...prev,
        images: newImages
      };
    });
  };

  // Handle image upload for edit product
  const handleEditImageUpload = (index, file) => {
    setEditProduct(prev => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return {
        ...prev,
        images: newImages
      };
    });
  };

  // Handle stock modal
  const handleStockClick = (product) => {
    setSelectedProduct(product);
    
    // Initialize stock data based on product category
    if (product.category.toLowerCase() === 'rings') {
      const initialSizesStock = {};
      sizeOptions.forEach(size => {
        initialSizesStock[size] = { 
          stock: Math.floor(Math.random() * 20)
        };
      });
      setStockData({
        totalStock: product.stock,
        sizes: initialSizesStock,
        general: { stock: 0 }
      });
    } else {
      setStockData({
        totalStock: product.stock,
        sizes: {},
        general: { stock: product.stock }
      });
    }
    
    setShowStockModal(true);
  };

  // Handle stock updates
  const handleStockUpdate = (type, size, field, value) => {
    setStockData(prev => {
      const newData = { ...prev };
      if (type === 'size') {
        newData.sizes[size][field] = parseInt(value) || 0;
      } else {
        newData.general[field] = parseInt(value) || 0;
      }
      
      // Recalculate total stock
      if (selectedProduct.category.toLowerCase() === 'rings') {
        newData.totalStock = Object.values(newData.sizes).reduce((total, item) => total + item.stock, 0);
      } else {
        newData.totalStock = newData.general.stock;
      }
      
      return newData;
    });
  };

  // Handle add product
  const handleAddProduct = () => {
    console.log('Adding product:', {
      ...newProduct,
      id: Date.now(), // Simple ID generation
      price: newProduct.originalPrice,
      soldPrice: newProduct.currentPrice,
      stock: parseInt(newProduct.stock) || 0,
      status: "New Product",
      image: null
    });
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      collection: '',
      category: '',
      originalPrice: '',
      currentPrice: '',
      stock: '',
      sizes: [],
      images: [null, null, null, null, null],
      description: ''
    });
  };

  // Handle edit product button click
  const handleEditClick = (product) => {
    const collectionValue = product.collection === 'LOVE LANGUAGE COLLECTION' ? 'love-language' :
                           product.collection === 'CLASH COLLECTION' ? 'clash' :
                           product.collection === 'THE REBELLION COLLECTION' ? 'rebellion' :
                           product.collection === 'CLASSIC COLLECTION' ? 'classic' : '';
    
    const categoryValue = product.category.toLowerCase();

    setEditProduct({
      id: product.id,
      name: product.name,
      collection: collectionValue,
      category: categoryValue,
      originalPrice: product.price,
      currentPrice: product.soldPrice,
      sizes: [],
      images: [null, null, null, null, null],
      description: ''
    });
    setShowEditProductModal(true);
  };

  // Handle update product
  const handleUpdateProduct = () => {
    console.log('Updating product:', {
      ...editProduct,
      price: editProduct.originalPrice,
      soldPrice: editProduct.currentPrice
    });
    setShowEditProductModal(false);
    setEditProduct({
      id: null,
      name: '',
      collection: '',
      category: '',
      originalPrice: '',
      currentPrice: '',
      sizes: [],
      images: [null, null, null, null, null],
      description: ''
    });
  };

  // Handle save stock changes
  const handleSaveStockChanges = () => {
    console.log('Updating stock for product:', selectedProduct.id, stockData);
    // Update the product stock in your data structure here
    setShowStockModal(false);
  };

  // Sample products data - adding some rings for testing
  const allProducts = [
    {
      id: 1,
      name: "LYRIC - NECKLACES",
      collection: "LOVE LANGUAGE COLLECTION",
      category: "Necklaces",
      price: "₱ 790.00",
      soldPrice: "₱ 711.00",
      stock: 15,
      status: "Low Selling",
      image: LyricImage
    },
    {
      id: 2,
      name: "AGATHA - EARRINGS", 
      collection: "CLASH COLLECTION",
      category: "Earrings",
      price: "₱ 790.00",
      soldPrice: "₱ 711.00",
      stock: 25,
      status: "Normal Selling",
      image: AgathaImage
    },
    {
      id: 3,
      name: "RIOM - RINGS",
      collection: "THE REBELLION COLLECTION", 
      category: "Rings",
      price: "₱ 850.00",
      soldPrice: "₱ 765.00",
      stock: 45,
      status: "Best Selling",
      image: RiomImage
    },
    {
      id: 4,
      name: "CELINE - BRACELETS",
      collection: "THE REBELLION COLLECTION",
      category: "Bracelets", 
      price: "₱ 790.00",
      soldPrice: "₱ 711.00",
      stock: 8,
      status: "Best Selling",
      image: CelineImage
    },
    {
      id: 5,
      name: "LYRIC - NECKLACES",
      collection: "LOVE LANGUAGE COLLECTION",
      category: "Necklaces",
      price: "₱ 790.00",
      soldPrice: "₱ 711.00",
      stock: 15,
      status: "Low Selling",
      image: LyricImage
    },
    {
      id: 6,
      name: "AGATHA - RINGS", 
      collection: "CLASH COLLECTION",
      category: "Rings",
      price: "₱ 920.00",
      soldPrice: "₱ 828.00",
      stock: 32,
      status: "Normal Selling",
      image: AgathaImage
    },
    {
      id: 7,
      name: "RIOM - NECKLACES",
      collection: "THE REBELLION COLLECTION", 
      category: "Necklaces",
      price: "₱ 790.00",
      soldPrice: "₱ 711.00",
      stock: 0,
      status: "Best Selling",
      image: RiomImage
    },
    {
      id: 8,
      name: "CELINE - BRACELETS",
      collection: "THE REBELLION COLLECTION",
      category: "Bracelets", 
      price: "₱ 790.00",
      soldPrice: "₱ 711.00",
      stock: 8,
      status: "Best Selling",
      image: CelineImage
    },
    {
      id: 9,
      name: "CELINE - BRACELETS",
      collection: "THE REBELLION COLLECTION",
      category: "Bracelets", 
      price: "₱ 790.00",
      soldPrice: "₱ 711.00",
      stock: 8,
      status: "Normal Selling",
      image: CelineImage
    },
  ];

  // Category options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'rings', label: 'Rings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'earrings', label: 'Earrings' }
  ];

  // Collection options
  const collectionOptions = [
    { value: 'all', label: 'All Collections' },
    { value: 'love-language', label: 'Love Language Collection' },
    { value: 'classic', label: 'Classic Collection' },
    { value: 'clash', label: 'Clash Collection' },
    { value: 'rebellion', label: 'The Rebellion Collection' }
  ];

  // Stock level options
  const stockOptions = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  // Updated selling status options
  const sellingStatusOptions = [
    { value: 'all', label: 'All Selling Status' },
    { value: 'best-selling', label: 'Best Selling' },
    { value: 'normal-selling', label: 'Normal Selling' },
    { value: 'low-selling', label: 'Low Selling' }
  ];

  // Calculate stats
  const totalProducts = allProducts.length;
  const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = allProducts.filter(p => p.stock === 0).length;

  // Filter products with working filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedCollection !== 'all') {
      const collectionMap = {
        'love-language': 'LOVE LANGUAGE COLLECTION',
        'clash': 'CLASH COLLECTION',
        'rebellion': 'THE REBELLION COLLECTION',
        'classic': 'CLASSIC COLLECTION'
      };
      filtered = filtered.filter(product => 
        product.collection === collectionMap[selectedCollection]
      );
    }

    if (selectedStockLevel !== 'all') {
      if (selectedStockLevel === 'in-stock') {
        filtered = filtered.filter(product => product.stock > 10);
      } else if (selectedStockLevel === 'low-stock') {
        filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
      } else if (selectedStockLevel === 'out-of-stock') {
        filtered = filtered.filter(product => product.stock === 0);
      }
    }

    if (selectedSellingStatus !== 'all') {
      const statusMap = {
        'best-selling': 'Best Selling',
        'normal-selling': 'Normal Selling',
        'low-selling': 'Low Selling'
      };
      filtered = filtered.filter(product => 
        product.status === statusMap[selectedSellingStatus]
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.collection.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, selectedCollection, selectedStockLevel, selectedSellingStatus, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeAllDropdowns();
        setShowModalCollectionDropdown(false);
        setShowModalCategoryDropdown(false);
        setShowEditModalCollectionDropdown(false);
        setShowEditModalCategoryDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCollection, selectedStockLevel, selectedSellingStatus, searchQuery]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      'Best Selling': 'bg-green-500 text-white',
      'Normal Selling': 'bg-blue-500 text-white',
      'Low Selling': 'bg-red-500 text-white'
    };

    return (
      <span className={`px-3 py-1 rounded text-xs avantbold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header with Search */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">
              PRODUCTS MANAGEMENT
            </h1>
            
            {/* Search Bar aligned with header */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-black"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Category Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowCategoryDropdown(!showCategoryDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-40"
                >
                  <span className="text-black">{categoryOptions.find(cat => cat.value === selectedCategory)?.label}</span>
                  <img
                    src={showCategoryDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {categoryOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCategory(option.value);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedCategory === option.value ? "bg-gray-100 font-medium" : ""
                        } ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === categoryOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== option.value) {
                            e.target.style.backgroundColor = '#959595';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== option.value) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowCollectionDropdown(!showCollectionDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-48"
                >
                  <span className="text-black">{collectionOptions.find(col => col.value === selectedCollection)?.label}</span>
                  <img
                    src={showCollectionDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showCollectionDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {collectionOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCollection(option.value);
                          setShowCollectionDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedCollection === option.value ? "bg-gray-100 font-medium" : ""
                        } ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === collectionOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedCollection !== option.value) {
                            e.target.style.backgroundColor = '#959595';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCollection !== option.value) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Level Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowStockDropdown(!showStockDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-44"
                >
                  <span className="text-black">{stockOptions.find(stock => stock.value === selectedStockLevel)?.label}</span>
                  <img
                    src={showStockDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showStockDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {stockOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedStockLevel(option.value);
                          setShowStockDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedStockLevel === option.value ? "bg-gray-100 font-medium" : ""
                        } ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === stockOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedStockLevel !== option.value) {
                            e.target.style.backgroundColor = '#959595';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedStockLevel !== option.value) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selling Status Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowSellingDropdown(!showSellingDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-48"
                >
                  <span className="text-black">{sellingStatusOptions.find(status => status.value === selectedSellingStatus)?.label}</span>
                  <img
                    src={showSellingDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showSellingDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {sellingStatusOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSellingStatus(option.value);
                          setShowSellingDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedSellingStatus === option.value ? "bg-gray-100 font-medium" : ""
                        } ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === sellingStatusOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedSellingStatus !== option.value) {
                            e.target.style.backgroundColor = '#959595';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSellingStatus !== option.value) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add New Product Button */}
            <div>
              <button 
                onClick={() => setShowAddProductModal(true)}
                className="px-6 py-2 bg-black text-white uppercase rounded-lg hover:bg-gray-800 transition-colors avantbold text-sm font-medium"
              >
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-sm avantbold text-gray-600 mb-2">TOTAL PRODUCTS</div>
              <div className="text-4xl bebas text-black">{totalProducts}</div>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-sm avantbold text-gray-600 mb-2">LOW STOCKS</div>
              <div className="text-4xl bebas text-black">{lowStockProducts}</div>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-sm avantbold text-gray-600 mb-2">OUT OF STOCKS</div>
              <div className="text-4xl bebas text-black">{outOfStockProducts}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Products Grid with Pagination inside */}
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6 mb-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="relative bg-white rounded-lg overflow-hidden shadow-md">
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {getStatusBadge(product.status)}
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-48 bg-gray-900 relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="avantbold text-sm text-black mb-1">{product.name}</h3>
                      <p className="avant text-xs text-gray-600 mb-2">{product.collection}</p>
                      
                      {/* Updated Pricing Section with Labels */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="avant text-xs text-gray-500">Original Price:</span>
                          <span className="avant text-sm text-gray-500 line-through">{product.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="avant text-xs text-black font-medium">Current Price:</span>
                          <span className="avantbold text-sm text-black">{product.soldPrice}</span>
                        </div>
                      </div>
                      
                      <p className="avant text-xs text-gray-600 mb-3">{product.stock} STOCKS</p>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="flex-1 px-3 py-1 bg-transparent border border-black text-black rounded text-xs avant font-medium hover:bg-black hover:text-white transition-colors"
                          >
                            EDIT
                          </button>
                          <button 
                            onClick={() => handleStockClick(product)}
                            className="flex-1 px-3 py-1 bg-transparent border border-black text-black rounded text-xs avant font-medium hover:bg-black hover:text-white transition-colors"
                          >
                            STOCKS
                          </button>
                        </div>
                        <button 
                          onClick={() => handleReviewsClick(product)}
                          className="w-full px-3 py-1 bg-gray-600 text-white rounded text-xs avant font-medium hover:bg-gray-700 transition-colors"
                        >
                          MANAGE REVIEWS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination inside table - centered at bottom */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center">
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
      </div>

      {/* Reviews Management Modal */}
      {showReviewsModal && selectedProduct && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl avantbold text-black">Reviews Management</h2>
                <p className="text-sm avant text-gray-600 mt-1">{selectedProduct.name}</p>
              </div>
              <button 
                onClick={() => setShowReviewsModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Review Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-sm avant text-blue-600 mb-1">Total Reviews</div>
                  <div className="text-2xl bebas text-blue-800">{getReviewStats().total}</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-sm avant text-yellow-600 mb-1">Pending</div>
                  <div className="text-2xl bebas text-yellow-800">{getReviewStats().pending}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-sm avant text-green-600 mb-1">Approved</div>
                  <div className="text-2xl bebas text-green-800">{getReviewStats().approved}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-sm avant text-red-600 mb-1">Rejected</div>
                  <div className="text-2xl bebas text-red-800">{getReviewStats().rejected}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-sm avant text-purple-600 mb-1">Avg Rating</div>
                  <div className="text-2xl bebas text-purple-800">{getReviewStats().avgRating}★</div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                    reviewFilter === 'all' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  All Reviews
                </button>
                <button
                  onClick={() => setReviewFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                    reviewFilter === 'pending' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  Pending ({getReviewStats().pending})
                </button>
                <button
                  onClick={() => setReviewFilter('approved')}
                  className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                    reviewFilter === 'approved' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  Approved ({getReviewStats().approved})
                </button>
                <button
                  onClick={() => setReviewFilter('rejected')}
                  className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                    reviewFilter === 'rejected' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Rejected ({getReviewStats().rejected})
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {getFilteredReviews().length > 0 ? (
                  getFilteredReviews().map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="avantbold text-black">{review.customerName}</h4>
                            <div className="flex">{getStarDisplay(review.rating)}</div>
                            <span className="text-xs avant text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-xs avant text-gray-600 mb-2">{review.email}</p>
                          <p className="avant text-sm text-black">{review.comment}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded text-xs avantbold ${ 
                            review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            review.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleReviewStatusChange(review.id, 'approved')}
                          disabled={review.status === 'approved'}
                          className={`px-4 py-2 text-xs avant font-medium rounded transition-colors ${
                            review.status === 'approved'
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewStatusChange(review.id, 'rejected')}
                          disabled={review.status === 'rejected'}
                          className={`px-4 py-2 text-xs avant font-medium rounded transition-colors ${
                            review.status === 'rejected'
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          Reject
                        </button>
                        {review.status !== 'pending' && (
                          <button
                            onClick={() => handleReviewStatusChange(review.id, 'pending')}
                            className="px-4 py-2 text-xs avant font-medium bg-yellow-600 text-white hover:bg-yellow-700 rounded transition-colors"
                          >
                            Set Pending
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 avant">
                      {reviewFilter === 'all' 
                        ? 'No reviews found for this product.'
                        : `No ${reviewFilter} reviews found.`
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowReviewsModal(false)}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Management Modal */}
      {showStockModal && selectedProduct && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl avantbold text-black">Stock Management</h2>
                <p className="text-sm avant text-gray-600 mt-1">{selectedProduct.name}</p>
              </div>
              <button 
                onClick={() => setShowStockModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Stock Overview - simplified to just total stock */}
              <div className="mb-6">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-sm avantbold text-gray-600 mb-2">TOTAL STOCK</div>
                  <div className="text-3xl bebas text-black">{stockData.totalStock}</div>
                </div>
              </div>

              {/* Stock Details */}
              {selectedProduct.category.toLowerCase() === 'rings' ? (
                // Ring sizes inventory - simplified
                <div>
                  <h3 className="text-lg avantbold text-black mb-4">Size Inventory</h3>
                  <div className="space-y-3">
                    {sizeOptions.map((size) => (
                      <div key={size} className="grid grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                        <div className="avantbold text-black">{size}</div>
                        <div>
                          <label className="block text-xs avant text-gray-600 mb-1">Stock</label>
                          <input
                            type="number"
                            value={stockData.sizes[size]?.stock || 0}
                            onChange={(e) => handleStockUpdate('size', size, 'stock', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm avant focus:outline-none focus:border-black text-black"
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // General inventory - simplified
                <div>
                  <h3 className="text-lg avantbold text-black mb-4">Inventory Management</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="max-w-sm mx-auto">
                      <label className="block text-sm avantbold text-black mb-2">Stock Quantity</label>
                      <input
                        type="number"
                        value={stockData.general.stock}
                        onChange={(e) => handleStockUpdate('general', null, 'stock', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg avant focus:outline-none focus:border-black text-black text-center text-lg"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowStockModal(false)}
                  className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveStockChanges}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddProductModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Add New Product</h2>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Row 1: Product Name and Collection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">PRODUCT NAME</label>
                  <input
                    type="text"
                    placeholder="Enter Product Name"
                    value={newProduct.name}
                    onChange={(e) => handleProductChange('name', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <div className="relative dropdown-container">
                  <label className="block text-sm avantbold text-black mb-2">COLLECTION</label>
                  <button
                    type="button"
                    onClick={() => setShowModalCollectionDropdown(!showModalCollectionDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
                  >
                    <span className={newProduct.collection ? 'text-black' : 'text-gray-400'}>
                      {modalCollectionOptions.find(col => col.value === newProduct.collection)?.label || 'Select Collection'}
                    </span>
                    <img
                      src={showModalCollectionDropdown ? DropUpIconBlack : DropDownIconBlack}
                      alt="dropdown"
                      className="w-4 h-4 opacity-70"
                    />
                  </button>
                  {showModalCollectionDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                      {modalCollectionOptions.slice(1).map((option, index) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleProductChange('collection', option.value);
                            setShowModalCollectionDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm avant transition-colors hover:bg-gray-100 text-black ${
                            index === 0 ? "rounded-t-lg" : ""
                          } ${
                            index === modalCollectionOptions.length - 2 ? "rounded-b-lg" : ""
                          }`}
                          type="button"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Pricing, Category and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">ORIGINAL PRICE</label>
                  <input
                    type="text"
                    placeholder="₱0.00"
                    value={newProduct.originalPrice}
                    onChange={(e) => handleProductChange('originalPrice', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm avantbold text-black mb-2">CURRENT PRICE</label>
                  <input
                    type="text"
                    placeholder="₱0.00"
                    value={newProduct.currentPrice}
                    onChange={(e) => handleProductChange('currentPrice', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm avantbold text-black mb-2">STOCK</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProduct.stock}
                    onChange={(e) => handleProductChange('stock', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                    min="0"
                  />
                </div>
                <div className="relative dropdown-container">
                  <label className="block text-sm avantbold text-black mb-2">CATEGORY</label>
                  <button
                    type="button"
                    onClick={() => setShowModalCategoryDropdown(!showModalCategoryDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
                  >
                    <span className={newProduct.category ? 'text-black' : 'text-gray-400'}>
                      {modalCategoryOptions.find(cat => cat.value === newProduct.category)?.label || 'Select Category'}
                    </span>
                    <img
                      src={showModalCategoryDropdown ? DropUpIconBlack : DropDownIconBlack}
                      alt="dropdown"
                      className="w-4 h-4 opacity-70"
                    />
                  </button>
                  {showModalCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                      {modalCategoryOptions.slice(1).map((option, index) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleProductChange('category', option.value);
                            setShowModalCategoryDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm avant transition-colors hover:bg-gray-100 text-black ${
                            index === 0 ? "rounded-t-lg" : ""
                          } ${
                            index === modalCategoryOptions.length - 2 ? "rounded-b-lg" : ""
                          }`}
                          type="button"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Conditional Sizes and Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sizes - Only visible for rings */}
                {newProduct.category === 'rings' && (
                  <div>
                    <label className="block text-sm avantbold text-black mb-3">SIZES</label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {sizeOptions.map((size) => (
                        <label key={size} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newProduct.sizes.includes(size)}
                            onChange={() => handleSizeToggle(size)}
                            className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 checked:bg-black checked:border-black text-black"
                            style={{
                              accentColor: '#000000'
                            }}
                          />
                          <span className="text-sm avant text-black">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images - Takes full width if no sizes */}
                <div className={newProduct.category !== 'rings' ? 'lg:col-span-2' : ''}>
                  <label className="block text-sm avantbold text-black mb-3">IMAGES</label>
                  <div className="grid grid-cols-5 gap-2">
                    {newProduct.images.map((image, index) => (
                      <label key={index} className="cursor-pointer">
                        <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                          {image ? (
                            <img 
                              src={URL.createObjectURL(image)} 
                              alt={`Product ${index + 1}`} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <img 
                              src={AddImage} 
                              alt="Add image" 
                              className="w-6 h-6 opacity-60"
                            />
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e.target.files[0])}
                        />
                      </label>
                    ))}
                    {/* Additional single box */}
                    <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                      <img 
                        src={Add3D} 
                        alt="3D model" 
                        className="w-6 h-6 opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm avantbold text-black mb-2">DESCRIPTION</label>
                <textarea
                  placeholder="Enter Description"
                  value={newProduct.description}
                  onChange={(e) => handleProductChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black placeholder:text-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  ADD PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Edit Product</h2>
              <button 
                onClick={() => setShowEditProductModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Row 1: Product Name and Collection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">PRODUCT NAME</label>
                  <input
                    type="text"
                    placeholder="Enter Product Name"
                    value={editProduct.name}
                    onChange={(e) => handleEditProductChange('name', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <div className="relative dropdown-container">
                  <label className="block text-sm avantbold text-black mb-2">COLLECTION</label>
                  <button
                    type="button"
                    onClick={() => setShowEditModalCollectionDropdown(!showEditModalCollectionDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
                  >
                    <span className={editProduct.collection ? 'text-black' : 'text-gray-400'}>
                      {modalCollectionOptions.find(col => col.value === editProduct.collection)?.label || 'Select Collection'}
                    </span>
                    <img
                      src={showEditModalCollectionDropdown ? DropUpIconBlack : DropDownIconBlack}
                      alt="dropdown"
                      className="w-4 h-4 opacity-70"
                    />
                  </button>
                  {showEditModalCollectionDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                      {modalCollectionOptions.slice(1).map((option, index) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleEditProductChange('collection', option.value);
                            setShowEditModalCollectionDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm avant transition-colors hover:bg-gray-100 text-black ${
                            index === 0 ? "rounded-t-lg" : ""
                          } ${
                            index === modalCollectionOptions.length - 2 ? "rounded-b-lg" : ""
                          }`}
                          type="button"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Pricing and Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">ORIGINAL PRICE</label>
                  <input
                    type="text"
                    value={editProduct.originalPrice}
                    readOnly
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 avant text-sm text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1 avant">Original price cannot be edited</p>
                </div>
                <div>
                  <label className="block text-sm avantbold text-black mb-2">CURRENT PRICE</label>
                  <input
                    type="text"
                    placeholder="₱0.00"
                    value={editProduct.currentPrice}
                    onChange={(e) => handleEditProductChange('currentPrice', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <div className="relative dropdown-container">
                  <label className="block text-sm avantbold text-black mb-2">CATEGORY</label>
                  <button
                    type="button"
                    onClick={() => setShowEditModalCategoryDropdown(!showEditModalCategoryDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
                  >
                    <span className={editProduct.category ? 'text-black' : 'text-gray-400'}>
                      {modalCategoryOptions.find(cat => cat.value === editProduct.category)?.label || 'Select Category'}
                    </span>
                    <img
                      src={showEditModalCategoryDropdown ? DropUpIconBlack : DropDownIconBlack}
                      alt="dropdown"
                      className="w-4 h-4 opacity-70"
                    />
                  </button>
                  {showEditModalCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                      {modalCategoryOptions.slice(1).map((option, index) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleEditProductChange('category', option.value);
                            setShowEditModalCategoryDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm avant transition-colors hover:bg-gray-100 text-black ${
                            index === 0 ? "rounded-t-lg" : ""
                          } ${
                            index === modalCategoryOptions.length - 2 ? "rounded-b-lg" : ""
                          }`}
                          type="button"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Conditional Sizes and Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sizes - Only visible for rings */}
                {editProduct.category === 'rings' && (
                  <div>
                    <label className="block text-sm avantbold text-black mb-3">SIZES</label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {sizeOptions.map((size) => (
                        <label key={size} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editProduct.sizes.includes(size)}
                            onChange={() => handleEditSizeToggle(size)}
                            className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 checked:bg-black checked:border-black text-black"
                            style={{
                              accentColor: '#000000'
                            }}
                          />
                          <span className="text-sm avant text-black">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images - Takes full width if no sizes */}
                <div className={editProduct.category !== 'rings' ? 'lg:col-span-2' : ''}>
                  <label className="block text-sm avantbold text-black mb-3">IMAGES</label>
                  <div className="grid grid-cols-5 gap-2">
                    {editProduct.images.map((image, index) => (
                      <label key={index} className="cursor-pointer">
                        <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                          {image ? (
                            <img 
                              src={URL.createObjectURL(image)} 
                              alt={`Product ${index + 1}`} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <img 
                              src={AddImage} 
                              alt="Add image" 
                              className="w-6 h-6 opacity-60"
                            />
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleEditImageUpload(index, e.target.files[0])}
                        />
                      </label>
                    ))}
                    {/* Additional single box */}
                    <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                      <img 
                        src={Add3D} 
                        alt="3D model" 
                        className="w-6 h-6 opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm avantbold text-black mb-2">DESCRIPTION</label>
                <textarea
                  placeholder="Enter Description"
                  value={editProduct.description}
                  onChange={(e) => handleEditProductChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black placeholder:text-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={() => setShowEditProductModal(false)}
                  className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  UPDATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
