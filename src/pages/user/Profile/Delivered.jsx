import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { 
  Friden, 
  Odyssey, 
  editIcon, 
  DropDown,
  AddImageCream, 
  AddVideoCream 
} from '../../../assets/index.js'

const ordersByTab = {
  'TO SHIP': [],
  'TO RECEIVED': [],
  'DELIVERED': [
    {
      id: '38940123',
      items: [
        {
          name: 'Clash Collection Necklaces',
          variant: 'ODYSSEY',
          price: 580,
          oldPrice: 590,
          quantity: 1,
          size: 'N/A',
          image: Odyssey,
        },
        {
          name: 'Clash Collection Necklaces',
          variant: 'FRIDEN',
          price: 580,
          oldPrice: 590,
          quantity: 1,
          size: 'N/A',
          image: Friden,
        },
      ],
      date: 'Sep 26',
      delivery: 'Sep 27',
      totalQty: 3,
      subtotal: 1770,
    },
  ],
  'RETURN/REFUND': [],
  'CANCELLED': [],
}

const tabs = [
  'TO SHIP',
  'TO RECEIVED',
  'DELIVERED',
  'RETURN/REFUND',
  'CANCELLED',
]

const tabRoutes = {
  'TO SHIP': '/profile/inprogress',
  'TO RECEIVED': '/profile/inprogress',
  'DELIVERED': '/profile/delivered',
  'RETURN/REFUND': '/profile/refund',
  'CANCELLED': '/profile/cancelled',
}

// edit profile modal
const EditProfileModal = ({ open, onClose }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('gilcalais@gmail.com')

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] rounded-2xl p-8 min-w-[320px] max-w-[90vw] flex flex-col gap-6"
        style={{ boxShadow: '0 0 32px #000' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bebas cream-text text-2xl mb-2">MY PROFILE</div>
        <div>
          <label className="bebas cream-text text-md mb-1 block">NAME:</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-transparent border-1 border-[#FFF7DC] avant cream-text text-md mb-4"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="bebas cream-text text-md mb-1 block">EMAIL:</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg bg-transparent border-1 border-[#FFF7DC] avant cream-text text-md mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-1">
          <button
            className="avantbold px-5 py-2 rounded-lg text-md border-1 border-[#FFF7DC] cream-text bg-transparent cursor-pointer"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            className="avantbold cream-bg metallic-text px-8 py-2 rounded-lg text-md cursor-pointer"
            onClick={onClose}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  )
}

// Rate Product modal
const RateProductModal = ({ open, onClose, products }) => {
  const [rating, setRating] = useState(4)
  const [review, setReview] = useState('')
  const [showUsername, setShowUsername] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#181818] rounded-2xl p-8 min-w-[700px] max-w-[95vw] flex flex-col gap-6"
        style={{ boxShadow: '0 0 32px #000' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="bebas cream-text text-2xl">RATE PRODUCT</div>
          <div>
            <span className="avantbold cream-text text-md mr-2">YOUR RATING:</span>
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={`text-2xl cursor-pointer ${star <= rating ? 'cream-text' : 'text-[#959595]'}`}
                onClick={() => setRating(star)}
              >★</span>
            ))}
            <span className="avantbold cream-text ml-2 italic">{['Poor','Fair','Good','Great','Excellent'][rating-1]}</span>
          </div>
        </div>
        <div className="flex gap-8">
          {/* Product List */}
          <div className="flex flex-col gap-6">
            {products.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <img src={item.image} alt={item.variant} className="w-32 h-32 object-cover rounded-md" />
                <div>
                  <div className="avantbold cream-text text-lg leading-tight">{item.name} <span className="text-sm"><br/>(Elegant Pendant Jewelry)</span></div>
                  <div className="bebas cream-text text-md mt-1" style={{ color: '#959595' }}>{item.variant}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Rating & Review */}
          <div className="flex-1 flex flex-col gap-4">
            
            <textarea
              className="w-full h-24 rounded-lg bg-transparent border-2 border-[#FFF7DC] avant cream-text text-md p-3"
              placeholder="Share your experience (optional)"
              value={review}
              onChange={e => setReview(e.target.value)}
            />
            <div className="flex gap-4">
              <button className="w-16 h-16 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center">
                <img src={AddImageCream} alt="Add Image" className="w-8 h-8" />
              </button>
              <button className="w-16 h-16 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center">
                <img src={AddVideoCream} alt="Add Video" className="w-8 h-8" />
              </button>
              <button className="w-16 h-16 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center ">
                <span className="text-3xl cream-text">+</span>
              </button>
            </div>
            <label className="flex items-center gap-2 mt-2 avant cream-text text-md cursor-pointer">
              <input
                type="checkbox"
                checked={showUsername}
                onChange={e => setShowUsername(e.target.checked)}
                className="accent-[#FFF7DC] w-4 h-4"
              />
              Show username
            </label>
            <div className="flex gap-4 mt-4">
              <button
                className="avantbold px-8 py-3 rounded-lg text-md border-2 border-[#FFF7DC] cream-text bg-transparent" style={{ cursor: 'pointer' }}
                onClick={onClose}
              >
                CANCEL
              </button>
              <button
                className="avantbold cream-bg metallic-text px-8 py-3 rounded-lg text-md" style={{ cursor: 'pointer' }}
                onClick={() => {/* handle confirm */}}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rate Product modal - Mobile
const RateProductModalMobile = ({ open, onClose, products }) => {
  const [rating, setRating] = useState(4)
  const [review, setReview] = useState('')
  const [showUsername, setShowUsername] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#181818] rounded-2xl p-4 w-[95vw] max-w-[420px] flex flex-col gap-4"
        style={{ boxShadow: '0 0 32px #000' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="bebas cream-text text-xl">RATE PRODUCT</div>
          <button className="text-2xl cream-text" onClick={onClose}>&times;</button>
        </div>
        {/* Product List */}
        <div className="flex flex-col gap-3">
          {products.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <img src={item.image} alt={item.variant} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <div className="avantbold cream-text text-sm leading-tight">{item.name}</div>
                <div className="bebas text-xs" style={{ color: '#959595' }}>{item.variant}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Rating */}
        <div className="flex items-center justify-between mt-2">
          <span className="avantbold cream-text text-sm">YOUR RATING:</span>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={`text-xl cursor-pointer ${star <= rating ? 'cream-text' : 'text-[#959595]'}`}
                onClick={() => setRating(star)}
              >★</span>
            ))}
            <span className="avantbold cream-text ml-1 text-xs italic">{['Poor','Fair','Good','Great','Excellent'][rating-1]}</span>
          </div>
        </div>
        {/* Review */}
        <textarea
          className="w-full h-16 rounded-lg bg-transparent border-2 border-[#FFF7DC] avant cream-text text-sm p-2 mt-2"
          placeholder="Share your experience (optional)"
          value={review}
          onChange={e => setReview(e.target.value)}
        />
        {/* Upload buttons */}
        <div className="flex gap-2 mt-2">
          <button className="w-12 h-12 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center">
            <img src={AddImageCream} alt="Add Image" className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center">
            <img src={AddVideoCream} alt="Add Video" className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center">
            <span className="text-2xl cream-text">+</span>
          </button>
        </div>
        {/* Show username */}
        <label className="flex items-center gap-2 mt-2 avant cream-text text-sm">
          <input
            type="checkbox"
            checked={showUsername}
            onChange={e => setShowUsername(e.target.checked)}
            className="accent-[#FFF7DC] w-4 h-4"
          />
          Show username
        </label>
        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            className="avantbold px-4 py-2 rounded-lg text-sm border-2 border-[#FFF7DC] cream-text bg-transparent flex-1"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            className="avantbold cream-bg metallic-text px-4 py-2 rounded-lg text-sm flex-1"
            onClick={() => {/* handle confirm */}}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  )
}

// Desktop Layout
const ProfileDesktop = ({ openModal, onEditProfile, openRateModal }) => {
  const [activeTab, setActiveTab] = useState('DELIVERED') 
  const orders = ordersByTab[activeTab] || []
  const selectedOrder = orders[0]
  const navigate = useNavigate(); // Add this at the top of your component if not present

  return (
    <div className="hidden md:block min-h-screen bg-[#181818] px-0 py-34 text-[#fff7dc]">
      <div className="bebas cream-text text-center text-7xl mt-10 mb-2">HI, REBELS!</div>
      {/* Header row */}
      <div className="flex items-center justify-between px-12 pt-12 pb-2">
        <div className="bebas cream-text text-2xl tracking-wide">
          SHOPPING HISTORY / <span className="font-bold">{activeTab}</span>
        </div>
        <button className="avant cream-text text-md flex items-center gap-1 cursor-pointer" onClick={onEditProfile}>
          <span>Edit Profile</span>
          <img src={editIcon} alt="Edit" className="w-5 h-5" /> {/* edit icon image */}
        </button>
      </div>
      {/* Cream horizontal line */}
      <div className="w-full px-12">
        <div className="h-[4px] bg-[#FFF7DC] w-full" />
      </div>
      <div className="flex flex-row gap-0 px-12 pt-8">
        {/* Sidebar "To Ship, To Received..." */}
        <div className="relative flex flex-col avantbold cream-text text-xl gap-3 min-w-[140px] pt-2 mr-8 cursor-pointer">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`text-left pl-2 py-2 w-full transition-all ${activeTab === tab ? 'font-bold' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ height: '48px' }}
            >
              {tab}
            </button>
          ))}
          {/* Vertical Divider */}
          <div className="absolute top-0 right-[-18px] h-full flex flex-col items-center" style={{ width: '32px' }}>
            {/* Cream highlight box - moves with active tab */}
            <div
              className="bg-[#FFF7DC] w-2 h-8 transition-all duration-300"
              style={{
                position: 'absolute',
                left: '50px',
                top: `${tabs.indexOf(activeTab) * 65}px`,
                zIndex: 2,
              }}
            />
            {/* Vertical line */}
            <div
              className="bg-[#FFF7DC] w-[3px]"
              style={{
                position: 'absolute',
                left: '55px',
                top: '0px',
                height: '100%',
                zIndex: 1,
              }}
            />
          </div>
        </div>
        {/* between product content */}
        <div className="flex-shrink-0" style={{ width: '60px' }}></div>
        {/* Orders and Details */}
        <div className="flex flex-col flex-1 gap-6">
          {selectedOrder ? (
            <>
              {/* ORDER ID */}
              <div className="avantbold cream-text text-2xl mb-2 font-bold">ORDER ID : #{selectedOrder.id}</div>
              {selectedOrder.items.map((item, idx) => (
                <div key={item.variant} className="flex items-center justify-between rounded-lg px-0 py-2 w-full">
                  {/* Image and product info */}
                  <div className="flex items-center gap-4 min-w-[320px]">
                    <img
                      src={item.image}
                      alt={item.variant}
                      className="w-25 h-25 object-cover rounded-md cursor-pointer"
                      onClick={() => openModal(item.image)}
                    />
                    <div>
                      <div className="avantbold cream-text text-lg text-nowrap">{item.name}</div> {/* product name */}
                      <div className="bebas cream-text text-lg">{item.variant}</div> {/* product type "odyssey" */}
                      <div className="flex gap-2 items-center mt-1">
                        <span
                          className="avant text-md line-through"
                          style={{ color: '#959595' }}
                        >
                          ₱ {item.oldPrice}.00
                        </span> {/* nakacrossed out na price */}
                        <span className="avantbold cream-text text-lg">₱ {item.price}.00</span> {/* price */}
                      </div>
                      <div className="avantbold cream-text text-md mt-1" style={{ color: '#959595' }}>QUANTITY: {item.quantity} &nbsp; SIZE: {item.size}
                      
                      </div>
                    </div>
                  </div>
                  {/* Order details and actions */}
                  {idx === 0 && (
                    <div className="flex flex-row items-center justify-between w-full ml-8">
                      <div className="flex flex-col gap-1 ml-45 mr-12">
                        <div className="flex gap-20"> {/* gap between order date and expected delivery */}
                          <div>
                            <div className="bebas cream-text text-md">ORDER DATE:</div>
                            <div className="avant cream-text text-lg">{selectedOrder.date}</div>
                          </div>
                          <div>
                            <div className="bebas cream-text text-md">EXPECTED DELIVERY:</div>
                            <div className="avant cream-text text-lg">{selectedOrder.delivery}</div>
                          </div>
                        </div>
                        <div className="flex gap-14 mt-2"> {/* gap between total quantity and subtotal */}
                          <div>
                            <div className="bebas cream-text text-md">TOTAL QUANTITY:</div>
                            <div className="avant cream-text text-lg">{selectedOrder.totalQty}</div>
                          </div>
                          <div>
                            <div className="bebas cream-text text-md">SUBTOTAL:</div>
                            <div className="avant cream-text text-lg">₱ {selectedOrder.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-17">
                        <button
                          className="avantbold rounded border border-[#FFF7DC] cream-text px-4 py-2 cursor-pointer"
                          onClick={() => navigate('/profile/requestreturn')}
                        >
                          RETURN/REFUND
                        </button>
                        <button className="avantbold cream-bg metallic-text px-4 py-2 rounded border border-[#FFF7DC] cursor-pointer" onClick={openRateModal}>
                          RATE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="avant cream-text text-lg mt-12">No orders in this category.</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mobile Layout 
const ProfileMobile = ({ openModal, onEditProfile, openRateModal }) => {
  const [showSubtotal, setShowSubtotal] = useState(false)
  const [activeTab, setActiveTab] = useState('DELIVERED') 
  const orders = ordersByTab[activeTab] || []
  const selectedOrder = orders[0]
  const navigate = useNavigate() 

  return (
    <div className="md:hidden w-full min-h-screen px-4 pt-2 text-[#fff7dc] relative">
      <div className="bebas cream-text text-5xl mt-20 mb-2">
        HI, REBELS!
        <button className="avant text-xs cream-text ml-2 align-middle" onClick={onEditProfile}>
          <span>Edit Profile</span>
          <img src={editIcon} alt="Edit" className="w-4 h-4 inline-block ml-1" /> {/* edit icon image */}
        </button>
      </div>
      <div className="bebas cream-text text-center text-2xl mt-9 mb-4">SHOPPING HISTORY</div>
      <div className="w-full px-2 relative mb-2">
        {/* Long horizontal line */}
        <div className="absolute left-0 right-0 top-1/2 translate-y-3 h-[2px] bg-[#FFF7DC] w-full z-0" />
        {/* Tabs */}
        <div className="flex flex-row overflow-x-auto scrollbar-hide gap-6 pb-2 relative z-10">
          {tabs.map(tab => (
            <div
              key={tab}
              className={`avantbold cream-text text-xs min-w-max px-2 py-1 whitespace-nowrap cursor-pointer flex flex-col items-center`}
              style={{ position: 'relative' }}
              onClick={() => {
                setActiveTab(tab)
                navigate(tabRoutes[tab])
              }}
            >
              <span>{tab}</span>
              {tab === activeTab && (
                <span
                  className="block absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-10 h-[4px] bg-[#FFF7DC]"
                  style={{ zIndex: 2 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Order Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="avantbold cream-text text-xs">ORDER ID : #38940123</span>
          <span className="avantbold cream-text text-xs">EXPECTED DELIVERY: Sep 27</span>
        </div>
        <div className="flex gap-4 items-start rounded-lg p-2">
          <img
            src={Odyssey}
            alt="Odyssey"
            className="w-32 h-32 object-cover rounded-md cursor-pointer"
            onClick={() => openModal(Odyssey)}
          />
          <div className="flex-1">
            <div className="avantbold cream-text text-sm text-nowrap leading-tight">Clash Collection Necklaces<br /><span className="text-xs">(Elegant Pendant Jewelry)</span></div>
            <div className="bebas cream-text text-sm mt-1">ODYSSEY</div>
            <div className="flex gap-6 mt-1">
              <span className="avantbold text-sm" style={{ color: '#959595' }}>QUANTITY: 1</span>
              <span className="avantbold text-sm" style={{ color: '#959595' }}>SIZE: N/A</span>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <span className="avant text-sm line-through" style={{ color: '#959595' }}>₱ 590.00</span>
              <span className="avantbold cream-text text-sm">₱ 580.00</span>
            </div>
            {/* View More button */}
            <button
              className="avantbold cream-text text-sm mt-2 flex items-center gap-2 focus:outline-none"
              onClick={() => setShowSubtotal((prev) => !prev)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              View More <img src={DropDown} alt="Dropdown" className={`w-3 h-3 inline-block transition-transform ${showSubtotal ? 'rotate-180' : ''}`} />
            </button>
            {/* Subtotal */}
            {showSubtotal && (
              <div className="flex justify-end mt-2">
                <span className="avantbold cream-text text-md" style={{ color: '#959595' }}>Subtotal:</span>
                <span className="avantbold cream-text text-md ml-2">₱ 1,580.00</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 mb-2">
          <button className="avantbold rounded border border-[#FFF7DC] cream-text px-4 py-3 text-sm"
          onClick={() => navigate('/profile/requestreturn')}
          >
            RETURN/REFUND
            </button>
          <button className="avantbold cream-bg metallic-text px-4 py-0 rounded border border-[#FFF7DC] text-sm" onClick={openRateModal}>
            RATE
          </button>
        </div>
        <div className="w-full h-[1px] bg-[#FFF7DC] mt-4" />
      </div>
    </div>
  )
}

const Delivered = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImg, setModalImg] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [rateModalOpen, setRateModalOpen] = useState(false)

  const openModal = (img) => {
    setModalImg(img)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setModalImg(null)
  }
  const openEditProfile = () => setEditProfileOpen(true)
  const closeEditProfile = () => setEditProfileOpen(false)
  const openRateModal = () => setRateModalOpen(true)
  const closeRateModal = () => setRateModalOpen(false)

  return (
    <Layout full>
      <ProfileDesktop openModal={openModal} onEditProfile={openEditProfile} openRateModal={openRateModal} />
      <ProfileMobile openModal={openModal} onEditProfile={openEditProfile} openRateModal={openRateModal} />
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <img
            src={modalImg}
            alt="Product Full"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={closeModal}
          />
        </div>
      )}
      <EditProfileModal open={editProfileOpen} onClose={closeEditProfile} />
      <RateProductModal open={rateModalOpen} onClose={closeRateModal} products={ordersByTab['DELIVERED'][0]?.items || []} />
      <RateProductModalMobile open={rateModalOpen} onClose={closeRateModal} products={ordersByTab['DELIVERED'][0]?.items || []} />
    </Layout>
  )
}

export default Delivered
