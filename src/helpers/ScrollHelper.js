/**
 * ScrollHelper - Utility functions for consistent scroll behavior across devices
 */

/**
 * Scroll to top of the page with mobile-optimized behavior
 * @param {Object} options - Scroll options
 * @param {boolean} options.smooth - Whether to use smooth scrolling
 * @param {number} options.delay - Delay before scrolling (ms)
 */
export const scrollToTop = (options = {}) => {
  const { smooth = false, delay = 0 } = options;
  
  const performScroll = () => {
    // Reset any interfering body styles
    document.body.style.overflow = 'auto';
    document.body.style.position = '';
    document.body.style.width = '';
    
    const isMobile = window.innerWidth < 768;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile-optimized scrolling
      if (smooth) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        // Use immediate scroll for mobile
        window.scrollTo(0, 0);
        
        // iOS Safari fallback
        if (isIOS) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      }
    } else {
      // Desktop scrolling
      window.scrollTo({ 
        top: 0, 
        left: 0, 
        behavior: smooth ? 'smooth' : 'auto' 
      });
    }
    
    // Also scroll any scrollable main containers
    const mainElement = document.querySelector('main');
    if (mainElement && mainElement.scrollHeight > mainElement.clientHeight) {
      mainElement.scrollTop = 0;
    }
  };
  
  if (delay > 0) {
    setTimeout(performScroll, delay);
  } else {
    performScroll();
  }
};

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} Whether element is in viewport
 */
export const isInViewport = (element, threshold = 0.1) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -rect.height * threshold &&
    rect.left >= -rect.width * threshold &&
    rect.bottom <= windowHeight + rect.height * threshold &&
    rect.right <= windowWidth + rect.width * threshold
  );
};

/**
 * Get current scroll position
 * @returns {Object} Scroll position {x, y}
 */
export const getScrollPosition = () => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
};

/**
 * Scroll to specific element
 * @param {string|Element} target - Element selector or element
 * @param {Object} options - Scroll options
 */
export const scrollToElement = (target, options = {}) => {
  const { 
    offset = 0, 
    smooth = true, 
    delay = 0 
  } = options;
  
  const performScroll = () => {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (!element) return;
    
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const targetPosition = elementTop - offset;
    
    window.scrollTo({
      top: targetPosition,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };
  
  if (delay > 0) {
    setTimeout(performScroll, delay);
  } else {
    performScroll();
  }
};

/**
 * Prevent scroll on body (useful for modals/overlays)
 * @param {boolean} prevent - Whether to prevent scrolling
 */
export const preventBodyScroll = (prevent = true) => {
  if (prevent) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.overflow = 'auto';
    document.body.style.position = '';
    document.body.style.width = '';
  }
};
