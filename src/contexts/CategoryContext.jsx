import React, { createContext, useContext, useState, useEffect } from "react";
import categoryApi from "../api/categoryApi";

const CategoryContext = createContext();

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch specific category content by slug
  const fetchCategoryBySlug = async (slug) => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryApi.fetchCategoryBySlug(slug);

      if (!response) {
        console.warn(`Category API returned undefined response for ${slug}`);
        setCategories((prev) => ({ ...prev, [slug]: null }));
        return null;
      }

      if (response.error) {
        console.warn(`Category API error for ${slug}:`, response.error);

        setCategories((prev) => ({ ...prev, [slug]: null }));
        return null;
      } else if (response.data) {
        // Update the specific category in state
        setCategories((prev) => ({ ...prev, [slug]: response.data }));
        return response.data;
      } else {
        setCategories((prev) => ({ ...prev, [slug]: null }));
        return null;
      }
    } catch (err) {
      console.error(`Failed to fetch category ${slug}:`, err);
      setError(err.message);
      setCategories((prev) => ({ ...prev, [slug]: null }));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryApi.fetchCategoryContent();

      if (response.error) {
        console.warn("Categories API error:", response.error);
        setCategories({});
      } else if (response.data) {
        // If response.data is an array, convert to object keyed by slug
        if (Array.isArray(response.data)) {
          const categoriesObj = {};
          response.data.forEach((cat) => {
            if (cat.slug) {
              categoriesObj[cat.slug] = cat;
            }
          });
          setCategories(categoriesObj);
        } else {
          setCategories(response.data);
        }
      } else {
        setCategories({});
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(err.message);
      setCategories({});
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBySlug = (slug) => {
    return categories[slug] || null;
  };

  const hasCategoryData = (slug) => {
    return categories.hasOwnProperty(slug) && categories[slug] !== null;
  };

  const updateCategoryBySlug = (slug, newContent) => {
    setCategories((prev) => ({ ...prev, [slug]: newContent }));
  };

  const removeCategoryBySlug = (slug) => {
    setCategories((prev) => {
      const updated = { ...prev };
      delete updated[slug];
      return updated;
    });
  };

  const refreshCategory = (slug) => {
    return fetchCategoryBySlug(slug);
  };

  const clearCategories = () => {
    setCategories({});
  };

  const value = {
    categories,
    loading,
    error,
    fetchCategoryBySlug,
    fetchAllCategories,
    getCategoryBySlug,
    hasCategoryData,
    updateCategoryBySlug,
    removeCategoryBySlug,
    refreshCategory,
    clearCategories,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
