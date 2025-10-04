import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';

import {
  DropDownIconBlack,
  DropUpIconBlack 
} from '../../assets/index.js';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [selectedCategory, setSelectedCategory] = useState('necklaces');
  const [selectedCollection, setSelectedCollection] = useState('kids');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  // Tab configuration
  const tabs = [
    { id: 'homepage', label: 'HOMEPAGE' },
    { id: 'categories', label: 'CATEGORIES' },
    { id: 'collections', label: 'COLLECTIONS' }
  ];

  // Category options
  const categoryOptions = [
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'rings', label: 'Rings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'earrings', label: 'Earrings' }
  ];

  // Collection options
  const collectionOptions = [
    { value: 'kids', label: 'Kids Collection' },
    { value: 'classic', label: 'Classic Collection' },
    { value: 'clash', label: 'Clash Collection' },
    { value: 'love', label: 'Love Language Collection' }
  ];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setShowCategoryDropdown(false);
        setShowCollectionDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">
              CONTENT MANAGEMENT
            </h1>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Status Tabs with horizontal line */}
          <div className="relative mb-6">
            {/* Long horizontal line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
            
            {/* Tabs Container */}
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
                    
                    {/* Active tab indicator line */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Conditional Dropdown - Only show for Categories tab */}
              {activeTab === 'categories' && (
                <div className="pb-3 relative custom-dropdown">
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-40"
                  >
                    <span>{categoryOptions.find(cat => cat.value === selectedCategory)?.label}</span>
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
                          className={`w-full px-4 py-2 text-left text-sm avant transition-colors ${
                            selectedCategory === option.value ? "bg-gray-100 font-medium" : ""
                          } ${
                            index === 0 ? "rounded-t-lg" : ""
                          } ${
                            index === categoryOptions.length - 1 ? "rounded-b-lg" : ""
                          }`}
                          style={{
                            backgroundColor: selectedCategory === option.value ? '#f3f4f6' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedCategory !== option.value) {
                              e.target.style.backgroundColor = '#959595';
                              e.target.style.color = 'white';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedCategory !== option.value) {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '';
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
              )}

              {/* Conditional Dropdown - Only show for Collections tab */}
              {activeTab === 'collections' && (
                <div className="pb-3 relative custom-dropdown">
                  <button
                    type="button"
                    onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                    className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-60"
                  >
                    <span>{collectionOptions.find(col => col.value === selectedCollection)?.label}</span>
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
                          className={`w-full px-4 py-2 text-left text-sm avant transition-colors ${
                            selectedCollection === option.value ? "bg-gray-100 font-medium" : ""
                          } ${
                            index === 0 ? "rounded-t-lg" : ""
                          } ${
                            index === collectionOptions.length - 1 ? "rounded-b-lg" : ""
                          }`}
                          style={{
                            backgroundColor: selectedCollection === option.value ? '#f3f4f6' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedCollection !== option.value) {
                              e.target.style.backgroundColor = '#959595';
                              e.target.style.color = 'white';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedCollection !== option.value) {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '';
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
              )}
            </div>
          </div>

          {/* Empty Content Container */}
          <div className="bg-white border-2 border-[#000000] rounded-lg overflow-hidden">
            {/* Empty Body */}
            <div className="px-6 py-16 text-center text-gray-500 avant">
              {activeTab === 'homepage' && 'Homepage content will be displayed here'}
              {activeTab === 'categories' && `${categoryOptions.find(cat => cat.value === selectedCategory)?.label} content will be displayed here`}
              {activeTab === 'collections' && `${collectionOptions.find(col => col.value === selectedCollection)?.label} content will be displayed here`}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
