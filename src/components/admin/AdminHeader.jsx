import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//icons and logo
import {
  WhiteLogo,
  
  User,
} from "../../assets/index";



const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      document.body.dataset.scrollY = scrollY.toString();

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

      document.documentElement.style.scrollBehavior = "auto";
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0");

      // Remove fixed positioning
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      // Clear stored position
      delete document.body.dataset.scrollY;

      // Restore scroll behavio
      document.documentElement.style.scrollBehavior = "";

      if (scrollY > 0) {
        window.scrollTo(0, scrollY);
      }
    }

    return () => {
      // linis
      const scrollY = parseInt(document.body.dataset.scrollY || "0");
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.documentElement.style.scrollBehavior = "";
      delete document.body.dataset.scrollY;
      if (scrollY > 0) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [menuOpen]);


  return (
    <>
      {/* Mobile Header */}
      <header
        className={`lg:hidden fixed top-0 left-0 w-full z-50 h-[10px] px-4 py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled && !menuOpen
            ? "bg-black backdrop-blur-sm shadow-md"
            : "bg-black"
        }`}
      >
        {/* Logo */}
        <img
          src={WhiteLogo}
          alt="BURVON Logo"
          className="max-h-[80px] w-auto object-contain"
          onClick={() => navigate("/admin/dashboard")}
        />

      </header>

      {/* Desktop Header */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 w-full z-50 px-8 items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "py-0 bg-black backdrop-blur-sm shadow-md"
            : "py-0 bg-black"
        }`}
      >
        {/* Left nav - Admin Content Management */}
        <nav
          className={`flex-1 flex justify-end items-center space-x-4 avant uppercase  text-[1rem] transition-all duration-300 mr-4`}
        >
          <span
            onClick={() => navigate("/admin/dashboard")}
            className="hover:opacity-60 cursor-pointer"
          >
            Dashboard
          </span>
          <span
            onClick={() => navigate("/admin/orders")}
            className="hover:opacity-60 cursor-pointer"
          >
            Orders
          </span>
          <span
            onClick={() => navigate("/admin/products")}
            className="hover:opacity-60 cursor-pointer"
          >
            Products
          </span>
        </nav>

        {/* Center logo */}
        <div
          className={`relative z-10 h-[60px] shadow-md flex items-center justify-center cursor-pointer transition-all duration-300`}
          role="button"
          tabIndex={0}
          aria-label="Go to homepage"
          onClick={() => navigate("/admin/dashboard")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/admin/dashboard");
            }
          }}
        >
          <img
            src={WhiteLogo}
            alt="BURVON Logo"
            className="h-[120px] w-auto object-contain"
          />
        </div>

        {/* Right nav */}
        <div className="flex-1 flex justify-start items-center space-x-4 ml-4">
          <nav
            className={`flex space-x-4 avant uppercase  text-[1rem] transition-all duration-300`}
          >
            <span
              onClick={() => navigate("/admin/collection")}
              className="hover:opacity-60 cursor-pointer"
            >
              Collections
            </span>
            <span
              onClick={() => navigate("/admin/live-chat")}
              className="hover:opacity-60 cursor-pointer"
            >
              Live Chat
            </span>
            <span
              onClick={() => navigate("/admin/content")}
              className="hover:opacity-60 cursor-pointer"
            >
              Content
            </span>
          </nav>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
