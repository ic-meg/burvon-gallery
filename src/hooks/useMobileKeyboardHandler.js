import { useEffect, useRef } from 'react';

// Custom mobile keyboard handler for iOS and Android
// Uses native browser APIs: visualViewport for Android, window resize detection for iOS

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
  inputContainerRef = null,
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
        // Adjust container height to fit above keyboard
        containerRef.current.style.height = `${currentHeight}px`;
        containerRef.current.style.top = '0';
        containerRef.current.style.position = 'fixed';
        containerRef.current.style.left = '0';
        containerRef.current.style.right = '0';
        containerRef.current.style.width = '100%';
        
        // Scroll input into view - iOS needs aggressive approach
        const activeInput = inputRef?.current || alternativeInputRef?.current;
        const inputContainer = inputContainerRef?.current || (activeInput?.closest('.p-4') || activeInput?.parentElement);
        
        if (activeInput) {
          
          // Multiple attempts with different strategies for iOS
          const scrollInputIntoView = () => {
            // Strategy 1: Scroll the input element itself
            activeInput.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end',
              inline: 'nearest'
            });
            
            // Strategy 2: Scroll scroll container to bottom
            if (scrollContainerRef?.current) {
              scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }
            
            // Strategy 3: Scroll window to show input container
            if (inputContainer) {
              const inputRect = inputContainer.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const inputBottom = inputRect.bottom;
              
              // If input is below viewport, scroll window
              if (inputBottom > viewportHeight - 20) {
                const scrollAmount = inputBottom - viewportHeight + 20;
                window.scrollTo({
                  top: window.scrollY + scrollAmount,
                  behavior: 'smooth'
                });
              }
            }
            
            // Strategy 4: Force scroll container to show input
            if (scrollContainerRef?.current && inputContainer) {
              const containerRect = scrollContainerRef.current.getBoundingClientRect();
              const inputRect = inputContainer.getBoundingClientRect();
              
              // If input is below visible area of scroll container
              if (inputRect.bottom > containerRect.bottom - 20) {
                const scrollAmount = inputRect.bottom - containerRect.bottom + 20;
                scrollContainerRef.current.scrollTop += scrollAmount;
              }
            }
          };
          
          // Immediate attempt
          setTimeout(scrollInputIntoView, 100);
          
          // Second attempt after keyboard animation
          setTimeout(scrollInputIntoView, 400);
          
          // Third attempt for slower devices
          setTimeout(scrollInputIntoView, 700);
          
          // Fourth attempt - most aggressive
          setTimeout(() => {
            activeInput.scrollIntoView({ 
              behavior: 'auto', 
              block: 'center'
            });
            
            if (scrollContainerRef?.current) {
              scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            }
          }, 1000);
        }
      } else if (!isKeyboardVisible && keyboardOpenRef.current) {
        keyboardOpenRef.current = false;
        containerRef.current.style.height = `${initialWindowHeightRef.current}px`;
        containerRef.current.style.top = '0';
        containerRef.current.style.left = '';
        containerRef.current.style.right = '';
        containerRef.current.style.width = '';
      }
    };

    const handleWindowResize = () => {
      // iOS fallback: detect keyboard via window height changes
      if (isIOS) {
        // Debounce to avoid too many calls
        clearTimeout(window._iosKeyboardTimeout);
        window._iosKeyboardTimeout = setTimeout(() => {
          handleIOSKeyboard();
        }, 50);
      }
    };

    const handleInputFocus = (e) => {
      const targetInput = inputRef?.current || alternativeInputRef?.current;
      if (e.target === targetInput) {
        // Store initial height
        initialWindowHeightRef.current = window.innerHeight;
        
        if (isIOS) {
          // iOS: More aggressive approach - check multiple times
          const checkAndAdjust = () => {
            handleIOSKeyboard();
          };
          
          // Immediate check
          setTimeout(checkAndAdjust, 50);
          
          // Check after keyboard starts appearing
          setTimeout(checkAndAdjust, 200);
          
          // Check after keyboard should be fully visible
          setTimeout(checkAndAdjust, 500);
          
          // Final check
          setTimeout(checkAndAdjust, 800);
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
        if (window._iosKeyboardTimeout) {
          clearTimeout(window._iosKeyboardTimeout);
        }
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
        containerRef.current.style.left = '';
        containerRef.current.style.right = '';
        containerRef.current.style.width = '';
      }
    };
  }, [enabled, containerRef, scrollContainerRef, inputRef, alternativeInputRef, inputContainerRef, keyboardThreshold]);
};

