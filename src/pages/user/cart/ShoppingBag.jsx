import React, { useState } from 'react'
import Layout from '../../../components/Layout'
import { Link } from 'react-router-dom'

import { 
  XWhite, 
  Odyssey, 
  Friden 
} from '../../../assets/index.js'

const products = [
  {
    id: 1,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Odyssey,
    price: 590,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Friden,
    price: 590,
    quantity: 2,
  },
]

const ShoppingBag = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImg, setModalImg] = useState(null)

  const openModal = (img) => {
    setModalImg(img)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalImg(null)
  }

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const shipping = 80
  const total = subtotal + shipping
  const itemCount = products.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <Layout full>
      <div className="min-h-screen bg-[#181818] py-10 px-4 bebas text-[#fff7dc]">
        {/* shopping bag title */}
        <Link to="/user/cart/ShoppingBag-Empty">
          <h1 
            className="text-center bebas mb-2 tracking-wide mt-36" 
            style={{ fontSize: '80px' }}
          >
            SHOPPING BAG
          </h1>
        </Link>
        
        {/* subtitle */}
        <p className="text-center avant text-md mb-30 mt-[-18px]">ALMOST YOURS, READY TO MAKE THEIR WAY TO YOU.</p>
        <div className="w-full max-w-7xl mx-auto">
          {/* product title */}
          <div className="grid grid-cols-5 avant text-xl border-b border-[#fff7dc]/30 pb-2 mb-2">
            <div>Product/s</div>
            <div className="pl-37">Size</div>
            <div className="pl-26">Price</div>
            <div className="pl-23">Quantity</div>
            <div className="pl-23">Subtotal</div>
          </div>
          {products.map((p, i) => (
            <div key={p.id} className="grid grid-cols-5 items-center border-b border-[#fff7dc]/20 py-4">
              <div className="flex items-center gap-3 min-w-[340px]">
                {/* remove button */}
                <button className="mr-2 flex-shrink-0">
                  <img src={XWhite} alt="Remove" className="w-5 h-5" />
                </button>
                {/* product image and details */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-24 h-24 object-cover rounded flex-shrink-0 cursor-pointer"
                  onClick={() => openModal(p.image)}
                />
                <div>
                  <div className="avantbold text-md whitespace-nowrap">
                    Clash Collection Necklaces
                  </div>
                  <div className="avantbold text-md whitespace-nowrap">
                    (Elegant Pendant Jewelry)
                  </div>
                  <div className="bebas text-md opacity-60 mt-1 whitespace-nowrap">
                    {i === 0 ? 'ODYSSEY' : 'FRIDEN'}
                  </div>
                </div>
              </div>
              <div className="text-center pl-18 avantbold">-</div>
              <div className="text-center avantbold">₱ {p.price.toFixed(2)}</div>
              <div className="text-center avantbold">{p.quantity}</div>
              <div className="text-center avantbold">₱ {(p.price * p.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-end mt-8 mb-10">
            <div className="w-full max-w-md avant text-base">
              {/* subtotal */}
              <div className="flex justify-between mb-2 avantbold">
                <span>Subtotal ( {itemCount} items )</span>
                <span>₱ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 avantbold">
                {/* shipping */}
                <span>Shipping</span>
                <span>₱ {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between avantbold text-xl mt-4 border-t border-[#fff7dc]/30 pt-2">
              {/* total */}
                <span>Total</span>
                <span>₱ {total.toFixed(2)}</span>
              </div>
              <button className="w-full mt-6 py-3 rounded bg-[#fff7dc] text-[#181818] avantbold text-md tracking-wide">
                PROCEED TO CHECKOUT
              </button>
              <div className="text-center mt-4 avantbold text-md">
                Continue Shopping...
              </div>
            </div>
          </div>
        </div>
        {/* fullscreen modal when image clicked */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
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
      </div>
    </Layout>
  )
}

export default ShoppingBag
