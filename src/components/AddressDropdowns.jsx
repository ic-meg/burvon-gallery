import React, { useState, useEffect } from 'react';
import { fetchRegions, fetchProvinces, fetchCities, fetchCitiesFromRegion, fetchBarangays } from '../services/psgcService';

const AddressDropdowns = ({
  formData,
  errors,
  handleInputChange,
  handleRegionChange,
  handleProvinceChange,
  handleCityChange,
  availableBarangays,
  availablePostalCodes,
  isMobile = false
}) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false
  });

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

  useEffect(() => {
    const loadRegions = async () => {
      setLoading(prev => ({ ...prev, regions: true }));
      try {
        const data = await fetchRegions();
        setRegions(data);
      } catch (error) {
        console.error('Failed to load regions:', error);
      } finally {
        setLoading(prev => ({ ...prev, regions: false }));
      }
    };

    loadRegions();
  }, []);

  useEffect(() => {
    const loadProvinces = async () => {
      if (!formData.region_code) {
        setProvinces([]);
        setCities([]);
        return;
      }

      setLoading(prev => ({ ...prev, provinces: true }));
      try {
        const data = await fetchProvinces(formData.region_code);
        setProvinces(data);

        // Special handling for NCR: if no provinces, load cities directly from region
        if (data.length === 0 && formData.region_code === '130000000') {
          setLoading(prev => ({ ...prev, cities: true }));
          try {
            const citiesData = await fetchCitiesFromRegion(formData.region_code);
            setCities(citiesData);
          } catch (error) {
            console.error('Failed to load NCR cities:', error);
            setCities([]);
          } finally {
            setLoading(prev => ({ ...prev, cities: false }));
          }
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error('Failed to load provinces:', error);
        setProvinces([]);
        setCities([]);
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, [formData.region_code]);

  useEffect(() => {
    const loadCities = async () => {
      if (formData.region_code === '130000000') {
        return;
      }

      if (!formData.province_code) {
        setCities([]);
        return;
      }

      setLoading(prev => ({ ...prev, cities: true }));
      try {
        const data = await fetchCities(formData.province_code);
        setCities(data);
      } catch (error) {
        console.error('Failed to load cities:', error);
        setCities([]);
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    };

    loadCities();
  }, [formData.province_code, formData.region_code]);

  // Check if NCR is selected
  const isNCR = formData.region_code === '130000000';

  if (isMobile) {
    return (
      <>
        <label className={labelClass}>REGION *</label>
        <select
          name="region"
          value={formData.region_code || ''}
          onChange={handleRegionChange}
          className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
            errors.region ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
          } ${loading.regions ? 'opacity-50' : ''}`}
          style={dropdownStyle}
          disabled={loading.regions}
        >
          <option value="" className="text-[#FFF7DC] bg-[#181818]">
            {loading.regions ? 'Loading regions...' : 'Select your Region'}
          </option>
          {regions.map(region => (
            <option key={region.code} value={region.code} className="text-[#FFF7DC] bg-[#181818]">
              {region.name}
            </option>
          ))}
        </select>
        {errors.region && <p className={errorClass}>{errors.region}</p>}

        {/* Hide province dropdown for NCR */}
        {!isNCR && (
          <>
            <label className={labelClass}>PROVINCE *</label>
            <select
              name="province"
              value={formData.province_code || ''}
              onChange={handleProvinceChange}
              className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
                errors.province ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
              } ${!formData.region_code || loading.provinces ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!formData.region_code || loading.provinces}
              style={dropdownStyle}
            >
              <option value="" className="text-[#FFF7DC] bg-[#181818]">
                {loading.provinces ? 'Loading provinces...' : 'Select your Province'}
              </option>
              {provinces.map(province => (
                <option key={province.code} value={province.code} className="text-[#FFF7DC] bg-[#181818]">
                  {province.name}
                </option>
              ))}
            </select>
            {errors.province && <p className={errorClass}>{errors.province}</p>}
          </>
        )}

        <label className={labelClass}>CITY/MUNICIPALITY *</label>
        <select
          name="city"
          value={formData.city_code || ''}
          onChange={handleCityChange}
          className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
            errors.city ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
          } ${(!formData.province_code && !isNCR) || loading.cities ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={(!formData.province_code && !isNCR) || loading.cities}
          style={dropdownStyle}
        >
          <option value="" className="text-[#FFF7DC] bg-[#181818]">
            {loading.cities ? 'Loading cities...' : 'Select your City/Municipality'}
          </option>
          {cities.map(city => (
            <option key={city.code} value={city.code} className="text-[#FFF7DC] bg-[#181818]">
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && <p className={errorClass}>{errors.city}</p>}

        <label className={labelClass}>BARANGAY *</label>
        {loading.barangays ? (
          <div className={`${inputClass} border border-[#FFF7DC] bg-[#181818] text-[#FFF7DC] mb-2 flex items-center justify-center ${textClass}`}>
            <span>Loading barangays...</span>
          </div>
        ) : Array.isArray(availableBarangays) && availableBarangays.length > 0 ? (
          <select
            name="barangay"
            value={formData.barangay_code || ''}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
              errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            } ${!formData.city_code ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!formData.city_code}
            style={dropdownStyle}
          >
            <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Barangay</option>
            {availableBarangays.map(barangay => (
              <option key={barangay.code} value={barangay.code} className="text-[#FFF7DC] bg-[#181818]">
                {barangay.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="barangay"
            value={formData.barangay || ''}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 ${
              errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            } ${!formData.city_code ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter your Barangay"
            disabled={!formData.city_code}
          />
        )}
        {errors.barangay && <p className={errorClass}>{errors.barangay}</p>}

        <label className={labelClass}>POSTAL CODE *</label>
        {Array.isArray(availablePostalCodes) && availablePostalCodes.length > 1 ? (
          <select
            name="postal_code"
            value={formData.postal_code || ''}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
              errors.postal_code ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            }`}
            style={dropdownStyle}
          >
            <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Postal Code</option>
            {availablePostalCodes.map(postalCode => (
              <option key={postalCode} value={postalCode} className="text-[#FFF7DC] bg-[#181818]">
                {postalCode}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code || ''}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 ${
              errors.postal_code ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            }`}
            placeholder="Enter your Postal Code"
            disabled={availablePostalCodes.length === 1}
          />
        )}
        {errors.postal_code && <p className={errorClass}>{errors.postal_code}</p>}
      </>
    );
  }

  return (
    <>
      {/* REGION */}
      <div>
        <label className={labelClass}>REGION *</label>
        <select
          name="region"
          value={formData.region_code || ''}
          onChange={handleRegionChange}
          className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
            errors.region ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
          } ${loading.regions ? 'opacity-50' : ''}`}
          style={dropdownStyle}
          disabled={loading.regions}
        >
          <option value="" className="text-[#FFF7DC] bg-[#181818]">
            {loading.regions ? 'Loading regions...' : 'Select your Region'}
          </option>
          {regions.map(region => (
            <option key={region.code} value={region.code} className="text-[#FFF7DC] bg-[#181818]">
              {region.name}
            </option>
          ))}
        </select>
        {errors.region && <p className={errorClass}>{errors.region}</p>}
      </div>

      {/* PROVINCE - Hide for NCR */}
      {!isNCR && (
        <div>
          <label className={labelClass}>PROVINCE *</label>
          <select
            name="province"
            value={formData.province_code || ''}
            onChange={handleProvinceChange}
            className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
              errors.province ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            } ${!formData.region_code || loading.provinces ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!formData.region_code || loading.provinces}
            style={dropdownStyle}
          >
            <option value="" className="text-[#FFF7DC] bg-[#181818]">
              {loading.provinces ? 'Loading provinces...' : 'Select your Province'}
            </option>
            {provinces.map(province => (
              <option key={province.code} value={province.code} className="text-[#FFF7DC] bg-[#181818]">
                {province.name}
              </option>
            ))}
          </select>
          {errors.province && <p className={errorClass}>{errors.province}</p>}
        </div>
      )}

      {/* CITY/MUNICIPALITY and BARANGAY */}
      <div className={containerClass}>
        <div className="flex-1">
          <label className={labelClass}>CITY/MUNICIPALITY *</label>
          <select
            name="city"
            value={formData.city_code || ''}
            onChange={handleCityChange}
            className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
              errors.city ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            } ${(!formData.province_code && !isNCR) || loading.cities ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={(!formData.province_code && !isNCR) || loading.cities}
            style={dropdownStyle}
          >
            <option value="" className="text-[#FFF7DC] bg-[#181818]">
              {loading.cities ? 'Loading cities...' : 'Select your City/Municipality'}
            </option>
            {cities.map(city => (
              <option key={city.code} value={city.code} className="text-[#FFF7DC] bg-[#181818]">
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && <p className={errorClass}>{errors.city}</p>}
        </div>
        <div className="flex-1">
          <label className={labelClass}>BARANGAY *</label>
          {loading.barangays ? (
            <div className={`${inputClass} border border-[#FFF7DC] bg-[#181818] text-[#FFF7DC] mb-2 flex items-center justify-center ${textClass}`}>
              <span>Loading barangays...</span>
            </div>
          ) : Array.isArray(availableBarangays) && availableBarangays.length > 0 ? (
            <select
              name="barangay"
              value={formData.barangay_code || ''}
              onChange={handleInputChange}
              className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
                errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
              } ${!formData.city_code ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!formData.city_code}
              style={dropdownStyle}
            >
              <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Barangay</option>
              {availableBarangays.map(barangay => (
                <option key={barangay.code} value={barangay.code} className="text-[#FFF7DC] bg-[#181818]">
                  {barangay.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="barangay"
              value={formData.barangay || ''}
              onChange={handleInputChange}
              className={`${inputClass} border avant ${textClass} mb-2 ${
                errors.barangay ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
              } ${!formData.city_code ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Enter your Barangay"
              disabled={!formData.city_code}
            />
          )}
          {errors.barangay && <p className={errorClass}>{errors.barangay}</p>}
        </div>
      </div>

      {/* POSTAL CODE */}
      <div>
        <label className={labelClass}>POSTAL CODE *</label>
        {Array.isArray(availablePostalCodes) && availablePostalCodes.length > 1 ? (
          <select
            name="postal_code"
            value={formData.postal_code || ''}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 appearance-none cursor-pointer ${
              errors.postal_code ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            }`}
            style={dropdownStyle}
          >
            <option value="" className="text-[#FFF7DC] bg-[#181818]">Select your Postal Code</option>
            {availablePostalCodes.map(postalCode => (
              <option key={postalCode} value={postalCode} className="text-[#FFF7DC] bg-[#181818]">
                {postalCode}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code || ''}
            onChange={handleInputChange}
            className={`${inputClass} border avant ${textClass} mb-2 ${
              errors.postal_code ? 'border-red-500 bg-[#2a2a2a] text-red-400' : 'border-[#FFF7DC] bg-[#181818] text-[#FFF7DC]'
            }`}
            placeholder="Enter your Postal Code"
            disabled={availablePostalCodes.length === 1}
          />
        )}
        {errors.postal_code && <p className={errorClass}>{errors.postal_code}</p>}
      </div>
    </>
  );
};

export default AddressDropdowns;
