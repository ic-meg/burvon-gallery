import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import storageService from "../services/storageService";
import { uploadImage } from "../config/supabase";

const CollectionContext = createContext();

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
};

// Helper to upload collection image to Supabase
const uploadCollectionImage = async (imageFile, collectionName) => {
  try {
    if (!imageFile) return null;

    const result = await storageService.uploadCategoryImage(
      imageFile,
      `collections/${collectionName.toLowerCase().replace(/\s+/g, "-")}`
    );

    if (result.success) {
      return storageService.getImageUrl(result.filePath);
    }

    return null;
  } catch (error) {
    console.error("Error uploading collection image:", error);
    return null;
  }
};

// Collection API service
const BASE_URL = import.meta.env.VITE_COLLECTIONS_API;

const collectionApi = {
  async fetchAllCollections() {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching collections:", error);
      return { data: null, error: error.message };
    }
  },

  async fetchCollectionById(id) {
    try {
      const response = await fetch(`${BASE_URL}${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      return { data: data.findOne || data, error: null };
    } catch (error) {
      console.error("Error fetching collection:", error);
      return { data: null, error: error.message };
    }
  },

  async createCollection(collectionData) {
    try {
      if (!collectionData.name || !collectionData.name.trim()) {
        throw new Error("Collection name is required");
      }
      if (!collectionData.description || !collectionData.description.trim()) {
        throw new Error("Collection description is required");
      }
      if (!collectionData.image) {
        throw new Error("Collection image is required");
      }

      let imageUrl = null;
      if (collectionData.image) {
        imageUrl = await uploadCollectionImage(
          collectionData.image,
          collectionData.name
        );
      }

      const requestBody = {
        name: collectionData.name.trim(),
        description: collectionData.description.trim(),
        collection_image: imageUrl || "https://via.placeholder.com/400x400?text=Collection+Image",
      };

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { data: data.collection || data, error: null };
    } catch (error) {
      console.error("Error creating collection:", error);
      return { data: null, error: error.message };
    }
  },

  async updateCollection(id, collectionData) {
    try {
      const requestBody = {};

      // Only include fields that are being updated
      if (collectionData.name !== undefined) {
        requestBody.name = collectionData.name.trim();
      }

      if (collectionData.description !== undefined) {
        requestBody.description = collectionData.description.trim();
      }

      if (collectionData.image) {
        // Only upload new image if one is provided
        const imageUrl = await uploadCollectionImage(
          collectionData.image,
          collectionData.name || "collection" // Use provided name or fallback
        );
        requestBody.collection_image = imageUrl;
      }

      const response = await fetch(`${BASE_URL}${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error("Error updating collection:", error);
      const friendlyMessage = error.message.includes("fetch")
        ? "Network error: Unable to connect to server"
        : error.message;
      return { data: null, error: friendlyMessage };
    }
  },

  async deleteCollection(id) {
    try {
      const response = await fetch(`${BASE_URL}${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Backend returns deleted collection data in 'deleteCollection' property
      const data = await response.json();
      return { data: data.deleteCollection || data, error: null };
    } catch (error) {
      console.error("Error deleting collection:", error);
      return { data: null, error: error.message };
    }
  },
};

export const CollectionProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "loading",
  });

  const showToast = (message, type = "loading") => {
    setToast({ show: true, message, type });
    if (type !== "loading") {
      setTimeout(() => {
        setToast({ show: false, message: "", type: "loading" });
      }, 3000);
    }
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "loading" });
  };

  const fetchAllCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await collectionApi.fetchAllCollections();

      if (!response) {
        console.warn("Collection API returned undefined response");
        setCollections([]);
        return [];
      }

      if (response.error) {
        console.warn("Collection API error:", response.error);
        setError(response.error);
        setCollections([]);
        return [];
      } else if (response.data) {
        // Extract collections array from the response data
        const collectionsData = response.data.collections || response.data;

        setCollections(collectionsData);
        return collectionsData;
      } else {
        console.warn("No data in response");
        setCollections([]);
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch collections:", err);
      setError(err.message);
      setCollections([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCollectionById = (id) => {
    return (
      collections.find(
        (collection) => (collection.collection_id || collection.id) === id
      ) || null
    );
  };

  const createCollection = async (collectionData) => {
    try {
      setLoading(true);
      setError(null);
      showToast("Creating collection...", "loading");

      const response = await collectionApi.createCollection(collectionData);

      if (response.error) {
        setError(response.error);
        showToast(response.error, "error");
        return { success: false, error: response.error };
      }

      if (response.data) {
        // Add new collection to state immediately for faster UI update
        setCollections((prev) => [...prev, response.data]);
        showToast("Collection created successfully!", "success");
        return { success: true, data: response.data };
      }

      showToast("Create operation failed", "error");
      return { success: false, error: "Create operation failed" };
    } catch (err) {
      console.error("Failed to create collection:", err);
      setError(err.message);
      showToast(err.message, "error");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update collection
  const updateCollection = async (id, collectionData) => {
    try {
      setLoading(true);
      setError(null);
      showToast("Updating collection...", "loading");

      const response = await collectionApi.updateCollection(id, collectionData);

      if (response.error) {
        setError(response.error);
        showToast(response.error, "error");
        return { success: false, error: response.error };
      }

      if (response.data) {
        setCollections((prev) =>
          prev.map((collection) => {
            if ((collection.collection_id || collection.id) === id) {
              const updatedCollection = { ...collection, ...response.data };

              return updatedCollection;
            }
            return collection;
          })
        );
        showToast("Collection updated successfully!", "success");
        return { success: true, data: response.data };
      }

      showToast("Update operation failed", "error");
      return { success: false, error: "Update operation failed" };
    } catch (err) {
      console.error("Failed to update collection:", err);
      setError(err.message);
      showToast(err.message, "error");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete collection
  const deleteCollection = async (id) => {
    try {
      setLoading(true);
      setError(null);
      showToast("Deleting collection...", "loading");

      const response = await collectionApi.deleteCollection(id);

      if (response.error) {
        setError(response.error);
        showToast(response.error, "error");
        return { success: false, error: response.error };
      }

      if (response.data) {
        setCollections((prev) =>
          prev.filter(
            (collection) =>
              String(collection.collection_id || collection.id) !== String(id)
          )
        );
        showToast("Collection deleted successfully!", "success");
        return { success: true, data: response.data };
      }

      showToast("Delete operation failed", "error");
      return { success: false, error: "Delete operation failed" };
    } catch (err) {
      console.error("Failed to delete collection:", err);
      setError(err.message);
      showToast(err.message, "error");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };


  const clearError = useCallback(() => {
    setError(null);
  }, []);


  useEffect(() => {
    fetchAllCollections();
  }, [fetchAllCollections]);

  const value = {
    collections,
    loading,
    error,
    fetchAllCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    clearError,
    toast,
    showToast,
    hideToast,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
};

export default CollectionProvider;
