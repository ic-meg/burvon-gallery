# PSGC API Integration Guide

## Overview
This guide explains the PSGC (Philippine Standard Geographic Code) API integration for the address dropdowns in the checkout process.

## What Changed

### 1. New API Service (`src/services/psgcService.js`)
- Fetches real-time geographic data from the official PSGC API
- Implements 30-day caching in localStorage to reduce API calls
- Provides functions for fetching regions, provinces, cities, and barangays

### 2. Updated AddressDropdowns Component (`src/components/AddressDropdowns.jsx`)
- Now uses PSGC API instead of static data
- Changed from 3-level to 4-level cascading dropdowns:
  - **Old**: Province/Region → City/Municipality → Barangay
  - **New**: Region → Province → City/Municipality → Barangay
- Shows loading states while fetching data
- Maintains fallback to text input if barangay data is unavailable

### 3. Updated Checkout Component (`src/pages/user/cart/Checkout.jsx`)
- New form fields to store both codes and names:
  - `region_code`, `region_name`
  - `province_code`, `province_name`
  - `city_code`, `city_name`
  - `barangay_code`, `barangay_name`
- New handler functions for each dropdown level
- Updated validation to use new field names
- Form submission now uses readable names for display

## Features

###  Real-time Data
- Always up-to-date location data from official government source
- Complete coverage of all Philippine regions, provinces, cities, and barangays
- All dropdowns sorted alphabetically (A-Z) for easy navigation

###  Performance Optimization
- 30-day caching in localStorage
- Only fetches data when needed (cascading)
- Loading indicators for better UX

###  NCR Special Handling
- National Capital Region (NCR) doesn't have provinces in PSGC
- Province dropdown is automatically hidden when NCR is selected
- Cities load directly from region for NCR
- Validation automatically skips province requirement for NCR

###  Error Handling
- Graceful fallback to text input if API fails
- Console error logging for debugging
- User-friendly error states

###  Backward Compatibility
- Postal code remains as manual input (PSGC API doesn't provide postal codes)
- Form submission format compatible with existing backend

## How to Test

### 1. Basic Flow Test (Regular Region)
1. Navigate to checkout page
2. Select a region from the dropdown (e.g., "Region III - Central Luzon")
3. Wait for provinces to load
4. Select a province (e.g., "Pampanga")
5. Wait for cities to load
6. Select a city/municipality (e.g., "Angeles City")
7. Wait for barangays to load
8. Select a barangay
9. Fill in remaining fields and submit

### 1.1 NCR Flow Test
1. Navigate to checkout page
2. Select "National Capital Region (NCR)"
3. Notice the province dropdown is hidden
4. Cities load automatically
5. Select a city (e.g., "Manila", "Quezon City", "Makati")
6. Wait for barangays to load
7. Select a barangay
8. Fill in remaining fields and submit

### 2. Cache Test
1. Complete the basic flow test above
2. Refresh the page
3. Select the same region - it should load instantly (from cache)
4. Check browser console for "Using cached data" messages (if you add logging)

**Note**: To see the alphabetical sorting in action on previously cached data, clear the cache first using `localStorage.clear()` in the browser console, then reload the page.

### 3. Different Regions Test
Try different regions to ensure proper data loading:
- **NCR**: National Capital Region → (no province) → Manila/Quezon City/Makati
- **Region I**: Ilocos Region → Ilocos Norte → Laoag City
- **Region III**: Central Luzon → Pampanga → Angeles City
- **Region IV-A**: CALABARZON → Laguna → Santa Rosa
- **Region VII**: Central Visayas → Cebu → Cebu City
- **Region XI**: Davao Region → Davao del Sur → Davao City

### 4. Error Handling Test
1. Disconnect from internet
2. Try to select a region (should show error in console)
3. If barangays fail to load, component should show text input fallback

### 5. Mobile Responsiveness Test
1. Open checkout on mobile device or use browser dev tools
2. Verify dropdowns work correctly
3. Check loading states display properly

## Cache Management

### View Cache Info
Open browser console and run:
```javascript
import { getCacheInfo } from './services/psgcService';
console.log(getCacheInfo());
```

### Clear Cache
To force fresh data fetch, open browser console and run:
```javascript
import { clearPSGCCache } from './services/psgcService';
clearPSGCCache();
```

Or manually clear localStorage:
```javascript
localStorage.clear();
```

## API Endpoints Used

- **Regions**: `https://psgc.gitlab.io/api/regions/`
- **Provinces**: `https://psgc.gitlab.io/api/regions/{regionCode}/provinces/`
- **Cities**: `https://psgc.gitlab.io/api/provinces/{provinceCode}/cities-municipalities/`
- **Barangays**: `https://psgc.gitlab.io/api/cities-municipalities/{cityCode}/barangays/`

## Known Limitations

1. **Postal Codes**: Not provided by PSGC API - users must enter manually
2. **API Availability**: Depends on PSGC API uptime (has fallback to text input)
3. **Initial Load**: First time selecting a region requires API call (subsequent loads use cache)
4. **NCR Structure**: NCR has a unique structure without provinces - this is handled automatically

## Troubleshooting

### Issue: Dropdowns not loading
**Solution**: Check browser console for errors. Verify internet connection and PSGC API availability.

### Issue: Data seems outdated
**Solution**: Clear cache using `clearPSGCCache()` or wait for 30-day cache expiration.

### Issue: Form validation fails
**Solution**: Ensure all dropdowns are selected. Check if barangay field has either dropdown selection or text input.

### Issue: Barangay dropdown doesn't appear
**Solution**: This might be intentional - some cities might not have barangay data. Text input will appear as fallback.

## Benefits Over Static Data

| Feature | Static Data (Old) | PSGC API (New) |
|---------|------------------|----------------|
| Data Coverage | Partial | Complete |
| Data Accuracy | May be outdated | Always current |
| Maintenance | Manual updates needed | Automatic |
| Bundle Size | Larger (includes data) | Smaller |
| User Experience | Immediate load | Small loading delay |
| Hierarchy | 3 levels | 4 levels (more accurate) |

## Form Submission Data Structure

When submitted, the form sends both codes and names:

```javascript
{
  region_code: "130000000",
  region_name: "National Capital Region",
  province_code: "133900000",
  province_name: "Metro Manila",
  city_code: "137404000",
  city_name: "Manila",
  barangay_code: "137404021",
  barangay_name: "Ermita",
  // ... other fields
}
```

The backend receives the human-readable names for storage and display.

## Future Enhancements

Potential improvements for future versions:

1. **Postal Code Integration**: Integrate a separate postal code API
2. **Type-ahead Search**: Add search functionality for faster location selection
3. **Recent Selections**: Remember user's recent address selections
4. **Geolocation**: Auto-detect user's location and pre-select region
5. **Offline Support**: Include fallback static data for offline scenarios

## Support

For issues or questions:
- Check browser console for error messages
- Verify PSGC API status: https://psgc.gitlab.io/api/
- Review code in `src/services/psgcService.js`
