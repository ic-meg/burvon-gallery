import {
  LogoImage,
  FacebookIcon,
  TikTokIcon,
  InstagramIcon,
  EmailIcon,
} from "../assets/index";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const [customerCareOpen, setCustomerCareOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <footer
      id="footer"
      className="w- cream-bg metallic-text px-0 py-12 border-t border-black pt-4 md:pt-25 pb-5 md"
    >
      <div className="px-6 md:px-16">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Newsletter Section - Top */}
          <div className="text-left mb-8">
            <img
              src={LogoImage}
              alt="BURVON Logo"
              className="h-28 -mb-3 -ml-2"
            />
            <h2 className="font-medium mb-1 avant text-lg text-black">
              Stay updated
            </h2>
            <p className="text-gray-500 text-sm mb-6 avant">
              Be first to hear about new designs.
            </p>
            <div className="flex gap-2 max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-3 border border-black rounded-none bg-transparent text-sm avant placeholder-gray-400"
              />
              <button className="bg-black text-white px-6 py-3 rounded-none text-sm avant font-medium">
                JOIN
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 mt-8 mb-5"></div>

          {/* About Us - Collapsible */}
          <div className="border-b border-gray-300 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setAboutUsOpen(!aboutUsOpen)}
            >
              <h2 className="tracking-widest bebas metallic-text text-base font-normal">
                ABOUT US
              </h2>
              <span className="text-black text-xl font-light transition-transform duration-200">
                {aboutUsOpen ? "−" : "+"}
              </span>
            </div>
            {aboutUsOpen && (
              <ul className="space-y-1 text-sm mt-4">
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => console.log("Navigate to Our Story")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      console.log("Navigate to Our Story")
                    }
                  >
                    Our Story
                  </div>
                </li>
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => navigate("/about/contact-us")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      navigate("/about/contact-us")
                    }
                  >
                    Contact Us
                  </div>
                </li>
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => console.log("Navigate to Customer Reviews")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      console.log("Navigate to Customer Reviews")
                    }
                  >
                    Customer Reviews
                  </div>
                </li>
              </ul>
            )}
          </div>

          {/* Customer Care - Collapsibleeee */}
          <div className="border-b border-gray-300 py-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setCustomerCareOpen(!customerCareOpen)}
            >
              <h2 className="tracking-widest bebas metallic-text text-base font-normal">
                CUSTOMER CARE
              </h2>
              <span className="text-black text-xl font-light transition-transform duration-200">
                {customerCareOpen ? "−" : "+"}
              </span>
            </div>
            {customerCareOpen && (
              <ul className="space-y-1 text-sm mt-4">
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => navigate("/customer-care/faqs")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      navigate("/customer-care/faqs")
                    }
                  >
                    FAQs
                  </div>
                </li>
                <li>
                  <Link
                    to="/customer-care/jewelry-care"
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                  >
                    Jewelry Care
                  </Link>
                </li>
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => console.log("Navigate to Size Guide")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      console.log("Navigate to Size Guide")
                    }
                  >
                    Size Guide
                  </div>
                </li>
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => console.log("Navigate to Shipping")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      console.log("Navigate to Shipping")
                    }
                  >
                    Shipping
                  </div>
                </li>
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => console.log("Navigate to Track your Order")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      console.log("Navigate to Track your Order")
                    }
                  >
                    Track your Order
                  </div>
                </li>
                <li>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => console.log("Navigate to Return Policy")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      console.log("Navigate to Return Policy")
                    }
                  >
                    Return Policy
                  </div>
                </li>
              </ul>
            )}
          </div>

          {/* Social Media Iconsss */}
          <div className="flex justify-start space-x-4 py-8">
            <img src={FacebookIcon} alt="Facebook" className="h-5 w-5" />
            <img src={TikTokIcon} alt="TikTok" className="h-5 w-5" />
            <img src={InstagramIcon} alt="Instagram" className="h-5 w-5" />
          </div>

          {/* Dividerrr */}
          <div className="border-t border-gray-300 mt-2 mb-4"></div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {/* Logo + Social Icons */}
          <div className="space-y-4">
            <img
              src={LogoImage}
              alt="BURVON Logo"
              className="h-20 md:h-44 -mt-15"
            />

            <div className="flex space-x-6 -mt-15 ml-6">
              <img src={FacebookIcon} alt="Facebook" className="h-6 w-6" />
              <img src={TikTokIcon} alt="TikTok" className="h-6 w-6" />
              <img src={InstagramIcon} alt="Instagram" className="h-6 w-6" />
            </div>
          </div>

          {/* About Us */}
          <div>
            <h2 className="tracking-widest mb-2 bebas metallic-text text-2xl">
              About Us
            </h2>
            <ul className="space-y-1 text-lg metallic-text">
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => console.log("Navigate to Our Story")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    console.log("Navigate to Our Story")
                  }
                >
                  Our Story
                </div>
              </li>
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => navigate("/about/contact-us")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    navigate("/about/contact-us")
                  }
                >
                  Contact Us
                </div>
              </li>
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => console.log("Navigate to Customer Reviews")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    console.log("Navigate to Customer Reviews")
                  }
                >
                  Customer Reviews
                </div>
              </li>
            </ul>
          </div>

          {/* Customer CAREEEE */}
          <div>
            <h2 className="tracking-widest mb-2 bebas text-2xl">
              CUSTOMER CARE
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => navigate("/customer-care/faqs")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    navigate("/customer-care/faqs")
                  }
                >
                  FAQs
                </div>
              </li>
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => navigate("/customer-care/jewelry-care")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    navigate("/customer-care/jewelry-care")
                  }
                >
                  Jewelry Care
                </div>
              </li>
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => console.log("Navigate to Size Guide")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    console.log("Navigate to Size Guide")
                  }
                >
                  Size Guide
                </div>
              </li>
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => console.log("Navigate to Shipping")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    console.log("Navigate to Shipping")
                  }
                >
                  Shipping
                </div>
              </li>
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => console.log("Navigate to Track your Order")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    console.log("Navigate to Track your Order")
                  }
                >
                  Track your Order
                </div>
              </li>
              <li>
                <div
                  role="link"
                  tabIndex={0}
                  className="metallic-text avant text-black hover:text-black cursor-pointer"
                  onClick={() => console.log("Navigate to Return Policy")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    console.log("Navigate to Return Policy")
                  }
                >
                  Return Policy
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="font-medium flex items-center gap-2 mb-2 text-lg avant">
              <img src={EmailIcon} alt="Email" className="h-5 w-5" />
              STAY UP TO DATE WITH BURVON
            </h2>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-black rounded-md bg-transparent mb-3 text-sm avant"
            />
            <button className="metallic-bg text-white px-6 py-2 rounded-md text-sm hover:opacity-80 avant">
              SUBMIT
            </button>
          </div>
        </div>

        {/* Bottom Barr */}
        <div className="avant text-center mt-2 md:mt-26 md:border-t md:border-black pt-1 md:pt-4 flex flex-row justify-center items-center gap-3 md:gap-12 text-sm md:text-lg text-gray-600 md:text-black">
          <p>Terms of use</p>
          <p>© 2025 Burvon</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
