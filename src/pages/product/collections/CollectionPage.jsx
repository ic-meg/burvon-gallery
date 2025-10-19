import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import ProductCard from "../../../components/ProductCard";
import FilterComponent from "../../../components/FilterComponent";
import { useCollection } from "../../../contexts/CollectionContext";
import { useProduct } from "../../../contexts/ProductContext";

import {
  KidsCollHeroNeck,
  ClashCollHeroNeck,
  DropDownIcon,
  DropDownIconBlack,
  DropUpIconBlack,
  DropUpIcon,
  TryOnIcon,
  AddFavorite,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  AddBag,
  AddBagHover,
  NextIcon,
  PrevIcon,
  KidsCollHighNeck,
  KidsCollHighNeckCrop,
  FilterIcon,
} from "../../../assets/index.js";

const fallbackHeroImages = [
  { src: KidsCollHeroNeck },
  { src: ClashCollHeroNeck },
];

const categoryOptions = [
  { label: "Select a category....", value: "none" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Earrings", value: "earrings" },
  { label: "Rings", value: "rings" },
  { label: "Bracelets", value: "bracelets" },
];

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low to High", value: "priceLowHigh" },
  { label: "Price: High to Low", value: "priceHighLow" },
];

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

const CollectionPage = () => {
  const { collectionSlug } = useParams();
  const navigate = useNavigate();
  const {
    collections,
    loading: collectionsLoading,
    fetchAllCollections,
  } = useCollection();

  const {
    products,
    fetchAllProducts: contextFetchAllProducts,
    fetchProductsByCollection,
  } = useProduct();

  const [currentCollection, setCurrentCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [rawProducts, setRawProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collectionContent, setCollectionContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [collectionValue, setCollectionValue] = useState("none");
  const [categoryValue, setCategoryValue] = useState("none");
  const [sortValue, setSortValue] = useState(sortOptions[0].value);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showMobileCollection, setShowMobileCollection] = useState(false);
  const [showMobileCategory, setShowMobileCategory] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  const collectionOptions = [
    { label: "Select a Collection...", value: "none" },
    ...(collections || []).map((collection) => ({
      label: collection.name,
      value: collection.collection_id || collection.id,
    })),
  ];

  const getCategoryOptions = () => {
    const categories = new Set();
    const sourceProducts = rawProducts.length > 0 ? rawProducts : products;
    
    sourceProducts.forEach((product) => {
      if (product.category?.name) {
        categories.add(product.category.name);
      }
    });
    
    const categoryOptions = [
      { label: "Select a category....", value: "none" },
      ...Array.from(categories).map((category) => ({
        label: category
          .replace(/\s+Collection$/i, "")
          .split(" ")
          .pop(),
        value: category.toLowerCase(),
      })),
    ];
    
    return categoryOptions;
  };

  const [carouselIndex, setCarouselIndex] = useState(0);
  const maxVisible = 4;
  const isMobile = window.innerWidth < 768;

  const handleCollectionChange = (selectedCollectionId) => {
    if (selectedCollectionId === "none") {
      return;
    }
    
    const selectedCollection = collections.find(
      (col) => (col.collection_id || col.id) === selectedCollectionId
    );
    
    if (selectedCollection) {
      const slug = selectedCollection.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      
      navigate(`/collections/${slug}`);
    }
  };

  const handleSortChange = (value) => {
    setSortValue(value);
  };

  const handlePriceChange = (newMinPrice, newMaxPrice) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
  };

  const applyFilters = () => {
    const sourceProducts =
      rawProducts.length > 0 ? rawProducts : collectionProducts;
    
    let filtered = [...sourceProducts];


    if (categoryValue !== "none") {
      filtered = filtered.filter((product) => {
        const productCategory =
          product.category?.name?.toLowerCase() ||
          product.category?.toLowerCase() ||
          "";
        const matches = productCategory.includes(categoryValue);
        return matches;
      });
    }

    filtered = filtered.filter((product) => {
      const price = parseFloat(
        product.current_price?.replace(/[^\d.]/g, "") ||
          product.price?.replace(/[^\d.]/g, "") ||
          0
      );
      const matches = price >= minPrice && price <= maxPrice;
      return matches;
    });

    filtered.sort((a, b) => {
      switch (sortValue) {
        case "latest":
          return (
            new Date(b.created_at || b.createdAt || 0) -
            new Date(a.created_at || a.createdAt || 0)
          );
        case "priceLowHigh":
          const priceA = parseFloat(
            a.current_price?.replace(/[^\d.]/g, "") ||
              a.price?.replace(/[^\d.]/g, "") ||
              0
          );
          const priceB = parseFloat(
            b.current_price?.replace(/[^\d.]/g, "") ||
              b.price?.replace(/[^\d.]/g, "") ||
              0
          );
          return priceA - priceB;
        case "priceHighLow":
          const priceA2 = parseFloat(
            a.current_price?.replace(/[^\d.]/g, "") ||
              a.price?.replace(/[^\d.]/g, "") ||
              0
          );
          const priceB2 = parseFloat(
            b.current_price?.replace(/[^\d.]/g, "") ||
              b.price?.replace(/[^\d.]/g, "") ||
              0
          );
          return priceB2 - priceA2;
        default:
          return 0;
      }
    });

    const transformedProducts = filtered.map((product) => ({
      id: product.id || product.product_id || product._id,
      name: (product.name || "").toUpperCase() || "PRODUCT NAME",
      collection: currentCollection?.name?.toUpperCase() || "COLLECTION",
      oldPrice: (() => {
        if (product.original_price && product.current_price) {
          const cleaned = product.original_price
            .toString()
            .replace(/[^\d.]/g, "");
          const parsed = parseFloat(cleaned);
          return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
        }
        return "";
      })(),
      price: (() => {
        if (product.current_price) {
          const cleaned = product.current_price
            .toString()
            .replace(/[^\d.]/g, "");
          const parsed = parseFloat(cleaned);
          return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
        }
        if (product.price) {
          const cleaned = product.price.toString().replace(/[^\d.]/g, "");
          const parsed = parseFloat(cleaned);
          return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
        }
        if (product.original_price && !product.current_price) {
          const cleaned = product.original_price
            .toString()
            .replace(/[^\d.]/g, "");
          const parsed = parseFloat(cleaned);
          return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
        }
        return "";
      })(),
      images: Array.isArray(product.images)
          ? product.images
        : typeof product.images === "string" && product.images
            ? [product.images]
            : [],
      sku: product.sku,
      description: product.description,
      stock: product.stock,
      size: product.size,
      category: product.category?.name || product.category || null,
      category_id: product.category_id || null,
    }));

    if (transformedProducts.length === 0 && sourceProducts.length > 0) {
      const fallbackProducts = sourceProducts.map((product) => ({
        id: product.id || product.product_id || product._id,
        name: (product.name || "").toUpperCase() || "PRODUCT NAME",
        collection: currentCollection?.name?.toUpperCase() || "COLLECTION",
        oldPrice: (() => {
          if (product.original_price && product.current_price) {
            const cleaned = product.original_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
          }
          return "";
        })(),
        price: (() => {
          if (product.current_price) {
            const cleaned = product.current_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
          }
          if (product.price) {
            const cleaned = product.price.toString().replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
          }
          if (product.original_price && !product.current_price) {
            const cleaned = product.original_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `₱${parsed.toFixed(2)}` : "";
          }
          return "";
        })(),
        images: Array.isArray(product.images)
            ? product.images
          : typeof product.images === "string" && product.images
              ? [product.images]
              : [],
        sku: product.sku,
        description: product.description,
        stock: product.stock,
        size: product.size,
        category: product.category?.name || product.category || null,
        category_id: product.category_id || null,
      }));
      setFilteredProducts(fallbackProducts);
    } else {
      setFilteredProducts(transformedProducts);
    }
  };

  useEffect(() => {
    if (rawProducts.length > 0 || collectionProducts.length > 0) {
      applyFilters();
    }
  }, [
    rawProducts,
    collectionProducts,
    collectionValue,
    categoryValue,
    sortValue,
    minPrice,
    maxPrice,
  ]);


  useEffect(() => {
    if (rawProducts.length > 0 || collectionProducts.length > 0) {
      applyFilters();
    } else {
      setFilteredProducts([]);
    }
  }, [rawProducts, collectionProducts]);


  useEffect(() => {
    const loadCollectionData = async () => {
      setLoading(true);
      try {
        let collectionsData = collections;
        if (!collectionsData || collectionsData.length === 0) {
          collectionsData = await fetchAllCollections();
        }

        if (collectionsData && collectionsData.length > 0) {
          const foundCollection = collectionsData.find((collection) => {
            const slug = collection.name
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            return slug === collectionSlug;
          });

          if (foundCollection) {
            setCurrentCollection(foundCollection);
            setCollectionValue(
              foundCollection.collection_id || foundCollection.id
            );

           
            await loadCollectionContent(foundCollection.name);

            await loadCollectionProducts(
              foundCollection.collection_id || foundCollection.id,
              foundCollection.name
            );
          } else {
            console.warn("Collection not found for slug:", collectionSlug);

            const fallbackCollection = {
              id: null,
              collection_id: null,
              name: collectionSlug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
              collection_image: null,
            };
            setCurrentCollection(fallbackCollection);
            setCollectionValue("none"); 

            await loadCollectionContent(fallbackCollection.name);

            await loadCollectionProducts(null, fallbackCollection.name);
          }
        } else {
          console.warn("No collections data available");

          const fallbackCollection = {
            id: null,
            collection_id: null,
            name: collectionSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            collection_image: null,
          };
          setCurrentCollection(fallbackCollection);
          setCollectionValue("none"); 

          await loadCollectionContent(fallbackCollection.name);

          await loadCollectionProducts(null, fallbackCollection.name);
        }
      } catch (error) {
        console.error("Error loading collection data:", error);

        const fallbackCollection = {
          id: null,
          collection_id: null,
          name: collectionSlug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          collection_image: null,
        };
        setCurrentCollection(fallbackCollection);
        setCollectionValue("none"); 

        await loadCollectionContent(fallbackCollection.name);
        await loadCollectionProducts(null, fallbackCollection.name);
      } finally {
        setLoading(false);
      }
    };

    if (collectionSlug) {
      loadCollectionData();
    }
  }, [collectionSlug, collections, fetchAllCollections]);


  const loadCollectionContent = async (collectionName) => {
    try {
      const slug = collectionName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const apiUrl = `${
        import.meta.env.VITE_COLLECTION_CONTENT_API ||
        "http://localhost:3000/content/collection/"
      }${slug}`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const contentData = await response.json();
        
        let promoImages = contentData.promo_images;
        if (typeof promoImages === "string") {
          try {
            promoImages = JSON.parse(promoImages);
          } catch (e) {
            console.error("Failed to parse promo_images:", e);
            promoImages = [];
          }
        }

        let collectionImages = contentData.collection_image;
        if (typeof collectionImages === "string") {
          try {
            collectionImages = JSON.parse(collectionImages);
          } catch (e) {
            console.error("Failed to parse collection_image:", e);
            collectionImages = [];
          }
        }

   
        const parsedContentData = {
          ...contentData,
          promo_images: promoImages,
          collection_image: collectionImages,
        };
  
        setCollectionContent(parsedContentData);
      } else {
        setCollectionContent(null);
      }
    } catch (error) {
      setCollectionContent(null);
    }
  };
  
  const loadCollectionProducts = async (collectionId, collectionName) => {
    try {
      let fetched = [];
      console.debug("[CollectionPage] Using collectionId:", collectionId);
      console.debug("[CollectionPage] Collection name:", collectionName);
      console.debug(
        "[CollectionPage] fetchProductsByCollection function:",
        fetchProductsByCollection
      );
      
      if (collectionId && fetchProductsByCollection) {
        try {
          fetched = await fetchProductsByCollection(collectionId);
          
           
          if (fetched && fetched.length > 0) {
          } else {
          }
        } catch (error) {
          console.error(
            `Error fetching products for collection ${collectionId}:`,
            error
          );
          fetched = [];
        }
      } else {
        if (contextFetchAllProducts) {
          await contextFetchAllProducts();
          fetched = Array.isArray(products) ? products : [];
          console.debug(
            "[CollectionPage] fetchAllProducts fallback result:",
            fetched
          );
          console.debug("[CollectionPage] All products count:", fetched.length);
        }
      }


      if (
        (!fetched || fetched.length === 0) &&
        collectionName &&
        collectionId
      ) {
        if (contextFetchAllProducts) {
          await contextFetchAllProducts();
          fetched = Array.isArray(products) ? products : [];
        }
      } else if (!fetched || fetched.length === 0) {
        fetched = [];
      }

       
      let filtered = fetched;
      if (
        collectionName &&
        (!collectionId || (filtered && filtered.length === 0))
      ) {
        const nameLower = collectionName.toString().toLowerCase();
        filtered = fetched.filter((product) => {

          const productCollection = product.collection;
          const productCollectionName =
            product.collection?.name || product.collection_name || "";
          const productCollectionId =
            product.collection_id || product.collection?.collection_id;

      
          if (
            collectionId &&
            productCollectionId &&
            productCollectionId === collectionId
          ) {
            return true;
          }
          
   
          const collectionNameLower = productCollectionName
            .toString()
            .toLowerCase();
          if (collectionNameLower === nameLower) {
            return true;
          }
          
        
          if (
            collectionNameLower.includes(nameLower) ||
            nameLower.includes(collectionNameLower)
          ) {
            return true;
          }
  
          return false;
        });
      }

      if (filtered && filtered.length > 0) {
       
        const validProducts = filtered.filter((product) => {
          const productCollectionId =
            product.collection_id || product.collection?.collection_id;
          const productCollectionName =
            product.collection?.name || product.collection_name || "";
          const collectionNameLower = productCollectionName
            .toString()
            .toLowerCase();
          const targetNameLower =
            collectionName?.toString().toLowerCase() || "";
          
          if (
            collectionId &&
            productCollectionId &&
            productCollectionId === collectionId
          ) {
            return true;
          }
          
          if (
            collectionNameLower === targetNameLower ||
              collectionNameLower.includes(targetNameLower) || 
            targetNameLower.includes(collectionNameLower)
          ) {
            return true;
          }
          
          return false;
        });
        
        if (validProducts.length === 0) {
          setRawProducts([]);
          setCollectionProducts([]);
          return;
        }
        
   
        setRawProducts(validProducts);
        
        const transformedProducts = validProducts.map((product) => ({
          id: product.id || product.product_id || product._id,
          name: (product.name || "").toUpperCase() || "PRODUCT NAME",
          collection: (
            product.collection?.name ||
            product.collection ||
            collectionName ||
            "COLLECTION"
          ).toUpperCase(),
          oldPrice: (() => {
            if (product.original_price && product.current_price) {
              const cleaned = product.original_price
                .toString()
                .replace(/[^\d.]/g, "");
              const parsed = parseFloat(cleaned);
              return !isNaN(parsed) && parsed > 0
                ? `₱${parsed.toFixed(2)}`
                : "";
            }
            return "";
          })(),
          price: (() => {
            if (product.current_price) {
              const cleaned = product.current_price
                .toString()
                .replace(/[^\d.]/g, "");
              const parsed = parseFloat(cleaned);
              return !isNaN(parsed) && parsed > 0
                ? `₱${parsed.toFixed(2)}`
                : "";
            }
            if (product.price) {
              const cleaned = product.price.toString().replace(/[^\d.]/g, "");
              const parsed = parseFloat(cleaned);
              return !isNaN(parsed) && parsed > 0
                ? `₱${parsed.toFixed(2)}`
                : "";
            }
            if (product.original_price && !product.current_price) {
              const cleaned = product.original_price
                .toString()
                .replace(/[^\d.]/g, "");
              const parsed = parseFloat(cleaned);
              return !isNaN(parsed) && parsed > 0
                ? `₱${parsed.toFixed(2)}`
                : "";
            }
            return "";
          })(),
          images: Array.isArray(product.images)
              ? product.images
            : typeof product.images === "string" && product.images
                ? [product.images]
                : [],
          sku: product.sku,
          description: product.description,
          stock: product.stock,
          size: product.size,
        }));
        console.debug(
          "[CollectionPage] mapped products for ProductCard:",
          transformedProducts
        );
        setCollectionProducts(transformedProducts);
        return;
      }

      setRawProducts([]);
      setCollectionProducts([]);
    } catch (error) {
      console.error("Error loading products:", error);
      setRawProducts([]);
      setCollectionProducts([]);
    }
  };

  
  const getHeroImages = () => {
    if (
      collectionContent?.collection_image &&
      Array.isArray(collectionContent.collection_image) &&
      collectionContent.collection_image.length > 0
    ) {
      return collectionContent.collection_image.map((img) => ({ src: img }));
    }
    if (currentCollection?.collection_image) {
      return [{ src: currentCollection.collection_image }];
    }
    return fallbackHeroImages;
  };

 
  const getPromoImage = () => {
    if (
      collectionContent?.promo_images &&
      Array.isArray(collectionContent.promo_images) &&
      collectionContent.promo_images.length > 0
    ) {
      return collectionContent.promo_images[0];
    }
    return KidsCollHighNeckCrop; // fallback image
  };


  const getCollectionName = () => {
    return (
      currentCollection?.name?.toUpperCase() ||
      collectionSlug.replace(/-/g, " ").toUpperCase()
    );
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const heroImages = getHeroImages();
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [collectionContent, currentCollection]);

  const handleImageChange = (cardId, direction) => {
    const card = collectionProducts.find((item) => item.id === cardId);
    if (!card) return;
    const len = card.images.length;
    setHoveredImageIndexes((prev) => {
      let currentIndex = prev[cardId] ?? 0;
      currentIndex =
        direction === "next"
          ? (currentIndex + 1) % len
          : (currentIndex - 1 + len) % len;
      return { ...prev, [cardId]: currentIndex };
    });
  };


  const topPicksProducts = [];
  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex < topPicksProducts.length - maxVisible;

  const handlePrev = () => {
    if (canPrev) setCarouselIndex(carouselIndex - 1);
  };
  const handleNext = () => {
    if (canNext) setCarouselIndex(carouselIndex + 1);
  };

  if (loading) {
    return (
      <Layout full noPadding>
        <div className="min-h-screen bg-[#1f1f21] flex items-center justify-center">
          <div className="text-[#FFF7DC] text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFF7DC] mx-auto mb-4"></div>
            <p className="avant text-lg">Loading {collectionSlug}...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const heroImages = getHeroImages();
  const collectionName = getCollectionName();

  return (
    <Layout full noPadding>
      {/* ===== Hero Section ===== */}
      <section
        id="hero"
        className="relative w-full h-[380px] sm:h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-black"
      >
        <div
          className="flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {heroImages.map((image, index) => (
            <picture key={index} className="flex-shrink-0 w-full h-full">
              <img
                src={image.src}
                alt={`Burvon ${collectionName} collection ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </picture>
          ))}
        </div>
        {/* Dots navigation */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
          {heroImages.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full border border-[#FFF7DC] ${
                index === currentIndex
                  ? "bg-[#FFF7DC]"
                  : "bg-gray-400 opacity-40"
              } transition-colors duration-300 cursor-pointer`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* ===== Collection Section: Filters ===== */}
      <section className="bg-[#1f1f21] text-[#FFF7DC] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold bebas mb-0 flex-shrink-0">
            {collectionName}
          </h2>
          
          {/* FilterComponent */}
          <FilterComponent
            collectionOptions={collectionOptions}
            sortOptions={sortOptions}
            showCategoryFilter={true}
            categoryOptions={getCategoryOptions()}
            collectionValue={collectionValue}
            categoryValue={categoryValue}
            sortValue={sortValue}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceMin={0}
            priceMax={10000}
            onCollectionChange={handleCollectionChange}
            onCategoryChange={setCategoryValue}
            onSortChange={handleSortChange}
            onPriceChange={handlePriceChange}
            mobileFilterOpen={mobileFilterOpen}
            setMobileFilterOpen={setMobileFilterOpen}
            showMobileCollection={showMobileCollection}
            setShowMobileCollection={setShowMobileCollection}
            showMobileSort={showMobileSort}
            setShowMobileSort={setShowMobileSort}
            showMobileCategory={showMobileCategory}
            setShowMobileCategory={setShowMobileCategory}
          />
          </div>
          
        {/* Mobile filter modal is now handled by FilterComponent */}
      </section>

      {/* ===== ALL PRODUCTS GRID ===== */}
      <section className="bg-[#1f1f21] pt-1 pb-14 px-4">
        <div className="max-w-7xl mx-auto px-0">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-[#FFF7DC] text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFF7DC] mx-auto mb-4"></div>
                <p className="avant text-lg">Loading products...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-[#FFF7DC] text-center">
                <p className="avant text-lg mb-2">No products found</p>
                <p className="avant text-sm opacity-70">
                  This collection doesn't have any products yet.
                </p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && filteredProducts.length > 0 && (
            <>
              {/* MOBILE Version */}
              <div className="grid grid-cols-2 gap-4 md:hidden items-stretch">
                {filteredProducts.map((item) => (
                  <ProductCard key={item.id} item={item} layout="mobile" />
                ))}
              </div>

              {/* DESKTOP/TABLET Version */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {filteredProducts.map((item) => {
                  const isHovered = hoveredCardId === item.id;
                  const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
                  return (
                    <ProductCard
                      key={item.id}
                      item={item}
                      layout="desktop"
                      isHovered={isHovered}
                      currentImageIndex={currentImageIndex}
                      onMouseEnter={() => {
                        setHoveredCardId(item.id);
                        setHoveredImageIndexes((prev) => ({
                          ...prev,
                          [item.id]: 0,
                        }));
                      }}
                      onMouseLeave={() => {
                        setHoveredCardId(null);
                        setHoveredButtonId(null);
                      }}
                      onImageChange={handleImageChange}
                      hoveredButtonId={hoveredButtonId}
                      setHoveredButtonId={setHoveredButtonId}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== COLLECTION HIGHLIGHTS Section ===== */}
      {collectionContent && (
        <section className="relative w-full min-h-[400px] bg-black">
          {/* Desktop Version */}
          <div className="max-w-7xl mx-auto hidden lg:flex flex-col lg:flex-row items-center gap-12 px-6 py-16">
            <div className="flex-1">
              <img
                src={getPromoImage()}
                alt={`${collectionName} Collection Highlight`}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex-1 text-[#FFF7DC] pl-8 md:pl-16 lg:pl-24">
              <h2 className="text-2xl lg:text-5xl font-bold bebas tracking-wide mb-4">
                {collectionContent.title?.toUpperCase() ||
                  `${collectionName} COLLECTION HIGHLIGHTS`}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[#fff7dc] opacity-90 avant leading-snug mb-6">
                {collectionContent.description ||
                  `Experience the elegance of the ${
                    currentCollection?.name || collectionName
                  } Collection.`}
              </p>
              <button
                className="px-6 py-3 border border-[#FFF7DC] text-[#FFF7DC] 
                  hover:bg-[#FFF7DC] hover:text-[#1f1f21] 
                  avant tracking-wide rounded transition-all"
              >
                SHOP NOW
              </button>
            </div>
          </div>
          {/* MOBILE Version */}
          <div className="lg:hidden absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={getPromoImage()}
              alt={`${collectionName} Collection Highlight`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center top" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#FFF7DC] px-6">
              <h2 className="text-3xl font-bold bebas tracking-wide mb-2 drop-shadow">
                {collectionContent.title?.toUpperCase() ||
                  `${collectionName} COLLECTION HIGHLIGHTS`}
              </h2>
              <p className="text-sm avant leading-snug mb-3 max-w-md drop-shadow">
                {collectionContent.description ||
                  `Experience the elegance of the ${
                    currentCollection?.name || collectionName
                  } Collection.`}
              </p>
              <button
                className="px-6 py-3 border border-[#FFF7DC] text-[#FFF7DC] 
                  hover:bg-[#FFF7DC] hover:text-[#1f1f21] 
                  avant tracking-wide rounded transition-all"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===== TOP PICKS COLLECTION ===== */}
      <section className="bg-[#1f1f21] py-14">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-between items-center pb-8">
            <h2 className="font-bold bebas text-3xl lg:text-5xl tracking-wide text-[#FFF7DC]">
              TOP PICKS {collectionName}
            </h2>
            {!isMobile ? (
              <div className="flex space-x-4">
                <div
                  onClick={handlePrev}
                  role="button"
                  tabIndex={0}
                  aria-label="Previous Picks"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    !canPrev ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={PrevIcon}
                    alt="Previous"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </div>
                <div
                  onClick={handleNext}
                  role="button"
                  tabIndex={0}
                  aria-label="Next Picks"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    !canNext ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={NextIcon}
                    alt="Next"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* MOBILE Carousel */}
          {isMobile && (
            <div
              className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory flex-nowrap md:grid md:grid-cols-4 md:gap-5 md:overflow-visible"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {topPicksProducts.map((item) => (
                <div
                  key={`top-pick-${item.id}`}
                  className="relative bg-[#222] flex-shrink-0 transition-all duration-300 ease-in-out snap-center"
                  style={{
                    width: "65vw",
                    margin: "0 6px",
                  }}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-[260px] flex items-center justify-center overflow-hidden bg-black">
                    {/* Overlay Icons */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                      <img
                        src={TryOnIcon}
                        alt="Try On"
                        className="w-6 h-6 cursor-pointer hover:opacity-80"
                        draggable={false}
                      />
                      <img
                        src={AddFavorite}
                        alt="Favorite"
                        className="w-6 h-6 cursor-pointer hover:opacity-80"
                        draggable={false}
                      />
                    </div>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="object-cover w-full h-full"
                      draggable={false}
                    />
                  </div>
                  {/* Text + Price */}
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #000000 46%, #666666 100%)",
                    }}
                    className="py-3 px-2 text-center flex flex-col items-center"
                  >
                    <span className="uppercase text-[#FFF7DC] tracking-widest text-sm avantbold">
                      {item.name}
                    </span>
                    <span className="text-xs tracking-widest text-[#FFF7DC] avant mt-1">
                      {item.collection}
                    </span>
                    <div className="flex justify-center items-center gap-2 text-sm avantbold mt-1">
                      <span className="line-through text-[#FFF7DC] opacity-50">
                        {item.oldPrice}
                      </span>
                      <span className="text-[#FFF7DC]">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DESKTOP GRID */}
          {!isMobile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {topPicksProducts
                .slice(carouselIndex, carouselIndex + maxVisible)
                .map((item) => {
                  const isHovered = hoveredCardId === item.id;
                  const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
                  return (
                    <div
                      key={`top-pick-${item.id}`}
                      onMouseEnter={() => {
                        setHoveredCardId(item.id);
                        setHoveredImageIndexes((prev) => ({
                          ...prev,
                          [item.id]: 0,
                        }));
                      }}
                      onMouseLeave={() => {
                        setHoveredCardId(null);
                        setHoveredButtonId(null);
                      }}
                      className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                        isHovered ? "scale-105 z-10" : ""
                      }`}
                      style={{
                        height: isHovered ? "440px" : "375px",
                        transition: "height 0.3s ease, transform 0.3s ease",
                      }}
                    >
                      {/* Top icons */}
                      <div className="w-full flex justify-between items-center px-6 pt-3 absolute top-0 left-0 z-10">
                        <img
                          src={TryOnIcon}
                          alt="Try On"
                          className="w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                        <img
                          src={AddFavorite}
                          alt="Favorite"
                          className="w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                      </div>
                      {/* Product Image */}
                      <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                        <img
                          src={
                            isHovered
                              ? item.images[currentImageIndex]
                              : item.images[0]
                          }
                          alt={item.name}
                          className="object-cover w-full h-full rounded-none transition-all duration-300"
                          draggable={false}
                        />
                        {isHovered && item.images.length > 1 && (
                          <>
                            <img
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageChange(item.id, "prev");
                              }}
                              src={PrevIcon}
                              alt="Previous"
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                              draggable={false}
                            />
                            <img
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageChange(item.id, "next");
                              }}
                              src={NextIcon}
                              alt="Next"
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                              draggable={false}
                            />
                          </>
                        )}
                      </div>
                      {/* Text + Price + Button */}
                      <div
                        style={{
                          background:
                            "linear-gradient(90deg, #000000 46%, #666666 100%)",
                        }}
                        className="relative py-2 px-2 text-center flex flex-col items-center rounded-none min-h-[140px]"
                      >
                        <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                          {item.name}
                        </span>
                        <span className="text-[13px] tracking-widest text-[#FFF7DC] avant">
                          {item.collection}
                        </span>
                        <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
                          <span className="line-through text-[#FFF7DC] opacity-50">
                            {item.oldPrice}
                          </span>
                          <span className="text-[#FFF7DC]">{item.price}</span>
                        </div>
                        {isHovered && (
                          <button
                            style={{
                              backgroundColor:
                                hoveredButtonId === item.id
                                  ? "#FFF7DC"
                                  : "transparent",
                              color:
                                hoveredButtonId === item.id
                                  ? "#1F1F21"
                                  : "#FFF7DC",
                              outline: "2px solid #FFF7DC",
                              borderRadius: 5,
                            }}
                            onMouseEnter={() => setHoveredButtonId(item.id)}
                            onMouseLeave={() => setHoveredButtonId(null)}
                            className="mt-4 w-full flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-5 transition-all duration-300"
                          >
                            <img
                              src={
                                hoveredButtonId === item.id
                                  ? AddBagHover
                                  : AddBag
                              }
                              alt="Bag Icon"
                              className="w-4 h-4"
                            />
                            ADD TO BAG
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CollectionPage;
