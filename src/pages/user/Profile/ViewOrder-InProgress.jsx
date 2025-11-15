import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../../components/Layout.jsx'
import { Friden, Odyssey } from '../../../assets/index.js'

const order = {
  id: '38940123',
  items: [
    {
      name: 'Clash Collection Necklaces',
      variant: 'ODYSSEY',
      price: 590,
      quantity: 1,
      image: Odyssey,
    },
    {
      name: 'Clash Collection Necklaces',
      variant: 'FRIDEN',
      price: 590,
      quantity: 2,
      image: Friden,
    },
  ],
  date: 'March 01, 2025',
  delivery: 'March 07, 2025',
  subtotal: 1770,
  shipping: 80,
  total: 1850,
  customer: {
    email: 'gilcalais@gmail.com',
    phone: '+63926484997',
    name: 'Giuliani Calais',
    address: 'Blk 2 Lot 8 Greenfields, Mambog 1\nBacoor City, Cavite',
    payment: 'Gcash',
  },
}

const ViewOrderDesktop = ({ openCancelModal }) => {
  const navigate = useNavigate()
  return (
    <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0">
      {/* Header */}
      <div className="flex items-center justify-between px-12 pt-28 pb-2">
        <div
          className="avantbold cream-text text-lg cursor-pointer relative z-50"
          onClick={() => navigate('/profile/inprogress')}
        >
          &larr; GO BACK
        </div>
        <div style={{ width: 120 }}></div>
      </div>
      <div className="bebas cream-text text-center text-5xl mt-15 mb-2">VIEW ORDER</div>
      <div className="avantbold cream-text text-2xl text-center mb-1">ORDER ID : #{order.id}</div>
      <div className="avant cream-text text-center text-sm mb-10">THANK YOU. YOUR ORDER HAS BEEN RECEIVED.</div>
      {/* Table Header */}
      <div className="w-full px-12">
        <div className="grid grid-cols-[640px_80px_120px_120px_120px] avant cream-text text-xl border-b border-[#fff7dc]">
          <div className="py-2 pl-0">Product/s</div>
          <div className="py-2 text-center">Size</div>
          <div className="py-2 pl-23">Price</div>
          <div className="py-2 pl-30">Quantity</div>
          <div className="py-2 pl-44">Subtotal</div>
        </div>
      </div>
      {/* Items */}
      {order.items.map((item, idx) => (
        <div key={item.variant} className="w-full px-12">
          <div className="flex items-center py-6 border-b border-[#fff7dc]">
            <div className="flex items-center w-[320px] gap-4">
              <img src={item.image} alt={item.variant} className="w-[160px] h-[160px] object-cover rounded-md" />
              <div>
                <div className="avantbold text-nowrap cream-text text-lg leading-tight">
                  {item.name}
                  <br />
                  <span className="avantbold cream-text text-md">(Elegant Pendant Jewelry)</span>
                </div>
                <div className="bebas cream-text text-md mt-1" style={{ color: '#959595' }}>{item.variant}</div>
              </div>
            </div>
            <div className="w-[120px] pl-89 text-center avant cream-text text-lg">-</div>
            <div className="w-[120px] pl-35 text-nowrap text-center avant cream-text text-lg">PHP {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            <div className="w-[120px] pl-45 text-center avant cream-text text-lg">{item.quantity}</div>
            <div className="w-[120px] pl-36 text-nowrap text-center avant cream-text text-lg">
              PHP {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}
            </div>
          </div>
          {/* Add extra cream line after each product except last */}
          {idx < order.items.length - 1 && (
            <div className="w-full border-b border-[#fff7dc]" />
          )}
        </div>
      ))}
      {/* Details Section */}
      <div className="flex flex-row px-12 py-8 gap-12 relative">
        {/* Customer Details */}
        <div className="flex flex-col gap-2 avant cream-text text-md min-w-[220px]">
          <div className="avantbold cream-text text-xl mb-1">Customer Details</div>
          <div>{order.customer.email}</div>
          <div>{order.customer.phone}</div>
          <div className="mt-2 avantbold cream-text text-xl">Order Date</div>
          <div>{order.date}</div>
          <div className="mt-2 avantbold cream-text text-xl">Payment Method</div>
          <div>{order.customer.payment}</div>
        </div>
        {/* Shipping Address */}
        <div className="flex flex-col gap-2 avant cream-text text-md min-w-[220px]">
          <div className="avantbold cream-text text-xl mb-1">Shipping Address</div>
          <div>{order.customer.name}</div>
          <div style={{ whiteSpace: 'pre-line' }}>{order.customer.address}</div>
          <div className="mt-2 avantbold cream-text text-xl">Expected Delivery</div>
          <div>{order.delivery}</div>
        </div>
        {/* Totals */}
        <div className="absolute top-9 right-0 flex flex-col gap-2 avant cream-text text-md min-w-[460px] items-end pr-12">
          <div className="flex justify-between w-full">
            <span className="avantbold cream-text text-xl">Subtotal ( {order.items.reduce((a, b) => a + b.quantity, 0)} items )</span>
            <span className="avantbold cream-text text-xl">PHP {order.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="avantbold cream-text text-xl">Shipping</span>
            <span className="avantbold cream-text text-xl">PHP {order.shipping.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="w-full border-b border-[#fff7dc] my-2" />
          <div className="flex justify-between w-full avantbold cream-text text-xl">
            <span>Total</span>
            <span>PHP {order.total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="flex gap-2 self-end mt-2">
            <button className="avantbold rounded border border-[#FFF7DC] cream-text px-4 py-2 text-md cursor-pointer"
              onClick={openCancelModal}
            >
              CANCEL ORDER
            </button>
            <button className="avantbold cream-bg metallic-text px-4 py-2 rounded text-md cursor-pointer"
            onClick={() => navigate('/customer-care/track-order')}
            >
              TRACK ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ViewOrderMobile = ({ openCancelModal }) => {
  const navigate = useNavigate()
  return (
    <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mt-15 mb-2">
        <div
          className="avantbold cream-text text-sm cursor-pointer"
          onClick={() => navigate('/profile/inprogress')}
        >
          &larr; GO BACK
        </div>
        <div style={{ width: 40 }}></div>
      </div>
      <div className="bebas cream-text text-center text-3xl mt-2 mb-1">VIEW ORDER</div>
      <div className="avantbold cream-text text-lg text-center mb-1">ORDER ID : #{order.id}</div>
      <div className="avant cream-text text-center text-xs mb-4">THANK YOU. YOUR ORDER HAS BEEN RECEIVED.</div>
      {/* Items */}
      {order.items.map((item, idx) => (
        <div key={item.variant} className="flex gap-3 items-center py-3 border-b border-[#fff7dc]">
          <img src={item.image} alt={item.variant} className="w-20 h-20 object-cover rounded-md" />
          <div className="flex-1">
            <div className="avantbold cream-text text-sm leading-tight">
              {item.name}
              <br />
              <span className="avantbold cream-text text-xs">(Elegant Pendant Jewelry)</span>
            </div>
            <div className="bebas cream-text text-xs mt-1"style={{ color: '#959595' }}>{item.variant}</div>
            <div className="flex gap-2 mt-1 avant cream-text text-xs">
              <span className="w-[40px]">Size: <br/>-</span>
              <span className="w-[70px] text-nowrap">Price: <br/> PHP {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
              <span className="w-[40px] text-nowrap">Qty: <br/>{item.quantity}</span>
              <span className="w-[40px] text-nowrap">Subtotal: <br/>PHP {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
          </div>
        </div>
      ))}
      {/* Details Section */}
      <div className="flex flex-col gap-4 py-6">
        <div>
          <div className="avantbold cream-text text-md mb-1">Customer Details</div>
          <div className="avant cream-text text-xs">{order.customer.email}</div>
          <div className="avant cream-text text-xs">{order.customer.phone}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Shipping Address</div>
          <div className="avant cream-text text-xs">{order.customer.name}</div>
          <div className="avant cream-text text-xs" style={{ whiteSpace: 'pre-line' }}>{order.customer.address}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Order Date</div>
          <div className="avant cream-text text-xs">{order.date}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Expected Delivery</div>
          <div className="avant cream-text text-xs">{order.delivery}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Payment Method</div>
          <div className="avant cream-text text-xs">{order.customer.payment}</div>
        </div>
        <div className="flex flex-col items-end w-full max-w-[340px] pt-8">
          <div className="w-full flex justify-between items-center mb-4">
              <span className="avantbold cream-text text-md">Subtotal ( {order.items.reduce((a, b) => a + b.quantity, 0)} items )</span>
              <span className="avantbold cream-text text-md">PHP {order.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="w-full flex justify-between items-center mb-4">
              <span className="avantbold cream-text text-md">Shipping</span>
              <span className="avantbold cream-text text-md">PHP {order.shipping.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="w-full border-b border-[#fff7dc] my-2" />
          <div className="w-full flex justify-between items-center mb-6">
              <span className="avantbold cream-text text-md">Total</span>
              <span className="avantbold cream-text text-md">PHP {order.total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="flex gap-2 self-end mt-2">
            <button className="avantbold rounded border border-[#FFF7DC] cream-text px-3 py-2 text-xs" 
            onClick={openCancelModal}
            >
              CANCEL ORDER
            </button>
            <button className="avantbold cream-bg metallic-text px-3 py-2 rounded text-xs"
            onClick={() => navigate('/customer-care/track-order')}
            >
              TRACK ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const CancelOrderModal = ({ open, onClose, order, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('Ordered wrong item.');
  const reasons = [
    'Ordered wrong item.',
    'Ordered wrong size.',
    'Changed mind.',
    'Payment issue or error.',
    'Incorrect shipping information provided.',
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Desktop */}
      <div className="hidden md:flex bg-[#181818] rounded-2xl p-10 min-w-[700px] max-w-[90vw] gap-12 relative">
        {/* Close button */}
        <button
          className="absolute top-6 right-8 text-3xl cream-text cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Left: Products */}
        <div className="flex flex-col gap-6 min-w-[320px]">
          <div className="bebas cream-text text-2xl mb-2">REQUEST CANCELLATION</div>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <img src={item.image} alt={item.variant} className="w-22 h-22 object-cover rounded-md" />
              <div>
                <div className="avantbold cream-text text-lg leading-tight">
                  {item.name}
                  <br />
                  <span className="avantbold cream-text text-md">(Elegant Pendant Jewelry)</span>
                </div>
                <div className="bebas text-md mt-1" style={{color: '#959595'}}>{item.variant} - PHP {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                <div className="avant text-md" style={{color: '#959595'}}>Quantity: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Right: Reason & Actions */}
        <div className="flex flex-col justify-between min-w-[320px]">
          <div>
            <div className="bebas cream-text text-2xl mb-4">REASON</div>
            <div className="flex flex-col gap-3">
              {reasons.map((reason, idx) => (
                <label key={reason} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="form-radio accent-[#FFF7DC] w-5 h-5 mr-3"
                  />
                  <span className={`avantbold text-md ${selectedReason === reason ? 'cream-text' : 'text-[#959595]'}`}>{reason}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              className="avantbold px-8 py-3 rounded-lg text-md border border-[#FFF7DC] cream-text bg-transparent cursor-pointer"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              className="avantbold cream-bg metallic-text px-8 py-3 rounded-lg text-md cursor-pointer"
              onClick={() => onConfirm(selectedReason)}
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="md:hidden flex flex-col bg-[#181818] rounded-2xl p-6 w-[95vw] max-w-[400px] relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-6 text-2xl cream-text"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="bebas cream-text text-xl mb-4 items-start">REQUEST CANCELLATION</div>
        {/* Products */}
        <div className="flex flex-col gap-4 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <img src={item.image} alt={item.variant} className="w-17 h-17 object-cover rounded-md" />
              <div>
                <div className="avantbold cream-text text-xs leading-tight">
                  {item.name}
                  <br />
                  <span className="avantbold cream-text text-xs">(Elegant Pendant Jewelry)</span>
                </div>
                <div className="bebas text-xs mt-1" style={{color: '#959595'}}>{item.variant} - PHP {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                <div className="avant text-xs" style={{color: '#959595'}}>Quantity: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Reason */}
        <div>
          <div className="bebas cream-text text-lg mb-2">REASON</div>
          <div className="flex flex-col gap-2">
            {reasons.map((reason, idx) => (
              <label key={reason} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="cancel-reason-mobile"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="form-radio accent-[#FFF7DC] w-4 h-4 mr-2"
                />
                <span className={`avantbold text-xs ${selectedReason === reason ? 'cream-text' : 'text-[#959595]'}`}>{reason}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            className="avantbold px-4 py-2 rounded-lg text-xs border border-[#FFF7DC] cream-text bg-transparent cursor-pointer flex-1"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            className="avantbold cream-bg metallic-text px-4 py-2 rounded-lg text-xs cursor-pointer flex-1"
            onClick={() => onConfirm(selectedReason)}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewOrderInProgress = () => {
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <Layout full>
      <ViewOrderDesktop openCancelModal={() => setCancelOpen(true)} />
      <ViewOrderMobile openCancelModal={() => setCancelOpen(true)} />
      <CancelOrderModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        order={order}
        onConfirm={(reason) => {
          // handle confirm logic here
          setCancelOpen(false);
        }}
      />
    </Layout>
  );
}

export default ViewOrderInProgress