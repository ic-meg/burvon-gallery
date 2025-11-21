/**
 * PSGC API Service
 * Philippine Standard Geographic Code API Integration
 * Provides functions to fetch regions, provinces, cities, and barangays
 * with built-in caching mechanism
 */

const PSGC_BASE_URL = 'https://psgc.gitlab.io/api';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Get cached data from localStorage
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(`psgc_${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
      // Remove expired cache
      localStorage.removeItem(`psgc_${key}`);
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
};

/**
 * Set cached data in localStorage
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
const setCachedData = (key, data) => {
  try {
    localStorage.setItem(`psgc_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

/**
 * Generic fetch function with caching
 * @param {string} endpoint - API endpoint
 * @param {string} cacheKey - Cache key
 * @returns {Promise<any>} - API response data
 */
const fetchWithCache = async (endpoint, cacheKey) => {
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  try {
    const response = await fetch(`${PSGC_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    setCachedData(cacheKey, data);

    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Fetch all regions
 * @returns {Promise<Array>} - Array of region objects sorted alphabetically
 */
export const fetchRegions = async () => {
  const data = await fetchWithCache('/regions/', 'regions');
  // Sort alphabetically by name
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Fetch provinces by region code
 * Note: NCR (National Capital Region) doesn't have provinces, only cities
 * @param {string} regionCode - Region code (e.g., "130000000")
 * @returns {Promise<Array>} - Array of province objects sorted alphabetically
 */
export const fetchProvinces = async (regionCode) => {
  if (!regionCode) {
    throw new Error('Region code is required');
  }

  // NCR code is 130000000 - it has no provinces, only cities/municipalities
  // Return empty array for NCR to skip the province dropdown
  if (regionCode === '130000000') {
    return [];
  }

  const data = await fetchWithCache(`/regions/${regionCode}/provinces/`, `provinces_${regionCode}`);
  // Sort alphabetically by name
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Fetch cities/municipalities by province code
 * @param {string} provinceCode - Province code
 * @returns {Promise<Array>} - Array of city/municipality objects sorted alphabetically
 */
export const fetchCities = async (provinceCode) => {
  if (!provinceCode) {
    throw new Error('Province code is required');
  }
  const data = await fetchWithCache(`/provinces/${provinceCode}/cities-municipalities/`, `cities_${provinceCode}`);
  // Sort alphabetically by name
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Fetch cities/municipalities directly from region (for NCR)
 * @param {string} regionCode - Region code
 * @returns {Promise<Array>} - Array of city/municipality objects sorted alphabetically
 */
export const fetchCitiesFromRegion = async (regionCode) => {
  if (!regionCode) {
    throw new Error('Region code is required');
  }
  const data = await fetchWithCache(`/regions/${regionCode}/cities-municipalities/`, `cities_region_${regionCode}`);
  // Sort alphabetically by name
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Fetch barangays by city/municipality code
 * @param {string} cityCode - City/Municipality code
 * @returns {Promise<Array>} - Array of barangay objects sorted alphabetically
 */
export const fetchBarangays = async (cityCode) => {
  if (!cityCode) {
    throw new Error('City code is required');
  }
  const data = await fetchWithCache(`/cities-municipalities/${cityCode}/barangays/`, `barangays_${cityCode}`);
  // Sort alphabetically by name
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Clear all PSGC cache from localStorage
 * Useful for forcing fresh data fetch
 */
export const clearPSGCCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('psgc_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('PSGC cache cleared');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};

/**
 * Get cache info (for debugging)
 * @returns {Object} - Cache statistics
 */
export const getCacheInfo = () => {
  try {
    const keys = Object.keys(localStorage);
    const psgcKeys = keys.filter(key => key.startsWith('psgc_'));

    const cacheInfo = {
      totalCachedItems: psgcKeys.length,
      items: []
    };

    psgcKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        const { timestamp, data } = JSON.parse(cached);
        const ageInDays = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));

        cacheInfo.items.push({
          key: key.replace('psgc_', ''),
          itemCount: Array.isArray(data) ? data.length : 1,
          ageInDays,
          expiresInDays: 30 - ageInDays
        });
      } catch (e) {
        // Skip invalid entries
      }
    });

    return cacheInfo;
  } catch (error) {
    console.error('Failed to get cache info:', error);
    return { totalCachedItems: 0, items: [] };
  }
};
