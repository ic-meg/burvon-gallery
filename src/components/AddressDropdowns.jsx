import React from 'react';
import { philippineLocations, getCitiesByProvince, getBarangaysByCity } from '../data/philippineLocations';

const AddressDropdowns = ({ 
  formData, 
  errors, 
  handleInputChange, 
  handleCityChange, 
  handleProvinceChange, 
  availableBarangays, 
  isMobile = false 
}) => {
  const containerClass = isMobile ? "flex flex-col gap-2" : "flex gap-4";
  const inputClass = isMobile ? "w-full px-3 py-2 rounded-md" : "w-full px-4 py-2 rounded-lg";
  const textClass = isMobile ? "text-xs" : "text-md";
  const labelClass = isMobile ? "bebas text-md block" : "bebas text-lg mb-1 block";
  const errorClass = isMobile ? "text-red-500 text-xs avant" : "text-red-500 text-sm avant";
  const arrowSize = isMobile ? "12px" : "16px";
  const arrowPosition = isMobile ? "right 8px center" : "right 12px center";

  const dropdownStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FFF7DC' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: arrowPosition,
    backgroundRepeat: 'no-repeat',
    backgroundSize: arrowSize
  };

  // Treat NCR cities as province selections with direct barangays
  const isNCRProvince = (() => {
    if (!formData.province_region) return false;
    const ncr = philippineLocations['National Capital Region'];
    return !!(ncr && Array.isArray(ncr[formData.province_region]));
  })();

  if (isMobile) {
    return (
      <>
        <label className={labelClass}>PROVINCE/REGION *</label>
        <select 
          name="province_region"
          value={formData.province_region}
          onChange={handleProvinceChange}
          className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
            errors.province_region ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
          }`}
          style={dropdownStyle}
        >
          <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Province/Region</option>
          {Object.keys(philippineLocations).map(region => (
            Object.keys(philippineLocations[region]).map(province => (
              <option key={province} value={province} className="text-[#FFF7DC] bg-[#181818]">{province}</option>
            ))
          ))}
        </select>
        {errors.province_region && <p className={errorClass}>{errors.province_region}</p>}

        <label className={labelClass}>CITY/MUNICIPALITY *</label>
        <select 
          name="city_municipality"
          value={formData.city_municipality}
          onChange={handleCityChange}
          className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
            errors.city_municipality ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
          } ${!formData.province_region || isNCRProvince ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!formData.province_region || isNCRProvince}
          style={dropdownStyle}
        >
          <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your City/Municipality</option>
          {formData.province_region && 
            (() => {
              // Find the region that contains this province
              for (const regionName in philippineLocations) {
                const regionData = philippineLocations[regionName];
                if (regionData[formData.province_region]) {
                  const provinceData = regionData[formData.province_region];
                  // NCR city-as-province: only option is the selected province (city)
                  if (isNCRProvince) {
                    return [
                      <option key={formData.province_region} value={formData.province_region} className="text-[#FFF7DC] bg-[#181818]">{formData.province_region}</option>
                    ];
                  }
                  // Check if it's an object with cities (like CALABARZON) or an array of municipalities
                  if (typeof provinceData === 'object' && !Array.isArray(provinceData)) {
                    return Object.keys(provinceData).map(city => (
                      <option key={city} value={city} className="text-[#FFF7DC] bg-[#181818]">{city}</option>
                    ));
                  } else {
                    // It's an array of municipalities
                    return provinceData.map(municipality => (
                      <option key={municipality} value={municipality} className="text-[#FFF7DC] bg-[#181818]">{municipality}</option>
                    ));
                  }
                }
              }
              return null;
            })()
          }
        </select>
        {errors.city_municipality && <p className={errorClass}>{errors.city_municipality}</p>}

        <label className={labelClass}>BARANGAY *</label>
        {Array.isArray(availableBarangays) && availableBarangays.length > 0 ? (
          <select 
            name="barangay"
            value={formData.barangay}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
              errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            } ${!formData.city_municipality ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!formData.city_municipality}
            style={dropdownStyle}
          >
            <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Barangay</option>
            {availableBarangays.map(barangay => (
              <option key={barangay} value={barangay} className="text-[#FFF7DC] bg-[#181818]">{barangay}</option>
            ))}
          </select>
        ) : (
          <input 
            type="text"
            name="barangay"
            value={formData.barangay}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 ${
              errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            } ${!formData.city_municipality ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter your Barangay"
            disabled={!formData.city_municipality}
          />
        )}
        {errors.barangay && <p className={errorClass}>{errors.barangay}</p>}
      </>
    );
  }

  return (
    <>
      {/* PROVINCE/REGION */}
      <div>
        <label className={labelClass}>PROVINCE/REGION *</label>
        <select 
          name="province_region"
          value={formData.province_region}
          onChange={handleProvinceChange}
          className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
            errors.province_region ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
          }`}
          style={dropdownStyle}
        >
          <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Province/Region</option>
          {Object.keys(philippineLocations).map(region => (
            Object.keys(philippineLocations[region]).map(province => (
              <option key={province} value={province} className="text-[#FFF7DC] bg-[#181818]">{province}</option>
            ))
          ))}
        </select>
        {errors.province_region && <p className={errorClass}>{errors.province_region}</p>}
      </div>
      
      {/* CITY/MUNICIPALITY and BARANGAY */}
      <div className={containerClass}>
        <div className="flex-1">
          <label className={labelClass}>CITY/MUNICIPALITY *</label>
          <select 
            name="city_municipality"
            value={formData.city_municipality}
            onChange={handleCityChange}
            className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
              errors.city_municipality ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            } ${!formData.province_region || isNCRProvince ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!formData.province_region || isNCRProvince}
            style={dropdownStyle}
          >
            <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your City/Municipality</option>
            {formData.province_region && 
              (() => {
                // Find the region that contains this province
                for (const regionName in philippineLocations) {
                  const regionData = philippineLocations[regionName];
                  if (regionData[formData.province_region]) {
                    const provinceData = regionData[formData.province_region];
                    // NCR city-as-province: only option is the selected province (city)
                    if (isNCRProvince) {
                      return [
                        <option key={formData.province_region} value={formData.province_region} className="text-[#FFF7DC] bg-[#181818]">{formData.province_region}</option>
                      ];
                    }
                    // Check if it's an object with cities (like CALABARZON) or an array of municipalities
                    if (typeof provinceData === 'object' && !Array.isArray(provinceData)) {
                      return Object.keys(provinceData).map(city => (
                        <option key={city} value={city} className="text-[#FFF7DC] bg-[#181818]">{city}</option>
                      ));
                    } else {
                      // It's an array of municipalities
                      return provinceData.map(municipality => (
                        <option key={municipality} value={municipality} className="text-[#FFF7DC] bg-[#181818]">{municipality}</option>
                      ));
                    }
                  }
                }
                return null;
              })()
            }
          </select>
          {errors.city_municipality && <p className={errorClass}>{errors.city_municipality}</p>}
        </div>
        <div className="flex-1">
          <label className={labelClass}>BARANGAY *</label>
          {Array.isArray(availableBarangays) && availableBarangays.length > 0 ? (
            <select 
              name="barangay"
              value={formData.barangay}
              onChange={handleInputChange}
              className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
                errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
              } ${!formData.city_municipality ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!formData.city_municipality}
              style={dropdownStyle}
            >
              <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Barangay</option>
              {availableBarangays.map(barangay => (
                <option key={barangay} value={barangay} className="text-[#FFF7DC] bg-[#181818]">{barangay}</option>
              ))}
            </select>
          ) : (
            <input 
              type="text"
              name="barangay"
              value={formData.barangay}
              onChange={handleInputChange}
              className={`${inputClass} border avant ${textClass} mb-2 ${
                errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
              } ${!formData.city_municipality ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Enter your Barangay"
              disabled={!formData.city_municipality}
            />
          )}
          {errors.barangay && <p className={errorClass}>{errors.barangay}</p>}
        </div>
      </div>
    </>
  );
};

export default AddressDropdowns;
