import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTripo3D } from '../hooks/useTripo3D';
import { AddImage, Remove, Icon3D } from '../assets';
const Experience = React.lazy(() => import('./3Dcomponents/Experience').then(mod => ({ default: mod.Experience })));

const TripoModelGenerator = ({ 
  onModelGenerated, 
  existingModelUrl = null, 
  disabled = false,
  className = "" 
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  
  const {
    loading,
    error,
    progress,
    status,
    modelUrl,
    previewUrl,
    generateModel,
    downloadModel,
    resetState,
    isGenerating,
    isComplete
  } = useTripo3D();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PNG and JPG files are supported for 3D generation');
      return;
    }

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      alert('File size must be less than 1MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      alert('Please select an image first');
      return;
    }

    try {

      const result = await generateModel(imageFile, {
        autoCheck: true,
        onProgress: (progressData) => {

        }
      });

      if (result.success && typeof result.modelUrl === 'string' && result.modelUrl.length > 0) {

        // Notify parent component
        if (onModelGenerated) {
          onModelGenerated({
            modelUrl: result.modelUrl,
            previewUrl: result.previewUrl,
            taskId: result.taskId
          });
        }
      } else if (!result.success && result.error) {
        console.error('Generation failed with error:', result.error);
      } else {
        console.error('TripoModelGenerator: Invalid modelUrl from Tripo API', result.modelUrl);
      }
    } catch (err) {
      console.error('Generation failed with exception:', err);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    resetState();
  };

  const getStatusText = () => {
    if (isGenerating) {
      switch (status) {
        case 'uploading': return 'Uploading image...';
        case 'processing': return 'Starting generation...';
        case 'generating': return `Generating 3D model... ${Math.round(progress)}%`;
        case 'running': return `Processing 3D model... ${Math.round(progress)}%`;
        case 'queued': return 'Queued for processing...';
        default: return `Processing... ${Math.round(progress)}%`;
      }
    }
    if (isComplete) return 'Generation complete!';
    if (error) return `Error: ${error}`;
    return '';
  };

  if (!showGenerator && !existingModelUrl) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => setShowGenerator(true)}
          disabled={disabled}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avant text-sm"
        >
           Generate 3D Model from Image
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm avantbold text-black">3D Model Generator</h3>
        {showGenerator && (
          <button
            type="button"
            onClick={() => {
              setShowGenerator(false);
              handleReset();
            }}
            className="text-gray-500 hover:text-gray-700 text-sm avant"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="block text-xs avantbold text-gray-600">Upload Image (PNG/JPG)</label>
            <p className="text-xs avant text-gray-500 mt-1">Max file size: <span className="font-bold">1MB</span></p>
        
        <div className="flex space-x-3">
          {/* Image Upload Box */}
          <div className="relative">
            <label className="cursor-pointer">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <img src={AddImage} alt="Upload" className="w-6 h-6 opacity-60" />
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageUpload}
                disabled={isGenerating}
              />
            </label>
            
            {imageFile && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <img src={Remove} alt="Remove" className="w-3 h-3 invert" />
              </button>
            )}
          </div>

          {/* Image Info */}
          {imageFile && (
            <div className="flex-1 space-y-1">
              <p className="text-xs avant text-black font-medium">{imageFile.name}</p>
              <p className="text-xs avant text-gray-500">
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-xs avant text-gray-500">{imageFile.type}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!imageFile || isGenerating}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avant text-sm font-medium"
      >
        {isGenerating ? 'Generating...' : 'Generate 3D Model'}
      </button>

      {/* Status */}
      {((['uploading','processing','generating','running','queued'].includes(status) || isGenerating) || error || isComplete) && (
        <div className="space-y-2">
          {/* Progress Bar - always show for in-progress statuses */}
          {( ['uploading','processing','generating','running','queued'].includes(status) ) && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              {progress > 0 ? (
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                ></div>
              ) : (
                <div className="bg-purple-400 h-2 rounded-full animate-pulse w-1/4"></div>
              )}
            </div>
          )}
          {/* Status Text */}
          <p className={`text-xs avant ${error ? 'text-red-600' : isComplete ? 'text-green-600' : 'text-blue-600'}`}>
            {getStatusText()}
          </p>
          {/* Debug info */}
          {( ['uploading','processing','generating','running','queued'].includes(status) ) && (
            <p className="text-xs text-gray-500">
              Status: {status} | Progress: {progress}% | Loading: {loading.toString()}
            </p>
          )}
        </div>
      )}

      {/* Preview and Download */}
      {isComplete && (modelUrl || previewUrl) && (
        <div className="space-y-3 border-t border-gray-200 pt-3">
          <h4 className="text-xs avantbold text-green-600">Generation Complete!</h4>
          {/* Interactive 3D Preview */}
          {typeof modelUrl === 'string' && modelUrl.length > 0 && (
            <div>
              <label className="block text-xs avantbold text-gray-600 mb-2">3D Model Preview</label>
              <div className="w-full h-72 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                {/* Debug log for modelUrl */}
                <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D Viewer...</div>}>
                  <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }} style={{ width: '100%', height: '100%' }}>
                    <Experience modelPath={modelUrl} />
                  </Canvas>
                </Suspense>
              </div>
            </div>
          )}
          {/* Preview Image (optional, fallback) */}
          {previewUrl && (
            <div>
              <label className="block text-xs avantbold text-gray-600 mb-2">Preview Image</label>
              <img 
                src={previewUrl} 
                alt="Generated 3D Model Preview" 
                className="w-full max-w-xs rounded-lg border border-gray-300"
              />
            </div>
          )}
          {/* Actions */}
          <div className="flex space-x-2">
            {modelUrl && (
              <button
                type="button"
                onClick={() => downloadModel(`generated-${Date.now()}.glb`)}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors avant text-xs"
              >
                Download GLB
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors avant text-xs"
            >
              Generate New
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs avant text-red-600 font-medium">Generation Failed:</p>
          <p className="text-xs avant text-red-600">{error}</p>
          
          {error.includes('credits') && (
            <div className="mt-2">
              <a
                href="https://platform.tripo3d.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs avant text-blue-600 hover:text-blue-800 underline"
              >
                Add credits to your Tripo 3D account →
              </a>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs avant hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TripoModelGenerator;