import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import ShoppingBagEmpty from './ShoppingBag-Empty'
import productApi from '../../../api/productApi'
import categoryApi from '../../../api/categoryApi'

import { 
  XWhite
} from '../../../assets/index.js'

{/* Mobile Layout */}
const ShoppingBagMobile = ({
  cart,
  subtotal,
  itemCount,
  modalOpen,
  modalImg,
  openModal,
  closeModal,
  removeFromCart,
  updateQuantity,
  updateSize,
  getAvailableSizes,
  getSizeStock,
  ringCategoryId,
  isAtMaxStock,
  hoveredCheckout,
  setHoveredCheckout,
  navigate,
  toggleItemSelection,
  isItemSelected,
  getSelectedItemsTotal,
  getSelectedItemsCount,
  isRingWithoutSize,
  isSizeOutOfStock,
  hasItemIssue,
}) => (
  <div className="lg:hidden w-full min-h-screen bg-[#181818] px-5 pt-2 text-[#fff7dc] relative">
 
    
      <h1 className="text-center bebas tracking-wide mt-26 mb-2" style={{ fontSize: '55px' }}>
        SHOPPING BAG
      </h1>

    <p className="text-center avant text-xs mb-10 mt-[-8px]">
      ALMOST YOURS, READY TO MAKE THEIR WAY TO YOU.
    </p>
    {/* Products scrollable */}
    <div className="w-full max-w-md mx-auto relative">
      <div
        className="flex flex-col overflow-y-auto"
        style={{ maxHeight: '60vh' }} 
      >
        {cart && cart.map((item, i) => {
          const itemHasIssue = hasItemIssue(item);
          const needsSize = isRingWithoutSize(item);
          const sizeUnavailable = isSizeOutOfStock(item);
          
          return (
          <div key={item.id}>
            <div className={`flex gap-3 items-start py-4 px-4 text-nowrap relative ${itemHasIssue ? 'opacity-60' : ''}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover shadow-lg cursor-pointer border border-[#fff7dc]/20"
                onClick={() => openModal(item.image)}
              />
              <div className="flex-1 pl-2">
                <div className="avantbold text-xs whitespace-normal leading-tight">
                  {item.name}
                </div>
                {item.collection && (
                  <div className="bebas text-xs mt-1 tracking-wide text-[#fff7dc]/80">
                    {item.collection}
                  </div>
                )}
                {item.category && (
                  <div className="avant text-xs mt-1 opacity-60">
                    {item.category.replace(/\s+Collection$/i, '')}
                  </div>
                )}
                <div className="flex items-center justify-between mt-1">
                  {item.variant && (
                    <span className="avant text-xs opacity-70">{item.variant}</span>
                  )}
                  <span className="avant text-xs mr-12 opacity-60">
                    Size: {(item.category_id === ringCategoryId || (item.category && (
                      item.category.toLowerCase() === 'ring' || 
                      item.category.toLowerCase() === 'rings' ||
                      item.category.toLowerCase().includes('ring collection')
                    ))) ? (
                      <select
                        value={item.size || ''}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value);
                          const sizeStock = getSizeStock(item.product_id, newSize);
                          updateSize(item.id, newSize, sizeStock);
                        }}
                        className="bg-[#181818] text-[#fff7dc] border border-[#fff7dc]/30 rounded px-1 py-0.5 text-xs avant focus:outline-none focus:border-[#fff7dc] ml-1 cursor-pointer min-w-[60px]"
                        style={{ 
                          appearance: 'none', 
                          WebkitAppearance: 'none', 
                          MozAppearance: 'none',
                          backgroundImage: 'none'
                        }}
                      >
                        <option value="">Select</option>
                        {getAvailableSizes(item.product_id, item.id).map(size => (
                          <option key={size} value={size} className="bg-[#181818] text-[#fff7dc]">{size}</option>
                        ))}
                      </select>
                    ) : (
                      item.size || '-'
                    )}
                  </span>
                </div>
                <div className="avantbold text-xs mt-2">
                  {item.price}
                </div>
                {/* quantity content */}
                <div className="flex items-center mt-2">
                  <span 
                    onClick={() => {
                      const isRing = item.category_id === ringCategoryId || (item.category && (
                        item.category.toLowerCase() === 'ring' || 
                        item.category.toLowerCase() === 'rings' ||
                        item.category.toLowerCase().includes('ring collection')
                      ));
                      if (isRing && !item.size) return;
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                    className={`text-lg select-none px-2 py-1 rounded transition ${
                      (() => {
                        const isRing = item.category_id === ringCategoryId || (item.category && (
                          item.category.toLowerCase() === 'ring' || 
                          item.category.toLowerCase() === 'rings' ||
                          item.category.toLowerCase().includes('ring collection')
                        ));
                        return isRing && !item.size ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#fff7dc]/10';
                      })()
                    }`}>−</span>
                  <span className="text-xs">{(() => {
                    const isRing = item.category_id === ringCategoryId || (item.category && (
                      item.category.toLowerCase() === 'ring' || 
                      item.category.toLowerCase() === 'rings' ||
                      item.category.toLowerCase().includes('ring collection')
                    ));
                    return isRing && !item.size ? 1 : item.quantity;
                  })()}</span>
                  <span 
                    onClick={() => {
                      const isRing = item.category_id === ringCategoryId || (item.category && (
                        item.category.toLowerCase() === 'ring' || 
                        item.category.toLowerCase() === 'rings' ||
                        item.category.toLowerCase().includes('ring collection')
                      ));
                      if (isRing && !item.size) return;
                      const sizeStock = item.size ? getSizeStock(item.product_id, item.size) : null;
                      updateQuantity(item.id, item.quantity + 1, sizeStock);
                    }}
                    className={`text-lg select-none px-2 py-1 rounded transition ${
                      (() => {
                        const isRing = item.category_id === ringCategoryId || (item.category && (
                          item.category.toLowerCase() === 'ring' || 
                          item.category.toLowerCase() === 'rings' ||
                          item.category.toLowerCase().includes('ring collection')
                        ));
                        if (isRing && !item.size) return 'opacity-50 cursor-not-allowed';
                        return isAtMaxStock(item.id, item.size ? getSizeStock(item.product_id, item.size) : null) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#fff7dc]/10';
                      })()
                    }`}
                    title={(() => {
                      const isRing = item.category_id === ringCategoryId || (item.category && (
                        item.category.toLowerCase() === 'ring' || 
                        item.category.toLowerCase() === 'rings' ||
                        item.category.toLowerCase().includes('ring collection')
                      ));
                      if (isRing && !item.size) return 'Please select a size first';
                      return isAtMaxStock(item.id, item.size ? getSizeStock(item.product_id, item.size) : null) ? 'Maximum stock reached' : '';
                    })()}
                  >+</span>
                </div>
                <div className="avant text-xs mt-2">
                  Subtotal: <span className="avantbold text-xs">
                    PHP {(parseFloat(item.price.replace(/[^\d.]/g, '')) * (() => {
                      const isRing = item.category_id === ringCategoryId || (item.category && (
                        item.category.toLowerCase() === 'ring' || 
                        item.category.toLowerCase() === 'rings' ||
                        item.category.toLowerCase().includes('ring collection')
                      ));
                      return isRing && !item.size ? 1 : item.quantity;
                    })()).toFixed(2)}
                  </span>
                </div>
                {needsSize && (
                  <div className="text-red-400 text-xs avant mt-1">⚠ Select a size</div>
                )}
                {sizeUnavailable && (
                  <div className="text-red-400 text-xs avant mt-1">⚠ Size out of stock</div>
                )}
              </div>
              <div className="absolute top-4 right-2 z-10">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isItemSelected(item.id) && !itemHasIssue}
                    onChange={() => {
                      if (!itemHasIssue) toggleItemSelection(item.id);
                    }}
                    disabled={itemHasIssue}
                    className={`w-4 h-4 accent-[#FFF7DC] ${itemHasIssue ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      border: `2px solid ${itemHasIssue ? '#666' : '#FFF7DC'}`,
                      borderRadius: '4px',
                      backgroundColor: (isItemSelected(item.id) && !itemHasIssue) ? '#FFF7DC' : 'transparent',
                      position: 'relative'
                    }}
                  />
                  {isItemSelected(item.id) && !itemHasIssue && (
                    <div
                      className="absolute inset-0 flex items-center justify-center z-10"
                      style={{ pointerEvents: 'none' }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 1.5 12 12"
                        fill="none"
                        className="text-[#181818]"
                      >
                        <path
                          d="M3 6L5 8L9 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {i < cart.length - 1 && (
              <hr className="my-2 border-[#fff7dc]/30" />
            )}
          </div>
        )})}
      </div>
      {/* sticky checkout content */}
      <div className="sticky w-full bg-[#181818] p-6 z-30 mt-4 mx-auto">
        <div className="flex justify-between mb-2 avantbold text-sm">
          <span>Subtotal ( {getSelectedItemsCount()} items )</span>
          <span>PHP {getSelectedItemsTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 avantbold text-sm">
          <span>Discount</span>
          <span>-</span>
        </div>
        <div className="flex justify-between mb-2 avantbold text-sm">
          <span>Shipping Fee</span>
          <span>-</span>
        </div>
        <hr className="my-4 border-[#fff7dc]/30" />
        <button 
          onMouseEnter={() => setHoveredCheckout(true)}
          onMouseLeave={() => setHoveredCheckout(false)}
          disabled={getSelectedItemsCount() === 0}
          style={{
            backgroundColor: getSelectedItemsCount() === 0 ? "#666" : (hoveredCheckout ? "transparent" : "#FFF7DC"),
            color: getSelectedItemsCount() === 0 ? "#999" : (hoveredCheckout ? "#FFF7DC" : "#181818"),
            outline: "1px solid #FFF7DC",
            borderRadius: 5,
          }}
          className="w-full py-3 rounded avantbold text-sm tracking-wide shadow transition-all duration-300 disabled:cursor-not-allowed"
          onClick={() => navigate('/user/cart/checkout')}
        >
          PROCEED TO CHECKOUT
        </button>
        <Link to="/" className="text-center mt-4 avantbold text-sm text-[#fff7dc] hover:underline block">
          CONTINUE SHOPPING...
        </Link>
        <div className="text-center text-[#fff7dc] mt-8 avant text-xs">
          Shipping and discounts are calculated at checkout.
        </div>
      </div>
    </div>
    {/* fullscreen modal when image clicked */}
    {modalOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <img
          src={modalImg}
          alt="Product Full"
          className="max-w-full max-h-full shadow-lg"
          onClick={closeModal}
        />
      </div>
    )}
  </div>
)

const ShoppingBag = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    updateSize, 
    getCartTotal, 
    getCartItemCount, 
    isAtMaxStock,
    toggleItemSelection,
    isItemSelected,
    getSelectedItemsTotal,
    getSelectedItemsCount,
    selectAllItems,
    deselectAllItems
  } = useCart();

  const [modalOpen, setModalOpen] = useState(false)
  const [modalImg, setModalImg] = useState(null)
  const [hoveredCheckout, setHoveredCheckout] = useState(false)
  const [productData, setProductData] = useState({})
  const [categories, setCategories] = useState([])
  const [ringCategoryId, setRingCategoryId] = useState(null)
  const navigate = useNavigate()

  const openModal = (img) => {
    setModalImg(img)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalImg(null)
  }

  const isRingItem = (item) => {
    return item.category_id === ringCategoryId || (item.category && (
      item.category.toLowerCase() === 'ring' || 
      item.category.toLowerCase() === 'rings' ||
      item.category.toLowerCase().includes('ring')
    ));
  };

  const isRingWithoutSize = (item) => {
    return isRingItem(item) && !item.size;
  };

  const isSizeOutOfStock = (item) => {
    if (!isRingItem(item) || !item.size) return false;
    const product = productData[item.product_id];
    if (!product || !product.sizeStocks) return false;
    const sizeStock = product.sizeStocks.find(ss => {
      const sizeMatch = ss.size?.match(/\d+/);
      return sizeMatch && parseInt(sizeMatch[0]) === item.size;
    });
    return !sizeStock || sizeStock.stock <= 0;
  };

  const hasItemIssue = (item) => {
    return isRingWithoutSize(item) || isSizeOutOfStock(item);
  };

  // Fetch categories to get ring category ID
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryApi.fetchAllCategories();
        if (result && !result.error) {
          const categoriesData = result.data || result;
          setCategories(categoriesData);
          
      
          const ringCategory = categoriesData.find(cat => 
            cat.name && (
              cat.name.toLowerCase() === 'rings' ||
              cat.name.toLowerCase() === 'ring'
            )
          );
          if (ringCategory) {
            setRingCategoryId(ringCategory.category_id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch product data for cart items and remove out-of-stock items
  useEffect(() => {
    const fetchProductData = async () => {
      const productIds = [...new Set(cart.map(item => item.product_id))];
      const data = {};
      const itemsToRemove = [];
      
      for (const productId of productIds) {
        try {
          const result = await productApi.fetchProductById(productId);
          
          if (result && !result.error) {
           
            const responseData = result.data;
            
          
            const product = responseData.product || responseData;
            
            data[productId] = {
              sizes: product.sizes || [],
              sizeStocks: product.sizeStocks || [],
              stock: product.stock || 0
            };

            const cartItemsForProduct = cart.filter(item => item.product_id === productId);
            
            for (const cartItem of cartItemsForProduct) {
              const isRing = cartItem.category && (
                cartItem.category.toLowerCase() === 'ring' || 
                cartItem.category.toLowerCase() === 'rings' ||
                cartItem.category.toLowerCase().includes('ring')
              );
              
              if (isRing) {
                // For rings: DON'T remove, just let them pick a new size
                // The hasItemIssue check will disable the checkbox
                continue;
              } else {
                // For non-rings: remove if completely out of stock
                const isOutOfStock = (product.stock || 0) <= 0;
                if (isOutOfStock) {
                  itemsToRemove.push(cartItem.id);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
        }
      }
      
      setProductData(data);
      
      // Remove out-of-stock items from cart
      if (itemsToRemove.length > 0) {
        itemsToRemove.forEach(itemId => {
          removeFromCart(itemId);
        });
      }
    };

    if (cart.length > 0) {
      fetchProductData();
    }
  }, [cart.length]); // Only re-run when cart length changes to avoid infinite loop

  // Get available sizes for a product
  const getAvailableSizes = (productId, currentItemId = null) => {
    const product = productData[productId];
    
    if (!product) {
      return [3, 4, 5, 6, 7, 8, 9];
    }
    
    let availableSizes = [];
    
    if (product.sizeStocks && product.sizeStocks.length > 0) {
      availableSizes = product.sizeStocks
        .filter(ss => ss.stock > 0)
        .map(ss => {
          const sizeMatch = ss.size?.match(/\d+/);
          return sizeMatch ? parseInt(sizeMatch[0]) : null;
        })
        .filter(size => size !== null)
        .sort((a, b) => a - b);
    } else {
    
      availableSizes = (product.sizes && product.sizes.length > 0) ? product.sizes : [3, 4, 5, 6, 7, 8, 9];
    }
    
    
    return availableSizes.filter(size => {
   
      const existingItemAtMax = cart.find(item => 
        item.product_id === productId && 
        item.size === size && 
        item.id !== currentItemId && 
        item.quantity >= getSizeStock(productId, size)
      );
      
      return !existingItemAtMax; // Only include sizes that are not at max stock
    });
  };

  
  const getSizeStock = (productId, size) => {
    const product = productData[productId];
    
    if (!product || !product.sizeStocks) {

      return 0;
    }
    
    const sizeStock = product.sizeStocks.find(ss => {
      const sizeMatch = ss.size?.match(/\d+/);
      return sizeMatch && parseInt(sizeMatch[0]) === size;
    });
    
    
    return sizeStock ? sizeStock.stock : 0;
  };

  const subtotal = getCartTotal();
  const shipping = 80
  const total = subtotal + shipping
  const itemCount = getCartItemCount();


 
  if (!cart || cart.length === 0) {
    return <ShoppingBagEmpty />;
  }

  return (
    <Layout full>
      {/* Desktop layout */}
      <div className="hidden lg:block min-h-screen bg-[#181818] py-10 px-0 bebas text-[#fff7dc]">
        {/* shopping bag title */}

          <h1 
            className="text-center bebas mb-2 tracking-wide mt-36" 
            style={{ fontSize: '80px' }}
          >
            SHOPPING BAG
          </h1>
     
        
        {/* subtitle */}
        <p className="text-center avant text-md mb-30 mt-[-18px] ml-[-18px]">ALMOST YOURS, READY TO MAKE THEIR WAY TO YOU.</p>

        <div className="w-full max-w-[1600px] mx-auto flex gap-8 px-12"> {/* kung gusto iwiden yung buong content jan sa left side, adjust mo lang yung max-w, gap, px depende kung gano kasakto sa laptop */}
          {/* left: scrollable products */}
          <div className="flex-[2.2] overflow-y-auto custom-scrollbar ml-2" style={{ maxHeight: '70vh', background: 'rgba(24,24,24,0.98)', overflowX: 'visible' }}>
            {/* product title */}
            <div className="grid grid-cols-5 avant text-xl border-b border-[#fff7dc]/30 pb-2 mb-2 sticky top-0 bg-[#181818] z-10">
              <div className="pl-2 flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={cart.length > 0 && cart.every(item => isItemSelected(item.id))}
                    onChange={() => {
                      if (cart.every(item => isItemSelected(item.id))) {
                        deselectAllItems();
                      } else {
                        selectAllItems();
                      }
                    }}
                    className="w-4 h-4 accent-[#FFF7DC] cursor-pointer"
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      border: '2px solid #FFF7DC',
                      borderRadius: '4px',
                      backgroundColor: (cart.length > 0 && cart.every(item => isItemSelected(item.id))) ? '#FFF7DC' : 'transparent',
                      position: 'relative'
                    }}
                  />
                  {(cart.length > 0 && cart.every(item => isItemSelected(item.id))) && (
                    <div
                      className="absolute inset-0 flex items-center justify-center z-10"
                      style={{ pointerEvents: 'none' }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 1.5 12 12"
                        fill="none"
                        className="text-[#181818]"
                      >
                        <path
                          d="M3 6L5 8L9 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <span>Item/s</span>
              </div>
              <div className="pl-53">Size</div> {/* Size column */}
              <div className="pl-53">Price</div> {/* dito meg start ka dito pero title lang mauusog hindi buong column */}
              <div className="pl-36">Quantity</div> {/* adjust mo na lang mga pl */}
              <div className="text-center">Subtotal</div> {/* dito kung gusto mo rin gawing pl, pl mo na rin */}
            </div>
            {cart && cart.map((item, i) => {
              const itemHasIssue = hasItemIssue(item);
              const needsSize = isRingWithoutSize(item);
              const sizeUnavailable = isSizeOutOfStock(item);
              
              return (
              <div key={item.id} className={`grid grid-cols-5 items-center border-b border-[#fff7dc]/10 py-6 hover:bg-[#232323] transition-all duration-200 ${itemHasIssue ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-5 min-w-[340px]">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isItemSelected(item.id) && !itemHasIssue}
                      onChange={() => {
                        if (!itemHasIssue) toggleItemSelection(item.id);
                      }}
                      disabled={itemHasIssue}
                      className={`w-4 h-4 accent-[#FFF7DC] ${itemHasIssue ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        border: `2px solid ${itemHasIssue ? '#666' : '#FFF7DC'}`,
                        borderRadius: '4px',
                        backgroundColor: (isItemSelected(item.id) && !itemHasIssue) ? '#FFF7DC' : 'transparent',
                        position: 'relative'
                      }}
                    />
                    {isItemSelected(item.id) && !itemHasIssue && (
                      <div
                        className="absolute inset-0 flex items-center justify-center z-10"
                        style={{ pointerEvents: 'none' }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 3 12 12"
                          fill="none"
                          className="text-[#181818]"
                        >
                          <path
                            d="M3 6L5 8L9 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* product image and details */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-lg flex-shrink-0 cursor-pointer border border-[#fff7dc]/20 hover:scale-105 transition"
                    onClick={() => openModal(item.image)}
                  />
                  <div>
                    <div className="avantbold text-md whitespace-nowrap leading-tight">
                      {item.name}
                    </div>
                    {item.collection && (
                      <div className="bebas text-sm mt-1 whitespace-nowrap tracking-wide text-[#fff7dc]/80">
                        {item.collection}
                      </div>
                    )}
                    {item.category && (
                      <div className="avant text-xs mt-1 whitespace-nowrap opacity-60">
                        {item.category.replace(/\s+Collection$/i, '')}
                      </div>
                    )}
                    {item.variant && (
                      <div className="avant text-sm mt-1 whitespace-nowrap opacity-70">
                        {item.variant} 
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center avant text-lg pl-54 relative">
                  {(item.category_id === ringCategoryId || (item.category && (
                    item.category.toLowerCase() === 'ring' || 
                    item.category.toLowerCase() === 'rings' ||
                    item.category.toLowerCase().includes('ring collection')
                  ))) ? (
                    <div className="relative inline-block">
                      <select
                        value={item.size || ''}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value);
                          const sizeStock = getSizeStock(item.product_id, newSize);
                          updateSize(item.id, newSize, sizeStock);
                        }}
                        className="metallic-bg cream-text border border-[#fff7dc]/30 rounded px-2 py-1 text-center avant text-sm focus:outline-none focus:border-[#fff7dc] cursor-pointer min-w-[80px] max-w-[120px]"
                        style={{ 
                          appearance: 'auto',
                          WebkitAppearance: 'menulist',
                          MozAppearance: 'menulist'
                        }}
                      >
                        <option value="">Select Size</option>
                        {getAvailableSizes(item.product_id, item.id).map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    item.size || '-'
                  )}
                </div>
                <div className="avantbold text-lg pl-50 text-nowrap">{item.price}</div>
                <div className="text-center avantbold flex items-center justify-center pl-35">
                  <span 
                    onClick={() => {
                      const isRing = item.category_id === ringCategoryId || (item.category && (
                        item.category.toLowerCase() === 'ring' || 
                        item.category.toLowerCase() === 'rings' ||
                        item.category.toLowerCase().includes('ring collection')
                      ));
                      if (isRing && !item.size) return;
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                    className={`text-2xl select-none px-2 py-1 rounded transition ${
                      (() => {
                        const isRing = item.category_id === ringCategoryId || (item.category && (
                          item.category.toLowerCase() === 'ring' || 
                          item.category.toLowerCase() === 'rings' ||
                          item.category.toLowerCase().includes('ring collection')
                        ));
                        return isRing && !item.size ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#fff7dc]/10';
                      })()
                    }`}>−</span>
                  <span className="text-lg">{(() => {
                    const isRing = item.category_id === ringCategoryId || (item.category && (
                      item.category.toLowerCase() === 'ring' || 
                      item.category.toLowerCase() === 'rings' ||
                      item.category.toLowerCase().includes('ring collection')
                    ));
                    return isRing && !item.size ? 1 : item.quantity;
                  })()}</span>
                  <span 
                    onClick={() => {
                      const isRing = item.category_id === ringCategoryId || (item.category && (
                        item.category.toLowerCase() === 'ring' || 
                        item.category.toLowerCase() === 'rings' ||
                        item.category.toLowerCase().includes('ring collection')
                      ));
                      if (isRing && !item.size) return;
                      const sizeStock = item.size ? getSizeStock(item.product_id, item.size) : null;
                      updateQuantity(item.id, item.quantity + 1, sizeStock);
                    }}
                    className={`text-2xl select-none px-2 py-1 rounded transition ${
                      (() => {
                        const isRing = item.category_id === ringCategoryId || (item.category && (
                          item.category.toLowerCase() === 'ring' || 
                          item.category.toLowerCase() === 'rings' ||
                          item.category.toLowerCase().includes('ring collection')
                        ));
                        if (isRing && !item.size) return 'opacity-50 cursor-not-allowed';
                        return isAtMaxStock(item.id, item.size ? getSizeStock(item.product_id, item.size) : null) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#fff7dc]/10';
                      })()
                    }`}
                    title={(() => {
                      const isRing = item.category_id === ringCategoryId || (item.category && (
                        item.category.toLowerCase() === 'ring' || 
                        item.category.toLowerCase() === 'rings' ||
                        item.category.toLowerCase().includes('ring collection')
                      ));
                      if (isRing && !item.size) return 'Please select a size first';
                      return isAtMaxStock(item.id, item.size ? getSizeStock(item.product_id, item.size) : null) ? 'Maximum stock reached' : '';
                    })()}
                  >+</span>
                </div>
                <div className="text-center avantbold text-lg">
                  PHP {(parseFloat(item.price.replace(/[^\d.]/g, '')) * (() => {
                    const isRing = item.category_id === ringCategoryId || (item.category && (
                      item.category.toLowerCase() === 'ring' || 
                      item.category.toLowerCase() === 'rings' ||
                      item.category.toLowerCase().includes('ring collection')
                    ));
                    return isRing && !item.size ? 1 : item.quantity;
                  })()).toFixed(2)}
                </div>
                {needsSize && (
                  <div className="col-span-5 text-red-400 text-sm avant mt-2 ml-10">
                    ⚠ Please select a size to checkout
                  </div>
                )}
                {sizeUnavailable && (
                  <div className="col-span-5 text-red-400 text-sm avant mt-2 ml-10">
                    ⚠ Selected size is out of stock
                  </div>
                )}
              </div>
            )})}
          </div>
          {/* right: sticky */}
          <div className="flex-[1] max-w-xl avant text-base sticky top-36 self-start">
            <div className="flex flex-col gap-2 bg-[#181818] p-8 rounded-lg">
              {/* subtotal */}
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Subtotal ( {getSelectedItemsCount()} items )</span>
                <span>PHP {getSelectedItemsTotal().toFixed(2)}</span>
              </div>
              {/* discount */}
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Discount</span>
                <span>-</span>
              </div>
              {/* shipping */}
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Shipping Fee</span>
                <span>-</span>
              </div>
              <div className="flex justify-between avantbold text-xl mt-4 border-t border-[#fff7dc]/30 pt-2">
               
              </div>
              <button 
                onMouseEnter={() => setHoveredCheckout(true)}
                onMouseLeave={() => setHoveredCheckout(false)}
                disabled={getSelectedItemsCount() === 0}
                style={{
                  backgroundColor: getSelectedItemsCount() === 0 ? "#666" : (hoveredCheckout ? "transparent" : "#FFF7DC"),
                  color: getSelectedItemsCount() === 0 ? "#999" : (hoveredCheckout ? "#FFF7DC" : "#181818"),
                  outline: "1px solid #FFF7DC",
                  borderRadius: 5,
                }}
                className="w-full mt-3 py-4 rounded-xl cursor-pointer avantbold text-lg tracking-wide shadow-md transition-all duration-300 disabled:cursor-not-allowed"
                onClick={() => navigate('/user/cart/checkout')}
              >
                PROCEED TO CHECKOUT
              </button>
              <div className="text-center mt-6 avantbold cursor-pointer text-lg text-[#fff7dc]"
              onClick={() => navigate('/')}
              >
                CONTINUE SHOPPING...
              </div>
              <div className="text-center text-[#fff7dc] mt-5 avant text-xs">
                Shipping and discounts are calculated at checkout
              </div>
            </div>
          </div>
        </div>
        {/* fullscreen modal when image clicked */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <img
              src={modalImg}
              alt="Product Full"
              className="max-w-full max-h-full shadow-lg"
              onClick={closeModal}
            />
          </div>
        )}
      </div>
      {/* Mobile layout */}
      <ShoppingBagMobile
        cart={cart}
        subtotal={subtotal}
        itemCount={itemCount}
        modalOpen={modalOpen}
        modalImg={modalImg}
        openModal={openModal}
        closeModal={closeModal}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        updateSize={updateSize}
        getAvailableSizes={getAvailableSizes}
        getSizeStock={getSizeStock}
        ringCategoryId={ringCategoryId}
        isAtMaxStock={isAtMaxStock}
        hoveredCheckout={hoveredCheckout}
        setHoveredCheckout={setHoveredCheckout}
        navigate={navigate}
        toggleItemSelection={toggleItemSelection}
        isItemSelected={isItemSelected}
        getSelectedItemsTotal={getSelectedItemsTotal}
        getSelectedItemsCount={getSelectedItemsCount}
        isRingWithoutSize={isRingWithoutSize}
        isSizeOutOfStock={isSizeOutOfStock}
        hasItemIssue={hasItemIssue}
      />
    </Layout>
  )
}

export default ShoppingBag
