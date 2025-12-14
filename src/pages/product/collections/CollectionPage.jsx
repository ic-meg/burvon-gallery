import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import ProductCard from "../../../components/ProductCard";
import FilterComponent from "../../../components/FilterComponent";
import CollectionPageSkeleton from "../../../components/CollectionPageSkeleton";
import TopPicks from "../../../components/TopPicks";
import { useCollection } from "../../../contexts/CollectionContext";
import { useProduct } from "../../../contexts/ProductContext";

import {
  KidsCollHeroNeck,
  ClashCollHeroNeck,
  DropDownIcon,
  DropUpIcon,
  KidsCollHighNeckCrop,
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

  // Calculate dynamic price range from actual products
  const dynamicPriceRange = React.useMemo(() => {
    const sourceProducts = rawProducts.length > 0 ? rawProducts : collectionProducts;

    if (sourceProducts.length === 0) {
      return { min: 0, max: 10000 };
    }

    const prices = sourceProducts
      .map(p => {
        const price = parseFloat(
          p.current_price?.replace?.(/[^\d.]/g, "") ||
          p.price?.replace?.(/[^\d.]/g, "") ||
          0
        );
        return price;
      })
      .filter(p => p > 0);

    if (prices.length === 0) {
      return { min: 0, max: 10000 };
    }

    const maxProductPrice = Math.max(...prices);
    // Round up to nearest 1000 for cleaner slider values
    const roundedMax = Math.ceil(maxProductPrice / 1000) * 1000;

    return {
      min: 0,
      max: Math.max(roundedMax, 2000) // Ensure at least 2000 as max
    };
  }, [rawProducts, collectionProducts]);

  // Update maxPrice when dynamic range changes (only on initial load)
  useEffect(() => {
    if ((rawProducts.length > 0 || collectionProducts.length > 0) && maxPrice === 10000) {
      setMaxPrice(dynamicPriceRange.max);
    }
  }, [dynamicPriceRange, rawProducts.length, collectionProducts.length]);

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

    const transformedProducts = filtered.map((product) => {
      
      return {
        id: product.id || product.product_id || product._id,
        name: (product.name || "").toUpperCase() || "PRODUCT NAME",
        collection: currentCollection?.name?.toUpperCase() || "COLLECTION",
        oldPrice: (() => {
          if (product.original_price && product.current_price) {
            const cleaned = product.original_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
          }
          return "";
        })(),
        price: (() => {
          if (product.current_price) {
            const cleaned = product.current_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
          }
          if (product.price) {
            const cleaned = product.price.toString().replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
          }
          if (product.original_price && !product.current_price) {
            const cleaned = product.original_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
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
        sizeStocks: product.sizeStocks || [],
        try_on_image_path: product.try_on_image_path || null,
        category: product.category?.name || product.category || null,
        category_id: product.category_id || null,
      };
    });

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
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
          }
          return "";
        })(),
        price: (() => {
          if (product.current_price) {
            const cleaned = product.current_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
          }
          if (product.price) {
            const cleaned = product.price.toString().replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
          }
          if (product.original_price && !product.current_price) {
            const cleaned = product.original_price
              .toString()
              .replace(/[^\d.]/g, "");
            const parsed = parseFloat(cleaned);
            return !isNaN(parsed) && parsed > 0 ? `PHP${parsed.toFixed(2)}` : "";
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
        sizeStocks: product.sizeStocks || [],
        try_on_image_path: product.try_on_image_path || null,
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
        // console.error("Error loading collection data:", error);

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
      const contentApiBase = import.meta.env.VITE_COLLECTION_CONTENT_API;
      if (!contentApiBase) {
        setCollectionContent(null);
        return;
      }

      const slug = collectionName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const apiUrl = `${contentApiBase}${slug}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (response.ok) {
        const contentData = await response.json();
        
        let promoImages = contentData.promo_images;
        if (typeof promoImages === "string") {
          try {
            promoImages = JSON.parse(promoImages);
          } catch (e) {
            promoImages = [];
          }
        }

        let collectionImages = contentData.collection_image;
        if (typeof collectionImages === "string") {
          try {
            collectionImages = JSON.parse(collectionImages);
          } catch (e) {
            collectionImages = [];
          }
        }

        const parsedContentData = {
          ...contentData,
          promo_images: Array.isArray(promoImages) ? promoImages : [],
          collection_image: Array.isArray(collectionImages) ? collectionImages : [],
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

      if (collectionId && fetchProductsByCollection) {
        try {
          fetched = await fetchProductsByCollection(collectionId);
          
           
          if (fetched && fetched.length > 0) {
          } else {
          }
        } catch (error) {
          // console.error(
          //   `Error fetching products for collection ${collectionId}:`,
          //   error
          // );
          fetched = [];
        }
      } else {
        if (contextFetchAllProducts) {
          await contextFetchAllProducts();
          fetched = Array.isArray(products) ? products : [];
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
                ? `PHP${parsed.toFixed(2)}`
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
                ? `PHP${parsed.toFixed(2)}`
                : "";
            }
            if (product.price) {
              const cleaned = product.price.toString().replace(/[^\d.]/g, "");
              const parsed = parseFloat(cleaned);
              return !isNaN(parsed) && parsed > 0
                ? `PHP${parsed.toFixed(2)}`
                : "";
            }
            if (product.original_price && !product.current_price) {
              const cleaned = product.original_price
                .toString()
                .replace(/[^\d.]/g, "");
              const parsed = parseFloat(cleaned);
              return !isNaN(parsed) && parsed > 0
                ? `PHP${parsed.toFixed(2)}`
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
          sizeStocks: product.sizeStocks || [],
          try_on_image_path: product.try_on_image_path || null,
        }));

        setCollectionProducts(transformedProducts);
        return;
      }

      setRawProducts([]);
      setCollectionProducts([]);
    } catch (error) {
      // console.error("Error loading products:", error);
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
      const validImages = collectionContent.collection_image
        .filter(img => img && typeof img === 'string' && img.trim().length > 0 && !img.includes('undefined'))
        .map((img) => ({ src: img }));
      
      if (validImages.length > 0) {
        return validImages;
      }
    }
    
    if (currentCollection?.collection_image && 
        typeof currentCollection.collection_image === 'string' && 
        currentCollection.collection_image.trim().length > 0 &&
        !currentCollection.collection_image.includes('undefined') &&
        !currentCollection.collection_image.includes('placeholder')) {
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
      const validPromoImage = collectionContent.promo_images.find(img => 
        img && typeof img === 'string' && img.trim().length > 0 && !img.includes('undefined')
      );
      if (validPromoImage) {
        return validPromoImage;
      }
    }
    
    if (collectionContent?.promo_image && 
        typeof collectionContent.promo_image === 'string' && 
        collectionContent.promo_image.trim().length > 0 &&
        !collectionContent.promo_image.includes('undefined')) {
      return collectionContent.promo_image;
    }
    
    return KidsCollHighNeckCrop;
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



  // Show skeleton only on initial load when we don't have data yet
  // Check if we have any data to display
  const hasAnyData = 
    currentCollection !== null ||
    collectionProducts.length > 0 ||
    filteredProducts.length > 0 ||
    rawProducts.length > 0 ||
    collectionContent !== null;

  // Only show skeleton if we're loading AND don't have any data yet
  const isInitialLoad = (loading || collectionsLoading) && !hasAnyData;

  if (isInitialLoad) {
    return (
      <Layout full noPadding>
        <CollectionPageSkeleton />
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
                onError={(e) => {
                  if (e.target.src !== fallbackHeroImages[0].src) {
                    e.target.src = fallbackHeroImages[0].src;
                  }
                }}
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
            priceMin={dynamicPriceRange.min}
            priceMax={dynamicPriceRange.max}
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
          {/* Empty State */}
          {filteredProducts.length === 0 && (
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
          {filteredProducts.length > 0 && (
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
                onError={(e) => {
                  if (e.target.src !== KidsCollHighNeckCrop) {
                    e.target.src = KidsCollHighNeckCrop;
                  }
                }}
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
              onError={(e) => {
                if (e.target.src !== KidsCollHighNeckCrop) {
                  e.target.src = KidsCollHighNeckCrop;
                }
              }}
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
      <TopPicks
        collectionId={currentCollection?.collection_id || currentCollection?.id}
        title={`TOP PICKS ${collectionName}`}
        limit={8}
        maxVisible={4}
      />
    </Layout>
  );
};

export default CollectionPage;
