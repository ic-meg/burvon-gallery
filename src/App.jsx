import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/main/Homepage";

import Template from "./pages/Template";
import ScrollToTop from "./components/ScrollToTop";

//about
import ContactUs from "./pages/about/ContactUs";
import OurStory from "./pages/about/OurStory";
import CustomerReviews from "./pages/about/CustomerReviews";

//customercare
import SizeGuide from "./pages/customer-care/SizeGuide";
import Shipping from "./pages/customer-care/Shipping";
import TrackOrder from "./pages/customer-care/TrackOrder";
import Return from "./pages/customer-care/ReturnPolicy";
import FAQs from "./pages/customer-care/FAQs";
import JewelryCare from "./pages/customer-care/JewelryCare";

//main
import Wishlist from "./pages/user/Wishlist";
import Login from "./pages/main/Login/Login";
import ShoppingBag from "./pages/user/cart/ShoppingBag";
import Verification from "./pages/main/Login/Verification";

//product
import Necklace from "./pages/product/Necklaces";
import Earrings from "./pages/product/Earrings";
import Bracelets from "./pages/product/Bracelets";
import Rings from "./pages/product/Rings";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/template" element={<Template />} />
         
          {/*Customer Care Footer */}
          <Route path="/customer-care/faqs" element={<FAQs />} />
          <Route path="/customer-care/jewelry-care" element={<JewelryCare />} />
          <Route path="/customer-care/size-guide" element={<SizeGuide />} />
          <Route path="/customer-care/shipping" element={<Shipping />} />
          <Route path="/customer-care/track-order" element={<TrackOrder />} />
          <Route path="/customer-care/return" element={<Return />} />

          {/*About Footer */}
          <Route path="/about/contact-us" element={<ContactUs />} />
          <Route path="/about/our-story" element={<OurStory />} />
          <Route path="/about/customer-review" element={<CustomerReviews />} />

          {/*Main Header */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shopping-bag" element={<ShoppingBag />} />
          <Route path="/verification" element={<Verification />} />

          {/*Main nav */}
          <Route path="/necklace" element={<Necklace />} />
          <Route path="/earrings" element={<Earrings />} />
          <Route path="/bracelet" element={<Bracelets />} />
          <Route path="/rings" element={<Rings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
