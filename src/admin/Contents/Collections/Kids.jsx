import React, { useState } from 'react';

import {
  AddImage,
  Remove
} from '../../../assets/index.js';

const Kids = () => {
  const [kidsImages, setKidsImages] = useState([null, null, null, null, null, null, null, null]);
  const [promotionalTitle, setPromotionalTitle] = useState('Style It On You');
  const [promotionalDescription, setPromotionalDescription] = useState('Experience our virtual try-on feature and see how each piece looks on you.');
  const [promotionalImage, setPromotionalImage] = useState(null);

  // Handle kids carousel image upload
  const handleKidsImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newKidsImages = [...kidsImages];
      newKidsImages[index] = file;
      setKidsImages(newKidsImages);
    }
  };

  // Handle kids image removal
  const handleKidsImageRemove = (index) => {
    const newKidsImages = [...kidsImages];
    newKidsImages[index] = null;
    setKidsImages(newKidsImages);
  };

  // Handle promotional image upload
  const handlePromotionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPromotionalImage(file);
    }
  };

  // Handle promotional image removal
  const handlePromotionalImageRemove = () => {
    setPromotionalImage(null);
  };

  // Save changes handler
  const handleSaveChanges = () => {
    console.log('Saving kids collection changes...');
    // Add your save logic here
  };

  // Preview handler
  const handlePreview = () => {
    console.log('Opening kids collection preview...');
    // Add your preview logic here
  };

  return (
    <div className="grid grid-cols-2 gap-8 -mt-8 h-full">
      {/* Left Column - Forms and Inputs */}
      <div className="space-y-8">
        
        {/* Kids Collection Carousel Section */}
        <div className="space-y-4">
          <h2 className="text-left text-5xl bebas text-black">KIDS COLLECTION CAROUSEL</h2>
          <div className="flex items-start space-x-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {kidsImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                    {image ? (
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Kids Item ${index + 1}`} 
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
                      onChange={(e) => handleKidsImageUpload(index, e)}
                    />
                  </label>
                  {/* Remove button for kids images */}
                  {image && (
                    <button
                      onClick={() => handleKidsImageRemove(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-colors transition-transform duration-150 hover:scale-125"
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
                  value={promotionalTitle}
                  onChange={(e) => setPromotionalTitle(e.target.value)}
                  className="w-64 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black"
                />
              </div>

              <div>
                <label className="block text-lg avantbold text-black mb-2">DESCRIPTION <span className="text-[#959595] text-sm avant font-normal">Maximum of 100 characters.</span></label>
                <textarea
                  value={promotionalDescription}
                  onChange={(e) => setPromotionalDescription(e.target.value.slice(0, 100))}
                  maxLength={100}
                  rows={3}
                  className="w-80 px-3 py-2 border-2 border-black rounded-lg focus:outline-none avant text-sm text-black resize-none"
                />
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
              {promotionalImage && (
                <button
                  onClick={handlePromotionalImageRemove}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-colors transition-transform duration-150 hover:scale-125"
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
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors avantbold text-sm"
          >
            SAVE CHANGES
          </button>
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

export default Kids;
