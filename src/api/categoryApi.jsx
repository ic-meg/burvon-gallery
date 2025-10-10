import apiRequest from "./apiRequest";

const apiURL = import.meta.env.VITE_CATEGORY_API;
const categoriesApiURL = import.meta.env.VITE_CATEGORIES_API;

const missing = (field) => {
  return { error: `${field} is required`, status: null, data: null };
};

const baseUrl = apiURL;

const fetchAllCategories = async () => {
  if (!categoriesApiURL) return missing("VITE_CATEGORIES_API");
  const result = await apiRequest(categoriesApiURL, null);
  return result;
};

const fetchCategoryContent = async () => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  return await apiRequest(baseUrl, null);
};

const fetchCategoryById = async (id) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!id) return missing("category id");
  return await apiRequest(`${baseUrl}${id}`, null);
};

const fetchCategoryBySlug = async (slug) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!slug) return missing("category slug");
  return await apiRequest(`${baseUrl}${slug}`, null);
};

const createCategoryContent = async (content) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!content) return missing("content");
  return await apiRequest(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
};

const updateCategoryContent = async (content, id) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!content) return missing("content");
  if (!id) return missing("category id");
  return await apiRequest(`${baseUrl}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
};

const updateCategoryBySlug = async (content, slug) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!content) return missing("content");
  if (!slug) return missing("category slug");
  return await apiRequest(`${baseUrl}${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
};

const saveCategoryContent = async (contentData) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!contentData) return missing("content");

  // Send JSON data with Supabase URLs instead of files
  return await apiRequest(`${baseUrl}${contentData.slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contentData),
  });
};

const deleteCategoryContent = async (id) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!id) return missing("category id");
  return await apiRequest(`${baseUrl}${id}`, {
    method: "DELETE",
  });
};

const deleteCategoryBySlug = async (slug) => {
  if (!apiURL) return missing("VITE_CATEGORY_API");
  if (!slug) return missing("category slug");
  return await apiRequest(`${baseUrl}${slug}`, {
    method: "DELETE",
  });
};

export default {
  fetchAllCategories,
  fetchCategoryContent,
  fetchCategoryById,
  fetchCategoryBySlug,
  createCategoryContent,
  updateCategoryContent,
  updateCategoryBySlug,
  deleteCategoryContent,
  deleteCategoryBySlug,
  saveCategoryContent,
};
