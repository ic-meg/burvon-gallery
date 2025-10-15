import apiRequest from "./apiRequest";

const apiURL = import.meta.env.VITE_PRODUCT_API;

const missing = (field) => {
  return { error: `${field} is required`, status: null, data: null };
};

const baseUrl = apiURL;

const fetchAllProducts = async () => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  const result = await apiRequest(baseUrl, null);
  return result;
};

const fetchProductById = async (id) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!id) return missing("product id");
  return await apiRequest(`${baseUrl}id/${id}`, null);
};

const fetchProductBySlug = async (slug) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!slug) return missing("product slug");
  return await apiRequest(`${baseUrl}${slug}`, null);
};

const fetchProductsByCategory = async (categorySlug) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!categorySlug) return missing("category slug");
  return await apiRequest(`${baseUrl}category/${categorySlug}`, null);
};

const fetchProductsByCollection = async (collectionId) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!collectionId) return missing("collection id");
  return await apiRequest(`${baseUrl}collection/${collectionId}`, null);
};

const createProduct = async (productData) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!productData) return missing("product data");
  return await apiRequest(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
};

const updateProduct = async (productData, id) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!productData) return missing("product data");
  if (!id) return missing("product id");
  return await apiRequest(`${baseUrl}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
};

const deleteProduct = async (id) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!id) return missing("product id");
  return await apiRequest(`${baseUrl}${id}`, {
    method: "DELETE",
  });
};

const saveProduct = async (productData) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!productData) return missing("product data");

  return await apiRequest(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
};

const updateProductStock = async (id, stockData) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!id) return missing("product id");
  if (!stockData) return missing("stock data");
  return await apiRequest(`${baseUrl}${id}/stock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stockData),
  });
};

const searchProducts = async (query) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!query) return missing("search query");
  return await apiRequest(`${baseUrl}search?q=${encodeURIComponent(query)}`, null);
};

const filterProducts = async (filters) => {
  if (!apiURL) return missing("VITE_PRODUCT_API");
  if (!filters) return missing("filters");
  
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  
  return await apiRequest(`${baseUrl}filter?${params.toString()}`, null);
};

export default {
  fetchAllProducts,
  fetchProductById,
  fetchProductBySlug,
  fetchProductsByCategory,
  fetchProductsByCollection,
  createProduct,
  updateProduct,
  deleteProduct,
  saveProduct,
  updateProductStock,
  searchProducts,
  filterProducts,
};