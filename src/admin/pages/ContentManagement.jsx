import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import categoryApi from "../../api/categoryApi";
import { useCollection } from "../../contexts/CollectionContext";

import { DropDownIconBlack, DropUpIconBlack } from "../../assets/index.js";

const ContentManagement = ({ hasAccess = true }) => {
  const [activeTab, setActiveTab] = useState("homepage");
  const [selectedCategory, setSelectedCategory] = useState("necklaces");
  const [selectedCollection, setSelectedCollection] = useState("kids");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [collectionOptions, setCollectionOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  // Get collections from context
  const { collections, fetchAllCollections } = useCollection();

  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedCategoryData = () => {
    return categoryOptions.find((cat) => cat.value === selectedCategory);
  };

  //tab
  const tabs = [
    { id: "homepage", label: "HOMEPAGE" },
    { id: "categories", label: "CATEGORIES" },
    { id: "collections", label: "COLLECTIONS" },
  ];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setShowCategoryDropdown(false);
        setShowCollectionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryApi.fetchAllCategories();

        if (response.error) {
          throw new Error(response.error);
        }

        if (response.data && Array.isArray(response.data)) {
          const formattedCategories = response.data.map((category) => ({
            value:
              category.name?.toLowerCase() ||
              `category-${category.category_id}`,
            label: category.name,
            id: category.category_id,
          }));

          setCategoryOptions(formattedCategories);

          if (formattedCategories.length > 0 && !selectedCategory) {
            setSelectedCategory(formattedCategories[0].value);
          }
        } else {
          console.warn("Unexpected response structure:", response);
          throw new Error("Invalid response structure from categories API");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        //fallbck
        setCategoryOptions([
          { value: "necklaces", label: "Necklaces", id: 1 },
          { value: "earrings", label: "Earrings", id: 2 },
          { value: "bracelets", label: "Bracelets", id: 3 },
          { value: "rings", label: "Rings", id: 4 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const loadCollections = async () => {
      setCollectionsLoading(true);
      try {
        const fetchedCollections = await fetchAllCollections();

        const collectionsToUse = fetchedCollections || collections || [];

        if (collectionsToUse.length > 0) {
          const formattedCollections = collectionsToUse.map((collection) => ({
            value:
              collection.name?.toLowerCase().replace(/\s+/g, "-") ||
              `collection-${collection.collection_id || collection.id}`,
            label: collection.name,
            id: collection.collection_id || collection.id,
          }));

          setCollectionOptions(formattedCollections);

          if (formattedCollections.length > 0 && !selectedCollection) {
            setSelectedCollection(formattedCollections[0].value);
          }
        } else {
          setCollectionOptions([]);
        }
      } catch (error) {
        console.error("Error loading collections:", error);
        // Fallback
        setCollectionOptions([]);
      } finally {
        setCollectionsLoading(false);
      }
    };

    loadCollections();
  }, []);

  // Update collection options
  useEffect(() => {
    if (collections && collections.length > 0 && !collectionsLoading) {
      const formattedCollections = collections.map((collection) => ({
        value:
          collection.name?.toLowerCase().replace(/\s+/g, "-") ||
          `collection-${collection.collection_id || collection.id}`,
        label: collection.name,
        id: collection.collection_id || collection.id,
      }));

      setCollectionOptions(formattedCollections);

      if (formattedCollections.length > 0 && !selectedCollection) {
        setSelectedCollection(formattedCollections[0].value);
      }
    }
  }, [collections]);

  //keep actuve tab
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/admin/content/categories")) {
      setActiveTab("categories");
    } else if (path.startsWith("/admin/content/collections")) {
      setActiveTab("collections");
    } else if (path.startsWith("/admin/collection")) {
      setActiveTab("collections");
    } else if (path.startsWith("/admin/content")) {
      setActiveTab("homepage");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">CONTENT MANAGEMENT</h1>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Status Tabs with horizontal line */}
          <div className="relative mb-6">
            {/* Long horizontal line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>

            {/* Tabs Container */}
            <div className="flex justify-between items-end">
              {/* Tabs */}
              <div className="flex space-x-8 relative">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);

                      if (tab.id === "homepage") {
                        navigate("/admin/content/homepage");
                      } else if (tab.id === "categories") {
                        const defaultCategory = categoryOptions[0] || {
                          value: "necklaces",
                          id: null,
                        };
                        navigate(
                          `/admin/content/categories/${defaultCategory.value}`,
                          {
                            state: {
                              categoryId: defaultCategory.id,
                              categoryData: defaultCategory,
                            },
                          }
                        );
                      } else if (tab.id === "collections") {
                        const defaultCollection = collectionOptions[0];
                        if (defaultCollection) {
                          navigate(
                            `/admin/content/collections/${defaultCollection.value}`,
                            {
                              state: {
                                collectionId: defaultCollection.id,
                                collectionData: defaultCollection,
                              },
                            }
                          );
                        } else {
                          navigate("/admin/content/collections");
                        }
                      }
                    }}
                    className={`flex text-black items-center space-x-2 pb-3 relative transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "text-black"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="avant font-medium text-sm">
                      {tab.label}
                    </span>

                    {/* Active tab indicator line */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Conditional Dropdown - Only show for Categories tab */}
              {activeTab === "categories" && (
                <div className="pb-3 relative custom-dropdown">
                  <button
                    type="button"
                    onClick={() =>
                      setShowCategoryDropdown(!showCategoryDropdown)
                    }
                    className="flex items-center justify-between px-4 py-2 border-2 text-black border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-40"
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? "Loading..."
                        : categoryOptions.find(
                            (cat) => cat.value === selectedCategory
                          )?.label || "Select Category"}
                    </span>
                    <img
                      src={
                        showCategoryDropdown
                          ? DropUpIconBlack
                          : DropDownIconBlack
                      }
                      alt="dropdown"
                      className="w-4 h-4 opacity-70"
                    />
                  </button>
                  {showCategoryDropdown && !loading && (
                    <div className="absolute top-full left-0 mt-2 w-full text-black bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                      {categoryOptions.map((option, index) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedCategory(option.value);
                            setShowCategoryDropdown(false);
                            setActiveTab("categories");
                            // navigate to the specific category content route with ID
                            navigate(
                              `/admin/content/categories/${option.value}`,
                              {
                                state: {
                                  categoryId: option.id,
                                  categoryData: option,
                                },
                              }
                            );
                          }}
                          className={`w-full px-4 py-2 text-left text-sm avant transition-colors ${
                            selectedCategory === option.value
                              ? "bg-gray-100 font-medium"
                              : ""
                          } ${index === 0 ? "rounded-t-lg" : ""} ${
                            index === categoryOptions.length - 1
                              ? "rounded-b-lg"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              selectedCategory === option.value
                                ? "#f3f4f6"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (selectedCategory !== option.value) {
                              e.target.style.backgroundColor = "#959595";
                              e.target.style.color = "white";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedCategory !== option.value) {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.color = "";
                            }
                          }}
                          type="button"
                          title={`ID: ${option.id || "N/A"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Dropdown - Only show for Collections tab */}
              {activeTab === "collections" && (
                <div className="pb-3 relative custom-dropdown">
                  <button
                    type="button"
                    onClick={() =>
                      setShowCollectionDropdown(!showCollectionDropdown)
                    }
                    className="flex items-center justify-between px-4 py-2 border-2 text-black border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-60"
                    disabled={collectionsLoading}
                  >
                    <span>
                      {collectionsLoading
                        ? "Loading..."
                        : collectionOptions.find(
                            (col) => col.value === selectedCollection
                          )?.label || "Select Collection"}
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
                  {showCollectionDropdown && !collectionsLoading && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white text-black border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                      {collectionOptions.length > 0 ? (
                        collectionOptions.map((option, index) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedCollection(option.value);
                              setShowCollectionDropdown(false);
                              setActiveTab("collections");

                              // Find the full collection data from collections array
                              const fullCollectionData = collections.find(
                                (col) =>
                                  (col.collection_id || col.id) === option.id
                              );

                              // Navigate to the collection content route with full collection data
                              navigate(
                                `/admin/content/collections/${option.value}`,
                                {
                                  state: {
                                    collectionId: option.id,
                                    collectionData: fullCollectionData,
                                  },
                                }
                              );
                            }}
                            className={`w-full px-4 py-2 text-left text-sm avant transition-colors ${
                              selectedCollection === option.value
                                ? "bg-gray-100 font-medium"
                                : ""
                            } ${index === 0 ? "rounded-t-lg" : ""} ${
                              index === collectionOptions.length - 1
                                ? "rounded-b-lg"
                                : ""
                            }`}
                            style={{
                              backgroundColor:
                                selectedCollection === option.value
                                  ? "#f3f4f6"
                                  : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (selectedCollection !== option.value) {
                                e.target.style.backgroundColor = "#959595";
                                e.target.style.color = "white";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedCollection !== option.value) {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.color = "";
                              }
                            }}
                            type="button"
                            title={`ID: ${option.id || "N/A"}`}
                          >
                            {option.label}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm avant text-gray-500">
                          No collections available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-[#000000] rounded-lg overflow-hidden">
            <div className="px-6 py-16 text-center text-gray-500 avant">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
