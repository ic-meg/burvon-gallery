import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

 
  useEffect(() => {
    const savedWishlist = localStorage.getItem("burvon_wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
        setWishlist([]);
      }
    }
    setIsInitialized(true);
  }, []);


  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("burvon_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const addToWishlist = (product) => {
    const wishlistItem = {
      id: product.id,
      product_id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      variant: product.variant,
      stock: product.stock,
      collection: product.collection,
      category: product.category,
      category_id: product.category_id,
      added_at: new Date().toISOString(),
    };

    setWishlist((prevWishlist) => {

      const existingItem = prevWishlist.find((item) => item.id === wishlistItem.id);
      
      if (existingItem) {
        return prevWishlist;
      }
      
      return [...prevWishlist, wishlistItem];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => 
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const getWishlistItem = (productId) => {
    return wishlist.find((item) => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const value = {
    wishlist,
    isInitialized,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItem,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
