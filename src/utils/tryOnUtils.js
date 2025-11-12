// OPTIONAL: Hardcoded list for immediate availability (performance optimization)
//   /public/image/{Category}/{ProductName}Image.png
//   Example: /public/image/Rings/DojaImage.png
export const tryOnProducts = {
  necklace: [
    { name: "Lyric" },
  ],
  earrings: [
    { name: "ESPOIR" },
  ],
  rings: [
    { name: "Tiana" },
  ],
  bracelet: [
    { name: "SOLEIL" },
  ],
};

export const mapCategoryToTryOn = (categoryName) => {
  if (!categoryName) return null;
  const normalized = categoryName.toLowerCase().trim();
  
  if (normalized.includes("necklace")) return "necklace";
  if (normalized.includes("earring")) return "earrings";
  if (normalized.includes("ring")) return "rings";
  if (normalized.includes("bracelet")) return "bracelet";
  
  return null;
};

const generateTryOnImagePath = (categoryName, productName) => {
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
  
  // Format product name: capitalize first letter, lowercase rest, append "Image.png"
  const titleCase = productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();
  return `/image/${categoryFolder}/${titleCase}Image.png`;
};

const imageExistenceCache = new Map();
const pendingChecks = new Map();

const checkImageExists = (imagePath) => {
  return new Promise((resolve) => {
    // Check cache first
    if (imageExistenceCache.has(imagePath)) {
      resolve(imageExistenceCache.get(imagePath));
      return;
    }
    
    // If already checking this image, wait for that check
    if (pendingChecks.has(imagePath)) {
      pendingChecks.get(imagePath).push(resolve);
      return;
    }
    
    // Create new pending check
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
    const imagePath = generateTryOnImagePath(product.category, product.name);
    if (!imagePath) return null;
    return checkImageExists(imagePath);
  }).filter(Boolean);
  
  await Promise.all(checkPromises);
};

const hasTryOnImageCached = (categoryName, productName) => {
  const imagePath = generateTryOnImagePath(categoryName, productName);
  if (!imagePath) return false;
  return imageExistenceCache.get(imagePath) === true;
};

export const hasTryOnAvailable = (categoryName, productName) => {
  if (!categoryName || !productName) return false;
  
  const tryOnCategory = mapCategoryToTryOn(categoryName);
  if (!tryOnCategory) return false;
  
  // First check cache (fast, synchronous)
  const cachedResult = hasTryOnImageCached(categoryName, productName);
  if (cachedResult) return true;
  
  if (tryOnProducts[tryOnCategory]) {
    const inHardcodedList = tryOnProducts[tryOnCategory].some(
      product => product.name.toLowerCase() === productName.toLowerCase()
    );
    if (inHardcodedList) {
      const imagePath = generateTryOnImagePath(categoryName, productName);
      if (imagePath) {
        imageExistenceCache.set(imagePath, true);
      }
      return true;
    }
  }
  
  // Note: This returns false initially, but cache will be populated for next render
  const imagePath = generateTryOnImagePath(categoryName, productName);
  if (imagePath && !pendingChecks.has(imagePath)) {
    checkImageExists(imagePath).catch(() => {
    });
  }
  
  return false;
};

// Async version that waits for image check
export const hasTryOnAvailableAsync = async (categoryName, productName) => {
  if (!categoryName || !productName) return false;
  
  const tryOnCategory = mapCategoryToTryOn(categoryName);
  if (!tryOnCategory) return false;
  
  const imagePath = generateTryOnImagePath(categoryName, productName);
  if (!imagePath) return false;
  
  return await checkImageExists(imagePath);
};

