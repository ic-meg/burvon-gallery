import { useEffect, useRef, useState } from "react";
import whiteIcon from "../assets/icons/customer-service-white.png";
import blackIcon from "../assets/icons/customer-service.png";

const FloatingChatButton = () => {
  const [overFooter, setOverFooter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setOverFooter(entry.isIntersecting),
      {
        root: null,
        threshold: 0.1,
      }
    );

    const footerEl = document.getElementById("footer");
    if (footerEl) observer.observe(footerEl);

    return () => {
      if (footerEl) observer.unobserve(footerEl);
    };
  }, []);


  useEffect(() => {
    const checkMenu = () => {
      setMenuOpen(document.body.classList.contains("menu-open"));
    };

    checkMenu(); 

    const observer = new MutationObserver(checkMenu);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

 
  if (menuOpen) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`fixed bottom-6 right-6 z-[1000] w-16 h-16 rounded-full cursor-pointer border-2 border-[#FFF7DC] shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out ${
        overFooter ? "bg-black" : "cream-bg"
      }`}
      aria-label="Customer Support"
    >
      <img
        src={overFooter ? whiteIcon : blackIcon}
        alt="Chat Icon"
        className="w-8 h-8 object-contain"
      />
    </div>
  );
};

export default FloatingChatButton;
