import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../services/authService";

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
import { useContent } from "../contexts/ContentContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { homepageContent } = useContent();
  const { getCartItemCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const handleProfileClick = () => {
    const token = getAuthToken();
    if (token) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };


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

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
      // Ensure cleanup of any preserved scroll position
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
          src={homepageContent?.logo_url || WhiteLogo}
          alt="BURVON Logo"
          className="max-h-[80px] w-auto object-contain"
          onClick={() => navigate("/")}
        />

        <div className="flex items-center space-x-3">
          <img
            src={SearchWhite}
            alt="Search"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setSearchOpen(true)}
          />

          <SearchOverlay
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />

          <div className="relative">
            <img
              src={BagWhite}
              alt="Cart"
              className="w-6 h-6 cursor-pointer"
              onClick={() => navigate("/shopping-bag")}
            />
            {getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 metallic-bg cream-text text-xs rounded-full w-3 h-3 flex items-center justify-center avantbold">
                {getCartItemCount()}
              </span>
            )}
          </div>
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

        <div
          className={`fixed inset-0 z-60 cream-bg flex flex-col justify-between text-center transition-all duration-1300 ease-in-out transform ${
            menuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          } mobile-menu-slide`}
          style={{
            minHeight: "100dvh",
            height: "100dvh",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div className="w-full flex justify-between items-center px-6 pt-6">
            <img
              src={User}
              alt="User"
              className="w-6 h-6 hover:opacity-80 cursor-pointer"
              onClick={handleProfileClick}
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
          <div
            className="flex-1 flex flex-col items-center justify-center space-y-2 cursor-pointer"
            style={{ paddingTop: "2.5rem" }}
          >
            {[
              { label: "Necklaces", path: "/products/necklaces" },
              { label: "Earrings", path: "/products/earrings" },
              { label: "Rings", path: "/products/rings" },
              { label: "Bracelets", path: "/products/bracelets" },
            ].map(({ label, path }, index) => (
              <div key={label} className="flex flex-col items-center w-full">
                <div
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(path)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(path);
                    }
                  }}
                  className="text-2xl bebas metallic-text hover:opacity-70 cursor-pointer"
                >
                  {label}
                </div>
                {index < 3 && <div className="w-20 h-px bg-[#1f1f21] mt-2" />}
              </div>
            ))}
          </div>

          {/* Wishlistt */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "1rem",
                // Ensure it's above home indicator / safe area sa browser
                paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
                background: "transparent",
              }}
            >
              <div className="border-t border-[#c9c9c9] mb-4 opacity-35" />
              <button
                onClick={() => navigate("/wishlist")}
                className="flex items-center justify-between text-[1rem] w-full"
                style={{ padding: "0.6rem 0.5rem" }}
              >
                <span className="metallic-text bebas text-lg">Wishlist</span>
                <div className="relative">
                  <img
                    src={Heart}
                    alt="Wishlist"
                    className="w-5 h-5 hover:opacity-80 cursor-pointer"
                  />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 metallic-bg cream-text text-xs rounded-full w-3 h-3 flex items-center justify-center avantbold">
                      {getWishlistCount()}
                    </span>
                  )}
                </div>
              </button>
            </div>
            {/* spacer to ensure menu content above footer isn't hidden */}
            <div style={{ height: "10rem" }} aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 w-full z-50 px-8 items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "py-0 bg-[#1e1e1e]/60 backdrop-blur-sm shadow-md"
            : "py-7"
        }`}
      >
        {/* Left nav */}
        <nav
          className={`flex-1 flex justify-end items-center space-x-8 avant uppercase cream-text text-[1.26rem] transition-all duration-300 ${
            isScrolled ? "mt-2" : "-mt-8"
          }`}
        >
          <span
            onClick={() => navigate("/products/necklaces")}
            className="hover:opacity-60 cursor-pointer"
          >
            Necklaces
          </span>
          <span
            onClick={() => navigate("/products/earrings")}
            className="hover:opacity-60 cursor-pointer"
          >
            Earrings
          </span>
        </nav>

        {/* Center logo */}
        <div
          className={`relative z-10 cream-bg w-[340px] md:w-[360px] h-[94px] clip-logo shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isScrolled ? "-top-0" : "-top-7"
          }`}
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
            src={homepageContent?.logo_url || LogoImage}
            alt="BURVON Logo"
            className="h-[173px] w-auto object-contain mt-4"
          />
        </div>

        {/* Right nav */}
        <div className="flex-1 flex justify-start items-center space-x-8">
          <nav
            className={`flex space-x-8 avant uppercase cream-text text-[1.26rem] transition-all duration-300 ${
              isScrolled ? "mt-2" : "-mt-8"
            }`}
          >
            <span
              onClick={() => navigate("/products/rings")}
              className="hover:opacity-60 cursor-pointer"
            >
              Rings
            </span>
            <span
              onClick={() => navigate("/products/bracelets")}
              className="hover:opacity-60 cursor-pointer"
            >
              Bracelets
            </span>
          </nav>

          {/* Icons */}
          <div
            className={`absolute right-8 flex space-x-4 items-center transition-all duration-300 ${
              isScrolled ? "mt-2" : "-mt-8"
            }`}
          >
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
              onClick={handleProfileClick}
            />
            <div className="relative">
              <img
                src={IconHeart}
                alt="Heart"
                className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
                onClick={() => navigate("/wishlist")}
              />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-2 -right-2 metallic-bg cream-text text-sm rounded-full w-4 h-4 flex items-center justify-center avantbold">
                  {getWishlistCount()}
                </span>
              )}
            </div>
            <div className="relative">
              <img
                src={IconBag}
                alt="Cart"
                className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
                onClick={() => navigate("/shopping-bag")}
              />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 metallic-bg cream-text text-sm rounded-full w-4 h-4 flex items-center justify-center avantbold">
                  {getCartItemCount()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
