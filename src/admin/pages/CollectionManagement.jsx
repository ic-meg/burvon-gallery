import React, { useState, useMemo, useEffect } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import Toast from "../../components/Toast";
import AddCollectionModal from "../../components/modals/AddCollectionModal";
import EditCollectionModal from "../../components/modals/EditCollectionModal";
import DeleteCollectionModal from "../../components/modals/DeleteCollectionModal";
import { useCollection } from "../../contexts/CollectionContext";
import { useProduct } from "../../contexts/ProductContext";

import {
  NextIConBlack,
  PrevIConBlack,
  DropDownIconBlack,
  DropUpIconBlack,
} from "../../assets/index.js";

const CollectionManagement = ({ hasAccess = true, canEdit = true, isCSR = false }) => {
  const {
    collections,
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    clearError,
    toast,
    showToast,
    hideToast,
  } = useCollection();

  const {
    fetchProductsByCollection,
    fetchAllProducts,
    clearProductsByCollection,
    loading: productsLoading,
  } = useProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState("latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [showEditCollectionModal, setShowEditCollectionModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [editCollection, setEditCollection] = useState({
    id: null,
    name: "",
    description: "",
    image: null,
  });
  const [originalCollection, setOriginalCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState({});

  //  loading
  const [localLoading, setLocalLoading] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  const itemsPerPage = 3;

  const allCollections = collections || [];

  const sortOptions = [
    { value: "latest", label: "Latest Collection" },
    { value: "oldest", label: "Oldest Collection" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "most-products", label: "Most Products" },
    { value: "least-products", label: "Least Products" },
  ];

  const closeAllDropdowns = () => {
    setShowSortDropdown(false);
  };

  const fetchCollectionProducts = async (collectionId) => {
    try {
      const products = await fetchProductsByCollection(collectionId);

      if (Array.isArray(products)) {
        const productCounts = {
          necklaces: 0,
          earrings: 0,
          rings: 0,
          bracelets: 0,
          total: products.length,
        };

        products.forEach((product) => {
          const categoryName =
            product.category?.name?.toLowerCase() ||
            product.category?.toLowerCase() ||
            "";

          if (categoryName.includes("necklace")) {
            productCounts.necklaces++;
          } else if (categoryName.includes("earring")) {
            productCounts.earrings++;
          } else if (categoryName.includes("ring")) {
            productCounts.rings++;
          } else if (categoryName.includes("bracelet")) {
            productCounts.bracelets++;
          }
        });

        setCollectionProducts((prev) => ({
          ...prev,
          [collectionId]: productCounts,
        }));

        return productCounts;
      }

      return { necklaces: 0, earrings: 0, rings: 0, bracelets: 0, total: 0 };
    } catch (error) {
      console.error("Error fetching collection products:", error);
      return { necklaces: 0, earrings: 0, rings: 0, bracelets: 0, total: 0 };
    }
  };

  const fetchAllCollectionProducts = async () => {
    if (collections && collections.length > 0) {
      for (const collection of collections) {
        const collectionId = collection.collection_id || collection.id;
        if (collectionId && !collectionProducts[collectionId]) {
          await fetchCollectionProducts(collectionId);
        }
      }
    }
  };

  const refreshCollectionProducts = async (collectionId) => {
    setCollectionProducts((prev) => {
      const updated = { ...prev };
      delete updated[collectionId];
      return updated;
    });

    clearProductsByCollection(collectionId);

    // Fetch fresh data
    await fetchCollectionProducts(collectionId);
  };

  const handleCollectionChange = (field, value) => {
    setNewCollection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditCollectionChange = (field, value) => {
    setEditCollection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (file) => {
    setNewCollection((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleEditImageUpload = (file) => {
    setEditCollection((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleAddCollection = async () => {
    if (!newCollection.name.trim()) {
      alert("Please enter a collection name");
      return;
    }

    if (!newCollection.description.trim()) {
      alert("Please enter a collection description");
      return;
    }

    if (!newCollection.image) {
      alert("Please upload a collection image");
      return;
    }

    setLocalLoading((prev) => ({ ...prev, add: true }));

    setShowAddCollectionModal(false);
    setNewCollection({
      name: "",
      description: "",
      image: null,
    });

    const result = await createCollection(newCollection);

    setLocalLoading((prev) => ({ ...prev, add: false }));

    if (!result.success) {
      console.error("Failed to create collection:", result.error);
    }
  };

  const handleEditClick = (collection) => {
    const originalData = {
      name: collection.name,
      description: collection.description,
      image: collection.collection_image,
    };

    setOriginalCollection(originalData);
    setEditCollection({
      id: collection.collection_id || collection.id,
      name: collection.name,
      description: collection.description,
      image: null,
    });
    setShowEditCollectionModal(true);
  };

  const handleUpdateCollection = async () => {
    if (!editCollection.name.trim()) {
      alert("Please enter a collection name");
      return;
    }

    if (!editCollection.description.trim()) {
      alert("Please enter a collection description");
      return;
    }

    const currentCollection = allCollections.find(
      (col) => (col.collection_id || col.id) === editCollection.id
    );

    const hasExistingImage =
      currentCollection?.collection_image &&
      !currentCollection.collection_image.includes("PLACEHOLDER") &&
      !currentCollection.collection_image.includes("DEFAULT");

    if (!editCollection.image && !hasExistingImage) {
      alert("Please upload a collection image");
      return;
    }

    const hasNameChanged = editCollection.name !== originalCollection?.name;
    const hasDescriptionChanged =
      editCollection.description !== originalCollection?.description;
    const hasImageChanged = editCollection.image !== null; // New image uploaded

    if (!hasNameChanged && !hasDescriptionChanged && !hasImageChanged) {
      alert(
        "No changes detected. Please modify the collection details before updating."
      );
      return;
    }

    setLocalLoading((prev) => ({ ...prev, edit: true }));

    const updateData = {};

    if (hasNameChanged) {
      updateData.name = editCollection.name;
    }

    if (hasDescriptionChanged) {
      updateData.description = editCollection.description;
    }

    if (hasImageChanged) {
      updateData.image = editCollection.image;
    }

    setShowEditCollectionModal(false);
    setEditCollection({
      id: null,
      name: "",
      description: "",
      image: null,
    });
    setOriginalCollection(null);

    const result = await updateCollection(editCollection.id, updateData);

    setLocalLoading((prev) => ({ ...prev, edit: false }));

    if (!result.success) {
      console.error("Failed to update collection:", result.error);
    } else {
   
      if (editCollection.id) {
        await refreshCollectionProducts(editCollection.id);

        await fetchAllProducts();
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditCollectionModal(false);
    setEditCollection({
      id: null,
      name: "",
      description: "",
      image: null,
    });
    setOriginalCollection(null);
  };

  const handleDeleteClick = (collection) => {
    setSelectedCollection(collection);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCollection) return;

    setLocalLoading((prev) => ({ ...prev, delete: true }));

    setShowDeleteConfirmModal(false);
    setSelectedCollection(null);

    const result = await deleteCollection(
      selectedCollection.collection_id || selectedCollection.id
    );

    setLocalLoading((prev) => ({ ...prev, delete: false }));

    if (!result.success) {
      console.error("Failed to delete collection:", result.error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setSelectedCollection(null);
  };

  const handleManageProductsClick = (collection) => {
    const collectionId = collection.collection_id || collection.id;
    const collectionName = collection.name;

    sessionStorage.setItem(
      "selectedCollection",
      JSON.stringify({
        id: collectionId,
        name: collectionName,
      })
    );

    window.location.href = "/admin/products";
  };

  // Fetch collection products when collections change
  useEffect(() => {
    if (collections && collections.length > 0) {
      fetchAllCollectionProducts();
    }
  }, [collections.length]); // Using collections.length to avoid infinite loops

  // Calculate product kung ilan na per collection
  const totalCollections = allCollections.length;
  const totalProducts = allCollections.reduce((sum, collection) => {
    const collectionId = collection.collection_id || collection.id;
    const products = collectionProducts[collectionId];

    if (products && products.total) {
      return sum + products.total;
    }

    //backup
    if (collection.products && typeof collection.products === "object") {
      return (
        sum + Object.values(collection.products).reduce((a, b) => a + b, 0)
      );
    }
    return sum;
  }, 0);

  const filteredAndSortedCollections = useMemo(() => {
    let filtered = allCollections;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (collection) =>
          collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (collection.description &&
            collection.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case "latest":
          return (
            new Date(b.created_at || b.createdAt) -
            new Date(a.created_at || a.createdAt)
          );
        case "oldest":
          return (
            new Date(a.created_at || a.createdAt) -
            new Date(b.created_at || b.createdAt)
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "most-products":
          const aId = a.collection_id || a.id;
          const bId = b.collection_id || b.id;
          const totalA =
            collectionProducts[aId]?.total ||
            (a.products
              ? Object.values(a.products).reduce((sum, count) => sum + count, 0)
              : 0);
          const totalB =
            collectionProducts[bId]?.total ||
            (b.products
              ? Object.values(b.products).reduce((sum, count) => sum + count, 0)
              : 0);
          return totalB - totalA;
        case "least-products":
          const cId = a.collection_id || a.id;
          const dId = b.collection_id || b.id;
          const totalC =
            collectionProducts[cId]?.total ||
            (a.products
              ? Object.values(a.products).reduce((sum, count) => sum + count, 0)
              : 0);
          const totalD =
            collectionProducts[dId]?.total ||
            (b.products
              ? Object.values(b.products).reduce((sum, count) => sum + count, 0)
              : 0);
          return totalC - totalD;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedSort]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedCollections.length / itemsPerPage
  );
  const paginatedCollections = filteredAndSortedCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        closeAllDropdowns();
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
  }, [searchQuery, selectedSort]);

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header with Search */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">COLLECTION MANAGEMENT</h1>

            {/* Search Bar aligned with header */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Collection"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-black"
              />
            </div>
          </div>

          {/* Filter Controls and Stats */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-8">
              {/* Sort Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowSortDropdown(!showSortDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-48"
                >
                  <span className="text-black">
                    {
                      sortOptions.find((sort) => sort.value === selectedSort)
                        ?.label
                    }
                  </span>
                  <img
                    src={showSortDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {sortOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSort(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedSort === option.value
                            ? "bg-gray-100 font-medium"
                            : ""
                        } ${index === 0 ? "rounded-t-lg" : ""} ${
                          index === sortOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedSort !== option.value) {
                            e.target.style.backgroundColor = "#959595";
                            e.target.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSort !== option.value) {
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

              {/* Stats */}
              <div className="text-black">
                <span className="text-lg avantbold">TOTAL COLLECTIONS: </span>
                <span className="text-lg bebas">{totalCollections}</span>
              </div>
              <div className="text-black">
                <span className="text-lg avantbold">TOTAL PRODUCTS: </span>
                <span className="text-lg bebas">{totalProducts}</span>
              </div>
            </div>

            {/* Add Collection Button */}
            <button
              onClick={() => setShowAddCollectionModal(true)}
              disabled={!canEdit}
              title={!canEdit ? (isCSR ? 'CSR users can view but not modify collections' : 'You do not have permission to perform this action') : ''}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold uppercase text-sm font-medium"
            >
              Add Collection
            </button>
          </div>
        </div>
      </div>

      {/* Collections Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Collections Grid */}
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="p-6">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-4"></div>
                  <span className="avant text-black">
                    Loading collections...
                  </span>
                </div>
              )}

              {!loading && allCollections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="avant text-gray-500 text-lg mb-4">
                    No collections found
                  </p>
                  <button
                    onClick={() => setShowAddCollectionModal(true)}
                    disabled={!canEdit}
                    title={!canEdit ? (isCSR ? 'CSR users can view but not modify collections' : 'You do not have permission to perform this action') : ''}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avant text-sm font-medium"
                  >
                    Add Your First Collection
                  </button>
                </div>
              )}

              {!loading &&
                allCollections.length > 0 &&
                paginatedCollections.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="avant text-gray-500 text-lg mb-4">
                      No collections match your search criteria
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSort("latest");
                      }}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

              {!loading && paginatedCollections.length > 0 && (
                <div className="space-y-6 mb-6">
                  {paginatedCollections.map((collection) => (
                    <div
                      key={collection.collection_id || collection.id}
                      className="flex items-center space-x-6 p-4 border border-gray-300 rounded-lg"
                    >
                      {/* Collection Image */}
                      <div className="w-72 h-48 bg-[#1F1F21] rounded-lg overflow-hidden flex-shrink-0">
                        {(collection.collection_image || collection.image) &&
                        !(
                          collection.collection_image || collection.image
                        ).includes("PLACEHOLDER") &&
                        !(
                          collection.collection_image || collection.image
                        ).includes("DEFAULT") ? (
                          <img
                            src={
                              collection.collection_image || collection.image
                            }
                            alt={collection.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full bg-[#1F1F21] flex items-center justify-center text-white avant text-sm text-center p-4"
                          style={{
                            display:
                              (collection.collection_image ||
                                collection.image) &&
                              !(
                                collection.collection_image || collection.image
                              ).includes("PLACEHOLDER") &&
                              !(
                                collection.collection_image || collection.image
                              ).includes("DEFAULT")
                                ? "none"
                                : "flex",
                          }}
                        >
                          COLLECTION IMAGE PLACEHOLDER
                        </div>
                      </div>

                      {/* Collection Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl bebas text-black">
                            {collection.name}
                          </h3>
                          <span className="text-xs avant text-gray-500">
                            Created:{" "}
                            {new Date(
                              collection.created_at || collection.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 avant text-sm mb-4">
                          {collection.description}
                        </p>

                        {/* Product Count Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-4">
                          <div className="text-center p-3 border border-gray-200 rounded">
                            <div className="text-xs avant text-gray-600 mb-1">
                              Necklaces
                            </div>
                            <div className="text-xl bebas text-black">
                              {(() => {
                                const collectionId =
                                  collection.collection_id || collection.id;
                                const products =
                                  collectionProducts[collectionId];
                                if (productsLoading && !products) {
                                  return (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mx-auto"></div>
                                  );
                                }
                                return products?.necklaces !== undefined
                                  ? products.necklaces
                                  : collection.products?.necklaces || 0;
                              })()}
                            </div>
                          </div>
                          <div className="text-center p-3 border border-gray-200 rounded">
                            <div className="text-xs avant text-gray-600 mb-1">
                              Earrings
                            </div>
                            <div className="text-xl bebas text-black">
                              {(() => {
                                const collectionId =
                                  collection.collection_id || collection.id;
                                const products =
                                  collectionProducts[collectionId];
                                return (
                                  products?.earrings ||
                                  collection.products?.earrings ||
                                  0
                                );
                              })()}
                            </div>
                          </div>
                          <div className="text-center p-3 border border-gray-200 rounded">
                            <div className="text-xs avant text-gray-600 mb-1">
                              Rings
                            </div>
                            <div className="text-xl bebas text-black">
                              {(() => {
                                const collectionId =
                                  collection.collection_id || collection.id;
                                const products =
                                  collectionProducts[collectionId];
                                return (
                                  products?.rings ||
                                  collection.products?.rings ||
                                  0
                                );
                              })()}
                            </div>
                          </div>
                          <div className="text-center p-3 border border-gray-200 rounded">
                            <div className="text-xs avant text-gray-600 mb-1">
                              Bracelets
                            </div>
                            <div className="text-xl bebas text-black">
                              {(() => {
                                const collectionId =
                                  collection.collection_id || collection.id;
                                const products =
                                  collectionProducts[collectionId];
                                return (
                                  products?.bracelets ||
                                  collection.products?.bracelets ||
                                  0
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3">
                        <button
                          onClick={() => handleEditClick(collection)}
                          disabled={!canEdit}
                          title={!canEdit ? (isCSR ? 'CSR users can view but not modify collections' : 'You do not have permission to perform this action') : ''}
                          className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors avant text-sm font-medium whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleManageProductsClick(collection)}
                          disabled={!canEdit}
                          title={!canEdit ? (isCSR ? 'CSR users can view but not modify collections' : 'You do not have permission to perform this action') : ''}
                          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avant text-sm font-medium whitespace-nowrap"
                        >
                          Manage Products
                        </button>
                        <button
                          onClick={() => handleDeleteClick(collection)}
                          disabled={!canEdit}
                          title={!canEdit ? (isCSR ? 'CSR users can view but not modify collections' : 'You do not have permission to perform this action') : ''}
                          className="px-6 py-2 bg-transparent border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors avant text-sm font-medium whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading &&
                paginatedCollections.length > 0 &&
                totalPages > 1 && (
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
                        <img
                          src={PrevIConBlack}
                          alt="Prev"
                          className="w-5 h-5"
                        />
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
                        <img
                          src={NextIConBlack}
                          alt="Next"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Collection Modal */}
      <AddCollectionModal
        show={showAddCollectionModal}
        onClose={() => setShowAddCollectionModal(false)}
        newCollection={newCollection}
        onCollectionChange={handleCollectionChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleAddCollection}
        loading={localLoading.add}
      />

      {/* Edit Collection Modal */}
      <EditCollectionModal
        show={showEditCollectionModal}
        onClose={handleCloseEditModal}
        editCollection={editCollection}
        onCollectionChange={handleEditCollectionChange}
        onImageUpload={handleEditImageUpload}
        onSubmit={handleUpdateCollection}
        loading={localLoading.edit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCollectionModal
        show={showDeleteConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        selectedCollection={selectedCollection}
        loading={localLoading.delete}
      />

      {/* Error Display */}
      {error && (
        <div className="fixed top-24 right-6 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span className="avant text-sm">{error}</span>
            <button
              onClick={clearError}
              className="ml-4 text-white hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default CollectionManagement;
