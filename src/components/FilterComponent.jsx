import React, { useState, useEffect } from 'react';
import {
  DropDownIcon,
  DropDownIconBlack,
  DropUpIconBlack,
  DropUpIcon,
  FilterIcon,
} from "../assets/index.js";

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isOpen,
  onToggle,
}) => {
  return (
    <div className="custom-dropdown relative w-full">
      <button
        type="button"
        onClick={onToggle}
        className="avant w-full bg-transparent border border-[#FFF7DC]/70 text-[#FFF7DC] px-4 py-2 rounded-md flex justify-between items-center focus:outline-none focus:border-[#FFF7DC]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value && value !== "none"
          ? options.find((o) => o.value === value)?.label
          : placeholder}
        <img
          src={isOpen ? DropUpIcon : DropDownIcon}
          alt="dropdown arrow"
          className="w-4 h-4 opacity-80 pointer-events-none"
        />
      </button>
      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="avant absolute top-full left-0 w-full bg-[#181818] border border-[#FFF7DC] rounded-md mt-2 shadow-lg max-h-60 overflow-auto z-50"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
              tabIndex={0}
              className={`px-4 py-2 cursor-pointer select-none hover:bg-[#232323] ${
                value === option.value ? "bg-[#232323]" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FilterComponent = ({
  // Filter options
  collectionOptions = [],
  sortOptions = [],
  showCategoryFilter = false,
  categoryOptions = [],
  
  // Filter values
  collectionValue,
  sortValue,
  categoryValue,
  minPrice,
  maxPrice,
  
  // Price range limits
  priceMin = 0,
  priceMax = 2000,
  
  // Filter handlers
  onCollectionChange,
  onSortChange,
  onCategoryChange,
  onPriceChange,
  
  // Mobile state
  mobileFilterOpen,
  setMobileFilterOpen,
  showMobileCollection,
  setShowMobileCollection,
  showMobileSort,
  setShowMobileSort,
  showMobileCategory,
  setShowMobileCategory,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden sm:flex flex-row items-center gap-6 flex-1 min-w-0">
        {showCategoryFilter && (
          <div className="flex flex-col min-w-[180px]">
            <label className="text-xl bebas mb-2 uppercase tracking-wide">
              Category
            </label>
            <CustomDropdown
              options={categoryOptions}
              value={categoryValue}
              onChange={onCategoryChange}
              placeholder="Select a category..."
              isOpen={openDropdown === "category"}
              onToggle={() =>
                setOpenDropdown(
                  openDropdown === "category" ? null : "category"
                )
              }
            />
          </div>
        )}

        <div className="flex flex-col min-w-[200px]">
          <label className="text-xl bebas mb-2 uppercase tracking-wide">
            Collection Name
          </label>
          <CustomDropdown
            options={collectionOptions}
            value={collectionValue}
            onChange={onCollectionChange}
            placeholder="Select a Collection..."
            isOpen={openDropdown === "collection"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "collection" ? null : "collection"
              )
            }
          />
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-xl bebas mb-2 uppercase tracking-wide">
            Sort
          </label>
          <CustomDropdown
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
            isOpen={openDropdown === "sort"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "sort" ? null : "sort")
            }
          />
        </div>

        <div className="flex flex-col min-w-[200px]">
          <label className="text-xl bebas mb-2 uppercase tracking-wide">
            Price
          </label>
          <div className="relative w-full h-8 flex items-center">
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#FFF7DC]/30 rounded-full -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 h-[3px] bg-[#FFF7DC] rounded-full -translate-y-1/2"
              style={{
                left: `${((minPrice - priceMin) / (priceMax - priceMin)) * 100}%`,
                right: `${
                  100 - ((maxPrice - priceMin) / (priceMax - priceMin)) * 100
                }%`,
              }}
            ></div>
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step="50"
              value={minPrice}
              onChange={(e) =>
                onPriceChange(
                  Number(e.target.value),
                  maxPrice
                )
              }
              className="absolute w-full appearance-none bg-transparent pointer-events-none
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFF7DC]
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
              style={{ pointerEvents: "auto" }}
            />
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step="50"
              value={maxPrice}
              onChange={(e) =>
                onPriceChange(
                  minPrice,
                  Number(e.target.value)
                )
              }
              className="absolute w-full appearance-none bg-transparent pointer-events-none
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFF7DC]
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30"
              style={{ pointerEvents: "auto" }}
            />
          </div>
          <div className="flex justify-between text-sm avant text-[#FFF7DC]/90 mt-1">
            <span>₱{minPrice}</span>
            <span>₱{maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex sm:hidden">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 border border-[#FFF7DC] rounded-md px-4 py-2 text-base avant transition focus:outline-none"
        >
          <img src={FilterIcon} alt="Filter" className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div
          className="fixed bottom-0 left-0 w-full z-50 shadow-2xl rounded-t-[30px] p-6 flex flex-col gap-6 animate-slideUp overflow-y-auto"
          style={{
            minHeight: "70vh",
            backgroundColor: "#FFF7DC",
            color: "#1F1F21",
            height: "60vh",
          }}
        >
          <button
            className="self-end text-2xl focus:outline-none text-[#232323]"
            onClick={() => setMobileFilterOpen(false)}
          >
            &times;
          </button>

          {showCategoryFilter && (
            <>
              <div>
                <button
                  className="w-full flex justify-between items-center cursor-pointer select-none"
                  onClick={() => {
                    setShowMobileCategory((prev) => !prev);
                    setShowMobileCollection(false);
                    setShowMobileSort(false);
                  }}
                >
                  <span
                    className="text-2xl bebas uppercase tracking-wide"
                    style={{ textShadow: "0 2px 6px #0001" }}
                  >
                    CATEGORY
                  </span>
                  <img
                    src={
                      showMobileCategory ? DropUpIconBlack : DropDownIconBlack
                    }
                    alt="dropdown"
                    className="ml-2 w-4 h-4"
                  />
                </button>
                {showMobileCategory && (
                  <div className="mt-4 space-y-2">
                    {categoryOptions
                      .filter((x) => x.value !== "none")
                      .map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            onCategoryChange(option.value);
                            setShowMobileCategory(false);
                          }}
                          className={`cursor-pointer avant text-[19px] tracking-wide ${
                            categoryValue === option.value
                              ? "font-bold underline"
                              : ""
                          }`}
                          style={{ color: "#232323" }}
                        >
                          {option.label}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <hr style={{ borderColor: "#23232340" }} className="my-2" />
            </>
          )}

          <div>
            <button
              className="w-full flex justify-between items-center cursor-pointer select-none"
              onClick={() => {
                setShowMobileCollection((prev) => !prev);
                setShowMobileCategory(false);
                setShowMobileSort(false);
              }}
            >
              <span
                className="text-2xl bebas uppercase tracking-wide"
                style={{ textShadow: "0 2px 6px #0001" }}
              >
                COLLECTION NAME
              </span>
              <img
                src={
                  showMobileCollection ? DropUpIconBlack : DropDownIconBlack
                }
                alt="dropdown"
                className="ml-2 w-4 h-4"
              />
            </button>
            {showMobileCollection && (
              <div className="mt-4 space-y-2">
                {collectionOptions
                  .filter((x) => x.value !== "none")
                  .map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        onCollectionChange(option.value);
                        setShowMobileCollection(false);
                      }}
                      className={`cursor-pointer avant text-[19px] tracking-wide ${
                        collectionValue === option.value
                          ? "font-bold underline"
                          : ""
                      }`}
                      style={{ color: "#232323" }}
                    >
                      {option.label}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <hr style={{ borderColor: "#23232340" }} className="my-2" />

          <div>
            <button
              className="w-full flex justify-between items-center cursor-pointer select-none"
              onClick={() => {
                setShowMobileSort((prev) => !prev);
                setShowMobileCategory(false);
                setShowMobileCollection(false);
              }}
            >
              <span
                className="text-2xl bebas uppercase tracking-wide"
                style={{ textShadow: "0 2px 6px #0001" }}
              >
                SORT
              </span>
              <img
                src={showMobileSort ? DropUpIconBlack : DropDownIconBlack}
                alt="dropdown"
                className="ml-2 w-4 h-4"
              />
            </button>
            {showMobileSort && (
              <div className="mt-4 space-y-2">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowMobileSort(false);
                    }}
                    className={`cursor-pointer avant text-[19px] tracking-wide ${
                      sortValue === option.value ? "font-bold underline" : ""
                    }`}
                    style={{ color: "#232323" }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr style={{ borderColor: "#23232340" }} className="my-2" />

          <div>
            <div
              className="text-2xl bebas uppercase tracking-wide mb-3"
              style={{ color: "#232323", textShadow: "0 2px 6px #0001" }}
            >
              PRICE
            </div>
            <div className="relative w-full h-8 flex items-center">
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#2323232a] rounded-full -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 h-[3px] bg-[#232] rounded-full -translate-y-1/2"
                style={{
                  left: `${((minPrice - 300) / (1200 - 300)) * 100}%`,
                  right: `${100 - ((maxPrice - 300) / (1200 - 300)) * 100}%`,
                }}
              ></div>
              <input
                type="range"
                min="300"
                max="1200"
                step="50"
                value={minPrice}
                onChange={(e) =>
                  onPriceChange(
                    Math.min(Number(e.target.value), maxPrice - 50),
                    maxPrice
                  )
                }
                className="absolute w-full appearance-none bg-transparent pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1F1F21]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
                style={{ pointerEvents: "auto" }}
              />
              <input
                type="range"
                min="300"
                max="1200"
                step="50"
                value={maxPrice}
                onChange={(e) =>
                  onPriceChange(
                    minPrice,
                    Math.max(Number(e.target.value), minPrice + 50)
                  )
                }
                className="absolute w-full appearance-none bg-transparent pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1F1F21]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30"
                style={{ pointerEvents: "auto" }}
              />
            </div>
            <div className="flex justify-between text-base avant text-[#1F1F21] mt-1">
              <span>₱{minPrice}</span>
              <span>₱{maxPrice}</span>
            </div>
          </div>

          <button
            className="-mt-2 w-full bg-[#1F1F21] text-[#FFF7DC] avantbold rounded-md py-2 text-lg tracking-wide"
            onClick={() => setMobileFilterOpen(false)}
          >
            APPLY FILTERS
          </button>
        </div>
      )}
    </>
  );
};

export default FilterComponent;
