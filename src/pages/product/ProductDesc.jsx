import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import ProductDescSkeleton from "../../components/ProductDescSkeleton";
import { useProduct } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi";
import Toast from "../../components/Toast";
import { hasTryOnAvailable } from "../../utils/tryOnUtils";
import { getProductReviews } from "../../api/reviewApi";

import {
  TryOnBlack,
  TryOnIcon,
  AddFavorite,
  AddedFavorites,
  MinusIcon,
  PlusIcon,
  PrevIcon,
  NextIcon,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  ClashCollHeroNeck,
  StarFilled,
  StarEmpty,
  AddBag,
  AddBagHover,
  Ruler,
  Icon3D,
} from "../../assets/index.js";

import ProductReviewsCarousel from "../../components/ProductReviewsCarousel";
import YouMayAlsoLike from "../../components/YouMayAlsoLike";
import ThreePage from "../../components/3Dcomponents/ThreePage.jsx";
import ProductMain from "../../components/ProductMain";

const fallbackImages = [
  ClashCollHeroNeck,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
];

const ProductDesc = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();

  const { products } = useProduct();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [has3DBeenViewed, setHas3DBeenViewed] = useState(false);
  const [env3DError, setEnv3DError] = useState(false);
  const [productReviews, setProductReviews] = useState([]);

  const scrollRef = useRef(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // You May Also Like carousel states
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});

  // Touch/swipe functionality for product images
  const imageRef = useRef(null);
  const [imageTouch, setImageTouch] = useState({
    startX: 0,
    startY: 0,
    startTime: 0,
  });

  // Touch/swipe functionality for reviews
  const [reviewsTouch, setReviewsTouch] = useState({
    startX: 0,
    startY: 0,
    startTime: 0,
  });

  // Image zoom state (in-place zoom, not modal)
  const [zoomTransform, setZoomTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [hasPanned, setHasPanned] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productSlug) return;
      setLoading(true);

      try {
        const result = await productApi.fetchProductBySlug(productSlug);

        let productData = result;
        if (result && result.data) productData = result.data;
        if (productData && productData.data) productData = productData.data;
        if (result.error) {
          const nameOnly = productSlug.split("-").pop();

          try {
            const altResult = await productApi.fetchProductBySlug(nameOnly);

            if (!altResult.error) {
              let altProductData = altResult;
              if (altResult && altResult.data) altProductData = altResult.data;
              if (altProductData && altProductData.data)
                altProductData = altProductData.data;

              const formatted = formatProductData(altProductData);
              setProduct(formatted);
              setQuantity(1);

              setSelectedSize(null);
              return;
            }
          } catch (altErr) {
            console.error(
              "[ProductDesc] Alternative slug also failed:",
              altErr
            );
          }

          setError(result.error || "Failed to fetch product");
        } else {
          const formatted = formatProductData(productData);
          setProduct(formatted);
          setQuantity(1);

          setSelectedSize(null);
        }
      } catch (err) {
        console.error("Fetch product error", err);
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productSlug]);

  // Sync isFavorited state with wishlist when product loads
  useEffect(() => {
    if (product && product.id) {
      setIsFavorited(isInWishlist(product.id));
    }
  }, [product?.id, isInWishlist]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryApi.fetchAllCategories();
        if (!result.error && result.data) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error("Fetch categories error", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product || !product.category) {

        return;
      }

      try {
        // Get the category slug from the product
        const categorySlug = product.category?.slug || product.categorySlug || product.category;

        if (!categorySlug) {
    
          return;
        }

     
        const result = await productApi.fetchProductsByCategory(categorySlug);
     
        if (!result.error && result.data) {
          let categoryProducts = result.data;

          if (Array.isArray(categoryProducts)) {
           
            const filtered = categoryProducts.filter(p => {
              const isSame = String(p.id) === String(product.id);
              return !isSame;
            });

        
            setRelatedProducts(filtered.slice(0, 8));
          } else if (categoryProducts.products && Array.isArray(categoryProducts.products)) {
         

            const filtered = categoryProducts.products.filter(p => {
              // Check both id and product_id fields
              const productIdToCheck = p.product_id || p.id;
              const isSame = String(productIdToCheck) === String(product.id);
              return !isSame;
            });

            setRelatedProducts(filtered.slice(0, 8));
          } else {
          }
        } else {
        }
      } catch (err) {
        console.error("Fetch related products error", err);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Fetch product reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (product?.id) {
        const result = await getProductReviews(product.id, 'APPROVED');
        if (!result.error && result.data) {
          const formattedReviews = result.data.map(review => ({
            id: review.review_id,
            name: review.show_username && review.user?.full_name
              ? review.user.full_name
              : 'Anonymous',
            collection: product.collection || product.collectionName || '',
            rating: review.rating,
            comment: review.review_text || '',
            images: review.images || []
          }));
          setProductReviews(formattedReviews);
        }
      }
    };

    fetchReviews();
  }, [product?.id, product?.collection, product?.collectionName]);

  const generateSlug = (name, collectionName) => {
    if (!name) return "unnamed-product";
    const fullName = collectionName ? `${collectionName}-${name}` : name;
    return fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const formatProductData = (productData) => {
    if (!productData) return null;

    const productName = productData.name || "Unnamed Product";
    const collectionName = productData.collection?.name || null;

    const getCategoryName = (categoryId) => {
      if (!categoryId || !categories.length)
        return productData.category?.name || productData.category || null;
      const foundCategory = categories.find(
        (cat) => cat.category_id === categoryId
      );
      const categoryName = foundCategory
        ? foundCategory.name
        : productData.category?.name || productData.category || null;

      return categoryName
        ? categoryName.replace(/\s+Collection$/i, "")
        : categoryName;
    };

    return {
      id: productData.product_id || productData.id,
      slug: productData.slug || generateSlug(productName, collectionName),
      name: productName,
      collectionName: collectionName ? ` ${collectionName}: ` : productName,
      description: productData.description || "No description available.",
      oldPrice: productData.original_price
        ? `PHP${parseFloat(productData.original_price).toFixed(2)}`
        : null,
      newPrice:
        productData.current_price &&
          productData.current_price !== "null" &&
          productData.current_price !== null
          ? `PHP${parseFloat(productData.current_price).toFixed(2)}`
          : null,
      price:
        productData.current_price &&
          productData.current_price !== "null" &&
          productData.current_price !== null
          ? `PHP${parseFloat(productData.current_price).toFixed(2)}`
          : productData.original_price &&
            productData.original_price !== "null" &&
            productData.original_price !== null
            ? `PHP${parseFloat(productData.original_price).toFixed(2)}`
            : "PHP0.00",
      stock: productData.stock || 0,
      images:
        Array.isArray(productData.images) && productData.images.length > 0
          ? productData.images
          : fallbackImages,
      sizes: (() => {
        if (
          productData.sizes &&
          typeof productData.sizes === "string" &&
          productData.sizes.trim() !== ""
        ) {
          return productData.sizes
            .split(",")
            .map((s) => parseInt(s.trim()))
            .filter((s) => !isNaN(s));
        }
        if (
          productData.sizeStocks &&
          Array.isArray(productData.sizeStocks) &&
          productData.sizeStocks.length > 0
        ) {
          return productData.sizeStocks
            .map((sizeStock) => {
              const sizeMatch = sizeStock.size?.match(/\d+/);
              return sizeMatch ? parseInt(sizeMatch[0]) : null;
            })
            .filter((size) => size !== null)
            .sort((a, b) => a - b);
        }
        return [];
      })(),
      reviews: [],
      sizeStocks: productData.sizeStocks || [],
      category_id: productData.category_id || null,
      collection:
        productData.collection?.name || productData.collection || null,
      category: getCategoryName(productData.category_id),
    };
  };

  const formattedProduct = product ? { ...product, reviews: productReviews } : null;

  const getModelPathForProduct = (p) => {
    if (!p || !p.name) return null;

    const name = p.name
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    return `/models/${name}.glb`;
  };

  const productModelPath = getModelPathForProduct(formattedProduct);
  const [modelAvailable, setModelAvailable] = useState(false);
  const [resolvedModelPath, setResolvedModelPath] = useState(null);

  useEffect(() => {

    let cancelled = false;

    const makeCandidates = (p) => {
      if (!p || !p.name) return [];
      const raw = p.name.toString().trim();
      const slug = raw
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      const capitalized = slug
        ? slug.charAt(0).toUpperCase() + slug.slice(1)
        : slug;
      const originalNoSpaces = raw.replace(/\s+/g, "");
      const originalHyphen = raw.replace(/\s+/g, "-");

      // Get category name for category-specific paths
      const categoryName = p.category || '';

      // Base paths without category
      const basePaths = [
        `/models/${slug}.glb`,
        `/models/${capitalized}.glb`,
        `/models/${originalNoSpaces}.glb`,
        `/models/${originalHyphen}.glb`,
        `/models/${raw}.glb`,
      ];

      // Category-specific paths
      const categoryPaths = categoryName ? [
        `/models/${categoryName}/${slug}.glb`,
        `/models/${categoryName}/${capitalized}.glb`,
        `/models/${categoryName}/${originalNoSpaces}.glb`,
        `/models/${categoryName}/${originalHyphen}.glb`,
        `/models/${categoryName}/${raw}.glb`,
      ] : [];

      const uniq = Array.from(
        new Set(
          [...categoryPaths, ...basePaths].filter(Boolean)
        )
      );

      return uniq;
    };

    const candidates = makeCandidates(formattedProduct);
    if (!candidates || candidates.length === 0) {
      setModelAvailable(false);
      setResolvedModelPath(null);
      return;
    }

    const checkCandidates = async () => {
      for (const candidate of candidates) {
        if (cancelled) return;
        try {
          const resHead = await fetch(candidate, { method: "HEAD" });
          const ctHead = resHead.headers.get("content-type") || "";

          if (resHead.ok && !/text\/html/i.test(ctHead)) {
            if (!cancelled) {
              setResolvedModelPath(candidate);
              setModelAvailable(true);
            }
            return;
          }
          try {
            const resGet = await fetch(candidate, {
              method: "GET",
              cache: "no-store",
            });
            const ctGet = resGet.headers.get("content-type") || "";
            // Reject HTML responses (index.html) — accept binary/model content types
            if (resGet.ok && !/text\/html/i.test(ctGet)) {
              if (!cancelled) {
                setResolvedModelPath(candidate);
                setModelAvailable(true);
              }
              return;
            } else {
              console.debug(
                "Model probe rejected (HTML or non-GLB):",
                candidate,
                ctGet,
                resGet.status
              );
            }
          } catch (errGet) {
            console.debug("Model probe GET failed:", candidate, errGet);
          }
        } catch (errHead) {
          // HEAD failed — try GET as a fallback and check content-type
          try {
            const resGet2 = await fetch(candidate, {
              method: "GET",
              cache: "no-store",
            });
            const ctGet2 = resGet2.headers.get("content-type") || "";
            if (resGet2.ok && !/text\/html/i.test(ctGet2)) {
              if (!cancelled) {
                setResolvedModelPath(candidate);
                setModelAvailable(true);
              }
              return;
            } else {

              console.debug(
                "Model probe fallback GET rejected:",
                candidate,
                ctGet2,
                resGet2.status
              );
            }
          } catch (_err) {
            // ignore and continue
          }
        }
      }

      if (!cancelled) {
        setResolvedModelPath(null);
        setModelAvailable(false);
      }
    };

    checkCandidates();

    return () => {
      cancelled = true;
    };
  }, [productModelPath, formattedProduct]);

  const calculateOverallRating = () => {
    if (!formattedProduct?.reviews || formattedProduct.reviews.length === 0)
      return 0;
    const totalRating = formattedProduct.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (totalRating / formattedProduct.reviews.length).toFixed(1);
  };

  const overallRating = calculateOverallRating();
  const reviewCount = formattedProduct?.reviews?.length || 0;

  const formatRelatedProduct = (productData) => ({
    id: productData.product_id || productData.id,
    name: productData.name || "Unnamed Product",
    collection: productData.collection?.name?.toUpperCase() || "COLLECTION",
    oldPrice: productData.original_price
      ? `PHP${parseFloat(productData.original_price).toFixed(2)}`
      : null,
    price: productData.current_price
      ? `PHP${parseFloat(productData.current_price).toFixed(2)}`
      : productData.original_price
        ? `PHP${parseFloat(productData.original_price).toFixed(2)}`
        : "PHP0.00",
    images:
      Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : fallbackImages.slice(0, 2),
    // Include all necessary fields for ProductCard
    stock: productData.stock || 0,
    category: productData.category?.name || productData.category || "",
    category_id: productData.category_id || productData.category?.id,
    sizeStocks: productData.sizeStocks || [],
    variant: productData.variant || null,
    slug: productData.slug || null,
  });

  const youMayAlsoLike = relatedProducts.map(formatRelatedProduct);

  // You May Also Like carousel logic
  const maxVisible = 4;
  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex < youMayAlsoLike.length - maxVisible;

  const handlePrev = () => {
    if (canPrev) setCarouselIndex(carouselIndex - 1);
  };

  const handleNext = () => {
    if (canNext) setCarouselIndex(carouselIndex + 1);
  };

  const handleImageChange = (cardId, direction) => {
    const card = youMayAlsoLike.find((item) => item.id === cardId);
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

  const onScrollReviews = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = scrollRef.current.offsetWidth;
    const index = Math.round(scrollLeft / (containerWidth * 0.85));
    setCurrentReviewIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScrollReviews);
    onScrollReviews();
    return () => el.removeEventListener("scroll", onScrollReviews);
  }, []);

  // Image swipe handlers
  const handleImageTouchStart = (e) => {
    const touch = e.touches[0];
    setImageTouch({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    });
  };

  const handleImageTouchMove = () => {
    // Don't call preventDefault on passive events to avoid warnings
  };

  const handleImageTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - imageTouch.startX;
    const deltaY = endY - imageTouch.startY;
    const deltaTime = Date.now() - imageTouch.startTime;

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 50 &&
      deltaTime < 300
    ) {
      if (deltaX > 0) {
        handlePrevImage();
      } else {
        handleNextImage();
      }
    }
  };

  // Reviews swipe handlers
  const handleReviewsTouchStart = (e) => {
    const touch = e.touches[0];
    setReviewsTouch({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    });
  };

  const handleReviewsTouchMove = (e) => {
    // allow default scroll
  };

  const handleReviewsTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - reviewsTouch.startX;
    const deltaY = endY - reviewsTouch.startY;
    const deltaTime = Date.now() - reviewsTouch.startTime;

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 50 &&
      deltaTime < 300
    ) {
      if (deltaX > 0) {
        scrollLeft();
      } else {
        scrollRight();
      }
    }
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const handlePrevImage = () => {
    const imageCount =
      formattedProduct?.images?.length || fallbackImages.length;
    setShow3D(false);
    setHas3DBeenViewed(false);
    setZoomTransform({ scale: 1, x: 0, y: 0 });
    setPanOffset({ x: 0, y: 0 });
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const imageCount =
      formattedProduct?.images?.length || fallbackImages.length;
    setShow3D(false);
    setHas3DBeenViewed(false);
    setZoomTransform({ scale: 1, x: 0, y: 0 });
    setPanOffset({ x: 0, y: 0 });
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setShow3D(false);
    setHas3DBeenViewed(false);
    setZoomTransform({ scale: 1, x: 0, y: 0 });
    setPanOffset({ x: 0, y: 0 });
    setCurrentImageIndex(index);
  };

  const handle3DButtonClick = () => {
    if (has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name)) {
      // Navigate to try-on page with the specific product and category
      const category = formattedProduct.category || product?.category || "";
      const productName = formattedProduct.name || product?.name || "";
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (productName) params.set("product", productName);
      navigate(`/tryon?${params.toString()}`);
    } else {
      // Show the 3D model
      setShow3D(true);
      setHas3DBeenViewed(true);
    }
  };

  const handleQuantityChange = (action) => {
    const maxStock =
      formattedProduct?.sizeStocks?.length > 0
        ? getSelectedSizeStock()
        : getAvailableStock();
    if (action === "increase" && quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getAvailableStock = () => {
    if (!formattedProduct) return 0;
    if (formattedProduct.sizeStocks && formattedProduct.sizeStocks.length > 0) {
      return formattedProduct.sizeStocks.reduce((total, sizeStock) => {
        return total + (sizeStock.stock || 0);
      }, 0);
    }
    return formattedProduct.stock || 0;
  };

  const getSelectedSizeStock = () => {
    if (!formattedProduct) return 0;
    if (formattedProduct.sizeStocks && formattedProduct.sizeStocks.length > 0) {
      const sizeStock = formattedProduct.sizeStocks.find((ss) => {
        const sizeMatch = ss.size?.match(/\d+/);
        return sizeMatch ? parseInt(sizeMatch[0]) === selectedSize : false;
      });
      return sizeStock ? sizeStock.stock : 0;
    }
    return formattedProduct.stock || 0;
  };

  const getAvailableSizes = () => {
    if (!formattedProduct) return [];
    if (formattedProduct.sizeStocks && formattedProduct.sizeStocks.length > 0) {
      return formattedProduct.sizeStocks
        .filter((ss) => ss.stock > 0)
        .map((ss) => {
          const sizeMatch = ss.size?.match(/\d+/);
          return sizeMatch ? parseInt(sizeMatch[0]) : null;
        })
        .filter((size) => size !== null)
        .sort((a, b) => a - b);
    }
    return formattedProduct.sizes || [3, 4, 5, 6, 7, 8, 9];
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1); // Reset quantity to 1 when size changes
  };

  const handleAddToCart = () => {
    if (getAvailableStock() === 0) return;

    // Check if product is a ring (has sizes) and if a size is selected
    const isRing = formattedProduct?.sizes && formattedProduct.sizes.length > 0;
    if (isRing && !selectedSize) {
      setToastMessage("Please select a size before adding to cart");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Get the size-specific stock for products with sizes
    const sizeSpecificStock = isRing ? getSelectedSizeStock() : null;

    const productData = {
      id: formattedProduct.id,
      name: formattedProduct.name,
      price: formattedProduct.price,
      images: formattedProduct.images,
      stock: formattedProduct.stock,
      collection: formattedProduct.collection,
      category: formattedProduct.category,
      category_id: formattedProduct.category_id,
    };

    addToCart(productData, quantity, selectedSize, sizeSpecificStock);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formattedProduct || !formattedProduct.id) {
      console.error("Product data not available");
      return;
    }

    const productData = {
      id: formattedProduct.id,
      name: formattedProduct.name,
      price: formattedProduct.price,
      images: formattedProduct.images,
      stock: formattedProduct.stock,
      collection: formattedProduct.collection,
      category: formattedProduct.category,
      category_id: formattedProduct.category_id,
    };

    if (isInWishlist(formattedProduct.id)) {
      removeFromWishlist(formattedProduct.id);
      setIsFavorited(false);
      // setToastMessage("Product removed from wishlist.");
      // setToastType("warning");
    } else {
      addToWishlist(productData);
      setIsFavorited(true);
      // setToastMessage("Product added to wishlist.");
      // setToastType("success");
    }
    // setShowToast(true);
  };

  // Image zoom handler - zooms in place
  const handleImageClick = (e) => {
    if (!show3D && !hasPanned) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (zoomTransform.scale === 1) {
        // Zoom in at click position
        setZoomTransform({ scale: 2, x, y });
        setPanOffset({ x: 0, y: 0 });
      } else {
        // Zoom out
        setZoomTransform({ scale: 1, x: 0, y: 0 });
        setPanOffset({ x: 0, y: 0 });
      }
    }
    // Reset pan flag after click
    setHasPanned(false);
  };

  const handleMouseDown = (e) => {
    if (zoomTransform.scale > 1) {
      e.preventDefault();
      setIsPanning(true);
      setHasPanned(false);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  };

 
  const constrainPanOffset = (newOffset, containerSize) => {
    const scale = zoomTransform.scale;

    const maxOffset = (containerSize * (scale - 1)) / 2;

    return {
      x: Math.max(-maxOffset, Math.min(maxOffset, newOffset.x)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newOffset.y))
    };
  };

  const handleMouseMove = (e) => {
    if (isPanning && zoomTransform.scale > 1 && imageRef.current) {
      e.preventDefault();
      setHasPanned(true); 

      const rect = imageRef.current.getBoundingClientRect();
      const newOffset = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      };

      const constrainedOffset = constrainPanOffset(newOffset, rect.width);
      setPanOffset(constrainedOffset);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleTouchStartPan = (e) => {
    if (zoomTransform.scale > 1) {
      const touch = e.touches[0];
      setIsPanning(true);
      setHasPanned(false);
      setPanStart({
        x: touch.clientX - panOffset.x,
        y: touch.clientY - panOffset.y
      });
    }
  };

  const handleTouchMovePan = (e) => {
    if (isPanning && zoomTransform.scale > 1 && imageRef.current) {
      const touch = e.touches[0];
      setHasPanned(true); 

      const rect = imageRef.current.getBoundingClientRect();
      const newOffset = {
        x: touch.clientX - panStart.x,
        y: touch.clientY - panStart.y
      };

     
      const constrainedOffset = constrainPanOffset(newOffset, rect.width);
      setPanOffset(constrainedOffset);
    }
  };

  const handleTouchEndPan = () => {
    setIsPanning(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i < rating ? StarFilled : StarEmpty}
        alt={i < rating ? "Filled Star" : "Empty Star"}
        className="w-4 h-4"
        draggable={false}
      />
    ));
  };

  const renderOverallStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i < Math.floor(rating) ? StarFilled : StarEmpty}
        alt={i < Math.floor(rating) ? "Filled Star" : "Empty Star"}
        className="w-5 h-5"
        draggable={false}
      />
    ));
  };

  // Check if product is Espoir for try-on feature
  // const isEspoirProduct = () => {
  //   if (!formattedProduct) return false;
  //   const productName = formattedProduct.name?.toLowerCase() || '';
  //   const collectionName = formattedProduct.collectionName?.toLowerCase() || '';
  //   return productName.includes('espoir') || collectionName.includes('love language');
  // };

  // Show skeleton only on initial load when we don't have data yet
  // Check if we have any data to display
  const hasAnyData = product !== null || formattedProduct !== null;

  // Only show skeleton if we're loading AND don't have any data yet
  const isInitialLoad = loading && !hasAnyData;

  if (isInitialLoad) {
    return (
      <Layout full noPadding>
        <ProductDescSkeleton />
      </Layout>
    );
  }

  if (error || !formattedProduct) {
    return (
      <Layout full noPadding>
        <div className="bg-[#1f1f21] text-[#FFF7DC] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl avantbold mb-4">Product Not Found</h2>
            <p className="text-lg avant">
              {error || "This product does not exist or has been removed."}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout full noPadding>
      <div className="bg-[#1f1f21] text-[#FFF7DC] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-20 lg:pt-32 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* MOBILE LAYOUT - Visible only on mobile */}
            <div className="block lg:hidden">
              {/* Mobile Image Section with Thumbnails */}
              {/* Product Image Display */}
              <div
                ref={imageRef}
                className="w-full bg-black rounded-lg overflow-hidden aspect-square select-none mb-2 relative"
                onTouchStart={(e) => {
                  if (zoomTransform.scale > 1) {
                    handleTouchStartPan(e);
                  } else {
                    handleImageTouchStart(e);
                  }
                }}
                onTouchMove={(e) => {
                  if (zoomTransform.scale > 1) {
                    handleTouchMovePan(e);
                  } else {
                    handleImageTouchMove(e);
                  }
                }}
                onTouchEnd={(e) => {
                  if (zoomTransform.scale > 1) {
                    handleTouchEndPan();
                  } else {
                    handleImageTouchEnd(e);
                  }
                }}
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Interactive 3D toggle (mobile) */}
                {modelAvailable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handle3DButtonClick();
                    }}
                    title={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try on this product" : "Click to open Interactive 3D"}
                    className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-gradient-to-r from-[#FFDFAF] to-[#FFF7DC] text-[#1f1f21] px-3 py-1 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.35)] border border-[#f1e6c9] hover:scale-105 transform transition-all duration-200 active:scale-95 cursor-pointer"
                    aria-label={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try on this product" : "Open Interactive 3D viewer"}
                  >
                    <span className="w-7 h-7 rounded-full  flex items-center justify-center shadow-inner">
                      <img src={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? TryOnBlack : Icon3D} alt={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try On" : "3D"} className="w-4 h-4" />
                    </span>
                    <span className="avantbold text-sm tracking-wide">
                      {has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try On" : "Interactive 3D"}
                    </span>
                  </button>
                )}
                {resolvedModelPath && show3D ? (
                  <div className="w-full h-full">
                    <ThreePage
                      modelPath={resolvedModelPath}
                      onEnvironmentError={() => setEnv3DError(true)}
                    />
                  </div>
                ) : (
                  <img
                    src={
                      formattedProduct?.images?.[currentImageIndex] ||
                      fallbackImages[0]
                    }
                    alt={formattedProduct?.name || ""}
                    className="w-full h-full object-cover pointer-events-auto ease-out"
                    style={{
                      transform: `translate(${panOffset.x / zoomTransform.scale}px, ${panOffset.y / zoomTransform.scale}px) scale(${zoomTransform.scale})`,
                      transformOrigin: `${zoomTransform.x}% ${zoomTransform.y}%`,
                      cursor: zoomTransform.scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
                      transition: isPanning ? 'none' : 'transform 0.3s ease-out'
                    }}
                    draggable={false}
                  />
                )}
              </div>

              {/* Thumbnails in a row below */}
              <div className="flex flex-row gap-3 mb-4">
                {(formattedProduct?.images || fallbackImages)
                  .slice(0, 4)
                  .map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-20 aspect-square bg-black rounded-lg overflow-hidden border ${currentImageIndex === index
                          ? "border-[#FFF7DC]"
                          : "border-transparent"
                        } transition-all`}
                    >
                      <img
                        src={image}
                        alt={`${formattedProduct?.name || ""} view ${index + 1
                          }`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
              </div>

              {/* Mobile Product Info */}
              <div className="space-y-4">
                {/* Product Name and Collection */}
                <div>
                  <h2 className="text-lg avantbold tracking-wide uppercase">
                    {formattedProduct.collectionName} {formattedProduct.name}
                  </h2>
                </div>

                {/* Price and Icons */}
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
                    {hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) && (
                      <button
                        onClick={() => {
                          const category = formattedProduct.category || product?.category || "";
                          const productName = formattedProduct.name || product?.name || "";
                          const params = new URLSearchParams();
                          if (category) params.set("category", category);
                          if (productName) params.set("product", productName);
                          navigate(`/tryon?${params.toString()}`);
                        }}
                        className="w-6 h-6 p-0 opacity-100 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                        aria-label="Try on this product"
                        title="Try on this product"
                      >
                        <img src={TryOnIcon} alt="Try On" className="w-full h-full object-contain" draggable={false} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddToWishlist}
                      className="relative w-6 h-6 min-w-[24px] min-h-[24px] p-0 opacity-100 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center pointer-events-auto z-10 bg-transparent"
                      style={{ cursor: 'pointer' }}
                      aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                      title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <img
                        src={isFavorited ? AddedFavorites : AddFavorite}
                        alt={
                          isFavorited
                            ? "Added to Favorites"
                            : "Add to Favorites"
                        }
                        className="w-full h-full object-contain block pointer-events-none select-none"
                        draggable={false}
                        style={{ pointerEvents: 'none' }}
                      />
                    </button>
                  </div>
                </div>

                {/* Stocks */}
                <div className="flex justify-start -mt-2">
                  <span className="text-sm text-[#959595] avantbold tracking-wider uppercase ">
                    STOCKS: {getAvailableStock()}
                  </span>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-[#FFF7DC] my-4"></div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-[#959595] avantbold tracking-wider uppercase">
                    QUANTITY
                  </span>
                  <div className="relative flex items-center justify-between bg-[#464647] bg-opacity-75 rounded-full w-[100px] h-[45px]">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1 || getAvailableStock() === 0}
                      type="button"
                      className={`flex items-center justify-center w-[24px] h-full z-20 ${
                        quantity <= 1 || getAvailableStock() === 0 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      <img src={MinusIcon} alt="Minus" className="w-2 h-2" />
                    </button>

                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-[#FFF7DC] text-[#1f1f21] rounded-full flex items-center justify-center text-sm avantbold z-30 shadow">
                      {quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={
                        getAvailableStock() === 0 ||
                        quantity >=
                        (formattedProduct?.sizeStocks?.length > 0
                          ? getSelectedSizeStock()
                          : getAvailableStock())
                      }
                      type="button"
                      className={`flex items-center justify-center w-[24px] h-full z-20 ${
                        getAvailableStock() === 0 || quantity >= (formattedProduct?.sizeStocks?.length > 0 ? getSelectedSizeStock() : getAvailableStock())
                          ? 'opacity-30 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <img src={PlusIcon} alt="Plus" className="w-2 h-2" />
                    </button>
                  </div>
                </div>

                {/* Show SIZE section only if product has sizes (e.g., rings) */}
                {formattedProduct?.sizes &&
                  formattedProduct.sizes.length > 0 && (
                    <div className="space-y-2 mb-4 top-2">
                      <span className="block text-sm text-[#959595] avantbold tracking-wider uppercase">
                        SIZE
                      </span>
                      <div className="flex gap-1.5">
                        {(() => {
                          const sizes =
                            formattedProduct?.sizes &&
                              formattedProduct.sizes.length > 0
                              ? Array.from(new Set(formattedProduct.sizes))
                                .slice()
                                .sort((a, b) => a - b)
                              : getAvailableSizes();

                          const sizeStockLookup = (
                            formattedProduct?.sizeStocks || []
                          ).reduce((acc, ss) => {
                            const m = ss.size?.match(/\d+/);
                            if (m)
                              acc[parseInt(m[0], 10)] = (ss.stock || 0) > 0;
                            return acc;
                          }, {});

                          return sizes.map((size) => {
                            const inStock =
                              sizeStockLookup[size] !== undefined
                                ? sizeStockLookup[size]
                                : true;
                            return (
                              <button
                                key={size}
                                onClick={() =>
                                  inStock && handleSizeSelect(size)
                                }
                                disabled={!inStock}
                                className={`relative w-10 h-10 rounded-md border-2 transition-all duration-200 flex items-center justify-center text-sm avantbold ${selectedSize === size
                                    ? "bg-[#FFF7DC] text-[#1f1f21] border-[#FFF7DC]"
                                    : inStock
                                      ? "bg-transparent text-[#FFF7DC] border-[#959595] hover:border-[#FFF7DC]"
                                      : "bg-[#222] text-[#6f6f6f] border-[#444] cursor-not-allowed"
                                  }`}
                              >
                                <span className="z-10">{size}</span>
                                {!inStock && (
                                  <span
                                    aria-hidden
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ pointerEvents: "none" }}
                                  >
                                    <span
                                      style={{
                                        display: "block",
                                        width: "120%",
                                        height: "2px",
                                        background: "#E5E7EB",
                                        transform: "rotate(-45deg)",
                                      }}
                                    />
                                  </span>
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>
                      
                      <button onClick={() => {
                        const params = new URLSearchParams();
                        const category = formattedProduct.category || product?.category || "";
                        const productName = formattedProduct.name || product?.name || "";
                        if (category) params.set("category", category);
                        if (productName) params.set("product", productName);
                        navigate(`/customer-care/size-guide?${params.toString()}`);
                      }} className="flex items-center gap-1.5  text-[#959595] hover:opacity-80 transition-opacity cursor-pointer">
                        <img src={Ruler} alt="Ruler" className="w-5 h-5" />
                        <span className="text-sm avantbold tracking-wider uppercase">
                          CHECK MY SIZE
                        </span>
                      </button>
                    </div>
                  )}

                {/* Add to Bag Button */}
                <button
                  disabled={getAvailableStock() === 0}
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-lg avantbold tracking-wider flex items-center justify-center gap-2 text-lg mb-6 transition-all duration-300 ${getAvailableStock() === 0
                      ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                      : "bg-[#FFF7DC] text-[#1f1f21] hover:bg-transparent hover:text-[#FFF7DC] hover:border-2 hover:border-[#FFF7DC] cursor-pointer"
                    }`}
                >
                  {getAvailableStock() === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
                </button>

                {/* Product Description */}
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
              {/* Product Images */}
              <div
                ref={imageRef}
                className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-[600px] mx-auto select-none"
                onTouchStart={(e) => {
                  if (zoomTransform.scale > 1) {
                    handleTouchStartPan(e);
                  } else {
                    handleImageTouchStart(e);
                  }
                }}
                onTouchMove={(e) => {
                  if (zoomTransform.scale > 1) {
                    handleTouchMovePan(e);
                  } else {
                    handleImageTouchMove(e);
                  }
                }}
                onTouchEnd={(e) => {
                  if (zoomTransform.scale > 1) {
                    handleTouchEndPan();
                  } else {
                    handleImageTouchEnd(e);
                  }
                }}
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Interactive 3D toggle (desktop) */}
                {modelAvailable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handle3DButtonClick();
                    }}
                    title={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try on this product" : "Click to open Interactive 3D"}
                    className="absolute top-4 right-4 z-10 cursor-pointer flex items-center gap-4 bg-gradient-to-r from-[#FFDFAF] to-[#FFF7DC] text-[#1f1f21] px-5 py-3 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-[#f1e6c9] hover:scale-105 transform transition-all duration-200 active:scale-98"
                    aria-label={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try on this product" : "Open Interactive 3D viewer"}
                  >
                    <span className="w-10 h-10 rounded-full  flex items-center justify-center shadow-inner">
                      <img src={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? TryOnBlack : Icon3D} alt={has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try On" : "3D"} className="w-5 h-5" />
                    </span>
                    <div className="text-left">
                      <div className="avantbold text-base tracking-wide">
                        {has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "Try On" : "Interactive 3D"}
                      </div>
                      <div className="text-xs text-[#6f6f6f]">
                        {has3DBeenViewed && hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) ? "View on yourself" : "Click to open"}
                      </div>
                    </div>
                  </button>
                )}
                {resolvedModelPath && show3D ? (
                  <div className="w-full h-full">
                    <ThreePage
                      modelPath={resolvedModelPath}
                      onEnvironmentError={() => setEnv3DError(true)}
                    />
                  </div>
                ) : (
                  <img
                    src={
                      formattedProduct?.images?.[currentImageIndex] ||
                      fallbackImages[0]
                    }
                    alt={formattedProduct?.name || ""}
                    className="w-full h-full object-cover pointer-events-auto ease-out"
                    style={{
                      transform: `translate(${panOffset.x / zoomTransform.scale}px, ${panOffset.y / zoomTransform.scale}px) scale(${zoomTransform.scale})`,
                      transformOrigin: `${zoomTransform.x}% ${zoomTransform.y}%`,
                      cursor: zoomTransform.scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
                      transition: isPanning ? 'none' : 'transform 0.3s ease-out'
                    }}
                    draggable={false}
                  />
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 z-50 pointer-events-auto">
                  {(formattedProduct?.images || fallbackImages)
                    .slice(0, 4)
                    .map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-2 h-2 rounded-full border border-[#FFF7DC] transition-colors duration-300 ${index === currentImageIndex
                            ? "bg-[#FFF7DC]"
                            : "bg-gray-400 opacity-40"
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleThumbnailClick(index);
                        }}
                      />
                    ))}
                </div>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-50 pointer-events-auto"
                >
                  <img src={PrevIcon} alt="Previous" className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-50 pointer-events-auto"
                >
                  <img src={NextIcon} alt="Next" className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Side - Product Info (Sticky) - Desktop Only */}
            <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start space-y-6 pt-10">
              {/* Header with Collection and Product Name */}
              <div className="flex items-start justify-between">
                <h2 className="text-3xl tracking-wide uppercase avantbold leading-none">
                  {formattedProduct.collectionName} {formattedProduct.name}
                </h2>
                <div className="flex items-center gap-3">
                  {hasTryOnAvailable(formattedProduct.category || product?.category, formattedProduct.name || product?.name) && (
                    <button
                      onClick={() => {
                        const category = formattedProduct.category || product?.category || "";
                        const productName = formattedProduct.name || product?.name || "";
                        const params = new URLSearchParams();
                        if (category) params.set("category", category);
                        if (productName) params.set("product", productName);
                        navigate(`/tryon?${params.toString()}`);
                      }}
                      className="w-8 h-8 p-0 opacity-100 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                      aria-label="Try on this product"
                      title="Try on this product"
                    >
                      <img src={TryOnIcon} alt="Try On" className="w-full h-full object-contain" draggable={false} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    className="relative w-8 h-8 min-w-[32px] min-h-[32px] p-0 opacity-100 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center pointer-events-auto z-10 bg-transparent"
                    style={{ cursor: 'pointer' }}
                    aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                    title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <img
                      src={isFavorited ? AddedFavorites : AddFavorite}
                      alt={
                        isFavorited ? "Added to Favorites" : "Add to Favorites"
                      }
                      className="w-full h-full object-contain block pointer-events-none select-none"
                      draggable={false}
                      style={{ pointerEvents: 'none' }}
                    />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                {formattedProduct.oldPrice && formattedProduct.newPrice && (
                  <span className="text-2xl text-[#959595] line-through avant">
                    {formattedProduct.oldPrice}
                  </span>
                )}
                <span className="text-4xl avant">
                  {formattedProduct.newPrice || formattedProduct.price}
                </span>
              </div>

              {/* Quantity and Size Container */}
              <div className="flex items-start gap-36">
                {/* Quantity Section */}
                <div className="w-[120px] space-y-2">
                  <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">
                    QUANTITY
                  </h3>
                  <div className="relative flex items-center justify-between bg-[#464647] bg-opacity-75 rounded-full w-full h-[40px]">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1 || getAvailableStock() === 0}
                      type="button"
                      className={`flex items-center justify-center w-[30px] h-full z-20 ${
                        quantity <= 1 || getAvailableStock() === 0 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      <img
                        src={MinusIcon}
                        alt="Minus"
                        className="w-2.5 h-2.5"
                      />
                    </button>

                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45px] h-[45px] bg-[#FFF7DC] text-[#1f1f21] rounded-full flex items-center justify-center text-lg avantbold z-30 shadow">
                      {quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={
                        getAvailableStock() === 0 ||
                        quantity >=
                        (formattedProduct?.sizeStocks?.length > 0
                          ? getSelectedSizeStock()
                          : getAvailableStock())
                      }
                      type="button"
                      className={`flex items-center justify-center w-[30px] h-full z-20 ${
                        getAvailableStock() === 0 || quantity >= (formattedProduct?.sizeStocks?.length > 0 ? getSelectedSizeStock() : getAvailableStock())
                          ? 'opacity-30 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <img src={PlusIcon} alt="Plus" className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Size Section - Show only if product has sizes (e.g., rings) */}
                {formattedProduct?.sizes &&
                  formattedProduct.sizes.length > 0 && (
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">
                        SIZE
                      </h3>
                      <div className="flex flex-nowrap gap-2 justify-start">
                        {(() => {
                          const sizes =
                            formattedProduct?.sizes &&
                              formattedProduct.sizes.length > 0
                              ? Array.from(new Set(formattedProduct.sizes))
                                .slice()
                                .sort((a, b) => a - b)
                              : getAvailableSizes();
                          const sizeStockLookup = (
                            formattedProduct?.sizeStocks || []
                          ).reduce((acc, ss) => {
                            const m = ss.size?.match(/\d+/);
                            if (m)
                              acc[parseInt(m[0], 10)] = (ss.stock || 0) > 0;
                            return acc;
                          }, {});

                          return sizes.map((size) => {
                            const inStock =
                              sizeStockLookup[size] !== undefined
                                ? sizeStockLookup[size]
                                : true;
                            return (
                              <button
                                key={size}
                                onClick={() =>
                                  inStock && handleSizeSelect(size)
                                }
                                disabled={!inStock}
                                className={`relative w-10 h-10 rounded-md border-2 transition-all duration-200 flex items-center justify-center text-lg avantbold ${selectedSize === size
                                    ? "bg-[#FFF7DC] text-[#1f1f21] border-[#FFF7DC]"
                                    : inStock
                                      ? "bg-transparent text-[#FFF7DC] border-[#959595] hover:border-[#FFF7DC]"
                                      : "bg-[#222] text-[#6f6f6f] border-[#444] cursor-not-allowed"
                                  }`}
                              >
                                <span className="z-10">{size}</span>
                                {!inStock && (
                                  <span
                                    aria-hidden
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ pointerEvents: "none" }}
                                  >
                                    <span
                                      style={{
                                        display: "block",
                                        width: "140%",
                                        height: "2px",
                                        background: "#E5E7EB",
                                        transform: "rotate(-45deg)",
                                      }}
                                    />
                                  </span>
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex flex-row items-center justify-between mt-6 mb-8">
                <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">
                  STOCKS: {getAvailableStock()}
                </h3>
                {/* Show CHECK MY SIZE button only if product has sizes */}
                {formattedProduct?.sizes &&
                  formattedProduct.sizes.length > 0 && (
                    <button onClick={() => {
                      const params = new URLSearchParams();
                      const category = formattedProduct.category || product?.category || "";
                      const productName = formattedProduct.name || product?.name || "";
                      if (category) params.set("category", category);
                      if (productName) params.set("product", productName);
                      navigate(`/customer-care/size-guide?${params.toString()}`);
                    }} className="flex items-center gap-2 text-[#959595] hover:opacity-80 transition-opacity cursor-pointer">
                      <img src={Ruler} alt="Ruler" className="w-5 h-5" />
                      <span className="text-lg avantbold tracking-wider uppercase">
                        CHECK MY SIZE
                      </span>
                    </button>
                  )}
              </div>

              {/* Product Description */}
              <div className="space-y-8 mb-10">
                {formattedProduct.description
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg text-[#FFF7DC]/90 leading-relaxed text-justify avant"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Add to Bag Button */}
              <button
                disabled={getAvailableStock() === 0}
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-lg avantbold tracking-wider flex items-center justify-center gap-3 text-2xl transition-all duration-300 ${getAvailableStock() === 0
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#FFF7DC] text-[#1f1f21] hover:bg-transparent hover:text-[#FFF7DC] hover:border-2 hover:border-[#FFF7DC] cursor-pointer"
                  }`}
              >
                {getAvailableStock() === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
              </button>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {(formattedProduct?.images || fallbackImages)
                  .slice(0, 4)
                  .map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`aspect-square bg-black rounded-lg overflow-hidden border ${currentImageIndex === index
                          ? "border-[#FFF7DC]"
                          : "border-transparent"
                        } transition-all hover:bg-[#333] hover:shadow-lg`}
                    >
                      <img
                        src={image}
                        alt={`${formattedProduct?.name || ""} view ${index + 1
                          }`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        draggable={false}
                      />
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <ProductReviewsCarousel
            formattedProduct={formattedProduct}
            overallRating={overallRating}
            reviewCount={reviewCount}
            renderStars={renderStars}
            renderOverallStars={renderOverallStars}
            scrollRef={scrollRef}
            currentReviewIndex={currentReviewIndex}
            setCurrentReviewIndex={setCurrentReviewIndex}
            handleReviewsTouchStart={handleReviewsTouchStart}
            handleReviewsTouchMove={handleReviewsTouchMove}
            handleReviewsTouchEnd={handleReviewsTouchEnd}
          />

          {youMayAlsoLike.length > 0 && (
            <YouMayAlsoLike
              youMayAlsoLike={youMayAlsoLike}
              carouselIndex={carouselIndex}
              maxVisible={maxVisible}
              handlePrev={handlePrev}
              handleNext={handleNext}
              canPrev={canPrev}
              canNext={canNext}
              TryOnIcon={TryOnIcon}
              AddFavorite={AddFavorite}
              PrevIcon={PrevIcon}
              NextIcon={NextIcon}
              AddBag={AddBag}
              AddBagHover={AddBagHover}
              hoveredCardId={hoveredCardId}
              setHoveredCardId={setHoveredCardId}
              hoveredImageIndexes={hoveredImageIndexes}
              setHoveredImageIndexes={setHoveredImageIndexes}
              handleImageChange={handleImageChange}
              hoveredButtonId={hoveredButtonId}
              setHoveredButtonId={setHoveredButtonId}
            />
          )}
        </div>
      </div>
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
        duration={3000}
      />

    </Layout>
  );
};

export default ProductDesc;
