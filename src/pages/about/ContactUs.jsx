import React, { useState } from 'react';
import './ContactUs.css'
import Layout from '../../components/Layout';
import contactBG from '../../assets/images/contactBG.png';
import contactBG1 from '../../assets/images/contactBG1.png';
import contactGmail from '../../assets/icons/contactGmail.png';
import contactFB from '../../assets/icons/contactFB.png';
import contactTiktok from '../../assets/icons/contactTiktok.png';
import contactIG from '../../assets/icons/contactIG.png';
import contactVector from '../../assets/images/contactVector.png';

function CustomSelect({ options, placeholder, value, onChange }) {
  const [open, setOpen] = useState(false);
    // select topic section
  return (
    <div className="relative w-full avant">
      <div
        className="bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 text-[#FFF7DC] text-base cursor-pointer flex items-center"
        style={{ fontSize: '1.1rem', paddingRight: '2.5rem', position: 'relative' }}
        onClick={() => setOpen(!open)}
      >
        <span
          style={{
            color: '#FFF7DC',
            opacity: value ? 1 : 0.9, //opacity for topic placeholder
          }}
        >
          {value ? options.find(opt => opt.value === value).label : placeholder}
        </span>
        {/* arrow css */}
        <span
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            borderRight: '2px solid #FFF7DC',
            borderBottom: '2px solid #FFF7DC',
            width: '0.7em',
            height: '0.7em',
            pointerEvents: 'none',
            display: 'block',
          }}
        />
      </div>
      {/* dropdown */}
      {open && (
        <div className="absolute left-0 right-0 bg-[#181818] rounded-xl mt-1 z-10 border border-[#FFF7DC]">
          {options.map(opt => (
            <div
              key={opt.value}
              className="px-4 py-2 cursor-pointer hover:bg-[#232323] text-[#FFF7DC]"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{ fontSize: '1.1rem' }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ContactUs = () => {
  const [topic, setTopic] = React.useState('');

  return (
    <Layout full>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row min-h-screen">
        
        {/* desktop: left form */}
        <div
          className="flex flex-col justify-start px-29 py-20"
          style={{
            width: '100%',
            minWidth: 700,
            maxWidth: 900,
            alignItems: 'flex-start',
          }}
        >
          <h1
            className="bebas font-bold"
            style={{
              color: '#FFF7DC',
              fontSize: '6.2rem',
              marginBottom: '0.5rem',
              marginTop: '32px',
              letterSpacing: '1px',
            }}
          >
            GET IN TOUCH
          </h1>
          <p
            className="avant"
            style={{
              color: '#FFF7DC',
              fontSize: '1.15rem',
              marginBottom: '2.2rem',
              maxWidth: 650, // wider paragraph
              lineHeight: '1.6',
            }}
          >
            If you have any questions or need help, <span style={{ fontWeight: 'bold' }}>Burvon's</span> got you, <span style={{ fontWeight: 'bold' }}>Rebels</span>. Whether you’re curious about our collections, looking for styling tips, or wondering where to checkout out pieces—we’re here for you.
          </p>
          <form className="w-full" style={{ maxWidth: 600 }}>

            {/* desktop: name */}
            <div className="flex flex-row gap-6 mb-5">
              <div className="flex-1">
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="name" style={{ fontSize: '1.3rem' }}>NAME</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                  style={{ fontSize: '1.1rem' }}
                />
              </div>
              <div className="flex-1">

                {/* desktop: order no. */}
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="orderNo" style={{ fontSize: '1.3rem' }}>ORDER NO.</label>
                <input
                  id="orderNo"
                  type="text"
                  placeholder="Order no. if applicable"
                  className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                  style={{ fontSize: '1.1rem' }}
                />
              </div>
            </div> {/* desktop: name and order no. */}

            <div className="flex flex-row gap-6 mb-5 items-center">
              <div className="flex-1">

                {/* desktop: email */}
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="email" style={{ fontSize: '1.3rem' }}>EMAIL</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                  style={{ fontSize: '1.1rem', height: '51px' }}
                />
              </div>

              {/* desktop: topic */}
              <div className="flex-1">
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="topic" style={{ fontSize: '1.3rem' }}>TOPIC</label>
                <CustomSelect
                  options={[
                    { value: 'collections', label: 'Collections' },
                    { value: 'styling', label: 'Styling Tips' },
                    { value: 'checkout', label: 'Checkout' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select a Topic"
                  value={topic}
                  onChange={setTopic}
                />
              </div>
            </div> {/* desktop: email and topic */}

            {/* desktop: message */}
            <div className="mb-5">
              <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="message" style={{ fontSize: '1.3rem' }}>MESSAGE</label>
              <textarea
                id="message"
                placeholder="Type your message here"
                className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                style={{ fontSize: '1.1rem', minHeight: '100px' }}
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full avant font-bold text-lg rounded-md py-3 mt-2"
              style={{
                backgroundColor: '#FFF7DC',
                color: '#181818',
                letterSpacing: '1px',
                marginBottom: '1.5rem',
                fontWeight: 600,
              }}
            >
              SUBMIT
            </button>
          </form>

          {/* desktop: socials */}
          <div className="mt-2 text-center" style={{ width: '100%', translate: '-40px 0' }}>
            <p className="avant text-[#FFF7DC] mb-2" style={{ fontSize: '1rem', letterSpacing: '1px' }}>
              EXCITED? TELL US MORE ABOUT IT!
            </p>
            <div className="flex flex-row justify-center gap-6 text-[#FFF7DC] text-2xl mt-4">
              <img src={contactGmail} alt="Gmail" className="h-6 w-6" />
              <img src={contactFB} alt="Facebook" className="h-6 w-6" />
              <img src={contactTiktok} alt="TikTok" className="h-6 w-6" />
              <img src={contactIG} alt="Instagram" className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* desktop: model image */}
        <div className="flex-1 flex items-stretch justify-end m-0 p-0" 
        style={{ 
            marginTop: 60,
            marginLeft: '-55px',
            overflow: 'hidden',   // Prevent overflow into footer
            minHeight: '100%',    // Ensure the section is tall enough
            }}
        >
          {/* desktop: vector */}
          <img
            src={contactVector}
            alt="Vector"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '930px', 
              height: 'auto',
              zIndex: 1,
              pointerEvents: 'none',
              translate: '500px 0',
            }}
          />
          <img
            src={contactBG}
            alt="Contact"
            style={{
              width: '120%',
              height: '120%',
              objectFit: 'cover',
              objectPosition: 'top right',
              margin: 0,
              padding: 0,
              border: 'none',
              display: 'block',
              position: 'relative',
              zIndex: 2,
              minHeight: 'calc(100vh - 6rem)',
            }}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden min-h-screen">

        {/* mobile: model image */}
        <div className="w-full relative" style={{ marginTop: 26, marginBottom: -40 }}>
          <img
            src={contactBG1}
            alt="Contact"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              
             
              border: 'none',
              display: 'block',
            }} />

          {/* mobile: get in touch overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{
               
              padding: '0 1rem',
            }}
          >
            <h1
              className="bebas font-bold"
              style={{
                color: '#FFF7DC',
                fontSize: '2.2rem',
                marginBottom: '0.3rem',
                letterSpacing: '1px',
                marginTop: '-2.6rem',
              }}
            >
              GET IN TOUCH
            </h1>
            <p
              className="avant"
              style={{
                color: '#FFF7DC',
                fontSize: '0.95rem',
                maxWidth: 400,
                lineHeight: '1.5',
                margin: 0,
              }}
            >
              If you have any questions or need help, <span style={{ fontWeight: 'bold' }}>Burvon's</span> got you, <span style={{ fontWeight: 'bold' }}>Rebels</span>. Whether you're curious about our colections, looking for styling tips, or wondering where to checkout out pieces — we're here for you. 
            </p>
          </div>
        </div>

        {/* mobile: form and socials */}
        <div
          className="flex flex-col items-center justify-center px-6"
          style={{
            width: '100%',
            minHeight: '100%',
          }}
        >
          <form className="w-full px-6" style={{ maxWidth: 400 }}>

            {/* mobile: name */}
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="name" style={{ fontSize: '1.3rem' }}>NAME</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                  style={{ fontSize: '1.1rem' }}
                />
              </div>

              {/* mobile: order no. */}
              <div>
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="orderNo" style={{ fontSize: '1.3rem' }}>ORDER NO.</label>
                <input
                  id="orderNo"
                  type="text"
                  placeholder="Order no. if applicable"
                  className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                  style={{ fontSize: '1.1rem' }}
                />
              </div>
            </div> {/* mobile: name and order no. */}

            <div className="flex flex-col gap-4 mb-4">

                {/* mobile: email */}
              <div>
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="email" style={{ fontSize: '1.3rem' }}>EMAIL</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                  style={{ fontSize: '1.1rem' }}
                />
              </div>

              {/* mobile: topic */}
              <div>
                <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="topic" style={{ fontSize: '1.3rem' }}>TOPIC</label>
                <CustomSelect
                  options={[
                    { value: 'collections', label: 'Collections' },
                    { value: 'styling', label: 'Styling Tips' },
                    { value: 'checkout', label: 'Checkout' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select a Topic"
                  value={topic}
                  onChange={setTopic}
                />
              </div>
            </div> {/* mobile: email and topic */}

            {/* mobile: message */}
            <div className="mb-4">
              <label className="bebas text-[#FFF7DC] text-lg mb-2 block" htmlFor="message" style={{ fontSize: '1.3rem' }}>MESSAGE</label>
              <textarea
                id="message"
                placeholder="Type your message here"
                className="w-full avant bg-transparent border border-[#FFF7DC] rounded-xl px-4 py-3 mt-1 text-[#FFF7DC] text-base focus:outline-none"
                style={{ fontSize: '1.1rem', minHeight: '100px' }}
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full avant font-bold text-lg rounded-md py-3 mt-2"
              style={{
                backgroundColor: '#FFF7DC',
                color: '#181818',
                letterSpacing: '1px',
                marginBottom: '1.5rem',
                fontWeight: 600,
              }}
            >
              SUBMIT
            </button>
          </form>

          {/* mobile: socials */}
          <div className="-mt-7 text-center py-9 w-full">
            <p className="avant text-[#FFF7DC] mb-2" style={{ fontSize: '1rem', letterSpacing: '1px' }}>
              EXCITED? TELL US MORE ABOUT IT!
            </p>
            <div className="flex flex-row justify-center gap-6 text-[#FFF7DC] text-2xl mt-4">
              <img src={contactGmail} alt="Gmail" className="h-6 w-6" />
              <img src={contactFB} alt="Facebook" className="h-6 w-6" />
              <img src={contactTiktok} alt="TikTok" className="h-6 w-6" />
              <img src={contactIG} alt="Instagram" className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;