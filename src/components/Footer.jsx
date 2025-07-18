import {
  LogoImage,
  FacebookIcon,
  TikTokIcon,
  InstagramIcon,
  EmailIcon,
} from "../assets/index";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="w-screen cream-bg metallic-text px-0 py-12 border-t border-black pt-25 pb-5"
    >
      <div className="px-6 md:px-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                  onClick={() => console.log("Navigate to Contact Us")}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    console.log("Navigate to Contact Us")
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

          {/* Customer Care */}
          <div>
            <h2 className="tracking-widest mb-2 bebas text-2xl">
              CUSTOMER CARE
            </h2>
            <ul className="space-y-1 text-lg">
              {[
                "FAQs",
                "Jewelry Care",
                "Size Guide",
                "Shipping",
                "Track your Order",
                "Return Policy",
              ].map((item) => (
                <li key={item}>
                  <div
                    role="link"
                    tabIndex={0}
                    className="metallic-text avant text-black hover:text-black cursor-pointer"
                    onClick={() => console.log(`Navigate to ${item}`)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      console.log(`Navigate to ${item}`)
                    }
                  >
                    {item}
                  </div>
                </li>
              ))}
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

        {/* Bottom Bar */}
        <div className="avant text-center text-lg mt-26 border-t border-black pt-4 flex flex-col md:flex-row justify-center items-center gap-12">
          <p>Terms of Use</p>
          <p>© 2025 Burvon</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
