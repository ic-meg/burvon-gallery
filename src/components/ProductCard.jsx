import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import {
  TryOnIcon,
  AddFavorite,
  AddedFavorites,
  PrevIcon,
  NextIcon,
  AddBag,
  AddBagHover,
} from "../assets/index.js";
import { hasTryOnAvailable } from "../utils/tryOnUtils";

export default function ProductCard({
  item,
  layout = "desktop",
  isHovered = false,
  currentImageIndex = 0,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onImageChange = () => {},
  hoveredButtonId,
  setHoveredButtonId = () => {},
  mobileImageHeight = "200px", // Default mobile image height
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const mobile = layout === "mobile";

  // Generate slug for navigation (same logic as CategoryProducts.jsx)
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

  const handleCardClick = () => {
    const productSlug = item.slug || generateSlug(item.name, item.collection);
    navigate(`/product/${productSlug}`);
  };


  const isOutOfStock = () => {
    if (
      item.category_id === 4 ||
      (item.category &&
        (item.category.toLowerCase() === "ring" ||
          item.category.toLowerCase() === "rings" ||
          item.category.toLowerCase().includes("ring collection")))
    ) {
      if (item.sizeStocks && item.sizeStocks.length > 0) {
        const totalStock = item.sizeStocks.reduce((total, sizeStock) => {
          return total + (sizeStock.stock || 0);
        }, 0);
        return totalStock === 0;
      }
      // Fallback to general stock
      return item.stock === 0 || item.stock === "0";
    }
   
    return item.stock === 0 || item.stock === "0";
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock()) return;

    const productData = {
      id: item.id,
      name: item.name,
      price: item.price,
      images: item.images,
      variant: item.variant,
      stock: item.stock,
      collection: item.collection,
      category: item.category,
      category_id: item.category_id,
    };

    if (
      item.category_id === 4 ||
      (item.category &&
        (item.category.toLowerCase() === "ring" ||
          item.category.toLowerCase() === "rings" ||
          item.category.toLowerCase().includes("ring collection")))
    ) {
      navigate(`/product/${generateSlug(item.name, item.collection)}`);
    } else {
      addToCart(productData, 1, null, null);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    
    const productData = {
      id: item.id,
      name: item.name,
      price: item.price,
      images: item.images,
      variant: item.variant,
      stock: item.stock,
      collection: item.collection,
      category: item.category,
      category_id: item.category_id,
    };

    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(productData);
    }
  };

  if (mobile) {
    const mobileCollection = item.collection.replace(/ COLLECTION$/i, "");

    return (
      <div
        className="relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] cursor-pointer flex flex-col items-center w-full"
        onClick={handleCardClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={`relative w-full overflow-hidden ${
            isOutOfStock() ? "bg-gray-800" : "bg-black"
          }`}
          style={{ height: mobileImageHeight }}
        >
          <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-30">
            {hasTryOnAvailable(item.category, item.name) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const category = item.category || "";
                  const productName = item.name || "";
                  const params = new URLSearchParams();
                  if (category) params.set("category", category);
                  if (productName) params.set("product", productName);
                  navigate(`/tryon?${params.toString()}`);
                }}
                className="w-5 h-5 p-0 bg-transparent border-0 cursor-pointer hover:opacity-80 flex items-center justify-center"
                aria-label="Try on this product"
                title="Try on this product"
              >
                <img
                  src={TryOnIcon}
                  alt="Try On"
                  className="w-full h-full pointer-events-none"
                  draggable={false}
                />
              </button>
            )}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="w-5 h-5 p-0 bg-transparent border-0 cursor-pointer hover:opacity-80 flex items-center justify-center"
              aria-label={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
              title={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <img
                src={isInWishlist(item.id) ? AddedFavorites : AddFavorite}
                alt={isInWishlist(item.id) ? "Added to Favorites" : "Add to Favorites"}
                className="w-full h-full pointer-events-none"
                draggable={false}
              />
            </button>
          </div>
          <img
            src={item.images[0]}
            alt={item.name}
            className={`w-full h-full object-cover ${
              isOutOfStock()
                ? "blur-[1px] brightness-50"
                : ""
            }`}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x400?text=No+Image";
            }}
          />
          {isOutOfStock() && (
            <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="cream-text px-4 py-2 rounded avantbold text-sm tracking-wider uppercase shadow-lg">
                  OUT OF STOCK
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="flex flex-col items-center py-1 px-1"
          style={{
            width: "100%",
            height: "50px",
            background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
          }}
        >
          <span className="uppercase text-[#FFF7DC] tracking-widest text-[10px] avantbold leading-tight truncate">
            {item.name}
          </span>
          <span className="text-[10px] tracking-widest text-[#FFF7DC] avant truncate mt-[2px] uppercase">
            {mobileCollection}
          </span>
          <div className="flex justify-center items-center gap-1 text-[10px] avantbold mt-1">
            {item.showStrikethrough && item.oldPrice && (
              <span className="line-through text-[#FFF7DC] opacity-50 truncate">
                {item.oldPrice}
              </span>
            )}
            {item.price && (
              <span className="text-[#FFF7DC] truncate">{item.price}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // desktop/large card
  return (
    <div
      className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform cursor-pointer ${
        isHovered ? "scale-105 z-10" : ""
      }`}
      style={{
        height: isHovered ? "440px" : "375px",
        transition: "height 0.3s ease, transform 0.3s ease",
      }}
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Try-on and Heart Icons */}
      <div className="w-full flex justify-between items-center px-6 pt-6 absolute top-0 left-0 z-30">
        {hasTryOnAvailable(item.category, item.name) ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const category = item.category || "";
              const productName = item.name || "";
              const params = new URLSearchParams();
              if (category) params.set("category", category);
              if (productName) params.set("product", productName);
              navigate(`/tryon?${params.toString()}`);
            }}
            className="w-6 h-6 p-0 bg-transparent border-0 cursor-pointer hover:opacity-80 flex items-center justify-center"
            aria-label="Try on this product"
            title="Try on this product"
          >
            <img
              src={TryOnIcon}
              alt="Try On"
              className="w-full h-full pointer-events-none"
              draggable={false}
            />
          </button>
        ) : (
          <div className="w-6 h-6" /> // Spacer to maintain layout
        )}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="w-6 h-6 p-0 bg-transparent border-0 cursor-pointer hover:opacity-80 flex items-center justify-center"
          aria-label={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
          title={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <img
            src={isInWishlist(item.id) ? AddedFavorites : AddFavorite}
            alt={isInWishlist(item.id) ? "Added to Favorites" : "Add to Favorites"}
            className="w-full h-full pointer-events-none"
            draggable={false}
          />
        </button>
      </div>
      {/* product image */}
      <div
        className={`relative w-full h-[300px] flex items-center justify-center overflow-hidden ${
          isOutOfStock() ? "bg-gray-800" : "bg-black"
        }`}
      >
        <img
          src={isHovered ? item.images[currentImageIndex] : item.images[0]}
          alt={item.name}
          className={`object-cover w-full h-full rounded-none transition-all duration-300 ${
            isOutOfStock()
              ? "blur-[2px] brightness-50"
              : ""
          }`}
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
        {isOutOfStock() && (
          <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="cream-text px-6 py-3 rounded-lg avantbold text-lg tracking-wider uppercase shadow-lg">
                OUT OF STOCK
              </div>
            </div>
          </div>
        )}
        {isHovered &&
          item.images.length > 1 &&
          !isOutOfStock() && (
            <>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(item.id, "prev");
                }}
                src={PrevIcon}
                alt="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                draggable={false}
              />
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(item.id, "next");
                }}
                src={NextIcon}
                alt="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                draggable={false}
              />
            </>
          )}
      </div>
      {/* names + price + add to bag button */}
      <div
        style={{
          background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
        }}
        className="relative py-2 px-2 text-center flex flex-col items-center rounded-none min-h-[140px]"
      >
        <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
          {item.name}
        </span>
        <span className="text-[13px] tracking-widest uppercase text-[#FFF7DC] avant">
          {item.collection}
        </span>
        <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
          {item.showStrikethrough && item.oldPrice && (
            <span className="line-through text-[#FFF7DC] opacity-50">
              {item.oldPrice}
            </span>
          )}
          {item.price && <span className="text-[#FFF7DC]">{item.price}</span>}
        </div>
        {/* Add to Bag Button */}
        {isHovered && (
          <button
            disabled={isOutOfStock()}
            onClick={handleAddToCart}
            style={{
              backgroundColor:
                hoveredButtonId === item.id ? "#FFF7DC" : "transparent",
              color: hoveredButtonId === item.id ? "#1F1F21" : "#FFF7DC",
              outline: "1px solid #FFF7DC",
              borderRadius: 5,
              opacity: isOutOfStock() ? 0.5 : 1,
              cursor:
                isOutOfStock()
                  ? "not-allowed"
                  : "pointer",
            }}
            onMouseEnter={() => setHoveredButtonId(item.id)}
            onMouseLeave={() => setHoveredButtonId(null)}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-5 transition-all duration-300"
          >
            <img
              src={hoveredButtonId === item.id ? AddBagHover : AddBag}
              alt="Bag Icon"
              className="w-4 h-4"
            />
            {isOutOfStock()
              ? "OUT OF STOCK"
              : "ADD TO BAG"}
          </button>
        )}
      </div>
    </div>
  );
}
