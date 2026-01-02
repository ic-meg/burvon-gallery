import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminHeader from '../../components/admin/AdminHeader'
import adminApi from '../../api/adminApi'
import productApi from '../../api/productApi'
import categoryApi from '../../api/categoryApi'


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

// Skeleton Loading Components
const SkeletonBox = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
)

const TodoListSkeleton = () => (
  <div className="space-y-1">
    {[1, 2, 3, 4, 5].map((item) => (
      <div key={item} className="flex items-center justify-between p-3 rounded-lg">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-6 w-40" />
          {item <= 4 && <SkeletonBox className="h-5 w-16" />}
        </div>
        <SkeletonBox className="h-8 w-8" />
      </div>
    ))}
  </div>
)

const StatsCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000]">
    <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
      <SkeletonBox className="w-8 h-8" />
    </div>
    <SkeletonBox className="h-5 w-40 mb-3" />
    <SkeletonBox className="h-8 w-32 mb-2" />
    <SkeletonBox className="h-4 w-24 mb-2" />
    <SkeletonBox className="h-4 w-36" />
  </div>
)

const TopProductsSkeleton = () => (
  <>
    {[1, 2, 3].map((item) => (
      <div key={item} className="mb-2">
        <SkeletonBox className="h-6 w-32 mb-1" />
        <SkeletonBox className="h-4 w-20" />
      </div>
    ))}
    <div className="mt-2">
      <SkeletonBox className="h-4 w-40" />
    </div>
  </>
)

const ProductCardSkeleton = () => (
  <div className="relative bg-[#222] overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)]">
    <div className="relative w-full h-[250px] flex items-center justify-center overflow-hidden bg-black">
      <div className="bg-gray-700 animate-pulse rounded w-full h-full"></div>
    </div>
    <div
      style={{
        background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
      }}
      className="py-2 px-2 text-center flex flex-col items-center rounded-none"
    >
      <div className="bg-gray-600 animate-pulse rounded h-4 w-24 mb-1"></div>
      <div className="bg-gray-600 animate-pulse rounded h-3 w-32 mb-2"></div>
      <div className="bg-gray-600 animate-pulse rounded h-3 w-20"></div>
    </div>
  </div>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [collectionValue, setCollectionValue] = useState('none')
  const [categoryValue, setCategoryValue] = useState('none')
  const [dashboardData, setDashboardData] = useState(null)
  const [topPicks, setTopPicks] = useState([])
  const [originalTopPicks, setOriginalTopPicks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [collectionOptions, setCollectionOptions] = useState([
    { label: 'Select a Collection...', value: 'none' },
  ])
  const [categoryOptions, setCategoryOptions] = useState([
    { label: 'Select a Category...', value: 'none' },
  ])

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
                className={`px-4 py-2 cursor-pointer select-none hover:bg-[#232323] ${value === option.value ? 'bg-[#232323]' : ''
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

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_COLLECTIONS_API
        if (!BASE_URL) {
          console.warn('VITE_COLLECTIONS_API not configured')
          try {
            const productsResponse = await productApi.fetchAllProducts()
            if (!productsResponse.error && productsResponse.data) {
              const products = productsResponse.data.products || productsResponse.data || []
              const collectionMap = new Map()
              products.forEach(product => {
                if (product.collection) {
                  const collection = product.collection
                  const id = collection.collection_id || collection.id
                  if (id && !collectionMap.has(id)) {
                    collectionMap.set(id, {
                      name: collection.name || 'Unnamed Collection',
                      id: id
                    })
                  }
                }
              })
              const collections = Array.from(collectionMap.values())
              const options = [
                { label: 'Select a Collection...', value: 'none' },
                ...collections.map((collection) => ({
                  label: collection.name || 'Unnamed Collection',
                  value: collection.id ? String(collection.id) : 'none',
                  collectionId: collection.id, // Store the actual ID for API calls
                }))
              ]
              setCollectionOptions(options)
            }
          } catch (productErr) {
            console.warn('Could not extract collections from products:', productErr)
          }
          return
        }

        const response = await fetch(BASE_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        // Extract collections array from response (backend returns { collections: [...] })
        let collections = []
        if (data.collections && Array.isArray(data.collections)) {
          collections = data.collections
        } else if (Array.isArray(data)) {
          collections = data
        } else if (data.data && Array.isArray(data.data)) {
          collections = data.data
        }

        // If no collections from API, try to extract from products
        if (collections.length === 0) {
          try {
            const productsResponse = await productApi.fetchAllProducts()
            if (!productsResponse.error && productsResponse.data) {
              const products = productsResponse.data.products || productsResponse.data || []
              const collectionMap = new Map()
              products.forEach(product => {
                if (product.collection) {
                  const collection = product.collection
                  const id = collection.collection_id || collection.id
                  if (id && !collectionMap.has(id)) {
                    collectionMap.set(id, {
                      name: collection.name || 'Unnamed Collection',
                      id: id
                    })
                  }
                }
              })
              collections = Array.from(collectionMap.values())
            }
          } catch (productErr) {
            console.warn('Could not extract collections from products:', productErr)
          }
        }

        // Transform collections to dropdown options
        // Always use collection_id or id as the value (must be a number for API)
        const options = [
          { label: 'Select a Collection...', value: 'none' },
          ...collections.map((collection) => {
            const collectionId = collection.collection_id || collection.id
            return {
              label: collection.name || 'Unnamed Collection',
              value: collectionId ? String(collectionId) : 'none', // Convert to string for dropdown, but keep as ID
              collectionId: collectionId, // Store the actual ID for API calls
            }
          })
        ]

        setCollectionOptions(options)
      } catch (err) {
        console.error('Error fetching collections:', err)
        // Try to extract from products as fallback
        try {
          const productsResponse = await productApi.fetchAllProducts()
          if (!productsResponse.error && productsResponse.data) {
            const products = productsResponse.data.products || productsResponse.data || []
            const collectionMap = new Map()
            products.forEach(product => {
              if (product.collection) {
                const collection = product.collection
                const id = collection.collection_id || collection.id
                if (id && !collectionMap.has(id)) {
                  collectionMap.set(id, {
                    name: collection.name || 'Unnamed Collection',
                    id: id
                  })
                }
              }
            })
            const collections = Array.from(collectionMap.values())
            const options = [
              { label: 'Select a Collection...', value: 'none' },
              ...collections.map((collection) => ({
                label: collection.name || 'Unnamed Collection',
                value: collection.id || 'none',
              }))
            ]
            setCollectionOptions(options)
          }
        } catch (productErr) {
          console.warn('Could not extract collections from products:', productErr)
        }
      }
    }

    fetchCollections()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let categories = []
        const response = await categoryApi.fetchAllCategories()

        if (!response.error && response.data) {
          categories = Array.isArray(response.data) ? response.data : []
        }

        // If no categories from API, try sa  products
        if (categories.length === 0) {
          try {
            const productsResponse = await productApi.fetchAllProducts()
            if (!productsResponse.error && productsResponse.data) {
              const products = productsResponse.data.products || productsResponse.data || []

              const categoryMap = new Map()
              products.forEach(product => {
                if (product.category) {
                  const category = product.category
                  const slug = category.slug || category.name?.toLowerCase()
                  if (slug && !categoryMap.has(slug)) {
                    categoryMap.set(slug, {
                      name: category.name || 'Unnamed Category',
                      slug: slug
                    })
                  }
                }
              })
              categories = Array.from(categoryMap.values())
            }
          } catch (productErr) {
            console.warn('Could not extract categories from products:', productErr)
          }
        }

        // Transform categories to dropdown options
        const options = [
          { label: 'Select a Category...', value: 'none' },
          ...categories.map((category) => ({
            label: category.name || 'Unnamed Category',
            value: category.slug || category.name?.toLowerCase() || 'none',
          }))
        ]

        setCategoryOptions(options)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const statsResponse = await adminApi.fetchDashboardStats()
        if (statsResponse.error) {
          setError(statsResponse.error)
          setLoading(false)
          return
        }

        setDashboardData(statsResponse.data)

        // Fetch products for top picks
        const productsResponse = await productApi.fetchAllProducts()
        if (!productsResponse.error && productsResponse.data) {
          const products = productsResponse.data.products || productsResponse.data || []
          if (statsResponse.data?.topProducts && products.length > 0) {
            const topProductsData = statsResponse.data.topProducts.map((topProduct, index) => {
              const product = products.find(p =>
                p.id === topProduct.id ||
                p.name?.toUpperCase() === topProduct.name?.toUpperCase()
              )

              // Fallback to default images if product not founddds
              const defaultImages = [LyricImage, AgathaImage, RiomImage, CelineImage]
              const defaultImage = defaultImages[index % defaultImages.length]

              return {
                id: product?.id || index + 1,
                name: product?.name?.toUpperCase() || topProduct.name?.toUpperCase() || 'PRODUCT',
                collection: product?.collection?.name?.toUpperCase() || 'COLLECTION',
                oldPrice: product?.original_price
                  ? `PHP${parseFloat(product.original_price).toFixed(2)}`
                  : 'PHP790.00',
                price: product?.price
                  ? `PHP${parseFloat(product.price).toFixed(2)}`
                  : 'PHP711.00',
                image: product?.images?.[0] || product?.image || defaultImage,
                sold: topProduct.sold || 0,
              }
            })
            setTopPicks(topProductsData)
            setOriginalTopPicks(topProductsData)
          } else {
            // Fallback to default products if no top products found
            setTopPicks([
              {
                id: 1,
                name: "LYRIC",
                collection: "LOVE LANGUAGE COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: LyricImage,
              },
              {
                id: 2,
                name: "AGATHA",
                collection: "CLASH COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: AgathaImage,
              },
              {
                id: 3,
                name: "RIOM",
                collection: "THE REBELLION COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: RiomImage,
              },
              {
                id: 4,
                name: "CELINE",
                collection: "THE REBELLION COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: CelineImage,
              },
            ])
            setOriginalTopPicks([
              {
                id: 1,
                name: "LYRIC",
                collection: "LOVE LANGUAGE COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: LyricImage,
              },
              {
                id: 2,
                name: "AGATHA",
                collection: "CLASH COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: AgathaImage,
              },
              {
                id: 3,
                name: "RIOM",
                collection: "THE REBELLION COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: RiomImage,
              },
              {
                id: 4,
                name: "CELINE",
                collection: "THE REBELLION COLLECTION",
                oldPrice: "PHP790.00",
                price: "PHP711.00",
                image: CelineImage,
              },
            ])
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const maxVisible = 4
  const canPrev = carouselIndex > 0
  const canNext = carouselIndex < topPicks.length - maxVisible

  const formatCurrency = (amount) => {
    return `PHP${parseFloat(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatPercentage = (value) => {
    let percentage = Math.abs(value || 0);
    
    if (percentage > 100) {

      percentage = Math.min(percentage / 10, 99.9);
    } else if (percentage < 1 && percentage > 0) {
      percentage = percentage * 100;
    }
    
    if (percentage > 50) {
      percentage = Math.min(percentage, 50.0);
    }
    
    return `${percentage.toFixed(1)}%`;
  }

  const handlePrev = () => {
    if (canPrev) setCarouselIndex(carouselIndex - 1)
  }

  const handleNext = () => {
    if (canNext) setCarouselIndex(carouselIndex + 1)
  }

  useEffect(() => {
    const filterTopPicks = async () => {
      if (collectionValue === 'none' && categoryValue === 'none') {
        if (originalTopPicks.length > 0) {
          setTopPicks(originalTopPicks)
          setCarouselIndex(0)
        }
        return
      }

      try {
        let filteredProducts = []

        if (collectionValue !== 'none') {
          let collectionId = null
          const collectionOption = collectionOptions.find(opt => opt.value === collectionValue)

          if (collectionOption && collectionOption.collectionId) {
            collectionId = collectionOption.collectionId
          } else {
            const parsedId = parseInt(collectionValue)
            collectionId = isNaN(parsedId) ? null : parsedId
          }

          if (!collectionId) {
            console.error('Could not determine collection ID from value:', collectionValue)
            setTopPicks([])
            return
          }


          const collectionResponse = await productApi.fetchProductsByCollection(collectionId)



          if (collectionResponse.error) {
            console.error('Error fetching products by collection:', collectionResponse.error)
          } else if (collectionResponse.data) {

            let products = []
            let responseData = collectionResponse.data

            if (responseData && responseData.status !== undefined && responseData.data) {
              responseData = responseData.data
            }

            // Now extract products from the actual backend response
            // Backend returns { products: [...], collection: {...} }
            if (Array.isArray(responseData.products)) {
              products = responseData.products
            } else if (Array.isArray(responseData)) {
              products = responseData
            } else if (responseData && responseData.data && Array.isArray(responseData.data.products)) {
              products = responseData.data.products
            } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
              products = responseData.data
            }

            filteredProducts = products

            // If category is also selected, filter by category too
            if (categoryValue !== 'none' && filteredProducts.length > 0) {
              filteredProducts = filteredProducts.filter(product => {
                const productCategory = product.category?.slug || product.category?.name?.toLowerCase()
                return productCategory === categoryValue || productCategory === categoryValue.toLowerCase()
              })
            }
          }
        } else if (categoryValue !== 'none') {
          const categoryResponse = await productApi.fetchProductsByCategory(categoryValue)



          if (categoryResponse.error) {
            console.error('Error fetching products by category:', categoryResponse.error)
          } else if (categoryResponse.data) {
            // Handle different response structures
            let products = []
            let responseData = categoryResponse.data

            // Check if responseData is the apiRequest wrapper (has status property)
            if (responseData && responseData.status !== undefined && responseData.data) {
              responseData = responseData.data
            }

            // Extract products array from various possible structures
            if (Array.isArray(responseData.products)) {
              products = responseData.products
            } else if (Array.isArray(responseData)) {
              products = responseData
            } else if (responseData && responseData.data && Array.isArray(responseData.data.products)) {
              products = responseData.data.products
            } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
              products = responseData.data
            }

            filteredProducts = products
          }
        }

        // Transform filtered products to top picks format
        if (filteredProducts.length > 0) {
          const transformedProducts = filteredProducts.slice(0, 10).map((product, index) => {
            const defaultImages = [LyricImage, AgathaImage, RiomImage, CelineImage]
            const defaultImage = defaultImages[index % defaultImages.length]

            return {
              id: product.id || index + 1,
              name: product.name?.toUpperCase() || 'PRODUCT',
              collection: product.collection?.name?.toUpperCase() || 'COLLECTION',
              oldPrice: product.original_price
                ? `PHP${parseFloat(product.original_price).toFixed(2)}`
                : null,
              price: product.price
                ? `PHP${parseFloat(product.price).toFixed(2)}`
                : 'PHP0.00',
              image: product.images?.[0] || product.image || defaultImage,
            }
          })
          setTopPicks(transformedProducts)
          setCarouselIndex(0) // Reset carousel to first page
        } else {
          // No products found with filters, show empty or message
          console.warn('No products found for selected filters')
          setTopPicks([])
          setCarouselIndex(0)
        }
      } catch (err) {
        console.error('Error filtering products:', err)
        // On error, restore original top picks
        if (originalTopPicks.length > 0) {
          setTopPicks(originalTopPicks)
        }
      }
    }

    // Only filter if we have original top picks loaded or filters are active
    if (originalTopPicks.length > 0 || (collectionValue !== 'none' || categoryValue !== 'none')) {
      filterTopPicks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionValue, categoryValue])

  const handleToDoClick = (item) => {
    switch (item) {
      case 'pending-orders':
        navigate('/admin/orders?status=Pending')
        break
      case 'low-stock':
        navigate('/admin/reports?tab=lowstock')
        break
      case 'returns':
        navigate('/admin/orders?status=Return/Refund')
        break
      case 'cancellations':
        navigate('/admin/orders?status=Cancellation')
        break
      case 'feedback':
        navigate('/admin/live-chat')
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
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
              <p className="text-red-700 avant">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 underline avant text-sm"
              >
                Retry
              </button>
            </div>
          )}
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

                {loading ? (
                  <TodoListSkeleton />
                ) : (
                  <div className="space-y-1">
                    <div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      onClick={() => handleToDoClick('pending-orders')}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#000000] avant text-xl">Pending Orders</span>
                        {dashboardData?.todoList?.pendingOrders > 0 && (
                          <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                        )}
                      </div>
                      <span className="text-[#000000] text-3xl avantbold">
                        {dashboardData?.todoList?.pendingOrders || 0}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      onClick={() => handleToDoClick('low-stock')}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#000000] avant text-xl">Low Stock Items</span>
                        {dashboardData?.todoList?.lowStockItems > 0 && (
                          <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                        )}
                      </div>
                      <span className="text-[#000000] text-3xl avantbold">
                        {dashboardData?.todoList?.lowStockItems || 0}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      onClick={() => handleToDoClick('returns')}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#000000] avant text-xl">Return/Refund Request</span>
                        {dashboardData?.todoList?.returnRefundRequests > 0 && (
                          <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                        )}
                      </div>
                      <span className="text-[#000000] text-3xl avantbold">
                        {dashboardData?.todoList?.returnRefundRequests || 0}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      onClick={() => handleToDoClick('cancellations')}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#000000] avant text-xl">Cancellation Request</span>
                        {dashboardData?.todoList?.cancellationRequests > 0 && (
                          <span className="bg-transparent text-[#FF0000] border-2 border-[#FF0000] avantbold text-xs px-3 py-1 rounded-lg">Urgent</span>
                        )}
                      </div>
                      <span className="text-[#000000] text-3xl avantbold">
                        {dashboardData?.todoList?.cancellationRequests || 0}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      onClick={() => handleToDoClick('feedback')}
                    >
                      <span className="text-[#000000] avant text-xl">Review Customer Feedback</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards - with icons and border lines */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">

                {/* Sales Summary */}
                <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/reports?tab=sales')}>
                  <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
                    <img src={PesoSign} alt="Sales Summary" className="w-8 h-8" />
                  </div>
                  <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
                    SALES SUMMARY (TODAY)
                  </div>
                  {loading ? (
                    <>
                      <SkeletonBox className="h-8 w-32 mb-2" />
                      <SkeletonBox className="h-4 w-24 mb-2" />
                      <SkeletonBox className="h-4 w-36" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl avantbold text-black -mb-1">
                        {formatCurrency(dashboardData?.salesSummary?.amount || 0)}
                      </div>
                      <div className="text-sm avant text-black mb-2">
                        {dashboardData?.salesSummary?.orderCount || 0} {dashboardData?.salesSummary?.orderCount === 1 ? 'Order' : 'Orders'}
                      </div>
                      <div className={`text-sm flex items-center gap-1 ${(dashboardData?.salesSummary?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <img
                          src={(dashboardData?.salesSummary?.change || 0) >= 0 ? IncreaseIcon : DecreaseIcon}
                          alt={(dashboardData?.salesSummary?.change || 0) >= 0 ? "Increase" : "Decrease"}
                          className="w-4 h-4"
                        />
                        <span className='avant'>
                          {formatPercentage(dashboardData?.salesSummary?.change || 0)} {(dashboardData?.salesSummary?.change || 0) >= 0 ? 'Up' : 'Down'} from past week
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Returning Customers */}
                <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/reports?tab=sales&groupBy=monthly')}>
                  <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
                    <img src={ReturnCustomers} alt="Returning Customers" className="w-8 h-8" />
                  </div>
                  <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
                    RETURNING CUSTOMERS
                  </div>
                  {loading ? (
                    <>
                      <SkeletonBox className="h-8 w-20 mb-2" />
                      <SkeletonBox className="h-4 w-24 mb-2" />
                      <SkeletonBox className="h-4 w-36" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl avantbold text-black -mb-1">
                        {dashboardData?.returningCustomers?.count || 0}
                      </div>
                      <div className="text-sm avant text-black mb-2">This Month</div>
                      <div className={`text-sm flex items-center gap-1 ${(dashboardData?.returningCustomers?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <img
                          src={(dashboardData?.returningCustomers?.change || 0) >= 0 ? IncreaseIcon : DecreaseIcon}
                          alt={(dashboardData?.returningCustomers?.change || 0) >= 0 ? "Increase" : "Decrease"}
                          className="w-4 h-4"
                        />
                        <span className='avant'>
                          {formatPercentage(dashboardData?.returningCustomers?.change || 0)} {(dashboardData?.returningCustomers?.change || 0) >= 0 ? 'Up' : 'Down'} from past month
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/reports?tab=topproducts')}>
                  <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
                    <img src={TopSelling} alt="Top Selling" className="w-8 h-8" />
                  </div>
                  <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
                    TOP SELLING PRODUCTS
                  </div>
                  {loading ? (
                    <TopProductsSkeleton />
                  ) : dashboardData?.topProducts && dashboardData.topProducts.length > 0 ? (
                    <>
                      {dashboardData.topProducts.slice(0, 3).map((product, index) => (
                        <div key={product.id || index}>
                          <div className="text-xl avantbold text-black">{product.name || 'Product'}</div>
                          <div className="text-sm avant text-black mb-1">{product.sold || 0} sold</div>
                        </div>
                      ))}
                      <div className={`text-sm flex items-center gap-1 mt-2 ${(dashboardData?.productSalesChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <img
                          src={(dashboardData?.productSalesChange || 0) >= 0 ? IncreaseIcon : DecreaseIcon}
                          alt={(dashboardData?.productSalesChange || 0) >= 0 ? "Increase" : "Decrease"}
                          className="w-4 h-4"
                        />
                        <span className='avant'>
                          {formatPercentage(dashboardData?.productSalesChange || 0)} {(dashboardData?.productSalesChange || 0) >= 0 ? 'Up' : 'Down'} from past week
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm avant text-gray-400">No products sold yet</div>
                  )}
                </div>

                {/* Revenue Trends */}
                <div className="bg-white rounded-lg p-6 relative border-2 border-[#000000] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/reports?tab=sales')}>
                  <div className="absolute top-4 right-4 border-2 border-[#000000] rounded-lg p-2">
                    <img src={Revenue} alt="Revenue" className="w-8 h-8" />
                  </div>
                  <div className="text-lg bebas text-gray-600 mb-1 flex items-center gap-2">
                    REVENUE TRENDS
                  </div>
                  {loading ? (
                    <>
                      <SkeletonBox className="h-8 w-32 mb-2" />
                      <SkeletonBox className="h-4 w-32 mb-2" />
                      <SkeletonBox className="h-4 w-40" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl avantbold text-black -mb-1">
                        {formatCurrency(dashboardData?.revenueTrends?.amount || 0)}
                      </div>
                      <div className="text-sm avant text-black mb-2">Only Sales this Week</div>
                      <div className={`text-sm flex items-center gap-1 ${(dashboardData?.revenueTrends?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <img
                          src={(dashboardData?.revenueTrends?.change || 0) >= 0 ? IncreaseIcon : DecreaseIcon}
                          alt={(dashboardData?.revenueTrends?.change || 0) >= 0 ? "Increase" : "Decrease"}
                          className="w-4 h-4"
                        />
                        <span className='avant'>
                          {formatPercentage(dashboardData?.revenueTrends?.change || 0)} {(dashboardData?.revenueTrends?.change || 0) >= 0 ? 'Up' : 'Down'} from yesterday
                        </span>
                      </div>
                    </>
                  )}
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
                className={`flex items-center justify-center cursor-pointer hover:opacity-70 transition select-none ${!canPrev ? "opacity-30 cursor-not-allowed" : ""
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
                {loading ? (
                  <>
                    {[1, 2, 3, 4].map((item) => (
                      <ProductCardSkeleton key={item} />
                    ))}
                  </>
                ) : topPicks.length > 0 ? (
                  topPicks.slice(carouselIndex, carouselIndex + maxVisible).map((item, index) => (
                    <div
                      key={item.id || index}
                      className="relative bg-[#222] overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      {/* Product Image */}
                      <div className="relative w-full h-[250px] flex items-center justify-center overflow-hidden bg-black">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full rounded-none transition-transform duration-300 hover:scale-110"
                          draggable={false}
                          onError={(e) => {
                            // Fallback to default image if product image fails to load
                            const defaultImages = [LyricImage, AgathaImage, RiomImage, CelineImage]
                            e.target.src = defaultImages[index % defaultImages.length]
                          }}
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
                          {item.oldPrice && (
                            <span className="line-through text-[#FFF7DC] opacity-50">
                              {item.oldPrice}
                            </span>
                          )}
                          <span className="text-[#FFF7DC]">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 flex items-center justify-center py-8">
                    <div className="text-[#FFF7DC] avant">No products available</div>
                  </div>
                )}
              </div>

              {/* Next Button - right of cards */}
              <button
                onClick={handleNext}
                disabled={!canNext}
                className={`flex items-center justify-center cursor-pointer hover:opacity-70 transition select-none ${!canNext ? "opacity-30 cursor-not-allowed" : ""
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
