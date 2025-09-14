import React, { useState } from 'react';
import './FAQs.css';

import Layout from '../../components/Layout';

import {
  faqsBG, 
  faqsBG1,
  dropdownIcon,
} from '../../assets/index.js';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "HOW DO I TAKE CARE OF MY JEWELRY?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet interdum nibh, eget posuere nunc. Cras in ex eu ligula malesuada feugiat."
    },
    {
      question: "WHERE CAN I BUY YOUR JEWELRY?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet interdum nibh, eget posuere nunc. Cras in ex eu ligula malesuada feugiat."
    },
    {
      question: "IS YOUR JEWELRY WATERPROOF OR NON-TARNISH?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet interdum nibh, eget posuere nunc. Cras in ex eu ligula malesuada feugiat."
    },
    {
      question: "WHAT IS YOUR RETURN OR EXCHANGE POLICY?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet interdum nibh, eget posuere nunc. Cras in ex eu ligula malesuada feugiat."
    }
  ];

  return (
    <Layout full>
      {/* Mobile FAQs */}
      <div className="block md:hidden min-h-screen flex flex-col">
        {/* model image */}
        <div
          className="w-full h-64 bg-cover bg-center mt-23.5"
          style={{
            backgroundImage: `url(${faqsBG1})`, 
            backgroundPosition: 'right center',
          }}
        ></div>

        {/* right content */}
        <div className="flex flex-col items-center justify-center px-6 py-8">
          <div className="text-center text-[#FFF7DC] mb-3">
            <h1 className="faq-title-mobile bebas">
              REBELS' FAQS
            </h1>
            <p className="faq-subtitle-mobile avant">
              Got questions? We've got answers to help you shop with confidence.
            </p>
          </div>

          <div className="space-y-8 w-full max-w-sm mx-auto mt-0.6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-box ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center w-full text-left">
                  <h3 className="text-lg avant-demi tracking-wide text-white">
                    {faq.question}
                  </h3>
                  <img
                    src={dropdownIcon}
                    alt="Dropdown Icon"
                    className={activeIndex === index ? 'rotate-180' : ''}
                  />
                </div>
                {activeIndex === index && (
                  <p className="text-sm avant-book text-white">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop FAQs */}
      <div className="hidden md:flex flex-col min-h-screen">
        <div className="flex flex-1 mt-23.5 h-full">
          {/* model image */}
          <div
            className="w-1/2 bg-cover bg-center"
            style={{
              backgroundImage: `url(${faqsBG})`,
              minHeight: 'calc(100vh - 6rem)', // Full viewport height minus header
            }}
          ></div>

          {/* right content */}
          <div className="w-1/2 text-[#FFF7DC] px-8 py-25">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="faq-title bebas">
                REBELS' FAQS
              </h1>
              <p className="faq-subtitle avant">
                Got questions? We've got answers to help you shop with confidence.
              </p>
              <div className="space-y-8">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`faq-box ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex justify-between items-center w-full text-left">
                      <h3 className="text-lg md:text-xl avant-demi tracking-wide">
                        {faq.question}
                      </h3>
                      <img
                        src={dropdownIcon}
                        alt="Dropdown Icon"
                        className={activeIndex === index ? 'rotate-180' : ''}
                      />
                    </div>
                    {activeIndex === index && (
                      <p className="text-sm md:text-base avant-book">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQs;