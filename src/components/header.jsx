import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//icons and logo
import {
  IconSearch,
  IconUser,
  IconHeart,
  IconBag,
  LogoImage,
  WhiteLogo,
  BagWhite,
  SearchWhite,
  Hamburger,
  Heart,
  User,
} from "../assets/index";

import SearchOverlay from "./SearchOverlay";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
      // Get current scroll position
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Store scroll position
      document.body.dataset.scrollY = scrollY.toString();
      
      // Apply fixed positioning to prevent scrolling
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      
      // Disable smooth scrolling
      document.documentElement.style.scrollBehavior = "auto";
      
    } else {
      // Get stored scroll position
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
      
      // Remove fixed positioning
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      
      // Clear stored position
      delete document.body.dataset.scrollY;
      
      // Restore scroll behavior
      document.documentElement.style.scrollBehavior = "";
      
      // Restore scroll position
      if (scrollY > 0) {
        window.scrollTo(0, scrollY);
      }
    }
    
    return () => {
      // linis
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
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

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
      // Ensure cleanuoop of any preserved scroll position
      if (document.body.dataset.scrollY) {
        const scrollY = parseInt(document.body.dataset.scrollY);
        document.body.style.top = "";
        delete document.body.dataset.scrollY;
        if (scrollY > 0) {
          window.scrollTo(0, scrollY);
        }
      }
    };
  }, [menuOpen]);

  return (
    <>
      {/* Mobile Header */}
      <header
        className={`lg:hidden fixed top-0 left-0 w-full z-50 h-[80px] px-4 py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled && !menuOpen
            ? "bg-[#1e1e1e]/60 backdrop-blur-sm shadow-md"
            : ""
        }`}
      >
        {/* Logo */}
        <img
          src={WhiteLogo}
          alt="BURVON Logo"
          className="max-h-[80px] w-auto object-contain"
          onClick={() => navigate("/")}
        />

        {/*  White icons + Hamburger */}
        <div className="flex items-center space-x-3">
          <img
            src={SearchWhite}
            alt="Search"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setSearchOpen(true)}
          />

          {/* Show overlay */}
          <SearchOverlay
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />

          <img
            src={BagWhite}
            alt="Cart"
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate("/shopping-bag")}
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => setMenuOpen(!menuOpen)}
            onKeyDown={(e) => e.key === "Enter" && setMenuOpen(!menuOpen)}
            className="w-6 h-6 cursor-pointer"
          >
            <img src={Hamburger} alt="Menu" className="w-full h-full" />
          </div>
        </div>

        {/* Slide Menu */}
        <div
          className={`fixed inset-0 z-40 cream-bg flex flex-col justify-between text-center transition-all duration-1300 ease-in-out transform ${
            menuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          } mobile-menu-slide`}
          style={{
            minHeight: '100vh',
            height: '100vh'
          }}
        >
          {/* Profile icons */}
          <div className="w-full flex justify-between items-center px-6 pt-6">
            <img
              src={User}
              alt="User"
              className="w-6 h-6 hover:opacity-80 cursor-pointer"
              onClick={() => navigate("/login")}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => e.key === "Enter" && setMenuOpen(false)}
              className="text-4xl font-light text-black hover:opacity-70 cursor-pointer"
              aria-label="Close menu"
            >
              &times;
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
            {[
              { label: "Necklaces", path: "/necklace" },
              { label: "Earrings", path: "/earrings" },
              { label: "Rings", path: "/rings" },
              { label: "Bracelets", path: "/bracelet" },
            ].map(({ label, path }) => (
              <div
                key={label}
                role="link"
                tabIndex={0}
                onClick={() => navigate(path)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(path);
                  }
                }}
                className="text-2xl bebas metallic-text tracking-[0.3em] hover:opacity-70 cursor-pointer"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Wishlist */}
          <div className="w-full px-6 pb-6">
            <div className="border-t border-[#c9c9c9] mb-4 opacity-35" />
            <button
              onClick={() => navigate("/wishlist")}
              className="flex items-center justify-between text-[1rem] w-full"
            >
              <span className="metallic-text bebas text-lg">Wishlist</span>
              <img
                src={Heart}
                alt="Wishlist"
                className="w-5 h-5 hover:opacity-80 ml-auto"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 w-full  z-50 py-7 px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-[#1e1e1e]/60 backdrop-blur-sm shadow-md" : ""
        }`}
      >
        {/* Left nav */}
        <nav className="flex-1 flex justify-end items-center space-x-8 -mt-8 avant uppercase cream-text text-[1.26rem]">
          <span onClick={() => navigate("/necklace")} className="hover:opacity-60 cursor-pointer">
            Necklaces 
          </span>
          <span onClick={() => navigate("/earrings")} className="hover:opacity-60 cursor-pointer">
            Earrings
          </span>
        </nav>

        {/* Center logo */}
        <div
          className="relative z-10 -top-7 cream-bg w-[340px] md:w-[360px] h-[94px] clip-logo shadow-md flex items-center justify-center cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Go to homepage"
          onClick={() => navigate("/")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/homepage");
            }
          }}
        >
          <img
            src={LogoImage}
            alt="BURVON Logo"
            className="h-[173px] w-auto object-contain mt-4"
          />
        </div>

        {/* Right nav */}
        <div className="flex-1 flex justify-start items-center space-x-8">
          <nav className="flex space-x-8 avant uppercase cream-text -mt-8 text-[1.26rem]">
            <span onClick={() => navigate("/rings")} className="hover:opacity-60 cursor-pointer">
              Rings
            </span>
            <span onClick={() => navigate("/bracelet")} className="hover:opacity-60 cursor-pointer">
              Bracelets
            </span>
          </nav>

          {/* Icons */}
          <div className="absolute right-8 flex space-x-4 -mt-8 items-center">
            <img
              src={IconSearch}
              alt="Search"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSearchOpen(true)}
            />

            {/* Show overlay */}
            <SearchOverlay
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
            />
            <img
              src={IconUser}
              alt="User"
              className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
              onClick={() => navigate("/login")}
            />
            <img
              src={IconHeart}
              alt="Heart"
              className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
              onClick={() => navigate("/wishlist")}
            />
            <img
              src={IconBag}
              alt="Cart"
              className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
              onClick={() => navigate("/shopping-bag")}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
