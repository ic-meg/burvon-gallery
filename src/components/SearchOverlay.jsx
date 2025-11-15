import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBlack } from "../assets";
import GlareHover from "./GlareHover";
import { useProduct } from "../contexts/ProductContext";
import { useCollection } from "../contexts/CollectionContext";

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { searchProducts, products, fetchAllProducts } = useProduct();
  const { collections, fetchAllCollections } = useCollection();
  const debounceTimerRef = useRef(null);

  // Generate slug for navigation (same logic as ProductCard)
  const generateSlug = (name, collectionName) => {
    if (!name) return "unnamed-product";
    const fullName =
      collectionName && collectionName !== "N/A"
        ? `${collectionName}-${name}`
        : name;
    return fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Client-side search function (fallback)
  const performClientSideSearch = (query, allProducts) => {
    if (!query || !allProducts || allProducts.length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    return allProducts.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const collection = (product.collection?.name || (typeof product.collection === 'string' ? product.collection : "") || "").toLowerCase();
      const category = (product.category?.name || (typeof product.category === 'string' ? product.category : "") || "").toLowerCase();
      const variant = (product.variant || "").toLowerCase();
      const sku = (product.sku || "").toLowerCase();

      return (
        name.includes(searchTerm) ||
        collection.includes(searchTerm) ||
        category.includes(searchTerm) ||
        variant.includes(searchTerm) ||
        sku.includes(searchTerm)
      );
    });
  };

  // Debounced search function
  const performSearch = useCallback(
    async (query) => {
      if (!query || query.trim().length === 0) {
        setSearchResults([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        // Try backend search first
        const response = await searchProducts(query.trim());
        
        if (response && response.length > 0) {
          setSearchResults(response);
        } else {
          // Fallback to client-side search if backend returns empty
          let allProducts = products;
          if (!allProducts || allProducts.length === 0) {
            await fetchAllProducts();
            const productApi = import.meta.env.VITE_PRODUCT_API;
            if (productApi) {
              try {
                const fetchResponse = await fetch(productApi);
                if (fetchResponse.ok) {
                  const data = await fetchResponse.json();
                  allProducts = data.products || (Array.isArray(data) ? data : []);
                }
              } catch (fetchError) {
                console.warn("Failed to fetch products for search:", fetchError);
              }
            }
          }
          const results = performClientSideSearch(query.trim(), allProducts || products);
          setSearchResults(results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to client-side search on error
        try {
          const results = performClientSideSearch(query.trim(), products);
          setSearchResults(results || []);
        } catch (clientError) {
          console.error("Client-side search error:", clientError);
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    },
    [searchProducts, products, fetchAllProducts]
  );

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      performSearch(searchQuery);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Handle popular search click
  const handlePopularSearch = (term) => {
    setSearchQuery(term);
    performSearch(term);
  };

  // Handle product click
  const handleProductClick = (product) => {
    const collectionName = product.collection?.name || (typeof product.collection === 'string' ? product.collection : '');
    const productSlug = product.slug || generateSlug(product.name, collectionName);
    onClose();
    navigate(`/product/${productSlug}`);
  };

  // Fetch collections when overlay opens
  useEffect(() => {
    if (isOpen && (!collections || collections.length === 0)) {
      fetchAllCollections();
    }
  }, [isOpen, collections, fetchAllCollections]);

  // Reset search when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    } else {
      // Focus input when overlay opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.classList.add("search-overlay-open");
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.classList.remove("search-overlay-open");
    }
    
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.classList.remove("search-overlay-open");
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isOpen]);

  // Prevent scroll on the backdrop
  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // Prevent scroll on the search content
  const handleSearchContentScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9999] transition-all w-full duration-1500 ease-in-out ${
          isOpen
            ? "opacity-100 backdrop-blur-md bg-black/30 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          touchAction: isOpen ? 'none' : 'auto',
          overscrollBehavior: isOpen ? 'none' : 'auto'
        }}
        onClick={handleBackdropClick}
        onWheel={(e) => isOpen && e.preventDefault()}
        onTouchMove={(e) => isOpen && e.preventDefault()}
      />
      
      {/* Search Content */}
      <div
        className={`fixed top-0 left-0 w-full z-[10000] transition-all duration-1500 ease-in-out transform ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        onWheel={handleSearchContentScroll}
        onTouchMove={handleSearchContentScroll}
      >
        {/* Search container - adjusts height based on content */}
        <div className={`cream-bg w-full px-6 pt-12 pb-6 text-black relative flex flex-col items-center ${
          hasSearched && searchResults.length > 0 
            ? 'min-h-[50vh] md:min-h-[60vh]' 
            : 'min-h-[35vh] md:min-h-[35vh] lg:min-h-[30vh]'
        }`}>
          {/* Close button */}
          <div
            role="button"
            tabIndex={0}
            onClick={onClose}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
            className="absolute top-4 right-6 text-4xl font-light text-black hover:opacity-70 cursor-pointer"
            aria-label="Close menu"
          >
            &times;
          </div>

          {/* Search bar */}
          <div className="w-full max-w-xl flex items-center border-b border-black avant">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search BURVON"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="flex-1 text-s md:text-lg lg:text-lg p-3 bg-transparent outline-none"
            />
            {isSearching ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <img src={SearchBlack} alt="Search" className="w-6 h-6" />
            )}
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="w-full max-w-4xl mt-6 px-6 overflow-y-auto max-h-[50vh]">
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 avant text-sm">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <h3 className="font-bold mb-4 bebas text-xl md:text-2xl">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.product_id || product.id || Math.random()}
                        onClick={() => handleProductClick(product)}
                        className="cursor-pointer group"
                      >
                        <div className="relative bg-black overflow-hidden aspect-square mb-2">
                          <img
                            src={
                              (product.images && product.images[0]) ||
                              (product.imagePaths && product.imagePaths[0]) ||
                              "https://via.placeholder.com/400"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <p className="avantbold text-sm text-black uppercase truncate">
                            {product.name || 'Unnamed Product'}
                          </p>
                          <p className="avant text-xs text-black/70 uppercase truncate">
                            {product.collection?.name || (typeof product.collection === 'string' ? product.collection : 'N/A')}
                          </p>
                          {product.price && (
                            <p className="avantbold text-sm text-black mt-1">
                              PHP {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="avant text-lg text-black/70">
                    No products found for "{searchQuery}"
                  </p>
                  <p className="avant text-sm text-black/50 mt-2">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Popular Searches - Only show when no search has been performed */}
          {!hasSearched && (
            <div className="mt-6 w-full text-left px-6">
              <h3 className="font-bold mb-3 bebas text-1xl md:text-2xl lg:text-2xl">Popular searches</h3>
              <div className="flex flex-wrap gap-2 justify-start cream-text avant">
                {collections && collections.length > 0 ? (
                  collections.slice(0, 5).map((collection) => (
                    <div key={collection.collection_id || collection.id} className="inline-block">
                      <GlareHover
                        glareColor="#ffffff"
                        glareOpacity={0.3}
                        glareAngle={-30}
                        glareSize={200}
                        transitionDuration={800}
                        playOnce={false}
                      >
                        <button
                          onClick={() => handlePopularSearch(collection.name)}
                          className="bg-transparent border border-transparent px-4 py-2 text-sm text-white rounded-md hover:border-white hover:text-white hover:shadow-[0_0_0_2px_rgba(255,255,255,0.4)] hover:backdrop-brightness-110 transition-all duration-300 ease-in-out uppercase"
                        >
                          {collection.name}
                        </button>
                      </GlareHover>
                    </div>
                  ))
                ) : (
                  // Fallback while loading or if no collections
                  <p className="avant text-sm text-black/50">Loading collections...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
