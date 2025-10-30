import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartNotification from "../components/CartNotification";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("burvon_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Clean up category names in existing cart items
        const cleanedCart = parsedCart.map((item) => ({
          ...item,
          category: item.category
            ? (() => {
                const cleaned = item.category.replace(/\s+Collection$/i, "");
                // Handle specific cases
                if (
                  cleaned.toLowerCase().includes("kids") ||
                  cleaned.toLowerCase().includes("necklace")
                ) {
                  return "Necklaces";
                }
                if (cleaned.toLowerCase().includes("earring")) {
                  return "Earrings";
                }
                if (cleaned.toLowerCase().includes("ring")) {
                  return "Rings";
                }
                if (cleaned.toLowerCase().includes("bracelet")) {
                  return "Bracelets";
                }

                return cleaned.split(" ").pop();
              })()
            : item.category,
        }));
        setCart(cleanedCart);
        // Save the cleaned cart back to localStorage
        localStorage.setItem("burvon_cart", JSON.stringify(cleanedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        setCart([]);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("burvon_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (
    product,
    quantity = 1,
    selectedSize = null,
    sizeSpecificStock = null
  ) => {
    const cartItem = {
      id: `${product.id}_${selectedSize || "default"}`,
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: quantity,
      size: selectedSize,
      variant: product.variant || null,
      collection: product.collection || null,
      category: product.category
        ? (() => {
            const cleaned = product.category.replace(/\s+Collection$/i, "");

            if (
              cleaned.toLowerCase().includes("kids") ||
              cleaned.toLowerCase().includes("necklace")
            ) {
              return "Necklaces";
            }
            if (cleaned.toLowerCase().includes("earring")) {
              return "Earrings";
            }
            if (cleaned.toLowerCase().includes("ring")) {
              return "Rings";
            }
            if (cleaned.toLowerCase().includes("bracelet")) {
              return "Bracelets";
            }

            return cleaned.split(" ").pop();
          })()
        : null,
      category_id: product.category_id || null,
      stock:
        sizeSpecificStock !== null ? sizeSpecificStock : product.stock || 0,
      added_at: new Date().toISOString(),
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItem.id);

      if (existingItem) {
        const availableStock =
          sizeSpecificStock !== null
            ? sizeSpecificStock
            : parseInt(existingItem.stock) || 0;

        if (existingItem.quantity >= availableStock) {
          return prevCart;
        }

        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > availableStock) {
          return prevCart.map((item) =>
            item.id === cartItem.id
              ? { ...item, quantity: availableStock }
              : item
          );
        } else {
          return prevCart.map((item) =>
            item.id === cartItem.id ? { ...item, quantity: newQuantity } : item
          );
        }
      } else {
        const sameProductSameSize = prevCart.find(
          (item) =>
            item.product_id === cartItem.product_id &&
            item.size === cartItem.size &&
            item.quantity >= (parseInt(item.stock) || 0)
        );

        if (sameProductSameSize) {
          return prevCart;
        }

        const availableStock =
          sizeSpecificStock !== null
            ? sizeSpecificStock
            : parseInt(cartItem.stock) || 0;
        if (quantity > availableStock) {
          cartItem.quantity = availableStock;
        }
        return [...prevCart, cartItem];
      }
    });

    setAddedItem(cartItem);
    setShowNotification(true);
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity, stockLimit = null) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === itemId) {
            const availableStock =
              stockLimit !== null ? stockLimit : parseInt(item.stock) || 0;

            // If size-specific stock is 0 but general stock exists, use general stock
            if (stockLimit === 0 && parseInt(item.stock) > 0) {
              const finalQuantity = Math.min(newQuantity, parseInt(item.stock));
              return { ...item, quantity: finalQuantity };
            }

            const finalQuantity = Math.min(newQuantity, availableStock);

            // If stock is 0, remove the item from cart
            if (availableStock === 0) {
              return null;
            }

            return { ...item, quantity: finalQuantity };
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  const updateSize = (itemId, newSize, sizeSpecificStock = null) => {
    setCart((prevCart) => {
      const currentItem = prevCart.find((item) => item.id === itemId);
      if (!currentItem) return prevCart;

      // Check if an item with this product_id, category_id, and new size already exists
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.product_id === currentItem.product_id &&
          cartItem.category_id === currentItem.category_id &&
          cartItem.size === newSize &&
          cartItem.id !== itemId
      );

      if (existingItem) {
        // Check if the existing item is already at maximum stock
        const availableStock = parseInt(existingItem.stock) || 0;
        const newQuantity = existingItem.quantity + currentItem.quantity;

        if (existingItem.quantity >= availableStock) {
          return prevCart;
        } else if (newQuantity > availableStock) {
          return prevCart
            .filter((item) => item.id !== itemId)
            .map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: availableStock }
                : item
            );
        } else {
          // Safe to merge quantities
          return prevCart
            .filter((item) => item.id !== itemId)
            .map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: newQuantity }
                : item
            );
        }
      } else {
        const newItemId = `${currentItem.product_id}_${newSize}`;
        return prevCart.map((item) =>
          item.id === itemId
            ? {
                ...item,
                id: newItemId,
                size: newSize,
                stock:
                  sizeSpecificStock !== null ? sizeSpecificStock : item.stock,
              }
            : item
        );
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const clearSelectedItems = () => {
    setCart(prevCart => prevCart.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId, size = null) => {
    const itemId = `${productId}_${size || "default"}`;
    return cart.some((item) => item.id === itemId);
  };

  const getCartItem = (productId, size = null) => {
    const itemId = `${productId}_${size || "default"}`;
    return cart.find((item) => item.id === itemId);
  };

  const isAtMaxStock = (itemId, sizeSpecificStock = null) => {
    const item = cart.find((item) => item.id === itemId);
    if (!item) return false;

    const availableStock =
      sizeSpecificStock !== null
        ? sizeSpecificStock
        : parseInt(item.stock) || 0;
    return item.quantity >= availableStock;
  };

  const handleLogin = async (userData) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Keep localStorage cart for anonymous users
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    setAddedItem(null);
  };

  const handleNavigateToBag = () => {
    navigate("/shopping-bag");
  };

  // Selection functions
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const selectAllItems = () => {
    setSelectedItems(cart.map(item => item.id));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const isItemSelected = (itemId) => {
    return selectedItems.includes(itemId);
  };

  const getSelectedItems = () => {
    return cart.filter(item => selectedItems.includes(item.id));
  };

  const getSelectedItemsTotal = () => {
    return getSelectedItems().reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getSelectedItemsCount = () => {
    return getSelectedItems().reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    selectedItems,
    isLoggedIn,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSize,
    clearCart,
    clearSelectedItems,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItem,
    isAtMaxStock,
    handleLogin,
    handleLogout,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    isItemSelected,
    getSelectedItems,
    getSelectedItemsTotal,
    getSelectedItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartNotification
        show={showNotification}
        onClose={handleCloseNotification}
        addedItem={addedItem}
        onNavigateToBag={handleNavigateToBag}
      />
    </CartContext.Provider>
  );
};
