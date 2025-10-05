import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminHeader from '../../components/admin/AdminHeader'

// Import images from necklaces page
import {
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  NextIcon,
  PrevIcon,
  DropDownIcon,
  DropUpIcon,
  PesoSign,
  ReturnCustomers,
  TopSelling,
  Revenue,
  IncreaseIcon,
  DecreaseIcon,
} from '../../assets/index.js'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [collectionValue, setCollectionValue] = useState('none')
  const [categoryValue, setCategoryValue] = useState('none')

  // Dropdown options
  const collectionOptions = [
    { label: 'Select a Collection...', value: 'none' },
    { label: 'Love Language Collection', value: 'love-language' },
    { label: 'Clash Collection', value: 'clash' },
    { label: 'The Rebellion Collection', value: 'rebellion' },
  ]

  const categoryOptions = [
    { label: 'Select a Category...', value: 'none' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Earrings', value: 'earrings' },
    { label: 'Bracelets', value: 'bracelets' },
    { label: 'Rings', value: 'rings' },
  ]

  // Custom Dropdown Component (copied from necklaces page)
  const CustomDropdown = ({ options, value, onChange, placeholder = "Select...", isOpen, onToggle }) => {
    return (
      <div className="custom-dropdown relative w-full">
        <button
          type="button"
          onClick={onToggle}
          className="avant w-full bg-transparent border border-[#FFF7DC]/70 text-[#FFF7DC] px-4 py-2 rounded-md flex justify-between items-center focus:outline-none focus:border-[#FFF7DC]"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {value && value !== 'none' ? options.find(o => o.value === value)?.label : placeholder}
          <img 
            src={isOpen ? DropUpIcon : DropDownIcon} 
            alt="dropdown arrow" 
            className="w-4 h-4 opacity-80 pointer-events-none" 
          />
        </button>
        {isOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="avant absolute top-full left-0 w-full bg-[#181818] border border-[#FFF7DC] rounded-md mt-2 shadow-lg max-h-60 overflow-auto z-50"
          >
            {options.map(option => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value)
                  onToggle()
                }}
                tabIndex={0}
                className={`px-4 py-2 cursor-pointer select-none hover:bg-[#232323] ${
                  value === option.value ? 'bg-[#232323]' : ''
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  // Product data for Rebels' Top Picks
  const topPicks = [
    {
      id: 1,
      name: "LYRIC",
      collection: "LOVE LANGUAGE COLLECTION",
      oldPrice: "₱790.00",
      price: "₱711.00",
      image: LyricImage,
    },
    {
      id: 2,
      name: "AGATHA",
      collection: "CLASH COLLECTION",
      oldPrice: "₱790.00",
      price: "₱711.00",
      image: AgathaImage,
    },
    {
      id: 3,
      name: "RIOM",
      collection: "THE REBELLION COLLECTION",
      oldPrice: "₱790.00",
      price: "₱711.00",
      image: RiomImage,
    },
    {
      id: 4,
      name: "CELINE",
      collection: "THE REBELLION COLLECTION",
      oldPrice: "₱790.00",
      price: "₱711.00",
      image: CelineImage,
    },
    {
      id: 5,
      name: "LYRIC",
      collection: "LOVE LANGUAGE COLLECTION",
      oldPrice: "₱790.00",
      price: "₱711.00",
      image: LyricImage,
    },
  ]

  const maxVisible = 4
  const canPrev = carouselIndex > 0
  const canNext = carouselIndex < topPicks.length - maxVisible

  const handlePrev = () => {
    if (canPrev) setCarouselIndex(carouselIndex - 1)
  }

  const handleNext = () => {
    if (canNext) setCarouselIndex(carouselIndex + 1)
  }

  const handleToDoClick = (item) => {
    switch(item) {
      case 'pending-orders':
        navigate('/admin/orders')
        break
      case 'low-stock':
        navigate('/admin/inventory')
        break
      case 'returns':
        navigate('/admin/returns')
        break
      case 'cancellations':
        navigate('/admin/cancellations')
        break
      case 'feedback':
        navigate('/admin/feedback')
        break
      default:
        break
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      
      {/* Dashboard Header */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl bebas text-black mb-8">
            DASHBOARD
          </h1>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Section with To-Do List and Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* To-Do List */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-[#000000] rounded-lg p-6 h-full">
                <h2 className="text-3xl avantbold text-black mb-2">To-Do List</h2>
                
                <div className="space-y-1">
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleToDoClick('pending-orders')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#000000] avant text-xl">Pending Orders</span>
                      <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                    </div>
                    <span className="text-[#000000] text-3xl avantbold">3</span>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleToDoClick('low-stock')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#000000] avant text-xl">Low Stock Items</span>
                      <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                    </div>
                    <span className="text-[#000000] text-3xl avantbold">3</span>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleToDoClick('returns')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#000000] avant text-xl">Return/Refund Request</span>
                      <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                    </div>
                    <span className="text-[#000000] text-3xl avantbold">3</span>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleToDoClick('cancellations')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#000000] avant text-xl">Cancellation Request</span>
                      <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                    </div>
                    <span className="text-[#000000] text-3xl avantbold">3</span>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleToDoClick('feedback')}
                  >
                    <span className="text-[#000000] avant text-xl">Review Customer Feedback</span>
                  </div>
                </div>
              </div>
            </div>
            
{/* Stats Cards - with icons and border lines */}
<div className="lg:col-span-2">
  <div className="grid grid-cols-2 gap-4">

    {/* Sales Summary */}
    <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000]">
      <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
        <img src={PesoSign} alt="Sales Summary" className="w-8 h-8" />
      </div>
      <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
        SALES SUMMARY (TODAY)
      </div>
      <div className="text-2xl avantbold text-black -mb-1">₱10293</div>
      <div className="text-sm avant text-black mb-2">10 Orders</div>
      <div className="text-green-500 text-sm flex items-center gap-1">
        <img src={IncreaseIcon} alt="Increase" className="w-4 h-4" />
        <span className='avant'>2.5% Up from past week</span>
      </div>
    </div>

    {/* Returning Customers */}
    <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000]">
      <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
        <img src={ReturnCustomers} alt="Returning Customers" className="w-8 h-8" />
      </div>
      <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
        RETURNING CUSTOMERS
      </div>
      <div className="text-2xl avantbold text-black -mb-1">124</div>
      <div className="text-sm avant text-black mb-2">This Month</div>
      <div className="text-green-500 text-sm flex items-center gap-1">
        <img src={IncreaseIcon} alt="Increase" className="w-4 h-4" />
        <span className='avant'>1.3% Up from past week</span>
      </div>
    </div>

    {/* Top Selling Products */}
    <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000]">
      <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
        <img src={TopSelling} alt="Top Selling" className="w-8 h-8" />
      </div>
      <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
        TOP SELLING PRODUCTS
      </div>
      <div className="text-xl avantbold text-black">Lyric</div>
      <div className="text-sm avant text-black mb-1">10 sold</div>
      <div className="text-xl avantbold text-black">Agatha</div>
      <div className="text-sm avant text-black mb-1">8 sold</div>
      <div className="text-xl avantbold text-black">Pearl</div>
      <div className="text-sm avant text-black mb-2">5 sold</div>
      <div className="text-green-500 text-sm flex items-center gap-1">
        <img src={IncreaseIcon} alt="Increase" className="w-4 h-4" />
        <span className='avant'>5.5% Up from past week</span>
      </div>
    </div>

    {/* Revenue Trends */}
    <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000]">
      <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
        <img src={Revenue} alt="Revenue" className="w-8 h-8" />
      </div>
      <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
        REVENUE TRENDS
      </div>
      <div className="text-2xl avantbold text-black -mb-1">₱10293</div>
      <div className="text-sm avant text-black mb-2">Only Sales this Week</div>
      <div className="text-red-500 text-sm flex items-center gap-1">
        <img src={DecreaseIcon} alt="Decrease" className="w-4 h-4" />
        <span className='avant'>4.3% Down from yesterday</span>
      </div>
    </div>
</div>
  </div>
</div>

          
          {/* Rebels' Top Picks Section */}
          <div className="bg-[#1f1f21] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold text-[#FFF7DC] bebas tracking-wide">REBELS' TOP PICKS</h2>
              <div className="flex gap-4">
                <div className="flex flex-col w-65 text-[#FFF7DC]">
                  <CustomDropdown
                    options={collectionOptions}
                    value={collectionValue}
                    onChange={setCollectionValue}
                    placeholder="Select a Collection..."
                    isOpen={openDropdown === 'collection'}
                    onToggle={() => setOpenDropdown(openDropdown === 'collection' ? null : 'collection')}
                  />
                </div>
                <div className="flex flex-col w-56 text-[#FFF7DC]">
                  <CustomDropdown
                    options={categoryOptions}
                    value={categoryValue}
                    onChange={setCategoryValue}
                    placeholder="Select a Category..."
                    isOpen={openDropdown === 'category'}
                    onToggle={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  />
                </div>
              </div>
            </div>
            
            {/* Cards Container with Navigation */}
            <div className="flex items-center justify-center gap-2 relative">
              {/* Prev Button - left of cards */}
              <button
                onClick={handlePrev}
                disabled={!canPrev}
                className={`flex items-center justify-center cursor-pointer hover:opacity-70 transition select-none ${
                  !canPrev ? "opacity-30 cursor-not-allowed" : ""
                }`}
                style={{ minWidth: '56px' }}
              >
                <img
                  src={PrevIcon}
                  alt="Previous"
                  className="w-8 h-8"
                  draggable={false}
                />
              </button>

              {/* Cards Grid - 4 cards per display */}
              <div className="grid grid-cols-4 gap-4 w-full">
                {topPicks.slice(carouselIndex, carouselIndex + maxVisible).map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-[#222] overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-[250px] flex items-center justify-center overflow-hidden bg-black">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full rounded-none transition-transform duration-300 hover:scale-110"
                        draggable={false}
                      />
                    </div>
                    
                    {/* Card Info */}
                    <div
                      style={{
                        background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
                      }}
                      className="py-2 px-2 text-center flex flex-col items-center rounded-none"
                    >
                      <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                        {item.name}
                      </span>
                      <span className="text-[11px] tracking-widest text-[#FFF7DC] avant">
                        {item.collection}
                      </span>
                      <div className="flex justify-center items-center gap-2 text-[12px] avantbold mt-1">
                        <span className="line-through text-[#FFF7DC] opacity-50">
                          {item.oldPrice}
                        </span>
                        <span className="text-[#FFF7DC]">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Button - right of cards */}
              <button
                onClick={handleNext}
                disabled={!canNext}
                className={`flex items-center justify-center cursor-pointer hover:opacity-70 transition select-none ${
                  !canNext ? "opacity-30 cursor-not-allowed" : ""
                }`}
                style={{ minWidth: '56px' }}
              >
                <img
                  src={NextIcon}
                  alt="Next"
                  className="w-8 h-8"
                  draggable={false}
                />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
