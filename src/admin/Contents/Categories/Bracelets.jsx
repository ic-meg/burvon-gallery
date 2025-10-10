import React, { useState, useEffect } from 'react';
import categoryApi from '../../../api/categoryApi.jsx';
import storageService from '../../../services/storageService.js';
import {
  AddImage,
  Remove
} from '../../../assets/index.js';

const Bracelets = () => {
  // State for form data
  const [formData, setFormData] = useState({
    braceletsImages: [null, null, null, null, null, null, null, null],
    braceletsImageUrls: [null, null, null, null, null, null, null, null], // Supabase URLs
    title: null,
    description: null,
    promotionalImage: null,
    promotionalImageUrl: null // Supabase URL
  });

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const uploadAllImages = async () => {
    setUploading(true);
    const uploadResults = {
      braceletsImageUrls: [...formData.braceletsImageUrls],
      promotionalImageUrl: formData.promotionalImageUrl
    };

    try {
      // Upload promotional image 
      if (formData.promotionalImage) {
        showMessage('info', 'Uploading promotional image...');
        const promoResult = await storageService.uploadCategoryImage(formData.promotionalImage, 'bracelets');
        if (promoResult.success) {
          uploadResults.promotionalImageUrl = storageService.getImageUrl(promoResult.filePath);
        } else {
          throw new Error(`Promotional image upload failed: ${promoResult.error}`);
        }
      }

      // Upload bracelets carousel images
      const braceletsImagesToUpload = formData.braceletsImages.filter(img => img !== null);
      if (braceletsImagesToUpload.length > 0) {
        showMessage('info', 'Uploading bracelets images...');
        const braceletsResults = await storageService.uploadMultipleCategoryImages(formData.braceletsImages, 'bracelets');
        
        braceletsResults.forEach((result, index) => {
          if (result.success) {
            uploadResults.braceletsImageUrls[index] = storageService.getImageUrl(result.filePath);
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
    // Filter out null values from bracelets images array
    const braceletsImagesFiltered = imageUrls.braceletsImageUrls.filter(url => url !== null);
    
    const data = {
      category_id: 3, // Bracelets category ID
      slug: 'bracelets',
      title: formData.title || null,
      description: formData.description || null,
      category_images: braceletsImagesFiltered.length > 0 ? braceletsImagesFiltered : null,
      promo_images: imageUrls.promotionalImageUrl || null
    };
    
    console.log('Prepared bracelets data for backend:', data);
    return data;
  };

  // ===============================
  // CRUD OPERATIONS
  // ===============================

  const fetchContent = async () => {
    setLoading(true);
    try {
      const result = await categoryApi.fetchCategoryBySlug('bracelets');
      
      if (result.error) {
        showMessage('warning', `No existing content found - ready to create new content`);
        setHasExistingContent(false);
        setHasUnsavedChanges(false); // Reset when no content exists
        return;
      }

      if (result.data && result.data.message) {
        // Backend returned "No category content found"
        setHasExistingContent(false);
        setHasUnsavedChanges(false); // Reset when no content exists
        showMessage('info', 'No existing content found - ready to create new content');
      } else if (result.data) {
        // Content exists - load the stored URLs and text data
        setHasExistingContent(true);
        setFormData({
          braceletsImages: [null, null, null, null, null, null, null, null], // No file objects
          braceletsImageUrls: result.data.category_images || [null, null, null, null, null, null, null, null],
          title: result.data.title || 'Style It On You',
          description: result.data.description || 'Experience our virtual try-on feature and see how each piece looks on you.',
          promotionalImage: null, // No file object
          promotionalImageUrl: result.data.promo_images || null
        });
        setHasUnsavedChanges(false); 
        showMessage('success', 'Content loaded successfully');
      }
    } catch (error) {
      showMessage('error', `Network error: ${error.message}`);
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
      const hasNewImages = formData.braceletsImages.some(img => img !== null) || formData.promotionalImage !== null;
      
      //tracker para sa unsaved changes
      const hasChanges = hasUnsavedChanges || hasNewImages;

      // If no existing content, ito create operation
      if (!hasExistingContent) {
        showMessage('info', 'Creating new bracelets content...');
      } else if (!hasChanges) {
        showMessage('info', 'No changes detected - content is already up to date');
        setSaving(false);
        return; // Exit early if no changes
      } else if (hasNewImages && hasUnsavedChanges) {
        showMessage('info', 'Updating content and uploading new images...');
      } else if (hasNewImages) {
        showMessage('info', 'Uploading new images...');
      } else {
        showMessage('info', 'Updating content...');
      }

      // Upload images (itong function is naghhandle both promo and bracelets images)
      const imageUrls = await uploadAllImages();
      
      // Prepare and save content data
      const contentData = prepareContentDataForSubmission(imageUrls);
      const result = await categoryApi.saveCategoryContent(contentData);

      if (result.error) {
        showMessage('error', `Failed to save: ${result.error}`);
        return;
      }

      // Update local state with URLs
      setFormData(prev => ({
        ...prev,
        braceletsImageUrls: imageUrls.braceletsImageUrls,
        promotionalImageUrl: imageUrls.promotionalImageUrl,
        braceletsImages: [null, null, null, null, null, null, null, null], // Clear file objects
        promotionalImage: null
      }));

      setHasExistingContent(true);
      setHasUnsavedChanges(false); // Reset the changes tracker
      
      // Provide more specific success messages
      const wasExisting = hasExistingContent;
      if (!wasExisting) {
        showMessage('success', 'Bracelets content created successfully!');
      } else if (hasNewImages && hasUnsavedChanges) {
        showMessage('success', 'Content updated and new images uploaded successfully!');
      } else if (hasNewImages) {
        showMessage('success', 'New images uploaded successfully!');
      } else {
        showMessage('success', 'Bracelets content updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      showMessage('error', `Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async () => {
    if (!window.confirm('Are you sure you want to delete all bracelets content? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // fetch dito sa API to get current image URLs
      const currentContent = await categoryApi.fetchCategoryBySlug('bracelets');
      
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
          const filePath = storageService.extractFilePathFromUrl(currentContent.data.promo_images);
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      } else {
        // Fallback to formData URLs pag walang API CONTENT
        
        // Add bracelets images from formData
        formData.braceletsImageUrls.forEach((url) => {
          if (url) {
            const filePath = storageService.extractFilePathFromUrl(url);
            if (filePath) {
              imagesToDelete.push(filePath);
            }
          }
        });
        
        // Add promotional image from formData
        if (formData.promotionalImageUrl) {
          const filePath = storageService.extractFilePathFromUrl(formData.promotionalImageUrl);
          if (filePath) {
            imagesToDelete.push(filePath);
          }
        }
      }

      // Delete images from Supabase storage first
      if (imagesToDelete.length > 0) {
        showMessage('info', 'Deleting images from storage...');
        await storageService.cleanupOldImages(imagesToDelete);
      }

      // Then delete the database record
      showMessage('info', 'Deleting database record...');
      const result = await categoryApi.deleteCategoryBySlug('bracelets');
      
      if (result.error && !result.error.includes('not found')) {
        showMessage('error', `Failed to delete database record: ${result.error}`);
        return;
      }

      // Reset form to default state
      setFormData({
        braceletsImages: [null, null, null, null, null, null, null, null],
        braceletsImageUrls: [null, null, null, null, null, null, null, null],
        title: null,
        description: null,
        promotionalImage: null,
        promotionalImageUrl: null
      });
      setHasExistingContent(false);
      setHasUnsavedChanges(false);
      showMessage('success', 'Bracelets content and images deleted successfully');
    } catch (error) {
      showMessage('error', `Delete error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  //Manual dito sa pag cleanup ng orphaned files
  const cleanupOrphanedFiles = async () => {
    if (!window.confirm('This will attempt to clean up ALL bracelets-related image files from storage. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      showMessage('info', 'Cleaning up bracelets storage folders...');
      
      //Bracelet folder  lang muna
      const foldersToClean = [
        'admin/bracelets'
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
          deleteResults.push({ folderPath, success: false, error: error.message });
        }
      }
      
      showMessage('success', `Cleanup completed! ${totalDeleted} files deleted from ${deleteResults.filter(r => r.success).length} folders.`);
    } catch (error) {
      console.error('Cleanup error:', error);
      showMessage('error', `Cleanup error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // ===============================

  // EVENT HANDLERS

  //CRUD OPERATIONS
  const handleBraceletsImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => {
        const newBraceletsImages = [...prev.braceletsImages];
        newBraceletsImages[index] = file;
        return { ...prev, braceletsImages: newBraceletsImages };
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleBraceletsImageRemove = (index) => {
    setFormData(prev => {
      const newBraceletsImages = [...prev.braceletsImages];
      const newBraceletsImageUrls = [...prev.braceletsImageUrls];
      newBraceletsImages[index] = null;
      newBraceletsImageUrls[index] = null;
      return { 
        ...prev, 
        braceletsImages: newBraceletsImages, 
        braceletsImageUrls: newBraceletsImageUrls 
      };
    });
    setHasUnsavedChanges(true);
  };

  const handlePromotionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, promotionalImage: file }));
      setHasUnsavedChanges(true);
    }
  };

  const handlePromotionalImageRemove = () => {
    setFormData(prev => ({ 
      ...prev, 
      promotionalImage: null, 
      promotionalImageUrl: null 
    }));
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value.slice(0, 100) }));
    setHasUnsavedChanges(true);
  };

  const handlePreview = () => {
    console.log('Preview data:', formData);
    showMessage('info', 'Preview functionality coming soon');
  };

  const handleSaveChanges = () => {
    saveContent();
  };

  // dito ilload content
  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8 -mt-8 h-full">
      {/* Status Message */}
      {message.text && (
        <div className={`col-span-2 p-4 rounded-lg mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          message.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className="avant text-sm font-medium">{message.text}</span>
            <button 
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-current hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

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

        {/* Bracelets Carousel Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">BRACELETS CAROUSEL</h2>
          <div className="flex items-start space-x-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {formData.braceletsImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                    {image ? (
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Bracelet ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : formData.braceletsImageUrls[index] ? (
                      <img 
                        src={formData.braceletsImageUrls[index]} 
                        alt={`Bracelet ${index + 1}`} 
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
                      onChange={(e) => handleBraceletsImageUpload(index, e)}
                    />
                  </label>
                  {/* Remove button for bracelets images */}
                  {(image || formData.braceletsImageUrls[index]) && (
                    <button
                      onClick={() => handleBraceletsImageRemove(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125"
                    >
                      <img src={Remove} alt="Remove" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-1">
              <p className="text-xs text-gray-500 avant">At least 600x200 px recommended.</p>
            </div>
          </div>
        </div>

        {/* Promotional Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">PROMOTIONAL</h2>
          
          <div className="flex items-start space-x-4 text-left">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-lg avantbold text-black mb-2">TITLE</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder='e.g., Style It On You'
                  className="w-64 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black"
                />
              </div>

              <div>
                <label className="block text-lg avantbold text-black mb-2">DESCRIPTION <span className="text-[#959595] text-sm avant font-normal">Maximum of 100 characters.</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={100}
                  rows={3}
                  placeholder='e.g., Experience our virtual try-on feature and see how each piece looks on you.'
                  className="w-80 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black resize-none"
                />
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
              <p className="text-xs text-gray-500 avant">At least 600x200 px recommended.</p>
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
            {saving ? 'SAVING...' : hasExistingContent ? 'UPDATE CONTENT' : 'SAVE CHANGES'}
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

        {/* Debug Info */}
        {/* {hasExistingContent && (
          <div className="bg-gray-50 p-3 rounded text-xs avant text-gray-600">
            <p>• Images: {formData.braceletsImageUrls.filter(url => url !== null).length}/8</p>
            <p>• Promo: {formData.promotionalImageUrl ? 'Set' : 'Not set'}</p>
            <p>• Changes: {hasUnsavedChanges ? 'Yes' : 'No'}</p>
          </div>
        )} */}
      </div>

      {/* Right Column - Preview Placeholder */}
      <div className="space-y-4">
        <h2 className="text-left text-5xl bebas text-black">PREVIEW</h2>
        <div className="flex items-center justify-center min-h-96 bg-black rounded-lg">
          <span className="text-2xl bebas text-gray-300">Preview content will be displayed here</span>
        </div>
      </div>
    </div>
  );
};

export default Bracelets;