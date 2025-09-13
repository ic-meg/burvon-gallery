import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout'
import './Shipping.css'
import shippingCoverage from '../../assets/icons/shippingPhil.png'
import shippingMethods from '../../assets/icons/shippingEstimated.png'
import shippingProcessing from '../../assets/icons/shippingProcess.png'
import shippingDelivery from '../../assets/icons/shippingDelivery.png'
import shippingFees from '../../assets/icons/shippingFees.png'
import shippingRectangle from '../../assets/icons/shippingRectangle.png'

const boxData = [
  {
    icon: shippingCoverage,
    title: 'SHIPPING COVERAGE',
    desc: 'We ship across the Philippines.',
  },
  {
    icon: shippingMethods,
    title: 'DELIVERY METHODS',
    desc: 'Delivered safely and on time with J&T Express, Flash Express, and Ninja Van.',
  },
  {
    icon: shippingProcessing,
    title: 'PROCESSING TIME',
    desc: 'Orders are processed within 1–2 business days.',
  },
  {
    icon: shippingDelivery,
    title: 'ESTIMATED DELIVERY TIME',
    desc: (
      <>
        Metro Manila: 2–4 business days<br />
        Luzon: 3–6 business days<br />
        Visayas & Mindanao: 5–10 business days
      </>
    ),
  },
  {
    icon: shippingFees,
    title: 'SHIPPING FEES',
    desc: (
      <>
        Metro Manila: ₱99<br />
        Luzon/Visayas/Mindanao: ₱120–₱150<br />
        FREE shipping on orders over ₱2,000
      </>
    ),
  },
]

const Shipping = () => {
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
      {/* Desktop Shipping */}
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
            SHIPPING POLICY
          </h1>
          <h2
            className="avant"
            style={{
              color: '#fff7dc',
              fontSize: '1.7rem',
              fontWeight: 'normal',
              letterSpacing: '1px',
              marginBottom: '0.5rem',
              marginTop: '-1rem',
            }}
          >
            HANDLED WITH CARE. DELIVERED WITH ELEGANCE.
          </h2>
        </div>
        {/* desktop: main container */}
        <div
          style={{
            background: '#262627',
            minHeight: '60vh',
            paddingBottom: '4rem',
            position: 'relative',
          }}
        >
          {/* desktop: empty space above of 5boxes */}
          <div style={{ height: '100px' }}></div>

          {/* desktop: boxes container */}
          <div
            style={{
              maxWidth: '1200px',
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
                gap: '4rem', // gap between 3 boxes
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
                    width: '390px',
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
            {/* desktop: second row of 2 boxes */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '4rem',
              }}
            >
              {boxData.slice(3, 5).map((box) => (
                <div
                  key={box.title}
                  style={{
                    background: '#181818',
                    borderRadius: '18px',
                    boxShadow: '0 4px 24px 0 rgba(211, 240, 83, 0.05)',
                    width: '390px',
                    minHeight: '180px',
                    position: 'relative',
                    padding: '2.5rem 1.5rem 1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {/* desktop: rectangle and icons of 2nd row */}
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
                  {/* desktop: 2nd row title */}
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
                  {/* desktop: 2nd row description */}
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
          {/* desktop: additional note */}
          <div className="avant" style={{
            textAlign: 'center',
            marginTop: '3rem',
            color: '#fff7dc',
            fontSize: '1rem',
            position: 'relative',
            zIndex: 10,
          }}>
            Delays may occur during peak seasons or due to courier constraints.
          </div>
        </div>
      </div>

      {/* Mobile Shipping */}
      <div className="md:hidden" style={{
        minHeight: '100vh',
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
            SHIPPING POLICY
          </h1>
          <h2
            className="avant"
            style={{
              color: '#fff7dc',
              fontSize: '1.2rem',
              fontWeight: 'normal',
              letterSpacing: '-1px',
              marginTop: '-3px',
            }}
          >
            HANDLED WITH CARE. DELIVERED WITH ELEGANCE.
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
              gap: '1.5rem',
              padding: '2rem 0.5rem',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="hide-scrollbar"
          >
            {boxData.map((box, idx) => ( 
              <div // focus on 5 boxes only
                key={box.title}
                style={{
                  background: '#181818',
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px 0 rgba(211, 240, 83, 0.05)', 
                  minWidth: '75vw',
                  maxWidth: '320px',
                  flex: '0 0 auto',
                  minHeight: '180px',
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
                    marginTop: '24px',
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
        {/* mobile: additional note */}
        <div className="avant" style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#fff7dc',
          fontSize: '0.95rem',
          opacity: 0.7,
        }}>
          Delays may occur during peak seasons or due to courier constraints.
        </div>
      </div>
    </Layout>
  )
}

export default Shipping