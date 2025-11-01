import React, { useState, useEffect } from "react";
import contentApi from "../../api/contentApi";
import storageService from "../../services/storageService";

import { AddImage, Remove } from "../../assets/index.js";
import Toast from "../../components/Toast";

const Homepage = ({ hasAccess = true }) => {
  const [formData, setFormData] = useState({
    logo: null,
    logoUrl: null, // Supabase URL
    heroImages: [null, null, null, null, null, null, null, null],
    heroImageUrls: [null, null, null, null, null, null, null, null],
    tryOnTitle: "Style It On You",
    tryOnDescription:
      "Experience our virtual try-on feature and see how each piece looks on you.",
    tryOnImage: null,
    tryOnImageUrl: null,
  });

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

  //helper uli
  const showToast = (message, type = "error", duration = 5000) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, duration);
  };

  const uploadAllImages = async () => {
    setUploading(true);
    const uploadResults = {
      logoUrl: formData.logoUrl,
      heroImageUrls: [...formData.heroImageUrls],
      tryOnImageUrl: formData.tryOnImageUrl,
    };

    try {
      // Upload logo hereee
      if (formData.logo) {
        showToast("Uploading logo...", "loading", 3000);
        const logoResult = await storageService.uploadLogo(formData.logo);
        if (logoResult.success) {
          uploadResults.logoUrl = storageService.getImageUrl(
            logoResult.filePath
          );
        } else {
          throw new Error(`Logo upload failed: ${logoResult.error}`);
        }
      }

      // Upload try-on image heree
      if (formData.tryOnImage) {
        showToast("Uploading try-on image...", "loading", 3000);
        const tryOnResult = await storageService.uploadTryOnImage(
          formData.tryOnImage
        );
        if (tryOnResult.success) {
          uploadResults.tryOnImageUrl = storageService.getImageUrl(
            tryOnResult.filePath
          );
        } else {
          throw new Error(`Try-on image upload failed: ${tryOnResult.error}`);
        }
      }

      // Upload hero images heree
      const heroImagesToUpload = formData.heroImages.filter(
        (img) => img !== null
      );
      if (heroImagesToUpload.length > 0) {
        showToast("Uploading hero images...", "loading", 3000);
        const heroResults = await storageService.uploadMultipleHeroImages(
          formData.heroImages
        );

        heroResults.forEach((result, index) => {
          if (result.success) {
            uploadResults.heroImageUrls[index] = storageService.getImageUrl(
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
    const heroImagesFiltered = imageUrls.heroImageUrls.filter(
      (url) => url !== null
    );

    const data = {
      title: formData.tryOnTitle || null,
      description: formData.tryOnDescription || null,
      logo_url: imageUrls.logoUrl || null,
      hero_images: heroImagesFiltered.length > 0 ? heroImagesFiltered : null,
      promo_image: imageUrls.tryOnImageUrl || null,
    };

    return data;
  };

  // CRUD OPERATIONS -----------

  const fetchContent = async () => {
    setLoading(true);
    try {
      const result = await contentApi.fetchHomepageContent();

      if (result.error) {
        showToast(
          "No existing content found - ready to create new content",
          "warning",
          4000
        );
        setHasExistingContent(false);
        return;
      }

      if (result.data && result.data.message) {
        setHasExistingContent(false);
        setHasUnsavedChanges(false);
        showToast(
          "No existing content found - ready to create new content",
          "warning",
          4000
        );
      } else if (result.data) {
        setHasExistingContent(true);
        setFormData({
          logo: null,
          logoUrl: result.data.logo_url || null,
          heroImages: [null, null, null, null, null, null, null, null],
          heroImageUrls: result.data.hero_images || [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          tryOnTitle: result.data.title || "Style It On You",
          tryOnDescription:
            result.data.description ||
            "Experience our virtual try-on feature and see how each piece looks on you.",
          tryOnImage: null,
          tryOnImageUrl: result.data.promo_image || null,
        });
        setHasUnsavedChanges(false);
        // showMessage("success", "Content loaded successfully");
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
    if (!hasAccess) {
      showToast('You do not have permission to perform this action', 'error');
      return;
    }
    setSaving(true);
    try {
      const hasNewImages =
        formData.logo !== null ||
        formData.heroImages.some((img) => img !== null) ||
        formData.tryOnImage !== null;

      const hasChanges = hasUnsavedChanges || hasNewImages;

      if (!hasExistingContent) {
        showToast("Creating new homepage content...", "loading", 3000);
      } else if (!hasChanges) {
        showToast(
          "No changes detected - content is already up to date",
          "warning",
          4000
        );
        setSaving(false);
        return;
      } else if (hasNewImages && hasUnsavedChanges) {
        showToast(
          "Updating content and uploading new images...",
          "loading",
          3000
        );
      } else if (hasNewImages) {
        showToast("Uploading new images...", "loading", 3000);
      } else {
        showToast("Updating content...", "loading", 3000);
      }

      const imageUrls = await uploadAllImages();

      const contentData = prepareContentDataForSubmission(imageUrls);

      showToast("Saving content data...", "loading", 3000);
      const result = await contentApi.saveHomepageContent(contentData);

      if (result.error) {
        showToast(`Failed to save: ${result.error}`, "error", 6000);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logoUrl: imageUrls.logoUrl,
        heroImageUrls: imageUrls.heroImageUrls,
        tryOnImageUrl: imageUrls.tryOnImageUrl,
        logo: null, // Clear file objects after successful upload
        heroImages: [null, null, null, null, null, null, null, null],
        tryOnImage: null,
      }));

      setHasExistingContent(true);
      setHasUnsavedChanges(false);

      const wasExisting = hasExistingContent;
      if (!wasExisting) {
        showToast("Homepage content created successfully!", "success");
      } else if (hasNewImages && hasUnsavedChanges) {
        showToast(
          "Content updated and new images uploaded successfully!",
          "success"
        );
      } else if (hasNewImages) {
        showToast("New images uploaded successfully!", "success");
      } else {
        showToast("Homepage content updated successfully!", "success");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast(`Save error: ${error.message}`, "error", 6000);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async () => {
    if (!hasAccess) {
      showToast('You do not have permission to perform this action', 'error');
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to delete all homepage content? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const currentContent = await contentApi.fetchHomepageContent();

      let imagesToDelete = [];

      if (currentContent.data && !currentContent.error) {
        // Add logo
        if (currentContent.data.logo_url) {
          const filePath = storageService.extractFilePathFromUrl(
            currentContent.data.logo_url
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }

        // Add hero images
        if (currentContent.data.hero_images) {
          currentContent.data.hero_images.forEach((url) => {
            if (url) {
              const filePath = storageService.extractFilePathFromUrl(url);
              if (filePath) {
                imagesToDelete.push(filePath);
              }
            }
          });
        }

        // Add try-on promotional image
        if (currentContent.data.promo_image) {
          const filePath = storageService.extractFilePathFromUrl(
            currentContent.data.promo_image
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      } else {
        // Fallback

        // Add logo from formData
        if (formData.logoUrl) {
          const filePath = storageService.extractFilePathFromUrl(
            formData.logoUrl
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }

        // Add hero images from formData
        formData.heroImageUrls.forEach((url) => {
          if (url) {
            const filePath = storageService.extractFilePathFromUrl(url);
            if (filePath) {
              imagesToDelete.push(filePath);
            }
          }
        });

        // Add try-on image from formData
        if (formData.tryOnImageUrl) {
          const filePath = storageService.extractFilePathFromUrl(
            formData.tryOnImageUrl
          );
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      }

      // Delete images from Supabase
      if (imagesToDelete.length > 0) {
        showToast("Deleting images from storage...", "loading", 3000);
        await storageService.cleanupOldImages(imagesToDelete);
      }

      showToast("Deleting database record...", "loading", 3000);

      // Get the correct ID from the current content
      const contentId =
        currentContent.data && currentContent.data.id
          ? currentContent.data.id
          : 1;

      const result = await contentApi.deleteHomepageContent(contentId);

      if (result.error && !result.error.includes("not found")) {
        showToast(
          `Failed to delete database record: ${result.error}`,
          "error",
          6000
        );
        return;
      }

      setFormData({
        logo: null,
        logoUrl: null,
        heroImages: [null, null, null, null, null, null, null, null],
        heroImageUrls: [null, null, null, null, null, null, null, null],
        tryOnTitle: "Style It On You",
        tryOnDescription:
          "Experience our virtual try-on feature and see how each piece looks on you.",
        tryOnImage: null,
        tryOnImageUrl: null,
      });
      setHasExistingContent(false);
      showToast("Homepage content and images deleted successfully", "success");
    } catch (error) {
      showToast(`Delete error: ${error.message}`, "error", 6000);
    } finally {
      setLoading(false);
    }
  };

  // Manual cleanup
  const cleanupOrphanedFiles = async () => {
    if (
      !window.confirm(
        "This will attempt to clean up ALL homepage-related image files from storage. Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      showToast("Cleaning up homepage storage folders...", "loading", 3000);

      // Homepage-related folders
      const foldersToClean = [
        "admin/logos",
        "admin/hero/hero_0",
        "admin/hero/hero_1",
        "admin/hero/hero_2",
        "admin/hero/hero_3",
        "admin/hero/hero_4",
        "admin/hero/hero_5",
        "admin/hero/hero_6",
        "admin/hero/hero_7",
        "admin/try-on",
      ];

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

  // EVENT HANDLERS

  const handleLogoUpload = (e) => {
    if (!hasAccess) return;
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setHasUnsavedChanges(true);
    }
  };

  const handleLogoRemove = () => {
    if (!hasAccess) return;
    setFormData((prev) => ({ ...prev, logo: null, logoUrl: null }));
    setHasUnsavedChanges(true);
  };

  const handleHeroImageUpload = (index, e) => {
    if (!hasAccess) return;
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => {
        const newHeroImages = [...prev.heroImages];
        newHeroImages[index] = file;
        return { ...prev, heroImages: newHeroImages };
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleHeroImageRemove = (index) => {
    if (!hasAccess) return;
    setFormData((prev) => {
      const newHeroImages = [...prev.heroImages];
      const newHeroImageUrls = [...prev.heroImageUrls];
      newHeroImages[index] = null;
      newHeroImageUrls[index] = null;
      return {
        ...prev,
        heroImages: newHeroImages,
        heroImageUrls: newHeroImageUrls,
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleTryOnImageUpload = (e) => {
    if (!hasAccess) return;
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, tryOnImage: file }));
      setHasUnsavedChanges(true);
    }
  };

  const handleTryOnImageRemove = () => {
    if (!hasAccess) return;
    setFormData((prev) => ({ ...prev, tryOnImage: null, tryOnImageUrl: null }));
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value) => {
    if (!hasAccess) return;
    setFormData((prev) => ({ ...prev, tryOnTitle: value }));
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (value) => {
    if (!hasAccess) return;
    setFormData((prev) => ({ ...prev, tryOnDescription: value.slice(0, 100) }));
    setHasUnsavedChanges(true);
  };

  const handlePreview = () => {
    // Implement preview logic here
    showToast("Preview functionality coming soon", "warning", 4000);
  };

  // LIFECYCLE

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8 -mt-8 h-full">
      {/* Loading Overlay */}
      {loading && (
        <div className="col-span-2 flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-2 avant text-sm">Loading content...</span>
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

        {/* Logo Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">LOGO</h2>
          <div className="flex items-center space-x-4">
            {/* Make the logo box clickable */}
            <div className="relative">
              <label className="cursor-pointer">
                <div className="w-48 h-24 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                  {formData.logo ? (
                    <img
                      src={URL.createObjectURL(formData.logo)}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Current logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <img
                      src={AddImage}
                      alt="Add image"
                      className="w-8 h-8 opacity-60"
                    />
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={!hasAccess}
                />
              </label>
              {(formData.logo || formData.logoUrl) && (
                <button
                  onClick={handleLogoRemove}
                  disabled={!hasAccess}
                  title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src={Remove} alt="Remove" className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Align button with the box */}
            <div className="flex flex-col justify-center h-24">
              <label className="block">
                <span className={`px-4 py-3 bg-black text-white rounded-lg cursor-pointer uppercase hover:bg-gray-800 transition-colors avantbold text-sm ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Upload New Logo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={!hasAccess}
                />
              </label>
              <p className="text-xs text-gray-500 avant mt-2">
                At least 270x90 px recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">HERO SECTION</h2>
          <div className="flex items-start space-x-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {formData.heroImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Hero ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : formData.heroImageUrls[index] ? (
                      <img
                        src={formData.heroImageUrls[index]}
                        alt={`Hero ${index + 1}`}
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
                      onChange={(e) => handleHeroImageUpload(index, e)}
                      disabled={!hasAccess}
                    />
                  </label>
                  {(image || formData.heroImageUrls[index]) && (
                    <button
                      onClick={() => handleHeroImageRemove(index)}
                      disabled={!hasAccess}
                      title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Try-On Promotional Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">
            TRY-ON PROMOTIONAL
          </h2>

          <div className="flex items-start space-x-4 text-left">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-lg avantbold text-black mb-2">
                  TITLE
                </label>
                <input
                  type="text"
                  value={formData.tryOnTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  disabled={!hasAccess}
                  className="w-64 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black disabled:opacity-50 disabled:cursor-not-allowed"
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
                  value={formData.tryOnDescription}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={100}
                  disabled={!hasAccess}
                  rows={3}
                  className="w-80 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.tryOnDescription.length}/100 characters
                </div>
              </div>
            </div>

            {/* Move the image upload a bit to the left */}
            <div className="flex flex-col items-start space-y-2 -ml-12 relative">
              <label className="cursor-pointer">
                <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                  {formData.tryOnImage ? (
                    <img
                      src={URL.createObjectURL(formData.tryOnImage)}
                      alt="Try-on preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : formData.tryOnImageUrl ? (
                    <img
                      src={formData.tryOnImageUrl}
                      alt="Current try-on image"
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
                  onChange={handleTryOnImageUpload}
                  disabled={!hasAccess}
                />
              </label>
              {(formData.tryOnImage || formData.tryOnImageUrl) && (
                <button
                  onClick={handleTryOnImageRemove}
                  disabled={!hasAccess}
                  title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                  className="absolute -top-2 left-12 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={loading || saving || uploading || !hasAccess}
            title={!hasAccess ? 'You do not have permission to perform this action' : ''}
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
              disabled={loading || saving || uploading || !hasAccess}
              title={!hasAccess ? 'You do not have permission to perform this action' : ''}
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
              <span className="text-green-600 font-medium">Content exists</span>
            ) : (
              <span className="text-orange-600 font-medium">No content found</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            API URL: {import.meta.env.VITE_CONTENT_API ? (
              <span className="text-green-600">✓ Configured</span>
            ) : (
              <span className="text-red-600">✗ Missing VITE_CONTENT_API</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            Endpoint: {import.meta.env.VITE_CONTENT_API}
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

      {/* Toast Component */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default Homepage;
