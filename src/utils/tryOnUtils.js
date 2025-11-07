
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

// Check if a product has try-on available
export const hasTryOnAvailable = (categoryName, productName) => {
  if (!categoryName || !productName) return false;
  
  const tryOnCategory = mapCategoryToTryOn(categoryName);
  if (!tryOnCategory || !tryOnProducts[tryOnCategory]) return false;
  
  // Check if product exists in the try-on products list (case-insensitive)
  return tryOnProducts[tryOnCategory].some(
    product => product.name.toLowerCase() === productName.toLowerCase()
  );
};

