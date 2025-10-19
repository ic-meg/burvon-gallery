import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import categoryApi from "../../api/categoryApi.jsx";
import storageService from "../../services/storageService.js";
import Toast from "../../components/Toast";
import { AddImage, Remove } from "../../assets/index.js";

const Categories = () => {
  const { categorySlug } = useParams();
  const location = useLocation();

  const categoryConfig = {
    bracelets: { id: 3, name: "Bracelets", slug: "bracelets" },
    earrings: { id: 1, name: "Earrings", slug: "earrings" },
    necklaces: { id: 2, name: "Necklaces", slug: "necklaces" },
    rings: { id: 4, name: "Rings", slug: "rings" },
  };

  const getCurrentCategory = () => {
    // First check if we have category data from location state (dropdown selection)
    if (location.state?.categoryData) {
      return {
        id: location.state.categoryData.id,
        name: location.state.categoryData.label,
        slug: location.state.categoryData.value,
      };
    }

    // Fallback to URL parameter
    return categoryConfig[categorySlug] || categoryConfig.bracelets;
  };

  const currentCategory = getCurrentCategory();

  // State for form data
  const [formData, setFormData] = useState({
    categoryImages: [null, null, null, null, null, null, null, null],
    categoryImageUrls: [null, null, null, null, null, null, null, null], // Supabase URLs
    title: null,
    description: null,
    promotionalImage: null,
    promotionalImageUrl: null, // Supabase URL
  });

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "loading",
  });

  // Helper function to show toast
  const showToast = (message, type = "error", duration = 5000) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, duration);
  };

  const uploadAllImages = async () => {
    setUploading(true);
    const uploadResults = {
      categoryImageUrls: [...formData.categoryImageUrls],
      promotionalImageUrl: formData.promotionalImageUrl,
    };

    try {
      // Upload promotional image
      if (formData.promotionalImage) {
        showToast("Uploading promotional image...", "loading", 3000);
        const promoResult = await storageService.uploadCategoryImage(
          formData.promotionalImage,
          currentCategory.slug
        );
        if (promoResult.success) {
          uploadResults.promotionalImageUrl = storageService.getImageUrl(
            promoResult.filePath
          );
        } else {
          throw new Error(
            `Promotional image upload failed: ${promoResult.error}`
          );
        }
      }

      // Upload category carousel images
      const categoryImagesToUpload = formData.categoryImages.filter(
        (img) => img !== null
      );
      if (categoryImagesToUpload.length > 0) {
        showToast(
          `Uploading ${currentCategory.name.toLowerCase()} images...`,
          "loading",
          3000
        );
        const categoryResults =
          await storageService.uploadMultipleCategoryImages(
            formData.categoryImages,
            currentCategory.slug
          );

        categoryResults.forEach((result, index) => {
          if (result.success) {
            uploadResults.categoryImageUrls[index] = storageService.getImageUrl(
              result.filePath
            );
          }
        });
      }

      return uploadResults;
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const prepareContentDataForSubmission = (imageUrls) => {
    const categoryImagesFiltered = imageUrls.categoryImageUrls.filter(
      (url) => url !== null
    );

    const data = {
      category_id: currentCategory.id,
      slug: currentCategory.slug,
      title: formData.title || null,
      description: formData.description || null,
      category_images:
        categoryImagesFiltered.length > 0 ? categoryImagesFiltered : null,
      promo_images: imageUrls.promotionalImageUrl || null,
    };

    return data;
  };

  // ===============================
  // CRUD OPERATIONS
  // ===============================

  const fetchContent = async () => {
    setLoading(true);
    try {
      const result = await categoryApi.fetchCategoryBySlug(
        currentCategory.slug
      );

      if (result.error) {
        showToast(
          `No existing content found - ready to create new ${currentCategory.name.toLowerCase()} content`,
          "warning",
          4000
        );
        setHasExistingContent(false);
        setHasUnsavedChanges(false);
        return;
      }

      if (result.data && result.data.message) {
        setHasExistingContent(false);
        setHasUnsavedChanges(false);
        showToast(
          `No existing content found - ready to create new ${currentCategory.name.toLowerCase()} content`,
          "warning",
          4000
        );
      } else if (result.data) {
        setHasExistingContent(true);
        setFormData({
          categoryImages: [null, null, null, null, null, null, null, null], // No file objects
          categoryImageUrls: result.data.category_images || [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          title: result.data.title || "",
          description: result.data.description || "",
          promotionalImage: null,
          promotionalImageUrl: result.data.promo_images || null,
        });
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      showToast(`Network error: ${error.message}`, "error", 6000);
      setHasExistingContent(false);
      setHasUnsavedChanges(false); // Reset on error too
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      // Check any new images to upload
      const hasNewImages =
        formData.categoryImages.some((img) => img !== null) ||
        formData.promotionalImage !== null;

      //tracker para sa unsaved changes
      const hasChanges = hasUnsavedChanges || hasNewImages;

      // If no existing content, ito create operation
      if (!hasExistingContent) {
        showToast(
          `Creating new ${currentCategory.name.toLowerCase()} content...`,
          "loading",
          3000
        );
      } else if (!hasChanges) {
        showToast(
          "No changes detected - content is already up to date",
          "warning",
          4000
        );
        setSaving(false);
        return; // Exit early if no changes
      } else if (hasNewImages && hasUnsavedChanges) {
        showToast(
          `Updating content and uploading new images...`,
          "loading",
          3000
        );
      } else if (hasNewImages) {
        showToast("Uploading new images...", "loading", 3000);
      } else {
        showToast("Updating content...", "loading", 3000);
      }

      // Upload images (itong function is naghhandle both promo and category images)
      const imageUrls = await uploadAllImages();

      // Prepare and save content data
      const contentData = prepareContentDataForSubmission(imageUrls);
      const result = await categoryApi.saveCategoryContent(contentData);

      if (result.error) {
        showToast(`Failed to save: ${result.error}`, "error", 6000);
        return;
      }

      // Update local state with URLs
      setFormData((prev) => ({
        ...prev,
        categoryImageUrls: imageUrls.categoryImageUrls,
        promotionalImageUrl: imageUrls.promotionalImageUrl,
        categoryImages: [null, null, null, null, null, null, null, null], // Clear file objects
        promotionalImage: null,
      }));

      setHasExistingContent(true);
      setHasUnsavedChanges(false);

      // Provide more specific success messages
      const wasExisting = hasExistingContent;
      if (!wasExisting) {
        showToast(
          `${currentCategory.name} content created successfully!`,
          "success"
        );
      } else if (hasNewImages && hasUnsavedChanges) {
        showToast(
          "Content updated and new images uploaded successfully!",
          "success"
        );
      } else if (hasNewImages) {
        showToast("New images uploaded successfully!", "success");
      } else {
        showToast(
          `${currentCategory.name} content updated successfully!`,
          "success"
        );
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast(`Save error: ${error.message}`, "error", 6000);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete all ${currentCategory.name.toLowerCase()} content? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // fetch dito sa API to get current image URLs
      const currentContent = await categoryApi.fetchCategoryBySlug(
        currentCategory.slug
      );

      let imagesToDelete = [];

      // If we have current content from API, use those URLs
      if (currentContent.data && !currentContent.error) {
        if (currentContent.data.category_images) {
          currentContent.data.category_images.forEach((url) => {
            if (url) {
              const filePath = storageService.extractFilePathFromUrl(url);
              if (filePath) {
                imagesToDelete.push(filePath);
              }
            }
          });
        }

        // Add promotional image
        if (currentContent.data.promo_images) {
          const filePath = storageService.extractFilePathFromUrl(
            currentContent.data.promo_images
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      } else {
        // Fallback to formData URLs pag walang API CONTENT

        // Add category images from formData
        formData.categoryImageUrls.forEach((url) => {
          if (url) {
            const filePath = storageService.extractFilePathFromUrl(url);
            if (filePath) {
              imagesToDelete.push(filePath);
            }
          }
        });

        // Add promotional image from formData
        if (formData.promotionalImageUrl) {
          const filePath = storageService.extractFilePathFromUrl(
            formData.promotionalImageUrl
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      }

      // Delete images from Supabase storage first
      if (imagesToDelete.length > 0) {
        showToast("Deleting images from storage...", "loading", 3000);
        await storageService.cleanupOldImages(imagesToDelete);
      }

      showToast("Deleting database record...", "loading", 3000);
      const result = await categoryApi.deleteCategoryBySlug(
        currentCategory.slug
      );

      if (result.error && !result.error.includes("not found")) {
        showToast(
          `Failed to delete database record: ${result.error}`,
          "error",
          6000
        );
        return;
      }

      // Reset form to default state
      setFormData({
        categoryImages: [null, null, null, null, null, null, null, null],
        categoryImageUrls: [null, null, null, null, null, null, null, null],
        title: null,
        description: null,
        promotionalImage: null,
        promotionalImageUrl: null,
      });
      setHasExistingContent(false);
      setHasUnsavedChanges(false);
      showToast(
        `${currentCategory.name} content and images deleted successfully`,
        "success"
      );
    } catch (error) {
      showToast(`Delete error: ${error.message}`, "error", 6000);
    } finally {
      setLoading(false);
    }
  };

  //Manual dito sa pag cleanup ng orphaned files
  const cleanupOrphanedFiles = async () => {
    if (
      !window.confirm(
        `This will attempt to clean up ALL ${currentCategory.name.toLowerCase()}-related image files from storage. Continue?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      showToast(
        `Cleaning up ${currentCategory.name.toLowerCase()} storage folders...`,
        "loading",
        3000
      );

      //Category folder lang muna
      const foldersToClean = [`admin/${currentCategory.slug}`];

      const deleteResults = [];
      let totalDeleted = 0;

      for (const folderPath of foldersToClean) {
        try {
          const result = await storageService.deleteFolder(folderPath);
          deleteResults.push({ folderPath, ...result });
          if (result.success) {
            totalDeleted += result.deletedCount || 0;
          }
        } catch (error) {
          deleteResults.push({
            folderPath,
            success: false,
            error: error.message,
          });
        }
      }

      showToast(
        `Cleanup completed! ${totalDeleted} files deleted from ${
          deleteResults.filter((r) => r.success).length
        } folders.`,
        "success"
      );
    } catch (error) {
      console.error("Cleanup error:", error);
      showToast(`Cleanup error: ${error.message}`, "error", 6000);
    } finally {
      setLoading(false);
    }
  };
  // ===============================

  // EVENT HANDLERS

  //CRUD OPERATIONS
  const handleCategoryImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => {
        const newCategoryImages = [...prev.categoryImages];
        newCategoryImages[index] = file;
        return { ...prev, categoryImages: newCategoryImages };
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleCategoryImageRemove = (index) => {
    setFormData((prev) => {
      const newCategoryImages = [...prev.categoryImages];
      const newCategoryImageUrls = [...prev.categoryImageUrls];
      newCategoryImages[index] = null;
      newCategoryImageUrls[index] = null;
      return {
        ...prev,
        categoryImages: newCategoryImages,
        categoryImageUrls: newCategoryImageUrls,
      };
    });
    setHasUnsavedChanges(true);
  };

  const handlePromotionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, promotionalImage: file }));
      setHasUnsavedChanges(true);
    }
  };

  const handlePromotionalImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      promotionalImage: null,
      promotionalImageUrl: null,
    }));
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value) => {
    setFormData((prev) => ({ ...prev, title: value }));
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value.slice(0, 100) }));
    setHasUnsavedChanges(true);
  };

  const handlePreview = () => {
    showToast("Preview functionality coming soon", "warning", 4000);
  };

  const handleSaveChanges = () => {
    saveContent();
  };

  // dito ilload content
  useEffect(() => {
    fetchContent();
  }, [categorySlug, location.state?.categoryData]); // Re-fetch when category changes

  return (
    <div className="grid grid-cols-2 gap-8 -mt-8 h-full">
      {/* Left Column - Forms and Inputs */}
      <div className="space-y-8">
        {/* Status indicators */}
        <div className="flex items-center space-x-4 text-sm">
          {loading && (
            <span className="text-blue-600 avant font-medium flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading...
            </span>
          )}
          {saving && (
            <span className="text-orange-600 avant font-medium flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
              Saving...
            </span>
          )}
          {uploading && (
            <span className="text-purple-600 avant font-medium flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
              Uploading...
            </span>
          )}
          {!loading && !saving && !uploading && hasUnsavedChanges && (
            <span className="text-amber-600 avant font-medium flex items-center">
              ⚠ Unsaved changes
            </span>
          )}
        </div>

        {/* Category Carousel Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">
            {currentCategory.name.toUpperCase()} CAROUSEL
          </h2>
          <div className="flex items-start space-x-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {formData.categoryImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`${currentCategory.name} ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : formData.categoryImageUrls[index] ? (
                      <img
                        src={formData.categoryImageUrls[index]}
                        alt={`${currentCategory.name} ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={AddImage}
                        alt="Add image"
                        className="w-6 h-6 opacity-60"
                      />
                    )}
                  </div>
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleCategoryImageUpload(index, e)}
                    />
                  </label>
                  {/* Remove button for category images */}
                  {(image || formData.categoryImageUrls[index]) && (
                    <button
                      onClick={() => handleCategoryImageRemove(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125"
                    >
                      <img src={Remove} alt="Remove" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-1">
              <p className="text-xs text-gray-500 avant">
                At least 600x200 px recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Promotional Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">PROMOTIONAL</h2>

          <div className="flex items-start space-x-4 text-left">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-lg avantbold text-black mb-2">
                  TITLE
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Style It On You"
                  className="w-64 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black"
                />
              </div>

              <div>
                <label className="block text-lg avantbold text-black mb-2">
                  DESCRIPTION{" "}
                  <span className="text-[#959595] text-sm avant font-normal">
                    Maximum of 100 characters.
                  </span>
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={100}
                  rows={3}
                  placeholder="e.g., Experience our virtual try-on feature and see how each piece looks on you."
                  className="w-80 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {(formData.description || "").length}/100 characters
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start space-y-2 -ml-12 relative">
              <label className="cursor-pointer">
                <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                  {formData.promotionalImage ? (
                    <img
                      src={URL.createObjectURL(formData.promotionalImage)}
                      alt="Promotional preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : formData.promotionalImageUrl ? (
                    <img
                      src={formData.promotionalImageUrl}
                      alt="Promotional preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={AddImage}
                      alt="Add image"
                      className="w-6 h-6 opacity-60"
                    />
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePromotionalImageUpload}
                />
              </label>
              {/* Remove button for promotional image */}
              {(formData.promotionalImage || formData.promotionalImageUrl) && (
                <button
                  onClick={handlePromotionalImageRemove}
                  className="absolute -top-2 left-12 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125"
                >
                  <img src={Remove} alt="Remove" className="w-4 h-4" />
                </button>
              )}
              <p className="text-xs text-gray-500 avant">
                At least 600x200 px recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            onClick={handlePreview}
            className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-xl hover:bg-black hover:text-white transition-colors avantbold text-sm"
          >
            PREVIEW
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={loading || saving || uploading}
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors avantbold text-sm disabled:opacity-50"
          >
            {saving
              ? "SAVING..."
              : hasExistingContent
              ? "UPDATE CONTENT"
              : "SAVE CHANGES"}
          </button>
          {hasExistingContent && (
            <button
              onClick={deleteContent}
              disabled={loading || saving}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors avantbold text-sm disabled:opacity-50"
            >
              DELETE CONTENT
            </button>
          )}

          {/* <button
            onClick={cleanupOrphanedFiles}
            disabled={loading || saving || uploading}
            className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors avantbold text-sm disabled:opacity-50"
          >
            CLEANUP STORAGE
          </button> */}
        </div>
      </div>

      {/* Right Column - Preview Placeholder */}
      <div className="space-y-4">
        <h2 className="text-left text-5xl bebas text-black">PREVIEW</h2>
        <div className="flex items-center justify-center min-h-96 bg-black rounded-lg">
          <span className="text-2xl bebas text-gray-300">
            Preview content will be displayed here
          </span>
        </div>
      </div>

      {/* Toast Component */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default Categories;
