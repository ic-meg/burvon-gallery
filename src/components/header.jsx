
import { useState } from "react";
import {
  IconSearch,
  IconUser,
  IconHeart,
  IconBag,
  LogoImage,
  WhiteLogo,
} from "../assets/index";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-4 md:py-7 md:px-8  flex items-center justify-between">
      {/* Left nav */}
      <nav className="flex-1 flex justify-end items-center space-x-8 -mt-8 avant uppercase cream-text text-[1.26rem] tracking-[0.3em]">
        <a href="#necklaces" className="hover:opacity-60">
          Necklaces
        </a>
        <a href="#earrings" className="hover:opacity-60">
          Earrings
        </a>
      </nav>

      {/* Center logo */}
      <div className="relative z-10 -top-7 bg-[#FFF7DC] w-[340px] md:w-[360px] h-[94px] clip-logo shadow-md flex items-center justify-center">
        <img
          src={LogoImage}
          alt="BURVON Logo"
          className="h-[173px] w-auto object-contain mt-4"
        />
      </div>

      {/* Right nav  */}
      <div className="flex-1 flex justify-start items-center space-x-8">
        <nav className="flex space-x-8 avant uppercase cream-text -mt-8 text-[1.26rem] tracking-[0.3em]">
          <a href="#rings" className="hover:opacity-60">
            Rings
          </a>
          <a href="#bracelets" className="hover:opacity-60">
            Bracelets
          </a>
        </nav>

        {/* Icons */}
        <div className="absolute  right-8 flex space-x-4 -mt-8 items-center">
          <img
            src={IconSearch}
            alt="Search"
            className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
          />
          <img
            src={IconUser}
            alt="User"
            className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
          />
          <img
            src={IconHeart}
            alt="Heart"
            className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
          />
          <img
            src={IconBag}
            alt="Cart"
            className="w-6 h-6 hover:opacity-80 cursor-pointer cream-text"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
