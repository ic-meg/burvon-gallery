import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/main/Homepage'
import Login from './pages/main/Login/Login'
import Template from './pages/Template'
import Verification from './pages/main/Login/Verification';
import FAQs from './pages/customer-care/FAQs';
import JewelryCare from './pages/customer-care/JewelryCare';
import ScrollToTop from './components/ScrollToTop';
import ContactUs from './pages/about/ContactUs';  

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/template" element={<Template />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/customer-care/faqs" element={<FAQs />} />
          <Route path="/customer-care/jewelry-care" element={<JewelryCare />} />
          <Route path="/about/contact-us" element={<ContactUs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;