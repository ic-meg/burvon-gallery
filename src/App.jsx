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
import TrackOrder2 from "./pages/customer-care/TrackOrder2";
import Return from "./pages/customer-care/ReturnPolicy";
import FAQs from "./pages/customer-care/FAQs";
import JewelryCare from "./pages/customer-care/JewelryCare";

//main
import Wishlist from "./pages/user/Wishlist";
import WishlistEmpty from "./pages/user/Wishlist-Empty";
import Login from "./pages/main/Login/Login";
import ShoppingBag from "./pages/user/cart/ShoppingBag";
import ShoppingBagEmpty from "./pages/user/cart/ShoppingBag-Empty";
import Verification from "./pages/main/Login/Verification";

//product
import Necklace from "./pages/product/Necklaces";
import Earrings from "./pages/product/Earrings";
import Bracelets from "./pages/product/Bracelets";
import Rings from "./pages/product/Rings";
import ProductDesc from "./pages/product/ProductDesc";

//collections
import Classic from "/src/pages/product/collections/classic";
import Clash from "/src/pages/product/collections/clash";
import Rebellion from "/src/pages/product/collections/rebellion";
import LoveLanguage from "/src/pages/product/collections/lovelanguage";
import Pearl from "/src/pages/product/collections/pearl";
import Kids from "/src/pages/product/collections/kids";

//Profile
import Profile from "./pages/user/Profile/Profile";
import InProgress from "./pages/user/Profile/InProgress";
import Delivered from "./pages/user/Profile/Delivered";
import Cancelled from "./pages/user/Profile/Cancelled";
import Refund from "./pages/user/Profile/Refund";
import ViewOrder from "./pages/user/Profile/ViewOrder";
import ViewOrderInProgress from "./pages/user/Profile/ViewOrder-InProgress";

//admin
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminProducts from "./admin/pages/AdminProducts";
import CollectionManagement from "./admin/pages/CollectionManagement";
import LiveChat from "./admin/pages/LiveChat";
import ContentManagement from "./admin/pages/ContentManagement";
import UserManagement from "./admin/pages/UserManagement";

//admin content management
import HomepageContent from "./admin/Contents/Homepage";
import NecklacesContent from "./admin/Contents/Categories/Necklaces";
import BraceletsContent from "./admin/Contents/Categories/Bracelets";
import RingsContent from "./admin/Contents/Categories/Rings";
import EarringsContent from "./admin/Contents/Categories/Earrings";
import CategoriesContent from "./admin/Contents/Categories";
import ClashContent from "./admin/Contents/Collections/Clash";
import ClassicContent from "./admin/Contents/Collections/Classic";
import LoveLanguageContent from "./admin/Contents/Collections/LoveLanguage";
import KidsContent from "./admin/Contents/Collections/Kids";
import CollectionsContent from "./admin/Contents/Collections/CollectionsContent";

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
          <Route
            path="/customer-care/track-order-2"
            element={<TrackOrder2 />}
          />
          <Route path="/customer-care/return" element={<Return />} />

          {/*About Footer */}
          <Route path="/about/contact-us" element={<ContactUs />} />
          <Route path="/about/our-story" element={<OurStory />} />
          <Route path="/about/customer-review" element={<CustomerReviews />} />

          {/*Main Header */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/user/Wishlist-Empty" element={<WishlistEmpty />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shopping-bag" element={<ShoppingBag />} />
          <Route
            path="/user/cart/ShoppingBag-Empty"
            element={<ShoppingBagEmpty />}
          />
          <Route path="/verification" element={<Verification />} />

          {/*Main nav */}
          <Route path="/necklace" element={<Necklace />} />
          <Route path="/earrings" element={<Earrings />} />
          <Route path="/bracelet" element={<Bracelets />} />
          <Route path="/rings" element={<Rings />} />
          <Route path="/product-description" element={<ProductDesc />} />

          {/*Collections */}
          <Route path="/collections/classic" element={<Classic />} />
          <Route path="/collections/clash" element={<Clash />} />
          <Route path="/collections/rebellion" element={<Rebellion />} />
          <Route path="/collections/love-language" element={<LoveLanguage />} />
          <Route path="/collections/pearl" element={<Pearl />} />
          <Route path="/collections/kids" element={<Kids />} />

          {/*Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/inprogress" element={<InProgress />} />
          <Route path="/profile/delivered" element={<Delivered />} />
          <Route path="/profile/cancelled" element={<Cancelled />} />
          <Route path="/profile/refund" element={<Refund />} />
          <Route path="/profile/vieworder" element={<ViewOrder />} />
          <Route path="/profile/vieworder-inprogress" element={<ViewOrderInProgress />} />

          {/*Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/collection" element={<CollectionManagement />} />
          <Route path="/admin/live-chat" element={<LiveChat />} />
          <Route path="/admin/content" element={<ContentManagement />}>
            <Route index element={<HomepageContent />} />
            <Route path="homepage" element={<HomepageContent />} />
            {/* Admin Content Management Homepage */}
            {/* (now nested under /admin/content) */}
            <Route path="categories" element={<CategoriesContent />} />
            <Route path="categories/necklaces" element={<NecklacesContent />} />
            <Route path="categories/bracelets" element={<BraceletsContent />} />
            <Route path="categories/rings" element={<RingsContent />} />
            <Route path="categories/earrings" element={<EarringsContent />} />

            {/* Collections nested under /admin/content/collections */}
            <Route path="collections" element={<CollectionsContent />}>
              <Route index element={<ClassicContent />} />
              <Route path="classic" element={<ClassicContent />} />
              <Route path="clash" element={<ClashContent />} />
              <Route path="love-language" element={<LoveLanguageContent />} />
              <Route path="kids" element={<KidsContent />} />
            </Route>
          </Route>
          <Route path="/admin/user" element={<UserManagement />} />

          {/* Admin Collection Content Management */}
          <Route
            path="/admin/collection/classic"
            element={<ClassicContent />}
          />
          <Route path="/admin/collection/clash" element={<ClashContent />} />
          <Route
            path="/admin/collection/love-language"
            element={<LoveLanguageContent />}
          />
          <Route path="/admin/collection/kids" element={<KidsContent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
