import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import {
  NextIcon,
  PrevIcon,
  SizeGuideHero,
  SizeGuideVid
} from "../../assets/index.js";

const ringSizes = [
  { size: 3, diameter: "1.41", circumferenceIn: "4.43", circumferenceMm: "44.2" },
  { size: 4, diameter: "1.46", circumferenceIn: "4.58", circumferenceMm: "46.1" },
  { size: 5, diameter: "1.57", circumferenceIn: "4.92", circumferenceMm: "49.32" },
  { size: 6, diameter: "1.65", circumferenceIn: "5.16", circumferenceMm: "51.9" },
  { size: 7, diameter: "1.72", circumferenceIn: "5.4", circumferenceMm: "54.4" },
  { size: 8, diameter: "1.81", circumferenceIn: "5.7", circumferenceMm: "57" },
  { size: 9, diameter: "1.89", circumferenceIn: "5.95", circumferenceMm: "59.6" },
];

const facts = [
  "Measure your fingers at the end of the day when they're at their largest.",
  "Cold weather can shrink your fingers so make sure they're warm.",
  "Light alcohol and salt can make your fingers swell, so refrain from measuring them after cocktails and appetizers."
];

const SizeGuide = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] w-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] flex items-center justify-center">
        <img
          src={SizeGuideHero}
          alt="Burvon rings hero background"
          className="absolute w-full h-full object-cover object-center z-0"
          draggable={false}
        />
        {/* Bottom shadow overlay */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

        {/* Text container: bottom-left on desktop, centered on mobile */}
        <div className={`absolute z-20 px-4 max-w-xs ${
          isMobile
            ? 'inset-0 flex flex-col items-center justify-center text-center mx-auto left-1/2 transform -translate-x-1/2'
            : 'bottom-12 left-12 flex flex-col items-start text-left'
        }`}>
          <h1 className="text-white font-bold bebas text-5xl md:text-9xl">Size Guide</h1>
          <p className="text-white text-xl mt-2 avant">Find the perfect fit for you.</p>
        </div>
      </section>

        <section className="relative flex flex-row h-[600px] w-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] gap-0 bg-[#1F1F21]">
          <div className="flex-1 flex flex-col justify-center pl-60" style={{ color: '#fff7dc' }}>
          <h2 className="text-5xl font-semibold mb-8 bebas">Measure Your Finger</h2>
          <div className="space-y-8 avant ml-1">
            {/* Steps with numbers */}
            <div className="flex items-center">
              <span className="text-5xl font-bold bebas mr-3 self-center" style={{ color: '#fff7dc' }}>1</span>
              <span className="text-lg leading-relaxed">Wrap a strip of paper around your finger.</span>
            </div>
            <div className="flex items-center">
              <span className="text-5xl font-bold bebas mr-3 self-center" style={{ color: '#fff7dc' }}>2</span>
              <span className="text-lg leading-relaxed">Mark the point where the ring closes.</span>
            </div>
            <div className="flex items-center">
              <span className="text-5xl font-bold bebas mr-3 self-center" style={{ color: '#fff7dc' }}>3</span>
              <span className="text-lg leading-relaxed">Measure the length of the paper against the ruler.</span>
            </div>
          </div>
        </div>
          <div className="flex-1 flex items-stretch justify-end">
            <video
              controls
              src={SizeGuideVid}
              className="h-full max-w-[450px] w-full object-cover object-right rounded-none"
            />
          </div>
        </section>






      {/* Ring Size Table for Desktop */}
      {!isMobile && (
        <section className="py-10 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Ring Size Guide</h2>
          <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden">
            <thead className="bg-gray-300 text-gray-800">
              <tr>
                <th className="py-3 px-4 text-left">Ring Size</th>
                <th className="py-3 px-4 text-left">Diameter (inches)</th>
                <th className="py-3 px-4 text-left">Circumference (inches)</th>
                <th className="py-3 px-4 text-left">Circumference (mm)</th>
              </tr>
            </thead>
            <tbody>
              {ringSizes.map(({ size, diameter, circumferenceIn, circumferenceMm }, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-4">{size}</td>
                  <td className="py-3 px-4">{diameter}</td>
                  <td className="py-3 px-4">{circumferenceIn}</td>
                  <td className="py-3 px-4">{circumferenceMm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Did You Know Section */}
      <section className={`py-14 px-6 max-w-5xl mx-auto ${isMobile ? 'text-center' : 'flex justify-between'}`}>
        <h2 className="text-xl font-bold mb-6 w-full">{isMobile ? "Did You Know?" : ""}</h2>
        {!isMobile ? (
          facts.map((fact, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-md w-1/3 text-left">
              <h3 className="font-semibold mb-2">Did You Know?</h3>
              <p>{fact}</p>
            </div>
          ))
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-50 p-6 rounded-md mb-6">
              <p>{facts[factIndex]}</p>
            </div>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() => setFactIndex(factIndex > 0 ? factIndex - 1 : facts.length - 1)}
                aria-label="Previous Fact"
                className="p-2"
              >
                <PrevIcon />
              </button>
              <div className="flex gap-2">
                {facts.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx === factIndex ? 'bg-black' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setFactIndex((factIndex + 1) % facts.length)}
                aria-label="Next Fact"
                className="p-2"
              >
                <NextIcon />
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default SizeGuide;
