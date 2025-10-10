import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useCollection } from "../../../contexts/CollectionContext";
import storageService from "../../../services/storageService";

import { AddImage, Remove } from "../../../assets/index.js";

const CollectionsContent = () => {
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
  const [promotionalTitle, setPromotionalTitle] = useState("Style It On You");
  const [promotionalDescription, setPromotionalDescription] = useState(
    "Experience our virtual try-on feature and see how each piece looks on you."
  );
  const [promotionalImage, setPromotionalImage] = useState(null); // File object
  const [promotionalImageUrl, setPromotionalImageUrl] = useState(null); // URL string
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log("CollectionData updated:", collectionData);
    if (collectionData) {
      // console.log('Collection ID:', collectionData.collection_id || collectionData.id);
      // console.log('Collection Name:', collectionData.name);
      // console.log('Collection Keys:', Object.keys(collectionData));
    }
  }, [collectionData]);

  // dito hinahandle pag galing sa dropdown sa ContentManagement
  useEffect(() => {
    if (location.state?.collectionData) {
      console.log(
        "Location state changed, updating collection data:",
        location.state.collectionData
      );
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
          import.meta.env.VITE_COLLECTION_CONTENT_API ||
          "http://localhost:3000/content/collection/"
        }${collectionSlug}`;
        console.log("Loading content from API URL:", apiUrl);
        console.log("Using collection slug:", collectionSlug);

        const response = await fetch(apiUrl);

        if (response.ok) {
          const contentData = await response.json();
          console.log("Loaded collection content:", contentData);
          console.log("Loaded promo_images:", contentData.promo_images);
          console.log("Loaded collection_image:", contentData.collection_image);

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
              console.log("Parsed promo_images from string:", promoImages);
            } catch (e) {
              console.error("Failed to parse promo_images:", e);
              promoImages = [];
            }
          }

          if (
            promoImages &&
            Array.isArray(promoImages) &&
            promoImages.length > 0
          ) {
            console.log("Setting promotional image URL:", promoImages[0]);
            setPromotionalImageUrl(promoImages[0]); // Store URL, not File
            setPromotionalImage(null); // Clear File object
          } else {
            console.log("No promotional images found or invalid format");
            setPromotionalImageUrl(null);
            setPromotionalImage(null);
          }

          // same dito
          let collectionImages = contentData.collection_image;
          if (typeof collectionImages === "string") {
            try {
              collectionImages = JSON.parse(collectionImages);
              console.log(
                "Parsed collection_image from string:",
                collectionImages
              );
            } catch (e) {
              console.error("Failed to parse collection_image:", e);
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

            console.log(
              "Setting collection image URLs:",
              newCollectionImageUrls
            );
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
            console.log("No collection images found or invalid format");
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
          console.log("No existing content found for this collection");
          setHasExistingContent(false);
          setPromotionalTitle("Style It On You");
          setPromotionalDescription(
            "Experience our virtual try-on feature and see how each piece looks on you."
          );
        } else {
          console.error("Failed to load collection content:", response.status);
          setHasExistingContent(false);
        }
      } catch (error) {
        console.error("Error loading collection content:", error);
        setHasExistingContent(false);
      }

      setHasUnsavedChanges(false);
    };

    loadCollectionContent();
  }, [collectionData]);

  // kukunin yung collection data base sa slug or location state or first collection
  useEffect(() => {
    console.log("CollectionsContent useEffect triggered");
    console.log("collectionSlug:", collectionSlug);
    console.log("location.state:", location.state);
    console.log("location.key:", location.key); // This changes on navigation
    console.log("collections:", collections);

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
      console.log("Found collection by ID:", foundCollection);
      setCollectionData(foundCollection);
    } else if (collectionSlug && collections?.length > 0) {
      // Find collection by slug
      const foundCollection = collections.find((collection) => {
        const slug = collection.name?.toLowerCase().replace(/\s+/g, "-");
        return slug === collectionSlug;
      });
      console.log("Found collection by slug:", foundCollection);
      setCollectionData(foundCollection);
    } else if (!collectionSlug && collections?.length > 0) {
      // If no slug provided, use the first collection as default
      console.log("Using first collection as default:", collections[0]);
      setCollectionData(collections[0]);
    } else {
      console.log(
        "No collection data available - waiting for collections to load..."
      );
    }
  }, [collectionSlug, location.state, location.key, collections]);

  //hanlesd uplooad ng collection carousel image
  const handleCollectionImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newCollectionImages = [...collectionImages];
      newCollectionImages[index] = file;
      setCollectionImages(newCollectionImages);
      setHasUnsavedChanges(true);
    }
  };

  // Handle collection image removal
  const handleCollectionImageRemove = (index) => {
    const newCollectionImages = [...collectionImages];
    const newCollectionImageUrls = [...collectionImageUrls];
    newCollectionImages[index] = null;
    newCollectionImageUrls[index] = null;
    setCollectionImages(newCollectionImages);
    setCollectionImageUrls(newCollectionImageUrls);
    setHasUnsavedChanges(true);
  };

  // Handle promotional image upload
  const handlePromotionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPromotionalImage(file);
      setHasUnsavedChanges(true);
    }
  };

  // Handle promotional image removal
  const handlePromotionalImageRemove = () => {
    setPromotionalImage(null);
    setPromotionalImageUrl(null);
    setHasUnsavedChanges(true);
  };

  // Handle title and description changes
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

  // Form validation
  const validateForm = () => {
    console.log("Validating form...");
    console.log("promotionalTitle:", promotionalTitle);
    console.log("promotionalDescription:", promotionalDescription);
    console.log("promotionalImage:", promotionalImage);

    const errors = {};

    if (!promotionalTitle.trim()) {
      errors.promotionalTitle = "Promotional title is required";
    }

    if (!collectionImages.some((img) => img)) {
      errors.collectionImages = "At least one collection image is required";
    }

    if (!promotionalImage) {
      errors.promotionalImage = "Promotional image is required";
    }

    if (!promotionalDescription.trim()) {
      errors.promotionalDescription = "Promotional description is required";
    }

    if (promotionalDescription.length > 100) {
      errors.promotionalDescription =
        "Description must be 100 characters or less";
    }

    console.log("Validation errors:", errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveContent = async () => {
    console.log("saveContent called");

    // Check if collection data is available
    if (!collectionData) {
      alert(
        "Collection data is not loaded. Please select a collection from the dropdown."
      );
      // console.log('No collection data available');
      return;
    }

    // console.log('Collection data available:', collectionData);

    // Validate form first
    const isValid = validateForm();
    // console.log('Form validation result:', isValid);
    // console.log('Form errors:', formErrors);

    if (!isValid) {
      alert("Please fix the form errors before saving.");
      return;
    }

    // Check if there are any new images to upload or changes to save
    const hasNewImages =
      collectionImages.some((img) => img !== null) || promotionalImage !== null;
    const hasChanges = hasUnsavedChanges || hasNewImages;

    // If existing content and no changes, wag na
    if (hasExistingContent && !hasChanges) {
      alert("No changes detected - content is already up to date");
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

      console.log("Starting image uploads to Supabase...");

      // Upload promotional image to Supabase (only if it's a new File, not existing URL)
      let promotionalImageUrlResult = null;
      if (promotionalImage) {
        // console.log("Uploading new promotional image...");
        const promotionalResult =
          await storageService.uploadCollectionPromotionalImage(
            promotionalImage,
            collectionId
          );
        if (promotionalResult.success) {
          promotionalImageUrlResult = storageService.getImageUrl(
            promotionalResult.filePath
          );
          console.log("Promotional image uploaded:", promotionalImageUrlResult);
        } else {
          throw new Error(
            `Failed to upload promotional image: ${promotionalResult.error}`
          );
        }
      } else if (promotionalImageUrl) {
        // Use existing URL
        promotionalImageUrlResult = promotionalImageUrl;
        console.log(
          "Using existing promotional image URL:",
          promotionalImageUrlResult
        );
      }

      // upload kapag may bagong image sa carousel
      const carouselImageUrls = [];
      for (let i = 0; i < collectionImages.length; i++) {
        const image = collectionImages[i]; // File object
        const existingUrl = collectionImageUrls[i]; // URL string

        if (image) {
          // console.log(`Uploading new carousel image ${i}...`);
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
            // console.log(`Carousel image ${i} uploaded:`, imageUrl);
          } else {
            throw new Error(
              `Failed to upload carousel image ${i}: ${carouselResult.error}`
            );
          }
        } else if (existingUrl) {
          // Use existing URL
          carouselImageUrls[i] = existingUrl;
          console.log(`Using existing carousel image ${i} URL:`, existingUrl);
        } else {
          carouselImageUrls[i] = null;
        }
      }

      console.log("All images uploaded, creating API payload...");

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

      // console.log("API Payload:", payload);
      // console.log("Payload promo_images:", payload.promo_images);
      // console.log("Payload collection_image:", payload.collection_image);
      // console.log("Raw promotionalImageUrlResult:", promotionalImageUrlResult);
      // console.log("Raw carouselImageUrls:", carouselImageUrls);

      // Save to collection content API endpoint (using slug, not ID)
      const apiUrl = `${
        import.meta.env.VITE_COLLECTION_CONTENT_API
      }${collectionSlug}`;
      // console.log("Saving to API URL:", apiUrl);
      // console.log("Using collection slug:", collectionSlug);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Save successful:", result);

        // console.log("carouselImageUrls to save:", carouselImageUrls);
        // console.log(
        //   "promotionalImageUrlResult to save:",
        //   promotionalImageUrlResult
        // );

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

        console.log(
          "Updated collectionImageUrls state:",
          newCollectionImageUrls
        );

        // Update form state with URLs and clear File objects
        setCollectionImageUrls(newCollectionImageUrls);
        setCollectionImages([null, null, null, null, null, null, null, null]);
        setPromotionalImageUrl(promotionalImageUrlResult);
        setPromotionalImage(null);

        // Update state flags
        setHasExistingContent(true);
        setHasUnsavedChanges(false);

        // Provide specific success messages like sa neck
        const wasExisting = hasExistingContent;
        if (!wasExisting) {
          alert(`${collectionName} collection content created successfully!`);
        } else if (hasNewImages && hasUnsavedChanges) {
          alert(
            `${collectionName} content updated and new images uploaded successfully!`
          );
        } else if (hasNewImages) {
          alert(`${collectionName} new images uploaded successfully!`);
        } else {
          alert(`${collectionName} content updated successfully!`);
        }
      } else {
        const errorText = await response.text();
        console.error("Save failed:", response.status, errorText);
        throw new Error(
          `Failed to save: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error saving collection content:", error);
      alert(`Error saving collection content: ${error.message}`);
    } finally {
      setIsSaving(false);
      setUploading(false);
    }
  };

  // Delete collection content
  const deleteContent = async () => {
    if (!collectionData) {
      alert("Collection data is not loaded. Cannot delete content.");
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

      // console.log("Collection data for delete:", collectionData);
      // console.log("Collection name:", collectionName);
      // console.log("Generated slug:", collectionSlug);

      const apiUrl = `${
        import.meta.env.VITE_COLLECTION_CONTENT_API
      }${collectionSlug}`;
      // console.log("Deleting at API URL:", apiUrl);
      // console.log("Using collection slug:", collectionSlug);

      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        // console.log("Delete successful");
        alert(`${collectionName} collection content deleted successfully!`);
        setPromotionalTitle("Style It On You");
        setPromotionalDescription(
          "Experience our virtual try-on feature and see how each piece looks on you."
        );
        setPromotionalImage(null);
        setPromotionalImageUrl(null);
        setCollectionImages([null, null, null, null, null, null, null, null]);
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
        setFormErrors({});
        setHasExistingContent(false);
        setHasUnsavedChanges(false);
      } else {
        const errorText = await response.text();
        console.error("Delete failed:", response.status, errorText);
        throw new Error(
          `Failed to delete: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error deleting collection content:", error);
      alert(`Error deleting collection content: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Preview handler
  const handlePreview = () => {
    console.log("handlePreview called");
    console.log(`Opening ${collectionData?.name} collection preview...`);
  };

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
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleCollectionImageUpload(index, e)}
                    />
                  </label>
                  {/* Remove button for collection images */}
                  {(image || collectionImageUrls[index]) && (
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
                  className={`w-64 px-3 py-2 border-2 rounded-lg focus:outline-none avant text-sm text-black ${
                    formErrors.promotionalTitle
                      ? "border-red-500"
                      : "border-black"
                  }`}
                  placeholder="Enter promotional title"
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
                  className={`w-80 px-3 py-2 border-2 rounded-lg focus:outline-none avant text-sm text-black resize-none ${
                    formErrors.promotionalDescription
                      ? "border-red-500"
                      : "border-black"
                  }`}
                  placeholder="Enter promotional description"
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
              <label className="cursor-pointer">
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
                />
              </label>
              {/* Remove button for promotional image */}
              {(promotionalImage || promotionalImageUrl) && (
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
            disabled={loading || isSaving || uploading}
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

          {hasExistingContent && (
            <button
              onClick={deleteContent}
              disabled={loading || isSaving || uploading}
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
    </div>
  );
};

export default CollectionsContent;
