import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

// Sign in anonymously for admin operations
export const ensureAdminAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    // Sign in with a dummy admin account for upload permissions
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.warn('Anonymous auth failed, trying without auth:', error)
      return false
    }
    return true
  }
  return true
}

// Storage bucket name for burvon images
export const STORAGE_BUCKET = 'burvon-images'

// Helper function to get public URL for uploaded files
export const getImageUrl = (filePath) => {
  if (!filePath) return null
  
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

// Helper function to upload file
export const uploadImage = async (file, filePath) => {
  // Ensure i have auth permissions for upload
  await ensureAdminAuth()
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true 
    })

  if (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data, filePath: data.path }
}

// Helper function to delete file
export const deleteImage = async (filePath) => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath])

  if (error) {
    console.error('Delete error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}