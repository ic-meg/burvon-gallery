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

    // Initialize height - store the full window height when chat opens
    initialWindowHeightRef.current = window.innerHeight;
    
    // Ensure container starts at full height when chat opens (keyboard not open yet)
    if (containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
      containerRef.current.style.top = '0';
      containerRef.current.style.position = 'fixed';
      containerRef.current.style.left = '0';
      containerRef.current.style.right = '0';
      containerRef.current.style.width = '100%';
    }

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

    const handleIOSKeyboard = () => {
      if (!isIOS || !containerRef.current) return;

      //  use visualViewport first
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const viewportTop = window.visualViewport.offsetTop;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - viewportHeight;

        if (keyboardHeight > keyboardThreshold) {
          keyboardOpenRef.current = true;
          // Keyboard is open - position container to fill visible viewport
          containerRef.current.style.height = `${viewportHeight}px`;
          containerRef.current.style.top = `${viewportTop}px`;
          containerRef.current.style.bottom = 'auto';
          containerRef.current.style.position = 'fixed';
          containerRef.current.style.left = '0';
          containerRef.current.style.right = '0';
          containerRef.current.style.width = '100%';

          // Scroll to bottom to show input
          if (scrollContainerRef?.current) {
            setTimeout(() => {
              scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }, 150);
          }
        } else {
          keyboardOpenRef.current = false;
          // Keyboard is closed - use full screen
          containerRef.current.style.height = `${initialWindowHeightRef.current}px`;
          containerRef.current.style.top = '0';
          containerRef.current.style.bottom = 'auto';
        }
      } else {
        const currentHeight = window.innerHeight;
        const heightDiff = initialWindowHeightRef.current - currentHeight;
        const isKeyboardVisible = heightDiff > keyboardThreshold;

        if (isKeyboardVisible && !keyboardOpenRef.current) {
          keyboardOpenRef.current = true;
          containerRef.current.style.height = `${currentHeight}px`;
          containerRef.current.style.top = '0';
          containerRef.current.style.position = 'fixed';
          containerRef.current.style.left = '0';
          containerRef.current.style.right = '0';
          containerRef.current.style.width = '100%';

          if (scrollContainerRef?.current) {
            setTimeout(() => {
              scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }, 150);
          }
        } else if (!isKeyboardVisible && keyboardOpenRef.current) {
          keyboardOpenRef.current = false;
          containerRef.current.style.height = `${initialWindowHeightRef.current}px`;
          containerRef.current.style.top = '0';
        }
      }
    };

    const handleWindowResize = () => {
      // iOS fallback: detect keyboard via window height changes
      if (isIOS) {
        clearTimeout(window._iosKeyboardTimeout);
        window._iosKeyboardTimeout = setTimeout(() => {
          handleIOSKeyboard();
        }, 50);
      }
    };

    const handleInputFocus = (e) => {
      const targetInput = inputRef?.current || alternativeInputRef?.current;
      if (e.target === targetInput) {
        initialWindowHeightRef.current = window.innerHeight;

        if (isIOS) {
          const checkAndAdjust = () => {
            handleIOSKeyboard();
          };

          setTimeout(checkAndAdjust, 50);

          setTimeout(checkAndAdjust, 200);

          setTimeout(checkAndAdjust, 500);

          setTimeout(checkAndAdjust, 800);
        } else {
          // Android: Use visualViewport
          setTimeout(() => {
            handleViewportResize();

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

    initialWindowHeightRef.current = window.innerHeight;
    
    

    if (window.visualViewport && !isIOS) {
      // Android: Use visualViewport API
      window.visualViewport.addEventListener('resize', handleViewportResize);
      window.visualViewport.addEventListener('scroll', handleViewportResize);
    }

    // iOS: Use visualViewport 
    if (isIOS) {
      if (window.visualViewport) {
        // Modern iOS with visualViewport support
        window.visualViewport.addEventListener('resize', handleIOSKeyboard);
        window.visualViewport.addEventListener('scroll', handleIOSKeyboard);
      }
      // Also listen to window resize as backup
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
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleIOSKeyboard);
          window.visualViewport.removeEventListener('scroll', handleIOSKeyboard);
        }
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

