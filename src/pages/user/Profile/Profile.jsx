import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import Layout from '../../../components/Layout'
import { 
  editIcon, 
  DropDown 
} from '../../../assets/index.js'
import { logout, getUser, getAuthToken } from '../../../services/authService'
import { checkAndRedirectAdmin, isAdminUser } from '../../../utils/authUtils'
import userApi from '../../../api/userApi'
import orderApi from '../../../api/orderApi'
import Toast from '../../../components/Toast'
import { groupOrdersByTab } from './profileUtils'

const tabs = [
  'TO SHIP',
  'TO RECEIVED',
  'DELIVERED',
  'RETURN/REFUND',
  'CANCELLED',
]

const tabRoutes = {
  'TO SHIP': '/profile',
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
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 3

  // Reset to page 1 when activeTab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage
  const paginatedOrders = orders.slice(startIndex, endIndex)

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        {/* Sidebar */}
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
            <div
              className="bg-[#FFF7DC] w-2 h-8 transition-all duration-300"
              style={{
                position: 'absolute',
                left: '50px',
                top: `${tabs.indexOf(activeTab) * 65}px`,
                zIndex: 2,
              }}
            />
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
          {orders.length > 0 ? (
            <>
              {paginatedOrders.map((order, orderIdx) => (
                <div key={order.id || orderIdx} className="mb-8">
                  <div className="avantbold cream-text text-2xl mb-2 font-bold">ORDER ID : #{order.id}</div>
                  {order.items.map((item, idx) => (
                    <div key={`${item.variant}-${idx}`} className="flex items-center justify-between rounded-lg px-0 py-2 w-full">
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
                          <div className="avantbold cream-text text-lg text-nowrap">{item.name}</div>
                          <div className="bebas cream-text text-lg">{item.variant}</div>
                          <div className="flex gap-2 items-center mt-1">
                            {item.oldPrice && (
                              <span
                                className="avant text-md line-through"
                                style={{ color: '#959595' }}
                              >
                                ₱ {item.oldPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="avantbold cream-text text-lg">₱ {item.price.toFixed(2)}</span>
                          </div>
                          <div className="avantbold cream-text text-md mt-1" style={{ color: '#959595' }}>
                            QUANTITY: {item.quantity} &nbsp; SIZE: {item.size}
                          </div>
                        </div>
                      </div>
                      {/* Order details and actions */}
                      {idx === 0 && (
                        <div className="flex flex-row items-center justify-between w-full ml-8">
                          <div className="flex flex-col gap-1 ml-45 mr-12">
                            <div className="flex gap-20">
                              <div>
                                <div className="bebas cream-text text-md">ORDER DATE:</div>
                                <div className="avant cream-text text-lg">{order.date}</div>
                              </div>
                              <div>
                                <div className="bebas cream-text text-md">EXPECTED DELIVERY:</div>
                                <div className="avant cream-text text-lg">{order.delivery}</div>
                              </div>
                            </div>
                            <div className="flex gap-14 mt-2">
                              <div>
                                <div className="bebas cream-text text-md">TOTAL QUANTITY:</div>
                                <div className="avant cream-text text-lg">{order.totalQty}</div>
                              </div>
                              <div>
                                <div className="bebas cream-text text-md">SUBTOTAL:</div>
                                <div className="avant cream-text text-lg">₱ {order.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-17">
                            <button
                              className="avantbold rounded border border-[#FFF7DC] cream-text px-4 py-2 cursor-pointer"
                              onClick={() => navigate(`/profile/vieworder?orderId=${order.id}`)}
                            >
                              VIEW ORDER
                            </button>
                            <button className="avantbold cream-bg metallic-text px-4 py-2 rounded border border-[#FFF7DC] cursor-pointer">
                              CONTACT SELLER
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <div className="avant cream-text text-lg mt-12 text-center">
              <p className="mb-2">No orders in this category.</p>
              <p className="text-sm" style={{ color: '#959595' }}>
                {activeTab === 'TO SHIP' && "Your pending orders will appear here once you place an order."}
                {activeTab === 'TO RECEIVED' && "Orders that are on their way will appear here."}
                {activeTab === 'DELIVERED' && "Your completed orders will appear here."}
                {activeTab === 'RETURN/REFUND' && "Orders with return or refund requests will appear here."}
                {activeTab === 'CANCELLED' && "Cancelled orders will appear here."}
              </p>
            </div>
          )}
          {/* Pagination Controls */}
          {orders.length > ordersPerPage && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`avantbold px-4 py-2 rounded border border-[#FFF7DC] ${
                  currentPage === 1
                    ? 'cream-text opacity-50 cursor-not-allowed'
                    : 'cream-text cursor-pointer hover:bg-[#FFF7DC] hover:text-[#1F1F21] transition-colors'
                }`}
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`avantbold w-10 h-10 rounded border border-[#FFF7DC] ${
                      currentPage === page
                        ? 'cream-bg metallic-text'
                        : 'cream-text hover:bg-[#FFF7DC] hover:text-[#1F1F21] transition-colors'
                    } cursor-pointer`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`avantbold px-4 py-2 rounded border border-[#FFF7DC] ${
                  currentPage === totalPages
                    ? 'cream-text opacity-50 cursor-not-allowed'
                    : 'cream-text cursor-pointer hover:bg-[#FFF7DC] hover:text-[#1F1F21] transition-colors'
                }`}
              >
                Next
              </button>
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
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 3

  // Reset to page 1 when activeTab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage
  const paginatedOrders = orders.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        <div className="absolute left-0 right-0 top-1/2 translate-y-3 h-[2px] bg-[#FFF7DC] w-full z-0" />
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
      <div className="mt-4">
        {orders.length > 0 ? (
          <>
            {paginatedOrders.map((order, orderIdx) => (
              <div key={order.id || orderIdx} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="avantbold cream-text text-xs">ORDER ID : #{order.id}</span>
                  <span className="avantbold cream-text text-xs">EXPECTED DELIVERY: {order.delivery}</span>
                </div>
                {order.items.map((item, itemIdx) => (
                  <div key={`${item.variant}-${itemIdx}`} className="flex gap-4 items-start rounded-lg p-2 mb-2">
                    <img
                      src={item.image}
                      alt={item.variant}
                      className="w-32 h-32 object-cover rounded-md cursor-pointer"
                      onClick={() => openModal(item.image)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200'
                      }}
                    />
                    <div className="flex-1">
                      <div className="avantbold cream-text text-sm text-nowrap leading-tight">
                        {item.name}
                      </div>
                      <div className="bebas cream-text text-sm mt-1">{item.variant}</div>
                      <div className="flex gap-6 mt-1">
                        <span className="avantbold text-sm" style={{ color: '#959595' }}>QUANTITY: {item.quantity}</span>
                        <span className="avantbold text-sm" style={{ color: '#959595' }}>SIZE: {item.size}</span>
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        {item.oldPrice && (
                          <span className="avant text-sm line-through" style={{ color: '#959595' }}>₱ {item.oldPrice.toFixed(2)}</span>
                        )}
                        <span className="avantbold cream-text text-sm">₱ {item.price.toFixed(2)}</span>
                      </div>
                      {itemIdx === 0 && (
                        <>
                          <button
                            className="avantbold cream-text text-sm mt-2 flex items-center gap-2 focus:outline-none"
                            onClick={() => setShowSubtotal((prev) => !prev)}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          >
                            View More <img src={DropDown} alt="Dropdown" className={`w-3 h-3 inline-block transition-transform ${showSubtotal ? 'rotate-180' : ''}`} />
                          </button>
                          {showSubtotal && (
                            <div className="flex justify-end mt-2">
                              <span className="avantbold cream-text text-md" style={{ color: '#959595' }}>Subtotal:</span>
                              <span className="avantbold cream-text text-md ml-2">₱ {order.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end gap-2 mt-4 mb-2">
                  <button
                    className="avantbold rounded border border-[#FFF7DC] cream-text px-4 py-3 text-sm"
                    onClick={() => navigate(`/profile/vieworder?orderId=${order.id}`)}
                  >
                    VIEW ORDER
                  </button>
                  <button className="avantbold cream-bg metallic-text px-3 py-2 rounded border border-[#FFF7DC] text-xs">
                    CONTACT SELLER
                  </button>
                </div>
                {orderIdx < paginatedOrders.length - 1 && (
                  <div className="w-full h-[1px] bg-[#FFF7DC] mt-4" />
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="avant cream-text text-lg mt-12 text-center">
            <p className="mb-2">No orders in this category.</p>
            <p className="text-sm" style={{ color: '#959595' }}>
              {activeTab === 'TO SHIP' && "Your pending orders will appear here once you place an order."}
              {activeTab === 'TO RECEIVED' && "Orders that are on their way will appear here."}
              {activeTab === 'DELIVERED' && "Your completed orders will appear here."}
              {activeTab === 'RETURN/REFUND' && "Orders with return or refund requests will appear here."}
              {activeTab === 'CANCELLED' && "Cancelled orders will appear here."}
            </p>
          </div>
        )}
        {/* Pagination Controls */}
        {orders.length > ordersPerPage && (
          <div className="flex items-center justify-center gap-3 mt-8 mb-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`avantbold px-3 py-2 rounded border border-[#FFF7DC] text-sm ${
                currentPage === 1
                  ? 'cream-text opacity-50 cursor-not-allowed'
                  : 'cream-text cursor-pointer hover:bg-[#FFF7DC] hover:text-[#1F1F21] transition-colors'
              }`}
            >
              Prev
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`avantbold w-8 h-8 rounded border border-[#FFF7DC] text-xs ${
                    currentPage === page
                      ? 'cream-bg metallic-text'
                      : 'cream-text hover:bg-[#FFF7DC] hover:text-[#1F1F21] transition-colors'
                  } cursor-pointer`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`avantbold px-3 py-2 rounded border border-[#FFF7DC] text-sm ${
                currentPage === totalPages
                  ? 'cream-text opacity-50 cursor-not-allowed'
                  : 'cream-text cursor-pointer hover:bg-[#FFF7DC] hover:text-[#1F1F21] transition-colors'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const Profile = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImg, setModalImg] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('TO SHIP')
  const [userData, setUserData] = useState(null)
  const [ordersByTab, setOrdersByTab] = useState({
    'TO SHIP': [],
    'TO RECEIVED': [],
    'DELIVERED': [],
    'RETURN/REFUND': [],
    'CANCELLED': [],
  })
  const [loading, setLoading] = useState(true)
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

      // console.log('Current user from localStorage:', currentUser)
      // console.log('User ID being used:', currentUser.user_id)

      setLoading(true)
      try {
        // Fetch user profile
        const userResult = await userApi.fetchUserProfile(currentUser.user_id)
        if (userResult.error) {
          console.error('Error fetching user profile:', userResult.error)
          // Use stored user data as fallback
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
        // Some orders might have user_id as null but still belong to the user via email
        // console.log('Fetching orders for user_id:', currentUser.user_id, 'and email:', userData?.email || currentUser.email)
        
        const [ordersByUserIdResult, ordersByEmailResult] = await Promise.all([
          orderApi.fetchOrdersByUserId(currentUser.user_id),
          userData?.email || currentUser.email 
            ? orderApi.fetchOrdersByEmail(userData?.email || currentUser.email)
            : Promise.resolve({ error: null, data: { success: true, data: [] } })
        ])
        
        // console.log('Orders by user_id response:', ordersByUserIdResult)
        // console.log('Orders by email response:', ordersByEmailResult)
        
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
        
        // console.log('Total unique orders found:', allOrders.length)
        if (allOrders.length > 0) {
          // console.log('Order statuses:', allOrders.map(o => ({ id: o.order_id, status: o.status })))
        }
        
        setOrdersByTab(groupOrdersByTab(allOrders))
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setLoading(false)
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
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  if (loading) {
    return (
      <Layout full>
        <div className="min-h-screen bg-[#181818] flex items-center justify-center">
          <div className="text-[#FFF7DC] text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFF7DC] mx-auto mb-4"></div>
            <p className="avant text-lg">Loading profile...</p>
          </div>
        </div>
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

export default Profile
