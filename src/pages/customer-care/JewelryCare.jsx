import React from 'react';
import './JewelryCare.css';
import Header from '../../components/header';
import Footer from '../../components/Footer';
import jewelrycareBG from '../../assets/images/jewelrycareBG.png';
import gentleCleanseIcon from '../../assets/icons/gentle-cleanse.png';
import rinseOffIcon from '../../assets/icons/rinse-off.png';
import dryAirIcon from '../../assets/icons/dry-air.png';
import checkIcon from '../../assets/icons/check-do.png';
import xIcon from '../../assets/icons/x-dont.png';

const JewelryCare = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* model image */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${jewelrycareBG})`,
          minHeight: '801px', 
          marginTop: '96px',
          
        }}
      >
        {/* title*/}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#FFF7DC] px-6"
          style={{ top: '50%', transform: 'translateY(-110%)' }}
        >
          <h1 className="font-bold bebas"
            style={{fontSize: '4.5rem'}}
          >
            JEWELRY CARE
          </h1>
          <p className="avant"
            style={{ top: '50%', transform: 'translateY(-40%)', fontSize: '1rem' }}
          >
            Even rebels know how to treat their treasures right.
          </p>
        </div>

        {/* content boxes */}
        <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-start text-[#FFF7DC] px-6"
          style={{ top: '50%', transform: 'translateY(-30%)' }}
        >
          {/* gentle cleanse */}
          <div
            className="flex flex-col text-left mx-4 mb-8 md:mb-0 p-6"
            style={{
              backgroundColor: 'rgba(24, 24, 24, 0.7)', 
              borderRadius: '10px', 
              width: '350px', 
              height: '240px',
            }}
          >
            <img src={gentleCleanseIcon} alt="Gentle Cleanse" className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-bold avant-demi">GENTLE CLEANSE</h3>
            <p className="text-sm avant mt-3">
              Dip a <span style={{ textShadow: '0 0 5px #FFF7DC' }}>soft cloth</span> or <span style={{ textShadow: '0 0 5px #FFF7DC' }}>microfiber cloth</span> in <span style={{ textShadow: '0 0 5px #FFF7DC' }}>warm water</span> and <span style={{ textShadow: '0 0 5px #FFF7DC' }}>gentle soap</span> combination. Use this to clean your jewelry. Make sure to clean <span style={{ textShadow: '0 0 5px #FFF7DC' }}>all</span> sides.
            </p>
          </div>

          {/* rinse off */}
          <div
            className="flex flex-col text-left mx-4 mb-8 md:mb-0 p-6"
            style={{
              backgroundColor: 'rgba(24, 24, 24, 0.7)', 
              borderRadius: '10px', 
              width: '350px', 
              height: '240px',
            }}
          >
            <img src={rinseOffIcon} alt="Rinse Off" className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-bold avant-demi">RINSE OFF</h3>
            <p className="text-sm avant mt-3">
              To rinse off, use <span style={{ textShadow: '0 0 5px #FFF7DC' }}>soft cloth</span> or <span style={{ textShadow: '0 0 5px #FFF7DC' }}>microfiber cloth</span> dipped in clean water. Wipe off any soap residue until jewelry is polished.
            </p>
          </div>

          {/* dry & air */}
          <div
            className="flex flex-col text-left mx-4 p-6"
            style={{
              backgroundColor: 'rgba(24, 24, 24, 0.7)', 
              borderRadius: '10px', 
              width: '350px', 
              height: '240px',
            }}
          >
            <img src={dryAirIcon} alt="Dry & Air" className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-bold avant-demi">DRY & AIR</h3>
            <p className="text-sm avant mt-3">
              <span style={{ textShadow: '0 0 5px #FFF7DC' }}>Dry</span> jewelry with <span style={{ textShadow: '0 0 5px #FFF7DC' }}>soft cloth</span> or <span style={{ textShadow: '0 0 5px #FFF7DC' }}>microfiber cloth</span> and <span style={{ textShadow: '0 0 5px #FFF7DC' }}>leave</span> to <span style={{ textShadow: '0 0 5px #FFF7DC' }}>air dry</span> on a <span style={{ textShadow: '0 0 5px #FFF7DC' }}>cool dry place.</span>
            </p>
          </div>
        </div>
      </div>

      {/* do's and dont's section */}
      <div className="flex flex-row justify-between items-start">

        {/* do */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-0 py-16"
          style={{
            backgroundColor: 'rgba(126,123,123,0.22)', 
            marginRight: '16px',
            minWidth: '820px',
            maxWidth: '760px',
            height: '800px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            className="avant-demi"
            style={{
              fontSize: '2.7rem',
              fontWeight: 700,
              color: '#FFF7DC',
              marginBottom: '40px',
              textAlign: 'center',
              letterSpacing: '1px',
              width: '100%',
            }}
          >
            DO
          </h3>
          <ul className="flex flex-col items-start w-3/4"
          style={{ top: '50%', transform: 'translateX(14%)' }}>
            <li className="flex items-center mb-8">
              <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
              <span className="avant" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Store jewelry in a clean, dry box.
              </span>
            </li>
            <li className="flex items-center mb-8">
              <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
              <span className="avant-book" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Hang necklaces to prevent tangling.
              </span>
            </li>
            <li className="flex items-center mb-8">
              <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
              <span className="avant-book" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Clean your pieces regularly with a soft cloth.
              </span>
            </li>
            <li className="flex items-center">
              <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
              <span className="avant-book" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Use individual pouches for each item.
              </span>
            </li>
          </ul>
        </div>

        {/* don't */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-0 py-16"
          style={{
            
            minWidth: '500px',
            
            height: '800px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            className="avant-demi"
            style={{
              fontSize: '2.7rem',
              fontWeight: 700,
              color: '#FFF7DC',
              marginBottom: '40px',
              textAlign: 'center',
              letterSpacing: '1px',
              width: '100%',
            }}
          >
            DON'T
          </h3>
          <ul className="flex flex-col items-start w-3/4"
            style={{ top: '50%', transform: 'translateX(14%)' }}>
            <li className="flex items-center mb-8">
              <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
              <span className="avant-book" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Leave jewelry in humid or wet places.
              </span>
            </li>
            <li className="flex items-center mb-8">
              <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
              <span className="avant-book" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Toss them together in a pouch or drawer.
              </span>
            </li>
            <li className="flex items-center mb-8">
              <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
              <span className="avant-book" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Use harsh chemicals or rough brushes.
              </span>
            </li>
            <li className="flex items-center">
              <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
              <span className="avant-book" style={{ color: '#FFF7DC', fontSize: '1.55rem', textAlign: 'left' }}>
                Mix different pieces together.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JewelryCare;