import React from "react";
import {
  TryOnIcon,
  AddFavorite,
  AddedFavorites,
  PrevIcon,
  NextIcon,
  MinusIcon,
  PlusIcon,
  Ruler,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  ClashCollHeroNeck,
} from "../assets/index.js";

const fallbackImages = [
  ClashCollHeroNeck,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
];

const ProductMain = ({
  formattedProduct,
  currentImageIndex,
  imageRef,
  handleImageTouchStart,
  handleImageTouchMove,
  handleImageTouchEnd,
  handleThumbnailClick,
  isFavorited,
  setIsFavorited,
  quantity,
  handleQuantityChange,
  getAvailableStock,
  getSelectedSizeStock,
  getAvailableSizes,
  selectedSize,
  handleSizeSelect,
  handlePrevImage,
  handleNextImage,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* MOBILE LAYOUT - Visible only on mobile */}
      <div className="block lg:hidden">
        <div
          ref={imageRef}
          className="w-full bg-black rounded-lg overflow-hidden aspect-square select-none mb-2"
          onTouchStart={handleImageTouchStart}
          onTouchMove={handleImageTouchMove}
          onTouchEnd={handleImageTouchEnd}
        >
          <img
            src={formattedProduct?.images?.[currentImageIndex] || fallbackImages[0]}
            alt={formattedProduct?.name || ""}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        </div>

        <div className="flex flex-row gap-3 justify-center mb-4">
          {(formattedProduct?.images || fallbackImages).slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-20 aspect-square bg-black rounded-lg overflow-hidden border ${
                currentImageIndex === index
                  ? "border-[#FFF7DC]"
                  : "border-transparent"
              } transition-all`}
            >
              <img
                src={image}
                alt={`${formattedProduct?.name || ""} view ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg avantbold tracking-wide uppercase">
              {formattedProduct.collectionName} {formattedProduct.name}
            </h2>
          </div>

          <div className="flex items-center justify-between -mt-2">
            <div className="flex items-center gap-3">
              {formattedProduct.oldPrice && formattedProduct.newPrice && (
                <span className="text-lg text-[#959595] line-through avant">
                  {formattedProduct.oldPrice}
                </span>
              )}
              <span className="text-2xl avantbold text-[#FFF7DC]">
                {formattedProduct.newPrice || formattedProduct.price}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-1.5 opacity-100 hover:opacity-80 transition-opacity">
                <img src={TryOnIcon} alt="Try On" className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorited(!isFavorited);
                }}
                className="w-6 h-6 p-0 opacity-100 hover:opacity-80 transition-opacity"
              >
                <img
                  src={isFavorited ? AddedFavorites : AddFavorite}
                  alt={isFavorited ? "Added to Favorites" : "Add to Favorites"}
                  className="w-full h-full object-contain block"
                />
              </button>
            </div>
          </div>

          <div className="flex justify-start -mt-2">
            <span className="text-sm text-[#959595] avantbold tracking-wider uppercase ">
              STOCKS: {getAvailableStock()}
            </span>
          </div>

          <div className="w-full h-px bg-[#FFF7DC] my-4"></div>

          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-[#959595] avantbold tracking-wider uppercase">
              QUANTITY
            </span>
            <div className="relative flex items-center justify-between bg-[#464647] bg-opacity-75 rounded-full w-[80px] h-[32px]">
              <button
                onClick={() => handleQuantityChange("decrease")}
                disabled={quantity <= 1}
                type="button"
                className="flex items-center justify-center w-[24px] h-full z-20"
              >
                <img src={MinusIcon} alt="Minus" className="w-2 h-2" />
              </button>

              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-[#FFF7DC] text-[#1f1f21] rounded-full flex items-center justify-center text-sm avantbold z-30 shadow">
                {quantity}
              </span>

              <button
                onClick={() => handleQuantityChange("increase")}
                disabled={
                  quantity >=
                  (formattedProduct?.sizeStocks?.length > 0
                    ? getSelectedSizeStock()
                    : getAvailableStock())
                }
                type="button"
                className="flex items-center justify-center w-[24px] h-full z-20"
              >
                <img src={PlusIcon} alt="Plus" className="w-2 h-2" />
              </button>
            </div>
          </div>

          {formattedProduct?.sizes &&
            formattedProduct.sizes.length > 0 && (
              <div className="space-y-2 mb-4">
                <span className="block text-sm text-[#959595] avantbold tracking-wider uppercase">
                  SIZE
                </span>
                <div className="flex gap-1.5">
                  {getAvailableSizes().map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`w-8 h-8 rounded-md border-2 transition-all duration-200 flex items-center justify-center text-xs avantbold ${
                        selectedSize === size
                          ? "bg-[#FFF7DC] text-[#1f1f21] border-[#FFF7DC]"
                          : "bg-transparent text-[#FFF7DC] border-[#959595] hover:border-[#FFF7DC]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 text-[#959595] hover:opacity-80 transition-opacity">
                  <img src={Ruler} alt="Ruler" className="w-4 h-4" />
                  <span className="text-xs avantbold tracking-wider uppercase">
                    CHECK MY SIZE
                  </span>
                </button>
              </div>
            )}

          <button className="w-full py-3 rounded-lg avantbold tracking-wider flex items-center justify-center gap-2 text-lg bg-[#FFF7DC] text-[#1f1f21] mb-6">
            ADD TO BAG
          </button>

          <div className="space-y-4">
            {formattedProduct.description
              .split("\n\n")
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm text-[#FFF7DC]/90 leading-relaxed text-justify avant"
                >
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT - Hidden on mobile, visible on lg+ */}
      {/* Left Side: Images */}
      <div className="hidden lg:block space-y-4 pt-10">
        <div
          ref={imageRef}
          className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-[600px] mx-auto select-none"
          onTouchStart={handleImageTouchStart}
          onTouchMove={handleImageTouchMove}
          onTouchEnd={handleImageTouchEnd}
        >
          <img
            src={formattedProduct?.images?.[currentImageIndex] || fallbackImages[0]}
            alt={formattedProduct?.name || ""}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {(formattedProduct?.images || fallbackImages).slice(0, 4).map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  index === currentImageIndex
                    ? "bg-[#FFF7DC] border-[#FFF7DC]"
                    : "bg-transparent border-[#FFF7DC]/50 hover:border-[#FFF7DC]"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-10"
          >
            <img src={PrevIcon} alt="Previous" className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-10"
          >
            <img src={NextIcon} alt="Next" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Right Side - Product Info (Sticky) - Desktop Only */}
      <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start space-y-6 pt-10">
        <div className="flex items-start justify-between">
          <h2 className="text-3xl tracking-wide uppercase avantbold leading-none">
            {formattedProduct.collectionName} {formattedProduct.name}
          </h2>
          <div className="flex items-center gap-3">
            <button className="p-2 opacity-100 hover:opacity-80 transition-opacity">
              <img src={TryOnIcon} alt="Try On" className="w-8 h-8" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorited(!isFavorited);
              }}
              className="w-8 h-8 p-0 opacity-100 hover:opacity-80 transition-opacity"
            >
              <img
                src={isFavorited ? AddedFavorites : AddFavorite}
                alt={isFavorited ? "Added to Favorites" : "Add to Favorites"}
                className="w-full h-full object-contain block"
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {formattedProduct.oldPrice && formattedProduct.newPrice && (
            <span className="text-2xl text-[#959595] line-through avant">
              {formattedProduct.oldPrice}
            </span>
          )}
          <span className="text-4xl avant">{formattedProduct.newPrice || formattedProduct.price}</span>
        </div>

        <div className="flex items-start gap-36">
          <div className="w-[120px] space-y-2">
            <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">QUANTITY</h3>
            <div className="relative flex items-center justify-between bg-[#464647] bg-opacity-75 rounded-full w-full h-[40px]">
              <button
                onClick={() => handleQuantityChange("decrease")}
                disabled={quantity <= 1}
                type="button"
                className="flex items-center justify-center w-[30px] h-full z-20"
              >
                <img src={MinusIcon} alt="Minus" className="w-2.5 h-2.5" />
              </button>

              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45px] h-[45px] bg-[#FFF7DC] text-[#1f1f21] rounded-full flex items-center justify-center text-lg avantbold z-30 shadow">
                {quantity}
              </span>

              <button
                onClick={() => handleQuantityChange("increase")}
                disabled={
                  quantity >=
                  (formattedProduct?.sizeStocks?.length > 0
                    ? getSelectedSizeStock()
                    : getAvailableStock())
                }
                type="button"
                className="flex items-center justify-center w-[30px] h-full z-20"
              >
                <img src={PlusIcon} alt="Plus" className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {formattedProduct?.sizes &&
            formattedProduct.sizes.length > 0 && (
              <div className="flex-1 space-y-2">
                <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">SIZE</h3>
                <div className="flex flex-wrap gap-2 justify-start">
                  {getAvailableSizes().map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`w-10 h-10 rounded-md border-2 transition-all duration-200 flex items-center justify-center text-lg avantbold ${
                        selectedSize === size
                          ? "bg-[#FFF7DC] text-[#1f1f21] border-[#FFF7DC]"
                          : "bg-transparent text-[#FFF7DC] border-[#959595] hover:border-[#FFF7DC]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className="flex flex-row items-center justify-between mt-6 mb-8">
          <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">STOCKS: {getAvailableStock()}</h3>
          {formattedProduct?.sizes &&
            formattedProduct.sizes.length > 0 && (
              <button className="flex items-center gap-2 text-[#959595] hover:opacity-80 transition-opacity">
                <img src={Ruler} alt="Ruler" className="w-5 h-5" />
                <span className="text-lg avantbold tracking-wider uppercase">CHECK MY SIZE</span>
              </button>
            )}
        </div>

        <div className="space-y-8 mb-10">
          {formattedProduct.description
            .split("\n\n")
            .map((paragraph, index) => (
              <p key={index} className="text-lg text-[#FFF7DC]/90 leading-relaxed text-justify avant">
                {paragraph}
              </p>
            ))}
        </div>

        <button className="w-full py-4 rounded-lg avantbold tracking-wider flex items-center justify-center gap-3 text-2xl bg-[#FFF7DC] text-[#1f1f21]">ADD TO BAG</button>

        <div className="grid grid-cols-4 gap-3 mt-6">
          {(formattedProduct?.images || fallbackImages).slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square bg-black rounded-lg overflow-hidden border ${
                currentImageIndex === index
                  ? "border-[#FFF7DC]"
                  : "border-transparent"
              } transition-all hover:bg-[#333] hover:shadow-lg`}
            >
              <img
                src={image}
                alt={`${formattedProduct?.name || ""} view ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductMain;
