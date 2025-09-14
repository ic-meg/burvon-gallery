import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout'
import './Shipping.css'
import returnGuidelines from '../../assets/icons/returnGuidelines.png'
import returnDamage from '../../assets/icons/returnDamage.png'
import returnShipping from '../../assets/icons/returnShipping.png'
import shippingRectangle from '../../assets/icons/shippingRectangle.png'

const boxData = [
  {
    icon: returnGuidelines,
    title: 'RETURN GUIDELINES',
    desc: 'Items must be returned within 7 days of delivery. Must be unused, in original packaging, and with tags intact.',
  },
  {
    icon: returnDamage,
    title: 'RECEIVE A DAMAGE OR WRONG ITEM?',
    desc: 'Please contact us within 48 hours of delivery for assistance. We’ll arrange a replacement or refund, depending on the case.',
  },
  {
    icon: returnShipping,
    title: 'RETURN SHIPPING',
    desc: 'Customers are responsible for return shipping fees, unless the item was received damaged or incorrect. We recommend using a trackable courier service.',
  },
]

const ReturnPolicy = () => {
  // For autoplay
  const scrollRef = useRef(null);
  const [current, setCurrent] = useState(0);

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % boxData.length);
    }, 5000); // 5 seconds per box
    return () => clearInterval(interval);
  }, []);

  // Scroll to current box
  useEffect(() => {
    if (scrollRef.current) {
      const box = scrollRef.current.children[current];
      if (box) {
        box.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [current]);

  return (
    <Layout full>
      {/* Desktop Return */}
      <div className="hidden md:block">
        {/* desktop: header */}
        <div style={{
          textAlign: 'center',
          paddingTop: '8rem',
          paddingBottom: '2.5rem',
          background: 'transparent',
        }}>
          <h1
            className="bebas"
            style={{
              color: '#fff7dc',
              fontSize: '6.5rem',
              letterSpacing: '2px',
              marginBottom: '0.5rem',
            }}
          >
            RETURN POLICY
          </h1>
          <h2
            className="avant"
            style={{
              color: '#fff7dc',
              fontSize: '1.7rem',
              fontWeight: 'normal',
              letterSpacing: '1px',
              marginBottom: '0.5rem',
              marginTop: '-1.3rem',
            }}
          >
            WE WANT YOU TO LOVE EVERY PIECE.
          </h2>
        </div>
        {/* desktop: main container */}
        <div
          style={{
            background: '#262627',
            minHeight: '60vh',
            position: 'relative',
          }}
        >
          {/* desktop: empty space above of 5boxes */}
          <div style={{ height: '100px' }}></div>

          {/* desktop: boxes container */}
          <div
            style={{
              maxWidth: '1400px', // alter the width in "focus on 3 boxes only" if you change this
              margin: '0 auto',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* desktop: 1st row of 3 boxes */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem', // gap between 3 boxes
                marginBottom: '2.5rem',
              }}
            >
              {boxData.slice(0, 3).map((box) => (
                <div // focus on 3 boxes only
                  key={box.title}
                  style={{
                    background: '#181818',
                    borderRadius: '18px',
                    boxShadow: '0 4px 24px 0 rgba(211, 240, 83, 0.05)',
                    width: '520px', // alter the max width in "boxes container" if you change this
                    minHeight: '180px',
                    position: 'relative',
                    padding: '2.5rem 1.5rem 1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {/* desktop: rectangle and icons of 1st row */}
                  <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                    <img
                      src={shippingRectangle}
                      alt="rectangle"
                      style={{ width: '150px', height: '50px', objectFit: 'contain', display: 'block' }}
                    />
                    <img
                      src={box.icon}
                      alt={box.title}
                      style={{
                        position: 'absolute',
                        top: '1px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50px',
                        height: '50px',
                      }}
                    />
                  </div>
                  {/* desktop: 1st row title */}
                  <h3
                    className="bebas"
                    style={{
                      color: '#fff7dc',
                      fontSize: '1.7rem',
                      marginTop: '24px',
                      marginBottom: '0.7rem',
                      letterSpacing: '1px',
                      textAlign: 'center',
                    }}
                  >
                    {box.title}
                  </h3>
                  {/* desktop: 1st row description */}
                  <div
                    className="avant"
                    style={{
                      color: '#fff7dc',
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      letterSpacing: '0.5px',
                      lineHeight: '1.6',
                    }}
                  >
                    {box.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Return */}
      <div className="md:hidden" style={{
        minHeight: '70vh',
        padding: '2rem 0 2rem 0',
      }}>
        {/* mobile: header */}
        <div style={{
          textAlign: 'center',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          background: 'transparent',
        }}>
          <h1
            className="bebas"
            style={{
              color: '#fff7dc',
              fontSize: '3.7rem',
              letterSpacing: '2px',
              marginBottom: '0.5rem',
              marginTop: '2rem',
            }}
          >
            RETURN POLICY
          </h1>
          <h2
            className="avant"
            style={{
              color: '#fff7dc',
              fontSize: '1.2rem',
              fontWeight: 'normal',
              letterSpacing: '-1px',
              marginTop: '-0.7rem',
            }}
          >
            WE WANT YOU TO LOVE EVERY PIECE.
          </h2>
        </div>
        
        {/* mobile: boxes only move */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              gap: '1rem',
              padding: '2rem 0.5rem',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="hide-scrollbar"
          >
            {boxData.map((box, idx) => ( 
              <div // focus on 3 boxes only
                key={box.title}
                style={{
                  background: '#181818',
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px 0 rgba(211, 240, 83, 0.05)', 
                  minWidth: '95vw',
                  maxWidth: '320px',
                  flex: '0 0 auto',
                  minHeight: '200px',
                  position: 'relative',
                  padding: '2.5rem 1.2rem 1.5rem 1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  scrollSnapAlign: 'center',
                }}
              >
                {/* mobile: rectangle and icon */}
                <div style={{
                  position: 'absolute',
                  top: '-15px', // move the rectangle up
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2
                }}>
                  <img
                    src={shippingRectangle}
                    alt="rectangle"
                    style={{ width: '90px', height: '40px', objectFit: 'contain', display: 'block' }}
                  />
                  <img
                    src={box.icon}
                    alt={box.title}
                    style={{
                      position: 'absolute',
                      top: '4px', // move the icon up, use negative if you  want to move up
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '32px',
                      height: '32px',
                    }}
                  />
                </div>
                {/* mobile: title */}
                <h3
                  className="bebas"
                  style={{
                    color: '#fff7dc',
                    fontSize: '1.2rem',
                    marginTop: '7px',
                    marginBottom: '0.7rem',
                    letterSpacing: '1px',
                    textAlign: 'center',
                  }}
                >
                  {box.title}
                </h3>
                {/* mobile: description */}
                <div
                  className="avant"
                  style={{
                    color: '#fff7dc',
                    fontSize: '1rem',
                    textAlign: 'center',
                    fontWeight: 'normal',
                    letterSpacing: '0.5px',
                    lineHeight: '1.2', // adjust lang if you don't like the bigger gap
                  }}
                >
                  {box.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReturnPolicy