import React, { createContext, useContext, useState, useEffect } from 'react';
import contentApi from '../api/contentApi';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [homepageContent, setHomepageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch homepage content from API
  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contentApi.fetchHomepageContent();
      
      if (response.error) {
        console.warn('Content API error:', response.error);
        // Set error state so Homepage can detect server down
        setError(response.error);
        setHomepageContent(null);
      } else if (response.data) {
        setHomepageContent(response.data);
      } else {
        setHomepageContent(null);
      }
    } catch (err) {
      console.error('Failed to fetch homepage content:', err);
      setError(err.message);
      setHomepageContent(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh content 
  const refreshContent = () => {
    fetchHomepageContent();
  };

  // Update local content state 
  const updateHomepageContent = (newContent) => {
    setHomepageContent(newContent);
  };

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const value = {
    homepageContent,
    loading,
    error,
    refreshContent,
    updateHomepageContent,
    fetchHomepageContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentContext;