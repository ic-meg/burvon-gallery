import React, { useState } from 'react'
import Layout from '../../../components/Layout'
import { Link } from 'react-router-dom'

import { 
  XWhite, 
  Odyssey, 
  Friden 
} from '../../../assets/index.js'

// products
const products = [
  {
    id: 1,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Odyssey,
    price: 590,
    quantity: 1,
    variant: 'ODYSSEY',
  },
  {
    id: 2,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Friden,
    price: 590,
    quantity: 2,
    variant: 'FRIDEN',
  },
  {
    id: 3,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Odyssey,
    price: 590,
    quantity: 1,
    variant: 'ODYSSEY',
  },
  {
    id: 4,
    name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
    image: Friden,
    price: 590,
    quantity: 1,
    variant: 'FRIDEN',
  },
]

const ShoppingBagMobile = ({
  products,
  subtotal,
  itemCount,
  modalOpen,
  modalImg,
  openModal,
  closeModal,
}) => (
  <div className="lg:hidden w-full min-h-screen bg-[#181818] px-5 pt-2 text-[#fff7dc]">
    {/* Title and subtitle */}
    <Link to="/user/cart/ShoppingBag-Empty">
    <h1 className="text-center bebas tracking-wide mt-26 mb-2" style={{ fontSize: '55px' }}>
      SHOPPING BAG
    </h1>
    </Link>
    <p className="text-center avant text-xs mb-20 mt-[-8px]">
      ALMOST YOURS, READY TO MAKE THEIR WAY TO YOU.
    </p>
    {/* Products scrollable */}
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '340px' }}>
        {products.map((p, i) => (
          <div key={p.id}>
            <div className="flex gap-3 items-start py-4 px-4 text-nowrap relative">
              {/* Product image */}
              <img
                src={p.image}
                alt={p.name}
                className="w-24 h-24 object-cover shadow-lg cursor-pointer border border-[#fff7dc]/20"
                onClick={() => openModal(p.image)}
              />
              {/* Product details */}
              <div className="flex-1 pl-2">
                <div className="avantbold text-xs whitespace-normal leading-tight">
                  Clash Collection Necklaces<br />
                <span>(Elegant Pendant Jewelry)</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="bebas text-xs tracking-wide">{p.variant}</span>
                  <span className="avant text-xs mr-12">Size: N/A</span>
                </div>
                <div className="avantbold text-xs mt-2">
                  ₱ {p.price.toFixed(2)}
                </div>
                {/* quantity content */}
                <div className="flex items-center mt-2">
                  <span className="text-lg cursor-pointer select-none px-2 py-1 rounded hover:bg-[#fff7dc]/10 transition">−</span>
                  <span className="text-xs">{p.quantity}</span> {/* number inside - + */}
                  <span className="text-lg cursor-pointer select-none px-2 py-1 rounded hover:bg-[#fff7dc]/10 transition">+</span>
                </div>
                <div className="avant text-xs mt-2">
                  Subtotal: <span className="avantbold text-xs">₱ {(p.price * p.quantity).toFixed(2)}</span>
                </div>
              </div>
              {/* Remove button */}
              <button className="absolute top-4 right-2 z-10">
                <img src={XWhite} alt="Remove" className="w-4 h-4" />
              </button>
            </div>
            {/* Divider line between products */}
            {i < products.length - 1 && (
              <hr className="my-2 border-[#fff7dc]/30" />
            )}
          </div>
        ))}
      </div>
      {/* info and actions */}
      <div className="w-full max-w-md mx-auto bg-[#181818] p-4 pt-20">
        <div className="flex justify-between mb-2 avantbold text-base">
          <span>Subtotal ( {itemCount} items )</span>
          <span>₱ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 avantbold text-base">
          <span>Discount</span>
          <span>-</span>
        </div>
        <div className="flex justify-between mb-2 avantbold text-base">
          <span>Shipping Fee</span>
          <span>-</span>
        </div>
        <hr className="my-4 border-[#fff7dc]/30" />
        <button className="w-full py-3 rounded bg-[#fff7dc] text-[#181818] avantbold text-base tracking-wide shadow hover:bg-[#ffe9b3] transition">
          PROCEED TO CHECKOUT
        </button>
        <div className="text-center mt-4 avantbold text-base text-[#fff7dc]">
          CONTINUE SHOPPING...
        </div>
        <div className="text-center text-[#fff7dc] mt-8 mb-5 avant text-xs">
          Shipping and discounts are calculated at checkout.
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
          className="max-w-full max-h-full shadow-lg"
          onClick={closeModal}
        />
      </div>
    )}
  </div>
)

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
      {/* Desktop layout */}
      <div className="hidden lg:block min-h-screen bg-[#181818] py-10 px-0 bebas text-[#fff7dc]">
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
        <p className="text-center avant text-md mb-30 mt-[-18px] ml-[-18px]">ALMOST YOURS, READY TO MAKE THEIR WAY TO YOU.</p>

        <div className="w-full max-w-[1600px] mx-auto flex gap-2 px-12">
          {/* left: scrollable products */}
          <div className="flex-[2.2] overflow-y-auto custom-scrollbar ml-2" style={{ maxHeight: '370px', background: 'rgba(24,24,24,0.98)' }}>
            {/* product title */}
            <div className="grid grid-cols-4 avant text-xl border-b border-[#fff7dc]/30 pb-2 mb-2 sticky top-0 bg-[#181818] z-10">
              <div className="pl-2">Item/s</div>
              <div className="pl-53">Price</div>
              <div className="pl-36">Quantity</div>
              <div className="text-center">Subtotal</div>
            </div>
            {products.map((p, i) => (
              <div key={p.id} className="grid grid-cols-4 items-center border-b border-[#fff7dc]/10 py-6 hover:bg-[#232323] transition-all duration-200">
                <div className="flex items-center gap-5 min-w-[340px]">
                  {/* remove button */}
                  <button className="mr-2 flex-shrink-0 hover:bg-[#fff7dc]/10 rounded-full p-1 transition">
                    <img src={XWhite} alt="Remove" className="w-5 h-5" />
                  </button>
                  {/* product image and details */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-lg flex-shrink-0 cursor-pointer border border-[#fff7dc]/20 hover:scale-105 transition"
                    onClick={() => openModal(p.image)}
                  />
                  <div>
                    <div className="avantbold text-md whitespace-nowrap leading-tight">
                      Clash Collection Necklaces
                    </div>
                    <div className="avantbold text-md whitespace-nowrap leading-tight">
                      (Elegant Pendant Jewelry)
                    </div>
                    <div className="bebas text-md mt-1 whitespace-nowrap tracking-wide">
                      {p.variant} 
                    </div>
                    <div className="avant text-md mt-[-2px] opacity-60 whitespace-nowrap">
                      Size: N/A
                    </div>
                  </div>
                </div>
                <div className="avantbold text-lg pl-50 text-nowrap">₱ {p.price.toFixed(2)}</div> {/* price content */}
                <div className="text-center avantbold flex items-center justify-center pl-35">
                  <span className="text-2xl cursor-pointer select-none px-2 py-1 rounded hover:bg-[#fff7dc]/10 transition">−</span>
                  <span className="text-lg">{p.quantity}</span> {/* number in quantity */}
                  <span className="text-2xl cursor-pointer select-none px-2 py-1 rounded hover:bg-[#fff7dc]/10 transition">+</span>
                </div>
                {/* subtotal */}
                <div className="text-center avantbold text-lg">₱ {(p.price * p.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          {/* right: sticky */}
          <div className="w-full max-w-xl avant text-base sticky top-36 h-fit self-start">
            <div className="flex flex-col gap-2 bg-[#181818] p-8">
              {/* subtotal */}
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Subtotal ( {itemCount} items )</span>
                <span>₱ {subtotal.toFixed(2)}</span>
              </div>
              {/* discount */}
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Discount</span>
                <span>-</span>
              </div>
              {/* shipping */}
              <div className="flex justify-between mb-2 avantbold text-lg">
                <span>Shipping Fee</span>
                <span>-</span>
              </div>
              <div className="flex justify-between avantbold text-xl mt-4 border-t border-[#fff7dc]/30 pt-2">
               
              </div>
              <button className="w-full mt-3 py-4 rounded-xl bg-[#fff7dc] text-[#181818] avantbold text-lg tracking-wide shadow-md hover:bg-[#ffe9b3] transition">
                PROCEED TO CHECKOUT
              </button>
              <div className="text-center mt-6 avantbold text-lg text-[#fff7dc]">
                CONTINUE SHOPPING...
              </div>
              <div className="text-center text-[#fff7dc] mt-5 avant text-xs">
                Shipping and discounts are calculated at checkout
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
              className="max-w-full max-h-full shadow-lg"
              onClick={closeModal}
            />
          </div>
        )}
      </div>
      {/* Mobile layout */}
      <ShoppingBagMobile
        products={products}
        subtotal={subtotal}
        itemCount={itemCount}
        modalOpen={modalOpen}
        modalImg={modalImg}
        openModal={openModal}
        closeModal={closeModal}
      />
    </Layout>
  )
}

export default ShoppingBag
