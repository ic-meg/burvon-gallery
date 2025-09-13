import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import {
  NextFacts,
  PrevFacts,
  SizeGuideHero,
  SizeGuideHeroWebp,
  SizeGuideVid,
  SizeGuideVidWebm,
  WhiteLogo, 
} from "../../assets/index.js";

const ringSizes = [
  {
    size: 3,
    diameter: "1.41",
    diameterMm: (1.41 * 25.4).toFixed(2),
    circumferenceIn: "4.43",
    circumferenceMm: "44.2",
  },
  {
    size: 4,
    diameter: "1.46",
    diameterMm: (1.46 * 25.4).toFixed(2),
    circumferenceIn: "4.58",
    circumferenceMm: "46.1",
  },
  {
    size: 5,
    diameter: "1.57",
    diameterMm: (1.57 * 25.4).toFixed(2),
    circumferenceIn: "4.92",
    circumferenceMm: "49.32",
  },
  {
    size: 6,
    diameter: "1.65",
    diameterMm: (1.65 * 25.4).toFixed(2),
    circumferenceIn: "5.16",
    circumferenceMm: "51.9",
  },
  {
    size: 7,
    diameter: "1.72",
    diameterMm: (1.72 * 25.4).toFixed(2),
    circumferenceIn: "5.4",
    circumferenceMm: "54.4",
  },
  {
    size: 8,
    diameter: "1.81",
    diameterMm: (1.81 * 25.4).toFixed(2),
    circumferenceIn: "5.7",
    circumferenceMm: "57",
  },
  {
    size: 9,
    diameter: "1.89",
    diameterMm: (1.89 * 25.4).toFixed(2),
    circumferenceIn: "5.95",
    circumferenceMm: "59.6",
  },
];

const facts = [
  "Measure your fingers at the end of the day when they're at their largest.",
  "Cold weather can shrink your fingers so make sure they're warm.",
  "Light alcohol and salt can make your fingers swell, so refrain from measuring them after cocktails and appetizers.",
];

const SizeGuide = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handlers for Did You Know carousel navigation
  const prevFact = () =>
    setFactIndex((prev) => (prev === 0 ? facts.length - 1 : prev - 1));
  const nextFact = () =>
    setFactIndex((prev) => (prev === facts.length - 1 ? 0 : prev + 1));

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] w-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] flex items-center justify-center">
        <picture className="absolute w-full h-full z-0">
          <source srcSet={SizeGuideHeroWebp} type="image/webp" />
          <img
            src={SizeGuideHero}
            alt="Burvon rings hero background"
            className="w-full h-full object-cover object-center z-0"
            draggable={false}
          />
        </picture>
        {/* Bottom shadow overlay */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

        {/* Text container: bottom-left on desktop, centered on mobile */}
        <div
          className={`absolute z-20 px-4 max-w-xs ${
            isMobile
              ? "inset-0 flex flex-col items-center justify-center text-center mx-auto left-1/2 transform -translate-x-1/2"
              : "bottom-12 left-12 flex flex-col items-start text-left"
          }`}
        >
          <h1 className="text-[#fff7dc] font-bold bebas text-5xl md:text-9xl whitespace-nowrap">
            Size Guide
          </h1>
          <p className="text-[#fff7dc] text-xl mt-2 avant whitespace-nowrap">
            Find the perfect fit for you.
          </p>
        </div>
      </section>

      {/* Measure Your Finger Section */}
      <section className="relative flex flex-col md:flex-row h-auto md:h-[600px] w-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] gap-0 bg-[#1F1F21]">
        {/* Text hidden on mobile */}
        <div
          className="flex-1 hidden md:flex flex-col justify-center items-center text-center px-6 sm:px-12 lg:px-24"
          style={{ color: "#fff7dc" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-8 bebas -ml-6 md:-ml-20">
            Measure Your Finger
          </h2>
          <div className="space-y-6 sm:space-y-8 avant w-full max-w-md">
            {/* Steps */}
            <div className="flex items-center">
              <span
                className="flex justify-center items-center w-12 h-12 text-4xl sm:text-5xl font-bold bebas"
                style={{ color: "#fff7dc" }}
              >
                1
              </span>
              <span className="text-base sm:text-lg leading-relaxed text-left flex-1">
                Wrap a strip of paper around your finger.
              </span>
            </div>
            <div className="flex items-center">
              <span
                className="flex justify-center items-center w-12 h-12 text-4xl sm:text-5xl font-bold bebas"
                style={{ color: "#fff7dc" }}
              >
                2
              </span>
              <span className="text-base sm:text-lg leading-relaxed text-left flex-1">
                Mark the point where the ring closes.
              </span>
            </div>
            <div className="flex items-center">
              <span
                className="flex justify-center items-center w-12 h-12 text-4xl sm:text-5xl font-bold bebas"
                style={{ color: "#fff7dc" }}
              >
                3
              </span>
              <span className="text-base sm:text-lg leading-relaxed text-left flex-1">
                Measure the length of the paper against the ruler.
              </span>
            </div>
          </div>
        </div>
        {/* Video Always Visible */}
        <div className="flex-1 flex items-stretch justify-end">
          <video
            controls
            autoPlay={!isMobile}
            loop
            muted
            playsInline
            webkit-playsinline="true"
            className="h-full max-w-[450px] w-full object-cover object-right rounded-none"
          >
            <source src={SizeGuideVidWebm} type="video/webm" />
            <source src={SizeGuideVid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Ring Size Table for Desktop */}
      {!isMobile && (
        <section className="relative w-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] bg-[#323232] py-10 pt-2">
          <div className="max-w-3xl mx-auto flex flex-col items-center mb-4">
            {/* Logo centered on top */}
            <img
              src={WhiteLogo}
              alt="Burvon Logo"
              className="w-24 h-auto mb-[-20px]"
            />
            {/* Title centered below logo */}
            <h2 className="text-4xl bebas font-semibold text-[#fff7dc] text-center tracking-wide mb-1">
              RING SIZE GUIDE
            </h2>
          </div>
          {/* Table centered and styled */}
          <div className="max-w-3xl mx-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#323232]">
                  <th className="py-3 px-4 text-center text-[#fff7dc] bebas tracking-wide uppercase">
                    Ring <br />
                    Size
                  </th>
                  <th className="py-3 px-4 text-center text-[#fff7dc] bebas tracking-wide uppercase">
                    Diameter
                    <br /> (mm)
                  </th>
                  <th className="py-3 px-4 text-center text-[#fff7dc] bebas tracking-wide uppercase">
                    Diameter
                    <br /> (inch)
                  </th>
                  <th className="py-3 px-4 text-center text-[#fff7dc] bebas tracking-wide uppercase">
                    Circumference
                    <br /> (mm)
                  </th>
                  <th className="py-3 px-4 text-center text-[#fff7dc] bebas tracking-wide uppercase">
                    Circumference
                    <br /> (inch)
                  </th>
                </tr>
              </thead>
              <tbody>
                {ringSizes.map(
                  (
                    {
                      size,
                      diameterMm,
                      diameter,
                      circumferenceMm,
                      circumferenceIn,
                    },
                    index
                  ) => (
                    <tr
                      key={index}
                      className={
                        [1, 3, 5].includes(index)
                          ? "bg-[#323232] text-[#fff7dc] text-center avant"
                          : "bg-[#fff7dc] text-center metallic-text avant"
                      }
                    >
                      <td className="py-1 px-3">{size}</td>
                      <td className="py-1 px-3">{diameterMm}</td>
                      <td className="py-1 px-3">{diameter}</td>
                      <td className="py-1 px-3">{circumferenceMm}</td>
                      <td className="py-1 px-3">{circumferenceIn}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Did You Know Section */}
      {isMobile ? (
        // Mobile version: Carousel with one fact at a time
        <section className="bg-none py-10 px-4 flex flex-col items-center min-h-[300px]">
          <h2 className="text-3xl bebas font-bold text-[#fff7dc] text-left w-full max-w-xs mb-10">
            DID YOU KNOW?
          </h2>
          <div className="w-20 h-1.5 bg-[#fff7dc] mb-4" />
          <div className="flex flex-col items-center justify-center w-full max-w-xs min-h-[80px]">
            <p className="text-[#fff7dc] avant text-center text-lg leading-snug">
              {facts[factIndex]}
            </p>
          </div>
          {/* Pagination & Navigation */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={() =>
                setFactIndex((prev) =>
                  prev === 0 ? facts.length - 1 : prev - 1
                )
              }
              aria-label="Previous"
              className="p-2"
            >
              <img src={PrevFacts} alt="Previous" className="h-6 w-6" />
            </button>
            {/* Circles - pagination dots */}
            <div className="flex items-center gap-2">
              {facts.map((_, idx) => (
                <span
                  key={idx}
                  className={
                    factIndex === idx
                      ? "w-3 h-3 rounded-full border-2 border-[#fff7dc] bg-[#fff7dc]"
                      : "w-3 h-3 rounded-full border-2 border-[#fff7dc] bg-transparent"
                  }
                />
              ))}
            </div>
            <button
              onClick={() =>
                setFactIndex((prev) =>
                  prev === facts.length - 1 ? 0 : prev + 1
                )
              }
              aria-label="Next"
              className="p-2"
            >
              <img src={NextFacts} alt="Next" className="h-6 w-6" />
            </button>
          </div>
        </section>
      ) : (
        // Desktop version: Display all facts side by side
        <section className="py-20 w-full bg-none">
          <h2 className="text-5xl bebas font-bold text-[#fff7dc] text-left mb-10 ml-12">
            DID YOU KNOW?
          </h2>
          <div className="flex justify-center items-start w-full gap-10">
            {facts.map((fact, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                {/* Cream line */}
                <div className="h-0.75 w-16 bg-[#fff7dc] rounded-none mb-6" />
                {/* Fact paragraph with constrained width */}
                <p className="text-[#fff7dc] avant text-center text-lg leading-snug max-w-xs">
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default SizeGuide;
