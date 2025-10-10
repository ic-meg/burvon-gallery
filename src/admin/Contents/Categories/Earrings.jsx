import React, { useState, useEffect } from "react";
import categoryApi from "../../../api/categoryApi.jsx";
import storageService from "../../../services/storageService.js";

import { AddImage, Remove } from "../../../assets/index.js";

const Earrings = () => {
  const [formData, setFormData] = useState({
    earringsImages: [null, null, null, null, null, null, null, null],
    earringsImageUrls: [null, null, null, null, null, null, null, null], // Supabase URLs
    title: "Earrings Collection",
    description:
      "Discover our beautiful collection of earrings crafted with precision and style.",
    promotionalImage: null,
    promotionalImageUrl: null, // Supabase URL
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), duration);
  };

  const uploadAllImages = async () => {
    setUploading(true);
    const uploadResults = {
      earringsImageUrls: [...formData.earringsImageUrls],
      promotionalImageUrl: formData.promotionalImageUrl,
    };

    try {
      if (formData.promotionalImage) {
        showMessage("info", "Uploading promotional image...");
        const promoResult = await storageService.uploadCategoryImage(
          formData.promotionalImage,
          "earrings"
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

      const earringsImagesToUpload = formData.earringsImages.filter(
        (img) => img !== null
      );
      if (earringsImagesToUpload.length > 0) {
        showMessage("info", "Uploading earrings images...");
        const earringsResults =
          await storageService.uploadMultipleCategoryImages(
            formData.earringsImages,
            "earrings"
          );

        earringsResults.forEach((result, index) => {
          if (result.success) {
            uploadResults.earringsImageUrls[index] = storageService.getImageUrl(
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
    const earringsImagesFiltered = imageUrls.earringsImageUrls.filter(
      (url) => url !== null
    );

    const data = {
      category_id: 2, // Earrings category ID
      slug: "earrings",
      title: formData.title || null,
      description: formData.description || null,
      category_images:
        earringsImagesFiltered.length > 0 ? earringsImagesFiltered : null,
      promo_images: imageUrls.promotionalImageUrl || null,
    };

    console.log("Prepared earrings data for backend:", data);
    return data;
  };

  // CRUD OPERATIONS

  const fetchContent = async () => {
    setLoading(true);
    try {
      const result = await categoryApi.fetchCategoryBySlug("earrings");

      if (result.error) {
        showMessage(
          "warning",
          `No existing content found - ready to create new content`
        );
        setHasExistingContent(false);
        return;
      }

      if (result.data && result.data.message) {
        // Backend returned "No category content found"
        setHasExistingContent(false);
        setHasUnsavedChanges(false); // Reset when no content exists
        showMessage(
          "info",
          "No existing content found - ready to create new content"
        );
      } else if (result.data) {
        setHasExistingContent(true);
        setFormData({
          earringsImages: [null, null, null, null, null, null, null, null], // No file objects
          earringsImageUrls: result.data.category_images || [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          title: result.data.title || "Earrings Collection",
          description:
            result.data.description ||
            "Discover our beautiful collection of earrings crafted with precision and style.",
          promotionalImage: null, // No file object
          promotionalImageUrl: result.data.promo_images || null,
        });
        setHasUnsavedChanges(false); // Reset changes tracker when loading fresh data
        showMessage("success", "Content loaded successfully");
      }
    } catch (error) {
      showMessage("error", `Network error: ${error.message}`);
      setHasExistingContent(false);
      setHasUnsavedChanges(false); // Reset on error too
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const hasNewImages =
        formData.earringsImages.some((img) => img !== null) ||
        formData.promotionalImage !== null;

      const hasChanges = hasUnsavedChanges || hasNewImages;

      if (!hasExistingContent) {
        showMessage("info", "Creating new earrings content...");
      } else if (!hasChanges) {
        showMessage(
          "info",
          "No changes detected - content is already up to date"
        );
        setSaving(false);
        return;
      } else if (hasNewImages && hasUnsavedChanges) {
        showMessage("info", "Updating content and uploading new images...");
      } else if (hasNewImages) {
        showMessage("info", "Uploading new images...");
      } else {
        showMessage("info", "Updating content...");
      }

      const imageUrls = await uploadAllImages();

      const contentData = prepareContentDataForSubmission(imageUrls);
      const result = await categoryApi.saveCategoryContent(contentData);

      if (result.error) {
        showMessage("error", `Failed to save: ${result.error}`);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        earringsImageUrls: imageUrls.earringsImageUrls,
        promotionalImageUrl: imageUrls.promotionalImageUrl,
        earringsImages: [null, null, null, null, null, null, null, null],
        promotionalImage: null,
      }));

      setHasExistingContent(true);
      setHasUnsavedChanges(false); 

      const wasExisting = hasExistingContent;
      if (!wasExisting) {
        showMessage("success", "Earrings content created successfully!");
      } else if (hasNewImages && hasUnsavedChanges) {
        showMessage(
          "success",
          "Content updated and new images uploaded successfully!"
        );
      } else if (hasNewImages) {
        showMessage("success", "New images uploaded successfully!");
      } else {
        showMessage("success", "Earrings content updated successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      showMessage("error", `Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all earrings content? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const currentContent = await categoryApi.fetchCategoryBySlug("earrings");

      let imagesToDelete = [];

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

        if (currentContent.data.promo_images) {
          const filePath = storageService.extractFilePathFromUrl(
            currentContent.data.promo_images
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      } else {
        formData.earringsImageUrls.forEach((url) => {
          if (url) {
            const filePath = storageService.extractFilePathFromUrl(url);
            if (filePath) {
              imagesToDelete.push(filePath);
            }
          }
        });

        if (formData.promotionalImageUrl) {
          const filePath = storageService.extractFilePathFromUrl(
            formData.promotionalImageUrl
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      }

      if (imagesToDelete.length > 0) {
        showMessage("info", "Deleting images from storage...");
        const deleteResults = await storageService.cleanupOldImages(
          imagesToDelete
        );
        console.log("Storage cleanup results:", deleteResults);
      }

      showMessage("info", "Deleting database record...");
      const result = await categoryApi.deleteCategoryBySlug("earrings");

      if (result.error && !result.error.includes("not found")) {
        showMessage(
          "error",
          `Failed to delete database record: ${result.error}`
        );
        return;
      }

      setFormData({
        earringsImages: [null, null, null, null, null, null, null, null],
        earringsImageUrls: [null, null, null, null, null, null, null, null],
        title: "Earrings Collection",
        description:
          "Discover our beautiful collection of earrings crafted with precision and style.",
        promotionalImage: null,
        promotionalImageUrl: null,
      });
      setHasExistingContent(false);
      showMessage(
        "success",
        "Earrings content and images deleted successfully"
      );
    } catch (error) {
      showMessage("error", `Delete error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cleanupOrphanedFiles = async () => {
    if (
      !window.confirm(
        "This will attempt to clean up ALL earrings-related image files from storage. Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      showMessage("info", "Cleaning up earrings storage folders...");
      console.log("Starting manual cleanup of earrings storage folders");

      // Storage folders for earrings
      const foldersToClean = [
        "admin/categories/earrings",
        "admin/categories/earrings_0",
        "admin/categories/earrings_1",
        "admin/categories/earrings_2",
        "admin/categories/earrings_3",
        "admin/categories/earrings_4",
        "admin/categories/earrings_5",
        "admin/categories/earrings_6",
        "admin/categories/earrings_7",
      ];

      console.log("Attempting to clean folders:", foldersToClean);

      const deleteResults = [];
      let totalDeleted = 0;

      for (const folderPath of foldersToClean) {
        try {
          console.log(`Cleaning folder: ${folderPath}`);
          const result = await storageService.deleteFolder(folderPath);
          deleteResults.push({ folderPath, ...result });
          if (result.success) {
            totalDeleted += result.deletedCount || 0;
          }
          console.log(`Cleanup result for ${folderPath}:`, result);
        } catch (error) {
          console.log(`Error cleaning folder ${folderPath}:`, error);
          deleteResults.push({
            folderPath,
            success: false,
            error: error.message,
          });
        }
      }

      console.log("All cleanup results:", deleteResults);

      showMessage(
        "success",
        `Cleanup completed! ${totalDeleted} files deleted from ${
          deleteResults.filter((r) => r.success).length
        } folders. Check console for details.`
      );
    } catch (error) {
      console.error("Cleanup error:", error);
      showMessage("error", `Cleanup error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // EVENT HANDLERS

  const handleEarringsImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => {
        const newEarringsImages = [...prev.earringsImages];
        newEarringsImages[index] = file;
        return { ...prev, earringsImages: newEarringsImages };
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleEarringsImageRemove = (index) => {
    setFormData((prev) => {
      const newEarringsImages = [...prev.earringsImages];
      const newEarringsImageUrls = [...prev.earringsImageUrls];
      newEarringsImages[index] = null;
      newEarringsImageUrls[index] = null;
      return {
        ...prev,
        earringsImages: newEarringsImages,
        earringsImageUrls: newEarringsImageUrls,
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
    setFormData((prev) => ({ ...prev, description: value.slice(0, 150) }));
    setHasUnsavedChanges(true);
  };

  const handlePreview = () => {
    console.log("Preview data:", formData);
    showMessage("info", "Preview functionality coming soon");
  };

  // LIFECYCLE

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8 -mt-8 h-full">
      {/* Status Message */}
      {message.text && (
        <div
          className={`col-span-2 p-4 rounded-lg mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : message.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : message.type === "warning"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="avant text-sm font-medium">{message.text}</span>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="text-current hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="col-span-2 flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-2 avant text-sm">
            Loading earrings content...
          </span>
        </div>
      )}

      {/* Left Column - Forms and Inputs */}
      <div className="space-y-8">
        {/* Status indicators */}
        <div className="flex items-center space-x-4 text-sm">
          {hasUnsavedChanges && (
            <span className="text-amber-600 avant font-medium flex items-center">
              ⚠ Unsaved changes
            </span>
          )}
        </div>

        {/* Earrings Carousel Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">
            EARRINGS CAROUSEL
          </h2>
          <div className="flex items-start space-x-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {formData.earringsImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Earring ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : formData.earringsImageUrls[index] ? (
                      <img
                        src={formData.earringsImageUrls[index]}
                        alt={`Earring ${index + 1}`}
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
                      onChange={(e) => handleEarringsImageUpload(index, e)}
                    />
                  </label>
                  {/* Remove button for earrings images */}
                  {(image || formData.earringsImageUrls[index]) && (
                    <button
                      onClick={() => handleEarringsImageRemove(index)}
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
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-64 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black"
                />
              </div>

              <div>
                <label className="block text-lg avantbold text-black mb-2">
                  DESCRIPTION{" "}
                  <span className="text-[#959595] text-sm avant font-normal">
                    Maximum of 150 characters.
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={150}
                  rows={3}
                  className="w-80 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/150 characters
                </div>
              </div>
            </div>

            {/* Move the image upload a bit to the left */}
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
                      alt="Current promotional image"
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
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={handlePreview}
            disabled={loading || saving}
            className="px-6 py-2 bg-transparent border-2 border-gray-400 text-gray-600 rounded-xl hover:border-black hover:text-black transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            PREVIEW
          </button>

          <button
            onClick={saveContent}
            disabled={loading || saving || uploading}
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {(saving || uploading) && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {uploading
              ? "UPLOADING..."
              : saving
              ? "SAVING..."
              : !hasExistingContent
              ? "CREATE CONTENT"
              : hasUnsavedChanges
              ? "SAVE CHANGES"
              : "CONTENT SAVED"}
          </button>

          {/* <button
            onClick={fetchContent}
            disabled={loading || saving || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            REFRESH
          </button> */}

          {hasExistingContent && (
            <button
              onClick={deleteContent}
              disabled={loading || saving || uploading}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              DELETE ALL
            </button>
          )}

          {/* <button
            onClick={cleanupOrphanedFiles}
            disabled={loading || saving || uploading}
            className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CLEANUP STORAGE
          </button> */}
        </div>

        {/* Content Status & Debug Info */}
        {/* <div className="pt-2 space-y-1">
          <p className="text-sm avant text-gray-600">
            Status: {hasExistingContent ? (
              <span className="text-green-600 font-medium">Earrings content exists</span>
            ) : (
              <span className="text-orange-600 font-medium">No earrings content found</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            API URL: {import.meta.env.VITE_CATEGORY_API ? (
              <span className="text-green-600">✓ Configured</span>
            ) : (
              <span className="text-red-600">✗ Missing VITE_CATEGORY_API</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            Endpoint: {import.meta.env.VITE_CATEGORY_API}
          </p>
        </div> */}
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
    </div>
  );
};

export default Earrings;
