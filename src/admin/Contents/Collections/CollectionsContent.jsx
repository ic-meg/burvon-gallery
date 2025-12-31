import { useState, useEffect } from "react";
import { useParams, useLocation, useOutletContext } from "react-router-dom";
import { useCollection } from "../../../contexts/CollectionContext";
import storageService from "../../../services/storageService";

import { AddImage, Remove } from "../../../assets/index.js";
import Toast from "../../../components/Toast";

const CollectionsContent = () => {
  const { hasAccess, canEdit, isCSR } = useOutletContext();
  const { collectionSlug } = useParams();
  const location = useLocation();
  const { collections } = useCollection();

  const [collectionData, setCollectionData] = useState(null);
  const [collectionImages, setCollectionImages] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]); // File objects
  const [collectionImageUrls, setCollectionImageUrls] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]); // URL strings
  const [promotionalTitle, setPromotionalTitle] = useState("");
  const [promotionalDescription, setPromotionalDescription] = useState("");
  const [promotionalImage, setPromotionalImage] = useState(null);
  const [promotionalImageUrl, setPromotionalImageUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "loading",
  });

  const showToast = (message, type = "error", duration = 5000) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, duration);
  };

  const resetFormToDefaults = () => {
    setPromotionalTitle("");
    setPromotionalDescription("");
    setPromotionalImage(null);
    setPromotionalImageUrl(null);
    setCollectionImages([null, null, null, null, null, null, null, null]);
    setCollectionImageUrls([null, null, null, null, null, null, null, null]);
    setFormErrors({});
  };

  useEffect(() => {
    if (collectionData) {
    }
  }, [collectionData]);

  // dito hinahandle pag galing sa dropdown sa ContentManagement
  useEffect(() => {
    if (location.state?.collectionData) {
      setCollectionData(location.state.collectionData);
    }
  }, [location.state?.collectionData, location.pathname]);

  // dito nilo-load yung content pag nagbago yung collectionData (pag nagselect sa dropdown)
  useEffect(() => {
    const loadCollectionContent = async () => {
      if (!collectionData?.name) return;

      try {
        //creating slug from collection name
        const collectionSlug = collectionData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const apiUrl = `${
          import.meta.env.VITE_COLLECTION_CONTENT_API
        }${collectionSlug}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
          const contentData = await response.json();

          setHasExistingContent(true);

          //Update dito
          if (contentData.title) {
            setPromotionalTitle(contentData.title);
          }
          if (contentData.description) {
            setPromotionalDescription(contentData.description);
          }

          // dito hina-handle yung images and also ginagawang JSON if needed
          let promoImages = contentData.promo_images;
          if (typeof promoImages === "string") {
            try {
              promoImages = JSON.parse(promoImages);
            } catch (e) {
              promoImages = [];
            }
          }

          if (
            promoImages &&
            Array.isArray(promoImages) &&
            promoImages.length > 0
          ) {
            setPromotionalImageUrl(promoImages[0]); // Store URL, not File
            setPromotionalImage(null); // Clear File object
          } else {
            setPromotionalImageUrl(null);
            setPromotionalImage(null);
          }

          // same dito
          let collectionImages = contentData.collection_image;
          if (typeof collectionImages === "string") {
            try {
              collectionImages = JSON.parse(collectionImages);
            } catch (e) {
              collectionImages = [];
            }
          }

          if (collectionImages && Array.isArray(collectionImages)) {
            const imageUrls = collectionImages;
            const newCollectionImageUrls = [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ];

            imageUrls.forEach((url, index) => {
              if (url && index < newCollectionImageUrls.length) {
                newCollectionImageUrls[index] = url;
              }
            });

            setCollectionImageUrls(newCollectionImageUrls);
            setCollectionImages([
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ]);
          } else {
            setCollectionImageUrls([
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ]);
            setCollectionImages([
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ]);
          }
        } else if (response.status === 404) {
          setHasExistingContent(false);
          resetFormToDefaults();
        } else {
          setHasExistingContent(false);
          resetFormToDefaults();
        }
      } catch (error) {
        setHasExistingContent(false);
        resetFormToDefaults();
      }

      setHasUnsavedChanges(false);
    };

    loadCollectionContent();
  }, [collectionData]);

  // kukunin yung collection data base sa slug or location state or first collection
  useEffect(() => {
    if (
      location.state?.collectionData &&
      location.state.collectionData.collection_id
    ) {
      setCollectionData(location.state.collectionData);
    } else if (location.state?.collectionId && collections?.length > 0) {
      const foundCollection = collections.find(
        (collection) =>
          (collection.collection_id || collection.id) ===
          location.state.collectionId
      );

      setCollectionData(foundCollection);
    } else if (collectionSlug && collections?.length > 0) {
      // Find collection by slug
      const foundCollection = collections.find((collection) => {
        const slug = collection.name?.toLowerCase().replace(/\s+/g, "-");
        return slug === collectionSlug;
      });

      setCollectionData(foundCollection);
    } else if (!collectionSlug && collections?.length > 0) {
      // if no slug, use the  first coll

      setCollectionData(collections[0]);
    } else {
    }
  }, [collectionSlug, location.state, location.key, collections]);

  const handleCollectionImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newCollectionImages = [...collectionImages];
      newCollectionImages[index] = file;
      setCollectionImages(newCollectionImages);
      setHasUnsavedChanges(true);
    }
  };

  const handleCollectionImageRemove = (index) => {
    const newCollectionImages = [...collectionImages];
    const newCollectionImageUrls = [...collectionImageUrls];
    newCollectionImages[index] = null;
    newCollectionImageUrls[index] = null;
    setCollectionImages(newCollectionImages);
    setCollectionImageUrls(newCollectionImageUrls);
    setHasUnsavedChanges(true);
  };

  const handlePromotionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPromotionalImage(file);
      setHasUnsavedChanges(true);
    }
  };

  const handlePromotionalImageRemove = () => {
    setPromotionalImage(null);
    setPromotionalImageUrl(null);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value) => {
    setPromotionalTitle(value);
    setHasUnsavedChanges(true);
    if (formErrors.promotionalTitle) {
      setFormErrors((prev) => ({ ...prev, promotionalTitle: "" }));
    }
  };

  const handleDescriptionChange = (value) => {
    setPromotionalDescription(value.slice(0, 100));
    setHasUnsavedChanges(true);
    if (formErrors.promotionalDescription) {
      setFormErrors((prev) => ({ ...prev, promotionalDescription: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!promotionalTitle.trim()) {
      errors.promotionalTitle =
        "Please enter a promotional title for your collection";
    }

    const hasCollectionImages =
      collectionImages.some((img) => img) ||
      collectionImageUrls.some((url) => url);
    if (!hasCollectionImages) {
      errors.collectionImages =
        "Please add at least one image to the collection carousel";
    }

    // Check if there's a promotional image (either new file or existing URL)
    const hasPromotionalImage = promotionalImage || promotionalImageUrl;
    if (!hasPromotionalImage) {
      errors.promotionalImage =
        "Please add a promotional image for your collection";
    }

    if (!promotionalDescription.trim()) {
      errors.promotionalDescription =
        "Please enter a promotional description for your collection";
    }

    if (promotionalDescription.length > 100) {
      errors.promotionalDescription =
        "Description must be 100 characters or less (currently " +
        promotionalDescription.length +
        " characters)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveContent = async () => {
    if (!hasAccess) {
      showToast('You do not have permission to perform this action', 'error');
      return;
    }
    // Check if collection data is available
    if (!collectionData) {
      showToast(
        "Collection data is not loaded. Please select a collection from the dropdown.",
        "error"
      );
      return;
    }

    // Validate form first
    const isValid = validateForm();

    if (!isValid) {
      const errorCount = Object.keys(formErrors).length;
      if (errorCount > 0) {
        const errorMessages = Object.values(formErrors).join("\n• ");
        showToast(
          `Please fix the following errors:\n• ${errorMessages}`,
          "error",
          8000
        );
      } else {
        showToast("Please complete all required fields before saving", "error");
      }
      return;
    }

    const hasNewImages =
      collectionImages.some((img) => img !== null) || promotionalImage !== null;
    const hasChanges = hasUnsavedChanges || hasNewImages;

    // If existing content and no changes, wag na
    if (hasExistingContent && !hasChanges) {
      showToast("No changes detected - content is already up to date", "error");
      return;
    }

    setIsSaving(true);
    setUploading(hasNewImages);

    try {
      const collectionName = collectionData?.name || "Unknown Collection";
      const collectionId = collectionData?.collection_id || collectionData?.id;

      if (!collectionId) {
        throw new Error("Collection ID is missing. Cannot save content.");
      }

      // Upload promotional image to Supabase (only if it's a new File, not existing URL)
      let promotionalImageUrlResult = null;
      if (promotionalImage) {
        const promotionalResult =
          await storageService.uploadCollectionPromotionalImage(
            promotionalImage,
            collectionId
          );
        if (promotionalResult.success) {
          promotionalImageUrlResult = storageService.getImageUrl(
            promotionalResult.filePath
          );
        } else {
          throw new Error(
            `Failed to upload promotional image: ${promotionalResult.error}`
          );
        }
      } else if (promotionalImageUrl) {
        // Use existing URL
        promotionalImageUrlResult = promotionalImageUrl;
      }

      // upload kapag may bagong image sa carousel
      const carouselImageUrls = [];
      for (let i = 0; i < collectionImages.length; i++) {
        const image = collectionImages[i]; // File object
        const existingUrl = collectionImageUrls[i]; // URL string

        if (image) {
          const carouselResult =
            await storageService.uploadCollectionCarouselImage(
              image,
              collectionId,
              i
            );
          if (carouselResult.success) {
            const imageUrl = storageService.getImageUrl(
              carouselResult.filePath
            );
            carouselImageUrls[i] = imageUrl;
          } else {
            throw new Error(
              `Failed to upload carousel image ${i}: ${carouselResult.error}`
            );
          }
        } else if (existingUrl) {
          // Use existing URL
          carouselImageUrls[i] = existingUrl;
        } else {
          carouselImageUrls[i] = null;
        }
      }

      // Create slug from collection name
      const collectionSlug = collectionName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      // uhmm, match lang sa dto
      const parsedCollectionId = parseInt(collectionId);
      if (isNaN(parsedCollectionId)) {
        throw new Error(
          `Invalid collection ID: ${collectionId}. Expected a numeric value.`
        );
      }

      const payload = {
        slug: collectionSlug,
        collection_id: parsedCollectionId,
        title: promotionalTitle,
        description: promotionalDescription,
        promo_images: promotionalImageUrlResult
          ? [promotionalImageUrlResult]
          : [],
        collection_image: carouselImageUrls.filter((url) => url !== null),
      };

      // Save to collection content API endpoint (using slug, not ID)
      const apiUrl = `${
        import.meta.env.VITE_COLLECTION_CONTENT_API
      }${collectionSlug}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();

        const newCollectionImageUrls = [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ];
        carouselImageUrls.forEach((url, index) => {
          if (url && index < newCollectionImageUrls.length) {
            newCollectionImageUrls[index] = url;
          }
        });

        setCollectionImageUrls(newCollectionImageUrls);
        setCollectionImages([null, null, null, null, null, null, null, null]);
        setPromotionalImageUrl(promotionalImageUrlResult);
        setPromotionalImage(null);

        setHasExistingContent(true);
        setHasUnsavedChanges(false);

        // Provide specific success messages like sa neck
        const wasExisting = hasExistingContent;
        if (!wasExisting) {
          showToast(
            `${collectionName} collection content created successfully!`,
            "success"
          );
        } else if (hasNewImages && hasUnsavedChanges) {
          showToast(
            `${collectionName} content updated and new images uploaded successfully!`,
            "success"
          );
        } else if (hasNewImages) {
          showToast(
            `${collectionName} new images uploaded successfully!`,
            "success"
          );
        } else {
          showToast(
            `${collectionName} content updated successfully!`,
            "success"
          );
        }
      } else {
        const errorText = await response.text();
        console.error("Save failed:", response.status, errorText);

        let errorMessage = `Failed to save content for ${collectionName}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // If response is not JSON, use status-based messages
          switch (response.status) {
            case 400:
              errorMessage = `Invalid data provided for ${collectionName}. Please check your inputs and try again.`;
              break;
            case 401:
              errorMessage = `Authentication failed. Please refresh the page and try again.`;
              break;
            case 403:
              errorMessage = `You don't have permission to save content for ${collectionName}.`;
              break;
            case 404:
              errorMessage = `Collection "${collectionName}" not found. Please select a valid collection.`;
              break;
            case 409:
              errorMessage = `Content for ${collectionName} already exists. Please try updating instead.`;
              break;
            case 413:
              errorMessage = `Image files are too large. Please use smaller images (under 5MB each).`;
              break;
            case 422:
              errorMessage = `Invalid data format. Please check your inputs and try again.`;
              break;
            case 500:
              errorMessage = `Server error occurred while saving ${collectionName}. Please try again later.`;
              break;
            default:
              errorMessage = `Failed to save ${collectionName} content (Error ${response.status}). Please try again.`;
          }
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving collection content:", error);

      // Provide more specific error messages based on error type
      let userMessage = error.message;

      if (error.message.includes("Failed to upload")) {
        userMessage = `Image upload failed for ${collectionName}. Please check your internet connection and try again.`;
      } else if (error.message.includes("Collection ID is missing")) {
        userMessage = `Collection data is incomplete. Please refresh the page and select the collection again.`;
      } else if (error.message.includes("Invalid collection ID")) {
        userMessage = `Invalid collection selected. Please choose a different collection.`;
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch")
      ) {
        userMessage = `Network error occurred. Please check your internet connection and try again.`;
      }

      showToast(userMessage, "error", 8000);
    } finally {
      setIsSaving(false);
      setUploading(false);
    }
  };

  // Delete collection content
  const deleteContent = async () => {
    if (!hasAccess) {
      showToast('You do not have permission to perform this action', 'error');
      return;
    }
    if (!collectionData) {
      showToast(
        "Collection data is not loaded. Cannot delete content.",
        "error"
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete all content for ${collectionData?.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const collectionName = collectionData?.name || "Unknown Collection";

      // Create slug from collection name (same sa save/load operations)
      const collectionSlug = collectionName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const apiUrl = `${
        import.meta.env.VITE_COLLECTION_CONTENT_API
      }${collectionSlug}`;

      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast(
          `${collectionName} collection content deleted successfully!`,
          "success"
        );
        resetFormToDefaults();
        setHasExistingContent(false);
        setHasUnsavedChanges(false);
      } else {
        const errorText = await response.text();
        console.error("Delete failed:", response.status, errorText);

        let errorMessage = `Failed to delete content for ${collectionName}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          switch (response.status) {
            case 400:
              errorMessage = `Invalid request to delete ${collectionName} content.`;
              break;
            case 401:
              errorMessage = `Authentication failed. Please refresh the page and try again.`;
              break;
            case 403:
              errorMessage = `You don't have permission to delete content for ${collectionName}.`;
              break;
            case 404:
              errorMessage = `No content found for ${collectionName} to delete.`;
              break;
            case 500:
              errorMessage = `Server error occurred while deleting ${collectionName} content. Please try again later.`;
              break;
            default:
              errorMessage = `Failed to delete ${collectionName} content (Error ${response.status}). Please try again.`;
          }
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting collection content:", error);

      let userMessage = error.message;

      if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch")
      ) {
        userMessage = `Network error occurred while deleting ${collectionName} content. Please check your internet connection and try again.`;
      }

      showToast(userMessage, "error", 8000);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {};

  if (!collectionData) {
    return (
      <div className="text-center py-8">
        <p className="avant text-gray-500">Loading collection data...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-8 -mt-8 h-full">
      {/* Left Column - Forms and Inputs */}
      <div className="space-y-8">
        {/* Collection Carousel Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">
            {(collectionData?.name || "COLLECTION").toUpperCase()} CAROUSEL
          </h2>
          <div className="flex items-start space-x-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {collectionImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`${collectionData?.name || "Collection"} Item ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : collectionImageUrls[index] ? (
                      <img
                        src={collectionImageUrls[index]}
                        alt={`${collectionData?.name || "Collection"} Item ${
                          index + 1
                        }`}
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
                  <label className={`absolute inset-0 ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleCollectionImageUpload(index, e)}
                      disabled={!canEdit}
                    />
                  </label>
                  {/* Remove button for collection images */}
                  {(image || collectionImageUrls[index]) && canEdit && (
                    <button
                      onClick={() => handleCollectionImageRemove(index)}
                      className="absolute -top-2 left-12 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-125"
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
              {formErrors.collectionImages && (
                <p className="text-red-500 text-xs mt-1 avant">
                  {formErrors.collectionImages}
                </p>
              )}
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
                  value={promotionalTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={`w-64 px-3 py-2 border-2 rounded-lg focus:outline-none avant text-sm text-black disabled:opacity-50 disabled:cursor-not-allowed ${
                    formErrors.promotionalTitle
                      ? "border-red-500"
                      : "border-black"
                  }`}
                  placeholder="Eg. Style It On You"
                  disabled={!canEdit}
                />
                {formErrors.promotionalTitle && (
                  <p className="text-red-500 text-xs mt-1 avant">
                    {formErrors.promotionalTitle}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg avantbold text-black mb-2">
                  DESCRIPTION{" "}
                  <span className="text-[#959595] text-sm avant font-normal">
                    Maximum of 100 characters.
                  </span>
                </label>
                <textarea
                  value={promotionalDescription}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={100}
                  rows={3}
                  className={`w-80 px-3 py-2 border-2 rounded-lg focus:outline-none avant text-sm text-black resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    formErrors.promotionalDescription
                      ? "border-red-500"
                      : "border-black"
                  }`}
                  placeholder="Eg. Experience our virtual try-on feature and see how each piece looks on you."
                  disabled={!canEdit}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.promotionalDescription && (
                    <p className="text-red-500 text-xs avant">
                      {formErrors.promotionalDescription}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 avant ml-2">
                    {promotionalDescription.length}/100
                  </p>
                </div>
              </div>
            </div>

            {/* Move the image upload a bit to the left */}
            <div className="flex flex-col items-start space-y-2 -ml-12 relative">
              <label className={canEdit ? "cursor-pointer" : "cursor-not-allowed"}>
                <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                  {promotionalImage ? (
                    <img
                      src={URL.createObjectURL(promotionalImage)}
                      alt="Promotional preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : promotionalImageUrl ? (
                    <img
                      src={promotionalImageUrl}
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
                  disabled={!canEdit}
                />
              </label>
              {/* Remove button for promotional image */}
              {(promotionalImage || promotionalImageUrl) && canEdit && (
                <button
                  onClick={handlePromotionalImageRemove}
                  className="absolute -top-2 left-12 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-125"
                >
                  <img src={Remove} alt="Remove" className="w-4 h-4" />
                </button>
              )}
              <p className="text-xs text-gray-500 avant">
                At least 600x200 px recommended.
              </p>
              {formErrors.promotionalImage && (
                <p className="text-red-500 text-xs mt-1 avant">
                  {formErrors.promotionalImage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-4 text-sm">
          {hasUnsavedChanges && (
            <span className="text-amber-600 avant font-medium flex items-center">
              ⚠ Unsaved changes
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={handlePreview}
            disabled={loading || isSaving}
            className="px-6 py-2 bg-transparent border-2 border-gray-400 text-gray-600 rounded-xl hover:border-black hover:text-black transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            PREVIEW
          </button>

          <button
            onClick={saveContent}
            disabled={loading || isSaving || uploading || !hasAccess || !canEdit}
            title={!hasAccess ? 'You do not have permission to perform this action' : !canEdit ? 'CSR users cannot edit content' : ''}
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {(isSaving || uploading) && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {uploading
              ? "UPLOADING..."
              : isSaving
              ? "SAVING..."
              : !hasExistingContent
              ? "CREATE CONTENT"
              : hasUnsavedChanges
              ? "SAVE CHANGES"
              : "CONTENT SAVED"}
          </button>

          {hasExistingContent && canEdit && (
            <button
              onClick={deleteContent}
              disabled={loading || isSaving || uploading || !hasAccess}
              title={!hasAccess ? 'You do not have permission to perform this action' : ''}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              DELETE ALL
            </button>
          )}
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

export default CollectionsContent;
