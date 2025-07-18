import { useEffect } from "react";
import { SearchBlack } from "../assets";
import GlareHover from "./GlareHover";

const SearchOverlay = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-1500 ease-in-out transform ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/*  1/4 screen height */}
      <div className="cream-bg min-h-[50vh] md:min-h-[35vh] lg:min-h-[25vh] w-full px-6 pt-12 text-black relative flex flex-col items-center">
        {/* Close button */}
        <div
          role="button"
          tabIndex={0}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Enter" && setMenuOpen(false)}
          className="absolute top-4 right-6 text-4xl font-light text-black hover:opacity-70 cursor-pointer"
          aria-label="Close menu"
        >
          &times;
        </div>

        {/* Search bar */}
        <div className="w-full max-w-xl flex items-center border-b border-black avant">
          <input
            type="text"
            placeholder="Search BURVON"
            className="flex-1 text-s md:text-lg lg:text-lg p-3 bg-transparent outline-none"
          />
          <img src={SearchBlack} alt="Search" className="w-6 h-6" />
        </div>

        {/* Popular Searches */}
        <div className="mt-6 w-full text-left px-6">
          <h3 className="font-bold mb-3 bebas text-1xl md:text-2xl lg:text-2xl">Popular searches</h3>
          <div className="flex flex-wrap gap-2 justify-start cream-text avant">
            {["Love Language", "Rebellion", "Agatha", "Celine", "Clash"].map(
              (term, index) => (
                <div key={index} className="inline-block">
                  <GlareHover
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={200}
                    s
                    transitionDuration={800}
                    playOnce={false}
                  >
                    <button className="bg-transparent border border-transparent px-4 py-2 text-sm text-white rounded-md hover:border-white hover:text-white hover:shadow-[0_0_0_2px_rgba(255,255,255,0.4)] hover:backdrop-brightness-110 transition-all duration-300 ease-in-out">
                      {term}
                    </button>
                  </GlareHover>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
