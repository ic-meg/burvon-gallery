import React, { useState, useMemo } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';

import {
  NextIConBlack,
  PrevIConBlack,  
  DropDownIconBlack,
  DropUpIconBlack,
  AddImage
} from '../../assets/index.js';

const CollectionManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [showEditCollectionModal, setShowEditCollectionModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    image: null
  });
  const [editCollection, setEditCollection] = useState({
    id: null,
    name: '',
    description: '',
    image: null
  });

  const itemsPerPage = 3; // 3 collections per page to match the layout

  // Sample collections data with creation dates - JUST ONE COLLECTION
  const allCollections = [
    {
      id: 1,
      name: "CLASSIC COLLECTION",
      description: "Timeless elegance for every occasion.",
      image: "/api/placeholder/300/200", // Replace with actual image path
      createdAt: "2024-01-15",
      products: {
        necklaces: 8,
        earrings: 8,
        rings: 8,
        bracelets: 8
      }
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'latest', label: 'Latest Collection' },
    { value: 'oldest', label: 'Oldest Collection' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'most-products', label: 'Most Products' },
    { value: 'least-products', label: 'Least Products' }
  ];

  // Helper function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowSortDropdown(false);
  };

  // Handle collection form changes for add collection
  const handleCollectionChange = (field, value) => {
    setNewCollection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle collection form changes for edit collection
  const handleEditCollectionChange = (field, value) => {
    setEditCollection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload for add collection
  const handleImageUpload = (file) => {
    setNewCollection(prev => ({
      ...prev,
      image: file
    }));
  };

  // Handle image upload for edit collection
  const handleEditImageUpload = (file) => {
    setEditCollection(prev => ({
      ...prev,
      image: file
    }));
  };

  // Handle add collection
  const handleAddCollection = () => {
    console.log('Adding collection:', {
      ...newCollection,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      products: {
        necklaces: 0,
        earrings: 0,
        rings: 0,
        bracelets: 0
      }
    });
    setShowAddCollectionModal(false);
    setNewCollection({
      name: '',
      description: '',
      image: null
    });
  };

  // Handle edit collection button click
  const handleEditClick = (collection) => {
    setEditCollection({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      image: null // Reset image for new upload
    });
    setShowEditCollectionModal(true);
  };

  // Handle update collection
  const handleUpdateCollection = () => {
    console.log('Updating collection:', editCollection);
    setShowEditCollectionModal(false);
    setEditCollection({
      id: null,
      name: '',
      description: '',
      image: null
    });
  };

  // Handle manage products click
  const handleManageProductsClick = (collection) => {
    console.log('Managing products for collection:', collection.name);
    // You can navigate to products page with collection filter
    // or open a products management modal specific to this collection
  };

  // Calculate stats
  const totalCollections = allCollections.length;
  const totalProducts = allCollections.reduce((sum, collection) => 
    sum + Object.values(collection.products).reduce((a, b) => a + b, 0), 0
  );

  // Filter and sort collections
  const filteredAndSortedCollections = useMemo(() => {
    let filtered = allCollections;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'most-products':
          const totalA = Object.values(a.products).reduce((sum, count) => sum + count, 0);
          const totalB = Object.values(b.products).reduce((sum, count) => sum + count, 0);
          return totalB - totalA;
        case 'least-products':
          const totalC = Object.values(a.products).reduce((sum, count) => sum + count, 0);
          const totalD = Object.values(b.products).reduce((sum, count) => sum + count, 0);
          return totalC - totalD;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedSort]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCollections.length / itemsPerPage);
  const paginatedCollections = filteredAndSortedCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeAllDropdowns();
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
  }, [searchQuery, selectedSort]);

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header with Search */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">
              COLLECTION MANAGEMENT
            </h1>
            
            {/* Search Bar aligned with header */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Collection"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-black"
              />
            </div>
          </div>

          {/* Filter Controls and Stats */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-8">
              {/* Sort Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowSortDropdown(!showSortDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-48"
                >
                  <span className="text-black">{sortOptions.find(sort => sort.value === selectedSort)?.label}</span>
                  <img
                    src={showSortDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {sortOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSort(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedSort === option.value ? "bg-gray-100 font-medium" : ""
                        } ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === sortOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedSort !== option.value) {
                            e.target.style.backgroundColor = '#959595';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSort !== option.value) {
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

              {/* Stats */}
              <div className="text-black">
                <span className="text-lg avantbold">TOTAL COLLECTIONS: </span>
                <span className="text-lg bebas">{totalCollections}</span>
              </div>
              <div className="text-black">
                <span className="text-lg avantbold">TOTAL PRODUCTS: </span>
                <span className="text-lg bebas">{totalProducts}</span>
              </div>
            </div>

            {/* Add Collection Button */}
            <button 
              onClick={() => setShowAddCollectionModal(true)}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avantbold uppercase text-sm font-medium"
            >
              Add Collection
            </button>
          </div>
        </div>
      </div>

      {/* Collections Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Collections Grid */}
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="space-y-6 mb-6">
                {paginatedCollections.map((collection) => (
                  <div key={collection.id} className="flex items-center space-x-6 p-4 border border-gray-300 rounded-lg">
                    {/* Collection Image */}
                    <div className="w-72 h-48 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white bebas text-2xl">
                        {collection.name}
                      </div>
                    </div>

                    {/* Collection Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl bebas text-black">{collection.name}</h3>
                        <span className="text-xs avant text-gray-500">Created: {collection.createdAt}</span>
                      </div>
                      <p className="text-gray-600 avant text-sm mb-4">{collection.description}</p>

                      {/* Product Count Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-3 border border-gray-200 rounded">
                          <div className="text-xs avant text-gray-600 mb-1">Necklaces</div>
                          <div className="text-xl bebas text-black">{collection.products.necklaces}</div>
                        </div>
                        <div className="text-center p-3 border border-gray-200 rounded">
                          <div className="text-xs avant text-gray-600 mb-1">Earrings</div>
                          <div className="text-xl bebas text-black">{collection.products.earrings}</div>
                        </div>
                        <div className="text-center p-3 border border-gray-200 rounded">
                          <div className="text-xs avant text-gray-600 mb-1">Rings</div>
                          <div className="text-xl bebas text-black">{collection.products.rings}</div>
                        </div>
                        <div className="text-center p-3 border border-gray-200 rounded">
                          <div className="text-xs avant text-gray-600 mb-1">Bracelets</div>
                          <div className="text-xl bebas text-black">{collection.products.bracelets}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3">
                      <button 
                        onClick={() => handleEditClick(collection)}
                        className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium whitespace-nowrap"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleManageProductsClick(collection)}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium whitespace-nowrap"
                      >
                        Manage Products
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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

      {/* Add New Collection Modal */}
      {showAddCollectionModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-md mx-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Add New Collection</h2>
              <button 
                onClick={() => setShowAddCollectionModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm avantbold text-black mb-2">COLLECTION NAME</label>
                <input
                  type="text"
                  placeholder="Enter Collection Name"
                  value={newCollection.name}
                  onChange={(e) => handleCollectionChange('name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm avantbold text-black mb-2">DESCRIPTION</label>
                <textarea
                  placeholder="Enter Collection Description"
                  value={newCollection.description}
                  onChange={(e) => handleCollectionChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm avantbold text-black mb-2">COLLECTION IMAGE</label>
                <label className="cursor-pointer">
                  <div className="w-full h-32 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                    {newCollection.image ? (
                      <img 
                        src={URL.createObjectURL(newCollection.image)} 
                        alt="Collection" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <img 
                          src={AddImage} 
                          alt="Add image" 
                          className="w-8 h-8 mx-auto mb-2 opacity-60"
                        />
                        <span className="text-sm avant text-gray-500">Click to upload image</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowAddCollectionModal(false)}
                  className="flex-1 px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddCollection}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  ADD COLLECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Collection Modal */}
      {showEditCollectionModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-md mx-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Edit Collection</h2>
              <button 
                onClick={() => setShowEditCollectionModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm avantbold text-black mb-2">COLLECTION NAME</label>
                <input
                  type="text"
                  placeholder="Enter Collection Name"
                  value={editCollection.name}
                  onChange={(e) => handleEditCollectionChange('name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm avantbold text-black mb-2">DESCRIPTION</label>
                <textarea
                  placeholder="Enter Collection Description"
                  value={editCollection.description}
                  onChange={(e) => handleEditCollectionChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm avantbold text-black mb-2">COLLECTION IMAGE</label>
                <label className="cursor-pointer">
                  <div className="w-full h-32 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                    {editCollection.image ? (
                      <img 
                        src={URL.createObjectURL(editCollection.image)} 
                        alt="Collection" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <img 
                          src={AddImage} 
                          alt="Add image" 
                          className="w-8 h-8 mx-auto mb-2 opacity-60"
                        />
                        <span className="text-sm avant text-gray-500">Click to upload new image</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleEditImageUpload(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowEditCollectionModal(false)}
                  className="flex-1 px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleUpdateCollection}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  UPDATE COLLECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionManagement;
