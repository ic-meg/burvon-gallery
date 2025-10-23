import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { 
    Friden, 
    Odyssey,
    AddImageCream,
    AddVideoCream,
    DropDown
} from '../../../assets/index.js';


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
  date: '03/01/2025',
  delivery: '03/07/2025',
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
};

function CustomDropdown({ label, options, value, onChange, placeholder, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside the box
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="w-full relative" ref={ref}>
      {label && <div className="bebas cream-text text-xl mb-1 block">{label}</div>}
      <button
        type="button"
        className={`w-full flex items-center justify-between bg-transparent border-1 border-[#FFF7DC] cursor-pointer cream-text text-left focus:outline-none ${className || ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={value ? "cream-text" : "cream-text opacity-70"}>
          {value || placeholder}
        </span>
        <img
          src={DropDown}
          alt="dropdown"
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-full z-10 bg-[#181818] border-1 border-[#FFF7DC] rounded-md shadow-lg">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-3 py-2 avant cream-text text-md cursor-pointer hover:bg-[#232323]"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ReturnRefundDesktop = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [reason, setReason] = useState('');
  const [solution, setSolution] = useState('');
  const [amount, setAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const navigate = useNavigate();

  const reasonOptions = [
    "Received Wrong Item",
    "Damaged Item",
    "Other"
  ];
  const solutionOptions = [
    "Refund",
    "Replace"
  ];

  return (
    <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0">
      <div className="flex items-center justify-between px-12 pt-30 pb-2">
        <button
          className="avantbold cream-text text-lg cursor-pointer relative z-50"
          onClick={() => navigate('/profile/delivered')}
        >
          &larr; GO BACK
        </button>
        <div style={{ width: 120 }}></div>
      </div>
      <div className="bebas cream-text text-center text-7xl mt-10 mb-8">REQUEST RETURN/REFUND</div>
      <div className="flex flex-row justify-between items-start px-12">
        {/* Products Table */}
        <div className="flex-1 max-w-[900px]">
          <div className="flex items-start justify-between mb-8">
            <div className="avantbold cream-text text-2xl">
              ORDER ID : #{order.id}
            </div>
          </div>
     
          <div className="flex avant cream-text text-xl border-b border-[#fff7dc] mt-20 mb-2">
            <div className="flex items-center" style={{ width: 40 }}></div>
            <div className="flex-1">Product/s</div>
            <div className="w-22 text-center">Size</div>
            <div className="w-32 text-center">Price</div>
            <div className="w-32 text-center">Quantity</div>
            <div className="w-32 text-center">Subtotal</div>
          </div>
          {order.items.map((item, idx) => (
            <div key={item.variant} className="flex items-center py-3 border-b border-[#fff7dc]">
              <div className="flex items-center justify-center" style={{ width: 40 }}>
                <label className="relative cursor-pointer flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedIdx === idx}
                    onChange={() => setSelectedIdx(idx)}
                    className="peer sr-only"
                  />
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center border-2 border-[#FFF7DC] transition ${selectedIdx === idx ? "bg-[#FFF7DC]" : "bg-transparent"}`}>
                    {selectedIdx === idx && (
                      <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#181818]">
                        <polyline
                          points="5 10 9 14 15 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </div>
              <div className="flex-1 flex gap-3 items-center">
                <img src={item.image} alt={item.variant} className="w-30 h-30 object-cover rounded-md" />
                <div>
                  <div className="avantbold cream-text text-lg text-nowrap leading-tight">
                    {item.name}
                    <span className="text-sm"><br/>(Elegant Pendant Jewelry)</span>
                  </div>
                  <div className="bebas cream-text text-md" style={{ color: '#959595' }}>{item.variant}</div>
                </div>
              </div>
              <div className="w-22 text-center avantbold">-</div>
              <div className="w-32 text-center avantbold text-nowrap">₱ {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
              <div className="w-32 text-center avantbold">{item.quantity}</div>
              <div className="w-32 text-center avantbold">₱ {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            </div>
          ))}
        </div>
       
        {/* Form Section */}
        <div className="w-full max-w-[520px] flex flex-col gap-6 mt-28 ml-auto">
          <div className="flex flex-col items-end mt-[-7rem] mb-6">
            <div className="avant cream-text text-md">
              Order Date:&nbsp;
              <span>{order.date}</span>
            </div>
            <div className="avant cream-text text-md mt-1">
              Delivered Date:&nbsp;
              <span>{order.delivery}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <CustomDropdown
              label="REASON"
              options={reasonOptions}
              value={reason}
              onChange={setReason}
              placeholder="Select Reason"
              className="text-base avant px-4 py-3 rounded-lg md:text-lg md:px-4 md:py-3"
            />
            <CustomDropdown
              label="SOLUTION"
              options={solutionOptions}
              value={solution}
              onChange={setSolution}
              placeholder="Select a Solution"
              className="text-base avant px-4 py-3 rounded-lg md:text-lg md:px-4 md:py-3"
            />
          </div>
          <div>
            <label className="bebas cream-text text-xl mb-2 block">AMOUNT</label>
            <input className="w-full rounded-lg px-4 py-3 bg-transparent border-2 border-[#FFF7DC] cream-text" placeholder="Refund Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <div className="flex justify-between mt-2">
              <div className="avant cream-text text-sm">Refund to: <span className="avantbold">GCash</span></div>
              <div className="avant cream-text text-sm">Actual Amount: <span className="avantbold">₱ {order.items[selectedIdx].price.toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-6 items-start">
            <textarea
              className="w-full rounded-lg px-4 py-3 bg-transparent border-2 border-[#FFF7DC] cream-text"
              value={refundReason}
              onChange={e => setRefundReason(e.target.value)}
              placeholder="Return/ Refund Reason (optional)"
              rows={4}
            />
            <div className="grid grid-cols-3 grid-rows-2 gap-3 ">
              <button className="border-2 border-dashed border-[#FFF7DC] rounded-lg w-14 h-14 flex items-center cursor-pointer justify-center">
                <img src={AddImageCream} alt="AddImage" className="w-7 h-7" />
              </button>
              <button className="border-2 border-dashed border-[#FFF7DC] rounded-lg w-14 h-14 flex items-center cursor-pointer justify-center">
                <img src={AddVideoCream} alt="AddVideo" className="w-7 h-7" />
              </button>
              <button className="border-2 border-dashed border-[#FFF7DC] rounded-lg w-14 h-14 flex items-center cursor-pointer justify-center">
                <img src={AddImageCream} alt="AddImage" className="w-7 h-7" />
              </button>
              <button className="border-2 border-dashed border-[#FFF7DC] rounded-lg w-14 h-14 flex items-center cursor-pointer justify-center">
                <img src={AddVideoCream} alt="AddVideo" className="w-7 h-7" />
              </button>
              <button className="border-2 border-dashed border-[#FFF7DC] rounded-lg w-14 h-14 flex items-center cursor-pointer justify-center">
                <span className="text-3xl cream-text">+</span>
              </button>
              <div></div>
            </div>
          </div>
          <div className="flex gap-3 mt-8 mb-8 justify-end">
            <button className="avantbold px-5 py-2 rounded-lg text-md border-2 border-[#FFF7DC] cream-text bg-transparent cursor-pointer" onClick={() => navigate(-1)}>CANCEL</button>
            <button className="avantbold cream-bg metallic-text px-5 py-3 rounded-lg text-md cursor-pointer">SUBMIT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReturnRefundMobile = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [reason, setReason] = useState('');
  const [solution, setSolution] = useState('');
  const [amount, setAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const navigate = useNavigate();

  return (
    <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4">
      <div className="flex items-center justify-between mt-20 mb-7">
        <div
          className="avantbold cream-text text-sm cursor-pointer"
          onClick={() => navigate('/profile/delivered')}
        >
          &larr; GO BACK
        </div>
        <div style={{ width: 40 }}></div>
      </div>
      <div className="bebas cream-text text-center text-4xl mt-2 mb-4">REQUEST RETURN/REFUND</div>
      {/* Grouped order info block for mobile */}
      <div className="flex flex-col gap-2 mb-2">
        <span className="avantbold cream-text text-md">ORDER ID : #{order.id}</span>
        <div>
          <span className="avant cream-text text-sm">Order Date: {order.date}</span> 
          <span className="avant cream-text text-sm"><br/>Delivered Date: {order.delivery}</span>
        </div>
      </div>
      {order.items.map((item, idx) => (
        <div key={item.variant} className="flex gap-2 items-start py-3 border-b border-[#fff7dc]">
          {/* Custom cream checkbox */}
          <label className="relative cursor-pointer flex items-center justify-center mt-6">
            <input
              type="checkbox"
              checked={selectedIdx === idx}
              onChange={() => setSelectedIdx(idx)}
              className="peer sr-only"
            />
            <span className={`w-4 h-4 rounded-sm flex items-center justify-center border-1 border-[#FFF7DC] transition ${selectedIdx === idx ? "bg-[#FFF7DC]" : "bg-transparent"}`}>
              {selectedIdx === idx && (
                <svg width="16" height="16" viewBox="0 0 20 20" className="text-[#181818]">
                  <polyline
                    points="5 10 9 14 15 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </label>
          <img src={item.image} alt={item.variant} className="w-16 h-16 object-cover rounded-md" />
          <div className="flex-1 flex flex-col">
            <div className="avantbold cream-text text-sm leading-tight">{item.name}</div>
            <div className="avantbold text-xs">(Elegant Pendant Jewelry)</div>
            <div className="bebas text-xs mb-1" style={{ color: '#959595' }}>{item.variant}</div>
            {/* Info row */}
            <div className="flex flex-row justify-between avant cream-text text-xs w-full mt-1">
              <div className="w-1/4 text-left">Size<br/><span className="avantbold">-</span></div>
              <div className="w-23 text-left">Price<br/><span className="avantbold">₱ {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
              <div className="w-1/4 text-left">Qty<br/><span className="avantbold">{item.quantity}</span></div>
              <div className="w-23 text-left">Subtotal<br/><span className="avantbold">₱ {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-4 mt-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="bebas cream-text text-md mb-1 block">REASON</label>
            <CustomDropdown
              label=""
              options={["Received Wrong Item", "Damaged Item", "Other"]}
              value={reason}
              onChange={setReason}
              placeholder="Select Reason"
              className="text-xs avant px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="bebas cream-text text-md mb-1 block">SOLUTION</label>
            <CustomDropdown
              label=""
              options={["Refund", "Replace"]}
              value={solution}
              onChange={setSolution}
              placeholder="Select a Solution"
              className="text-xs avant px-3 py-2 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="bebas cream-text text-md mb-1 block">AMOUNT</label>
          <input
            className="w-full avant rounded-md px-4 py-3 bg-transparent border-1 border-[#FFF7DC] cream-text text-xs"
            placeholder="Refund Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <div className="avant cream-text text-xs">Refund to: <span className="avantbold">GCash</span></div>
            <div className="avant cream-text text-xs">Actual Amount: <span className="avantbold">₱ {order.items[selectedIdx].price.toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
          <textarea
            className="w-full avant rounded-md px-4 py-3 bg-transparent border-1 border-[#FFF7DC] cream-text text-xs"
            value={refundReason}
            onChange={e => setRefundReason(e.target.value)}
            placeholder="Return/ Refund Reason (optional)"
            rows={4}
          />
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <button className="border-1 border-dashed border-[#FFF7DC] rounded-lg w-10 h-10 flex items-center justify-center">
              <img src={AddImageCream} alt="AddImage" className="w-5 h-5" />
            </button>

            <button className="border-1 border-dashed border-[#FFF7DC] rounded-lg w-10 h-10 flex items-center justify-center">
              <img src={AddVideoCream} alt="AddVideo" className="w-5 h-5" />
            </button>
            <button className="border-1 border-dashed border-[#FFF7DC] rounded-lg w-10 h-10 flex items-center justify-center">
              <img src={AddImageCream} alt="AddImage" className="w-5 h-5" />
            </button>
            <button className="border-1 border-dashed border-[#FFF7DC] rounded-lg w-10 h-10 flex items-center justify-center">
              <img src={AddVideoCream} alt="AddVideo" className="w-5 h-5" />
            </button>
            <button className="border-1 border-dashed border-[#FFF7DC] rounded-lg w-10 h-10 flex items-center justify-center">
              <span className="text-xl cream-text">+</span>
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-6 mb-2 justify-end">
          <button className="avantbold px-5 py-2 rounded-lg text-xs border-1 border-[#FFF7DC] cream-text bg-transparent" onClick={() => navigate(-1)}>CANCEL</button>
          <button className="avantbold cream-bg metallic-text px-5 py-2 rounded-lg text-xs">SUBMIT</button>
        </div>
      </div>
    </div>
  );
};

const RequestReturn = () => (
  <Layout full>
    <ReturnRefundDesktop />
    <ReturnRefundMobile />
  </Layout>
);

export default RequestReturn;