import { supabase, STORAGE_BUCKET, uploadImage, deleteImage, getImageUrl } from '../config/supabase'

class StorageService {
  generateFilePath(file, prefix = 'homepage') {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    // Organize: admin/content-type/timestamp_random.ext
    return `admin/${prefix}/${timestamp}_${randomString}.${fileExtension}`
  }

  // Upload logo image
  async uploadLogo(file) {
    const filePath = this.generateFilePath(file, 'logos')
    return await uploadImage(file, filePath)
  }

  // Upload mobile logo image
  async uploadMobileLogo(file) {
    const filePath = this.generateFilePath(file, 'mobile-logos')
    return await uploadImage(file, filePath)
  }

  // Upload hero image
  async uploadHeroImage(file, index) {
    const filePath = this.generateFilePath(file, `hero/hero_${index}`)
    return await uploadImage(file, filePath)
  }

  // Upload try-on promotional image
  async uploadTryOnImage(file) {
    const filePath = this.generateFilePath(file, 'try-on')
    return await uploadImage(file, filePath)
  }

  // Upload category image (for category-specific content)
  async uploadCategoryImage(file, categoryName = 'category') {
    const filePath = this.generateFilePath(file, `categories/${categoryName}`)
    return await uploadImage(file, filePath)
  }

  // Upload collection promotional image
  async uploadCollectionPromotionalImage(file, collectionId) {
    const filePath = this.generateFilePath(file, `collections/${collectionId}/promotional`)
    return await uploadImage(file, filePath)
  }

  // Upload collection carousel image
  async uploadCollectionCarouselImage(file, collectionId, imageIndex) {
    const filePath = this.generateFilePath(file, `collections/${collectionId}/carousel/image_${imageIndex}`)
    return await uploadImage(file, filePath)
  }

  // Delete image by path
  async deleteImage(filePath) {
    return await deleteImage(filePath)
  }

  // Get public URL for image
  getImageUrl(filePath) {
    return getImageUrl(filePath)
  }

  // Upload multiple hero images
  async uploadMultipleHeroImages(imageFiles) {
    const results = []
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (file) {
        const result = await this.uploadHeroImage(file, i)
        results.push({ index: i, ...result })
      } else {
        results.push({ index: i, success: false, filePath: null })
      }
    }
    
    return results
  }

  // Upload multiple category images (for category-specific content)
  async uploadMultipleCategoryImages(imageFiles, categoryName = 'category') {
    const results = []
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (file) {
        const result = await this.uploadCategoryImage(file, `${categoryName}_${i}`)
        results.push({ index: i, ...result })
      } else {
        results.push({ index: i, success: false, filePath: null })
      }
    }
    
    return results
  }

  // Extract file path from Supabase public URL
  extractFilePathFromUrl(supabaseUrl) {
    if (!supabaseUrl) return null;
    
    try {
      // Supabase URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{file-path}
      const url = new URL(supabaseUrl);
      const pathParts = url.pathname.split('/');
      
      
      const publicIndex = pathParts.indexOf('public');
      
      if (publicIndex !== -1 && pathParts.length >= publicIndex + 3) {
      
        const filePath = pathParts.slice(publicIndex + 2).join('/');
        return filePath;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting file path from URL:', error);
      return null;
    }
  }

  // List files in a specific folder
  async listFiles(folderPath) {
    try {
      const { data, error } = await supabase.storage
        .from('burvon-images')
        .list(folderPath, {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error('List files error:', error);
        return { success: false, error: error.message, files: [] };
      }

      return { success: true, files: data || [] };
    } catch (error) {
      console.error('List files error:', error);
      return { success: false, error: error.message, files: [] };
    }
  }

  // Delete all files in a folder
  async deleteFolder(folderPath) {
    try {
      const listResult = await this.listFiles(folderPath);
      
      if (!listResult.success) {
   
        return { success: false, error: listResult.error };
      }

      const files = listResult.files;

      if (files.length === 0) {

        return { success: true, deletedCount: 0 };
      }

      // Delete all files in the folder
      const filePaths = files.map(file => `${folderPath}/${file.name}`);
      
      const { error } = await supabase.storage
        .from('burvon-images')
        .remove(filePaths);

      if (error) {
        console.error('Delete folder error:', error);
        return { success: false, error: error.message, deletedCount: 0 };
      }

      return { success: true, deletedCount: files.length };
    } catch (error) {
      console.error('Delete folder error:', error);
      return { success: false, error: error.message, deletedCount: 0 };
    }
  }

  // Clean up old images when updating
  async cleanupOldImages(oldImagePaths) {
    const deletePromises = oldImagePaths
      .filter(path => path)
      .map(path => this.deleteImage(path))

    return await Promise.all(deletePromises)
  }

  // ------------------- Review Media Upload -------------------

  // Upload review image
  async uploadReviewImage(file, userId, productId) {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const filePath = `reviews/user_${userId}/product_${productId}/images/${timestamp}_${randomString}.${fileExtension}`

    return await uploadImage(file, filePath)
  }

  // Upload review video
  async uploadReviewVideo(file, userId, productId) {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const filePath = `reviews/user_${userId}/product_${productId}/videos/${timestamp}_${randomString}.${fileExtension}`

    return await uploadImage(file, filePath)
  }

  // Upload multiple review images
  async uploadMultipleReviewImages(imageFiles, userId, productId) {
    const results = []

    for (const file of imageFiles) {
      if (file) {
        const result = await this.uploadReviewImage(file, userId, productId)
        if (result.success) {
          results.push(getImageUrl(result.filePath))
        }
      }
    }

    return results
  }

  // Upload multiple review videos
  async uploadMultipleReviewVideos(videoFiles, userId, productId) {
    const results = []

    for (const file of videoFiles) {
      if (file) {
        const result = await this.uploadReviewVideo(file, userId, productId)
        if (result.success) {
          results.push(getImageUrl(result.filePath))
        }
      }
    }

    return results
  }

    // ------------------- 3D Model Upload -------------------

  STORAGE_BUCKET_3D = '3DFiles';

  CATEGORY_FOLDERS = {
    'rings': 'Rings',
    'necklaces': 'Necklaces',
    'earrings': 'Earrings',
    'bracelets': 'Bracelets',
  };

  getCategoryFolder(categoryName) {
    if (!categoryName) return 'Uncategorized';
    const normalized = categoryName.toLowerCase().trim();
    return this.CATEGORY_FOLDERS[normalized] || categoryName;
  }

  validate3DModelFile(file) {
    const maxSize = 50 * 1024 * 1024; // 50MB limit for 3D models
    const allowedExtensions = ['glb', 'gltf'];
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return { valid: false, error: 'Invalid file type. Only .glb and .gltf files are allowed.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 50MB.' };
    }
    
    return { valid: true };
  }

  generate3DModelPath(file, productName, categoryName, isTripo = false) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop().toLowerCase();

    let baseName;
    if (isTripo) {
      // Use the original filename (without extension), sanitized, and always prefix 'tripo_'
      baseName = file.name
        .replace(/\.[^/.]+$/, '') // remove extension
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 45); // leave room for 'tripo_'
      if (!baseName.startsWith('tripo-')) {
        baseName = `tripo-${baseName}`;
      }
    } else {
      baseName = productName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
    }

    const categoryFolder = this.getCategoryFolder(categoryName);

    return `${categoryFolder}/${baseName}_${timestamp}_${randomString}.${fileExtension}`;
  }

  async upload3DModel(file, productName, categoryName, isTripo = false) {
    const validation = this.validate3DModelFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error, filePath: null };
    }

    const filePath = this.generate3DModelPath(file, productName, categoryName, isTripo);

    try {
      const { data, error } = await supabase.storage
        .from(this.STORAGE_BUCKET_3D)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'model/gltf-binary'
        });

      if (error) {
        console.error('3D model upload error:', error);
        return { success: false, error: error.message, filePath: null };
      }

      return { success: true, filePath: data.path, error: null };
    } catch (error) {
      console.error('3D model upload error:', error);
      return { success: false, error: error.message, filePath: null };
    }
  }

  async delete3DModel(filePath) {
    if (!filePath) return { success: true };
    
    try {
      const { error } = await supabase.storage
        .from(this.STORAGE_BUCKET_3D)
        .remove([filePath]);

      if (error) {
        console.error('3D model delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('3D model delete error:', error);
      return { success: false, error: error.message };
    }
  }

  get3DModelUrl(filePath) {
    if (!filePath) return null;
    
    const { data } = supabase.storage
      .from(this.STORAGE_BUCKET_3D)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  // ------------------- Try-On Image Upload -------------------


validateTryOnImageFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB for try-on images
  const allowedTypes = ['image/png', 'image/webp']; 
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Try-on images must be PNG or WebP (transparency support required)' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'Try-on image must be less than 5MB' };
  }
  return { valid: true };
}


async uploadTryOnImage(file, productName, categoryName) {
  // Path: 3DFiles/TryOn/{Category}/{ProductName}TryOn.png
  const sanitizedProductName = productName.replace(/[^a-zA-Z0-9]/g, '');
  const sanitizedCategory = categoryName.replace(/[^a-zA-Z0-9]/g, '');
  const extension = file.name.split('.').pop();
  const filePath = `TryOn/${sanitizedCategory}/${sanitizedProductName}TryOn.${extension}`;
  

  const { data, error } = await supabase.storage
    .from('3DFiles')
    .upload(filePath, file, { upsert: true });
  
  if (error) return { success: false, error: error.message };
  
  return { 
    success: true, 
    filePath,
    url: this.getTryOnImageUrl(filePath)
  };
}

getTryOnImageUrl(filePath) {
  if (!filePath) return null;
  const { data } = supabase.storage.from('3DFiles').getPublicUrl(filePath);
  return data?.publicUrl;
}

async deleteTryOnImage(filePath) {
  if (!filePath) return { success: true };
  const { error } = await supabase.storage.from('3DFiles').remove([filePath]);
  return { success: !error, error: error?.message };
}

}

export default new StorageService()