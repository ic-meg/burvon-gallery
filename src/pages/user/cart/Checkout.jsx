import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { 
    visa, 
    mastercard, 
    gcash, 
    maya, 
    paymongo, 
    Friden, 
    Odyssey,
    XWhite
} from '../../../assets/index.js'; 

const products = [
  {
    id: 1,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Odyssey,
    price: 590,
    quantity: 1,
    variant: 'ODYSSEY',
  },
  {
    id: 2,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Friden,
    price: 590,
    quantity: 2,
    variant: 'FRIDEN',
  },
];

const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
const shipping = 80;
const total = subtotal + shipping;
const itemCount = products.reduce((sum, p) => sum + p.quantity, 0);

const CheckoutDesktop = ({ onImageClick }) => (
  <div className="hidden lg:block min-h-screen bg-[#181818] px-0 py-20 text-[#fff7dc] bebas">
    <div className="flex flex-col items-center pt-20">
      <h1 className="bebas cream-text mb-12" style={{fontSize: '85px'}}>CHECKOUT</h1>
      {/* Products Table */}
      <div className="w-full max-w-[1400px] px-12">
        <div className="grid grid-cols-5 avant text-xl border-b border-[#fff7dc]/30 pb-2 mb-2">
          <div>Product/s</div>
          <div className='pl-50'>Size</div>
          <div className='pl-35'>Price</div>
          <div className='pl-25'>Quantity</div>
          <div className='pl-15'>Subtotal</div>
        </div>
        {products.map((p, i) => (
          <div key={p.id} className="grid grid-cols-5 items-center border-b border-[#fff7dc]/10 py-6">
            <div className="flex items-center gap-5">
              {/* X icon beside product */}
              <img src={XWhite} alt="Remove" className="w-5 h-5 mr-3 cursor-pointer" />
              {/* Product image with click handler */}
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 object-cover rounded-lg shadow-lg cursor-pointer"
                onClick={() => onImageClick(p.image)}
              />
              <div>
                <div className="avantbold text-lg text-nowrap">Clash Collection Necklaces</div>
                <div className="avantbold text-md">(Elegant Pendant Jewelry)</div>
                <div className="bebas text-md mt-1" style={{color: '#959595'}}>{p.variant}</div>
              </div>
            </div>
            <div className="avant text-md pl-45 text-center">-</div>
            <div className="avantbold pl-20 text-md text-center">₱ {p.price.toFixed(2)}</div>
            <div className="avantbold text-md text-center">{p.quantity}</div>
            <div className="avantbold text-md pr-15 text-center">₱ {(p.price * p.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      {/* Below products */}
      <div className="w-full max-w-[1400px] flex gap-12 px-12 mt-8">
        {/* Delivery Form */}
        <div className="flex-1 max-w-[560px]">
          <div className="bg-[#181818] p-6 rounded-xl border border-[#fff7dc]/30 mb-4">
            <div className="bebas cream-text text-4xl mb-4">DELIVERY</div>
            <form className="flex flex-col gap-3">
              {/* EMAIL ADDRESS */}
              <div>
                <label className="bebas text-lg mb-1 block">EMAIL ADDRESS</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="Enter your Email Address" />
              </div>
              {/* FIRST NAME and LAST NAME */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">FIRST NAME</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="Enter your First Name" />
                </div>
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">LAST NAME</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="Enter your Last Name" />
                </div>
              </div>
              {/* STREET ADDRESS */}
              <div>
                <label className="bebas text-lg mb-1 block">STREET ADDRESS</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="(house/building number, street name, and optional subdivision)" />
              </div>
              {/* BARANGAY and CITY/MUNICIPALITY */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">BARANGAY</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="Select your Barangay" />
                </div>
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">CITY/MUNICIPALITY</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="Select your City/Municipality" />
                </div>
              </div>
              {/* PROVINCE/REGION and POSTAL CODE */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">PROVINCE/REGION</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="Select your Province/Region" />
                </div>
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">POSTAL CODE</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="Enter your Postal Code" />
                </div>
              </div>
              {/* PHONE NUMBER */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">PHONE NUMBER</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md mb-2" placeholder="+63XXXXXXXXXX" />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-2 avant cream-text text-sm cursor-pointer">
                <input type="checkbox" className="accent-[#FFF7DC] w-4 h-4" />
                Save this information for next time
              </label>
            </form>
          </div>
          {/* Shipping Method */}
          <div className="bg-[#181818] p-6 rounded-xl border border-[#fff7dc]/30 mb-4">
            <div className="bebas cream-text text-2xl mb-2">SHIPPING METHOD</div>
            <div className="avant cream-text text-md mb-2">Standard (Metro Manila: 5-7 working days, Outside Metro Manila: 12-15 working days)</div>
            <div className="avantbold cream-text text-md">₱ {shipping.toFixed(2)}</div>
          </div>
          {/* Notes */}
          <div className="bg-[#181818] p-6 rounded-xl border border-[#fff7dc]/30 mb-4">
            <div className="bebas cream-text text-2xl mb-2">NOTES</div>
            <textarea className="w-full h-30 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md p-3" placeholder="Leave a note to the seller..." />
          </div>
        </div>
        {/* Order Summary & Payment */}
        <div className="flex flex-1 justify-end">
          <div className="w-full max-w-sm flex flex-col">
            <div className="bg-[#181818] p-6 rounded-xl border border-[#fff7dc]/30 mb-4">
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Subtotal ( {itemCount} items )</span>
                <span>₱ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Shipping</span>
                <span>₱ {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between avantbold text-xl mt-4 border-t border-[#fff7dc]/30 pt-2">
                <span>Total</span>
                <span>₱ {total.toFixed(2)}</span>
              </div>
            </div>
            {/* Payment Section */}
            <div className="bg-[#181818] p-3 mb-4 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-3">
                <img src={visa} alt="Visa" className="h-9" />
                <img src={mastercard} alt="Mastercard" className="h-4" />
                <img src={gcash} alt="Gcash" className="h-5" />
                <img src={maya} alt="Maya" className="h-9" />
                <span className="avantbold text-sm ml-2">+ more</span>
              </div>
              {/* PayMongo button */}
              <button
                className="w-full py-3 rounded bg-[#fff7dc] text-[#181818] avantbold text-xs tracking-wide shadow hover:bg-[#ffe9b3] transition flex items-center justify-center gap-2"
                style={{ height: '45px', overflow: 'visible' }}
              >
                <span className="avantbold text-sm">PAY WITH</span>
                <img src={paymongo} alt="Paymongo" className="w-20 h-20" />
              </button>
              <div className="avant text-xs text-[#fff7dc] mt-2 text-center">
                Secure Payments Powered by <span className="avantitalic">PayMongo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CheckoutMobile = ({ onImageClick }) => (
  <div className="lg:hidden w-full min-h-screen bg-[#181818] px-4 pt-22 text-[#fff7dc] bebas">
    <h1 className="bebas cream-text text-center text-4xl mb-6">CHECKOUT</h1>
    {/* Products List */}
    <div className="w-full mb-4">
      {products.map((p, i) => (
        <div key={p.id} className="bg-[#181818] rounded-xl border border-[#fff7dc]/30 mb-4 p-2">
          <div className="flex items-start gap-3">
            {/* X icon beside product */}
            <img src={XWhite} alt="Remove" className="w-5 h-5 mt-1 mr-2 cursor-pointer" />
            {/* Product image with click handler */}
            <img
              src={p.image}
              alt={p.name}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer"
              onClick={() => onImageClick(p.image)}
            />
            <div>
              <div className="avantbold text-sm">Clash Collection Necklaces</div>
              <div className="avantbold text-xs">(Elegant Pendant Jewelry)</div>
              <div className="bebas text-xs mt-1" style={{color: '#959595'}}>{p.variant}</div>
            </div>
          </div>
          <div className="grid grid-cols-4 avant text-xs mt-2 text-center">
            <div>Size</div>
            <div>Price</div>
            <div>Qty</div>
            <div>Subtotal</div>
          </div>
          <div className="grid grid-cols-4 avantbold text-xs mt-1 text-center">
            <div>-</div>
            <div>₱ {p.price.toFixed(2)}</div>
            <div>{p.quantity}</div>
            <div>₱ {(p.price * p.quantity).toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
    {/* Delivery Form */}
    <div className="bg-[#181818] p-4 rounded-xl border border-[#fff7dc]/30 mb-4">
      <div className="bebas cream-text text-3xl mb-2">DELIVERY</div>
      <form className="flex flex-col gap-2">
        <label className="bebas text-md block">EMAIL ADDRESS</label>
        <input type="email" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="Enter your email" />
        <label className="bebas text-md block">FIRST NAME</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="Enter your first name" />
        <label className="bebas text-md block">LAST NAME</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="Enter your last name" />
        <label className="bebas text-md block">STREET ADDRESS</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="(house/building number, street name, and optional subdivision)" />
        <label className="bebas text-md block">BARANGAY</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="Select your Barangay" />
        <label className="bebas text-md block">CITY/MUNICIPALITY</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="Select your City/Municipality" />
        <label className="bebas text-md block">PROVINCE/REGION</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="Select your Province/Region" />
        <label className="bebas text-md block">POSTAL CODE</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="Enter your Postal Code" />
        <label className="bebas text-md block">PHONE NUMBER</label>
        <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border border-[#FFF7DC] avant cream-text text-xs mb-2 placeholder-avant" placeholder="+63XXXXXXXXXX" />
        <label className="flex items-center gap-2 mt-2 avant cream-text text-xs cursor-pointer">
          <input type="checkbox" className="accent-[#FFF7DC] w-4 h-4" />
          Save this information for next time
        </label>
      </form>
    </div>
    {/* Shipping Method */}
    <div className="bg-[#181818] p-4 rounded-xl border border-[#fff7dc]/30 mb-4">
      <div className="bebas cream-text text-xl mb-2">SHIPPING METHOD</div>
      <div className="avant cream-text text-xs mb-2">Standard (Metro Manila: 5-7 working days, Outside Metro Manila: 12-15 working days)</div>
      <div className="avantbold cream-text text-xs">₱ {shipping.toFixed(2)}</div>
    </div>
    {/* Notes */}
    <div className="bg-[#181818] p-4 rounded-xl border border-[#fff7dc]/30 mb-4">
      <div className="bebas cream-text text-xl mb-2">NOTES</div>
      <textarea className="w-full h-20 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-xs p-2" placeholder="Leave a note to the seller..." />
    </div>
    {/* Order Summary & Payment */}
    <div className="bg-[#181818] p-4 rounded-xl border border-[#fff7dc]/30 mb-4">
      <div className="flex justify-between mb-2 avantbold text-xs">
        <span>Subtotal ( {itemCount} items )</span>
        <span>₱ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2 avantbold text-xs">
        <span>Shipping</span>
        <span>₱ {shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between avantbold text-sm mt-2 border-t border-[#fff7dc]/30 pt-2">
        <span>Total</span>
        <span>₱ {total.toFixed(2)}</span>
      </div>
      {/* Payment Section */}
      <div className="flex gap-2 mb-2 items-center justify-center mt-4">
        <img src={visa} alt="Visa" className="w-7 h-7" />
        <img src={mastercard} alt="Mastercard" className="w-6 h-5" />
        <img src={gcash} alt="Gcash" className="w-5 h-5" />
        <img src={maya} alt="Maya" className="w-8 h-8" />
        <span className="avantbold text-xs ml-1">+ more</span>
        
      </div>
      <button className="w-full py-3 rounded bg-[#fff7dc] text-[#181818] avantbold text-xs tracking-wide shadow hover:bg-[#ffe9b3] transition flex items-center justify-center gap-2"
      style={{ height: '45px', overflow: 'visible' }}
      >
        <span className="avantbold text-sm">PAY WITH</span>
        <img src={paymongo} alt="Paymongo" className="w-18 h-18" />
      </button>
      <div className="avant text-xs text-[#fff7dc] mt-2 text-center">
        Secure Payments Powered by <span className="avantitalic">PayMongo</span>
      </div>
    </div>
  </div>
);

const Checkout = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Handler to open modal with image
  const handleImageClick = (imgSrc) => {
    setModalImage(imgSrc);
    setModalOpen(true);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  return (
    <Layout full>
      {/* Fullscreen Image Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <img
            src={modalImage}
            alt="Product Fullscreen"
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl avantbold bg-black bg-opacity-50 rounded-full px-4 py-2 cursor-pointer"
            onClick={handleCloseModal}
          >
            ×
          </button>
        </div>
      )}
      <CheckoutDesktop onImageClick={handleImageClick} />
      <CheckoutMobile onImageClick={handleImageClick} />
    </Layout>
  );
};

export default Checkout;