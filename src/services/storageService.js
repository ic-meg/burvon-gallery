import { supabase, STORAGE_BUCKET, uploadImage, deleteImage, getImageUrl } from '../config/supabase'

class StorageService {
  // Generate unique file path with better organization
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

  // Clean up old images when updating
  async cleanupOldImages(oldImagePaths) {
    const deletePromises = oldImagePaths
      .filter(path => path) // Remove null/undefined paths
      .map(path => this.deleteImage(path))
    
    return await Promise.all(deletePromises)
  }
}

export default new StorageService()