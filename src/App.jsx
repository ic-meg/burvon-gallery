import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/main/Homepage";

import Template from "./pages/Template";
import ScrollToTop from "./components/ScrollToTop";
import { ContentProvider } from "./contexts/ContentContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { CollectionProvider } from "./contexts/CollectionContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

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
import Checkout from "./pages/user/cart/Checkout";
import ShoppingBagEmpty from "./pages/user/cart/ShoppingBag-Empty";
import Verification from "./pages/main/Login/Verification";

//product
import CategoryProducts from "./pages/product/CategoryProducts";
import ProductDesc from "./pages/product/ProductDesc";
import TryOn from "/src/pages/product/tryon/TryOn";

//collections
import CollectionPage from "./pages/product/collections/CollectionPage";

//Profile
import Profile from "./pages/user/Profile/Profile";
import InProgress from "./pages/user/Profile/InProgress";
import Delivered from "./pages/user/Profile/Delivered";
import Cancelled from "./pages/user/Profile/Cancelled";
import Refund from "./pages/user/Profile/Refund";
import ViewOrder from "./pages/user/Profile/ViewOrder";
import ViewOrderInProgress from "./pages/user/Profile/ViewOrder-InProgress";
import RequestReturn from "./pages/user/Profile/Return";
import ReviewDetails from "./pages/user/Profile/ReviewDetails";
import OrderCompleted from "./pages/user/Profile/OrderCompleted";

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
import CategoriesContent from "./admin/Contents/Categories";
import CollectionsContent from "./admin/Contents/Collections/CollectionsContent";

const App = () => {
  return (
    
    <ContentProvider>
      <CategoryProvider>
        <CollectionProvider>
          <ProductProvider>
            <Router>
              <CartProvider>
                <WishlistProvider>
              <ScrollToTop />
              <div>
                
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/template" element={<Template />} />

                  {/*Customer Care Footer */}
                  <Route path="/customer-care/faqs" element={<FAQs />} />
                  <Route
                    path="/customer-care/jewelry-care"
                    element={<JewelryCare />}
                  />
                  <Route
                    path="/customer-care/size-guide"
                    element={<SizeGuide />}
                  />
                  <Route
                    path="/customer-care/shipping"
                    element={<Shipping />}
                  />
                  <Route
                    path="/customer-care/track-order"
                    element={<TrackOrder />}
                  />
                  <Route
                    path="/customer-care/track-order-2"
                    element={<TrackOrder2 />}
                  />
                  <Route path="/customer-care/return" element={<Return />} />

                  {/*About Footer */}
                  <Route path="/about/contact-us" element={<ContactUs />} />
                  <Route path="/about/our-story" element={<OurStory />} />
                  <Route
                    path="/about/customer-review"
                    element={<CustomerReviews />}
                  />

                  {/*Main Header */}
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route
                    path="/user/Wishlist-Empty"
                    element={<WishlistEmpty />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/shopping-bag" element={<ShoppingBag />} />
                  <Route path="/user/cart/checkout" element={<Checkout />} />
                  <Route path="/order-completed" element={<OrderCompleted />} />
                  <Route
                    path="/user/cart/ShoppingBag-Empty"
                    element={<ShoppingBagEmpty />}
                  />
                  <Route path="/verification" element={<Verification />} />

                  {/*Main nav */}
                  {/* Dynamic Category Products Route */}
                  <Route
                    path="/products/:categorySlug"
                    element={<CategoryProducts />}
                  />
                  <Route
                    path="/product/:productSlug"
                    element={<ProductDesc />}
                  />
                  <Route path="/tryon" element={<TryOn />} />

                  {/*Collections - Dynamic Route */}
                  <Route
                    path="/collections/:collectionSlug"
                    element={<CollectionPage />}
                  />

                  {/*Profile */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/inprogress" element={<InProgress />} />
                  <Route path="/profile/delivered" element={<Delivered />} />
                  <Route path="/profile/cancelled" element={<Cancelled />} />
                  <Route path="/profile/refund" element={<Refund />} />
                  <Route path="/profile/vieworder" element={<ViewOrder />} />
                  <Route
                    path="/profile/vieworder-inprogress"
                    element={<ViewOrderInProgress />}
                  />
                  <Route path="/profile/requestreturn" element={<RequestReturn />} />
                  <Route path="/profile/reviewdetails" element={<ReviewDetails />} />
                  <Route path="/profile/ordercompleted" element={<OrderCompleted />} />

                  {/*Admin */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route
                    path="/admin/collection"
                    element={<CollectionManagement />}
                  />
                  <Route path="/admin/live-chat" element={<LiveChat />} />
                  <Route path="/admin/content" element={<ContentManagement />}>
                    <Route index element={<HomepageContent />} />
                    <Route path="homepage" element={<HomepageContent />} />
                    {/* Admin Content Management Homepage */}
                    {/* (now nested under /admin/content) */}
                    <Route path="categories" element={<CategoriesContent />} />
                    <Route
                      path="categories/necklaces"
                      element={<CategoriesContent />}
                    />
                    <Route
                      path="categories/bracelets"
                      element={<CategoriesContent />}
                    />
                    <Route path="categories/rings" element={<CategoriesContent />} />
                    <Route
                      path="categories/earrings"
                      element={<CategoriesContent />}
                    />

                    {/* Collections - Dynamic routing for any collection */}
                    <Route
                      path="collections"
                      element={<CollectionsContent />}
                    />
                    <Route
                      path="collections/:collectionSlug"
                      element={<CollectionsContent />}
                    />
                  </Route>
                  <Route path="/admin/user" element={<UserManagement />} />
                </Routes>
              </div>
                </WishlistProvider>
              </CartProvider>
            </Router>
          </ProductProvider>
        </CollectionProvider>
      </CategoryProvider>
    </ContentProvider>
  );
};

export default App;
