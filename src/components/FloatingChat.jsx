import { useEffect, useRef, useState } from "react";
import whiteIcon from "../assets/icons/customer-service-white.png";
import blackIcon from "../assets/icons/customer-service.png";
import XIcon from "../assets/icons/X.png";
import XWhite from "../assets/icons/x-white.png";
import SentIcon from "../assets/icons/send.png";

const FloatingChatButton = () => {
  const [overFooter, setOverFooter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        
        setOverFooter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    const footerEl = document.getElementById("footer");
    if (footerEl) {
      observer.observe(footerEl);
    } else {
    }

    return () => {
      if (footerEl) observer.unobserve(footerEl);
    };
  }, []);

  useEffect(() => {
    const checkMenu = () => {
      setMenuOpen(document.body.classList.contains("menu-open"));
    };

    const checkSearchOverlay = () => {
      setSearchOverlayOpen(document.body.classList.contains("search-overlay-open"));
    };

    checkMenu(); 
    checkSearchOverlay();

    const observer = new MutationObserver(() => {
      checkMenu();
      checkSearchOverlay();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // console.log("Over footer state:", overFooter);
  }, [overFooter]);

  // Hide floating chat when menu or search overlay is open
  if (menuOpen || searchOverlayOpen) return null;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={`fixed bottom-6 right-6 z-[1000] w-16 h-16 md:w-20 md:h-20 rounded-full cursor-pointer border-2 border-[#FFF7DC] shadow-md flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out ${
          overFooter ? "bg-black" : "cream-bg"
        }`}
        style={{
          filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))"
        }}
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Customer Support"
      >
        <img
          src={chatOpen ? (overFooter ? XWhite : XIcon) : (overFooter ? whiteIcon : blackIcon)}
          alt={chatOpen ? "Close Chat" : "Chat Icon"}
          className={`w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-500 ease-out ${chatOpen ? 'scale-110' : 'scale-100'}`}
        />
      </div>

      {/* Fixed Chat Panel */}
      <div 
        className={`fixed bottom-28 right-6 h-[500px] w-96 cream-bg shadow-2xl z-[2000] flex flex-col rounded-lg transition-all duration-800 ease-out overflow-hidden md:bottom-28 md:right-6 md:h-[500px] md:w-96 md:rounded-lg md:shadow-2xl ${
          chatOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        } ${
          chatOpen ? 'md:top-auto md:left-auto md:right-6 md:bottom-28 md:h-[500px] md:w-96 md:rounded-lg md:shadow-2xl top-0 left-0 right-0 bottom-0 h-screen w-screen rounded-none shadow-none transition-all duration-800 ease-out' : 'transition-none md:transition-all md:duration-500 md:ease-out'
        }`}
        style={{
          filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
          borderRadius: "8px"
        }}
      >
          {/* Header */}
          <div className="metallic-bg text-white p-4 flex items-center justify-between rounded-t-lg md:rounded-t-lg">
            <div className="flex items-center gap-3">
              <img src={whiteIcon} alt="Chat" className="w-6 h-6" />
              <div>
                <h3 className="font-medium bebas text-xl">Chat with burvon</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-300">Online</span>
                </div>
              </div>
            </div>
            
            {/* Mobile X Button */}
            <button 
              onClick={() => setChatOpen(false)}
              className="md:hidden text-white hover:text-gray-300 transition-colors"
            >
              <img src={XWhite} alt="Close" className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-hidden">
            {/* Welcome Message */}
            <div className="flex justify-start">
              <div className="bg-[#4A4C46] rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-md avant">Hi! Welcome to Burvon Support. How can we assist you today?</p>
              </div>
            </div>

            {/* Second Message */}
            <div className="flex justify-start">
              <div className="bg-[#4A4C46] rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-md avant">Please share your name to get started.</p>
              </div>
            </div>

            {/* User Action Button */}
            <div className="flex justify-end">
              <button className="bg-[#4A4C46] text-white px-4 py-2 rounded-lg text-sm avant hover:bg-gray-700 transition-colors">
                Chat with Live Agent
              </button>
            </div>
          </div>

          {/* Input Field */}
          <div className="p-4 overflow-hidden">
            {/* Recommended Action Buttons */}
            <div className="flex gap-2 mb-3 -mx-4 px-4 py-1 overflow-x-auto scrollbar-hide md:overflow-x-visible md:scrollbar-default" style={{ WebkitOverflowScrolling: 'touch' }}>
              <button className="bg-[#4A4C46] text-white px-4 py-2 rounded-full text-xs avant whitespace-nowrap hover:bg-gray-700 transition-colors flex-shrink-0">
                Chat with Live Agent
              </button>
              <button className="bg-[#4A4C46] text-white px-4 py-2 rounded-full text-xs avant whitespace-nowrap hover:bg-gray-700 transition-colors flex-shrink-0">
                Check Order Status
              </button>
             
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Write a message"
                className="w-full px-4 py-3 pr-12 border metallic-text rounded-lg text-md avant focus:outline-none focus:border-gray-500"
              />
              <div 
                role="button"
                tabIndex={0}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))"
                }}
              >
                <img src={SentIcon} alt="Send" className="w-6 h-6" />
              </div>
            </div>
          </div>


        </div>
    </>
  );
};

export default FloatingChatButton;
