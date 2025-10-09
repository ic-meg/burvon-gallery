import React, { useState, useEffect } from 'react';
import contentApi from '../../api/contentApi';
import storageService from '../../services/storageService';

import {
  AddImage,
  Remove
} from '../../assets/index.js';

const Homepage = () => {
  // State for form data
  const [formData, setFormData] = useState({
    logo: null,
    logoUrl: null, // Supabase URL
    heroImages: [null, null, null, null, null, null, null, null],
    heroImageUrls: [null, null, null, null, null, null, null, null], // Supabase URLs
    tryOnTitle: 'Style It On You',
    tryOnDescription: 'Experience our virtual try-on feature and see how each piece looks on you.',
    tryOnImage: null,
    tryOnImageUrl: null // Supabase URL
  });

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasExistingContent, setHasExistingContent] = useState(false);

  
  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const uploadAllImages = async () => {
    setUploading(true);
    const uploadResults = {
      logoUrl: formData.logoUrl,
      heroImageUrls: [...formData.heroImageUrls],
      tryOnImageUrl: formData.tryOnImageUrl
    };

    try {
      // Upload logo if new file exists
      if (formData.logo) {
        showMessage('info', 'Uploading logo...');
        const logoResult = await storageService.uploadLogo(formData.logo);
        if (logoResult.success) {
          uploadResults.logoUrl = storageService.getImageUrl(logoResult.filePath);
        } else {
          throw new Error(`Logo upload failed: ${logoResult.error}`);
        }
      }

      // Upload try-on image if new file exists
      if (formData.tryOnImage) {
        showMessage('info', 'Uploading try-on image...');
        const tryOnResult = await storageService.uploadTryOnImage(formData.tryOnImage);
        if (tryOnResult.success) {
          uploadResults.tryOnImageUrl = storageService.getImageUrl(tryOnResult.filePath);
        } else {
          throw new Error(`Try-on image upload failed: ${tryOnResult.error}`);
        }
      }

      // Upload hero images if new files exist
      const heroImagesToUpload = formData.heroImages.filter(img => img !== null);
      if (heroImagesToUpload.length > 0) {
        showMessage('info', 'Uploading hero images...');
        const heroResults = await storageService.uploadMultipleHeroImages(formData.heroImages);
        
        heroResults.forEach((result, index) => {
          if (result.success) {
            uploadResults.heroImageUrls[index] = storageService.getImageUrl(result.filePath);
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
    // Filter out null values from hero images array
    const heroImagesFiltered = imageUrls.heroImageUrls.filter(url => url !== null);
    
    const data = {
      // Map frontend field names to backend schema
      title: formData.tryOnTitle || null,
      description: formData.tryOnDescription || null,
      logo_url: imageUrls.logoUrl || null,
      hero_images: heroImagesFiltered.length > 0 ? heroImagesFiltered : null, // Send array or null
      promo_image: imageUrls.tryOnImageUrl || null
    };
    
    console.log('Prepared data for backend:', data);
    return data;
  };

  // ===============================
  // CRUD OPERATIONS
  // ===============================

  const fetchContent = async () => {
    setLoading(true);
    try {
      const result = await contentApi.fetchHomepageContent();
      
      if (result.error) {
        showMessage('warning', `No existing content found - ready to create new content`);
        setHasExistingContent(false);
        return;
      }

      if (result.data && result.data.message) {
        // Backend returned "No homepage content found"
        setHasExistingContent(false);
        showMessage('info', 'No existing content found - ready to create new content');
      } else if (result.data) {
        // Content exists - load the stored URLs and text data
        setHasExistingContent(true);
        setFormData({
          logo: null, // No file objects when loading from backend
          logoUrl: result.data.logo_url || null, // Load stored Supabase URL (backend field name)
          heroImages: [null, null, null, null, null, null, null, null], // No file objects
          heroImageUrls: result.data.hero_images || [null, null, null, null, null, null, null, null], // Load stored URLs (backend field name)
          tryOnTitle: result.data.title || 'Style It On You', // Backend field name
          tryOnDescription: result.data.description || 'Experience our virtual try-on feature and see how each piece looks on you.', // Backend field name
          tryOnImage: null, // No file object
          tryOnImageUrl: result.data.promo_image || null // Load stored Supabase URL (backend field name)
        });
        showMessage('success', 'Content loaded successfully');
        
        // Debug log to see what I loaded
        // console.log('Loaded content:', {
        //   logo_url: result.data.logo_url,
        //   hero_images: result.data.hero_images,
        //   promo_image: result.data.promo_image,
        //   title: result.data.title,
        //   description: result.data.description
        // });
      }
    } catch (error) {
      showMessage('error', `Network error: ${error.message}`);
      setHasExistingContent(false);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      // First upload all images to Supabase
      showMessage('info', 'Uploading images...');
      const imageUrls = await uploadAllImages();
      
      // Then save content data with image URLs to backend
      const contentData = prepareContentDataForSubmission(imageUrls);
      
      console.log('Image URLs after upload:', imageUrls);
      console.log('Content data being sent to backend:', contentData);
      console.log('Saving content with data:', {
        hasData: !!contentData,
        dataKeys: Object.keys(contentData || {}),
        apiURL: import.meta.env.VITE_CONTENT_API,
      });
      
      showMessage('info', 'Saving content data...');
      const result = await contentApi.saveHomepageContent(contentData);

      console.log('API Result:', result);

      if (result.error) {
        showMessage('error', `Failed to save: ${result.error}`);
        return;
      }

      // Update local state with URLs
      setFormData(prev => ({
        ...prev,
        logoUrl: imageUrls.logoUrl,
        heroImageUrls: imageUrls.heroImageUrls,
        tryOnImageUrl: imageUrls.tryOnImageUrl,
        logo: null, // Clear file objects after successful upload
        heroImages: [null, null, null, null, null, null, null, null],
        tryOnImage: null
      }));

      setHasExistingContent(true);
      showMessage('success', 'Content saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      showMessage('error', `Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async () => {
    if (!hasExistingContent) {
      showMessage('warning', 'No content to delete');
      return;
    }

    if (!window.confirm('Are you sure you want to delete all homepage content? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const result = await contentApi.deleteHomepageContent();
      
      if (result.error) {
        showMessage('error', `Failed to delete: ${result.error}`);
        return;
      }

      // Reset form to default state
      setFormData({
        logo: null,
        heroImages: [null, null, null, null, null, null, null, null],
        tryOnTitle: 'Style It On You',
        tryOnDescription: 'Experience our virtual try-on feature and see how each piece looks on you.',
        tryOnImage: null
      });
      setHasExistingContent(false);
      showMessage('success', 'Content deleted successfully');
    } catch (error) {
      showMessage('error', `Delete error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // EVENT HANDLERS
  // ===============================

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  const handleLogoRemove = () => {
    setFormData(prev => ({ ...prev, logo: null, logoUrl: null }));
  };

  const handleHeroImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => {
        const newHeroImages = [...prev.heroImages];
        newHeroImages[index] = file;
        return { ...prev, heroImages: newHeroImages };
      });
    }
  };

  const handleHeroImageRemove = (index) => {
    setFormData(prev => {
      const newHeroImages = [...prev.heroImages];
      const newHeroImageUrls = [...prev.heroImageUrls];
      newHeroImages[index] = null;
      newHeroImageUrls[index] = null;
      return { ...prev, heroImages: newHeroImages, heroImageUrls: newHeroImageUrls };
    });
  };

  const handleTryOnImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, tryOnImage: file }));
    }
  };

  const handleTryOnImageRemove = () => {
    setFormData(prev => ({ ...prev, tryOnImage: null, tryOnImageUrl: null }));
  };

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, tryOnTitle: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, tryOnDescription: value.slice(0, 100) }));
  };

  const handlePreview = () => {
    console.log('Preview data:', formData);
    // Implement preview logic here
    showMessage('info', 'Preview functionality coming soon');
  };

  // ===============================
  // LIFECYCLE
  // ===============================

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

      {/* Loading Overlay */}
      {loading && (
        <div className="col-span-2 flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-2 avant text-sm">Loading content...</span>
        </div>
      )}

      {/* Left Column - Forms and Inputs */}
      <div className="space-y-8">
        
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
                />
              </label>
              {/* Remove button for logo */}
              {(formData.logo || formData.logoUrl) && (
                <button
                  onClick={handleLogoRemove}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125"
                >
                  <img src={Remove} alt="Remove" className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Align button with the box */}
            <div className="flex flex-col justify-center h-24">
              <label className="block">
                <span className="px-4 py-3 bg-black text-white rounded-lg cursor-pointer uppercase hover:bg-gray-800 transition-colors avantbold text-sm">
                  Upload New Logo
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </label>
              <p className="text-xs text-gray-500 avant mt-2">At least 270x90 px recommended.</p>
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
                    />
                  </label>
                  {/* Remove button for hero images */}
                  {(image || formData.heroImageUrls[index]) && (
                    <button
                      onClick={() => handleHeroImageRemove(index)}
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

        {/* Try-On Promotional Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">TRY-ON PROMOTIONAL</h2>
          
          <div className="flex items-start space-x-4 text-left">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-lg avantbold text-black mb-2">TITLE</label>
                <input
                  type="text"
                  value={formData.tryOnTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-64 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black"
                />
              </div>

              <div>
                <label className="block text-lg avantbold text-black mb-2">DESCRIPTION <span className="text-[#959595] text-sm avant font-normal">Maximum of 100 characters.</span></label>
                <textarea
                  value={formData.tryOnDescription}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={100}
                  rows={3}
                  className="w-80 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black resize-none"
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
                />
              </label>
              {/* Remove button for try-on image */}
              {(formData.tryOnImage || formData.tryOnImageUrl) && (
                <button
                  onClick={handleTryOnImageRemove}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-125"
                >
                  <img src={Remove} alt="Remove" className="w-4 h-4" />
                </button>
              )}
              <p className="text-xs text-gray-500 avant">At least 600x200 px recommended.</p>
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
            {(saving || uploading) && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            {uploading ? 'UPLOADING...' : saving ? 'SAVING...' : hasExistingContent ? 'UPDATE CONTENT' : 'CREATE CONTENT'}
          </button>

          <button
            onClick={fetchContent}
            disabled={loading || saving || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            REFRESH
          </button>

          {hasExistingContent && (
            <button
              onClick={deleteContent}
              disabled={loading || saving || uploading}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors avantbold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              DELETE ALL
            </button>
          )}
        </div>

        {/* Content Status & Debug Info */}
        <div className="pt-2 space-y-1">
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
        </div>
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

export default Homepage;
