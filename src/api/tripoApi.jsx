import apiRequest from './apiRequest';

const apiURL = import.meta.env.VITE_TRIPO_API || 'http://localhost:3000/tripo';

const missing = (field) => {
  return { error: `${field} is required`, success: false, data: null };
};

const baseUrl = apiURL; 

class TripoApi {
  constructor() {
    this.baseURL = baseUrl;
  }

  /**
   * Upload image and create 3D model generation task
   * @param {File} imageFile - PNG/JPG image file
   * @returns {Promise} - Task creation response
   */
  async generateModel(imageFile) {
    if (!imageFile) {
      throw new Error('Image file is required');
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Only PNG and JPG files are supported');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      if (!apiURL) {
        throw new Error('VITE_TRIPO_API environment variable is not configured');
      }

      const fullURL = `${this.baseURL}/image-to-3d`;
      // console.log('Tripo API URL:', fullURL);
      // console.log('Uploading file:', {
      //   name: imageFile.name,
      //   size: imageFile.size,
      //   type: imageFile.type
      // });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 180000); // 3 minutes timeout to match backend

      const response = await fetch(fullURL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle empty response
      const text = await response.text();
    
      
      let data;
      
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        task_id: data.data?.task_id || data.task_id,
        message: 'Model generation started successfully!'
      };
    } catch (error) {
      console.error('Error generating 3D model:', error);
      
      // Handle specific errors
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Upload timed out. The file might be too large or there might be network issues. Please try again.',
          code: 'TIMEOUT_ERROR'
        };
      }
      
      if (error.message.includes('credits')) {
        return {
          success: false,
          error: 'Insufficient credits. Please add more credits to your Tripo 3D account.',
          code: 'INSUFFICIENT_CREDITS'
        };
      }

      if (error.message.includes('network') || error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR'
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to generate 3D model',
        code: 'GENERATION_FAILED'
      };
    }
  }

  /**
   * Check task status
   * @param {string} taskId - Task ID from generation
   * @returns {Promise} - Task status response
   */
  async checkTaskStatus(taskId) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    try {
      if (!apiURL) {
        throw new Error('VITE_TRIPO_API environment variable is not configured');
      }

      const response = await fetch(`${this.baseURL}/task/${taskId}`, {
        method: 'GET',
      });

      // Handle empty response
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      const taskData = data.data || data;
      
      return {
        success: true,
        status: taskData.status,
        progress: taskData.progress || 0,
        result: taskData.result || null,
        output: taskData.output || null,
        task_id: taskId,
        isComplete: taskData.status === 'success',
        isFailed: taskData.status === 'failed',
        modelUrl: taskData.result?.pbr_model?.url || taskData.output?.pbr_model || null,
        previewUrl: taskData.result?.rendered_image?.url || taskData.output?.rendered_image || null
      };

    } catch (error) {
      console.error('Error checking task status:', error);
      return {
        success: false,
        error: error.message || 'Failed to check task status'
      };
    }
  }

  /**
   * Poll task status until completion
   * @param {string} taskId - Task ID
   * @param {function} onProgress - Progress callback (optional)
   * @param {number} maxAttempts - Maximum polling attempts (default: 60)
   * @param {number} interval - Polling interval in ms (default: 5000)
   * @returns {Promise} - Final task result
   */
  async pollTaskStatus(taskId, onProgress = null, maxAttempts = 60, interval = 5000) {
    let attempts = 0;

    const poll = async () => {
      attempts++;
      
      try {
        const result = await this.checkTaskStatus(taskId);
        
        if (!result.success) {
          throw new Error(result.error || 'Task status check failed');
        }

        // Call progress callback if provided
        if (onProgress) {
          onProgress(result);
        }

        // Check if task is complete
        if (result.isComplete) {
          return {
            success: true,
            data: result,
            modelUrl: result.modelUrl,
            previewUrl: result.previewUrl
          };
        }

        // Check if task failed
        if (result.isFailed) {
          throw new Error('3D model generation failed');
        }

        // Check if we've exceeded max attempts
        if (attempts >= maxAttempts) {
          throw new Error('Task polling timeout - generation is taking too long');
        }

        // Continue polling
        await new Promise(resolve => setTimeout(resolve, interval));
        return poll();

      } catch (error) {
        console.error(`Polling attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) {
          throw error;
        }

        // Retry with exponential backoff
        const backoffTime = Math.min(interval * Math.pow(1.5, attempts - 1), 30000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return poll();
      }
    };

    return poll();
  }
}

export default new TripoApi();