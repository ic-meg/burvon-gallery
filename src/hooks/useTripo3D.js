import { useState } from 'react';
import tripoApi from '../api/tripoApi';

export const useTripo3D = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const resetState = () => {
    setLoading(false);
    setError(null);
    setTaskId(null);
    setProgress(0);
    setStatus(null);
    setModelUrl(null);
    setPreviewUrl(null);
  };

  const generateModel = async (imageFile, options = {}) => {
    const { autoCheck = true, onProgress } = options;
    
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      setStatus('uploading');

      // Start generation
      const result = await tripoApi.generateModel(imageFile);

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      const generatedTaskId = result.task_id;
      setTaskId(generatedTaskId);
      setStatus('processing');

      if (autoCheck && generatedTaskId) {
        // Start polling for completion
        setStatus('generating');
        
        const finalResult = await tripoApi.pollTaskStatus(
          generatedTaskId,
          (progressData) => {
            setProgress(progressData.progress || 0);
            setStatus(progressData.status);
            
            if (onProgress) {
              onProgress(progressData);
            }
          }
        );

        if (finalResult.success) {
          setModelUrl(finalResult.modelUrl);
          setPreviewUrl(finalResult.previewUrl);
          setStatus('success');
          setProgress(100);
          setLoading(false); 
          
          return {
            success: true,
            taskId: generatedTaskId,
            modelUrl: finalResult.modelUrl,
            previewUrl: finalResult.previewUrl,
            data: finalResult.data
          };
        } else {
          setLoading(false);
          return {
            success: false,
            error: 'Generation completed but no model was produced'
          };
        }
      }

      // If autoCheck is false, don't set loading to false - user will check manually
      if (!autoCheck) {
        return {
          success: true,
          taskId: generatedTaskId,
          message: 'Generation started successfully'
        };
      }

    } catch (err) {
      console.error('3D Model Generation Error:', err);
      setError(err.message || 'Failed to generate 3D model');
      setStatus('error');
      setLoading(false);
      
      return {
        success: false,
        error: err.message || 'Failed to generate 3D model'
      };
    }
  };

  const checkTaskStatus = async (taskIdToCheck = null) => {
    const idToUse = taskIdToCheck || taskId;
    
    if (!idToUse) {
      setError('No task ID available');
      return { success: false, error: 'No task ID available' };
    }

    try {
      setLoading(true);
      const result = await tripoApi.checkTaskStatus(idToUse);
      
      if (result.success) {
        setProgress(result.progress || 0);
        setStatus(result.status);
        
        if (result.isComplete) {
          setModelUrl(result.modelUrl);
          setPreviewUrl(result.previewUrl);
        }
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = (filename = null) => {
    if (!modelUrl) {
      setError('No model URL available for download');
      return false;
    }

    try {
      const link = document.createElement('a');
      link.href = modelUrl;
      link.download = filename || 'generated-model.glb';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (err) {
      setError('Failed to download model');
      return false;
    }
  };

  return {
    // State
    loading,
    error,
    taskId,
    progress,
    status,
    modelUrl,
    previewUrl,
    
    // Actions
    generateModel,
    checkTaskStatus,
    downloadModel,
    resetState,
    
    // Computed states
    isGenerating: loading && (status === 'uploading' || status === 'processing' || status === 'generating'),
    isComplete: status === 'success' && modelUrl,
    hasFailed: status === 'error' || !!error,
    hasTaskId: !!taskId
  };
};