import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import Layout from '../../../components/Layout'
import { 
  Friden, 
  Odyssey, 
  editIcon, 
  DropDown 
} from '../../../assets/index.js'

const ordersByTab = {
  'TO SHIP': [],
  'TO RECEIVED': [],
  'DELIVERED': [],
  'RETURN/REFUND': [],
  'CANCELLED': [
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
      date: '03/01/2025',
      delivery: '03/07/2025',
      totalQty: 3,
      subtotal: 1770,
    },
  ],
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

// Desktop Layout
const ProfileDesktop = ({ openModal, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState('CANCELLED') 
  const orders = ordersByTab[activeTab] || []
  const selectedOrder = orders[0]

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
                          <div>
                            <div className="bebas cream-text text-md">REASON:</div>
                            <div className="avant cream-text text-md">Need to change delivery address.</div>
                          </div>
                        </div>
                        <div className="flex gap-23 mt-2"> {/* gap between total quantity and subtotal */}
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
                        <button className="avantbold cream-bg metallic-text px-4 py-2 rounded border border-[#FFF7DC] cursor-pointer">BUY AGAIN</button>
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
const ProfileMobile = ({ openModal, onEditProfile }) => {
  const [showSubtotal, setShowSubtotal] = useState(false)
  const [activeTab, setActiveTab] = useState('CANCELLED')
  const orders = ordersByTab[activeTab] || []
  const selectedOrder = orders[0]
  const navigate = useNavigate()

  return (
    <div className="md:hidden w-full min-h-screen px-4 pt-2 text-[#fff7dc] relative">
      <div className="bebas cream-text text-5xl mt-20 mb-2">
        HI, REBELS!
        <button className="avant text-xs cream-text ml-2 align-middle" onClick={onEditProfile}>
          <span>Edit Profile</span>
          <img src={editIcon} alt="Edit" className="w-4 h-4 inline-block ml-1" />
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
        {selectedOrder ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="avantbold cream-text text-xs">ORDER ID : #{selectedOrder.id}</span>
              <span className="avantbold justify-end cream-text text-xs">EXPECTED DELIVERY: {selectedOrder.delivery}</span>
            </div>
            {/* Order Date */}
            <div className="flex justify-end mb-2">
              <span className="avantbold cream-text text-xs">ORDER DATE: {selectedOrder.date}</span>
            </div>
            <div className="flex gap-4 items-start rounded-lg p-2">
              <img
                src={selectedOrder.items[0].image}
                alt={selectedOrder.items[0].variant}
                className="w-32 h-32 object-cover rounded-md cursor-pointer"
                onClick={() => openModal(selectedOrder.items[0].image)}
              />
              <div className="flex-1">
                <div className="avantbold cream-text text-sm text-nowrap leading-tight">
                  {selectedOrder.items[0].name}
                  <br />
                  <span className="text-xs">(Elegant Pendant Jewelry)</span>
                </div>
                <div className="bebas cream-text text-sm mt-1">{selectedOrder.items[0].variant}</div>
                <div className="flex gap-6 mt-1">
                  <span className="avantbold text-sm" style={{ color: '#959595' }}>QUANTITY: {selectedOrder.items[0].quantity}</span>
                  <span className="avantbold text-sm" style={{ color: '#959595' }}>SIZE: {selectedOrder.items[0].size}</span>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <span className="avant text-sm line-through" style={{ color: '#959595' }}>₱ {selectedOrder.items[0].oldPrice}.00</span>
                  <span className="avantbold cream-text text-sm">₱ {selectedOrder.items[0].price}.00</span>
                </div>
                {/* View More button */}
                <button
                  className="avantbold cream-text text-sm mt-2 flex items-center gap-2 focus:outline-none"
                  onClick={() => setShowSubtotal((prev) => !prev)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  View More <img src={DropDown} alt="Dropdown" className={`w-3 h-3 inline-block transition-transform ${showSubtotal ? 'rotate-180' : ''}`} />
                </button>
                {/* Subtotal and Reason */}
                {showSubtotal && (
                  <div className="flex flex-col mt-2">
                    <div className="flex gap-2">
                      <span className="avantbold cream-text text-md" style={{ color: '#959595' }}>Subtotal:</span>
                      <span className="avantbold cream-text text-md ml-2">₱ {selectedOrder.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="avantbold cream-text text-md">Reason:</span>
                      <span className="avant cream-text text-xs ml-2">Need to change delivery address.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 mb-2">
              <button className="avantbold cream-bg metallic-text px-4 py-2 rounded border border-[#FFF7DC] text-sm">BUY AGAIN</button>
            </div>
            <div className="w-full h-[1px] bg-[#FFF7DC] mt-4" />
          </>
        ) : (
          <div className="avant cream-text text-lg mt-12">No orders in this category.</div>
        )}
      </div>
    </div>
  )
}

const Cancelled = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImg, setModalImg] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

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

  return (
    <Layout full>
      <ProfileDesktop openModal={openModal} onEditProfile={openEditProfile} />
      <ProfileMobile openModal={openModal} onEditProfile={openEditProfile} />
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
    </Layout>
  )
}

export default Cancelled
