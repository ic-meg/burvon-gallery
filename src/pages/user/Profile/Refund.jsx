import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import Layout from '../../../components/Layout'
import { 
  editIcon, 
  DropDown 
} from '../../../assets/index.js'
import { logout, getUser, getAuthToken } from '../../../services/authService'
import { checkAndRedirectAdmin } from '../../../utils/authUtils'
import userApi from '../../../api/userApi'
import orderApi from '../../../api/orderApi'
import Toast from '../../../components/Toast'
import ProfileSkeleton from '../../../components/ProfileSkeleton'
import { groupOrdersByTab } from './profileUtils'

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
const EditProfileModal = ({ open, onClose, userData, onUpdate }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    if (open && userData) {
      setName(userData.name || '')
      setEmail(userData.email || '')
    }
  }, [open, userData])

  const handleSave = async () => {
    if (!userData?.user_id) return

    setLoading(true)
    try {
      const result = await userApi.updateUserProfile(userData.user_id, {
        name: name.trim(),
        email: email.trim(),
      })

      if (result.error) {
        setToast({ show: true, message: result.error || 'Failed to update profile', type: 'error' })
      } else {
        setToast({ show: true, message: 'Profile updated successfully!', type: 'success' })
        if (onUpdate) {
          onUpdate({ ...userData, name: name.trim(), email: email.trim() })
        }
        setTimeout(() => {
          onClose()
        }, 1000)
      }
    } catch (error) {
      setToast({ show: true, message: 'An error occurred. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
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
              disabled={loading}
            >
              CANCEL
            </button>
            <button
              className="avantbold cream-bg metallic-text px-8 py-2 rounded-lg text-md cursor-pointer disabled:opacity-50"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </>
  )
}

// Desktop Layout
const ProfileDesktop = ({ openModal, onEditProfile, userData, ordersByTab, activeTab, setActiveTab }) => {
  const orders = ordersByTab[activeTab] || []
  const selectedOrder = orders[0]
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className="hidden md:block min-h-screen bg-[#181818] px-0 py-34 text-[#fff7dc]">
      <div className="bebas cream-text text-center text-7xl mt-10 mb-2">HI, REBELS!</div>
      {/* Header row */}
      <div className="flex items-center justify-between px-12 pt-12 pb-2">
        <div className="bebas cream-text text-2xl tracking-wide">
          SHOPPING HISTORY / <span className="font-bold">{activeTab}</span>
        </div>
        <div className="flex gap-4">
          <button className="avant cream-text text-md flex items-center gap-1 cursor-pointer" onClick={onEditProfile}>
            <span>Edit Profile</span>
            <img src={editIcon} alt="Edit" className="w-5 h-5" />
          </button>
          <button className="avant cream-text text-md cursor-pointer hover:opacity-80" onClick={handleLogout}>
            Logout
          </button>
        </div>
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
              onClick={() => {
                setActiveTab(tab)
                navigate(tabRoutes[tab])
              }}
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
              <div className="avantbold cream-text text-2xl mb-2 font-bold">ORDER ID : #{selectedOrder.order_id}</div>
              {selectedOrder.items.map((item) => (
                <div key={item.order_item_id} className="flex items-center justify-between rounded-lg px-0 py-2 w-full">
                  {/* Image and product info */}
                  <div className="flex items-center gap-4 min-w-[320px]">
                    <img
                      src={item.image}
                      alt={item.variant}
                      className="w-25 h-25 object-cover rounded-md cursor-pointer"
                      onClick={() => openModal(item.image)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200'
                      }}
                    />
                    <div>
                      <div className="avantbold cream-text text-lg text-nowrap">{item.name}</div> {/* product name */}
                      <div className="bebas cream-text text-lg">{item.variant}</div> {/* product type "odyssey" */}
                      <div className="flex gap-2 items-center mt-1">
                        {item.oldPrice && (
                          <span
                            className="avant text-md line-through"
                            style={{ color: '#959595' }}
                          >
                            PHP {item.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="avantbold cream-text text-lg">PHP {item.price.toFixed(2)}</span>
                      </div>
                      <div className="avantbold cream-text text-md mt-1" style={{ color: '#959595' }}>QUANTITY: {item.quantity} &nbsp; SIZE: {item.size}

                      </div>
                    </div>
                  </div>
                  {/* Order details and actions - now shown for each item */}
                  <div className="flex flex-row items-center justify-between w-full ml-8">
                    <div className="flex flex-col gap-1 ml-45 mt-[-40px] mr-12">
                      <div className="flex gap-20"> {/* gap between item total and refund amount */}
                        <div>
                          <div className="bebas cream-text text-md">ITEM TOTAL:</div>
                          <div className="avant cream-text text-lg">PHP {selectedOrder.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                        </div>
                        <div>
                          <div className="bebas cream-text text-md">REFUND AMOUNT:</div>
                          <div className="avant cream-text text-lg">PHP {selectedOrder.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-17">
                      <button className="avantbold cream-text px-4 py-2 cursor-pointer">REVIEW IN PROGRESS</button>
                      <button
                        className="avantbold cream-bg metallic-text px-4 py-2 rounded border border-[#FFF7DC] cursor-pointer"
                        onClick={() => navigate(`/profile/reviewdetails?orderId=${selectedOrder.order_id}`)}
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="avant cream-text text-lg mt-12 text-center">
              <p className="mb-2">No orders in this category.</p>
              <p className="text-sm" style={{ color: '#959595' }}>
                Orders with return or refund requests will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mobile Layout 
const ProfileMobile = ({ openModal, onEditProfile, userData, ordersByTab, activeTab, setActiveTab }) => {
  const [showSubtotal, setShowSubtotal] = useState(false)
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
        {selectedOrder ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="avantbold cream-text text-xs">ORDER ID : #{selectedOrder.order_id}</span>
              <span className="avantbold cream-text text-xs">EXPECTED DELIVERY: {selectedOrder.delivery}</span>
            </div>
            <div className="flex gap-4 items-start rounded-lg p-2">
              <img
                src={selectedOrder.items[0]?.image}
                alt={selectedOrder.items[0]?.variant}
                className="w-32 h-32 object-cover rounded-md cursor-pointer"
                onClick={() => openModal(selectedOrder.items[0]?.image)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200'
                }}
              />
              <div className="flex-1">
                <div className="avantbold cream-text text-sm text-nowrap leading-tight">
                  {selectedOrder.items[0]?.name}
                </div>
                <div className="bebas cream-text text-sm mt-1">{selectedOrder.items[0]?.variant}</div>
                <div className="flex gap-6 mt-1">
                  <span className="avantbold text-sm" style={{ color: '#959595' }}>QUANTITY: {selectedOrder.items[0]?.quantity}</span>
                  <span className="avantbold text-sm" style={{ color: '#959595' }}>SIZE: {selectedOrder.items[0]?.size}</span>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  {selectedOrder.items[0]?.oldPrice && (
                    <span className="avant text-sm line-through" style={{ color: '#959595' }}>PHP {selectedOrder.items[0].oldPrice.toFixed(2)}</span>
                  )}
                  <span className="avantbold cream-text text-sm">PHP {selectedOrder.items[0]?.price.toFixed(2)}</span>
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
                    <span className="avantbold text-nowrap cream-text text-xs" style={{ color: '#959595' }}>Refund Amount:</span>
                    <span className="avantbold text-nowrap cream-text text-xs ml-2">PHP {selectedOrder.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 mb-2">
              <button className="avantbold cream-text px-4 py-3 text-sm">REVIEW IN PROGRESS</button>
              <button 
                className="avantbold cream-bg metallic-text px-4 py-0 rounded border border-[#FFF7DC] text-sm"
                onClick={() => navigate(`/profile/reviewdetails?orderId=${selectedOrder.order_id}`)}
              >
                VIEW DETAILS
              </button>
            </div>
            <div className="w-full h-[1px] bg-[#FFF7DC] mt-4" />
          </>
        ) : (
          <div className="avant cream-text text-lg mt-12 text-center">
            <p className="mb-2">No orders in this category.</p>
            <p className="text-sm" style={{ color: '#959595' }}>
              Orders with return or refund requests will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const Refund = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImg, setModalImg] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('RETURN/REFUND')
  const [userData, setUserData] = useState(null)
  const [ordersByTab, setOrdersByTab] = useState({
    'TO SHIP': [],
    'TO RECEIVED': [],
    'DELIVERED': [],
    'RETURN/REFUND': [],
    'CANCELLED': [],
  })
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(() => {
    // Check sessionStorage to see if profile has been loaded before in this session
    return !sessionStorage.getItem('profileLoaded')
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken()
      if (!token) {
        navigate('/login')
        return
      }

      const currentUser = getUser()
      if (!currentUser || !currentUser.user_id) {
        navigate('/login')
        return
      }

      // Check if admin user is trying to access customer page
      if (checkAndRedirectAdmin(currentUser, navigate)) {
        return
      }

      // Only show loading skeleton on initial load
      if (initialLoad) {
        setLoading(true)
      }
      try {
        // Fetch user profile
        const userResult = await userApi.fetchUserProfile(currentUser.user_id)
        if (userResult.error) {
          console.error('Error fetching user profile:', userResult.error)
          setUserData(currentUser)
        } else {
          const user = userResult.data || currentUser
          // Map full_name to name for consistency
          if (user && user.full_name && !user.name) {
            user.name = user.full_name
          }
          setUserData(user)
        }

        // Fetch user orders - try both user_id and email to get all orders
        console.log('[Refund] Fetching orders for user_id:', currentUser.user_id, 'and email:', userData?.email || currentUser.email)

        const [ordersByUserIdResult, ordersByEmailResult] = await Promise.all([
          orderApi.fetchOrdersByUserId(currentUser.user_id),
          userData?.email || currentUser.email
            ? orderApi.fetchOrdersByEmail(userData?.email || currentUser.email)
            : Promise.resolve({ error: null, data: { success: true, data: [] } })
        ])

        console.log('[Refund] Orders by user_id response:', ordersByUserIdResult)
        console.log('[Refund] Orders by email response:', ordersByEmailResult)

        // Combine orders from both sources and remove duplicates
        const allOrders = []
        const orderIds = new Set()

        // Add orders from user_id fetch
        if (!ordersByUserIdResult.error && ordersByUserIdResult.data?.success) {
          const orders = ordersByUserIdResult.data.data || []
          orders.forEach(order => {
            if (!orderIds.has(order.order_id)) {
              orderIds.add(order.order_id)
              allOrders.push(order)
            }
          })
        }

        // Add orders from email fetch
        if (!ordersByEmailResult.error && ordersByEmailResult.data?.success) {
          const orders = ordersByEmailResult.data.data || []
          orders.forEach(order => {
            if (!orderIds.has(order.order_id)) {
              orderIds.add(order.order_id)
              allOrders.push(order)
            }
          })
        }

        console.log('[Refund] Total unique orders found:', allOrders.length)
        if (allOrders.length > 0) {
          console.log('[Refund] Order statuses:', allOrders.map(o => ({ id: o.order_id, status: o.status })))
        }

        setOrdersByTab(groupOrdersByTab(allOrders))
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setLoading(false)
        setInitialLoad(false)
        // Mark that profile has been loaded in this session
        sessionStorage.setItem('profileLoaded', 'true')
      }
    }

    fetchData()
  }, [navigate])

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

  const handleUserUpdate = (updatedUser) => {
    setUserData(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  if (loading && initialLoad) {
    return (
      <Layout full>
        <ProfileSkeleton />
      </Layout>
    )
  }

  return (
    <Layout full>
      <ProfileDesktop 
        openModal={openModal} 
        onEditProfile={openEditProfile}
        userData={userData}
        ordersByTab={ordersByTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ProfileMobile 
        openModal={openModal} 
        onEditProfile={openEditProfile}
        userData={userData}
        ordersByTab={ordersByTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
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
      <EditProfileModal 
        open={editProfileOpen} 
        onClose={closeEditProfile}
        userData={userData}
        onUpdate={handleUserUpdate}
      />
    </Layout>
  )
}

export default Refund
