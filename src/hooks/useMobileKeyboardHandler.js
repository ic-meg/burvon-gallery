import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling mobile keyboard visibility
 * Works for both Android (visualViewport) and iOS (fallback methods)
 * 
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.containerRef - Ref to the container element to adjust
 * @param {React.RefObject} options.scrollContainerRef - Ref to the scrollable container (optional)
 * @param {React.RefObject} options.inputRef - Ref to the input element (optional)
 * @param {React.RefObject} options.alternativeInputRef - Ref to alternative input element (optional)
 * @param {boolean} options.enabled - Whether keyboard handling is enabled (default: true)
 * @param {number} options.keyboardThreshold - Minimum keyboard height to trigger adjustment (default: 150)
 * 
 * @example
 * const containerRef = useRef(null);
 * const scrollRef = useRef(null);
 * const inputRef = useRef(null);
 * useMobileKeyboardHandler({
 *   containerRef,
 *   scrollContainerRef: scrollRef,
 *   inputRef,
 *   enabled: isOpen
 * });
 */
export const useMobileKeyboardHandler = ({
  containerRef,
  scrollContainerRef = null,
  inputRef = null,
  alternativeInputRef = null,
  enabled = true,
  keyboardThreshold = 150
}) => {
  const initialWindowHeightRef = useRef(null);
  const keyboardOpenRef = useRef(false);

  useEffect(() => {
    if (!enabled || !containerRef?.current) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    // Detect iOS - iOS Safari has unreliable visualViewport support
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Initialize height
    initialWindowHeightRef.current = window.innerHeight;

    // Android: Use visualViewport API (works reliably)
    const handleViewportResize = () => {
      if (!window.visualViewport || !containerRef.current) return;

      const viewportHeight = window.visualViewport.height;
      const viewportTop = window.visualViewport.offsetTop;
      const windowHeight = window.innerHeight;
      const keyboardHeight = windowHeight - viewportHeight;

      // Check if keyboard is open (significant viewport height difference)
      if (keyboardHeight > keyboardThreshold) {
        keyboardOpenRef.current = true;
        // Keyboard is open - adjust container to fit viewport
        containerRef.current.style.height = `${viewportHeight}px`;
        containerRef.current.style.top = `${viewportTop}px`;
        containerRef.current.style.bottom = 'auto';
        containerRef.current.style.position = 'fixed';
        
        // Ensure input is visible by scrolling if needed
        if (scrollContainerRef?.current && (inputRef?.current || alternativeInputRef?.current)) {
          setTimeout(() => {
            const inputElement = inputRef?.current || alternativeInputRef?.current;
            const inputContainer = inputElement?.closest('.p-4') || inputElement?.parentElement;
            
            if (inputContainer) {
              const inputTop = inputContainer.getBoundingClientRect().top;
              const viewportBottom = viewportTop + viewportHeight;
              const inputHeight = inputContainer.offsetHeight;
              
              // If input is below visible area, scroll up
              if (inputTop + inputHeight > viewportBottom) {
                const scrollAmount = (inputTop + inputHeight) - viewportBottom + 20; // 20px padding
                scrollContainerRef.current.scrollTop += scrollAmount;
              }
            }
            
            // Always ensure we can see the input by scrolling to bottom
            scrollContainerRef.current.scrollTo({
              top: scrollContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }, 150);
        }
      } else {
        keyboardOpenRef.current = false;
        // Keyboard is closed - use full screen
        containerRef.current.style.height = `${windowHeight}px`;
        containerRef.current.style.top = '0';
        containerRef.current.style.bottom = 'auto';
      }
    };

    // iOS: Fallback using window resize and scrollIntoView
    const handleIOSKeyboard = () => {
      if (!isIOS || !containerRef.current) return;

      const currentHeight = window.innerHeight;
      const heightDiff = initialWindowHeightRef.current - currentHeight;
      const isKeyboardVisible = heightDiff > keyboardThreshold;

      if (isKeyboardVisible && !keyboardOpenRef.current) {
        keyboardOpenRef.current = true;
        // Adjust container height
        containerRef.current.style.height = `${currentHeight}px`;
        containerRef.current.style.top = '0';
        containerRef.current.style.position = 'fixed';
        
        // Scroll input into view - iOS needs this approach
        const activeInput = inputRef?.current || alternativeInputRef?.current;
        if (activeInput) {
          // Multiple attempts for iOS which can be slow
          setTimeout(() => {
            activeInput.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end',
              inline: 'nearest'
            });
            
            // Also scroll scroll container if provided
            if (scrollContainerRef?.current) {
              scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }
          }, 300);
          
          // Second attempt for slower iOS devices
          setTimeout(() => {
            activeInput.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end'
            });
          }, 600);
        }
      } else if (!isKeyboardVisible && keyboardOpenRef.current) {
        keyboardOpenRef.current = false;
        containerRef.current.style.height = `${initialWindowHeightRef.current}px`;
        containerRef.current.style.top = '0';
      }
    };

    const handleWindowResize = () => {
      // iOS fallback: detect keyboard via window height changes
      if (isIOS) {
        handleIOSKeyboard();
      }
    };

    const handleInputFocus = (e) => {
      const targetInput = inputRef?.current || alternativeInputRef?.current;
      if (e.target === targetInput) {
        // Store initial height
        initialWindowHeightRef.current = window.innerHeight;
        
        if (isIOS) {
          // iOS: Use window resize detection
          setTimeout(() => {
            handleIOSKeyboard();
          }, 100);
        } else {
          // Android: Use visualViewport
          setTimeout(() => {
            handleViewportResize();
            
            // Additional scroll to ensure input is visible
            if (scrollContainerRef?.current) {
              setTimeout(() => {
                scrollContainerRef.current.scrollTo({
                  top: scrollContainerRef.current.scrollHeight,
                  behavior: 'smooth'
                });
              }, 300);
            }
          }, 100);
        }
      }
    };

    const handleInputBlur = () => {
      // Reset when keyboard closes
      setTimeout(() => {
        if (!containerRef.current) return;
        
        if (isIOS) {
          const currentHeight = window.innerHeight;
          const heightDiff = initialWindowHeightRef.current - currentHeight;
          if (heightDiff <= 50) {
            keyboardOpenRef.current = false;
            containerRef.current.style.height = `${initialWindowHeightRef.current}px`;
            containerRef.current.style.top = '0';
          }
        } else {
          if (window.visualViewport) {
            const viewportHeight = window.visualViewport.height;
            const windowHeight = window.innerHeight;
            const keyboardHeight = windowHeight - viewportHeight;
            
            if (keyboardHeight <= keyboardThreshold) {
              keyboardOpenRef.current = false;
              containerRef.current.style.height = `${windowHeight}px`;
              containerRef.current.style.top = '0';
            }
          }
        }
      }, 200);
    };

    // Set initial state
    initialWindowHeightRef.current = window.innerHeight;
    if (isIOS) {
      handleIOSKeyboard();
    } else {
      handleViewportResize();
    }

    // Add event listeners
    if (window.visualViewport && !isIOS) {
      // Android: Use visualViewport API
      window.visualViewport.addEventListener('resize', handleViewportResize);
      window.visualViewport.addEventListener('scroll', handleViewportResize);
    }
    
    // iOS: Use window resize as fallback
    if (isIOS) {
      window.addEventListener('resize', handleWindowResize);
    }
    
    if (inputRef?.current) {
      inputRef.current.addEventListener('focus', handleInputFocus);
      inputRef.current.addEventListener('blur', handleInputBlur);
    }
    
    if (alternativeInputRef?.current) {
      alternativeInputRef.current.addEventListener('focus', handleInputFocus);
      alternativeInputRef.current.addEventListener('blur', handleInputBlur);
    }

    document.addEventListener('focusin', handleInputFocus);

    return () => {
      if (window.visualViewport && !isIOS) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
        window.visualViewport.removeEventListener('scroll', handleViewportResize);
      }
      
      if (isIOS) {
        window.removeEventListener('resize', handleWindowResize);
      }
      
      if (inputRef?.current) {
        inputRef.current.removeEventListener('focus', handleInputFocus);
        inputRef.current.removeEventListener('blur', handleInputBlur);
      }
      
      if (alternativeInputRef?.current) {
        alternativeInputRef.current.removeEventListener('focus', handleInputFocus);
        alternativeInputRef.current.removeEventListener('blur', handleInputBlur);
      }
      
      document.removeEventListener('focusin', handleInputFocus);
      
      if (containerRef.current) {
        containerRef.current.style.top = '';
        containerRef.current.style.height = '';
        containerRef.current.style.bottom = '';
        containerRef.current.style.position = '';
      }
    };
  }, [enabled, containerRef, scrollContainerRef, inputRef, alternativeInputRef, keyboardThreshold]);
};

