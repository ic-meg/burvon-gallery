import apiRequest from "./apiRequest";

const apiURL = import.meta.env.VITE_CONTENT_API;

const missing = (field) => {
  return { error: `${field} is required`, status: null, data: null };
}

const baseUrl = apiURL; 

const fetchHomepageContent = async () => {
  if (!apiURL) return missing('VITE_CONTENT_API');
  return await apiRequest(baseUrl, null);
}

const createHomepageContent = async (content) => {
  if (!apiURL) return missing('VITE_CONTENT_API');
  if (!content) return missing('content');
  return await apiRequest(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  });
}

const updateHomepageContent = async (content, id = 1) => {
  if (!apiURL) return missing('VITE_CONTENT_API');
  if (!content) return missing('content');
  return await apiRequest(`${baseUrl}${id}`, {
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  });
}


const saveHomepageContent = async (contentData) => {
  if (!apiURL) return missing('VITE_CONTENT_API');
  if (!contentData) return missing('content');
  
  // Send JSON data with Supabase URLs instead of files
  return await apiRequest(`${baseUrl}upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentData),
  });
}

const deleteHomepageContent = async (id = 1) => {
  if (!apiURL) return missing('VITE_CONTENT_API');
  return await apiRequest(`${baseUrl}${id}`, {
    method: 'DELETE',
  });
}

export default { fetchHomepageContent, createHomepageContent, updateHomepageContent, deleteHomepageContent, saveHomepageContent };   
