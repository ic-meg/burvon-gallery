import React, { useState, useMemo, useEffect } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import AdminHeader from "../../components/admin/AdminHeader";
import { useProduct } from "../../contexts/ProductContext";
import { useCollection } from "../../contexts/CollectionContext";
import { useCategory } from "../../contexts/CategoryContext";

// Modal Components
import AddProductModal from "../Components/modals/AddProductModal";
import EditProductModal from "../Components/modals/EditProductModal";
import ReviewsModal from "../Components/modals/ReviewsModal";
import StockModal from "../Components/modals/StockModal";

import {
  NextIConBlack,
  PrevIConBlack,
  DropDownIconBlack,
  DropUpIconBlack,
} from "../../assets/index.js";
import storageService from "../../services/storageService";

const AdminProducts = ({ hasAccess = true, canEdit = true, isCSR = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [selectedStockLevel, setSelectedStockLevel] = useState("all");
  const [selectedSellingStatus, setSelectedSellingStatus] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [showSellingDropdown, setShowSellingDropdown] = useState(false);

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [newProduct, setNewProduct] = useState({
    name: "",
    collection_id: "",
    category: "",
    original_price: "",
    current_price: "",
    stock: "",
    sizes: [],
    images: [null, null, null, null, null],
    imageUrls: [null, null, null, null, null],
    description: "",
    model3DFile: null,
    tryOnImageFile: null,
  });
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: "",
    collection_id: "",
    category: "",
    original_price: "",
    current_price: "",
    stock: "",
    sizes: [],
    images: [null, null, null, null, null],
    imageUrls: [null, null, null, null, null],
    description: "",
    model3DFile: null,
    model3DPath: null,
    model3DUrl: null,
    tryOnImageFile: null,
    tryOnImagePath: null,
    tryOnImageUrl: null,
  });
  const [originalEditProduct, setOriginalEditProduct] = useState(null);
  const [stockData, setStockData] = useState({
    totalStock: 0,
    sizes: {
      "Size 3": { stock: 0 },
      "Size 4": { stock: 0 },
      "Size 5": { stock: 0 },
      "Size 6": { stock: 0 },
      "Size 7": { stock: 0 },
      "Size 8": { stock: 0 },
      "Size 9": { stock: 0 },
    },
    general: { stock: 0 },
  });
  // Add Product Modal dropdown states
  const [showAddModalCollectionDropdown, setShowAddModalCollectionDropdown] =
    useState(false);
  const [showAddModalCategoryDropdown, setShowAddModalCategoryDropdown] =
    useState(false);
  const [showModalCategoryDropdown, setShowModalCategoryDropdown] =
    useState(false);
  const [showEditModalCollectionDropdown, setShowEditModalCollectionDropdown] =
    useState(false);
  const [showEditModalCategoryDropdown, setShowEditModalCategoryDropdown] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
  } = useProduct();

  const { collections, fetchAllCollections } = useCollection();
  const { categories, fetchAllCategories } = useCategory();

  const itemsPerPage = 8;

  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), duration);
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Check if we have a selected collection from collection management
        const selectedCollectionData =
          sessionStorage.getItem("selectedCollection");
        if (selectedCollectionData) {
          try {
            const collectionInfo = JSON.parse(selectedCollectionData);
            // Set the collection filter to the selected collection
            setSelectedCollection(collectionInfo.id.toString());
            sessionStorage.removeItem("selectedCollection");
          } catch (error) {
            console.warn("Failed to parse selected collection data:", error);
          }
        }

        const results = await Promise.allSettled([
          fetchAllProducts(),
          fetchAllCollections(),
          fetchAllCategories(),
        ]);

        const failures = results.filter(
          (result) => result.status === "rejected"
        );
        if (failures.length > 0) {
          console.error("Some data failed to load:", failures);
          const failedServices = [];
          if (results[0].status === "rejected") failedServices.push("products");
          if (results[1].status === "rejected")
            failedServices.push("collections");
          if (results[2].status === "rejected")
            failedServices.push("categories");

          showMessage(
            "warning",
            `Failed to load: ${failedServices.join(
              ", "
            )}. Some features may not work properly.`
          );
        }

        if (failures.length === results.length) {
          showMessage(
            "error",
            "Failed to connect to server. Please check your connection and refresh the page."
          );
        }
      } catch (error) {
        showMessage(
          "error",
          "Failed to initialize application. Please refresh the page."
        );
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const validateImageFile = (file, index) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!file) return { valid: true };

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Image ${index + 1}: Only JPEG, PNG, and WebP files are allowed`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Image ${index + 1}: File size must be less than 10MB`,
      };
    }

    return { valid: true };
  };

  const uploadAllProductImages = async (imageFiles, productName) => {
    if (!imageFiles || imageFiles.length === 0) return [];

    // Validate all images first
    for (let i = 0; i < imageFiles.length; i++) {
      const validation = validateImageFile(imageFiles[i], i);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    }

    if (!productName?.trim()) {
      throw new Error("Product name is required for image upload");
    }

    setUploading(true);
    try {
      showMessage("info", "Uploading product images...");
      const uploadResults = await uploadProductImages(imageFiles, productName);

      if (!uploadResults || uploadResults.length === 0) {
        throw new Error("Image upload service returned no results");
      }

      return uploadResults;
    } catch (error) {
      const errorMessage = error.message || "Failed to upload images";
      showMessage("error", errorMessage);
      throw error;
    } finally {
      setUploading(false);
    }
  };


  const closeAllDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowCollectionDropdown(false);
    setShowStockDropdown(false);
    setShowSellingDropdown(false);
  };

  const modalCollectionOptions = useMemo(() => {
    const baseOptions = [{ value: "", label: "Select Collection" }];

    if (collections && Array.isArray(collections) && collections.length > 0) {
      const collectionOptions = collections
        .filter((collection) => {
          const collectionId = collection.collection_id || collection.id;
          return (
            collection && collectionId !== undefined && collectionId !== null
          );
        })
        .map((collection) => {
          const collectionId = collection.collection_id || collection.id;
          return {
            value: collectionId.toString(),
            label: collection.name || "Unnamed Collection",
          };
        });

      return [...baseOptions, ...collectionOptions];
    }

    return [
      ...baseOptions,
      { value: "loading", label: "Loading collections...", disabled: true },
    ];
  }, [collections]);

  const modalCategoryOptions = useMemo(() => {
    const baseOptions = [{ value: "", label: "Select Category" }];

    if (categories && typeof categories === "object") {
      const categoryArray = Array.isArray(categories)
        ? categories
        : Object.values(categories);

      if (categoryArray.length > 0) {
        const categoryOptions = categoryArray
          .filter((cat) => cat && (cat.category_id || cat.id))
          .map((cat) => ({
            value: (cat.category_id || cat.id).toString(),
            label: cat.name || cat.slug || "Unnamed Category",
            slug: cat.slug,
          }));

        return [...baseOptions, ...categoryOptions];
      }
    }
    return [
      ...baseOptions,
      { value: "1", label: "Necklaces", slug: "necklaces" },
      { value: "2", label: "Earrings", slug: "earrings" },
      { value: "3", label: "Bracelets", slug: "bracelets" },
      { value: "4", label: "Rings", slug: "rings" },
    ];
  }, [categories]);

  const sizeOptions = [
    "Size 3",
    "Size 4",
    "Size 5",
    "Size 6",
    "Size 7",
    "Size 8",
    "Size 9",
  ];

  const handleReviewsClick = (product) => {
    setSelectedProduct(product);
    setShowReviewsModal(true);
    setReviewFilter("all");
  };

  const handleProductChange = (field, value) => {
    setNewProduct((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      if (field === "category" && value !== "rings") {
        updated.sizes = [];
      }
      return updated;
    });
  };

  const handleEditProductChange = (field, value) => {
    setEditProduct((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      if (field === "category" && value !== "rings") {
        updated.sizes = [];
      }
      return updated;
    });
  };

  const handleSizeToggle = (size) => {
    setNewProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleEditSizeToggle = (size) => {
    setEditProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageUpload = (index, file) => {
    if (file) {
      const validation = validateImageFile(file, index);
      if (!validation.valid) {
        showMessage("error", validation.error);
        return;
      }
    }

    setNewProduct((prev) => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleEditImageUpload = (index, file) => {
    if (file) {
      const validation = validateImageFile(file, index);
      if (!validation.valid) {
        showMessage("error", validation.error);
        return;
      }
    }

    setEditProduct((prev) => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const [deletedImageUrls, setDeletedImageUrls] = useState([]);

  const handleRemoveEditImage = (index) => {
    setEditProduct((prev) => {
      const newImages = [...prev.images];
      const newImageUrls = [...(prev.imageUrls || [])];

      if (newImageUrls[index]) {
        setDeletedImageUrls((d) => [...d, newImageUrls[index]]);
      }
      newImages[index] = null;
      newImageUrls[index] = null;
      return { ...prev, images: newImages, imageUrls: newImageUrls };
    });
  };

  const handle3DModelUpload = (file, isEdit = false) => {
    if (!file) return;
    const validation = storageService.validate3DModelFile(file);
    if (!validation.valid) {
      showMessage("error", validation.error);
      return;
    }
    if (isEdit) {
      setEditProduct((prev) => ({ ...prev, model3DFile: file }));
    } else {
      setNewProduct((prev) => ({ ...prev, model3DFile: file }));
    }
    showMessage("success", "3D model file selected");
  };

  const handleRemove3DModel = (isEdit = false) => {
    if (isEdit) {
      setEditProduct((prev) => ({
        ...prev,
        model3DFile: null,
        model3DPath: null,
        model3DUrl: null,
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, model3DFile: null }));
    }
  };

  const handleTryOnImageUpload = (file, isEdit = false) => {
    if (!file) return;
    const validation = storageService.validateTryOnImageFile(file);
    if (!validation.valid) {
      showMessage("error", validation.error);
      return;
    }
    if (isEdit) {
      setEditProduct((prev) => ({ ...prev, tryOnImageFile: file }));
    } else {
      setNewProduct((prev) => ({ ...prev, tryOnImageFile: file }));
    }
    showMessage("success", "Try-on image selected");
  };

  const handleRemoveTryOnImage = (isEdit = false) => {
    if (isEdit) {
      setEditProduct((prev) => ({
        ...prev,
        tryOnImageFile: null,
        tryOnImagePath: null,
        tryOnImageUrl: null,
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, tryOnImageFile: null }));
    }
  };

  const handleStockClick = (product) => {
    setSelectedProduct(product);

    const categoryName =
      typeof product.category === "object" && product.category?.name
        ? product.category.name.toLowerCase()
        : typeof product.category === "string"
        ? product.category.toLowerCase()
        : "";

    if (categoryName === "rings") {
      const initialSizesStock = {};

      let productSizes = [];
      if (product.sizes && Array.isArray(product.sizes)) {
        productSizes = product.sizes;
      } else if (product.size && typeof product.size === "string") {
        productSizes = product.size
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
      }

      productSizes = productSizes.sort((a, b) => {
        const numA = parseInt(a.replace("Size ", ""));
        const numB = parseInt(b.replace("Size ", ""));
        return numA - numB;
      });

      if (productSizes.length > 0) {
        productSizes.forEach((size) => {
          if (product.sizeStocks && Array.isArray(product.sizeStocks)) {
            const sizeStock = product.sizeStocks.find((ss) => ss.size === size);
            initialSizesStock[size] = {
              stock: sizeStock ? sizeStock.stock : 0,
            };
          } else {
            initialSizesStock[size] = {
              stock: 0,
            };
          }
        });
      }

      // Calculate total stock from individual size stocks
      const totalFromSizes = Object.values(initialSizesStock).reduce(
        (total, item) => total + item.stock,
        0
      );

      setStockData({
        totalStock: totalFromSizes || product.stock || 0,
        sizes: initialSizesStock,
        general: { stock: 0 },
      });
    } else {
      setStockData({
        totalStock: product.stock || 0,
        sizes: {},
        general: { stock: product.stock || 0 },
      });
    }

    setShowStockModal(true);
  };

  const handleStockUpdate = (type, size, field, value) => {
    setStockData((prev) => {
      const newData = { ...prev };
      if (type === "size") {
        newData.sizes[size][field] = parseInt(value) || 0;
      } else {
        newData.general[field] = parseInt(value) || 0;
      }

      const categoryName =
        typeof selectedProduct?.category === "object" &&
        selectedProduct?.category?.name
          ? selectedProduct.category.name.toLowerCase()
          : typeof selectedProduct?.category === "string"
          ? selectedProduct.category.toLowerCase()
          : "";

      // Recalculate total stock
      if (categoryName === "rings") {
        newData.totalStock = Object.values(newData.sizes).reduce(
          (total, item) => total + item.stock,
          0
        );
      } else {
        newData.totalStock = newData.general.stock;
      }

      return newData;
    });
  };

  const validateProductData = (
    productData,
    isEdit = false,
    deletedImages = []
  ) => {
    const errors = [];

    if (!productData.name?.trim()) {
      errors.push("Product name is required");
    } else if (productData.name.trim().length < 2) {
      errors.push("Product name must be at least 2 characters");
    } else if (productData.name.trim().length > 100) {
      errors.push("Product name must be less than 100 characters");
    }

    if (!productData.collection_id) {
      errors.push("Collection is required");
    }

    if (!productData.category) {
      errors.push("Category is required");
    }

    if (
      !isEdit &&
      (!productData.original_price ||
        parseFloat(productData.original_price) <= 0)
    ) {
      errors.push("Original price must be greater than 0");
    }

    // Current price is optional (for discounts). If provided, it must be valid
    if (productData.current_price && productData.current_price.trim()) {
      const currentPrice = parseFloat(productData.current_price);
      if (isNaN(currentPrice) || currentPrice <= 0) {
        errors.push("Current price must be a valid number greater than 0");
      } else if (
        productData.original_price &&
        currentPrice > parseFloat(productData.original_price)
      ) {
        errors.push("Current price cannot be higher than original price");
      }
    }

    if (productData.stock && parseInt(productData.stock) < 0) {
      errors.push("Stock cannot be negative");
    }

    // Description validation
    if (!productData.description?.trim()) {
      errors.push("Product description is required");
    } else if (productData.description.trim().length < 10) {
      errors.push("Product description must be at least 10 characters");
    } else if (productData.description.trim().length > 1000) {
      errors.push("Product description must be less than 1000 characters");
    }

    if (isEdit) {
      const existingImages = (productData.imageUrls || []).filter(
        (url) => url !== null && url !== undefined
      );
      const remainingImages = Math.max(
        0,
        existingImages.length - (deletedImages?.length || 0)
      );
      const newImages = (productData.images || []).filter(
        (img) => img !== null && img !== undefined
      );
      const totalImages = remainingImages + newImages.length;

      if (totalImages === 0) {
        errors.push("At least one product image is required");
      }
    } else {
      const newImages = (productData.images || []).filter(
        (img) => img !== null
      );
      if (newImages.length === 0) {
        errors.push("At least one product image is required");
      }
    }

    return errors;
  };

  const checkDuplicateProduct = (productName, excludeId = null) => {
    const normalizedName = productName.trim().toLowerCase();
    return products.some((product) => {
      const productId = product.product_id || product.id;
      return (
        productId !== excludeId && product.name.toLowerCase() === normalizedName
      );
    });
  };

  const hasProductChanges = () => {
    if (!originalEditProduct) return true;

    const fieldsToCompare = [
      "name",
      "collection_id",
      "category",
      "original_price",
      "current_price",
      "stock",
      "description",
    ];
    for (let field of fieldsToCompare) {
      if (editProduct[field] !== originalEditProduct[field]) {
        return true;
      }
    }

    if (
      JSON.stringify(editProduct.sizes) !==
      JSON.stringify(originalEditProduct.sizes)
    ) {
      return true;
    }

    const hasNewImages = editProduct.images.some((img) => img !== null);
    if (hasNewImages) return true;

    if (deletedImageUrls.length > 0) return true;

    if (editProduct.model3DFile) return true;
    if (editProduct.model3DPath !== originalEditProduct.model3DPath) return true;

    if (editProduct.tryOnImageFile) return true;
    if (editProduct.tryOnImagePath !== originalEditProduct.tryOnImagePath) return true;

    return false;
  };

  const handleAddProduct = async () => {
    const validationErrors = validateProductData(newProduct);

    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    if (checkDuplicateProduct(newProduct.name)) {
      alert("A product with this name already exists");
      return;
    }

    setSaving(true);
    let uploadedImagePaths = [];

    try {
      let imageUrls = [];
      const imageFiles = newProduct.images.filter((img) => img !== null);

      if (imageFiles.length > 0) {
        try {
          const uploadResults = await uploadAllProductImages(
            imageFiles,
            newProduct.name
          );
          imageUrls = uploadResults.map((result) =>
            result.success ? result.url : null
          );
          uploadedImagePaths = uploadResults
            .map((result) => (result.success ? result.filePath : null))
            .filter((path) => path);

          const failedUploads = uploadResults.filter(
            (result) => !result.success
          );
          if (failedUploads.length > 0) {
            console.warn("Some images failed to upload:", failedUploads);
            alert(
              `Warning: ${failedUploads.length} image(s) failed to upload but product will be created`
            );
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          alert(
            `Image upload failed: ${uploadError.message}\n\nPlease try again.`
          );
          setSaving(false);
          return;
        }
      }

      const originalPrice = parseFloat(newProduct.original_price) || 0;
      const currentPrice =
        newProduct.current_price && newProduct.current_price.trim()
          ? parseFloat(newProduct.current_price)
          : null;

      const selectedCategory = modalCategoryOptions.find(
        (cat) => cat.value === newProduct.category
      );
      const isRings = selectedCategory?.slug === "rings";
      const categoryName = selectedCategory?.label || "";

      let model3DPath = null;
      if (newProduct.model3DFile) {
        showMessage("info", "Uploading 3D model...");
        const modelResult = await storageService.upload3DModel(
          newProduct.model3DFile,
          newProduct.name,
          categoryName
        );
        if (!modelResult.success) {
          showMessage("error", `3D upload failed: ${modelResult.error}`);
          setSaving(false);
          return;
        }
        model3DPath = modelResult.filePath;
      }

      let tryOnImagePath = null;
      if (newProduct.tryOnImageFile) {
        showMessage("info", "Uploading try-on image...");
        const tryOnResult = await storageService.uploadTryOnImage(
          newProduct.tryOnImageFile,
          newProduct.name,
          categoryName
        );
        if (!tryOnResult.success) {
          showMessage("error", `Try-on upload failed: ${tryOnResult.error}`);
          setSaving(false);
          return;
        }
        tryOnImagePath = tryOnResult.filePath;
      }

      const productData = {
        name: newProduct.name.trim(),
        collection_id: parseInt(newProduct.collection_id),
        category_id: parseInt(newProduct.category),
        original_price: originalPrice,
        current_price: currentPrice,
        stock: parseInt(newProduct.stock) || 0,
        size:
          isRings && newProduct.sizes.length > 0
            ? newProduct.sizes.join(",")
            : "",
        images: imageUrls,
        description: newProduct.description?.trim() || "",
        model_3d_path: model3DPath,
        try_on_image_path: tryOnImagePath,
      };

      const result = await createProduct(productData, imageFiles);

      if (result.success) {
        alert("Product created successfully!");
        setShowAddProductModal(false);
        setNewProduct({
          name: "",
          collection_id: "",
          category: "",
          original_price: "",
          current_price: "",
          stock: "",
          sizes: [],
          images: [null, null, null, null, null],
          imageUrls: [null, null, null, null, null],
          description: "",
          model3DFile: null,
          tryOnImageFile: null,
        });
      } else {
        await cleanupFailedImages(uploadedImagePaths);
        const errorMessage = result.error || "Failed to create product";
        console.error("Product creation failed:", errorMessage);
        alert(`❌ Failed to create product:\n\n${errorMessage}`);
      }
    } catch (error) {
      await cleanupFailedImages(uploadedImagePaths);
      console.error("Error creating product:", error);

      let errorMessage = "An unexpected error occurred";
      if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message?.includes("unauthorized")) {
        errorMessage = "You are not authorized to perform this action.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(
        `❌ Error creating product:\n\n${errorMessage}\n\nCheck console for more details.`
      );
    } finally {
      setSaving(false);
    }
  };

  const cleanupFailedImages = async (imagePaths) => {
    if (imagePaths && imagePaths.length > 0) {
      try {
        await storageService.cleanupOldImages(imagePaths);
      } catch (cleanupError) {
        console.error("Failed to cleanup images:", cleanupError);
      }
    }
  };

  // Handle edit product button click
  const handleEditClick = (product) => {
    // Parse sizes if it's a string (comma-separated)
    let parsedSizes = [];
    if (product.size && typeof product.size === "string") {
      parsedSizes = product.size.split(",").filter((s) => s.trim());
    } else if (Array.isArray(product.sizes)) {
      parsedSizes = product.sizes;
    }

    // Handle images - ensure we have the right format
    let imageUrls = [];
    if (product.images) {
      if (typeof product.images === "string") {
        try {
          imageUrls = JSON.parse(product.images);
        } catch (e) {
          imageUrls = [product.images];
        }
      } else if (Array.isArray(product.images)) {
        imageUrls = product.images;
      }
    }

    const editData = {
      id: product.product_id || product.id,
      name: product.name || "",
      collection_id: product.collection_id?.toString() || "",
      category: product.category_id?.toString() || "",
      original_price: product.original_price?.toString() || "",
      current_price: product.current_price?.toString() || "",
      stock: product.stock?.toString() || "",
      sizes: parsedSizes,
      images: [null, null, null, null, null],
      imageUrls: imageUrls,
      description: product.description || "",
      model3DFile: null,
      model3DPath: product.model_3d_path || null,
      model3DUrl: product.model_3d_path
        ? storageService.get3DModelUrl(product.model_3d_path)
        : null,
      tryOnImageFile: null,
      tryOnImagePath: product.try_on_image_path || null,
      tryOnImageUrl: product.try_on_image_path
        ? storageService.getTryOnImageUrl(product.try_on_image_path)
        : null,
    };

    setEditProduct(editData);
    setOriginalEditProduct(editData);
    setDeletedImageUrls([]);
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async () => {
    const validationErrors = validateProductData(
      editProduct,
      true,
      deletedImageUrls
    );

    if (validationErrors.length > 0) {
      showMessage("error", validationErrors[0]);
      return;
    }

    if (checkDuplicateProduct(editProduct.name, editProduct.id)) {
      showMessage("error", "A product with this name already exists");
      return;
    }

    const hasChanges = hasProductChanges();

    if (!hasChanges) {
      showMessage(
        "info",
        "No changes detected. Please modify the product details before updating."
      );
      return;
    }

    setSaving(true);
    let uploadedImagePaths = [];

    try {
      let imageUrls = [...(editProduct.imageUrls || [])];
      const imageFiles = editProduct.images.filter((img) => img !== null);

      if (imageFiles.length > 0) {
        try {
          const uploadResults = await uploadAllProductImages(
            imageFiles,
            editProduct.name
          );
          const newUrls = uploadResults.map((result) =>
            result.success ? result.url : null
          );
          uploadedImagePaths = uploadResults
            .map((result) => (result.success ? result.filePath : null))
            .filter((path) => path);

          const successfulUrls = newUrls.filter((url) => url !== null);
          const existingUrls = imageUrls.filter((url) => url !== null);
          imageUrls = [...successfulUrls, ...existingUrls].slice(0, 5);

          const failedUploads = uploadResults.filter(
            (result) => !result.success
          );
          if (failedUploads.length > 0) {
            console.warn("Some images failed to upload:", failedUploads);
            showMessage(
              "warning",
              `${failedUploads.length} image(s) failed to upload but product will be updated`
            );
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          showMessage("error", "Image upload failed. Please try again.");
          return;
        }
      }

      const originalPrice = parseFloat(editProduct.original_price) || 0;
      const currentPrice =
        editProduct.current_price && editProduct.current_price.trim()
          ? parseFloat(editProduct.current_price)
          : null;

      const selectedCategory = modalCategoryOptions.find(
        (cat) => cat.value === editProduct.category
      );
      const isRings = selectedCategory?.slug === "rings";
      const categoryName = selectedCategory?.label || "";

      let model3DPath = editProduct.model3DPath;
      if (editProduct.model3DFile) {
        if (originalEditProduct?.model3DPath) {
          await storageService.delete3DModel(originalEditProduct.model3DPath);
        }
        showMessage("info", "Uploading 3D model...");
        const modelResult = await storageService.upload3DModel(
          editProduct.model3DFile,
          editProduct.name,
          categoryName
        );
        if (!modelResult.success) {
          showMessage("error", `3D upload failed: ${modelResult.error}`);
          setSaving(false);
          return;
        }
        model3DPath = modelResult.filePath;
      } else if (!editProduct.model3DPath && originalEditProduct?.model3DPath) {
        await storageService.delete3DModel(originalEditProduct.model3DPath);
        model3DPath = null;
      }

      let tryOnImagePath = editProduct.tryOnImagePath;
      if (editProduct.tryOnImageFile) {
        if (originalEditProduct?.tryOnImagePath) {
          await storageService.deleteTryOnImage(originalEditProduct.tryOnImagePath);
        }
        showMessage("info", "Uploading try-on image...");
        const tryOnResult = await storageService.uploadTryOnImage(
          editProduct.tryOnImageFile,
          editProduct.name,
          categoryName
        );
        if (!tryOnResult.success) {
          showMessage("error", `Try-on upload failed: ${tryOnResult.error}`);
          setSaving(false);
          return;
        }
        tryOnImagePath = tryOnResult.filePath;
      } else if (!editProduct.tryOnImagePath && originalEditProduct?.tryOnImagePath) {
        await storageService.deleteTryOnImage(originalEditProduct.tryOnImagePath);
        tryOnImagePath = null;
      }

      const productData = {
        name: editProduct.name.trim(),
        collection_id: parseInt(editProduct.collection_id),
        category_id: parseInt(editProduct.category),
        original_price: originalPrice,
        current_price: currentPrice,
        stock: parseInt(editProduct.stock) || 0,
        size:
          isRings && editProduct.sizes.length > 0
            ? editProduct.sizes.join(",")
            : "",
        images: imageUrls,
        description: editProduct.description?.trim() || "",
        model_3d_path: model3DPath,
        try_on_image_path: tryOnImagePath,
      };

      const result = await updateProduct(
        editProduct.id,
        productData,
        imageFiles
      );

      if (result.success) {
        showMessage("success", "Product updated successfully!");
        setShowEditProductModal(false);
        setEditProduct({
          id: null,
          name: "",
          collection_id: "",
          category: "",
          original_price: "",
          current_price: "",
          stock: "",
          sizes: [],
          images: [null, null, null, null, null],
          imageUrls: [null, null, null, null, null],
          description: "",
          model3DFile: null,
          model3DPath: null,
          model3DUrl: null,
          tryOnImageFile: null,
          tryOnImagePath: null,
          tryOnImageUrl: null,
        });
      } else {
        await cleanupFailedImages(uploadedImagePaths);
        const errorMessage = result.error || "Failed to update product";

        if (errorMessage.toLowerCase().includes("not found")) {
          showMessage("error", "Product not found. It may have been deleted.");
          setShowEditProductModal(false);
          await fetchAllProducts();
        } else if (
          errorMessage.toLowerCase().includes("duplicate") ||
          errorMessage.toLowerCase().includes("already exists")
        ) {
          showMessage("error", "A product with this name already exists");
        } else if (errorMessage.toLowerCase().includes("validation")) {
          showMessage(
            "error",
            "Invalid product data. Please check all fields."
          );
        } else {
          showMessage("error", errorMessage);
        }
      }
    } catch (error) {
      await cleanupFailedImages(uploadedImagePaths);
      console.error("Error updating product:", error);

      if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        showMessage(
          "error",
          "Network error. Please check your connection and try again."
        );
      } else if (error.message?.includes("unauthorized")) {
        showMessage("error", "You are not authorized to perform this action.");
      } else {
        showMessage(
          "error",
          `An unexpected error occurred: ${
            error.message || "Please try again."
          }`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle save stock changes
  const handleSaveStockChanges = async () => {
    if (!selectedProduct) {
      showMessage("error", "No product selected");
      return;
    }

    setSaving(true);
    try {
      const categoryName =
        typeof selectedProduct.category === "object" &&
        selectedProduct.category?.name
          ? selectedProduct.category.name.toLowerCase()
          : typeof selectedProduct.category === "string"
          ? selectedProduct.category.toLowerCase()
          : "";

      // Prepare update data based on category
      let updateData = {};

      if (categoryName === "rings") {
        // Parse sizes from either 'sizes' array or 'size' string
        let productSizes = [];
        if (selectedProduct.sizes && Array.isArray(selectedProduct.sizes)) {
          productSizes = selectedProduct.sizes;
        } else if (
          selectedProduct.size &&
          typeof selectedProduct.size === "string"
        ) {
          productSizes = selectedProduct.size
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);
        }

        // Sort sizes numerically for consistency
        productSizes = productSizes.sort((a, b) => {
          const numA = parseInt(a.replace("Size ", ""));
          const numB = parseInt(b.replace("Size ", ""));
          return numA - numB;
        });

        // For rings, update individual size stocks
        const sizeStocks = Object.entries(stockData.sizes)
          .filter(([size, data]) => productSizes.includes(size))
          .map(([size, data]) => ({
            size: size,
            stock: data.stock || 0,
          }));

        updateData = {
          stock: stockData.totalStock,
          sizeStocks: sizeStocks,
        };
      } else {
        // For other categories, update general stock
        updateData = {
          stock: stockData.general.stock,
        };
      }

      const result = await updateProduct(
        selectedProduct.id || selectedProduct.product_id,
        updateData
      );

      if (result.success) {
        showMessage("success", "Stock updated successfully!");
        setShowStockModal(false);

        // Refresh products to show updated stock
        await fetchAllProducts();
      } else {
        const errorMessage = result.error || "Failed to update stock";
        showMessage("error", errorMessage);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      showMessage(
        "error",
        "An unexpected error occurred while updating stock."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!productId) {
      showMessage("error", "Invalid product selected");
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone and will:\n- Remove the product from your inventory\n- Delete all associated images\n- Remove it from all collections`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setSaving(true);
    try {
      const result = await deleteProduct(productId);

      if (result.success) {
        showMessage("success", "Product deleted successfully!");

        if (showEditProductModal && editProduct.id === productId) {
          setShowEditProductModal(false);
        }
        if (showStockModal && selectedProduct?.id === productId) {
          setShowStockModal(false);
        }
      } else {
        const errorMessage = result.error || "Failed to delete product";

        if (errorMessage.toLowerCase().includes("not found")) {
          showMessage(
            "error",
            "Product not found. It may have already been deleted."
          );
          await fetchAllProducts();
        } else if (
          errorMessage.toLowerCase().includes("referenced") ||
          errorMessage.toLowerCase().includes("constraint")
        ) {
          showMessage(
            "error",
            "Cannot delete product. It may be referenced by orders or other data."
          );
        } else {
          showMessage("error", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        showMessage(
          "error",
          "Network error. Please check your connection and try again."
        );
      } else if (error.message?.includes("unauthorized")) {
        showMessage("error", "You are not authorized to delete products.");
      } else {
        showMessage(
          "error",
          "An unexpected error occurred while deleting the product."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const allProducts = products || [];

  // Helper function to format product data for display
  const formatProductForDisplay = (product) => {
    // Extract collection name
    let collectionName = "N/A";
    if (product.collection) {
      if (typeof product.collection === "object" && product.collection.name) {
        collectionName = product.collection.name;
      } else if (typeof product.collection === "string") {
        collectionName = product.collection;
      }
    }

    // Extract category name
    let categoryName = "N/A";
    if (product.category) {
      if (typeof product.category === "object" && product.category.name) {
        categoryName = product.category.name;
      } else if (typeof product.category === "string") {
        categoryName = product.category;
      }
    }

    return {
      ...product,
      id: product.product_id || product.id,
      price: product.original_price
        ? `PHP${parseFloat(product.original_price).toFixed(2)}`
        : "N/A",
      soldPrice: product.current_price
        ? `PHP${parseFloat(product.current_price).toFixed(2)}`
        : "N/A",
      collection: collectionName,
      category: categoryName,
      status: product.status || "Normal Selling",
    };
  };

  // Category options
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "necklaces", label: "Necklaces" },
    { value: "rings", label: "Rings" },
    { value: "bracelets", label: "Bracelets" },
    { value: "earrings", label: "Earrings" },
  ];

  // Collection options
  const collectionOptions = [
    { value: "all", label: "All Collections" },
    { value: "love-language", label: "Love Language Collection" },
    { value: "classic", label: "Classic Collection" },
    { value: "clash", label: "Clash Collection" },
    { value: "rebellion", label: "The Rebellion Collection" },
  ];

  // Stock level options
  const stockOptions = [
    { value: "all", label: "All Stock Levels" },
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  // Updated selling status options
  const sellingStatusOptions = [
    { value: "all", label: "All Selling Status" },
    { value: "best-selling", label: "Best Selling" },
    { value: "normal-selling", label: "Normal Selling" },
    { value: "low-selling", label: "Low Selling" },
  ];

  // Calculate stats
  const totalProducts = allProducts.length;
  const lowStockProducts = allProducts.filter(
    (p) => p.stock > 0 && p.stock <= 10
  ).length;
  const outOfStockProducts = allProducts.filter((p) => p.stock === 0).length;

  // Filter products with working filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        const productCategory =
          product.category?.name || product.category || "";
        return productCategory.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    if (selectedCollection !== "all") {
      const collectionMap = {
        "love-language": "LOVE LANGUAGE COLLECTION",
        clash: "CLASH COLLECTION",
        rebellion: "THE REBELLION COLLECTION",
        classic: "CLASSIC COLLECTION",
      };
      filtered = filtered.filter((product) => {
        const productCollection =
          product.collection?.name || product.collection || "";
        return productCollection === collectionMap[selectedCollection];
      });
    }

    if (selectedStockLevel !== "all") {
      if (selectedStockLevel === "in-stock") {
        filtered = filtered.filter((product) => (product.stock || 0) > 10);
      } else if (selectedStockLevel === "low-stock") {
        filtered = filtered.filter(
          (product) => (product.stock || 0) > 0 && (product.stock || 0) <= 10
        );
      } else if (selectedStockLevel === "out-of-stock") {
        filtered = filtered.filter((product) => (product.stock || 0) === 0);
      }
    }

    if (selectedSellingStatus !== "all") {
      const statusMap = {
        "best-selling": "Best Selling",
        "normal-selling": "Normal Selling",
        "low-selling": "Low Selling",
      };
      filtered = filtered.filter((product) => {
        const productStatus = product.status || "Normal Selling";
        return productStatus === statusMap[selectedSellingStatus];
      });
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) => {
        const productName = (product.name || "").toLowerCase();
        const productCollection = (
          product.collection?.name ||
          product.collection ||
          ""
        ).toLowerCase();
        const query = searchQuery.toLowerCase();
        return productName.includes(query) || productCollection.includes(query);
      });
    }

    return filtered;
  }, [
    allProducts,
    selectedCategory,
    selectedCollection,
    selectedStockLevel,
    selectedSellingStatus,
    searchQuery,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map(formatProductForDisplay);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        closeAllDropdowns();
        setShowAddModalCollectionDropdown(false);
        setShowAddModalCategoryDropdown(false);
        setShowEditModalCollectionDropdown(false);
        setShowEditModalCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedCollection,
    selectedStockLevel,
    selectedSellingStatus,
    searchQuery,
  ]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      "Best Selling": "bg-green-500 text-white",
      "Normal Selling": "bg-blue-500 text-white",
      "Low Selling": "bg-red-500 text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded text-xs avantbold ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <AdminHeader />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <h2 className="text-2xl bebas text-black mb-2">
                LOADING PRODUCTS
              </h2>
              <p className="text-gray-600 avant">
                Please wait while we fetch your products...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {message.text && (
        <div
          className={`fixed bottom-6 right-6 z-[60] px-6 py-3 rounded-lg text-white font-semibold ${
            message.type === "success"
              ? "bg-green-500"
              : message.type === "error"
              ? "bg-red-500"
              : message.type === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">PRODUCTS MANAGEMENT</h1>

            {/* Search Bar aligned with header */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-black"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Category Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowCategoryDropdown(!showCategoryDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-40"
                >
                  <span className="text-black">
                    {
                      categoryOptions.find(
                        (cat) => cat.value === selectedCategory
                      )?.label
                    }
                  </span>
                  <img
                    src={
                      showCategoryDropdown ? DropUpIconBlack : DropDownIconBlack
                    }
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {categoryOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCategory(option.value);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedCategory === option.value
                            ? "bg-gray-100 font-medium"
                            : ""
                        } ${index === 0 ? "rounded-t-lg" : ""} ${
                          index === categoryOptions.length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== option.value) {
                            e.target.style.backgroundColor = "#959595";
                            e.target.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== option.value) {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "black";
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowCollectionDropdown(!showCollectionDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-48"
                >
                  <span className="text-black">
                    {
                      collectionOptions.find(
                        (col) => col.value === selectedCollection
                      )?.label
                    }
                  </span>
                  <img
                    src={
                      showCollectionDropdown
                        ? DropUpIconBlack
                        : DropDownIconBlack
                    }
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showCollectionDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {collectionOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCollection(option.value);
                          setShowCollectionDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedCollection === option.value
                            ? "bg-gray-100 font-medium"
                            : ""
                        } ${index === 0 ? "rounded-t-lg" : ""} ${
                          index === collectionOptions.length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedCollection !== option.value) {
                            e.target.style.backgroundColor = "#959595";
                            e.target.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCollection !== option.value) {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "black";
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Level Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowStockDropdown(!showStockDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-44"
                >
                  <span className="text-black">
                    {
                      stockOptions.find(
                        (stock) => stock.value === selectedStockLevel
                      )?.label
                    }
                  </span>
                  <img
                    src={
                      showStockDropdown ? DropUpIconBlack : DropDownIconBlack
                    }
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showStockDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {stockOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedStockLevel(option.value);
                          setShowStockDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedStockLevel === option.value
                            ? "bg-gray-100 font-medium"
                            : ""
                        } ${index === 0 ? "rounded-t-lg" : ""} ${
                          index === stockOptions.length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedStockLevel !== option.value) {
                            e.target.style.backgroundColor = "#959595";
                            e.target.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedStockLevel !== option.value) {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "black";
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selling Status Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowSellingDropdown(!showSellingDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-48"
                >
                  <span className="text-black">
                    {
                      sellingStatusOptions.find(
                        (status) => status.value === selectedSellingStatus
                      )?.label
                    }
                  </span>
                  <img
                    src={
                      showSellingDropdown ? DropUpIconBlack : DropDownIconBlack
                    }
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showSellingDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {sellingStatusOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSellingStatus(option.value);
                          setShowSellingDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedSellingStatus === option.value
                            ? "bg-gray-100 font-medium"
                            : ""
                        } ${index === 0 ? "rounded-t-lg" : ""} ${
                          index === sellingStatusOptions.length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedSellingStatus !== option.value) {
                            e.target.style.backgroundColor = "#959595";
                            e.target.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSellingStatus !== option.value) {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "black";
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add New Product Button */}
            <div>
              <button
                onClick={() => setShowAddProductModal(true)}
                disabled={!canEdit}
                title={!canEdit ? (isCSR ? 'CSR users can view but not edit products' : 'You do not have permission to perform this action') : ''}
                className="px-6 py-2 bg-black text-white uppercase rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm font-medium"
              >
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-sm avantbold text-gray-600 mb-2">
                TOTAL PRODUCTS
              </div>
              <div className="text-4xl bebas text-black">{totalProducts}</div>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-sm avantbold text-gray-600 mb-2">
                LOW STOCKS
              </div>
              <div className="text-4xl bebas text-black">
                {lowStockProducts}
              </div>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-sm avantbold text-gray-600 mb-2">
                OUT OF STOCKS
              </div>
              <div className="text-4xl bebas text-black">
                {outOfStockProducts}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Products Grid with Pagination inside */}
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6 mb-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative bg-white rounded-lg overflow-hidden shadow-md"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {getStatusBadge(product.status)}
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-48 bg-gray-900 relative overflow-hidden">
                      <img
                        src={
                          product.images &&
                          Array.isArray(product.images) &&
                          product.images.length > 0
                            ? product.images[0]
                            : product.image 
                             
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                        // onError={(e) => {
                        //   e.target.src =
                        //     "https://via.placeholder.com/400x400?text=No+Image";
                        // }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="avantbold text-sm text-black mb-1">
                        {product.name}
                      </h3>
                      <p className="avant text-xs text-gray-600 mb-2">
                        {product.collection}
                      </p>

                      {/* Updated Pricing Section with Labels */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="avant text-xs text-gray-500">
                            Original Price:
                          </span>
                          <span className="avant text-sm text-gray-500">
                            {product.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="avant text-xs text-black font-medium">
                            Current Price:
                          </span>
                          <span className="avantbold text-sm text-black">
                            {product.soldPrice}
                          </span>
                        </div>
                      </div>

                      <p className="avant text-xs text-gray-600 mb-3">
                        {product.stock} STOCKS
                      </p>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            disabled={!canEdit}
                            title={!canEdit ? (isCSR ? 'CSR users can view but not edit products' : 'You do not have permission to perform this action') : ''}
                            className="flex-1 px-3 py-1 bg-transparent border border-black text-black rounded text-xs avant font-medium hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleStockClick(product)}
                            disabled={!canEdit}
                            title={!canEdit ? (isCSR ? 'CSR users can view but not edit stock levels' : 'You do not have permission to perform this action') : ''}
                            className="flex-1 px-3 py-1 bg-transparent border border-black text-black rounded text-xs avant font-medium hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            STOCKS
                          </button>
                        </div>
                        <button
                          onClick={() => handleReviewsClick(product)}
                          disabled={!canEdit}
                          title={!canEdit ? (isCSR ? 'CSR users can view but not manage reviews' : 'You do not have permission to perform this action') : ''}
                          className="w-full px-3 py-1 bg-gray-600 text-white rounded text-xs avant font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          MANAGE REVIEWS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination inside table - centered at bottom */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center">
                  <div
                    className="inline-flex items-stretch border border-black rounded-full overflow-hidden bg-white"
                    style={{ height: 44 }}
                  >
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      aria-label="Previous Page"
                      className="flex items-center justify-center border-r border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        width: 44,
                        height: 44,
                        borderTopLeftRadius: 22,
                        borderBottomLeftRadius: 22,
                      }}
                    >
                      <img src={PrevIConBlack} alt="Prev" className="w-5 h-5" />
                    </button>
                    <div
                      className="flex items-center justify-center text-black avantbold font-bold text-base select-none whitespace-nowrap px-6"
                      style={{
                        letterSpacing: 2,
                        height: 44,
                      }}
                    >
                      {currentPage} OF {totalPages}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      aria-label="Next Page"
                      className="flex items-center justify-center border-l border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        width: 44,
                        height: 44,
                        borderTopRightRadius: 22,
                        borderBottomRightRadius: 22,
                      }}
                    >
                      <img src={NextIConBlack} alt="Next" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Management Modal */}
      {showStockModal && selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl avantbold text-black">
                  Stock Management
                </h2>
                <p className="text-sm avant text-gray-600 mt-1">
                  {selectedProduct.name}
                </p>
              </div>
              <button
                onClick={() => setShowStockModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Stock Overview - simplified to just total stock */}
              <div className="mb-6">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-sm avantbold text-gray-600 mb-2">
                    TOTAL STOCK
                  </div>
                  <div className="text-3xl bebas text-black">
                    {stockData.totalStock}
                  </div>
                </div>
              </div>

              {/* Stock Details */}
              {(() => {
                // Get category name safely
                const categoryName =
                  typeof selectedProduct.category === "object" &&
                  selectedProduct.category?.name
                    ? selectedProduct.category.name.toLowerCase()
                    : typeof selectedProduct.category === "string"
                    ? selectedProduct.category.toLowerCase()
                    : "";

                return categoryName === "rings" ? (
                  // Ring sizes inventory - only show selected sizes
                  <div>
                    <h3 className="text-lg avantbold text-black mb-4">
                      Size Inventory
                    </h3>
                    <div className="space-y-3">
                      {(() => {
                        // Parse sizes from either 'sizes' array or 'size' string
                        let selectedSizes = [];
                        if (
                          selectedProduct.sizes &&
                          Array.isArray(selectedProduct.sizes)
                        ) {
                          selectedSizes = selectedProduct.sizes;
                        } else if (
                          selectedProduct.size &&
                          typeof selectedProduct.size === "string"
                        ) {
                          selectedSizes = selectedProduct.size
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s);
                        }

                        // Sort sizes numerically (Size 3, Size 4, Size 5, etc.)
                        selectedSizes = selectedSizes.sort((a, b) => {
                          const numA = parseInt(a.replace("Size ", ""));
                          const numB = parseInt(b.replace("Size ", ""));
                          return numA - numB;
                        });

                        if (selectedSizes.length === 0) {
                          return (
                            <div className="text-center p-4 text-gray-500 avant">
                              No sizes selected for this ring product.
                            </div>
                          );
                        }

                        return selectedSizes.map((size) => (
                          <div
                            key={size}
                            className="grid grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="avantbold text-black">{size}</div>
                            <div>
                              <label className="block text-xs avant text-gray-600 mb-1">
                                Stock
                              </label>
                              <input
                                type="number"
                                value={stockData.sizes[size]?.stock || 0}
                                onChange={(e) =>
                                  handleStockUpdate(
                                    "size",
                                    size,
                                    "stock",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm avant focus:outline-none focus:border-black text-black"
                                min="0"
                              />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                ) : (
                  // General inventory - simplified
                  <div>
                    <h3 className="text-lg avantbold text-black mb-4">
                      Inventory Management
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="max-w-sm mx-auto">
                        <label className="block text-sm avantbold text-black mb-2">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={stockData.general.stock}
                          onChange={(e) =>
                            handleStockUpdate(
                              "general",
                              null,
                              "stock",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg avant focus:outline-none focus:border-black text-black text-center text-lg"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowStockModal(false)}
                  className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveStockChanges}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      <AddProductModal
        showModal={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        newProduct={newProduct}
        onProductChange={handleProductChange}
        modalCollectionOptions={modalCollectionOptions}
        showCollectionDropdown={showAddModalCollectionDropdown}
        setShowCollectionDropdown={setShowAddModalCollectionDropdown}
        modalCategoryOptions={modalCategoryOptions}
        showCategoryDropdown={showAddModalCategoryDropdown}
        setShowCategoryDropdown={setShowAddModalCategoryDropdown}
        sizeOptions={sizeOptions}
        onSizeToggle={handleSizeToggle}
        onImageUpload={handleImageUpload}
        on3DModelUpload={(file) => handle3DModelUpload(file, false)}
        onRemove3DModel={() => handleRemove3DModel(false)}
        onTryOnImageUpload={(file) => handleTryOnImageUpload(file, false)}
        onRemoveTryOnImage={() => handleRemoveTryOnImage(false)}
        onAddProduct={handleAddProduct}
        saving={saving}
        uploading={uploading}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        showModal={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        editProduct={editProduct}
        onEditProductChange={handleEditProductChange}
        modalCollectionOptions={modalCollectionOptions}
        showEditModalCollectionDropdown={showEditModalCollectionDropdown}
        setShowEditModalCollectionDropdown={setShowEditModalCollectionDropdown}
        modalCategoryOptions={modalCategoryOptions}
        showEditModalCategoryDropdown={showEditModalCategoryDropdown}
        setShowEditModalCategoryDropdown={setShowEditModalCategoryDropdown}
        sizeOptions={sizeOptions}
        onEditSizeToggle={handleEditSizeToggle}
        onEditImageUpload={handleEditImageUpload}
        onRemoveImage={handleRemoveEditImage}
        on3DModelUpload={(file) => handle3DModelUpload(file, true)}
        onRemove3DModel={() => handleRemove3DModel(true)}
        onTryOnImageUpload={(file) => handleTryOnImageUpload(file, true)}
        onRemoveTryOnImage={() => handleRemoveTryOnImage(true)}
        onUpdateProduct={handleUpdateProduct}
        saving={saving}
        uploading={uploading}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        showModal={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        selectedProduct={selectedProduct}
        reviewFilter={reviewFilter}
        setReviewFilter={setReviewFilter}
      />

      {/* Stock Modal */}
      <StockModal
        showModal={showStockModal}
        onClose={() => setShowStockModal(false)}
        selectedProduct={selectedProduct}
        stockData={stockData}
        sizeOptions={sizeOptions}
        handleStockUpdate={handleStockUpdate}
        handleSaveStockChanges={handleSaveStockChanges}
      />
    </div>
  );
};

export default function AdminProductsWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <AdminProducts {...props} />
    </ErrorBoundary>
  );
}
