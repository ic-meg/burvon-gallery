
import storageService from '../services/storageService';

let tryOnProducts;
try {
  const imported = await import('./tryOnProducts.generated.js');
  tryOnProducts = imported.tryOnProducts;
} catch (error) {
  console.warn('tryOnProducts.generated.js not found. Run "npm run generate:tryon" to generate it.');
  tryOnProducts = {
    necklace: [],
    earrings: [],
    rings: [],
    bracelet: []
  };
}

export { tryOnProducts };

export const mapCategoryToTryOn = (categoryName) => {
  if (!categoryName) return null;
  const normalized = categoryName.toLowerCase().trim();
  
  if (normalized.includes("necklace")) return "necklace";
  if (normalized.includes("earring")) return "earrings";
  if (normalized.includes("ring")) return "rings";
  if (normalized.includes("bracelet")) return "bracelet";
  
  return null;
};

const generateLocalTryOnImagePath = (categoryName, productName) => {
  if (!categoryName || !productName) return null;
  
  const tryOnCategory = mapCategoryToTryOn(categoryName);
  if (!tryOnCategory) return null;
  
  const categoryMap = {
    necklace: "Necklace",
    earrings: "Earrings",
    rings: "Rings",
    bracelet: "Bracelets"
  };
  
  const categoryFolder = categoryMap[tryOnCategory];
  if (!categoryFolder) return null;
  
  const titleCase = productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();
  return `/image/${categoryFolder}/${titleCase}Image.png`;
};

const imageExistenceCache = new Map();
const pendingChecks = new Map();

const checkImageExists = (imagePath) => {
  return new Promise((resolve) => {
    if (imageExistenceCache.has(imagePath)) {
      resolve(imageExistenceCache.get(imagePath));
      return;
    }
    
    if (pendingChecks.has(imagePath)) {
      pendingChecks.get(imagePath).push(resolve);
      return;
    }
    
    const resolvers = [resolve];
    pendingChecks.set(imagePath, resolvers);
    
    const img = new Image();
    img.onload = () => {
      imageExistenceCache.set(imagePath, true);
      pendingChecks.delete(imagePath);
      resolvers.forEach(r => r(true));
    };
    img.onerror = () => {
      imageExistenceCache.set(imagePath, false);
      pendingChecks.delete(imagePath);
      resolvers.forEach(r => r(false));
    };
    img.src = imagePath;
  });
};

export const preloadTryOnAvailability = async (products) => {
  if (!Array.isArray(products)) return;
  
  const checkPromises = products.map(product => {
    if (!product.category || !product.name) return null;
    
    if (product.try_on_image_path) {
      const supabaseUrl = storageService.getTryOnImageUrl(product.try_on_image_path);
      if (supabaseUrl) {
        imageExistenceCache.set(supabaseUrl, true);
      }
      return Promise.resolve(true);
    }
    
    const categoryName = typeof product.category === 'string'
      ? product.category
      : product.category?.name;
    
    if (!categoryName) return null;
    
    const imagePath = generateLocalTryOnImagePath(categoryName, product.name);
    if (!imagePath) return null;
    return checkImageExists(imagePath);
  }).filter(Boolean);
  
  await Promise.all(checkPromises);
};

const hasTryOnImageCached = (categoryName, productName) => {
  const imagePath = generateLocalTryOnImagePath(categoryName, productName);
  if (!imagePath) return false;
  return imageExistenceCache.get(imagePath) === true;
};

export const hasTryOnAvailable = (categoryName, productName, supabasePath = null) => {
  if (supabasePath) return true;
  
  if (!categoryName || !productName) return false;
  
  const tryOnCategory = mapCategoryToTryOn(categoryName);
  if (!tryOnCategory) return false;
  
  const cachedResult = hasTryOnImageCached(categoryName, productName);
  if (cachedResult) return true;
  
  if (tryOnProducts[tryOnCategory]) {
    const inHardcodedList = tryOnProducts[tryOnCategory].some(
      product => product.name.toLowerCase() === productName.toLowerCase()
    );
    if (inHardcodedList) {
      const imagePath = generateLocalTryOnImagePath(categoryName, productName);
      if (imagePath) {
        imageExistenceCache.set(imagePath, true);
      }
      return true;
    }
  }
  
  const imagePath = generateLocalTryOnImagePath(categoryName, productName);
  if (imagePath && !pendingChecks.has(imagePath)) {
    checkImageExists(imagePath).catch(() => {});
  }
  
  return false;
};

export const hasTryOnAvailableAsync = async (categoryName, productName, supabasePath = null) => {
  if (supabasePath) return true;
  
  if (!categoryName || !productName) return false;
  
  const tryOnCategory = mapCategoryToTryOn(categoryName);
  if (!tryOnCategory) return false;
  
  const imagePath = generateLocalTryOnImagePath(categoryName, productName);
  if (!imagePath) return false;
  
  return await checkImageExists(imagePath);
};

export const getTryOnImageUrl = async (categoryName, productName, supabasePath = null) => {
  if (supabasePath) {
    const supabaseUrl = storageService.getTryOnImageUrl(supabasePath);
    if (supabaseUrl) return supabaseUrl;
  }
  
  const localPath = generateLocalTryOnImagePath(categoryName, productName);
  if (localPath) {
    const exists = await checkImageExists(localPath);
    if (exists) return localPath;
  }
  
  return null;
};

export const getTryOnImageUrlSync = (categoryName, productName, supabasePath = null) => {
  if (supabasePath) {
    return storageService.getTryOnImageUrl(supabasePath);
  }
  
  const localPath = generateLocalTryOnImagePath(categoryName, productName);
  if (localPath && imageExistenceCache.get(localPath) === true) {
    return localPath;
  }
  
  return localPath;
};

