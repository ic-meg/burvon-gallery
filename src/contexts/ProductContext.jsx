import { createContext, useContext, useState, useEffect } from "react";
import productApi from "../api/productApi";
import storageService from "../services/storageService";

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [productsByCollection, setProductsByCollection] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadProductImages = async (imageFiles, productName) => {
    try {
      const uploadResults = [];
      const cleanProductName = productName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file) {
          const filePath = storageService.generateFilePath(
            file,
            `products/${cleanProductName}/image_${i}`
          );
          const result = await storageService.uploadCategoryImage(
            file,
            `products/${cleanProductName}/image_${i}`
          );

          if (result.success) {
            uploadResults.push({
              index: i,
              url: storageService.getImageUrl(result.filePath),
              filePath: result.filePath,
              success: true,
            });
          } else {
            uploadResults.push({
              index: i,
              url: null,
              filePath: null,
              success: false,
              error: result.error,
            });
          }
        } else {
          uploadResults.push({
            index: i,
            url: null,
            filePath: null,
            success: true,
          });
        }
      }

      return uploadResults;
    } catch (error) {
      console.error("Error uploading product images:", error);
      return [];
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.fetchAllProducts();

      if (response.error) {
        console.warn("Products API error:", response.error);
        setProducts([]);
      } else if (response.data) {
        let productsData = response.data;

        if (typeof productsData === "string") {
          try {
            productsData = JSON.parse(productsData);
          } catch (parseError) {
            console.warn("Failed to parse products data:", parseError);
            productsData = [];
          }
        }

        if (productsData && productsData.products) {
          setProducts(
            Array.isArray(productsData.products) ? productsData.products : []
          );
        } else if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.warn("Unexpected products data structure:", productsData);
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.fetchProductById(id);

      if (response.error) {
        console.warn(`Product API error for ID ${id}:`, response.error);
        return null;
      } else if (response.data) {
        let productData = response.data;

        if (typeof productData === "string") {
          try {
            productData = JSON.parse(productData);
          } catch (parseError) {
            console.warn("Failed to parse product data:", parseError);
            return null;
          }
        }

        return productData;
      }

      return null;
    } catch (err) {
      console.error(`Failed to fetch product ${id}:`, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categorySlug) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.fetchProductsByCategory(categorySlug);

      if (response.error) {
        console.warn(
          `Products API error for category ${categorySlug}:`,
          response.error
        );
        setProductsByCategory((prev) => ({ ...prev, [categorySlug]: [] }));
        return [];
      } else if (response.data) {
        let productsData = response.data;

        if (typeof productsData === "string") {
          try {
            productsData = JSON.parse(productsData);
          } catch (parseError) {
            console.warn("Failed to parse category products data:", parseError);
            productsData = [];
          }
        }

        let products = [];
        if (
          productsData &&
          productsData.products &&
          Array.isArray(productsData.products)
        ) {
          products = productsData.products;
        } else if (Array.isArray(productsData)) {
          products = productsData;
        }

        setProductsByCategory((prev) => ({
          ...prev,
          [categorySlug]: products,
        }));
        return products;
      }

      setProductsByCategory((prev) => ({ ...prev, [categorySlug]: [] }));
      return [];
    } catch (err) {
      console.error(
        `Failed to fetch products for category ${categorySlug}:`,
        err
      );
      setError(err.message);
      setProductsByCategory((prev) => ({ ...prev, [categorySlug]: [] }));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCollection = async (collectionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.fetchProductsByCollection(collectionId);

      if (response.error) {
        console.warn(
          `Products API error for collection ${collectionId}:`,
          response.error
        );
        setProductsByCollection((prev) => ({ ...prev, [collectionId]: [] }));
        return [];
      } else if (response.data) {
        let productsData = response.data;

        if (typeof productsData === "string") {
          try {
            productsData = JSON.parse(productsData);
          } catch (parseError) {
            console.warn(
              "Failed to parse collection products data:",
              parseError
            );
            productsData = { products: [] };
          }
        }

        let products = [];

        // Handle different response structures
        if (Array.isArray(productsData)) {
          products = productsData;
        } else if (productsData && Array.isArray(productsData.products)) {
          products = productsData.products;
        } else if (
          productsData &&
          productsData.data &&
          Array.isArray(productsData.data.products)
        ) {
          products = productsData.data.products;
        } else if (
          productsData &&
          productsData.products &&
          typeof productsData.products === "object"
        ) {
          try {
            products = Object.values(productsData.products).flat();
          } catch (e) {
            products = [];
          }
        }

        setProductsByCollection((prev) => ({
          ...prev,
          [collectionId]: products,
        }));
        return products;
      }

      setProductsByCollection((prev) => ({ ...prev, [collectionId]: [] }));
      return [];
    } catch (err) {
      console.error(
        `Failed to fetch products for collection ${collectionId}:`,
        err
      );
      setError(err.message);
      setProductsByCollection((prev) => ({ ...prev, [collectionId]: [] }));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData, imageFiles = []) => {
    try {
      setLoading(true);
      setError(null);

      let finalProductData = { ...productData };

      if (imageFiles && imageFiles.length > 0) {
        const imageUploadResults = await uploadProductImages(
          imageFiles,
          productData.name
        );

        const imageUrls = imageUploadResults.map((result) =>
          result.success ? result.url : null
        );
        finalProductData.images = imageUrls;

        finalProductData.imagePaths = imageUploadResults.map((result) =>
          result.success ? result.filePath : null
        );
      }

      const response = await productApi.createProduct(finalProductData);

      if (response.error) {
        console.warn("Create product API error:", response.error);
        if (finalProductData.imagePaths) {
          await storageService.cleanupOldImages(finalProductData.imagePaths);
        }
        return { success: false, error: response.error };
      } else if (response.data) {
        await fetchAllProducts();
        return { success: true, data: response.data };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData, imageFiles = []) => {
    try {
      setLoading(true);
      setError(null);

      let finalProductData = { ...productData };

      if (imageFiles && imageFiles.length > 0) {
        const oldProduct = await fetchProductById(id);

        const imageUploadResults = await uploadProductImages(
          imageFiles,
          productData.name
        );

        const imageUrls = imageUploadResults.map((result) =>
          result.success ? result.url : null
        );
        finalProductData.images = imageUrls;

        if (oldProduct && oldProduct.imagePaths) {
          await storageService.cleanupOldImages(oldProduct.imagePaths);
        }
      }

      const response = await productApi.updateProduct(finalProductData, id);

      if (response.error) {
        console.warn("Update product API error:", response.error);
        return { success: false, error: response.error };
      } else if (response.data) {
        await fetchAllProducts();
        return { success: true, data: response.data };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const product = await fetchProductById(id);

      const response = await productApi.deleteProduct(id);

      if (response.error) {
        console.warn("Delete product API error:", response.error);
        return { success: false, error: response.error };
      } else {
        if (product && product.imagePaths) {
          await storageService.cleanupOldImages(product.imagePaths);
        }

        await fetchAllProducts();
        return { success: true };
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (id, stockData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.updateProductStock(id, stockData);

      if (response.error) {
        console.warn("Update stock API error:", response.error);
        return { success: false, error: response.error };
      } else if (response.data) {
        await fetchAllProducts();
        return { success: true, data: response.data };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (err) {
      console.error("Failed to update product stock:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.searchProducts(query);

      if (response.error) {
        console.warn("Search products API error:", response.error);
        return [];
      } else if (response.data) {
        let productsData = response.data;

        if (typeof productsData === "string") {
          try {
            productsData = JSON.parse(productsData);
          } catch (parseError) {
            console.warn("Failed to parse search results:", parseError);
            productsData = [];
          }
        }

        return Array.isArray(productsData) ? productsData : [];
      }

      return [];
    } catch (err) {
      console.error("Failed to search products:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = async (filters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.filterProducts(filters);

      if (response.error) {
        console.warn("Filter products API error:", response.error);
        return [];
      } else if (response.data) {
        let productsData = response.data;

        if (typeof productsData === "string") {
          try {
            productsData = JSON.parse(productsData);
          } catch (parseError) {
            console.warn("Failed to parse filter results:", parseError);
            productsData = [];
          }
        }

        return Array.isArray(productsData) ? productsData : [];
      }

      return [];
    } catch (err) {
      console.error("Failed to filter products:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (categorySlug) => {
    return productsByCategory[categorySlug] || [];
  };

  const getProductsByCollection = (collectionId) => {
    return productsByCollection[collectionId] || [];
  };

  const clearProducts = () => {
    setProducts([]);
    setProductsByCategory({});
    setProductsByCollection({});
  };

  const clearProductsByCollection = (collectionId) => {
    setProductsByCollection((prev) => {
      const updated = { ...prev };
      delete updated[collectionId];
      return updated;
    });
  };

  const value = {
    products,
    productsByCategory,
    productsByCollection,
    loading,
    error,

    fetchAllProducts,
    fetchProductById,
    fetchProductsByCategory,
    fetchProductsByCollection,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    searchProducts,
    filterProducts,

    getProductsByCategory,
    getProductsByCollection,
    clearProducts,
    clearProductsByCollection,
    uploadProductImages,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
