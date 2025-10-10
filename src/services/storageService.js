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
      console.log('Listing files in folder:', folderPath);
      const listResult = await this.listFiles(folderPath);
      
      if (!listResult.success) {
        console.log('Could not list files in folder:', folderPath, listResult.error);
        return { success: false, error: listResult.error };
      }

      const files = listResult.files;
      console.log(`Found ${files.length} files in ${folderPath}:`, files);

      if (files.length === 0) {
        console.log('No files to delete in folder:', folderPath);
        return { success: true, deletedCount: 0 };
      }

      // Delete all files in the folder
      const filePaths = files.map(file => `${folderPath}/${file.name}`);
      console.log('Deleting file paths:', filePaths);
      
      const { error } = await supabase.storage
        .from('burvon-images')
        .remove(filePaths);

      if (error) {
        console.error('Delete folder error:', error);
        return { success: false, error: error.message, deletedCount: 0 };
      }

      console.log(`Successfully deleted ${files.length} files from ${folderPath}`);
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
}

export default new StorageService()