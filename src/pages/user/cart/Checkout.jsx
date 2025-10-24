import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { useCart } from '../../../contexts/CartContext';
import AddressDropdowns from '../../../components/AddressDropdowns';
import { philippineLocations } from '../../../data/philippineLocations';
import { createCheckoutSession } from '../../../services/paymongoService'; // Remove after testing
import Toast from '../../../components/Toast';
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

const shipping = 80;

const CheckoutDesktop = ({ onImageClick, products, subtotal, total, itemCount, formData, handleInputChange, errors, handleSubmit, handleCityChange, handleProvinceChange, availableBarangays }) => (
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
              {/* Product image with click handler */}
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 object-cover rounded-lg shadow-lg cursor-pointer"
                onClick={() => onImageClick(p.image)}
              />
              <div>
                <div className="avantbold text-lg text-nowrap">{p.name}</div>
                {p.collection && (
                  <div className="bebas text-md mt-1" style={{color: '#959595'}}>{p.collection}</div>
                )}
                {p.variant && (
                <div className="bebas text-md mt-1" style={{color: '#959595'}}>{p.variant}</div>
                )}
              </div>
            </div>
            <div className="avant text-md pl-45 text-center">{p.size || '-'}</div>
            <div className="avantbold pl-20 text-md text-center">{p.price}</div>
            <div className="avantbold text-md text-center">{p.quantity}</div>
            <div className="avantbold text-md pr-15 text-center">₱ {(parseFloat(p.price.replace(/[^\d.]/g, '')) * p.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      {/* Below products */}
      <div className="w-full max-w-[1400px] flex gap-4 px-12 mt-2">
        {/* Delivery Form */}
        <div className="flex-1 max-w-[2500px]">
          <div className="bg-[#181818] p-6 rounded-xl border border-[#fff7dc]/30 mb-4">
            <div className="bebas cream-text text-4xl mb-4">DELIVERY</div>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              {/* EMAIL ADDRESS */}
              <div>
                <label className="bebas text-lg mb-1 block">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg bg-transparent border avant cream-text text-md mb-2 placeholder-avant ${
                    errors.email ? 'border-red-500' : 'border-[#FFF7DC]'
                  }`}
                  placeholder="Enter your Email Address" 
                />
                {errors.email && <p className="text-red-500 text-sm avant">{errors.email}</p>}
              </div>
              {/* FIRST NAME and LAST NAME */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">FIRST NAME</label>
                  <input 
                    type="text" 
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg bg-transparent border avant cream-text text-md mb-2 placeholder-avant ${
                      errors.first_name ? 'border-red-500' : 'border-[#FFF7DC]'
                    }`}
                    placeholder="Enter your First Name" 
                  />
                  {errors.first_name && <p className="text-red-500 text-sm avant">{errors.first_name}</p>}
                </div>
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">LAST NAME</label>
                  <input 
                    type="text" 
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg bg-transparent border avant cream-text text-md mb-2 placeholder-avant ${
                      errors.last_name ? 'border-red-500' : 'border-[#FFF7DC]'
                    }`}
                    placeholder="Enter your Last Name" 
                  />
                  {errors.last_name && <p className="text-red-500 text-sm avant">{errors.last_name}</p>}
                </div>
              </div>
              {/* STREET ADDRESS */}
              <div>
                <label className="bebas text-lg mb-1 block">STREET ADDRESS</label>
                <input 
                  type="text" 
                  name="street_address"
                  value={formData.street_address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg bg-transparent border avant cream-text text-md mb-2 placeholder-avant ${
                    errors.street_address ? 'border-red-500' : 'border-[#FFF7DC]'
                  }`}
                  placeholder="(house/building number, street name, and optional subdivision)" 
                />
                {errors.street_address && <p className="text-red-500 text-sm avant">{errors.street_address}</p>}
              </div>
              <AddressDropdowns 
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleCityChange={handleCityChange}
                handleProvinceChange={handleProvinceChange}
                availableBarangays={availableBarangays}
                isMobile={false}
              />
              {/* POSTAL CODE */}
              <div>
                  <label className="bebas text-lg mb-1 block">POSTAL CODE</label>
                <input 
                  type="text" 
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg bg-transparent border avant cream-text text-md mb-2 placeholder-avant ${
                    errors.postal_code ? 'border-red-500' : 'border-[#FFF7DC]'
                  }`}
                  placeholder="Enter your Postal Code" 
                />
                {errors.postal_code && <p className="text-red-500 text-sm avant">{errors.postal_code}</p>}
              </div>
              {/* PHONE NUMBER */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="bebas text-lg mb-1 block">PHONE NUMBER</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength="11"
                    className={`w-full px-4 py-2 rounded-lg bg-transparent border avant cream-text text-md mb-2 placeholder-avant ${
                      errors.phone ? 'border-red-500' : 'border-[#FFF7DC]'
                    }`}
                    placeholder="09XXXXXXXXX" 
                  />
                  {errors.phone && <p className="text-red-500 text-sm avant">{errors.phone}</p>}
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
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full h-30 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-md p-3" 
              placeholder="Leave a note to the seller..." 
            />
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
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 cursor-pointer rounded bg-[#fff7dc] text-[#181818] avantbold text-xs tracking-wide shadow hover:bg-[#ffe9b3] transition flex items-center justify-center gap-2"
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

const CheckoutMobile = ({ onImageClick, products, subtotal, total, itemCount, formData, handleInputChange, errors, handleSubmit, handleCityChange, handleProvinceChange, availableBarangays }) => (
  <div className="lg:hidden w-full min-h-screen bg-[#181818] px-4 pt-22 text-[#fff7dc] bebas">
    <h1 className="bebas cream-text text-center text-4xl mb-6">CHECKOUT</h1>
    {/* Products List */}
    <div className="w-full mb-4">
      {products.map((p, i) => (
        <div key={p.id} className="bg-[#181818] rounded-xl border border-[#fff7dc]/30 mb-4 p-2">
          <div className="flex items-start gap-3">
            {/* Product image with click handler */}
            <img
              src={p.image}
              alt={p.name}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer"
              onClick={() => onImageClick(p.image)}
            />
            <div>
              <div className="avantbold text-sm">{p.name}</div>
              {p.collection && (
                <div className="bebas text-xs mt-1" style={{color: '#959595'}}>{p.collection}</div>
              )}
              {p.variant && (
              <div className="bebas text-xs mt-1" style={{color: '#959595'}}>{p.variant}</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 avant text-xs mt-2 text-center">
            <div>Size</div>
            <div>Price</div>
            <div>Qty</div>
            <div>Subtotal</div>
          </div>
          <div className="grid grid-cols-4 avantbold text-xs mt-1 text-center">
            <div>{p.size || '-'}</div>
            <div>{p.price}</div>
            <div>{p.quantity}</div>
            <div>₱ {(parseFloat(p.price.replace(/[^\d.]/g, '')) * p.quantity).toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
    {/* Delivery Form */}
    <div className="bg-[#181818] p-4 rounded-xl border border-[#fff7dc]/30 mb-4">
      <div className="bebas cream-text text-3xl mb-2">DELIVERY</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className="bebas text-md block">EMAIL ADDRESS</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 rounded-md bg-transparent border avant cream-text text-xs mb-2 placeholder-avant ${
            errors.email ? 'border-red-500' : 'border-[#FFF7DC]'
          }`}
          placeholder="Enter your email" 
        />
        {errors.email && <p className="text-red-500 text-xs avant">{errors.email}</p>}
        
        <label className="bebas text-md block">FIRST NAME</label>
        <input 
          type="text" 
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 rounded-md bg-transparent border avant cream-text text-xs mb-2 placeholder-avant ${
            errors.first_name ? 'border-red-500' : 'border-[#FFF7DC]'
          }`}
          placeholder="Enter your first name" 
        />
        {errors.first_name && <p className="text-red-500 text-xs avant">{errors.first_name}</p>}
        
        <label className="bebas text-md block">LAST NAME</label>
        <input 
          type="text" 
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 rounded-md bg-transparent border avant cream-text text-xs mb-2 placeholder-avant ${
            errors.last_name ? 'border-red-500' : 'border-[#FFF7DC]'
          }`}
          placeholder="Enter your last name" 
        />
        {errors.last_name && <p className="text-red-500 text-xs avant">{errors.last_name}</p>}
        
        <label className="bebas text-md block">STREET ADDRESS</label>
        <input 
          type="text" 
          name="street_address"
          value={formData.street_address}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 rounded-md bg-transparent border avant cream-text text-xs mb-2 placeholder-avant ${
            errors.street_address ? 'border-red-500' : 'border-[#FFF7DC]'
          }`}
          placeholder="(house/building number, street name, and optional subdivision)" 
        />
        {errors.street_address && <p className="text-red-500 text-xs avant">{errors.street_address}</p>}
        
        <AddressDropdowns 
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          handleCityChange={handleCityChange}
          handleProvinceChange={handleProvinceChange}
          availableBarangays={availableBarangays}
          isMobile={true}
        />
        
        <label className="bebas text-md block">POSTAL CODE</label>
        <input 
          type="text" 
          name="postal_code"
          value={formData.postal_code}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 rounded-md bg-transparent border avant cream-text text-xs mb-2 placeholder-avant ${
            errors.postal_code ? 'border-red-500' : 'border-[#FFF7DC]'
          }`}
          placeholder="Enter your Postal Code" 
        />
        {errors.postal_code && <p className="text-red-500 text-xs avant">{errors.postal_code}</p>}
        
        <label className="bebas text-md block">PHONE NUMBER</label>
        <input 
          type="text" 
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          maxLength="11"
          className={`w-full px-3 py-2 rounded-md bg-transparent border avant cream-text text-xs mb-2 placeholder-avant ${
            errors.phone ? 'border-red-500' : 'border-[#FFF7DC]'
          }`}
          placeholder="09XXXXXXXXX" 
        />
        {errors.phone && <p className="text-red-500 text-xs avant">{errors.phone}</p>}
        
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
      <textarea 
        name="notes"
        value={formData.notes}
        onChange={handleInputChange}
        className="w-full h-20 rounded-lg bg-transparent border border-[#FFF7DC] avant cream-text text-xs p-2" 
        placeholder="Leave a note to the seller..." 
      />
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
      <button 
        type="button"
        onClick={handleSubmit}
        className="w-full py-3 rounded bg-[#fff7dc] text-[#181818] avantbold text-xs tracking-wide shadow hover:bg-[#ffe9b3] transition flex items-center justify-center gap-2"
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
  const { getSelectedItems, getSelectedItemsTotal, getSelectedItemsCount, clearSelectedItems } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  
  // Form
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    street_address: '',
    barangay: '',
    city_municipality: '',
    province_region: '',
    postal_code: '',
    phone: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [availableBarangays, setAvailableBarangays] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'error'
  });

  const showToast = (message, type = 'error') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const selectedProducts = getSelectedItems();
  const subtotal = getSelectedItemsTotal();
  const shipping = 80;
  const total = subtotal + shipping;
  const itemCount = getSelectedItemsCount();

  const handleImageClick = (imgSrc) => {
    setModalImage(imgSrc);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numbers
    let finalValue = value;
    if (name === 'phone') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 11);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle city/municipality change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    const selectedProvince = formData.province_region;
    
    setFormData(prev => ({
      ...prev,
      city_municipality: selectedCity,
      barangay: ''//resert
    }));
    
    if (selectedProvince && selectedCity) {
      let foundBarangays = [];
      
      for (const regionName in philippineLocations) {
        const regionData = philippineLocations[regionName];
        if (regionData[selectedProvince]) {
          const provinceData = regionData[selectedProvince];
          
          if (typeof provinceData === 'object' && !Array.isArray(provinceData) && provinceData[selectedCity]) {
            foundBarangays = provinceData[selectedCity];
            break;
          } else if (Array.isArray(provinceData)) {
            foundBarangays = [];
            break;
          }
        }
      }
      
      setAvailableBarangays(foundBarangays);
    } else {
      setAvailableBarangays([]);
    }
    
    if (errors.city_municipality) {
      setErrors(prev => ({
        ...prev,
        city_municipality: ''
      }));
    }
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      province_region: selectedProvince,
      city_municipality: '', // Reset city 
      barangay: '' // Reset barangay 
    }));
    
    setAvailableBarangays([]);
    
    if (errors.province_region) {
      setErrors(prev => ({
        ...prev,
        province_region: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.street_address.trim()) {
      newErrors.street_address = 'Street address is required';
    }
    
    if (!formData.barangay.trim()) {
      newErrors.barangay = 'Barangay is required';
    }
    
    if (!formData.city_municipality.trim()) {
      newErrors.city_municipality = 'City/Municipality is required';
    }
    
    if (!formData.province_region.trim()) {
      newErrors.province_region = 'Province/Region is required';
    }
    
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be 11 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Prepare data for PayMongo checkout session
        const paymongoData = {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          street_address: formData.street_address,
          barangay: formData.barangay,
          city_municipality: formData.city_municipality,
          province_region: formData.province_region,
          postal_code: formData.postal_code,
          phone: formData.phone,
          notes: formData.notes || '',
          shipping_method: 'Standard',
          // payment_method will be detected from PayMongo after payment hopefully as of now not working...
          total_price: total,
          shipping_cost: 80, 
          items: selectedProducts.map(product => {
            const item = {
              product_id: product.product_id,
              name: product.name,
              quantity: product.quantity,
              price: parseFloat(product.price.replace(/[^\d.]/g, ''))
            };
            
            if (product.size && product.size !== 'default' && product.size !== null) {
              item.size = String(product.size); // Convert to string as required by backend validation
            }
            
            return item;
          })
        };
        
        
        const checkoutSession = await createCheckoutSession(paymongoData);

        const sessionId = checkoutSession.data?.id || checkoutSession.id || null;
        
        if (!sessionId) {
          showToast('Failed to create payment session. Please try again.', 'error');
          return;
        }

       t
        const orderData = {
          ...paymongoData,
          checkout_session_id: sessionId
        };

        
        
        const apiUrl = import.meta.env.VITE_API_URL;
        const tempOrderResponse = await fetch(`${apiUrl}/orders/temp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkout_session_id: sessionId,
            order_data: orderData
          })
        });

        if (!tempOrderResponse.ok) {
          const errorData = await tempOrderResponse.json();
          showToast('Failed to prepare order. Please try again.', 'error');
          return;
        }

        
        if (checkoutSession.data && checkoutSession.data.attributes.checkout_url) {
          localStorage.removeItem('checkout_email');
          localStorage.removeItem('checkout_session_id');
          localStorage.removeItem(`payment_methods_${localStorage.getItem('checkout_session_id')}`);
          
          localStorage.setItem('checkout_email', formData.email);
          
          localStorage.setItem('checkout_session_id', sessionId);
          
          localStorage.setItem(`payment_methods_${sessionId}`, JSON.stringify([
            'card',
            'gcash',
            'grab_pay',
            'paymaya'
          ]));
          
          if (import.meta.env.DEV) {
          }
          
          clearSelectedItems();
          
          showToast('Redirecting to secure payment...', 'success');
          
          setTimeout(() => {
            window.location.href = checkoutSession.data.attributes.checkout_url;
          }, 1000);
        } else {
          showToast('No checkout URL received from payment provider. Please try again.', 'error');
          return;
        }
      } catch (error) {
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
          showToast('Network error. Please check your internet connection and try again.', 'error');
        } else if (error.message.includes('PayMongo')) {
          showToast('Payment service temporarily unavailable. Please try again in a few minutes.', 'error');
        } else if (error.message.includes('session')) {
          showToast('Failed to create payment session. Please try again.', 'error');
        } else {
          showToast('Payment processing failed. Please try again or contact support.', 'error');
        }
      }
    } else {
      showToast('Please fill in all required fields correctly.', 'warning');
    }
  };

  if (selectedProducts.length === 0) {
    return (
      <Layout full>
        <div className="min-h-screen bg-[#181818] flex items-center justify-center text-[#fff7dc]">
          <div className="text-center">
            <h1 className="bebas text-4xl mb-4">NO ITEMS SELECTED</h1>
            <p className="avant text-lg mb-8">Please go back to your cart and select items to checkout.</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-[#FFF7DC] text-[#181818] px-6 py-3 rounded avantbold text-lg hover:bg-[#ffe9b3] transition"
            >
              BACK TO CART
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout full>
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <img
            src={modalImage}
            alt="Product Fullscreen"
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl avantbold bg-black bg-opacity-50 rounded-full px-4 py-2 cursor-pointer"
            onClick={handleCloseModal}
          >
            ×
          </button>
        </div>
      )}
      <CheckoutDesktop 
        onImageClick={handleImageClick} 
        products={selectedProducts}
        subtotal={subtotal}
        total={total}
        itemCount={itemCount}
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        handleSubmit={handleSubmit}
        handleCityChange={handleCityChange}
        handleProvinceChange={handleProvinceChange}
        availableBarangays={availableBarangays}
      />
      <CheckoutMobile 
        onImageClick={handleImageClick}
        products={selectedProducts}
        subtotal={subtotal}
        total={total}
        itemCount={itemCount}
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        handleSubmit={handleSubmit}
        handleCityChange={handleCityChange}
        handleProvinceChange={handleProvinceChange}
        availableBarangays={availableBarangays}
      />
      
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
        duration={toast.type === 'success' ? 2000 : 4000}
      />
    </Layout>
  );
};

export default Checkout;